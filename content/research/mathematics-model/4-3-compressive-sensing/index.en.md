---
title: "Compressive Sensing & Information Sparsity"
date: 2026-04-17
draft: false
tags: ["Signal Processing", "Compressive Sensing", "Sparsity", "Optimization"]
math: true
---

## Background
Nyquist-Shannon sampling requires rates over twice the bandwidth. Compressive Sensing (CS) subverts this by proving that sparse signals can be recovered from far fewer measurements through non-linear optimization.

## Core Theory
### 1. Sparsity & Measurement
$y = \Phi x = \Phi \Psi s$. If $s$ is $K$-sparse, it can be recovered from $M \ll N$ measurements.

### 2. Restricted Isometry Property (RIP)
The measurement matrix must approximately preserve the energy of sparse vectors to allow reconstruction.

### 3. $L_1$ Norm Minimization
Recovering the signal via convex optimization: $\min \|s\|_1 \text{ s.t. } y = \Theta s$. The l1-norm promotes sparse solutions at the axes of the search space.

---
## Figure
![Sparse Reconstruction Scatter Plot](/images/research/mathematics-model/4-3-compressive-sensing/figure-1.png)
*Figure 1: Geometric illustration of sparse reconstruction showing the intersection of the measurement hyperplane and the l1-norm ball.*
