# Dark Lattice 动画设计规范 (Animation Design Specifications)

本文档定义了 Dark Lattice 博客的动态交互规范，旨在通过精准的物理动效增强“极简暗黑”风格的表现力。

## 1. 核心动效原则 (Core Principles)

*   **物理律动 (Physicality)**：使用非对称的缓动曲线（如 Quintic Out），模拟真实物体的起动与停顿感。
*   **克制至上 (Restraint)**：避免不必要的视觉干扰，仅在用户需要时通过微弱的交互反馈（如 Hover、Focus）提供提示。
*   **连贯性 (Continuity)**：组件之间的状态切换应是无缝的流转，而非生硬的跳转。

## 2. 全局进入动画 (Global Entrance)

### 2.1 阶梯式淡入 (Staggered Fade-In)
*   **对象**：页面主要容器、博客/项目卡片。
*   **参数**：
    *   **初始状态**：`opacity: 0`, `transform: translateY(10px)`。
    *   **结束状态**：`opacity: 1`, `transform: translateY(0)`。
    *   **缓动曲线**：`cubic-bezier(0.22, 1, 0.36, 1)` (Quintic Out)。
    *   **延迟策略**：`50ms * index`。

## 3. 交互响应 (Interactive Feedback)

### 3.1 悬停反馈 (Hover)
*   **边框微调**：边框颜色平滑过渡至 `#3f3f46`（由底层样式决定），过渡时间 `200ms`。
*   **内容偏移**：卡片悬停时不使用夸张 of 缩放，保持布局稳定性。

## 4. 技术实现方案 (Technical Stack)

### 4.1 CSS Transitions & Animations
*   全部使用 CSS 实现过渡与关键帧动画，以确保最佳的渲染性能与 GPU 加速支持。
*   **主要属性**：`transition: border-color 0.2s ease, opacity 0.3s ease, transform 0.3s ease`。

## 5. 性能与降级 (Performance & Graceful Degradation)

*   **减少动态效果 (Reduced Motion)**：若检测到 `prefers-reduced-motion`，自动禁用所有 CSS Transform 位移，仅保留极简的 Fade 效果。
*   **层级加速**：对所有含过渡动效的元素应用 `will-change: opacity`，避免引起重排和重绘。

---
*更新日期：2026-06-18*
