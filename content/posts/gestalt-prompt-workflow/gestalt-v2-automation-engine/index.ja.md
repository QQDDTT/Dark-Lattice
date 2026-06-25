---
title: "05. Gestalt V2.0 オートメーションエンジンとツールチェーン"
date: 2026-06-25

> [!NOTE]
> この記事の本文は現在翻訳中です。以下は原文です。

---
# 05. Gestalt V2.0 自动化引擎与工具链

**更新日期**: 2026-06-25  
**状态**: Active  

在 V2.0 升级中，Gestalt 技能正式从“静态认知库”升级为了“具备自动执行和校验能力的工业级引擎”。所有的执行层脚本均采用最纯粹的 Bash 编写，以确保在任何 Unix 宿主环境中均能以零依赖极速运行。

本篇文档将详细介绍新引入的三大自动化组件。

---

## 1. 动态资产检索器 (Asset Retriever)

**脚本路径**: `scripts/asset_retriever.sh`

### 解决痛点
彻底解决了由于全量加载 Markdown 案例导致大语言模型产生上下文窗口膨胀和“注意力遗忘”的问题。

### 工作机制
Agent 不再使用 `cat` 或 `view_file` 读取整个案例文件，而是调用该 Shell 脚本并传入标签关键词（如 `vanguard`）。
脚本会通过 `find` 和 `grep` 定位目标文件，并使用 `awk` 精确提取文件中 `## 3. 提取的设计提示词模板` 下的纯正 Markdown 代码块 (Prompt Snippet)。

**工作流接入点**: 已集成至 `.agents/workflows/divergent_convergent_workflow.md`。

---

## 2. 闭环质量审计器 (Gestalt Linter)

**脚本路径**: `scripts/gestalt_linter.sh`

### 解决痛点
终结了 LLM 的“盲发机制”。以往模型即使答应遵循五维约束，也经常在生成的代码中偷偷写死颜色或使用耗费性能的重排属性。

### 工作机制
作为一个独立的静态检查工具，它能够扫描生成的 `.html` 或 `.css` 文件：
- **COE 原则阻断**：利用 `grep -E` 扫描 `transition` 属性中是否包含引起重排（Reflow）的非法键（如 `width`, `height`, `margin`）。一旦发现，抛出致命错误。
- **OCC 原则阻断**：扫描代码中未被抽象为 CSS 变量的硬编码 Hex 颜色。超过阈值即抛出异常。

**工作流接入点**: 已集成至全新的 `.agents/workflows/verify_design_workflow.md`。一旦发生违规，Agent 会强制将错误日志丢回给 LLM 要求其修改。

---

## 3. 底层脚手架引擎 (Project Scaffold)

**脚本路径**: `scripts/init_project.sh`

### 解决痛点
消除了与大语言模型沟通和初始化项目结构的繁琐对话。

### 工作机制
- 瞬间拉起标准的 Gestalt 物理目录结构（如 `src/assets/css/`）。
- **智能编译**：脚本会自动读取 `templates/design_prompt_template.md`，使用正则表达式剥离出五维约束中的 CSS 变量，并自动化构建出属于该项目的独立 `tokens.css` 文件。

**工作流接入点**: 已集成至全新的 `.agents/workflows/init_project_workflow.md`。
