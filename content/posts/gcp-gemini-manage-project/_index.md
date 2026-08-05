---
title: "GCP & Gemini 管理基础设施专栏"
description: "深入剖析 GCP 与 Gemini API 的核心监控架构及 4 大微服务独立项目管理，探索 Agent 与底层设施的无缝协同。"
background: "/images/projects/gcp-gemini-manage-cover.png"
---

GCP & Gemini 管理基础设施专栏聚焦于 `gcp-gemini-manage` 底层监控与基础设施管理模块的设计与实现。

在这里，我们将探讨如何通过统一的底层脚本，全面监控 Google Cloud 的账单配额、Gemini API 运行状况以及服务器负载。同时，深入了解其企业级 4 大独立项目架构设计（AI Lab、Data Core、Ops Build、Family Hub），并展现它是如何利用自定义技能 (Skills) 为 Agent 提供动态的执行语境，实现基础设施供给的自动化与智能化。

## 文章目录

- [gcp-gemini-manage 核心架构设计：四项目环境路由与 Agent 协同闭环](architecture-design)
