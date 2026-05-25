# Shop Scene Products Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn shop scenes into purchasable entry tokens that display evocative names while unlocking real scene names for AI/worldbook use.

**Architecture:** Keep `场景.已解锁` as `string[]` of real scene names and avoid schema changes. Add scene metadata in `data/scenes.ts`, route display names through `itemDisplay.ts`, and add a green-light worldbook rule file for AI scene usage.

**Tech Stack:** TypeScript, Vue 3, Vitest, YAML worldbook entries.

---

## File Map

- Modify `src/雌堕合欢宗/界面/data/scenes.ts`: expand scenes from 4 to 8 and add display/narrative metadata.
- Modify `src/雌堕合欢宗/界面/data/itemDisplay.ts`: include scenes in display-name and short-hint lookup.
- Modify `src/雌堕合欢宗/界面/data/itemDisplay.test.ts`: lock scene display mapping.
- Modify `src/雌堕合欢宗/界面/pages/ShopPage.test.ts`: lock shop display name and real unlock name.
- Create `src/雌堕合欢宗/世界书/场景叙事规则.yaml`: define scene token usage, target NPCs, props, and AI boundaries.
- Modify `src/雌堕合欢宗/index.yaml`: mount scene narrative rule as green-light worldbook data.
- Modify docs as needed: `docs/前端架构指南.md` and `docs/PRD/当前大改动整理报告-2026-05-24.md`.

## Tasks

### Task 1: Lock Scene Display Contract

- [ ] Update tests so the shop scene tab expects display name `合契浴令`, but purchase writes `阴阳池` into `场景.已解锁`.
- [ ] Add item display test for `getItemDisplayName('药庐暖阁') === '暖炉试香令'` and `getItemShortHint('药庐暖阁')` containing `试药`.
- [ ] Run focused tests and verify RED.

### Task 2: Implement Scene Metadata

- [ ] Expand `Scene` interface with `显示名`, `主用途`, `关联NPC`, `适配道具`, `进入理由`, `风声钩子`, `AI短提示`.
- [ ] Replace the 4 simple scenes with 8 scene entries: `阴阳池`, `经阁密室`, `掌门殿偏殿`, `渊底灵脉`, `药庐暖阁`, `听风廊`, `锁心静室`, `莲纹浴房`.
- [ ] Update `itemDisplay.ts` to read scene display name and short hint.
- [ ] Run focused tests and verify GREEN.

### Task 3: Worldbook Rules

- [ ] Create `场景叙事规则.yaml` with green-light metadata, no permanent blue-light table.
- [ ] Document that shop sells tokens/permissions and unlocks real scene names.
- [ ] Mount it in `index.yaml` under worldbook entries with keywords: `场景叙事规则`, scene display names, and real scene names.

### Task 4: Verification

- [ ] Run `npx vitest run src/雌堕合欢宗/界面/data/itemDisplay.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts`.
- [ ] Run full `npx vitest run`.
- [ ] Run `git diff --check`.

