# Dark Lattice 素材清单 (Asset Inventory)

本文档详细列出了 Dark Lattice 博客项目所需的各种视觉设计素材。素材状态分为 `✅ 已就绪` (已存在于仓库中) 和 `⏳ 规划中` (待生成或添加)。

## 1. 核心设计素材 (Core Design Assets)

| 素材名称 | 存储路径 | 格式 | 分辨率 | 状态 | 关联组件/用途 | 核心风格 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Site Logo (SVG)** | `static/images/logo.svg` | SVG | 矢量 | ✅ 已接入 | `header.html`：全局页眉 Logo | 极简几何 |
| **Favicon (SVG)** | `static/images/icon.svg` | SVG | 矢量 | ✅ 已接入 | `head.html`：浏览器图标 | 极简几何 |
| **Blog UI Mockup** | `static/images/design/blog-list-ui-mockup.png` | PNG | 1440x900 | ✅ 已就绪 | 开发参考：博客列表页视觉原型 | 极简暗黑 |

## 2. UI 装饰与图标 (UI Decorations & Icons)

| 素材名称 | 存储路径 | 格式 | 状态 | 关联组件/用途 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Abstract Category** | `static/icons/abstract-category.png` | PNG | ✅ 已就绪 | 博客卡片：用于增强分类的视觉识别度 | 4 类抽象几何符号 |
| **Corner Mask** | `static/icons/tag-badge-mask.svg` | SVG | ⏳ 规划中 | 样式文件：用于实现 45 度切角标签 | CSS Mask 掩模（需手工绘制 SVG） |

## 3. 动效与交互资产 (Animation & Interaction Assets)

| 素材名称 | 存储路径 | 格式 | 状态 | 关联组件/用途 | 描述 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Shimmer Noise** | `assets/scss/_base.scss` | CSS | ✅ 已接入 | 全局磨砂玻璃效果的微弱微光动画 | 纯 CSS 实现，无需图片文件 |

---

## 4. 素材管理规范

1. **路径引用**：在 Hugo 模板中使用 `{{ "images/path/to/file.png" | relURL }}` 或引入变量后引用，严禁使用硬编码的绝对路径。
2. **格式优先**：
   * **图标/几何图形**：强制使用 **SVG** 保证视网膜屏幕下的绝对清晰。
   * **展示图/首图**：优先使用 **WebP** 格式以平衡质量与体积。
3. **命名约定**：全小写且使用连字符 `-`，如 `blog-list-ui-mockup.png`。

---
*更新日期：2026-06-18*
