---
title: "Insights on Building Knowledge-Driven Agents: From Code Refactoring to Knowledge Distillation"
date: "2026-06-21T14:10:00+09:00"
description: "Reflecting on the core paradigm shift during the development of gestalt-prompt-workflow: the adversarial nature of prompt engineering, and how to \"purify\" and \"cleanse\" a complex knowledge base."
tags: ["gestalt-prompt-workflow", "agent-skill", "development-insights", "refactoring"]
draft: false
---

After experiencing the entire process of `gestalt-prompt-workflow` from inception to theoretical grounding and practical deployment, I have deeply realized: building an advanced, knowledge-driven Agent Skill is essentially a re-examination and formatting of existing human knowledge systems.

The challenge we face is no longer how to write high-concurrency API code, but how to continuously game the probability distribution of Large Language Models within an invisible, high-dimensional semantic space.

## Prompt Engineering: The Battle Between the Concrete and the Abstract

Initially, when introducing *Pixel and Architecture System Resonance* into prompts, the biggest challenge we encountered was: the LLM "understands" all the literal meanings, but it often fails to adhere to them in engineering outputs.

For example, the model knows what "Gestalt psychology" is, but when specifically generating code for a list component, it still habitually draws a harsh `border-bottom` line instead of using negative space (the principle of proximity) to create soft segmentation. This made me realize: **Prompt engineering is not simply "writing a Prompt," but a battle to forcefully bind abstract aesthetics to concrete code instructions.**

We had to abandon vague vocabulary like "Please make the design look more elegant and transparent," and pivot to extremely concrete, high-pressure hard constraints (GII, COE, SCR) like "Absolutely forbidden to modify box model properties for animation," or "Mandatory execution of high-contrast syntax highlighting and semantic block segmentation with blank lines." Only in this way can we suppress the model's tendency to generate mediocre code at the probability distribution level.

## From "Code Refactoring" to "Knowledge Distillation"

In traditional software development, as a project evolves, we refactor code—extracting common functions and optimizing design patterns. However, in the lifecycle of an Agent Skill, the refactoring we face is a completely different concept: **The lifecycle management and distillation of knowledge base assets**.

Over time, we stuffed more and more exceptionally excellent practical cases into the `references/cases/` directory (e.g., dozens of excellent popup animation analyses). But this brought a disaster: the massive reference library became a heavy burden for Agent retrieval, causing not only severe token explosions but also "attention dilution" when the LLM read these cases.

This forced us to establish a set of "Knowledge Base Refactoring Norms":

1. **Abstract Extraction**: Once a sufficient number of cases for a certain interaction type accumulates, they must be periodically merged. The "universal guidelines" are extracted and floated up to the core theory library, followed by the immediate deletion of redundant specific cases. We replace complicated prose analysis with extremely concise, high-density instructions.
2. **Data Cleansing**: We found that LLMs understand information differently from humans. Humans like coherent, lengthy, eloquent prose and transition words; however, LLMs prefer "high-information-density phrases" (like directly stacking "high cohesion, low coupling" and "proximity"). Therefore, we began "cleansing" the knowledge base, stripping out meaningless modifiers and condensing cases to their absolute essence.
3. **Weight Degradation**: To prevent the model from learning outdated aesthetics, obsolete design cases must be promptly removed or tagged as `Deprecated`.

This serves as a reminder to all AI application developers: **In the future of Agent development, a huge portion of energy will be spent on how to refine your "Prompt Context Knowledge Base".** The purity of the knowledge determines the quality ceiling of the Agent's output.
