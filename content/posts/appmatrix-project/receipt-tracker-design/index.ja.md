---
title: "ReceiptTracker 統一技術設計ドキュメント (プランA: ローカルオフラインエッジ側 OCR - 多言語 i18n 版)"
date: 2026-06-18T11:30:00+09:00
draft: true
tags: ["AppMatrix", "ReceiptTracker", "React Native", "OCR", "i18n"]
categories: ["エンジニアリング実践", "モバイルアーキテクチャ"]
description: "スマートレシートスキャン記帳および物価分類トラッカー (ReceiptTracker) の設計ドキュメント。エッジ側の画像前処理、両プラットフォームのネイティブ OCR エンジン統合、行配置クラスタリングアルゴリズム、およびローカル SQLite データベースの多言語/多通貨設計について詳細に検討します。"
---

この設計ドキュメントは、AppMatrix プラットフォーム下の **スマートレシートスキャン記帳および物価分類トラッカー (ReceiptTracker)** プロジェクトを対象としています。
このプロジェクトは、モバイル側で **プランA（完全エッジ側オフライン優先）** アーキテクチャを採用し、**中国語（簡体字/繁体字）、日本語、英語** の多言語 OCR 認識互換スキームおよびアプリケーション UI の国際化（i18n）を全面的にサポートしています。

---

## 1. 両プラットフォーム独立プロジェクトアーキテクチャ

`ReceiptTracker` プロジェクトはページのコアロジックと UI コンポーネントを共有し、両プラットフォームはネイティブ層で多言語 OCR および画像前処理の SDK ブリッジ構成を行っています：

```text
apps/
└── ReceiptTracker/
    ├── src/
    │   ├── android/             # Android ネイティブシェルプロジェクトと ML Kit ブリッジ
    │   │   ├── app/src/main/
    │   │   │   ├── java/com/appmatrix/receipttracker/OCRBridgeModule.kt   # 中日英動的 OCR をサポートするブリッジコード
    │   │   │   └── AndroidManifest.xml   # Camera 権限とハードウェア要件の宣言
    │   │   └── build.gradle             # ML Kit 中国語および日本語認識依存パッケージの導入
    │   └── ios/                 # iOS ネイティブシェルプロジェクトと Vision.framework ブリッジ
    │       ├── ReceiptTracker/
    │       │   ├── OCRBridgeModule.swift  # 中日英 Vision OCR をサポートするブリッジコード
    │       │   └── Info.plist            # NSCameraUsageDescription の宣言
    │       └── ReceiptTracker.xcodeproj
    └── shared/                  # 両プラットフォームで共有される React Native (Expo) ビジネスコード
        ├── src/
        │   ├── components/      # 共有 UI（Canvas トレンド折れ線グラフコンポーネントなど）
        │   ├── screens/         # 記帳履歴、スキャン照合、物価ダッシュボードの3大ページ
        │   └── utils/
        │       ├── alignLines.ts # Y 軸テキスト行クラスタリングコアアルゴリズム
        │       ├── database.ts   # 多通貨および言語フラグをサポートする SQLite ラッパー
        │       └── i18n.ts       # 軽量 UI 多言語国際化辞書
        └── package.json
```

---

## 2. エッジ側画像前処理の設計

レシートの印刷文字の薄さ、紙のしわ、傾きは、OCR の精度に多大な影響を与えます。システムは、画像を OCR エンジンに送る前に、ネイティブで高速化された前処理を実行する必要があります：

```text
[撮影した元の大きな画像] ──(Native C++/WebGL)──> [1. グレースケール化] ──> [2. コントラスト強調 (ストレッチ)] ──> [3. 2値化/ノイズ除去] ──> [一時的なクリーンな画像の生成]
```

### 2.1 前処理フロー
1.  **サイズ圧縮**：大きな画像による OOM を防ぎ、認識を高速化するために、まずカメラでキャプチャした画像をネイティブ層で比例縮小し、最大短辺を 1080px 以内に制限します。
2.  **グレースケール化 (Grayscale)**：画像のカラーチャネルを単一チャネルのグレースケール画像に縮小します。計算式：
    $$\text{Gray} = 0.299 \times R + 0.587 \times G + 0.114 \times B$$
3.  **コントラスト強調 (Contrast Stretching)**：印刷インクと淡色の紙の視覚的差異を強調し、文字のエッジのシャープネスを向上させます。
4.  **一時的な PNG 書き込み**：ネイティブ OCR エンジンに提供するために、サンドボックスのキャッシュディレクトリ (`CacheDirectory`) に一時的な軽量 PNG 形式のファイルを生成し、解析が完了したら直ちに削除します。

---

## 3. 両プラットフォーム独立ネイティブ OCR エンジンの統合

両プラットフォームは、巨大なローカルの Tesseract フォントライブラリパッケージを使用せず、システムに組み込まれた OCR エンジンを呼び出し、React Native Bridge を通じてフロントエンド JS に公開します：

### 3.1 iOS ネイティブ側の統合：`Vision.framework`
iOS 13 以降では、強力なオフラインの `Vision` 画像認識フレームワークが提供されています。Swift では、多言語配列を設定することで、中国語、日本語、英語の同時互換認識を実現します：

```swift
import Vision
import UIKit

@objc(OCRBridgeModule)
class OCRBridgeModule: NSObject {
    
    @objc
    func recognizeReceiptText(_ imagePath: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        // [画像読み込みロジック省略]
        
        let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])
        
        let request = VNRecognizeTextRequest { (request, error) in
            // [結果処理ロジック省略]
        }
        
        // Vision パラメータの設定 - 中日英互換認識を有効化
        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        // 重要な更新：簡体字中国語、繁体字中国語、日本語、英語をサポート
        request.recognitionLanguages = ["zh-Hans", "zh-Hant", "ja-JP", "en-US"] 
        
        do {
            try requestHandler.perform([request])
        } catch {
            reject("ERR_OCR_PERFORM", "OCR の実行に失敗しました", error)
        }
    }
}
```

### 3.2 Android ネイティブ側の統合：`ML Kit Text Recognition`
Android 側では、中国語、日本語、英語の文字認識は、それぞれ異なる ML Kit 基盤依存パッケージと認識器によって提供されます。3 言語の互換性を実現するため、ブリッジモジュールは、クライアントが現在選択している言語タイプに基づいて、対応する言語認識クライアントを動的に初期化することをサポートしています：

*   **依存関係の設定 (`android/app/build.gradle`)**：
    ```groovy
    dependencies {
        // ML Kit 中国語認識依存パッケージの導入
        implementation 'com.google.mlkit:text-recognition-chinese:16.0.0'
        // ML Kit 日本語認識依存パッケージの導入
        implementation 'com.google.mlkit:text-recognition-japanese:16.0.0'
    }
    ```

*   **ブリッジロジック (`OCRBridgeModule.kt`)**：
    ```kotlin
    // 重要な更新：フロントエンドから渡されたターゲット言語タイプに基づいて、対応するオフライン文字認識クライアントを動的にマッチングします
    val recognizer: TextRecognizer = when (targetLang.lowercase()) {
        "ja" -> {
            // 日本語オフライン文字認識クライアント
            TextRecognition.getClient(JapaneseTextRecognizerOptions.Builder().build())
        }
        "zh" -> {
            // 中国語オフライン文字認識クライアント
            TextRecognition.getClient(ChineseTextRecognizerOptions.Builder().build())
        }
        else -> {
            // デフォルトの英語/ラテン語オフライン文字認識クライアント
            TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
        }
    }
    ```

---

## 4. レシートテキスト構造化行配置アルゴリズム (Y-Axis Align Clustering)

オフラインエッジ側では、OCR エンジンが出力するのは、境界ボックス (Bounding Box) を伴う離散的な文字列のセットにすぎません。レイアウトの都合上、左側の製品名 `"特選牛乳 1L"` と右側の価格 `"248"` が、画像内で完全に異なる認識ブロックに含まれる場合があり、アルゴリズムを通じて横方向の「行配置」関係を復元する必要があります。

### 4.1 コアとなる行配置クラスタリングアルゴリズムの疑似コード
```typescript
/**
 * Y 軸位置に基づくガウス/区間クラスタリングアルゴリズムにより、物理的なテキスト行を復元します
 */
export function alignOCRBlocksToLines(blocks: OCRBlock[]): string[][] {
  // 1. Y 軸座標に従って上から下に並べ替え
  // 2. 既存の行を反復処理し、テキストブロックが Y 軸の高さの許容範囲 (行の高さの 60%) 内にあるかどうかを確認
  // 3. どの既存の行とも一致しない場合は、新しいテキスト行が開始されたことを意味する
  // 4. 各行内のテキストブロックを X 軸に従って左から右に並べ替え、テキストの順序を復元して連結
}
```

### 4.2 正規表現マッチングとフィールド抽出 (i18n 互換)
連結されて得られた純粋なテキストの各行（例えば、日本語の `["特選牛乳 1L", "x1", "248"]` や英語の `["Organic Milk", "$6.99"]`）について、マッチングパターンは異なります：
*   **価格のローカライズ (多通貨互換)**：
    正規表現 `/(\d+(?:\.\d{2})?)/` を使用して、最後から最前部に向かって検索します。
    -   現在の言語が日本語 (JA) の場合、価格は通常整数であり、`parseInt()` で解析され、小数点は除外されます。
    -   中国語および英語では、`parseFloat().toFixed(2)` で解析されます。
*   **数量のローカライズ**：数字、または `x`/`*` などのプレフィックスが付いた文字にマッチングします。

---

## 5. ローカル SQLite データベースの多言語/多通貨設計

多言語の記帳をサポートするために、ローカルデータベースは、メインの `receipts` テーブルと製品テーブルに、言語フラグ (`lang`) と通貨フラグ (`currency`) フィールドを新たに追加しました：

### 5.1 データベース Schema の定義
```sql
-- 1. レシートメインテーブル（多言語と通貨フィールドで拡張）
CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    merchant TEXT NOT NULL,
    date TEXT NOT NULL,
    total_amount REAL NOT NULL,
    lang TEXT NOT NULL,         -- 'zh', 'ja', 'en'
    currency TEXT NOT NULL      -- 'CNY', 'JPY', 'USD'
);

-- 3. 製品統合ビュー（物価分類の追跡用）
CREATE TABLE IF NOT EXISTS products (
    product_name TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    first_detected_date TEXT NOT NULL,
    lang TEXT NOT NULL          -- 多言語が混在するのを防ぐため、この製品がどの言語カテゴリに属しているかを示します
);
```

---

## 6. システムの権限とセキュリティコンプライアンス

モバイルアプリストア（Apple App Store / Google Play）でのアプリの審査をスムーズに通過させるため、ネイティブのプロファイルにプライバシー宣言を設定する必要があります。

---

## 7. スマートフォンのシステムバージョンとハードウェア構成の要件

プラン A では **完全オフラインのエッジ側 OCR 認識とローカル画像処理** を採用しているため、アプリにはスマートフォンに対する明確な互換性要件があります：

### 7.1 iOS プラットフォームの要件
*   **システムバージョン**：最小 **iOS 13.0** をサポート、**iOS 15.0+** を推奨（Vision OCR の日本語/中国語に対する認識精度は iOS 15 で大幅に最適化されています）。
*   **プロセッサ (CPU/NPU)**：Apple **A12 Bionic 以上** を推奨（iPhone XS 以降など、NPU Neural Engine を含むもの）。

### 7.2 Android プラットフォームの要件
*   **システムバージョン**：ローカル SQLite サンドボックスの並行効率を確保するため、最小 **Android 8.0 (API 26)** をサポート。
*   **メモリスペース (RAM)**：最小 **3.0 GB**、6.0 GB 以上を推奨。
*   **サービス依存関係 (GMS)**：
    -   *GMS デバイス*：Thin/Shared モードを採用し、インストールパッケージのサイズ増加は約 **1.5MB** のみ。
    -   *非 GMS デバイス*：パッケージ化時に Bundled モード（中国語+日本語 OCR 動的モデルを内蔵）に切り替え、最終的な APK のサイズは約 **12MB** 増加。

---

## 8. インターフェースとデータの国際化 (i18n) 設計

アプリは、共有されたフロントエンドロジックで `react-i18next` または軽量のグローバル言語管理クラスを利用し、`app_lang` の状態を読み取ることで、中/日/英の 3 言語を適応的に切り替えます。

### 8.1 Canvas トレンド折れ線グラフの国際化レンダリング仕様
-   **日本円 (JPY)**：Y 軸のスケールおよび点座標の価格ラベルは、`Math.round(price)` を通じて小数点のない整数に変換されます。
-   **人民元 / 米ドル (CNY / USD)**：`price.toFixed(2)` を通じて、小数点以下 2 桁を含む金額ラベルとしてフォーマットされます。

---

## 9. 画面の向きへの適応マトリックス

さまざまなシナリオでの最適な撮影、認識、チャート閲覧体験を保証するため、`ReceiptTracker` はページごとに差別化された画面の回転戦略とレイアウト再配置仕様を策定しました。

| ページ名 | デフォルトの向き | 回転戦略 | 核となる理由 |
|---|---|---|---|
| **記帳履歴ページ (History)** | 縦画面 (Portrait) | **縦画面にロック (Portrait Only)** | 純粋なリスト表示と履歴カードのフロー。縦画面にロックすることで、片手で保持したまま迅速にスクロールして確認しやすくなります。 |
| **レシートスキャンページ (Scanner)** | 縦画面 (Portrait) | **双方向適応 (Adaptive)** | 幅が広くて短いレシート、または長いレシートは、解像度と OCR 認識度を向上させるために、横画面でカメラを近づけて撮影する必要があります。横画面では、操作バーが右側に移動して握りやすくなります。 |
| **トレンド分析ページ (Analytics)** | 縦画面 (Portrait) | **双方向適応 (Adaptive)** | Canvas の物価履歴トレンド折れ線グラフを横画面の広い幅で表示すると、横軸のタイムラインが長くなり、点と点の間隔が広がるため、より正確な価格の変曲点と予測曲線を表示できます。 |
