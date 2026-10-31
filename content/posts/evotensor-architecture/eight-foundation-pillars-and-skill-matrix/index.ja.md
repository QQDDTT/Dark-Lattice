---
title: "8大基盤プロジェクトとグローバルSkillマトリックス：Harness-Forge、Aegis-SecからChroma-Muse、Momus反脆弱性監査まで"
date: 2026-10-30
description: "Evotensorワークスペースを支える8大基盤プロジェクト（Foundation Pillars）の設計思想とグローバルSkill配信機構を徹底解説：「ホストグローバル単一配信」によるプロジェクト間ルール漂流の根絶、エージェントハーネス工学（Harness-Forge）、ゼロトラスト全層セキュリティ（Aegis-Sec）、プロシージャル美術・音響設計（Chroma-Muse & Optic-Resonance）、およびレッドチーム逆向き監査（Momus-Audit）の統合。"
draft: false
tags: ["Harness-Forge", "Aegis-Sec", "Chroma-Muse", "Momus-Audit", "Optic-Resonance", "Chaos-Matrix", "Skillマトリックス"]
categories: ["システムアーキテクチャ", "エージェント工学", "セキュリティと監査"]
---

# 8大基盤プロジェクトとグローバルSkillマトリックス：Harness-Forge、Aegis-SecからChroma-Muse、Momus反脆弱性監査まで

> **所属カテゴリ**：基礎型プロジェクト群（Foundation Pillars・全8中枢）  
> **中核パラダイム**：脱 `.ops` 純粋性ガバナンス、単一権威ソース（Single Canonical Source）、ホストグローバル単一配信（`~/.gemini/config/skills/`）、およびSHA256完全一致検証

---

## 1. 「ブロードキャストコピー汚染」からの決別：基礎プロジェクトの純粋性革命

マルチプロジェクト開発の初期段階では、共通スキル（UIデザイントークンや数理モデル監査など）を全プロジェクトで利用可能にするため、スクリプトで20以上の子プロジェクトの `.agents/skills/` に `SKILL.md` を一括コピーするアンチパターンが存在していました。しかし、この方法は即座に深刻な**バージョンドリフト（Version Drift）**と名前空間の汚染を引き起こしました。

私たちは基礎プロジェクト改造規約（`SPEC-16`）によって以下の4大鉄則を確立しました：
1. **完全な脱 `.ops` 化**：基礎プロジェクトは理論文献、設計規約、およびグローバル `SKILL` のみを産出し、クラウドサービスを持たないため `.ops` ディレクトリを完全撤廃。
2. **単一権威ソース（Single Canonical Source）**：各基礎プロジェクトの `.agents/skills/` には自身が権威を持つスキルのみを配置し、外部スキルの混入を厳禁とする。
3. **ホストグローバル単一配信**：`scripts/Install-GlobalSkill.ps1` を通じてホストのグローバル設定ディレクトリ（`C:\Users\Nick\.gemini\config\skills\`）へ一元配信し、全23プロジェクトはローカルコピーを持たずにグローバル設定から透過的に継承する。
4. **SHA256自動適合ゲート**：`Evopoiesis/scripts/validate-skills.ps1` により、名前空間プレフィックス、Frontmatterの帰属宣言、グローバルコピーとのSHA256ハッシュ一致、および `/Action` ワークフロー連携を自動監査する。

---

## 2. 8大基盤プロジェクト（Foundation Pillars）全体マップ

新たに孵化・稼働した **`Harness-Forge`**、**`Aegis-Sec`**、**`Chroma-Muse`** の3大中枢を加え、ワークスペースは以下の8大基礎ピラーによって統治されています：

| 基礎プロジェクト | グローバル `Skill` | `/Action` コマンド | 中核責務と知識資産規模 |
| :--- | :--- | :--- | :--- |
| **Evopoiesis** | `evopoiesis-create-project`<br>`evopoiesis-update-project` | `/create-project`<br>`/update-project` | 全域17規約の策定、新規プロジェクト7段階孵化および既存プロジェクト非侵襲進化エンジン |
| **Aether-Ops** | `aether-ops` | `/orchestrate-ops` | GCP Cloud Build / Spot一時的計算力オーケストレーション、`Destroy-on-Exit` ゼロアイドル課金防衛線 |
| **Harness-Forge** | `harness-forge` | `/harness-forge` | 2024–2026年のエージェントハーネス工学権威文献 **38編** を収録；5種のハードウェア環境（クラウド/ノートPC/スマホ/テーブルトップ/MCU）に応じた設計書改造 |
| **Chaos-Matrix** | `chaos-matrix` | `/audit-chaos-matrix` | 非定常意思決定ダイナミクス、マルチエージェントゲーム理論（MARL）、深層オプティマイザ設計監査 |
| **Optic-Resonance** | `optic-resonance-ui` | `/design-ui` | オブシディアン暗色UI設計体系、5:3:1配色トークン、**Web Audio合成打鍵音・適応型BGM音響工学ライブラリ** |
| **Chroma-Muse** | `chroma-muse-art` | `/chroma-muse-art` | 全域美術スタイル図譜、脱ホモジナイズ視覚造形、高精度SVGリグおよびShaderプロシージャル材質生成 |
| **Aegis-Sec** | `aegis-sec` | `/aegis-sec` | **5大セキュリティ領域・35編の権威文献精髄**（OWASP Top 10、ゼロトラスト暗号学、クラウド/コンテナ、SLSAサプライチェーン、LLMプロンプト注入防御） |
| **Momus-Audit** | `momus-audit` | `/momus-audit` | 悪魔の代弁者（Momus）による逆向きレッドチーム監査、要件・コード矛盾摘出、Chrome DevTools実機E2E検証 |

---

## 3. 新設3大ピラーの深層アーキテクチャ

### 3.1 Harness-Forge：確率的LLMを制御するハードウェア適応型「馬具（ハーネス）」工学
`Harness-Forge` は、プロンプトを整える **Context Engineering** と、決定論的なサンドボックス・センサーフィードバック・自己修復回路でモデルを包囲する **Harness Engineering** を明確に区別します。さらに、GCP Spotクラスタ（`Quant-FMP`）、ローカルDockerサンドボックス（`Evo-Studio`）、そしてヒープ断片化ゼロが求められるESP32マイコン（`Nex-Micro`）まで、5つのハードウェア特性に最適化したハーネスアーキテクチャを設計書へ注入します。

### 3.2 Aegis-Sec：コード・クラウド・AIエージェントを貫く多層防御
`Aegis-Sec` は、アプリケーション脆弱性、Ed25519チャレンジ認証、GCP最小権限IAM、SLSAビルド証明、そしてLLMの間接プロンプトインジェクションおよび過剰権限（Excessive Agency）防御を網羅した全層セキュリティ監査を提供します。

### 3.3 Chroma-Muse × Optic-Resonance：視覚と聴覚のプロシージャル共鳴
AI生成UIにありがちな「画一的なサイバーパンク風テンプレート」を打破するため、`Chroma-Muse` はネオブルータリズム・スイスグリッドや多層切り絵シルエット、多関節SVGリグなどの多様な美術譜系を展開します。同時に `Optic-Resonance` は **Web Audio APIによるリアルタイム音響合成** を統合し、外部音声ファイルなしでメカニカルな打鍵音と状態連動型BGMを実現しています。

