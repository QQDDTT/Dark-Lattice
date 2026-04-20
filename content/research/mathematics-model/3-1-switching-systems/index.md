---
title: "切换系统的稳定性分析"
date: 2026-04-17
draft: false
tags: ["控制理论", "切换系统", "Lyapunov 稳定性", "混合系统"]
math: true
---

## 问题背景

切换系统（Switching Systems）是一类重要的混合动力系统，由一组连续时间子系统和一个控制子系统间切换的逻辑规则组成。在电力电子、航空航天及多模态机器人领域，系统往往需要在不同的运行特征（如起飞、巡航、着陆）之间进行切换。

核心挑战在于：**即使所有子系统单独都是稳定的，不当的切换频率或顺序仍可能导致系统整体失稳；反之，通过合理的切换策略，也可以使一组不稳定的子系统达到稳定。**

---

## 核心理论

### 1. 切换系统的数学描述

考虑线性切换系统：
$$
\dot{x}(t) = A_{\sigma(t)} x(t)
$$
其中 $\sigma(t): [0, \infty) \to \{1, 2, \ldots, m\}$ 是切换信号，代表在 $t$ 时刻被激活的子系统索引 $i \in \mathcal{I} = \{1, \ldots, m\}$。

### 2. 共同 Lyapunov 函数 (Common Lyapunov Function, CLF)

如果存在一个正定矩阵 $P$，使得对于所有子系统索引 $i \in \mathcal{I}$，均满足：
$$
A_i^\top P + P A_i < 0
$$
则系统在任意切换信号下都是漸近稳定的。这种方法的局限在于 CLF 的存在性要求非常苛刻，许多实际系统并不存在共同的 Lyapunov 函数。

### 3. 多 Lyapunov 函数 (Multiple Lyapunov Functions, MLF)

通过为每个子系统 $i$ 分配独立的 Lyapunov 函数 $V_i(x) = x^\top P_i x$，并要求在每次切换到子系统 $i$ 的时刻，其能量水平必须低于上次离开该子系统时的能量。

设 $\sigma(t) = i$ 在时段 $[t_k, t_{k+1})$ 被激活，稳定性条件可表示为：
$$
V_{i}(x(t_{k+1})) \leq V_{i}(x(t_k))
$$
这导致了**平均驻留时间 (Average Dwell Time, ADT)** 的概念：
$$
\tau_a \geq \frac{\ln \mu}{\lambda_0}
$$
其中 $\mu$ 描述了切换瞬间的能量跳跃，$\lambda_0$ 为子系统的衰减速率。只要平均驻留时间足够长，系统就能抵消切换带来的扰动。

---

## 图示

![切换系统相轨迹](images/research/mathematics-model/3-1-switching-systems/figure-1.png)

*图 1：两个线性子系统间的切换相轨迹。虚线代表子系统各自的平衡态趋向，实线代表在高频切换下的整体复合轨迹，揭示了驻留时间对系统收敛性的决定性影响。*

---

## 研究前沿与挑战

- **任意切换稳定性**：寻找存在共同 Lyapunov 函数的充要条件，以及构造此类函数的数值方法（如 SOS 优化）。
- **受约束切换信号**：当切换信号受限于通信带宽或执行器物理特性时，如何设计补偿控制器。
- **数据驱动切换辨识**：从传感数据中逆向重构切换信号 $\sigma(t)$ 及各子系统的传递函数，特别是在噪声干扰较大的情况下。

---

## 参考延伸

- Liberzon, D. (2003). *Switching in Systems and Control*.
- Sun, Z. & Ge, S. S. (2011). *Stability Theory of Switched Dynamical Systems*.
- Lin, H. & Antsaklis, P. J. (2009). Stability and stabilizability of switched linear systems: a survey of recent results.
