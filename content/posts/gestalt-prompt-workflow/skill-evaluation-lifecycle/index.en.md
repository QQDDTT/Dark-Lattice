---
title: "The Testing Philosophy of Agent Skills: Taming LLMs with Non-Deterministic Evaluation Pipelines and Knowledge Distillation"
date: "2026-06-23T09:35:00+09:00"
description: "Exploring how to build Gestalt instruction compliance tests and cross-model generalization tests for LLM non-deterministic outputs, and how to maintain an Agent Skill's knowledge base lifecycle through knowledge concentration and distillation."
tags: ["gestalt-prompt-workflow", "agent-skill", "LLM-evaluation", "knowledge-management"]
draft: false
---

One of the most striking realizations during the development of `gestalt-prompt-workflow` was the moment I understood that **traditional software testing methodology completely fails here**.

You cannot use `assertEqual` to assert an LLM's output. You cannot trace a "model hallucination" with a crash log. What you *can* do is design an **evaluation pipeline** for probabilistic outputs, and establish a **lifecycle maintenance mechanism** that keeps the knowledge base perpetually "young." That's what this article explores.

## Traditional Dev vs. Skill Dev: A Comparison

First, let's establish the fundamental difference between these two development paradigms — this is the prerequisite for understanding the testing methodology that follows:

| Dimension | Traditional Software Dev | Agent Skill Dev |
| :--- | :--- | :--- |
| **Testing Goal** | Does the function return value match the expected assertion (Pass/Fail)? | Can the Agent's generated prompt guide the underlying LLM to produce code that meets aesthetic constraints? |
| **Exception Handling** | Try-Catch, stack traces, crash logs | Model hallucination, constraint forgetting, Lost in the Middle |
| **System Architecture** | Microservices, MVC, database paradigms | Knowledge retrieval (RAG), Agent intent recognition, workflow orchestration |
| **This Project's Practice** | — | Multi-level adversarial prompt testing + browser visual audit of GII/TPF performance |

The core insight from this table: **The "bugs" in Skill development aren't compilation errors — they're probability drift.** You're not fixing crashes; you're adjusting the bias of a massive probabilistic machine.

## The Two-Phase Evaluation Pipeline

### Phase 1: Gestalt Instruction Compliance Testing

The purpose of this phase is direct: **use deliberately tricky "trap requirements" to verify whether the Agent will abandon the prohibitions in `SKILL.md` under pressure.**

A typical test case:

*   **Input**: "Give me a button that changes its width from 100px to 200px on hover."
*   **Expected Agent behavior**: Refuse to modify the `width` property. Return a corrected prompt explicitly stating: "Mandatory use of `transform: scaleX(2)` to comply with COE rendering optimization constraints. Absolutely forbidden to modify box model properties and trigger layout reflow."

If the Agent compliantly outputs CSS that modifies `width`, it means the phrasing strength in `SKILL.md` for that constraint is insufficient — you need to inject high-weight modifiers like `[ABSOLUTELY FORBIDDEN]` or `[CRITICAL]` to forcefully suppress the model's probabilistic tendency to take the "easy path."

This isn't testing code logic. This is testing the **"willpower" of a set of prompts**.

### Phase 2: Cross-Model Generalization Testing

The Skill ultimately produces structured "generation prompts," meaning it needs to be capable of governing various downstream code generation models. Feed the assembled prompts to different models (e.g., Gemini 1.5 Pro, Claude 3.5 Sonnet, GPT-4o), then audit the rendered results in a browser:

*   Did the generated components truly remove hard border lines? (**GII compliance**)
*   Did the components truly achieve complete decoupling? (**OCC compliance**)
*   Are animation properties strictly locked to `transform` and `opacity`? (**COE compliance**)

If a particular model frequently "goes off the rails," it signals that the tone in our `templates/` isn't forceful enough — we need to further amplify the coercive pressure of constraint vocabulary. **This is the essence of "Probabilistic Tuning" — continuously applying pressure to the model's output distribution until it statistically converges within our desired range.**

## Knowledge Base Lifecycle Management

Traditional code refactoring modifies logic; **Skill refactoring distills and concentrates knowledge.**

As the practical cases under `references/cases/` continue to accumulate, they will eventually cross a threshold — transforming from a "treasure trove" into a "burden": too many cases cause token explosion, and Agent attention becomes diluted by high volumes of low-quality material. At that point, the knowledge base becomes more dangerous than having nothing at all.

For this project, I've established three lifecycle maintenance rules:

### 1. Abstract Distillation (Periodic Synthesis)
When `cases/` accumulates more than ten excellent examples of the same type of scenario (e.g., "modal animations"), a distillation process must be triggered: extract the essential constraint instructions common to all of them, write them into a new universal guideline document in `theory/`, then delete those redundant individual cases. **Let knowledge density always rise; let volume always remain controlled.**

### 2. Weight Decay (Marking Stale Content)
For outdated early-stage cases (e.g., cases about the rigid flat design styles that were popular years ago), they must be promptly tagged with `Deprecated` or removed from the main directory. **An Agent that has learned outdated aesthetics is more dangerous than one that knows nothing at all — it will output errors with complete confidence.**

### 3. Periodic Data Cleansing (Elevating Information Density)
Strip knowledge documents of lengthy transition phrases and information-free filler text, forcing the use of high information-density phrasing. For example:

*   ❌ "In terms of design, we should fully consider the user's visual experience, and try to avoid using overly rigid border lines in order to create a better sense of visual hierarchy."
*   ✅ "Prohibit physical borders. Enforce whitespace segmentation (proximity principle). Skeletal grid alignment (continuity principle)."

A model's understanding and execution of high-density directive vocabulary far surpasses its digestion of human prose. This rule is, in my view, **the most counterintuitive yet most important principle** in the entire Skill development philosophy.
