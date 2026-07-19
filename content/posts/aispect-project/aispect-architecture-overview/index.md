---
title: "AiSpect 核心设计理念与架构总览"
date: 2026-07-19
description: "介绍项目整体愿景、领域模型设计、系统架构以及 Agent 工作流编排的设计思想"
draft: false
tags: ["AiSpect", "Architecture", "Agent"]
---

# AiSpect 核心设计理念与架构总览

基于 Java 17+ 和多架构支持的目标，AiSpect 采用多模块 (Multi-Module) 工程结构，确保核心逻辑与外部容器（如 Spring）严格解耦。其核心目标是实现一个**跨架构的、注解驱动的 AI 代理注入系统**。它通过 AOP（面向切面编程）的代理模式，将“死板”的业务逻辑在运行前后与灵活的 AI 大模型推理无缝连接，最终作为 Agent 编排流程的系统助手。

## 1. 核心领域与架构分层

整个架构分为四个主要层次：

- **应用集成层 (Integration Layer)**：该层通过各种 `Engine` 适配器（如 Spring, 或纯 SE 引擎）负责在容器启动时扫描带有 `@AiAgent` 的目标类，并触发代理对象的生成替换。
- **代理编织层 (Weaving & Proxy Layer)**：不依赖于特定容器的核心代理逻辑。通过 ProxyFactory 生成代理对象，并通过 Interceptor 拦截业务方法的执行，构建执行上下文（`AiInvocationContext`）。
- **Agent组装层 (Agent Orchestration Layer)**：所有 AI 处理逻辑的基石（`Agent` 契约）。在执行前后决定如何修正参数、分析结果，并维护上下文。
- **底层能力层 (Foundation Layer)**：对接底层具体模型的 `AiClient`，以及提供统一流转与调度能力的 `Core Engine`。

### 核心执行流程
1. 拦截触发：用户调用代理对象的方法。
2. 前置处理 (Before)：提取注解配置并调用 `Agent.preProcess(Context)`。通过 AI 推理生成修正后的入参。
3. 目标执行 (Invoke)：使用修正后的参数调用真实目标对象的原方法。
4. 后置处理 (After)：调用 `Agent.postProcess(Result, Context)`。通过 AI 再次总结或处理返回值。
5. 返回：向调用方返回最终加工后的结果。

## 2. 模块划分与依赖拓扑

AiSpect 遵循严格的单向依赖原则，确保外层模块（如 Spring 适配）绝对不能反向污染内层的核心逻辑。基础底座、网络层与拦截引擎被合并为统一的 Core 运行时大模块：

- **`aispect-agents`**: 预置 AI 代理库（纯业务契约，零依赖）。
- **`aispect-core`**: 统一底座（包含 Common 异常与模型、AI Client 网络通信、代理引擎）。位于依赖链的最底端，不依赖任何环境或特定业务组件。
- **`engines:*`**: 用户接入的唯一入口（如 `aispect-engine-spring`, `aispect-engine-se`）。它们依赖 `aispect-core`，提供环境生命周期挂载与自动织入。
- **外围模块**: `aispect-bom` (依赖管理), `aispect-test` (专属测试), `examples` (最佳实践), `aispect-website` (门户网站)。

## 3. 从单元 Agent 到图式工作流

AiSpect 明确区分了局部协同与全局编排两种智能体角色：

### 单元 Agent (Unit Agent)
核心职责是**协同 Java 程序**。AI 介入主要通过注解拦截，修改函数的入参和返回值。这种方式将 AI 限定在了流程的局部步骤中，不对整体流程结构进行破坏，专注于局部智能化增强。

### 图式智能体 (Graph Agent)与工作流
在复杂场景中，仅仅依靠静态注解无法满足动态编排需求。AiSpect 引入**图算法 (Graph Algorithms)** 逻辑进行工作流编排。
`Graph Agent` 的核心职责是**组织 Java 程序**：
- 它拦截主进程或路由入口，识别指令启动工作流。
- 图中的节点 (Node) 成为被 `Graph Agent` 调配的资源，系统底层通过图引擎来动态解析、调度和执行这些节点，实现单点与全局的智能化对立统一架构。
