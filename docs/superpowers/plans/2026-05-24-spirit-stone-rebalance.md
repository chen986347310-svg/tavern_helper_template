# Spirit Stone Rebalance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise first-version spirit stone income enough to support the expanded shop while keeping the true-ending array purchase expensive.

**Architecture:** Keep the economy simple: change only the initial balance and the existing `calculate灵石获取` formula. Worldbook/docs are updated to match the new runtime behavior; no new schema fields are introduced.

**Tech Stack:** TypeScript, Vitest, YAML worldbook docs, Markdown project docs.

---

## File Map

- Modify `src/雌堕合欢宗/界面/guards.test.ts`: lock the new x4 spirit stone income formula.
- Modify `src/雌堕合欢宗/界面/guards.ts`: add `灵石收益倍率 = 4` and apply it in `calculate灵石获取`.
- Modify `src/雌堕合欢宗/世界书/变量/initvar.yaml`: set initial `系统.灵石` to `2000`.
- Modify `src/雌堕合欢宗/世界书/灵石经济.yaml`: replace the old economy estimate with the v2 shop scale and new income rules.
- Modify `src/雌堕合欢宗/世界书/变量/变量更新规则.yaml`: sync the AI-facing formula and reward guidance.
- Modify `docs/前端架构指南.md`: record the new economy boundary and implementation files.

## Tasks

### Task 1: Lock New Income Formula

**Files:**
- Modify: `src/雌堕合欢宗/界面/guards.test.ts`
- Modify: `src/雌堕合欢宗/界面/guards.ts`

- [ ] **Step 1: Update the failing formula test**

Change the `calculate灵石获取` expectations to:

```ts
expect(calculate灵石获取('白芷', 10)).toBe(400);
expect(calculate灵石获取('苏芸', 10)).toBe(800);
expect(calculate灵石获取('纪兰', 10)).toBe(1600);
expect(calculate灵石获取('沈月秋', 10)).toBe(2400);
expect(calculate灵石获取('柳素衣', 10)).toBe(4000);
```

- [ ] **Step 2: Verify the test fails**

Run: `npx vitest run src/雌堕合欢宗/界面/guards.test.ts`

Expected: FAIL in `calculate灵石获取` because production still uses the old x1 formula.

- [ ] **Step 3: Implement the minimal formula change**

Add:

```ts
const 灵石收益倍率 = 4;
```

Then change:

```ts
return NPC境界系数[NPC名] * 攻略值增量;
```

to:

```ts
return NPC境界系数[NPC名] * 攻略值增量 * 灵石收益倍率;
```

- [ ] **Step 4: Verify focused tests pass**

Run: `npx vitest run src/雌堕合欢宗/界面/guards.test.ts`

Expected: PASS.

### Task 2: Sync Initial Balance And Rules

**Files:**
- Modify: `src/雌堕合欢宗/世界书/变量/initvar.yaml`
- Modify: `src/雌堕合欢宗/世界书/灵石经济.yaml`
- Modify: `src/雌堕合欢宗/世界书/变量/变量更新规则.yaml`
- Modify: `docs/前端架构指南.md`

- [ ] **Step 1: Set initial spirit stones**

Change `系统.灵石` in `initvar.yaml` from `0` to `2000`.

- [ ] **Step 2: Update worldbook formula**

Write the new formula as:

```text
灵石增量 = NPC境界系数 × 攻略值增量 × 4
```

Keep the NPC境界系数 unchanged.

- [ ] **Step 3: Update economy scale**

Replace old shop totals with:

```text
不含改变阵法可玩消费约 282,750 灵石
改变阵法 500,000 灵石
常规攻略期目标收入约 120,000~160,000 灵石
```

- [ ] **Step 4: Document boundary**

In `docs/前端架构指南.md`, add a short section explaining that the front end only enforces purchases and formula helpers; stage rewards and wind-rumor rewards remain AI/worldbook guidance until a future schema field is designed.

### Task 3: Verify

**Files:**
- No new source files.

- [ ] **Step 1: Run focused test**

Run: `npx vitest run src/雌堕合欢宗/界面/guards.test.ts`

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run: `npx vitest run`

Expected: PASS.

- [ ] **Step 3: Run whitespace check**

Run: `git diff --check`

Expected: no whitespace errors; CRLF/LF warnings are acceptable if unchanged from project baseline.

