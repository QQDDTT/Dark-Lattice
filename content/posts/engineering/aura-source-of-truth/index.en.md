---
title: "Aura Source of Truth: Why SurrealDB is the Only Truth and Redis is Just a Trigger"
date: 2026-04-29T11:30:00+09:00
draft: false
tags: ["Aura", "Database", "Architecture", "Engineering"]
categories: ["Engineering"]
description: "Exploring Aura's philosophy on state management: strictly separating permanent truth (SurrealDB) and transient signals (Redis) to build a deterministic agent capable of 100% state recovery after crashes."
---

# Aura Source of Truth: Why SurrealDB is the Only Truth and Redis is Just a Trigger

![Source of Truth Viz](featured.png)

In distributed AI system design, the easiest mistake is "responsibility confusion": using Redis as a database or a relational database as a message queue. Aura avoids this trap through strict **Source of Truth Separation**.

## 1. SurrealDB: Permanent Truth and Knowledge

In Aura, **SurrealDB is the single source of truth**.
- **Task Snapshots**: Where the task is, what intermediate results were produced, and what Meta's current plan is—all are persisted in SurrealDB.
- **Knowledge Graph**: All `knowledge` vector entries, association edges, and conflict markers are maintained here with ACID-level integrity.

Even if the server suddenly loses power, upon restart, Meta only needs to read the last task snapshot from SurrealDB to instantly restore the execution state to exactly where it was before the crash.

## 2. Redis: Transient Signals and Triggers

Redis plays the role of a **"Trigger"** in Aura.
- **Product Report Stream**: Matrix tells Meta "I'm done" via Redis Stream.
- **Transient Data Pool**: For execution speed, current node input/output are cached in Redis.

**Data in Redis is discardable at any time**. If Redis crashes, Meta re-constructs these signals from the source of truth (SurrealDB), ensuring the continuity of system logic.

## 3. Why is this Separation Crucial?

This design completely solves "lost updates" and "state inconsistency" problems in AI task execution. It grants the system **industrial-grade robustness**—you can kill any Matrix container at any time, and Meta will always restart a clean execution environment and continue the unfinished task based on the facts in SurrealDB.

---
*Produced by Dark Lattice Architecture Lab.*
