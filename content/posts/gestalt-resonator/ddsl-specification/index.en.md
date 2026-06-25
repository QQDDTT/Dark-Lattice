---
title: "DDSL Specification"
date: "2026-06-21T14:05:24+09:00"
description: "A picture design semantic graph contract specification specifically designed for AI Agent collaborative development"
tags: ["gestalt-resonator", "DDSL"]
draft: true
---

# DDSL Specification

DDSL (Design Domain Specific Language) is an interface design semantic graph contract specification tailored for AI Agent collaborative development. Through a strict JSON structure, it decouples the interface's "Aesthetic Qualities (Tokens)", "Spatial Topology (Layout Tree)", and "Dynamic Interaction (State Machine)". This document elaborates on each syntax field within the DDSL contract and its corresponding Gestalt psychology design meaning.

---

## 1. DDSL Compilability & Computability Specification

DDSL is by no means an unstructured Schema used solely for static descriptions. In an interactive design transpilation system, it must satisfy the following two rigid physical and mathematical scientific conditions to act as a crucial bridge and constraint during design iterations:

### 1.1 Compilability: Downstream Artifacts Compilation

The DDSL contract must be losslessly transpired by a compiler (Transpiler) into standard, physically renderable assets executable directly in a browser:
1. **Target Artifact Mapping Structure**:
   The target output of compiled DDSL files is a set of physical resource files adhering to modern frontend engineering standards:
   - `index.html` (DOM structure and hierarchical topology)
   - `index.css` (Themed and layout styles based on Design Tokens variables)
   - `index.js` (Behavioral interaction logic and motion based on the state machine)
   - Dependent media assets (e.g., required SVG vector graphics or images).
2. **Deterministic Mapping of DOM Topology**:
   - Every element in the `layout_tree` has a definite HTML5 DOM mapping during compilation:
     - `Container` $\rightarrow$ `<div class="gestalt-container">` or `<section>`
     - `Component` $\rightarrow$ `<div class="gestalt-component">`
     - `Text` $\rightarrow$ `<span>` or `<p>`
     - `Button` $\rightarrow$ `<button>`
     - `Input` $\rightarrow$ `<input>`
     - `Image` $\rightarrow$ `<img>`
   - Each node's `id` maps directly to CSS class names and DOM selectors in the generated code, ensuring parsability and avoiding conflicts.
3. **Style Compilation of Aesthetic Qualities**:
   - `design_tokens.colors` are directly compiled into global CSS variables:
     ```css
     :root {
       --color-primary: hsl(220, 70%, 50%);
       --color-background: hsl(210, 15%, 95%);
     }
     ```
   - All spacing scales are mapped to CSS Spacing Utilities, outputted as corresponding spacing class definitions by the transpiler.

### 1.2 Computability: Quantifiable Generative Calculation

The DDSL contract must be quantifiable via pure numerical algebra and geometric formulas during the design and evolution process, ensuring no heuristic guesswork or ambiguity:
1. **Series Formulation of Proximity Spacing**:
   DDSL spacing scales are not heuristically hard-coded but calculated via a scaling function based on the Gestalt **Proximity Principle**:
   $$S_i = \text{base} \times \text{scale}_i$$
   The base spacing and proportion scales (e.g., `[0.25, 0.5, 1, 2]`) undergo pure algebraic calculation into exact physical values (e.g., `2px`, `4px`, `8px`, `16px`), forming the mathematical basis for spacing in the layout tree.
2. **Algebraic Calculation of Aesthetic Color Harmony**:
   Color themes in the HSL space must be calculated via multi-dimensional algebraic expressions:
   - e.g., The hue of the warning color `color.alert` must be calculated by its angle against the `primary` hue on the color wheel (e.g., complementary hue harmony):
     $$H_{\text{alert}} = (H_{\text{primary}} + 180^\circ) \bmod 360^\circ$$
   - This allows flat color intents extracted by small models to be directly quantified via mathematical rules into executable HSL Design Tokens.
3. **Boundary Condition Constraints for Locked Regions**:
   When a user locally locks (`locked: true`) a DDSL node in the lineage graph, the physical size, spacing, and color corresponding to that subtree are locked as **Boundary Conditions**.
   When the synthesis engine recalculates parameters and geometry, it applies mathematical optimization formulas to unlocked areas, utilizing Constraint Solving to derive the optimal layout under these boundary conditions, ensuring global aesthetic consistency post-local-adjustment.

---

## 2. Core Schema Structure Overview

A standard DDSL contract file (e.g., `layout.ddsl.json`) consists of four top-level root fields:

```json
{
  "project_name": "Project Name",
  "version": "Contract Version",
  "design_tokens": { /* Global Design Variables (Aesthetic Qualities) */ },
  "layout_tree": { /* Gestalt Layout Topological Tree */ },
  "behavioral_state_machine": { /* Interaction State Machine and Motion Mapping */ }
}
```

---

## 3. Syntax Field Details

### 3.1 Root Metadata

*   **`project_name`** (string, Required)  
    *   **Meaning**: Name of the current design project. Used by the transpiler to generate namespaces or root directories.
*   **`version`** (string, Required)  
    *   **Meaning**: Version number of the current DDSL contract for compatibility checking and incremental transpilation tracking.

---

### 3.2 Global Design Variables (`design_tokens`)

Defines the global visual system elements (color and size proportions), carrying the interface's global aesthetic qualities.

```json
"design_tokens": {
  "colors": {
    "primary": {
      "value": "hsl(220, 70%, 50%)",
      "_agent_rule": "Do not alter lightness to ensure contrast"
    }
  },
  "spacing": {
    "base": 8,
    "scale": [0.25, 0.5, 1, 1.5, 2, 4]
  }
}
```

*   **`colors`** (object, Required)  
    *   **Meaning**: Global color theme definition. Highly recommended to use HSL.
    *   **Sub-attributes**:
        *   `value` (string, Required): Specific CSS color value.
        *   `_agent_rule` (string, Optional): **Coding Ban**. Rigid color requirements for development Agents (e.g., prohibiting Agents from altering the color's lightness to guarantee WCAG AAA accessibility contrast).
*   **`spacing`** (object, Required)  
    *   **Meaning**: Global spacing scale factor, mapping to the Gestalt **Proximity Principle**.
    *   **Sub-attributes**:
        *   `base` (number, Required): Base spacing size (in pixels, e.g., `8`).
        *   `scale` (array of numbers, Optional): Spacing multiplier scale (e.g., `[0.25, 0.5, 1, 1.5, 2, 4]`), corresponding to actual generation constraints like `2px`, `4px`, `8px`, `12px`, `16px`, `32px`.

---

### 3.3 Gestalt Layout Topological Tree (`layout_tree`)

The core of DDSL, utilizing a nested tree structure to describe the spatial topology and organizational logic, entirely circumventing the layout fragility caused by physical coordinates or absolute size positioning.

```json
"layout_tree": {
  "id": "root_viewport",
  "type": "Container",
  "gestalt_principle": "figure-ground",
  "_agent_guidelines": {
    "intent": "Main viewport area, main card floats on gray background",
    "do_not_do": ["Do not use borders to define edges"],
    "recommended": ["Use CSS box-shadow soft shadow for parallax depth"]
  },
  "children": []
}
```

*   **`id`** (string, Required): Unique identifier. Maps directly to CSS class names or E2E QA test selectors.
*   **`type`** (string, Required): The base interface type meta-definition (`Container`, `Component`, `Text`, `Button`, `Input`, `Image`).
*   **`gestalt_principle`** (string, Optional)  
    *   **Meaning**: The primary **Gestalt psychology principle** applied to this node's visual layout. Guides the geometric rules bestowed by the transpiler.
    *   **Values**: `proximity`, `similarity`, `figure-ground`, `common-fate`, `continuity`, `closure`.
*   **`_agent_guidelines`** (object, Optional)  
    *   **Meaning**: Immediate action prompt constraints exclusively for the Client Agent, auto-injected by the system.
    *   **Sub-attributes**:
        *   `intent`: Visual and interaction design intent.
        *   `do_not_do`: **Coding Ban**. Hard-forbidden styling implementations (e.g., `["border: 1px solid"]`).
        *   `recommended`: Recommended CSS layout tricks.

---

### 3.4 Interaction State Machine (`behavioral_state_machine`)

Describes the collaborative control mapping of visual features and motion under different runtime interactive states.

```json
"behavioral_state_machine": {
  "states": {
    "error_alerting": {
      "description": "State when API timeout or validation fails",
      "visual_effects": ["common-fate:shake", "color:alert"]
    }
  }
}
```

---

## 4. DDSL as a Bridge: Parameter Mapping & State Anchoring

DDSL is not merely a specification format for downstream Agent transpilation; **it is the core connecting bridge between the feature extraction small model and the Gestalt deterministic synthesis engine during design iterations.** It parameterizes emotional design demands and provides physical anchoring for non-linear state evolution.

### 4.1 Mapping Model Parameters to DDSL Fields
1. **Visual Description $\rightarrow$ `design_tokens` & `spacing`**: e.g., "High whitespace, cool tone" increases spacing base and injects cool hue ranges.
2. **Audience Profile $\rightarrow$ `_agent_guidelines`**: e.g., "Geek audience" converts into Agent constraints mandating high-density Grid layouts and banning redundant borders.
3. **Design Subtext $\rightarrow$ `gestalt_principle`**: e.g., "Highlight warning" sets `figure-ground` on the warning component node.

### 4.2 State Anchoring & Lock State in Loop Engineering
In design lineage graphs, `_lock_state` on DDSL nodes acts as a vital **model boundary constraint**. When locked, the topology and tokens of that subtree are solidified. During the next divergence, **models ignore locked nodes**, focusing parameter divergence entirely on unlocked, free nodes, thus compressing the inference space and ensuring deterministic convergence.
