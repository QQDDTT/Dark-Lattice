---
title: "05. Gestalt V2.0 オートメーションエンジンとツールチェーン"
date: 2026-06-25
draft: false
description: "Gestalt V2.0 で新たに導入された 3 つのコア自動化コンポーネント（Asset Retriever、Gestalt Linter、Project Scaffold）のアーキテクチャと仕組みを詳解します。"
tags: ["gestalt-prompt-workflow", "agent-skill", "Automation", "Linter"]
---

V2.0 アップグレードにおいて、Gestalt スキルは「静的な知識リポジトリ」から「自動実行および検証機能を備えた産業グレードのエンジン」へと正式に進化しました。すべての実行レイヤースクリプトは純粋な Bash で記述されており、外部依存ゼロであらゆるホスト環境で高速に動作します。

本稿では、新たに導入された 3 つの自動化コンポーネントについて詳しく解説します。

---

## 1. 動的アセット検索器 (`Asset Retriever`)

**スクリプトパス**: `scripts/asset_retriever.sh`

### 解決した課題
Markdown ケースファイル全体を読み込むことで発生していた LLM のコンテキストウィンドウ肥大化と「注意力の希釈（Lost in the Middle）」を根本から解消しました。

### 動作メカニズム
Agent は `cat` や `view_file` でケース全文を読み込む代わりに、タグキーワード（例：`vanguard`）を渡してこのシェルスクリプトを呼び出します。スクリプトは `find` と `grep` で対象ファイルを特定し、`awk` を用いて `## 3. 抽出されたデザインプロンプトテンプレート` 配下の純粋な Markdown コードブロック（Prompt Snippet）のみを正確に抽出します。

**ワークフロー統合先**: `.agents/workflows/divergent_convergent_workflow.md` に統合済み。

---

## 2. クローズドループ品質監査器 (`Gestalt Linter`)

**スクリプトパス**: `scripts/gestalt_linter.sh`

### 解決した課題
LLM の「ブラインド生成」に終止符を打ちました。従来は 5 次元制約の遵守を指示しても、生成された CSS 内にハードコードされた Hex カラーやリフローを誘発するプロパティが混入する問題がありました。

### 動作メカニズム
独立した静的解析ツールとして、生成された `.html` や `.css` ファイルをスキャンします：
- **COE 原則ブロック**：`grep -E` を用いて `transition` プロパティ内にリフロー（Reflow）を引き起こす禁止属性（`width`, `height`, `margin` など）が含まれていないか検査し、検出時は致命的エラーを返します。
- **OCC 原則ブロック**：CSS 変数として抽象化されていないハードコードされた Hex カラーを検出し、閾値を超えた場合に例外をスローします。

**ワークフロー統合先**: `.agents/workflows/verify_design_workflow.md` に統合済み。違反発生時、Agent はエラーログを強制的に LLM に差し戻して修正を要求します。

---

## 3. 基盤スキャフォールドエンジン (`Project Scaffold`)

**スクリプトパス**: `scripts/init_project.sh`

### 解決した課題
プロジェクト構造を初期化する際の煩雑な対話オーバーヘッドを排除しました。

### 動作メカニズム
- 標準的な Gestalt 物理ディレクトリ構造（`src/assets/css/` など）を瞬時に立ち上げます。
- **インテリジェント・コンパイル**：`templates/design_prompt_template.md` を自動的に読み取り、正規表現で 5 次元制約の CSS 変数を抽出してプロジェクト専用の `tokens.css` を自動生成します。

**ワークフロー統合先**: `.agents/workflows/init_project_workflow.md` に統合済み。
