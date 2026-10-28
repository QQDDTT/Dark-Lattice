---
trigger: always_on
description: "静态前端项目开发规范"
---

# 项目开发规范

## 1. 核心架构约束 (Core Architecture Constraints)
- **业务定位**: 极客赛博极简技术博客与前沿研究成果展示平台。
- **本地定位**: 本地开发环境（宿主机）仅作为**代码编辑与版本控制节点**。
- **GitHub Actions CI/CD 优先原则**: 本项目为纯前端静态网站应用。所有的生产环境部署必须通过 Commit 代码至主分支，由 `.github/workflows/deploy.yml` 自动化发布至 GitHub Pages。
- **运行环境限制**: 本地严格禁止安装和使用 Node.js、npm 等语言包管理器，本地自动化与预览依托 Windows 原生 PowerShell 与纯静态浏览器支持。

## 2. 行为准则 (Behavioral Guidelines)
- 在本地支持直接通过浏览器打开静态产物进行验证；发布变更时使用 `git commit` 与 `git push` 触发云端流水线。

## 3. 设计规范要求
- **全中文化**: 所有面向用户的日志、文档以及代码注释必须遵守中文规范（见全局约束）。

## 4. 专属部署规则 (Specific Deployment Rules)
- **部署模式**: GCP 模式 A（GitHub Pages 纯静态托管 + Cloudflare 边缘 CDN 加速）
- **服务类型**: Hugo / Vanilla 静态渲染的技术博客与文章知识库
- **网关路由**: `dark-lattice.evotensor.dev`

## 5. 终端设备适配规范 (Terminal Adaptation Spec)
- **全终端覆盖定位**: 博客全站必须原生适配**PC 宽屏桌面、iPad 平板与手机移动端竖屏**。
- **响应式断点与布局**:
  - **桌面端 ($\ge 1024\text{px}$)**：宽展卡片排版，左侧显示高对比度日期与分类图标，右侧主体呈现标题与摘要；
  - **移动端 ($< 768\text{px}$)**：卡片自动切换为垂直堆叠排版，日期移至标题上方，行间距保持 32px 呼吸留白；
  - **零横向滑溢**: 移动端强制约束视口，严禁产生横向滚动条；
  - **触控与安全区**: 移动端链接与标签点击热区保证 $\ge 44 \times 44\text{px}$，底部页脚严格兼容安全区（`env(safe-area-inset-bottom)`）。

## 6. 全域统一条款 (Workspace-wide Clauses)
- **README 规范**: 遵循 Evopoiesis/docs/specs/07-readme-convention.md（根 README 仅作简介，一级目录 README 写内容与目录结构，二级及以下目录禁止 README）。
- **GitHub 规范**: 遵循 Evopoiesis/docs/specs/08-github-conventions.md（同名仓库、main 分支、统一 SSH 远端）。
- **密钥管理**: 遵循 Evopoiesis/docs/specs/09-secrets-management.md（本地凭据留在项目目录并由 .gitignore 防提交，仓库内严禁出现真实密钥）。
