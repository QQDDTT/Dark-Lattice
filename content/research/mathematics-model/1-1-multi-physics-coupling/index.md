---
title: "跨尺度多物理场耦合"
date: 2026-04-17
draft: false
tags: ["数学建模", "多物理场", "耦合", "偏微分方程"]
math: true
---

## 问题背景

自然界中的真实物理系统极少单独遵循某一物理定律，而是多种场的交织作用结果。从微芯片中的热-电耦合，到风力涡轮机叶片的气动-结构耦合，再到人体骨骼的流-固-生物耦合——跨尺度多物理场建模是现代工程计算的核心挑战。

核心难点在于不同物理场往往拥有差异悬殊的特征时间与空间尺度，直接离散化会使自由度数目爆炸式增长。

---

## 核心理论

### 1. 多场耦合的算子分解

设系统由场 $\mathbf{u}_1, \mathbf{u}_2, \ldots, \mathbf{u}_n$ 描述，每场满足自身的偏微分算子 $\mathcal{L}_i$，场间通过耦合项 $\mathcal{C}_{ij}$ 交互：

$$
\mathcal{L}_i(\mathbf{u}_i) + \sum_{j \neq i} \mathcal{C}_{ij}(\mathbf{u}_j) = \mathbf{f}_i, \quad i = 1, \ldots, n
$$

对于热-结构耦合，温度场 $T$ 与位移场 $\mathbf{d}$ 的耦合系统写作：

$$
\rho c_p \frac{\partial T}{\partial t} - \nabla \cdot (\kappa \nabla T) = -T_0 \alpha \frac{\partial (\nabla \cdot \mathbf{d})}{\partial t}
$$

$$
\nabla \cdot \boldsymbol{\sigma} + \mathbf{b} = \rho \ddot{\mathbf{d}}, \quad \boldsymbol{\sigma} = \mathbb{C} : \boldsymbol{\varepsilon} - \alpha (T - T_0) \mathbf{I}
$$

### 2. 分区迭代求解（Partitioned Approach）

将耦合问题分割为若干单场子问题交替求解，通过界面条件传递耦合信息：

$$
\mathbf{u}_i^{(k+1)} = \mathcal{S}_i\!\left(\mathbf{u}_j^{(k)},\ j \neq i\right)
$$

其中 $\mathcal{S}_i$ 为第 $i$ 个子问题的求解算子。收敛判据为：

$$
\max_i \left\| \mathbf{u}_i^{(k+1)} - \mathbf{u}_i^{(k)} \right\| < \varepsilon_{\mathrm{tol}}
$$

加速收敛常用 **Aitken 动态松弛因子**：

$$
\omega^{(k+1)} = -\omega^{(k)} \frac{(\mathbf{r}^{(k)})^\top (\mathbf{r}^{(k+1)} - \mathbf{r}^{(k)})}{\left\| \mathbf{r}^{(k+1)} - \mathbf{r}^{(k)} \right\|^2}
$$

### 3. 均匀化理论（Homogenization）

对于具有周期性微结构的复合材料，通过双尺度渐近展开分离宏观尺度 $\mathbf{x}$ 和微观尺度 $\mathbf{y} = \mathbf{x}/\varepsilon$：

$$
\mathbf{u}^\varepsilon(\mathbf{x}) = \mathbf{u}^0(\mathbf{x}) + \varepsilon \mathbf{u}^1(\mathbf{x}, \mathbf{y}) + \varepsilon^2 \mathbf{u}^2(\mathbf{x}, \mathbf{y}) + \cdots
$$

有效（均匀化）弹性张量由微结构单元胞问题给出：

$$
C^{\mathrm{eff}}_{ijkl} = \frac{1}{|Y|} \int_Y \left( C_{ijpq} - C_{ijmn} \frac{\partial \chi^{kl}_m}{\partial y_n} \right) dY
$$

其中 $\boldsymbol{\chi}^{kl}$ 为单元胞特征位移，满足弱形式的微尺度问题。

---

## 图示

![多物理场能量传递层次结构](/images/research/mathematics-model/1-1-multi-physics-coupling/figure-1.png)

*图 1：从量子尺度→介观尺度→宏观流体尺度的多层能量传递结构示意图。三层同心环代表不同尺度的物理场，箭头粗细与密度表征能量交换强度与方向。*

---

## 研究前沿与挑战

- **强耦合非线性**：材料属性随温度、应力场剧烈变化，分区法收敛性无法保证，需借助整体单元法（Monolithic）并采用 Newton-Krylov 求解器。
- **降阶建模（ROM）**：高维耦合问题的实时仿真依赖基于 POD-Galerkin 或机器学习的降阶代理模型。
- **不确定性量化（UQ）**：材料参数与边界条件的随机性需通过 PCE（多项式混沌展开）或蒙特卡洛方法传播至输出场。

---

## 参考延伸

- Zienkiewicz, O.C. (2014). *The Finite Element Method*, Vol. 1-3.
- Fish, J. (2014). *Practical Multiscaling*.
- Bazilevs, Y. et al. (2013). Computational Fluid-Structure Interaction.
