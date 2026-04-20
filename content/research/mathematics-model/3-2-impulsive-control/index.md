---
title: "脉冲控制与非连续调度"
date: 2026-04-17
draft: false
tags: ["控制理论", "脉冲系统", "离散调度", "非连续系统"]
math: true
---

## 问题背景

在许多物理系统中，控制作用并非持续施加，而是在某些离散时间点以脉冲的形式瞬间作用。例如，卫星的姿态调整推力器喷射、神经网络的脉冲刺激（Spiking）、以及具有固定采样频率的工业控制网络。

脉冲控制（Impulsive Control）研究如何通过有限次、非连续的干扰，使一个原本发散或不稳定的连续系统达到某种期望的平衡态。这种方式相比持续控制，具有更低的能耗和通信带宽需求。

---

## 核心理论

### 1. 脉冲系统的状态方程

一个典型的脉冲受控系统可描述为：
$$
\begin{cases}
\dot{x}(t) = f(t, x(t)), & t \neq t_k \\
\Delta x(t) = I_k(t, x(t)), & t = t_k \\
x(t_0^+) = x_0
\end{cases}
$$
其中，$\Delta x(t_k) = x(t_k^+) - x(t_k^-)$ 是状态在脉冲时刻 $t_k$ 的跳变。如果 $I_k$ 能够抵消系统的发散趋势，即使 $\dot{x} = f(x)$ 是不稳定的，整体系统依然可以稳定。

### 2. 离散调度问题 (Non-continuous Scheduling)

在多任务并发的嵌入式系统中，CPU 资源需要在不同控制回路间离散分配。这涉及如何安排脉冲观测与控制指令的施加时刻 $t_k$，以保证整体实时性。

调度逻辑通常遵循：
$$
t_{k+1} = t_k + h_k(\text{error}, \text{resource})
$$
当误差超出阈值（事件触发）或者达到固定周期（时间触发）时，系统才执行一次控制动作。

### 3. 混合 Lyapunov 泛函

对于含有脉冲的系统，寻找一个在连续段 $t \in (t_k, t_{k+1})$ 递增但在脉冲时刻 $t_k$ 大幅下降的函数 $V(t)$：
$$
V(t_k^+) \leq \rho V(t_k^-), \quad 0 < \rho < 1
$$
$$
\dot{V}(t) \leq \lambda V(t), \quad \lambda > 0
$$
系统的整体稳定性取决于脉冲间隔 $\delta = t_{k+1} - t_k$。为了保证收敛，脉冲间隔必须满足：
$$
\ln \rho + \lambda \delta < 0
$$
即脉冲带来的“降能”速度必须快于连续段能量增长的速度。

---

## 图示

![脉冲信号波形图](/images/research/mathematics-model/3-2-impulsive-control/figure-1.png)

*图 1：脉冲控制信号与系统状态轨迹的叠加图。垂直脉冲代表控制作用时刻的状态瞬时跳变，折线展示了在离散干预下系统如何从发散趋势被“拉回”到稳定边界。*

---

## 研究前沿与挑战

- **抖振消除 (Chattering Avoidance)**：在滑动模态脉冲控制中，如何避免脉冲频率过高导致的硬件损伤。
- **随机脉冲时刻**：当脉冲发生的时刻受网络延迟或丢包干扰时，如何利用蒙特卡洛方法评估稳定性概率。
- **事件触发机制 (Event-triggered)**：开发能够在线动态计算控制时刻 $t_k$ 的轻量化算法，以最大程度节省算力资源。

---

## 参考延伸

- Lakshmikantham, V. et al. (1989). *Theory of Impulsive Differential Equations*.
- Yang, T. (2001). *Impulsive Control Theory*.
- Tabuada, P. (2007). Event-triggered real-time scheduling of control tasks.
 drug-delivery systems and economic models.
