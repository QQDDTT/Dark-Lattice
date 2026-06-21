---
title: "Agent Skill 开发实战：按需上下文调度与确定性评估管线"
date: "2026-06-21T14:05:00+09:00"
description: "深挖 gestalt-prompt-workflow 开发过程中的技术挑战，包含基于工具的按需上下文调度方案，以及针对 LLM 非确定性输出的评估管线建立。"
tags: ["gestalt-prompt-workflow", "agent-skill", "LLM评估"]
draft: true
---

开发一个 Agent Skill 截然不同于传统的软件工程（Software Dev）。传统工程侧重于代码编译、逻辑断言和确定的输入/输出（Deterministic I/O）。而构建像 `gestalt-prompt-workflow` 这样重度依赖跨界知识的复杂 Agent 技能，其核心变成了**提示词工程**、**概率调优**与**上下文知识的管理**。

## “按需调度”：解决 Token 与长文本遗忘的双重痛点

作为一个“知识驱动型”的 Agent Skill，其背后依赖于《像素与架构的系统共鸣》研究项目中庞大的理论分析与对标案例。如果每次对话都将全量文档（数万 Tokens）无脑塞入大模型的上下文中，不仅会导致惊人的 API 成本消耗，更会严重触发模型的“注意力遗忘（Lost in the middle）”问题。

为了解决这一痛点，我们设计了精细的**按需调度工具读取（On-Demand Tool Reading）**机制：

1. **常驻指令（基础上下文）**：仅将 `SKILL.md`（包含硬性执行规范与五维指标的严苛定义，约 1500 Tokens）作为 System Prompt 级别一直驻留。
2. **知识库检索（动态补充）**：当用户提出的需求涉及某种特定交互（如“Stagger 列表”），且模型在自身权重中无法清晰界定基于我们理论体系的设计规范时，宿主 Agent 将自发调用 `view_file` 工具或 `grep_search` 工具。
3. **按需加载案例与理论**：它只会精准读取 `references/theory/` 下的某一章节，或 `references/cases/` 下的某个具体的对标案例量化文档。
4. **组装模板**：提取有用信息后，再调取 `templates/design_prompt_template.md`，将分析结果硬核注入。

这种分层调度策略，使得一次无盲区的最优生成的 Token 消耗能控制在 4,300 Tokens 左右，而即便面临高度复杂的理论论证查询，也能通过局部读取控制住成本和模型注意力的涣散。

## 重塑测试管线：从 Pass/Fail 到对抗与泛化

在维护这个 Skill 时，单纯的单元测试和语法检查工具毫无用处。您必须建立一套专门针对概率生成结果的基准测试集（Benchmark），我们称之为独有的“评估管线 (Evaluation Pipeline)”。

### 1. 格式塔指令依从性对抗测试 (Instruction Compliance)
测试目的在于检验 Agent 面对“陷阱需求”时，能否坚守 `SKILL.md` 中制定的底线。
比如，我们会刻意输入极端刁钻的要求：*“请给我一个按钮，当悬停时，宽度从 100px 变成 200px。”*
预期的 Agent 行为绝对不是顺从地写出修改 width 的 CSS，而是必须基于 COE（渲染优化率）的约束果断拒绝，并在返回的提示词中纠正：“强制使用 `transform: scaleX(2)`”。通过此类对抗，来验证系统提示词的约束力。

### 2. 跨大模型泛化测试 (Cross-Model Generalization)
这个 Skill 最终吐出的是长篇“生成提示词”，这使得它需要被投喂给各种下游的代码生成模型（如 Gemini 1.5 Pro, Claude 3.5 Sonnet 等）。
我们需要将组装出的提示词喂给不同的模型，肉眼审计最终生成的 React/Vue 源码并在浏览器中渲染观察：是否真的去除了生硬边框？是否真正做到了组件解耦？
如果某个模型频频出错或产生幻觉，就意味着我们在 `templates/` 中的语气还不够强烈，必须加入如 `[CRITICAL]` 或 `[绝对禁止]` 等增强修饰词，从而在概率分布上强行扭转模型的输出倾向。
