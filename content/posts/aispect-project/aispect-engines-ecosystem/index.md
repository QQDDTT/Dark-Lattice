---
title: "AiSpect 引擎生态与周边矩阵 (Engines & Ecosystem)"
date: 2026-07-19
description: "阐述框架的落地生态，包括不同引擎的适配、具体 Agent 实例、以及测试与示例工程"
draft: false
tags: ["AiSpect", "Engines", "Ecosystem"]
---

# AiSpect 引擎生态与周边矩阵 (Engines & Ecosystem)

为了让业务开发者能在熟悉的框架中以“零侵入”或“最低配置”的方式启用 AI 代理能力，AiSpect 在核心底层之外构建了丰富的引擎适配（Engines）和周边生态模块。

## 1. 引擎适配层 (Engines)

引擎适配层的核心目标是与不同的运行时宿主环境深度集成。开发者只需引入对应的引擎模块，即可自动传递拉取底层所有必须的核心包。

### 1.1 `aispect-engine-spring`
为 Spring Boot 环境量身定制的自动装配模块。
- **自动装配**：利用 `@ConfigurationProperties` 自动读取 `application.yml` 参数，通过 `AiAgentBeanPostProcessor` 自动扫描并在 Bean 初始化后生成代理实例替换。
- **依赖注入**：Agent 接口实现类自身即是 Spring Bean，内部可自由使用 `@Autowired` 注入数据库 Mapper、Redis 客户端等，实现 AI 层与业务层的高度融合。
- **图式工作流网关**：内置 `AiGraphAgentSpringLauncher`。它在 Spring 容器启动完毕后，主动收集带有 `@AiGraphAgent` 的 Bean 放进资源池，并利用 WebFlux 等函数式路由动态暴露 HTTP API 端点（如 `POST /ai/graph/{agentName}`）。外部只需发送请求即可调起复杂的图算法执行链路。

### 1.2 `aispect-engine-se` 与 `aispect-engine-quarkus`
- **`aispect-engine-se`**：针对纯 Java SE 环境。提供极简的静态工厂或构建器 API，开发者手动管理对象的生命周期并组装 `AiClient`，适用于基础服务端或控制台应用。
- **`aispect-engine-quarkus` (规划中)**：针对云原生 Quarkus 框架，主打 GraalVM AOT 构建时增强。在编译阶段通过 Quarkus Extension 生成代理类字节码，契合极速启动、极低内存的设计理念。

## 2. 预置 Agent 实例集 (`aispect-agents`)

随着核心契约抽象下沉至 API 层，该模块转变为**提供丰富、开箱即用的内置 Agent 实现库**，不再依赖具体的模型厂商。
- **数据加工类**：如文本清理 (`DataCleanAgent`) 和强制结构化 JSON 提取 (`JsonExtractorAgent`)。
- **流程控制类**：条件路由分支 (`ConditionalRouterAgent`) 与超时/异常兜底策略 (`FallbackAgent`)。
- **审查与风控类**：内容合规性检查 (`ContentModerationAgent`)。
- **图流转示例**：如 `StorytellingGraphAgent` 演示如何进行流式（SSE）输出与上下文图流转。

## 3. 辅助工程矩阵

### 3.1 最佳实践案例 (`examples`)
提供直观的开箱即用体验。
- **`example-java-se`**：CLI 自动化文件助手，展示工具调用与本地文件交互。
- **`example-spring-boot`**：AI 文档智能编辑 Web 平台，展示 Agent 如何与前台单页应用、后端 Service 依赖注入结合。
- **`example-quarkus`**：演示 Webhook 实时代码缺陷分析。

### 3.2 专属测试脚手架 (`aispect-test`)
提供给业务侧的脱机离线测试工具库。
- **`MockAiClient`**：无需真实 API 即可模拟固定返回、网络超时或内容审查拦截。
- **上下文伪造**：通过 `InvocationContextBuilder` 极速拼装代理执行快照。
- **Spring Test Slices**：提供测试切片支持，快速拉起局部的 Agent 拦截链条而无需启动沉重的数据库连接等组件。

### 3.3 版本管控与门面 (`bom` 与 `website`)
- **`aispect-bom`**：通过 Maven 统一管理内外部依赖版本，让外部接入只需引入一套 POM。
- **`aispect-website`**：基于 VitePress 搭建的公开门户，仅包含公共 API、JavaDoc 与接入文档，保证核心业务私密性的同时，树立专业的开源产品形象。
