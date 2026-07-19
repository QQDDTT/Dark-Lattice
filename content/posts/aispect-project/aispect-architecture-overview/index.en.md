---
title: "AiSpect Core Design Philosophy and Architecture Overview"
date: 2026-07-19
description: "Introduces the overall project vision, domain model design, system architecture, and Agent workflow orchestration design concepts"
draft: false
tags: ["AiSpect", "Architecture", "Agent"]
---

# AiSpect Core Design Philosophy and Architecture Overview

Targeting Java 17+ and multi-architecture support, AiSpect adopts a Multi-Module engineering structure to ensure strict decoupling of core logic from external containers (such as Spring). Its core objective is to implement a **cross-architecture, annotation-driven AI Agent injection system**. Through the AOP (Aspect-Oriented Programming) proxy pattern, it seamlessly connects rigid business logic with flexible AI large model inference before and after execution, ultimately serving as a system assistant in the Agent orchestration process.

## 1. Core Domain and Architectural Layers

The entire architecture is divided into four main layers:

- **Integration Layer**: Through various `Engine` adapters (such as Spring or pure SE engines), this layer is responsible for scanning target classes with `@AiAgent` during container startup and triggering the generation and replacement of proxy objects.
- **Weaving & Proxy Layer**: Core proxy logic that does not depend on specific containers. It generates proxy objects through `ProxyFactory` and intercepts the execution of business methods via `Interceptor`, constructing the execution context (`AiInvocationContext`).
- **Agent Orchestration Layer**: The cornerstone of all AI processing logic (`Agent` contract). It determines how to modify parameters, analyze results, and maintain context before and after execution.
- **Foundation Layer**: Docks with the `AiClient` of specific underlying models, and the `Core Engine` that provides unified routing and scheduling capabilities.

### Core Execution Flow
1. **Intercept Trigger**: The user invokes the method of the proxy object.
2. **Pre-processing (Before)**: Extracts annotation configurations and calls `Agent.preProcess(Context)`. Generates modified input parameters via AI inference.
3. **Target Execution (Invoke)**: Invokes the original method of the real target object using the modified parameters.
4. **Post-processing (After)**: Calls `Agent.postProcess(Result, Context)`. The AI summarizes or processes the return value again.
5. **Return**: Returns the final processed result to the caller.

## 2. Module Division and Dependency Topology

AiSpect follows strict unidirectional dependency principles, ensuring that outer modules (such as Spring adapters) absolutely cannot reversely pollute the inner core logic. The foundation base, network layer, and interceptor engine are merged into a unified Core runtime mega-module:

- **`aispect-agents`**: Pre-built AI Agent library (pure business contract, zero dependency).
- **`aispect-core`**: Unified foundation (including Common exceptions and models, AI Client network communication, proxy engine). Located at the very bottom of the dependency chain, it does not depend on any environment or specific business components.
- **`engines:*`**: The sole entry point for user integration (e.g., `aispect-engine-spring`, `aispect-engine-se`). They depend on `aispect-core` to provide environment lifecycle mounting and automatic weaving.
- **Peripheral Modules**: `aispect-bom` (dependency management), `aispect-test` (dedicated testing), `examples` (best practices), `aispect-website` (portal website).

## 3. From Unit Agent to Graph Workflow

AiSpect clearly distinguishes between two Agent roles: local synergy and global orchestration.

### Unit Agent
The core responsibility is **synergizing with Java programs**. AI intervention is primarily achieved through annotation interception, modifying the function's input parameters and return values. This approach limits AI to specific steps of the workflow without disrupting the overall process structure, focusing on local intelligent enhancement.

### Graph Agent and Workflow
In complex scenarios, relying solely on static annotations cannot meet dynamic orchestration needs. AiSpect introduces **Graph Algorithms** logic for workflow orchestration.
The core responsibility of `Graph Agent` is **organizing Java programs**:
- It intercepts the main process or routing entry point, recognizing instructions to initiate workflows.
- The nodes (Node) in the graph become resources managed by the `Graph Agent`. The underlying system uses the graph engine to dynamically parse, schedule, and execute these nodes, achieving a unified architecture of local and global intelligence.
