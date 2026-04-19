# 内容创作指南 (Content Creation Guide)

本文档旨在规范 Dark Lattice 的文章创作流程及 Front Matter 配置，确保不同语言版本的一致性。

## 1. 基础配置 (Common Front Matter)

所有文章（包含博客与研究报告）必须包含以下字段：

| 字段 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `title` | String | 文章标题 | `title = "极简主义下的 3D 渲染"` |
| `date` | Date | 发布日期 | `date = 2024-04-16T10:00:00+08:00` |
| `description` | String | 页面摘要（用于 SEO 和列表展示） | `description = "探讨如何平衡性能与视觉..."` |
| `categories` | Array | 顶级分类（如 Research, Engineering） | `categories = ["Engineering"]` |
| `tags` | Array | 标签 | `tags = ["Three.js", "WebGL"]` |
| `draft` | Boolean | 是否为草稿 | `draft = false` |

---

## 2. 研究报告专有字段 (Research Specific)

存放于 `content/research/` 的内容支持以下增强字段，用于生成学术摘要卡片。

| 字段 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `abstract` | String | 详细学术摘要（支持多行文字） | `abstract = "本文提出了一种基于..."` |
| `venue` | String | 发表机构、会议或专题名称 | `venue = "SIGGRAPH 2024"` |
| `thumbnail` | String | 列表页展示的封面图路径 | `thumbnail = "images/poster.png"` |
| `external_link` | URL | (可选) 指向外部 PDF 或项目主页 | `external_link = "https://example.com/paper.pdf"` |

---

## 3. 国际化 (I18N) 流程

1.  **文件命名**：
    - 中文 (默认): `index.md`
    - 英文: `index.en.md`
    - 日文: `index.ja.md`
2.  **资源引用**：
    - 将图片放置在文章文件夹内的本地。
    - 在 Markdown 中使用 `![Caption](image.png)` 引用，Hugo 会自动处理 Page Bundle。
3.  **公式与代码**：
    - 确保不同语言版本的 `katex` 公式和代码块保持同步。

---

## 4. 排版建议

- **中英文混排**：建议在中文与英文/数字之间手动添加一个空格（例如：`Three.js 引擎` 而非 `Three.js引擎`）。
- **数学公式**：行内公式使用 `$E=mc^2$`，块级公式使用 `$$ ... $$`。

*更新时间：2026-04-20*
