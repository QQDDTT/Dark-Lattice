---
title: "Stability Analysis of Switching Systems"
date: 2026-04-17
draft: false
tags: ["Control Theory", "Switching Systems", "Lyapunov Stability", "Hybrid Systems"]
math: true
---

## Background
Switching systems consist of a set of continuous-time subsystems and a logic rule governing the switching between them. Integrating multiple stable subsystems may still lead to instability without proper switching signals; conversely, unstable subsystems can be stabilized through specific switching strategies.

## Core Theory
### 1. Mathematical Description
$\dot{x}(t) = A_{\sigma(t)} x(t)$, where $\sigma(t)$ is the switching signal.

### 2. Common Lyapunov Function (CLF)
A system is asymptotically stable under arbitrary switching if there exists a single positive definite matrix $P$ satisfying $A_i^\top P + P A_i < 0$ for all $i$.

### 3. Multiple Lyapunov Functions (MLF) & Average Dwell Time (ADT)
Stability can be guaranteed if the average time spent in each mode is long enough to dissipate the energy jump caused by switching: $\tau_a \geq \frac{\ln \mu}{\lambda_0}$.

---
## Figure
![Phase Trajectories of Switching Systems](images/research/mathematics-model/3-1-switching-systems/figure-1.png)
*Figure 1: Phase trajectories of two linear subsystems showing the impact of dwell time on overall convergence.*
