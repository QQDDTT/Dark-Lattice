---
title: "Gestalt Prompt Workflow 統合ガイド：AgentにAdvanced Aestheticエンジンを搭載する"
date: "2026-06-23T09:30:00+09:00"
description: "Gestalt Prompt Workflowの完全利用ガイド。AGY AgentへのSkill導入から日常的な開発対話例、5次元指標の用語チートシートまで網羅。"
tags: ["gestalt-prompt-workflow", "agent-skill", "使用指南"]
draft: true

> [!NOTE]
> この記事の本文は現在翻訳中です。以下は原文です。

---

在将 `gestalt-prompt-workflow` 这个 Skill 真正跑通之后，我发现最频繁被问到的问题不是"它能做什么"，而是"**我该怎么把它接进我自己的项目里？**"

这篇文章就是为了回答这个问题。它是一份实战向的接入指南，附带日常开发对话示例，以及一张方便随时查阅的五维指标术语速查表。

## 第一步：在你的 Agent 配置中引入 Skill

`gestalt-prompt-workflow` 是一个完全符合 Google Antigravity (AGY) SDK 标准封装的 Agent Skill。接入方式极其简单——在初始化你的 Agent 时，将本项目的本地绝对路径加入 `skills_paths` 即可：

```python
from google.antigravity import Agent, LocalAgentConfig

# 将 gestalt-prompt-workflow 的本地路径注入 skills_paths
config = LocalAgentConfig(
    api_key="YOUR_API_KEY",
    model="gemini-1.5-pro-latest",
    skills_paths=["/home/nick/workspaces/gestalt-prompt-workflow"]
)

async with Agent(config) as agent:
    # 你的 Agent 现在已经掌握了高级跨界 UI 架构理论
    pass
```

**关键点**：`skills_paths` 接受一个列表，这意味着你可以同时挂载多个 Skill，它们不会相互干扰。

## 第二步：注入系统约束，告诉 Agent 何时该主动出手

光挂载 Skill 路径是不够的。你需要在系统提示词（System Prompt）中赋予 Agent 明确的行动指令，告诉它在什么场景下应该主动调用这个技能：

> "当你执行关于软件前端开发、UI 设计或架构评估的任务时，必须优先使用 `gestalt-prompt-workflow` 技能，并严格遵循其返回的五维（GII, TPF, COE, SCR, OCC）约束提示词来编写最终代码。"

这条约束的作用是在概率分布上"锚定"Agent 的行为——防止它在面对界面开发任务时，偷懒地跳过 Skill，直接输出毫无审美约束的平庸代码。

## 日常开发：一次真实的对话流程

一旦配置完成，你可以像平时一样与 Agent 自然对话。以下是一个典型场景：

**👨‍💻 你提出需求：**
> "我们需要开发一个数据管理中台的仪表盘页面，包含多张图表和一个支持筛选的表格列表。请利用你的 gestalt-prompt-workflow 技能，生成相关的代码设计与架构。"

**🤖 Agent 内部执行的事情（对你透明，但值得了解）：**
1. 识别到"表格列表"与"图表展示"——两个需要精细处理的界面场景。
2. 调取 `SKILL.md` 的核心逻辑，判断主要发力点为：
   - **GII**（去除表格硬边框，用留白软分割行列层级）
   - **OCC**（图表组件与筛选器完全解耦，网格复用）
3. 拉取 `templates/design_prompt_template.md`，将以上分析结果注入模板占位符。
4. 输出包含严苛约束的最终代码——`transform` 动效、无物理边框、组件高内聚。

整个过程你无需感知，但结果是：**你拿到的代码，既有工程品质，又有设计灵魂。**

## 扩展知识库：持续喂养你的 Skill

这个 Skill 被设计为"知识驱动型"，这意味着它的能力上限不是由模型权重决定的，而是由 `references/` 目录下积累的理论与案例深度决定的。

你可以随时让 Agent 替你添加新的设计素材：

> "我发现 Stripe 官网结账页面的过渡动效极具物理拟真感。请用【添加新素材工作流】帮我把这个案例解构并加入知识库。"

Agent 会自动从 GII、TPF、COE、SCR、OCC 五个维度进行量化分析，在 `references/cases/` 下生成标准化案例文档，并提取关键约束指令反哺提示词引擎。**这是这套系统真正实现自我进化的方式。**

---

## 五维指标术语速查表

| 术语 | 完整名称 | 一句话核心理念 | 典型应用场景 |
| :--- | :--- | :--- | :--- |
| **GII** | 格式塔知觉完形指数 | 整体大于部分之和，用接近性取代物理边界 | 去除生硬边框线，用留白划分层级，骨骼对齐 |
| **TPF** | 时序缓动与物理拟真度 | 建立顺应人类生理本能的重力感受 | Stagger 列表依次载入，按钮交互贝塞尔曲线缓动 |
| **COE** | 仅图层合成渲染优化率 | 视觉连续性绝不能因高负载而断裂 | 动效必须锁定在 `transform` & `opacity` 以防重排 |
| **SCR** | 源码排版视觉清澈度 | 代码应如诗歌般具备格式塔排布 | 利用空行对逻辑进行语义分块，降低认知疲劳 |
| **OCC** | 组件内聚与网格重用率 | 界面元素与业务逻辑高内聚低耦合 | UI 组件独立封装，样式完全受控于统一骨骼网格系统 |

这张表是我在和同事协作时最频繁发出去的东西——当 Agent 输出的提示词里出现这些缩写时，对照这张表可以立刻理解它在说什么，以及为什么它会拒绝你某个"看起来无害"的需求。
