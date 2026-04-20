---
title: "Impulsive Control & Non-continuous Scheduling"
date: 2026-04-17
draft: false
tags: ["Control Theory", "Impulsive Systems", "Discrete Scheduling", "Non-continuous System"]
math: true
---

## Background
In many systems, control is applied as instantaneous impulses rather than continuous forces. Impulsive control explores how to stabilize a system through discrete interventions at specific time points.

## Core Theory
### 1. Impulsive State Equations
$\Delta x(t_k) = x(t_k^+) - x(t_k^-) = I_k(x(t_k^-))$ represents the jump at impulse time $t_k$.

### 2. Hybrid Lyapunov Functionals
Stability is defined by the balance between the continuous growth rate and the discrete energy reduction at impulse points. Convergence is achieved if the "reset" at impulses outweighs the growth in the intervening periods.

---
## Figure
![Impulsive Control Waveforms](images/research/mathematics-model/3-2-impulsive-control/figure-1.png)
*Figure 1: Superposition of impulsive control signals and state trajectories, showing how discrete interventions "pull back" an otherwise divergent system.*
