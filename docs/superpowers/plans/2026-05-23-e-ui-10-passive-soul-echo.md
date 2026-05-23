# E-UI-10 被动灵识与心音回响 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the E-UI-10A/B foundation: MVU-safe passive soul sensing fields and a HomePage soul echo display that survives NPC departure.

**Architecture:** AI/MVU remains the only source of narrative truth. The frontend reads `系统.心音回响`, `系统.当前聚焦心声NPC`, and `NPC.*.心声探测态`; clicking the destiny ring focuses an existing soul echo state instead of writing `灵识窃取` into `系统.待处理交互`. HomePage owns the cross-scene echo display, while NpcCard owns per-NPC ring visual state.

**Tech Stack:** Vue 3, TypeScript, Zod 4, Pinia MVU store, SCSS, Vitest + Vue Test Utils.

---

### Task 1: Schema Foundation

**Files:**
- Modify: `src/雌堕合欢宗/schema.ts`

- [ ] Add `心声探测态Schema` enum: `无波动 / 可窥探 / 已捕获 / 反震 / 锁闭`.
- [ ] Add `心音回响Schema` with fields: `id`, `npc`, `text`, `stage`, `result`, `scene`, `time`, `floor`, `is_new`.
- [ ] Add `系统.心音回响` and `系统.当前聚焦心声NPC` with prefault defaults.
- [ ] Add `NPC.*.心声探测态` with prefault `无波动`.

### Task 2: HomePage Echo Display

**Files:**
- Modify: `src/雌堕合欢宗/界面/pages/HomePage.vue`

- [ ] Add a `soul-echo-stream` section above NPC cards.
- [ ] Show up to three latest echoes from `系统.心音回响`.
- [ ] Highlight echo for `系统.当前聚焦心声NPC`.
- [ ] Update destiny ring click handling: focus/unfocus `系统.当前聚焦心声NPC`, clear legacy `灵识窃取`, do not write new `灵识窃取`.
- [ ] Keep NPC card in-scene rendering unchanged.

### Task 3: NpcCard Probe State Contract

**Files:**
- Modify: `src/雌堕合欢宗/界面/components/NpcCard.vue`

- [ ] Extend `data` prop with optional `心声探测态`.
- [ ] Add `data-probe-state` and classes for non-default probe state.
- [ ] Keep existing `soulLocked` visual as focused state compatibility.

### Task 4: Tests

**Files:**
- Modify: `src/雌堕合欢宗/界面/pages/HomePage.test.ts`
- Modify: `src/雌堕合欢宗/界面/components/NpcCard.test.ts`

- [ ] Update HomePage mock system data with `心音回响` and `当前聚焦心声NPC`.
- [ ] Replace old “click ring writes 灵识窃取” expectation with “click ring focuses NPC and does not write pending interaction”.
- [ ] Add test: echo remains visible when NPC is not in current scene.
- [ ] Add NpcCard test for `data-probe-state`.

### Task 5: Verification and PRD Record

**Files:**
- Modify: `docs/PRD/动态场景系统技术验证与实施计划.md`

- [ ] Run focused tests: `npx vitest run src/雌堕合欢宗/界面/pages/HomePage.test.ts src/雌堕合欢宗/界面/components/NpcCard.test.ts`.
- [ ] Run schema-adjacent tests if available.
- [ ] Append E-UI-10A/B validation record with commands and results.
