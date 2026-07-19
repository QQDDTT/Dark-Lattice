---
title: "AiSpect 核心模块解析 (Core Modules)"
date: 2026-07-19
description: "深入解析 AiSpect 的核心代码结构、API 接口定义以及 Agent 和通用模块的内部实现逻辑"
draft: false
tags: ["AiSpect", "Core", "Module Design"]
---

# AiSpect 核心模块解析 (Core Modules)

`aispect-core` 是整个 AiSpect 框架的基石与核心中枢。它的主要职责是定义大模型智能体（Agent）的开发标准、建立框架与应用之间的接口契约，并提供统一的运行时代理执行环境（Runtime Engine）。所有对 AI 代理的扫描、注册、拦截分发以及核心异常处理机制均收敛于此模块。

## 1. 设计原则

`aispect-core` 坚持以下几个设计原则：
1. **纯粹的 Java 库**：不依赖 Spring、Quarkus 或任何特定 IoC 容器。
2. **零日志依赖**：模块内部坚决不引入或输出任何如 `slf4j` 等日志实现，仅通过强类型的返回值契约与异常通信。
3. **类似编译器的运行体验**：支持“部分成功编译”语义（`AiScanResult`），异常交由调用栈阻断进程或包裹返回。

## 2. 逻辑架构与包划分

从逻辑架构上，`aispect-core` 下划分为四个界限清晰的子包/模块。为保证纯粹性，这四个模块在物理代码包中高度分离：

### 2.1 `com.aispect.api` (接口契约层)
它是框架的顶级契约，定义了生命周期拦截、上下文、调用操作等核心接口：
- **`AiScanResult` 与 `AgentInvocationCache`**：作为启动阶段对外交付的核心资产，承载扫描拦截方法与代理的映射关系及异常收集。
- **`AiClient` 与 `AiOperations`**：前者提供与底层大模型通信的抽象（包括流式推导），后者则是暴露给业务开发者的统一操作面板。
- **`AiInvocationContext`**：贯穿代理生命周期的上下文环境对象。
- **Agent Lifecycle 接口**：定义了 `AiAgentFilter`, `AiPreProcessor`, `AiPostProcessor`, `AiGraphBehaviorOrchestrator` 等各阶段回调规范。

### 2.2 `com.aispect.common` (基础工具与异常体系)
提供跨层共享的异常体系与工具，同样保持严格的“纯粹性”。
- **异常体系**：以 `AiSpectException` 为顶级基类，包含专用于扫描阶段的 `AiScanException`（包含异常列表）以及执行期间的 `AiAgentExecutionException`。

### 2.3 `com.aispect.agent` (执行代理元数据)
开发者通过代码与 AI 交互的核心注解与骨架抽象。
- **核心注解**：
  - `@AiUnitAgent`：标记在普通业务方法上，进行阶段性拦截增强。
  - `@AiGraphAgent`：标记在类或主进程接口上，启动整体工作流。
  - `@AiNode`：大模型可调度的底层功能，必须通过 `belongTo` 绑定到所在的图代理上下文中，且同一方法的不同节点必须具备互斥的执行阶段。
- **骨架实现**：提供 `AbstractUnitAgent` 与 `AbstractGraphAgent` 以减少大量样板代码。

### 2.4 `com.aispect.core` (内部执行引擎)
负责启动阶段的扫描与运行时的 AOP 路由，纯内部运转，不对外公开。
- **`AiComponentScanner`**：负责在装配阶段遍历注解配置。遵循“部分成功”语义，发现配置错误（如无关联注解或阶段冲突）不短路退出，而是完整收集异常，最终交由外部决定。
- **`AgentInterceptor` (动态代理)**：基于 JDK Dynamic Proxy 为业务代码注入运行时增强，根据代理对象类型正确路由至 `UnitEngine` 或相关的 `Graph` 编排调度器中。其运行中绝对静默，所有配置缺陷或网络错误均上升为 Exception 上报。
