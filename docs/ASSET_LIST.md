# Dark Lattice 素材清单 (Asset Inventory)

本文档详细列出了 Dark Lattice 博客项目所需的各种视觉设计素材。素材状态分为 `✅ 已就绪` (已存在于仓库中) 和 `⏳ 规划中` (待生成或添加)。

## 1. 核心设计素材 (Core Design Assets)

| 素材名称 | 存储路径 | 格式 | 分辨率 | 状态 | 关联组件/用途 | 核心风格 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Site Logo (SVG)** | `static/images/logo.svg` | SVG | 矢量 | ✅ 已接入 | `header.html`：全局页眉 Logo ('格阵核心'版) | 赛博极简 |
| **Favicon (SVG)** | `static/images/icon.svg` | SVG | 矢量 | ✅ 已接入 | `head.html`：浏览器图标 ('格阵核心'版) | 极简几何 |
| **Research Tech BG** | `static/images/design/research-tech-3d.png` | PNG | 1024x1024 | ✅ 已就绪 | `research/list.html`：技术专题 Hero 背景 | 3D 渲染，发光感 |
| **Research Interaction BG** | `static/images/design/research-interaction-3d.png` | PNG | 1024x1024 | ✅ 已就绪 | 备用素材：计划用于交互专题 Hero 背景 | 3D 渲染，流体感 |
| **Project Concept** | `static/images/design/project-scene-concept.png` | PNG | 1024x1024 | ✅ 已就绪 | 3D 模型设计的视觉参考原型 | 赛博极简，玻璃材质 |
| **Blog UI Mockup** | `static/images/design/blog-list-ui-mockup.png` | PNG | 1440x900 | ✅ 已就绪 | 开发参考：博客列表页视觉原型 | 赛博极简 |

## 2. UI 装饰与图标 (UI Decorations & Icons)

| 素材名称 | 存储路径 | 格式 | 状态 | 关联组件/用途 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Abstract Category** | `static/icons/abstract-category.png` | PNG | ✅ 已就绪 | 博客卡片：用于增强分类的视觉识别度 | 4 类抽象几何符号 (六边、波形、环形、树状) |
| **Lattice Grid** | `static/images/background-grid.png` | PNG | ✅ 已接入 | `_base.scss` `body` 背景层，`background-repeat: repeat` + `blend-mode: overlay` | 赛博格阵，带发光节点 |
| **Corner Mask** | `static/icons/tag-badge-mask.svg` | SVG | ⏳ 规划中 | `_research.scss`：用于实现 45 度切角标签 | CSS Mask 掩模（需手工绘制 SVG）|

## 3. 动效与交互资产 (Animation & Interaction Assets)

| 素材名称 | 存储路径 | 格式 | 状态 | 关联组件/用途 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Light Beam** | `static/images/card-light-beam.png` | PNG | ✅ 已接入 | `_research.scss` `.research-card::after`，Hover 时 `opacity: 0.15`, `mix-blend-mode: screen` | 对角发光光束，蓝色渐变，黑色背景 |
| **Project Model** | `static/models/project-scene-base.glb` | GLB | ⏳ 规划中 | `research/single.html`：项目详情页的交互场景 | 低多边形 3D 模型（[参考制作规范](./3D_MODEL_SPEC.md)）|
| **Shimmer Noise** | `assets/scss/_base.scss` | CSS | ✅ 已接入 | `_base.scss` `.glass::before` 动画，`@keyframes shimmer` | 纯 CSS 实现，无需图片文件 |

---

## 4. 素材管理规范

1.  **路径引用**：在 Hugo 模板中使用 `{{ "images/path/to/file.png" | relURL }}` 或引入变量后引用，严禁使用硬编码的绝对路径。
2.  **格式优先**：
    *   **图标/几何图形**：强制使用 **SVG** 以保证视网膜屏幕下的绝对清晰。
    *   **3D 背景/图片**：优先使用 **WebP**，提供 **PNG** 作为降级方案。
3.  **命名约定**：全小写且使用连字符 `-`，如 `research-tech-3d.png`。
4.  **透明度处理**：动效层素材需保留不小于 10% 的透明边距，以应对 CSS 变换（如倾斜、缩放）时的边缘裁剪。

---
*更新日期：2026-04-17*
*状态统计：已接入 (11) / 规划中 (1)*
*更新日期：2026-04-17（完成接入：background-grid、card-light-beam、shimmer-用 CSS 动画实现）*
