---
title: "確率動力学とリスク定量化"
date: 2026-04-17
draft: false
tags: ["確率過程", "Fokker-Planck", "リスク定量化", "確率微分方程式"]
math: true
---

## 背景
現実世界のシステムは常にノイズ（大気擾乱、金融ショック、熱雑音など）に曝されています。確率動力学は、ランダム性を誤差ではなく本質として扱い、進化確率とリスクを定量化します。

## 核心理論
### 1. 確率微分方程式 (SDE)
$$d\mathbf{X}_t = \mathbf{f}(\mathbf{X}_t, t)\, dt + \mathbf{G}(\mathbf{X}_t, t)\, d\mathbf{W}_t$$

### 2. Fokker-Planck 方程式
確率密度 $p(\mathbf{x}, t)$ の時間発展を記述します。

---
## 図示
![確率進化のファンチャート](images/research/mathematics-model/1-2-stochastic-dynamics/figure-1.png)
*図 1：単一始点からの確率軌道群と信頼区間。*
