---
title: "Gestalt Prompt Workflow Integration Guide: Giving Your Agent an Advanced Aesthetic Engine"
date: "2026-06-23T09:30:00+09:00"
description: "A complete practical guide to integrating Gestalt Prompt Workflow into your AGY Agent: from hooking up the Skill, to real-world conversation examples, to a quick-reference glossary for all five quantitative indicators."
tags: ["gestalt-prompt-workflow", "agent-skill", "usage-guide"]
draft: true
---

After getting `gestalt-prompt-workflow` fully operational, I found the most common question wasn't "what can it do?" but rather "**how do I actually plug it into my own project?**"

This article answers exactly that. It's a hands-on integration guide, complete with a real-world conversation example and a quick-reference glossary for the five-dimensional indicators you'll encounter in its output.

## Step 1: Add the Skill to Your Agent Configuration

`gestalt-prompt-workflow` is an Agent Skill packaged entirely to the Google Antigravity (AGY) SDK standard. Integration is straightforward — simply add the project's local absolute path to `skills_paths` when initializing your Agent:

```python
from google.antigravity import Agent, LocalAgentConfig

# Inject the gestalt-prompt-workflow local path into skills_paths
config = LocalAgentConfig(
    api_key="YOUR_API_KEY",
    model="gemini-1.5-pro-latest",
    skills_paths=["/home/nick/workspaces/gestalt-prompt-workflow"]
)

async with Agent(config) as agent:
    # Your Agent now commands advanced cross-disciplinary UI architecture theory
    pass
```

**Key point**: `skills_paths` accepts a list, meaning you can mount multiple Skills simultaneously without conflict.

## Step 2: Inject System Constraints to Tell Your Agent When to Act

Mounting the Skill path alone isn't enough. You need to give the Agent a clear directive in the System Prompt, specifying the scenarios where it should proactively invoke this capability:

> "When executing tasks related to front-end software development, UI design, or architecture evaluation, you must prioritize the use of the `gestalt-prompt-workflow` skill and strictly follow the five-dimensional (GII, TPF, COE, SCR, OCC) constraint prompts it returns when writing the final code."

The purpose of this constraint is to "anchor" the Agent's behavior in probability space — preventing it from lazily skipping the Skill when faced with interface development tasks and producing aesthetically unconstrained, mediocre code instead.

## Day-to-Day Development: A Real Conversation Flow

Once configured, you can interact with the Agent naturally. Here's a typical scenario:

**👨‍💻 Your request:**
> "We need to develop a dashboard page for a data management mid-end, with multiple charts and a filterable table list. Please use your gestalt-prompt-workflow skill to generate the relevant code design and architecture."

**🤖 What the Agent does internally (transparent to you, but worth understanding):**
1. Identifies "table list" and "chart display" — two interface scenarios requiring precise handling.
2. Invokes the core logic from `SKILL.md`, determining the primary focus areas:
   - **GII** (remove hard table borders, use whitespace for soft row/column segmentation)
   - **OCC** (fully decouple chart components from filters, enforce grid reuse)
3. Fetches `templates/design_prompt_template.md`, injecting the analysis results into the template placeholders.
4. Outputs final code with strict constraints — `transform`-only animations, no physical borders, high component cohesion.

The entire process is invisible to you. The result: **code that possesses both engineering quality and design soul.**

## Expanding the Knowledge Base: Continuously Feeding Your Skill

This Skill is designed to be "knowledge-driven," meaning its capability ceiling isn't determined by model weights, but by the depth of theory and cases accumulated in the `references/` directory.

You can have the Agent add new design material at any time:

> "I found that the checkout page transition animations on the Stripe website have an exceptional sense of physical realism. Please use the Add New Asset Workflow to deconstruct this case and add it to the knowledge base."

The Agent will automatically perform a quantitative analysis across all five dimensions (GII, TPF, COE, SCR, OCC), generate a standardized case document under `references/cases/`, and extract key constraint instructions to feed back into the prompt engine. **This is how the system truly achieves self-evolution.**

---

## Five-Dimensional Indicator Quick-Reference Glossary

| Acronym | Full Name | Core Idea | Typical Scenarios |
| :--- | :--- | :--- | :--- |
| **GII** | Gestalt Integration Index | The whole is greater than the sum of its parts; replace physical boundaries with proximity | Remove hard borders, use whitespace to define hierarchy, enforce skeletal grid alignment |
| **TPF** | Temporal Physics and Fidelity | Establish a gravitational feel that conforms to human physiological instincts | Staggered list entries, Bezier curve easing on button interactions |
| **COE** | Composite-Only Efficiency | Visual continuity must never fracture under high load | Animations must be locked to `transform` & `opacity` to prevent layout reflow |
| **SCR** | Source Code Readability | Code should possess Gestalt layout, like a well-structured poem | Use blank lines for semantic block segmentation to reduce cognitive fatigue |
| **OCC** | Object and Component Cohesion | UI elements and business logic must be highly cohesive and loosely coupled | UI components independently encapsulated, styles fully governed by a unified skeletal grid system |

This table is the thing I send to teammates most often. When the Agent's output prompt contains these acronyms, cross-referencing this glossary immediately clarifies what it's saying — and why it's refusing a requirement that looks "harmless" on the surface.
