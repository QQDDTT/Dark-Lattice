# Dark Lattice 设计概览

## 1. 项目愿景 (Vision)
**Dark Lattice** 是一个面向研究者与开发者的极客风格博客。它不仅是一个内容展示平台，更是个人技术品味与研究深度的视觉延伸。

- **核心关键词**：克制、专业、未来感、3D 沉浸交互。
- **视觉风格**：基于 "Nightfield"（夜场）主题，构建 **3D 沉浸式格阵 (3D Immersive Lattice)**，通过动态空间感的列表交互实现视觉深度的跃迁。

---

## 2. 设计规范 (Design System)

### 2.1 色彩方案
我们采用 **Nightfield Color Palette**，通过 60-30-10 法则分配比例：

| 角色 | 色名 | 色值 | 示例 |
| :--- | :--- | :--- | :--- |
| **背景 (60%)** | 极夜深空 (Space Black) | `#0F172A` | 主背景、深色区域 |
| **主色 (30%)** | 科技蓝 (Cyber Blue) | `#3B82F6` | 链接、按钮、强调文字 |
| **辅助 (10%)** | 神秘紫 (Mystic Purple) | `#8B5CF6` | 装饰线条、特殊标签 |

### 2.2 字体规范
- **标题**：`Inter` / `Source Code Pro`（体现工程师的严谨感）。
- **正文**：`Roboto` 或 系统默认无衬线字体。
- **代码**：`Fira Code`（支持连字，提升阅读体验）。

### 2.3 间距与留白
- 采用 **8px 栅格系统**。
- 强调“呼吸感”：在大块内容之间通过足够的留白（Margin/Padding）来减轻视觉压力。

---

## 3. 技术方案 (Tech Stack)

- **生成器**：Hugo (Extended Version)
- **样式**：Vanilla CSS / SCSS
- **交互**：Vanilla JS + CSS Animations
- **部署**：GitHub Pages / Vercel

---

## 4. 交互与体验规范

### 4.1 页面转场动画
- **入场方式**：页面加载时采用容器级 `fade-in` + `slide-up (10px)` 效果。
- **持续时间**：`300ms`, 缓动函数 `cubic-bezier(0.4, 0, 0.2, 1)`。

### 4.2 无障碍设计 (A11y)
- **对比度**：正文文字与背景对比度必须 $\ge 7:1$（符合 WCAG AAA 级）。
- **焦点态**：所有交互元素在 `:focus-visible` 时需显示 `2px` 的科技蓝轮廓线。
- **语义化**：严禁无语义的 `div` 堆砌，必须正确使用 `article`, `section`, `nav` 等 HTML5 标签。

---

## 5. 插图与图表规范 (Illustration & Diagram Specs)

为了保持全站视觉的一致性与专业感，所有插图与图表应遵循以下规范：

- **Mermaid 图表**：
  - 必须包含 `classDef` 定义配色方案。
  - 背景色使用 `Space Black` (#0F172A)，边框使用 `Cyber Blue` (#3B82F6)。
  - 尽量使用 `graph LR` 布局以减少纵向空间占用，保持文档整洁。
- **UI Mockups / 3D 渲染图**：
  - 必须采用**赛博极简风格**。
  - 避免凌乱的装饰与 AI 生成的乱码文字。
  - 色调以深色 (Slate 900) 为主，辅以高饱和度的科技蓝与神秘紫发光效果。

---

## 6. 核心理念

> "In the lattice of dots, truth hides in the darkness."
> 在点的格阵中，真相潜藏于黑暗。

我们追求的是一种**冷静的交互**。没有冗余的动画，只有在用户需要时才出现的精准反馈。

---

## 相关文档
- [项目结构规范](./PROJECT_STRUCTURE.md)
- [首页设计文档](./HOME_PAGE_DESIGN.md)
- [博客设计文档](./BLOG_DESIGN.md)

*更新时间：2026-04-16*
