---
title: "压缩感知与信息稀疏性"
date: 2026-04-17
draft: false
tags: ["信号处理", "压缩感知", "稀疏表示", "优化理论"]
math: true
---

## 问题背景

经典的奈奎斯特-香农（Nyquist-Shannon）采样定律规定：为了无失真重构信号，采样频率必须大于信号带宽的两倍。然而，在医学 MRI、超大规模空天遥感、地下勘探等领域，物理采样成本极高或速度极其受限。

压缩感知（Compressive Sensing, CS）颠覆了这一传统观念。它指出：**只要信号在某个基下是稀疏的（即大部分系数为零或接近零），我们就能够以远低于奈奎斯特频率的采样率采集数据，并通过复杂的非线性算法将其完美还原。**

---

## 核心理论

### 1. 稀疏性 (Sparsity) 与测量方程

设信号 $x \in \mathbb{R}^N$ 在基矩阵 $\Psi$ 下可以表示为 $x = \Psi s$。如果 $s$ 中仅有 $K \ll N$ 个非零项，则称 $x$ 是 $K$-稀疏的。
我们通过一个测量矩阵 $\Phi \in \mathbb{R}^{M \times N}$（其中 $M \ll N$）获得观测值 $y$：
$$
y = \Phi x = \Phi \Psi s = \Theta s
$$
这是一个欠定方程组，通常有无数个解。

### 2. 受限等距性质 (Restricted Isometry Property, RIP)

为了使 $s$ 能够从被严重降维的测量值 $y$ 中恢复，测量矩阵 $\Phi$ 与稀疏基 $\Psi$ 的乘积矩阵 $\Theta$ 必须满足 RIP 条件。这意味着对于任意 $K$-稀疏向量 $s$，变换过程必须近似保持其能量：
$$
(1-\delta_K)\|s\|_2^2 \leq \|\Theta s\|_2^2 \leq (1+\delta_K)\|s\|_2^2
$$
随机矩阵（如高斯随机矩阵）以极大概率满足该性质。

### 3. $L_1$ 范数最小化重构

找到最稀疏的解本质上是一个 $L_0$ 范数最小化问题（NP-Hard）。CS 的核心成就证明了在一定条件下，它可以被松弛为凸优化问题——$L_1$ 迷宫：
$$
\min \|s\|_1 \quad \text{subject to} \quad y = \Theta s
$$
其中 $\|s\|_1 = \sum |s_i|$。由于 $L_1$ 范数的等值线是“带棱角的”，它更容易在坐标轴上产生解，从而产生稀疏性。常用算法包括基追踪 (Basis Pursuit) 和正交匹配追踪 (OMP)。

---

## 图示

![压缩感知稀疏重构散点图](images/research/mathematics-model/4-3-compressive-sensing/figure-1.png)

*图 1：信息稀疏重构的几何示意图。展示了在由少量测量值定义的超平面与 $L_1$ 范数（菱形）接触时，如何精准捕获到位于坐标轴上的稀疏解，背景散点代表原始高维信号分量的能量分布。*

---

## 研究前沿与挑战

- **感知矩阵的物理实现**：如何在单像素相机或 MRI 梯度线圈中物理地实现满足 RIP 的随机编码掩码。
- **深度压缩感知 (Deep CS)**：利用生成对抗网络 (GAN) 等神经网络学习自适应的非线性“稀疏基”，以进一步降低采样率。
- **实时性重构**：对于动态视频流，如何开发比传统内点法快几个数量级的基于投影梯度下降或交替方向乘子法 (ADMM) 的重构算法。

---

## 参考延伸

- Donoho, D. L. (2006). Compressed sensing. *IEEE Transactions on Information Theory*.
- Candès, E. J. & Wakin, M. B. (2008). An introduction to compressive sampling.
- Foucart, S. & Rauhut, H. (2013). *A Mathematical Introduction to Compressive Sensing*.
- Baraniuk, R. G. (2007). Compressive sensing. *IEEE Signal Processing Magazine*.
 drug-delivery systems and economic models.
