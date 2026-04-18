---
title: "组合优化与 NP 难题突破"
date: 2026-04-17
draft: false
tags: ["组合优化", "NP困难", "近似算法", "分支定界", "量子优化"]
math: true
---

## 问题背景

旅行商问题（TSP）、集合覆盖、背包问题……这些问题的共同特征是：随着规模 $n$ 的增长，穷举搜索空间以阶乘或指数速度膨胀，使精确求解在实际时间内不可行。然而，实际工程（芯片布线、物流调度、蛋白质折叠）无不依赖对此类 NP 难问题的高质量近似解。

---

## 核心理论

### 1. 计算复杂性框架

**P** 类：能在多项式时间内求解的问题。  
**NP** 类：解可在多项式时间内验证。  
**NP 完全（NPC）**：属于 NP 且所有 NP 问题均可多项式归约至此。  
**NP 难（NPH）**：至少与 NPC 一样难；所有 NPC 问题均可归约至此。

Cook-Levin 定理：布尔可满足性问题（SAT）是第一个被证明为 NPC 的问题：
$$
\mathrm{SAT} = \{ \phi : \exists \mathbf{x} \in \{0,1\}^n,\; \phi(\mathbf{x}) = 1 \}
$$

问题 $A$ 多项式归约至 $B$（记 $A \leq_p B$）意味着：若 $B \in P$，则 $A \in P$。

### 2. 近似算法与近似比

近似算法在多项式时间返回解 $\hat{S}$，保证近似比（Approximation Ratio）：

$$
\rho = \max_{\text{实例}} \frac{\mathrm{OPT}(I)}{\mathrm{ALG}(I)} \leq \alpha \quad \text{（最小化问题）}
$$

代表性结果：
- **Vertex Cover**：2-近似 $\rightarrow$ 选取最大匹配的端点
- **Metric TSP**（Christofides 算法）：$\frac{3}{2}$-近似
- **Set Cover**（贪心）：$H_n = \sum_{k=1}^n \frac{1}{k} \approx \ln n$-近似

若 $P \neq NP$，则 Metric TSP 不存在 $(1 + \varepsilon/n)$-近似（Håstad 定理 for APX-hard 问题）。

### 3. 分支定界（Branch & Bound）

精确求解整数线性规划（ILP）的主流框架，以线性规划（LP）松弛为下界：

$$
\mathrm{LB}(v) = \min_{\mathbf{x} \in P_v} \mathbf{c}^\top \mathbf{x}, \quad P_v \supseteq S_v
$$

剪枝条件：若 $\mathrm{LB}(v) \geq \mathrm{UB}_{\text{全局}}$，则节点 $v$ 剪去。结合强有效不等式（Cutting Planes）和启发式上界，形成现代求解器（CPLEX、Gurobi）的核心。

### 4. QUBO 与量子退火

将组合优化问题编码为**二次无约束二元优化（QUBO）**：

$$
\min_{\mathbf{x} \in \{0,1\}^n} \mathbf{x}^\top \mathbf{Q} \mathbf{x}
$$

经 Ising 变换 $s_i = 2x_i - 1$，映射为 Ising 哈密顿量：

$$
H = -\sum_{i<j} J_{ij} s_i s_j - \sum_i h_i s_i
$$

量子退火（D-Wave）从高横向磁场出发绝热演化至 $H$，理论上可利用量子隧穿效应穿越经典能垒，以概率正比于 $e^{-H(s)/T}$ 在解空间中采样。

---

## 图示

![组合优化搜索树与近似解路径](/images/research/mathematics-model/2-2-combinatorial-optimization/figure-1.png)

*图 1：组合优化问题搜索树结构图。根节点为初始 LP 松弛，子节点为分支约束，颜色深度表示下界质量，剪枝分支以虚线标注；最优路径以金色主干高亮显示。*

---

## 研究前沿与挑战

- **参数化复杂性**：对问题的特定参数（如解的大小 $k$）设计固定参数可处理（FPT）算法，实现 $O(f(k) \cdot n^c)$ 时间复杂度。
- **近似困难性的精细化**：PCP 定理与唯一游戏猜想（UGC）为各类问题的近似比下界提供了统一框架。
- **量子优势验证**：QAOA（量子近似优化算法）在中等规模问题上是否能超越经典启发式方法，是当前量子计算的核心开放问题之一。

---

## 参考延伸

- Vazirani, V.V. (2001). *Approximation Algorithms*.
- Papadimitriou, C.H. (1994). *Computational Complexity*.
- Farhi, E. et al. (2014). A Quantum Approximate Optimization Algorithm. *arXiv*.
