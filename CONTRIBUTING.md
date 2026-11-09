# 开发与智能体协同贡献指南 (Contributing Guide)

> **所属项目**：`Dark-Lattice`  
> **治理规范**：遵循 [`Evopoiesis`](../Evopoiesis/README.md) 全域生命周期规约与 [`.agents/rules/AGENTS.md`](.agents/rules/AGENTS.md)

欢迎参与 `Dark-Lattice`（暗格）极客技术博客与研究门户的演进与内容创作。本项目采用 **「人类研究者 + 多智能体结对编程（Human-Agent Pair Programming）」** 模式，任何文章撰写、模板升级或样式调整均须严格遵守以下准则。

---

## 1. 双画像开发环境规范 (Dual-Profile Environment Setup)

开始任何开发或构建操作前，必须先通过 `hostname` 确认当前宿主机所属的**设备画像**（详见全局规则 `GEMINI.md` 第 2 节）：

| 设备画像 | 登记主机名 | 本地工具链与运行约定 | 生产构建与发布 |
| :--- | :--- | :--- | :--- |
| **画像 A：轻量宿主机** | `nick-swift-titan` | 本地作为轻量级 Markdown 创作、SCSS/HTML 编辑与纯静态预览节点，使用原生 **PowerShell / BAT**；**严禁安装 Docker 或 Node.js** | 推送 `main` 分支由 **GitHub Actions** 自动编译并发布至 GitHub Pages |
| **画像 B：容器工作站** | `Nick的计算机` | **一律在 Docker 容器内**（参考 `.devcontainer` 固定版本 Hugo 镜像）执行本地编译与预览；宿主机不直接安装语言工具链 | 推送 `main` 分支由 **GitHub Actions** 自动编译并发布至 GitHub Pages |

---

## 2. 内容创作与目录文档红线 (Content & README Rules)

1. **Page Bundle 二级路径与命名规范（详见 [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md)）**：
   - 所有项目名、课题名与文章目录名必须采用全小写 `kebab-case`；
   - **博客专栏**：严格遵循 `content/posts/<项目名>/<文章名>/index.md`（及多语种 `.en.md` / `.ja.md`）；
   - **研究论文**：严格遵循 `content/research/<课题名>/<文章名>/index.md`。
2. **README 四级铁律（`SPEC-07`）**：
   - **项目根目录 `README.md`**：包含动态 SVG 视觉横幅（`static/images/showcase/hero-banner.svg`）、徽章矩阵、核心特性、知识矩阵流转图、快速开始、一级目录导航与声明四件套入口，**严禁包含物理目录树字符**，总行数控制在 `90 ~ 180` 行；
   - **一级目录 `README.md`**：每个非隐藏一级目录（[`assets/`](assets/README.md)、[`content/`](content/README.md)、[`data/`](data/README.md)、[`docs/`](docs/README.md)、[`i18n/`](i18n/README.md)、[`layouts/`](layouts/README.md)、[`static/`](static/README.md)）必须包含 `README.md`；
   - **二级及更深目录**：**严禁创建 `README.md`**。
3. **外部资源 SRI 与数据防线**：
   - 引入任何外部 CDN 脚本或样式表必须附带 `integrity` SRI 哈希校验；单文件体积严格控制在 **5MB** 以内。

---

## 3. 提交流程与自动化校验 (Commit & Validation Workflow)

### 3.1 提交信息规范 (Commit Message Convention)
统一使用**中文**撰写 Git 提交信息，格式为：
```text
<类型>: <简明中文摘要>
```
- **允许类型**：`feat`（新专栏/新交互特性）、`fix`（版式或响应式修复）、`docs`（文档与声明升级）、`chore`（日常维护与 SEO 优化）。

### 3.2 提交前必跑自动化体检 (Pre-Push Validation)
在提交代码或推送远端仓库前，请运行 `Evopoiesis` 统一校验套件确保零违规：

```powershell
# 1. 校验 README 结构与根级四件套声明 (R1~R5)
powershell -ExecutionPolicy Bypass -File ..\Evopoiesis\scripts\validate-readme.ps1 -Project "Dark-Lattice"

# 2. 校验 Markdown 相对链接断链与术语合规
powershell -ExecutionPolicy Bypass -File ..\Evopoiesis\scripts\validate-docs.ps1 -Project "Dark-Lattice"

# 3. 校验 GitHub 远端、凭据防泄漏与数据防线 (G01~G14)
powershell -ExecutionPolicy Bypass -File ..\Evopoiesis\scripts\validate-github.ps1 -Project "Dark-Lattice"
```
