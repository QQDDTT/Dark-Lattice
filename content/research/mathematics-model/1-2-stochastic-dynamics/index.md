---
title: "随机动力学与风险量化"
date: 2026-04-17
draft: false
tags: ["随机过程", "Fokker-Planck", "风险量化", "随机微分方程"]
math: true
---

## 问题背景

真实世界的动力学系统无时无刻不受噪声干扰——大气湍流、金融市场的随机冲击、生物神经元的热噪声。随机动力学将随机性从"误差"提升为系统的本质属性，通过严格的数学框架定量描述系统的演化概率与极端事件的风险。

---

## 核心理论

### 1. 随机微分方程（SDE）

伊藤（Itô）形式的随机微分方程将确定性漂移与随机扩散分离：

$$
d\mathbf{X}_t = \mathbf{f}(\mathbf{X}_t, t)\, dt + \mathbf{G}(\mathbf{X}_t, t)\, d\mathbf{W}_t
$$

其中 $\mathbf{W}_t$ 为标准维纳过程（Brownian motion），满足 $d\mathbf{W}_t \sim \mathcal{N}(\mathbf{0},\, dt\cdot\mathbf{I})$。

伊藤引理给出函数 $V(\mathbf{X}_t, t)$ 的随机变分：

$$
dV = \left(\frac{\partial V}{\partial t} + \nabla_x V \cdot \mathbf{f} + \frac{1}{2} \mathrm{tr}\!\left[\mathbf{G}\mathbf{G}^\top \nabla^2_x V\right]\right) dt + \nabla_x V \cdot \mathbf{G}\, d\mathbf{W}_t
$$

### 2. Fokker-Planck 方程

系统状态的概率密度 $p(\mathbf{x}, t)$ 满足 Fokker-Planck（前向 Kolmogorov）方程：

$$
\frac{\partial p}{\partial t} = -\sum_i \frac{\partial}{\partial x_i}(f_i \, p) + \frac{1}{2} \sum_{i,j} \frac{\partial^2}{\partial x_i \partial x_j}(D_{ij}\, p)
$$

其中扩散张量 $\mathbf{D} = \mathbf{G}\mathbf{G}^\top$。一维线性系统（Ornstein-Uhlenbeck 过程）的稳态解为高斯分布：

$$
p_{\mathrm{ss}}(x) = \sqrt{\frac{\theta}{\pi \sigma^2}} \exp\!\left(-\frac{\theta x^2}{\sigma^2}\right)
$$

### 3. 风险量化：首通时间与尾部概率

极端事件（如结构失效、金融暴跌）可描述为状态首次越过阈值 $b$ 的时间 $\tau_b$：

$$
\mathbb{E}[\tau_b \mid X_0 = x] = -\frac{1}{\lambda} \ln\!\left(\frac{b - \mu_{\mathrm{ss}}}{x - \mu_{\mathrm{ss}}}\right)
$$

对高维系统，超越概率（Exceedance Probability）的尾部估计借助**鞍点近似**或**极值理论（EVT）**：

$$
\mathbb{P}(\max_{t \in [0,T]} X_t > b) \approx 1 - \exp\!\left(-\nu^+(b)\, T\right)
$$

其中 $\nu^+(b)$ 为向上穿越率（Rice formula）：

$$
\nu^+(b) = \int_0^\infty \dot{x}\, p(b, \dot{x})\, d\dot{x}
$$

### 4. 蒙特卡洛加速估计

朴素蒙特卡洛对低概率事件效率极差，**重要性采样（IS）**通过更改漂移项偏置采样：

$$
\mathbb{P}(A) = \mathbb{E}^{\mathbb{Q}}\!\left[\mathbf{1}_A \cdot \frac{d\mathbb{P}}{d\mathbb{Q}}\right], \quad \frac{d\mathbb{P}}{d\mathbb{Q}} = \exp\!\left(-\int_0^T \boldsymbol{\theta}_t^\top d\mathbf{W}^{\mathbb{Q}}_t - \frac{1}{2}\int_0^T \|\boldsymbol{\theta}_t\|^2 dt\right)
$$

---

## 图示

![随机轨迹演化的概率扇形分布](images/research/mathematics-model/1-2-stochastic-dynamics/figure-1.png)

*图 1：从单一初始点出发的随机系统轨迹族。颜色从冷色（低概率路径）渐变为暖色（高概率路径），外包络线对应 95% 置信带，右侧概率密度条图显示终态分布的统计权重。*

---

## 研究前沿与挑战

- **非高斯噪声**：Lévy 飞行、Poisson 跳跃等非高斯驱动使 Fokker-Planck 方程升为分数阶积分-微分方程，解析解极为稀少。
- **高维诅咒**：Fokker-Planck 数值求解在维度超过 5～6 时面临维度灾难，深度学习代理模型（如 DeepRitz、DGM）是突破方向。
- **数据驱动 SDE 辨识**：从有限观测数据中自动识别漂移与扩散函数是当前开放问题，SAINDy 等稀疏辨识方法正快速发展。

---

## 参考延伸

- Gardiner, C. (2009). *Stochastic Methods: A Handbook for the Natural and Social Sciences*.
- Øksendal, B. (2013). *Stochastic Differential Equations*.
- Kloeden, P.E. & Platen, E. (1992). *Numerical Solution of Stochastic Differential Equations*.
