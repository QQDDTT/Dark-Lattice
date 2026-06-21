---
title: "Agent Skill Development in Practice: On-Demand Context Scheduling and Evaluation Pipelines"
date: "2026-06-21T14:05:00+09:00"
description: "Delving into the technical challenges during the development of gestalt-prompt-workflow, including tool-based on-demand context scheduling solutions and establishing evaluation pipelines for the non-deterministic outputs of LLMs."
tags: ["gestalt-prompt-workflow", "agent-skill", "LLM-evaluation"]
draft: false
---

Developing an Agent Skill is fundamentally different from traditional software engineering (Software Dev). Traditional engineering focuses on code compilation, logic assertions, and Deterministic I/O. However, building a complex Agent capability heavily reliant on cross-disciplinary knowledge, like `gestalt-prompt-workflow`, centers on **Prompt Engineering**, **Probabilistic Tuning**, and **Context Knowledge Management**.

## "On-Demand Scheduling": Solving the Dual Pain Points of Tokens and Lost in the Middle

As a "knowledge-driven" Agent Skill, it relies on a massive repository of theoretical analyses and benchmark cases from the *Pixel and Architecture System Resonance* research project. If we mindlessly stuff the full text (tens of thousands of tokens) into the LLM's context during every conversation, it would not only lead to astonishing API cost consumption but also severely trigger the model's "Lost in the middle" phenomenon.

To address this pain point, we designed a refined **On-Demand Tool Reading** mechanism:

1. **Resident Instructions (Base Context)**: Only `SKILL.md` (containing hard execution norms and strict definitions of the five-dimensional indicators, approximately 1500 Tokens) is kept resident at the System Prompt level.
2. **Knowledge Base Retrieval (Dynamic Supplement)**: When the user's request involves a specific interaction (like "Staggered lists"), and the model cannot clearly define the design norms based on our theoretical framework within its own weights, the host Agent autonomously invokes the `view_file` or `grep_search` tools.
3. **On-Demand Loading of Cases and Theories**: It precisely reads only a specific chapter under `references/theory/` or a specific quantitative case analysis document under `references/cases/`.
4. **Template Assembly**: After extracting useful information, it then retrieves `templates/design_prompt_template.md` and forcefully injects the analysis results.

This layered scheduling strategy ensures that the token consumption for an optimal, blind-spot-free generation is controlled at around 4,300 Tokens. Even when faced with highly complex theoretical argument queries, costs and the diffusion of the model's attention remain well managed through localized reading.

## Reshaping the Testing Pipeline: From Pass/Fail to Adversarial and Generalization

When maintaining this Skill, simple unit testing and syntax-checking tools are useless. You must establish a set of Benchmark testing suites specifically targeting probabilistic generation results, which we call our unique "Evaluation Pipeline."

### 1. Gestalt Instruction Compliance Adversarial Testing
The purpose of this test is to verify whether the Agent can uphold the bottom lines defined in `SKILL.md` when faced with "trap requirements."
For instance, we deliberately input extremely tricky demands: *"Please give me a button; when hovered, its width should change from 100px to 200px."*
The expected Agent behavior is absolutely NOT to compliantly write CSS that modifies the width. Instead, it must decisively refuse based on the COE (Composite-Only Efficiency) constraint and correct it in the returned prompt: "Mandatory use of `transform: scaleX(2)`." Through such adversarial testing, we validate the binding power of the system prompts.

### 2. Cross-Model Generalization Testing
This Skill ultimately spits out lengthy "generation prompts," which means it needs to be fed to various downstream code generation models (like Gemini 1.5 Pro, Claude 3.5 Sonnet, etc.).
We need to feed the assembled prompts to different models, manually audit the ultimately generated React/Vue source code, and observe rendering in the browser: Did it really remove harsh borders? Did it truly achieve component decoupling?
If a certain model frequently makes errors or hallucinates, it indicates that our tone in `templates/` is not strong enough. We must add enhancing modifiers like `[CRITICAL]` or `[ABSOLUTELY FORBIDDEN]` to forcefully twist the model's output tendencies in the probability distribution.
