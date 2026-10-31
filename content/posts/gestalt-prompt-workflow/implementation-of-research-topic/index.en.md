---
title: "Gestalt Prompt Workflow: Translating Design and Architecture Resonance into Agent Skills"
date: "2026-06-21T14:00:00+09:00"
description: "Exploring how the five-dimensional theory from the \"Pixel and Architecture System Resonance\" research is translated into a machine-understandable and strictly executed code generation engine via the Gestalt Prompt Workflow."
tags: ["gestalt-prompt-workflow", "agent-skill", "architecture-and-design"]
draft: false
---

In the research project *"Pixel and Architecture System Resonance"*, we delved deeply into the systemic resonance between visual design, aesthetics, visual psychology, and IT engineering planning. However, theoretical research eventually needs to be grounded in practice. How do we make an AI Large Language Model understand abstract concepts like "Gestalt psychology," "visual tension," or "high component cohesion"?

This was the original intention behind creating the `gestalt-prompt-workflow` Agent Skill. Its core mission is to map abstract aesthetics and psychological theories into an executable prompt generation engine that machines can strictly follow.

## The Dimensional Strike of the Five System Resonance Indicators

To enable AI to accurately output high-quality code and design structures, we must quantify subjective feelings. The system architecture revolves around the five core quantitative indicators proposed in the research. It requires the Agent to conduct a "dimensional strike" review from these five dimensions when facing any development requirement:

1. **GII (Gestalt Integration Index, Weight 45%)**: Teaching the model to utilize the principles of proximity and continuity. For example, replacing physical boundaries by mandating the use of negative space (whitespace) to divide interface hierarchies and achieve grid alignment.
2. **TPF (Temporal Physics and Fidelity)**: Responsible for parsing the temporal rhythm of micro-interactions. By introducing concepts like Bezier curve easing and staggered loading, it eliminates cognitive dissonance for users during interactions.
3. **COE (Composite-Only Efficiency, Weight 55%)**: The intersection of engineering and design. It forces AI to strictly lock onto `transform` and `opacity` properties when implementing animations, resolutely safeguarding 60fps or even 120fps GPU Composite rendering performance without compromise.
4. **SCR (Source Code Readability)**: Standardizing the output format of code. Code itself requires "Gestalt layout." By enforcing high-contrast syntax highlighting and semantic block segmentation with blank lines, it greatly reduces the cognitive load for human developers reading the code.
5. **OCC (Object and Component Cohesion)**: At the component level, it accurately maps UI assets into highly cohesive, loosely coupled front-end code encapsulation.

## Internal Triggering and Data Flow

As an advanced internal capability encapsulated based on the Google Antigravity (AGY) SDK standard, this Skill is automatically awakened whenever the host Agent encounters tasks involving front-end development, UI design, or architecture evaluation.

Its internal data flow logic is extremely clear:
First, it parses the external raw design and development requirements. Subsequently, the **Five-Indicator Mapping Analyzer** generates corresponding GII, TPF, COE, and OCC constraints based on the requirements (e.g., "Detected charts and lists; triggering GII borderless soft segmentation and OCC grid reuse strategies"). Then, these independent constraint points are injected into a preset `design_prompt_template.md` template. Finally, it outputs design prompts—or directly generates code—with exceptionally strict SCR source code formatting norms.

## Capability Expansion in Real Projects

In practical applications, it plays the dual role of "Designer + Architect." You simply need to introduce this Skill path during Agent initialization:

```python
config = LocalAgentConfig(
    # ...
    skills_paths=["/home/nick/workspaces/gestalt-prompt-workflow"] 
)
```

Combined with system-level constraints (System Prompt): *"When executing interface development tasks, you must prioritize the use of gestalt-prompt-workflow and follow its five-dimensional constraints."*

In this way, when faced with a simple one-sentence requirement like "We need to develop a dashboard page for a data management mid-end," the system not only generates the basic structure but also spontaneously endows it with fluid transition easing, ultimate layer rendering optimization, and ensures the resulting React/Vue components are highly cohesive in structure. It truly achieves the resonance of "elegant design and robust architecture" in every line of automatically generated code.
