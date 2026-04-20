---
title: "Combinatorial Optimization & NP-Hardness"
date: 2026-04-17
draft: false
tags: ["Optimization", "NP-Hard", "Approximation Algorithms", "Quantum Optimization"]
math: true
---

## Background
Problems like TSP, set cover, and knapsack involve search spaces that explode factorially or exponentially. Modern engineering relies on high-quality approximation algorithms for these NP-hard challenges.

## Core Theory
### 1. Complexity Framework
- **P**: Polynomial time solvable.
- **NP**: Polynomial time verifiable.
- **NP-Hard**: At least as hard as any problem in NP.

### 2. Approximation Ratios
Algorithms return solutions with a guaranteed ratio: $\rho = \max \frac{\mathrm{OPT}}{\mathrm{ALG}}$.

### 3. QUBO & Quantum Annealing
Modeling combinatorial problems as Quadratic Unconstrained Binary Optimization for quantum solvers.

---
## Figure
![Optimization Search Tree](images/research/mathematics-model/2-2-combinatorial-optimization/figure-1.png)
*Figure 1: Search tree structure for branch-and-bound with optimal path highlighting.*
