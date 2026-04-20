---
title: "逻辑代数与形式化验证"
date: 2026-04-17
draft: false
tags: ["形式化验证", "模型检测", "时序逻辑", "定理证明", "安全关键系统"]
math: true
---

## 问题背景

波音 737 MAX 的 MCAS 软件缺陷造成两次空难；Intel Pentium 处理器的 FDIV 浮点除法错误损失数亿美元——在安全关键系统（航空航天、自动驾驶、医疗设备、操作系统内核）中，传统测试无法穷举所有状态，而一个遗漏的边界情况可能引发灾难性后果。形式化验证用数学证明代替测试，从逻辑上**保证** 系统满足规格。

---

## 核心理论

### 1. 命题与谓词逻辑基础

命题逻辑的语法形成布尔代数 $(\{0,1\}, \land, \lor, \neg)$，满足：

$$
A \land (B \lor C) \equiv (A \land B) \lor (A \land C)
$$

一阶谓词逻辑（FOL）引入量词，系统规格可表达为：

$$
\forall s \in S,\; \mathcal{I}(s) \Rightarrow \varphi(s)
$$

其中 $\mathcal{I}(s)$ 为初始条件谓词，$\varphi(s)$ 为安全性质。

### 2. 时序逻辑与系统规格

**线性时序逻辑（LTL）** 在无限时间线上描述系统行为，核心算子：

| 算子 | 符号 | 含义 |
|:----:|:----:|:-----|
| Next | $\mathbf{X}\,\varphi$ | 下一时刻 $\varphi$ 成立 |
| Until | $\varphi\,\mathbf{U}\,\psi$ | $\varphi$ 持续成立直到 $\psi$ 成立 |
| Globally | $\mathbf{G}\,\varphi$ | $\varphi$ 始终成立（安全性） |
| Finally | $\mathbf{F}\,\varphi$ | $\varphi$ 最终成立（活性） |

自动驾驶典型规格示例（非正式翻译）：
$$
\mathbf{G}(\text{紧急制动请求} \Rightarrow \mathbf{F}_{\leq 200\mathrm{ms}}\,\text{制动响应})
$$

**计算树逻辑（CTL）** 进一步对分支路径量化：$\mathbf{EF}\,\varphi$（存在某条路径最终满足 $\varphi$），$\mathbf{AG}\,\varphi$（所有路径上始终满足 $\varphi$）。

### 3. 模型检测（Model Checking）

**Kripke 结构**：$M = (S, S_0, R, L)$，其中 $S$ 为状态集，$R \subseteq S \times S$ 为转移关系，$L: S \to 2^{AP}$ 为标注函数。

CTL 公式 $\mathbf{AG}\,\varphi$ 的状态集计算：

$$
\llbracket \mathbf{AG}\,\varphi \rrbracket = \nu Z.\; \llbracket\varphi\rrbracket \cap \mathbf{pre}(Z)
$$

其中 $\nu$ 为最大不动点，$\mathbf{pre}(Z) = \{s : R(s) \subseteq Z\}$ 为前驱集算子。对有界状态空间，不动点在有限步内收敛。

**符号模型检测（BDD 方法）**：以有序二元决策图（OBDD）紧凑表示状态集和转移关系，将模型检测的空间复杂度从 $O(2^n)$ 降至 $O(n^2)$（典型情形）。

### 4. 有界模型检测（BMC）与 SAT 求解

将 "系统在 $k$ 步内违反性质 $\varphi$" 编码为 SAT 公式：

$$
\Psi_{k} = I(s_0) \wedge \bigwedge_{i=0}^{k-1} T(s_i, s_{i+1}) \wedge \neg \varphi(s_0, \ldots, s_k)
$$

若 $\Psi_k$ 可满足，则找到反例；若对所有 $k \leq k_{\max}$ 均不可满足，则在该界限内性质成立。现代 SAT 求解器（MiniSAT、Z3）可处理数百万变量的实例。

---

## 图示

![形式化验证状态机流程图](images/research/mathematics-model/2-3-formal-verification/figure-1.png)

*图 1：形式化验证的 Kripke 结构有向图。节点代表系统状态，颜色区分初始态（蓝）、安全态（绿）、违规态（红）；边权重代表转移概率，验证路径以粗线高亮标注。*

---

## 研究前沿与挑战

- **规模墙（State Explosion Problem）**：并发系统的状态空间以线程数指数爆炸，抽象精化（CEGAR）和偏序归约是主流缓解手段。
- **神经网络验证**：深度神经网络的验证（如对抗样本不存在性）可编码为混合整数线性规划（MILP），是当前 AI 安全的核心挑战。
- **概率模型检测**：对马尔可夫决策过程（MDP）和随机博弈的时序逻辑验证，需计算满足概率界 $\mathbf{P}_{\geq p}[\mathbf{F}\,\varphi]$ 的策略。

---

## 参考延伸

- Clarke, E.M., Grumberg, O. & Peled, D. (1999). *Model Checking*.
- Baier, C. & Katoen, J.P. (2008). *Principles of Model Checking*.
- Katz, G. et al. (2017). Reluplex: An Efficient SMT Solver for Verifying Deep Neural Networks.
