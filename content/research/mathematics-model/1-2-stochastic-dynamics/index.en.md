---
title: "Stochastic Dynamics & Risk Quantification"
date: 2026-04-17
draft: false
tags: ["Stochastic Process", "Fokker-Planck", "Risk", "SDE"]
math: true
---

## Background
Real-world dynamical systems are constantly subject to noise—atmospheric turbulence, financial shocks, biological thermal noise. Stochastic dynamics treat randomness as an essential property to quantify evolutionary probability and extreme risks.

## Core Theory
### 1. Stochastic Differential Equations (SDE)
$$d\mathbf{X}_t = \mathbf{f}(\mathbf{X}_t, t)\, dt + \mathbf{G}(\mathbf{X}_t, t)\, d\mathbf{W}_t$$

### 2. Fokker-Planck Equation
$$\frac{\partial p}{\partial t} = -\sum_i \frac{\partial}{\partial x_i}(f_i \, p) + \frac{1}{2} \sum_{i,j} \frac{\partial^2}{\partial x_i \partial x_j}(D_{ij}\, p)$$

---
## Figure
![Probability Evolution of Stochastic Trajectories](images/research/mathematics-model/1-2-stochastic-dynamics/figure-1.png)
*Figure 1: Family of stochastic trajectories showing density and 95% confidence bands.*
