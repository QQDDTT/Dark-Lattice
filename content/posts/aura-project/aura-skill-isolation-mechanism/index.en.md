---
title: "Aura: Physical Skill Decoupling and Secure Execution Sandbox Mechanism"
date: 2026-06-04T12:00:00+09:00
draft: false
tags: ["Aura", "Sandbox", "Security", "Skills"]
categories: ["Engineering", "Architecture Design"]
description: "Unveiling the twin-project skill decoupling and security defense isolation mechanism in Aura v11.0.0. Learn how Execution and Skill Developer perform their respective duties to ensure the safe execution of AI agents in the physical world."
---

# Aura: Physical Skill Decoupling and Secure Execution Sandbox Mechanism

![Physical Skill Sandbox and Security Isolation Mechanism](featured.png)

As the tools that Agents can invoke become increasingly powerful, ensuring the security of execution boundaries has become the top priority in architecture design. In Aura v11.0.0, we introduced the **"Twin-Project Skill Decoupling and Security Defense Isolation"** mechanism, completely reinventing the paradigm for physical skill development and execution.

## 1. Physical Skill Decoupling

In past architectures, skills were typically hardcoded or tightly coupled within the Rust core system. Now, all skills are physically isolated in the `skills/` sandbox at the root directory.

- **Pure Python Carrier**: Each subdirectory represents an independent skill (e.g., `google_search`).
- **Standard Contract**: Every skill must include a `SKILL.md` (defining metadata, execution, and prohibition contracts) and a standardized entry script.
- **Hot Deployment Capability**: This allows the system to hot-plug new skills without recompiling the core engine.

## 2. Dual-System Isolation: Execution vs Skill Developer

For extreme security, Aura has split "development" and "execution" into two entirely independent autonomous subsystems:

### 2.1 Aura Skill Developer
As the "creator" of skills, `aura-skill-developer` has **full read and write permissions** to the `skills/` directory.
It provides:
- Automated generation and hot-editing of skills.
- Static compliance auditing (checking for violations of dangerous operation contracts).
- Dry-run testing environments and deployment interfaces.

### 2.2 Aura Execution
As the "user" of skills, `aura-execution` is the most dangerous yet most strictly guarded component in the system.
- **Permission Downgrade**: It only has **read-only permissions** to the `skills/` directory, absolutely preventing the tampering of skill logic during execution.
- **Strong Isolation Sandbox**: It is solely responsible for invoking registered skills, forcing them to run within restricted Namespace/Cgroup sandboxes.
- **Inversion of Control**: The executor only receives tasks from the underlying foundation. It does not care about the logic of task generation; it is only responsible for "safely landing physical actions".

## 3. Security Defense and Design Philosophy

Through this layer of decoupling, Aura has implemented an extremely robust security defense:
Even if a malicious instruction deceives the Inference system, when it is dispatched to the Execution system, the damage scope is strictly confined within the sandbox boundary declared by that specific skill, because the executor is in a strongly isolated sandbox and lacks permissions to modify skills.

This isolation of "Development (High Privilege / No Execution)" and "Execution (Low Privilege / Execute Only)" marks a critical step for Aura on the path to becoming an industrial-grade, reliable AI-Native OS.

---
*Produced by Dark Lattice Architecture Lab.*
