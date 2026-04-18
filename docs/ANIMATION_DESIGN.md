# Dark Lattice 动画设计规范 (Animation Design Specifications)

本文档定义了 Dark Lattice 博客的动态交互规范，旨在通过精准的物理动效增强“赛博极简”风格的表现力，并驱动生成的 3D 素材。

## 1. 核心动效原则 (Core Principles)

*   **物理律动 (Physicality)**：使用非对称的缓动曲线（如 Quintic Out），模拟真实物体的起动与停顿感。
*   **空间感 (Spatiality)**：通过 Z 轴位移、景深（Blur）切换和视差效果，构建层级深度。
*   **连贯性 (Continuity)**：组件之间的状态切换应是无缝的流转，而非生硬的跳转。

## 2. 全局进入动画 (Global Entrance)

### 2.1 阶梯式淡入 (Staggered Fade-In)
*   **对象**：博客卡片、研究课题项。
*   **参数**：
    *   **初始状态**：`opacity: 0`, `transform: translateY(20px) scale(0.98)`。
    *   **结束状态**：`opacity: 1`, `transform: translateY(0) scale(1)`。
    *   **缓动曲线**：`cubic-bezier(0.22, 1, 0.36, 1)` (Quintic Out)。
    *   **延迟策略**：`50ms * index`。

## 3. 3.D 素材驱动 (Driving 3D Assets)

针对不同性能环境，采用以下三层级驱动策略：

### 3.1 层次化驱动方案 (Tiered Strategy)

*   **L1 - 核心回退 (Core Fallback)**：
    *   适用：移动端、低功耗模式。
    *   实现：展示静态渲染图，仅保留基础的 Fade 进入效果。
*   **L2 - 增强互动 (Enhanced)**：
    *   适用：主流桌面浏览器。
    *   实现：使用 CSS/GSAP 驱动静态图片的 `transform: rotate` 与 `skew`，模拟 3D 轴向偏移与视差。
*   **L3 - 极致体验 (Premium)**：
    *   适用：高性能 WebGL 环境。
    *   实现：使用 Three.js 直接驱动模型或 Shader，实现动态粒子、流体形变及实时光路追踪。

### 3.2 呼吸感缓动动画 (Ambient Animation) --- (针对 L2/L3 层级)
*   **Technology (Tech 3D)**：
    *   **轴向旋转**：绕 Y 轴进行轻微的正弦波动旋转（±2deg），周期 8s。
    *   **发光呼吸**：发光边缘的亮度（Emissive Intensity）在 80% - 100% 之间平滑脉动。
*   **Interaction (Interaction 3D)**：
    *   **位移波动**：几何体在 Z 轴方向模拟细微的起伏，产生液体流动的错觉。
    *   **颜色偏移**：赛博蓝与神秘紫的交替辉光产生极缓慢的色相偏移。

### 3.3 滚动联动 (Scroll-Driven Parallax)
*   **视差率**：背景 3D 素材的滚动速度应为页面滚动速度的 0.4 倍。
*   **动态模糊**：随着滚动速度增加，背景 3D 素材可短暂应用 `backdrop-filter: blur(2px)` 模拟运动模糊。

## 4. 交互响应 (Interactive Feedback)

### 4.1 悬停探索 (Hover Exploration)
*   **3D 模型倾斜 (Tilt)**：当鼠标在卡片上移动时，背后的 3D 投影应跟随鼠标位置产生轻微的角度偏移（Max 5deg）。
*   **光效追踪**：卡片边框的高亮处应像光束一样跟随鼠标滑过的轨迹。

### 4.2 搜索扰动 (Search Disturbance)
*   **扰动效果**：当用户在搜索框输入时，3D 背景的几何阵列应产生“波纹扩散”效果。
*   **实现逻辑**：输入事件触发背景 Canvas 的扰动函数，使得 3D 模型产生高频、小振幅的抖动，随后平滑恢复。

## 5. 技术实现方案 (Technical Stack)

### 5.1 CSS & Web Animations API
*   用于简单的进入动画、Hover 状态切换。
*   **优势**：极低的性能损耗，GPU 加速。

### 5.2 GSAP (GreenSock)
*   用于控制 3D 背景的复杂滚动联动和序列动画。
*   **示例逻辑**：
  ```javascript
  gsap.to(".hero-3d", {
    scrollTrigger: {
      trigger: ".content",
      scrub: 1
    },
    rotationY: 45,
    ease: "none"
  });
  ```

### 5.3 Three.js (可选/进阶)
*   若直接驱动 3D 模型（而非图片），建议使用 `RequestAnimationFrame` 实时更新 Uniforms 数据。
*   **材质控制**：动态修改片元着色器中的时间参数 `uTime` 以驱动流体动效。

## 6. 性能与降级 (Performance & Graceful Degradation)

*   **低功耗模式**：若检测到 `prefers-reduced-motion`，自动禁用非必要的 3D 旋转和复杂视差，切换为静态背景。
*   **层级加速**：对所有动画元素应用 `will-change: transform, opacity`。

## 7. 脚本加载策略 (Script Loading Strategy)

*   **按需加裁**：GSAP 和 Three.js 不应包含在主 Bundler 中。
*   **条件注入**：仅在包含 3D 专题或复杂列表的页面，且检测到用户非“减少动态效果”模式下，再通过 Dynamic Import 注入相关库。

---
*更新日期：2026-04-17*
