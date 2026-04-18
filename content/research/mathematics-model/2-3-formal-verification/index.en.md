---
title: "Logic Algebra & Formal Verification"
date: 2026-04-17
draft: false
tags: ["Formal Verification", "Model Checking", "Temporal Logic", "Safety Critical"]
math: true
---

## Background
In safety-critical systems, testing cannot prove the absence of errors. Formal verification uses mathematical proofs to guarantee that a system meets its specifications.

## Core Theory
### 1. Temporal Logic (LTL/CTL)
Describes system behavior over time.
- **Safety**: $\mathbf{G}\,\varphi$ (nothing bad ever happens).
- **Liveness**: $\mathbf{F}\,\varphi$ (something good eventually happens).

### 2. Model Checking
Exhaustive search of the state space (Kripke structure $M$) to check properties. BDDs and SAT solvers are used to mitigate state explosion.

---
## Figure
![Formal Verification Flowchart](/images/research/mathematics-model/2-3-formal-verification/figure-1.png)
*Figure 1: Kripke structure showing state transitions and verified safety paths.*
