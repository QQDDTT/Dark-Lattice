# 项目结构规范 (Project Structure)

## 1. 核心目录树 (Hugo Framework)

```text
/
├── assets/             # 需经处理的资源 (SCSS, JS Bundling, Images Processing)
├── content/            # 内容源文件 (Markdown)
│   ├── posts/          # 博客文章
│   └── research/       # 研究论文/报告
│       └── <专题名称>/  # 专题目录 (如 technology)
│           └── <课题名称>/ # 课题目录 (如 thinking-os)
│               └── <内容文件> # 索引文件 index.md 及资源
├── data/               # 静态数据文件 (YAML, JSON, TOML)
├── docs/               # 项目设计文档 (当前所在目录)
├── i18n/               # 国际化翻译文件 (TOML)
├── layouts/            # 页面 HTML 模板 (Overriding theme)
│   ├── _default/       # 默认布局
│   └── partials/       # 可复用组件 (Header, Footer, Nav)
├── public/             # 编译生成的静态网站 (仅限部署)
├── static/             # 直接复制的静态资源 (Favicon, Robots.txt)
├── themes/             # 外部主题 (作为 Git Submodule)
├── .devcontainer/      # 开发容器配置 (Code-ready environment)
│   ├── devcontainer.json # 容器核心定义 (Hugo, Node.js, Git)
│   └── Dockerfile      # 可选的自定义镜像构建定义
└── hugo.toml           # 全局配置文件
```
---

## 2. 命名规范与目录深度 (Naming & Hierarchy)

### 2.1 统一命名规则
- **专题与课题目录**：必须采用 `kebab-case`（全小写字母，单词间用连字符 `-` 连接）。
  - 正确示例：`interaction/gestural-interface`
  - 错误示例：`Interaction/Gestural_Interface`, `1.1-gestures`
- **文件命名**：内容索引统一使用 `index.md`（及其语言后缀如 `index.en.md`）。

### 2.2 研究文章结构
严格遵循三级路径：`content/research/<专题名称>/<课题名称>/<内容文件>`。
- 每个课题应为一个独立的 Bundle，包含其专属的图片和附件。

---

## 3. 文档目录规范 (`docs/`)

设计文档采用扁平化管理，以便于快速查阅：

| 文件名 | 描述 |
| :--- | :--- |
| **DESIGN_OVERVIEW.md** | 全局视觉与技术愿景 |
| **I18N_DESIGN.md** | 国际化与翻译逻辑 |
| **BLOG_DESIGN.md** | 博客功能与学术支持细节 |
| **HOME_PAGE_DESIGN.md** | 首页布局与交互设计 |
| **PHOTO_DESIGN.md** | 个人形象视觉与后期规范 |
| **LOGO_DESIGN.md** | 品牌 LOGO 理念与应用 |
| **PROJECT_STRUCTURE.md** | 目录结构与工程规范 (当前文件) |

---

## 3. 资源管理规范

### 3.1 图片资源
- 所有的博客首图存放在 `assets/images/posts/`。
- 形象照存放在 `static/images/avatar.png`。

### 3.2 样式 (CSS/SCSS)
- 全局变量定义在 `assets/scss/_variables.scss`。
- 采用 **BEM** 命名规范进行 SCSS 类名编写。

### 3.3 仓库分支管理
- `main`：存放源代码（Markdown, Layouts, Assets）。
- `gh-pages`：由 CI 自动生成的静态产物预览。

### 3.4 外部资源安全 (SRI)
- 所有的外部 CDN 资源（如 KaTeX, GSAP）必须包含 `integrity` 校验哈希。
- 更新资源版本时，务必通过 [sri.hash.guide](https://sri.hash.guide/) 等工具更新对应的哈希值，防止加载失败。

---

## 相关文档
- [设计概览](./DESIGN_OVERVIEW.md)
- [首页设计文档](./HOME_PAGE_DESIGN.md)
- [博客设计文档](./BLOG_DESIGN.md)

*更新时间：2026-04-16*
