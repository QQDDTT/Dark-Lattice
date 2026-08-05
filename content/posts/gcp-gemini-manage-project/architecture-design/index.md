---
title: "gcp-gemini-manage 核心架构设计：四项目环境路由与 Agent 协同闭环"
date: 2026-08-05
tags:
  - GCP
  - Gemini
  - Infrastructure
  - AI Agent
---

随着业务与 AI 实验室的规模扩展，管理 Google Cloud Platform (GCP) 上错综复杂的服务器实例、API 密钥与数据库成为一项艰巨的挑战。`gcp-gemini-manage` 项目应运而生，它并非单纯的自动化部署脚本集合，而是专门为了打通“底层云基础设施”与“上层 AI 智能体 (Agent)” 所设计的**运维中枢**。

本文将为您深度解析该项目的核心设计理念，包括 4 大独立项目架构模式，以及它是如何通过 Agent Skills 实现零接触闭环管理的。

## 企业级 4 大独立项目架构

在过去，开发、测试与生产资源往往混杂在单一的 GCP 项目下，这不仅带来了计费和权限审计上的困扰，更可能引发跨环境的误操作风险。`gcp-gemini-manage` 全面拥抱了多环境隔离理念，将整个业务划分为 4 个职责明确的微服务独立项目：

1. **AI Lab (`evotensor-ai-lab`)**
   专为大语言模型 (LLM) 的推理、GPU 挂载服务器以及 Gemini API Keys 分配而设。该环境承担了所有高密集度的 AI 计算任务，是整个系统的“大脑工厂”。

2. **Data Core (`evotensor-data-core`)**
   数据是资产。该环境专门管理 Cloud SQL、持久化存储卷以及各种核心数据基建。严格的权限控制与隔离确保了用户数据与系统配置文件的绝对安全。

3. **Ops Build (`evotensor-ops-build`)**
   自动化打包机与 CI/CD 流水线的所在地。该项目的生命周期管理聚焦于构建速度与并发容量，通过自动化脚本在任务到来时动态唤醒打包集群。

4. **Family Hub (`evotensor-family-hub`)**
   提供辅助性的日常 Server 与边缘计算节点（如 Hermes Agent），侧重于长连接稳定性和轻量级路由，为终端用户或家庭应用提供网关支持。

## 统一环境路由：`config.sh` 的艺术

为了让底层脚本在 4 个项目中游刃有余，我们抛弃了对单一 `.gcp_project_id` 的依赖。所有的 bash 运维脚本都通过 `scripts/config.sh` 进行流量劫持与重定向：

```bash
export GCP_PROJECT_AI_LAB="evotensor-ai-lab"
export GCP_PROJECT_DATA_CORE="evotensor-data-core"
# ...
```

当我们要检查全局的 Gemini 用量，或是批量启动服务器时，底层的监控器会遍历 `GCP_ALL_PROJECTS`，进行跨项目资源嗅探，从而汇总出一张完整的资产拓扑图。

## Agent 协同闭环：为 AI 赋予物理环境感知

传统的自动化基建通常以人为本（DevOps 工程师通过控制台或 CLI 执行操作）。而 `gcp-gemini-manage` 的核心优势在于它是**为 Agent 而生**。

我们通过在 `.agents/skills/` 目录中声明标准化技能（Skills），将底层的 `gcloud` 命令行进行了高层语义封装：
- 当用户要求：“帮我建一个私有数据库”。
- Agent 将自动读取 `deploy_aux_server.sh` 脚本并下发所需参数。
- 服务器启动后，其生成的公网 IP、连接凭证等关键状态，将通过标准输入流（stdin）与日志回显，直接同步给 Agent 的上下文 (Context)。

至此，Agent 不仅能“写代码”，更掌握了“调配服务器”和“理解云上物理状态”的能力，完成了从应用开发到基建部署的全自动化自愈闭环。
