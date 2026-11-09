# 安全策略与零信任边界声明 (Security Policy)

> **所属项目**：`Dark-Lattice`（Public 展示门户）  
> **安全治理基准**：遵循 [`Aegis-Sec`](../Aegis-Sec/README.md) 零信任纵深防御规约与 [`Evopoiesis`](../Evopoiesis/README.md) 密钥管理规范（`SPEC-09`）

---

## 1. 支持版本 (Supported Versions)

| 版本分支 | 状态 | 安全更新支持 |
| :--- | :---: | :--- |
| `main` (HEAD) | Active | ✅ 持续接收 Hugo 模板安全加固、SRI 完整性校验更新与依赖审计 |
| `gh-pages` | Active | ✅ 由 GitHub Actions 自动编译生成的纯静态生产分支 |
| 历史归档快照 | Archived | ❌ 仅作版本溯源，不提供回溯补丁 |

---

## 2. 安全漏洞私密上报机制 (Reporting a Vulnerability)

**请勿通过公开的 GitHub Issue、Pull Request 或公共讨论区披露任何潜在的安全漏洞、凭据泄露或越权缺陷。**

若您在 `Dark-Lattice` 博客门户（`dark-lattice.evotensor.dev`）或其源码仓库中发现安全隐患，请遵循以下私密响应流程：
1. **GitHub 私密漏洞报告（首选）**：通过仓库顶部的 **Security** $\rightarrow$ **Report a vulnerability**（Private Vulnerability Reporting）提交详细复现路径与影响评估；
2. **紧急响应与吊销**：若发现任何疑似未脱敏凭据或敏感配置痕迹，系统将立即执行 **「先吊销、后清理（Revoke-First, Purge-Second）」** 铁律，秒级作废相关令牌并重写 Git 历史；
3. **响应时效**：收到报告后 **24 小时内**确认受理，**72 小时内**完成根因定级（CVSS v3.1）并发布热修复补丁。

---

## 3. 公开门户零信任安全红线与静态 SRI 规约 (Public Portal Security Boundaries)

作为面向公众开放的 `PUBLIC` 静态门户，本项目严格执行以下五道安全防线：

| 防线维度 | 强制执行规约 |
| :--- | :--- |
| **🔒 静态资源 SRI 完整性校验** | 所有外部引入的 CDN 静态资源（如 KaTeX 数学渲染引擎、GSAP 动画库、字体样式表）必须配置 `integrity="sha384-..."` 子资源完整性哈希（SRI）与 `crossorigin="anonymous"`，严防 CDN 供应链投毒（详见 [`PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md)）。 |
| **🔑 公开仓库零敏感信息** | 本仓库为 100% 公开（Public）仓库，严禁提交任何私有仓库源码、内网 IP/端口拓扑、API 密钥、`.env` 文件或未脱敏的业务数据。 |
| **🛡️ 边缘 CDN 与 HTTPS 强制加密** | 生产站点 `dark-lattice.evotensor.dev` 通过 Cloudflare 边缘节点与 GitHub Pages 托管，全站强制启用 TLS 1.3 / HTTPS 加密传输与安全响应头。 |
| **🐳 容器化编译隔离** | 本地容器构建（`.devcontainer` / 画像 B）与 GitHub Actions CI/CD 均采用固定版本 Hugo Extended 镜像，禁用特权模式。 |
| **🤖 静态渲染防 XSS** | 严格遵循 Hugo `html/template` 上下文自动转义机制，严禁对不可信外部输入滥用 `safeHTML` 或 `safeJS` 过滤器。 |
