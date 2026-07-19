---
title: "AiSpect Core Modules Analysis"
date: 2026-07-19
description: "In-depth analysis of AiSpect's core code structure, API definitions, and the internal implementation logic of Agent and common modules"
draft: false
tags: ["AiSpect", "Core", "Module Design"]
---

# AiSpect Core Modules Analysis

`aispect-core` is the cornerstone and central hub of the entire AiSpect framework. Its primary responsibility is to define the development standards for large model Agents, establish the interface contracts between the framework and applications, and provide a unified Runtime Engine proxy execution environment. All core mechanisms for scanning, registering, intercepting, routing, and handling exceptions for AI proxies are converged within this module.

## 1. Design Principles

`aispect-core` adheres to the following design principles:
1. **Pure Java Library**: It does not depend on Spring, Quarkus, or any specific IoC container.
2. **Zero Logging Dependency**: The module strictly avoids introducing or outputting any logging implementations like `slf4j`, communicating solely through strongly typed return value contracts and exceptions.
3. **Compiler-like Runtime Experience**: It supports the semantics of "partial successful compilation" (`AiScanResult`), leaving exceptions to the call stack to interrupt the process or wrap and return them.

## 2. Logical Architecture and Package Division

From a logical architecture perspective, `aispect-core` is divided into four clearly demarcated sub-packages/modules. To ensure purity, these four modules are highly separated in physical code packages:

### 2.1 `com.aispect.api` (Interface Contract Layer)
This is the top-level contract of the framework, defining core interfaces such as lifecycle interception, context, and invocation operations:
- **`AiScanResult` and `AgentInvocationCache`**: As core assets delivered externally during the startup phase, they carry the mapping relationships between intercepted methods and proxies, along with exception collections.
- **`AiClient` and `AiOperations`**: The former provides an abstraction for communicating with the underlying large model (including streaming inference), while the latter is a unified operation panel exposed to business developers.
- **`AiInvocationContext`**: The context environment object running through the proxy lifecycle.
- **Agent Lifecycle Interfaces**: Define callbacks specifications for various stages, such as `AiAgentFilter`, `AiPreProcessor`, `AiPostProcessor`, and `AiGraphBehaviorOrchestrator`.

### 2.2 `com.aispect.common` (Basic Tools and Exception Hierarchy)
Provides an exception hierarchy and tools shared across layers, also maintaining strict "purity".
- **Exception Hierarchy**: With `AiSpectException` as the top-level base class, it includes `AiScanException` dedicated to the scanning phase (containing a list of exceptions) and `AiAgentExecutionException` for runtime errors.

### 2.3 `com.aispect.agent` (Execution Proxy Metadata)
The core annotations and skeleton abstractions through which developers interact with AI via code.
- **Core Annotations**:
  - `@AiUnitAgent`: Placed on ordinary business methods for stage-specific interception enhancements.
  - `@AiGraphAgent`: Placed on classes or main process interfaces to initiate the overall workflow.
  - `@AiNode`: Underlying functions schedulable by the large model, which must be bound to the surrounding graph proxy context via `belongTo`. Different nodes on the same method must have mutually exclusive execution stages.
- **Skeleton Implementations**: Provides `AbstractUnitAgent` and `AbstractGraphAgent` to reduce boilerplate code significantly.

### 2.4 `com.aispect.core` (Internal Execution Engine)
Responsible for scanning during the assembly phase and AOP routing at runtime. It operates purely internally and is not exposed externally.
- **`AiComponentScanner`**: Iterates through annotation configurations during the assembly phase. Adhering to the "partial success" semantics, it does not short-circuit when discovering configuration errors (e.g., missing associated annotations or stage conflicts), but completely collects the exceptions, ultimately leaving the decision to the external layer.
- **`AgentInterceptor` (Dynamic Proxy)**: Injects runtime enhancements into business code based on JDK Dynamic Proxy, correctly routing to `UnitEngine` or related `Graph` orchestrators based on the proxy object type. It is absolutely silent during operation, escalating all configuration defects or network errors to Exceptions for reporting.
