# 丹药系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将丹药系统从旧的 6 个永久消耗品扩展为 40 枚“临时丹药 / 永久丹药 / 仙奴丹”体系，并保留旧逻辑名兼容存档。

**Architecture:** 丹药先作为结构化数据进入 `items.ts`，显示与短提示统一走 `itemDisplay.ts`，商城按丹药类型/药阶分组展示，背包继续按“目标消耗”给在场 NPC 使用。完整叙事规则进入世界书绿灯资料库，AI 统一承接闭环在丹药数据稳定后单独执行。

**Tech Stack:** TypeScript, Vue 3, Pinia, Zod 4, Vitest, YAML worldbook, esbuild independent MVU scripts.

---

## File Map

- Modify: `src/雌堕合欢宗/界面/data/items.ts`  
  Define 丹药 types, categories, 40-pill data table, and keep existing exports compatible.
- Modify: `src/雌堕合欢宗/界面/data/itemDisplay.ts`  
  Add pill display name, short hint, type/category helpers.
- Modify: `src/雌堕合欢宗/界面/data/data.test.ts`  
  Assert pill counts, categories, legacy-name compatibility, metadata completeness.
- Modify: `src/雌堕合欢宗/界面/data/itemDisplay.test.ts`  
  Assert pill display mapping and worldbook coverage.
- Modify: `src/雌堕合欢宗/界面/pages/ShopPage.vue`  
  Group pill shop by 丹药分类 and show pill metadata in modal.
- Modify: `src/雌堕合欢宗/界面/pages/ShopPage.test.ts`  
  Assert pill grouping, display names, and logic-name purchase behavior.
- Modify: `src/雌堕合欢宗/界面/composables/usePendingAction.ts`  
  Include pill metadata in `使用物品` / `购买物品` pending actions when available.
- Modify: `src/雌堕合欢宗/界面/composables/usePendingAction.test.ts`  
  Assert pill action payload carries display name, category, effect line, and short hint.
- Modify: `src/雌堕合欢宗/界面/data/itemLifecycle.ts` and test if needed  
  Ensure temporary, permanent, and fairy pills remain target consumables unless explicitly special.
- Modify: `src/雌堕合欢宗/界面/guards.ts` and `guards.test.ts`  
  Add new pill threshold entries while preserving old threshold behavior.
- Create: `src/雌堕合欢宗/世界书/道具/丹药叙事规则.yaml`  
  Full pill narrative database as green-light worldbook.
- Modify: `src/雌堕合欢宗/index.yaml`  
  Mount `丹药叙事规则` as green-light, not blue-light.
- Modify: `src/雌堕合欢宗/世界书/道具系统.yaml`  
  Update item list and lifecycle protocol references.
- Modify: `docs/前端架构指南.md`  
  Record pill architecture and token boundary.

---

### Task 1: Define 丹药 Data Contract

**Files:**
- Modify: `src/雌堕合欢宗/界面/data/items.ts`
- Test: `src/雌堕合欢宗/界面/data/data.test.ts`

- [ ] **Step 1: Write failing tests for pill taxonomy**

Add to `data.test.ts`:

```ts
import { NSFW道具, 永久丹药, 禁器器阶, 丹药分类, 丹药药阶, 牝奴道具, 所有道具, 牝奴期可用道具 } from './items';

it('丹药扩展为临时、永久、仙奴三类共40枚', () => {
  expect(丹药分类).toEqual(['临时丹药', '永久丹药', '仙奴丹']);
  expect(丹药药阶).toEqual(['温药', '烈药', '永久药', '仙奴药']);
  expect(永久丹药).toHaveLength(40);
  expect(永久丹药.filter(item => item.分类 === '临时丹药')).toHaveLength(12);
  expect(永久丹药.filter(item => item.分类 === '永久丹药')).toHaveLength(12);
  expect(永久丹药.filter(item => item.分类 === '仙奴丹')).toHaveLength(16);
});

it('丹药保留旧逻辑名并提供显示名、作用线与AI短提示', () => {
  const scentPill = 永久丹药.find(item => item.名称 === '体香丹');
  expect(scentPill).toMatchObject({
    显示名: '引香丹',
    分类: '永久丹药',
    药阶: '永久药',
    作用线: '体态/社交',
    服务对象: 'NPC',
  });
  expect(scentPill?.设计驱动).toContain('体香成为长期身体标识');
  expect(scentPill?.即时反应).toContain('喉间微甜');
  expect(scentPill?.场景外显).toContain('香气更明显');
  expect(scentPill?.长期痕迹).toContain('身体标签');
  expect(scentPill?.AI短提示).toContain('体香');
});

it('仙奴丹使用状态门槛并服务性与身体可玩乐化', () => {
  const servantPill = 永久丹药.find(item => item.名称 === '玉户听命丹');
  expect(servantPill).toMatchObject({
    显示名: '玉户丹',
    分类: '仙奴丹',
    药阶: '仙奴药',
    状态门槛: '仙奴',
    服务用途: '私处命令反应',
  });
  expect(servantPill?.性功能变化).toContain('命令不必触碰');
  expect(servantPill?.长期玩法).toContain('禁器');
});
```

- [ ] **Step 2: Run RED test**

Run:

```powershell
npx vitest run src/雌堕合欢宗/界面/data/data.test.ts
```

Expected: FAIL because `丹药分类` / `丹药药阶` and pill metadata do not exist.

- [ ] **Step 3: Implement pill types and data**

In `items.ts`, add:

```ts
export type 丹药分类名 = '临时丹药' | '永久丹药' | '仙奴丹';
export type 丹药药阶名 = '温药' | '烈药' | '永久药' | '仙奴药';
export type 丹药生效对象 = 'NPC' | '仙奴';

export interface 丹药Item extends Item {
  类型: '消耗品';
  显示名: string;
  分类: 丹药分类名;
  药阶: 丹药药阶名;
  服务对象: 丹药生效对象;
  作用线: string;
  状态门槛?: '已完成' | '仙奴' | '牝奴期';
  设计驱动: string;
  即时反应?: string;
  场景外显?: string;
  长期痕迹?: string;
  服务用途?: string;
  身体改写?: string;
  性功能变化?: string;
  羞耻外显?: string;
  长期玩法?: string;
  AI短提示: string;
}

export const 丹药分类: 丹药分类名[] = ['临时丹药', '永久丹药', '仙奴丹'];
export const 丹药药阶: 丹药药阶名[] = ['温药', '烈药', '永久药', '仙奴药'];
```

Replace the current 6-item `永久丹药: Item[]` with a `丹药Item[]` containing all 40 rows from `docs/PRD/丹药系统规划表v2.md`. Preserve the six old logic names: `体香丹`, `媚体丹`, `催乳丹`, `催情丹`, `固敏丹`, `塑形丹`.

- [ ] **Step 4: Run GREEN test**

Run:

```powershell
npx vitest run src/雌堕合欢宗/界面/data/data.test.ts
```

Expected: PASS.

---

### Task 2: Display Helpers For Pills

**Files:**
- Modify: `src/雌堕合欢宗/界面/data/itemDisplay.ts`
- Test: `src/雌堕合欢宗/界面/data/itemDisplay.test.ts`

- [ ] **Step 1: Write failing display tests**

Add imports:

```ts
import { NSFW道具, 永久丹药 } from './items';
import { getPillCategory, getPillEffectLine } from './itemDisplay';
```

Add tests:

```ts
it('丹药逻辑名映射为显示名、分类、作用线与AI短提示', () => {
  expect(getItemDisplayName('体香丹')).toBe('引香丹');
  expect(getPillCategory('体香丹')).toBe('永久丹药');
  expect(getPillEffectLine('体香丹')).toBe('体态/社交');
  expect(getItemShortHint('体香丹')).toContain('体香');
});

it('世界书丹药叙事规则覆盖全部丹药逻辑名并作为绿灯资料库挂载', () => {
  const yaml = readFileSync('src/雌堕合欢宗/世界书/道具/丹药叙事规则.yaml', 'utf-8');
  const indexYaml = readFileSync('src/雌堕合欢宗/index.yaml', 'utf-8');
  expect(yaml).toContain('丹药使用读取规则');
  for (const item of 永久丹药) {
    expect(yaml, `missing pill narrative rule for ${item.名称}`).toContain(`  ${item.名称}:`);
  }
  expect(indexYaml).toMatch(/名称: 丹药叙事规则[\s\S]*?激活策略:[\s\S]*?类型: 绿灯/);
  expect(indexYaml).toContain('文件: 世界书/道具/丹药叙事规则');
});
```

- [ ] **Step 2: Run RED test**

```powershell
npx vitest run src/雌堕合欢宗/界面/data/itemDisplay.test.ts
```

Expected: FAIL because helpers and worldbook file are missing.

- [ ] **Step 3: Implement helpers**

In `itemDisplay.ts`, import `永久丹药`, create map, and update helpers:

```ts
import { NSFW道具, 永久丹药 } from './items';

const pillByName = new Map(永久丹药.map(item => [item.名称, item]));

export function getItemDisplayName(logicName: string): string {
  return outfitByName.get(logicName)?.显示名 ?? contrabandByName.get(logicName)?.显示名 ?? pillByName.get(logicName)?.显示名 ?? logicName;
}

export function getItemShortHint(logicName: string): string {
  return outfitByName.get(logicName)?.AI短提示 ?? contrabandByName.get(logicName)?.AI短提示 ?? pillByName.get(logicName)?.AI短提示 ?? '';
}

export function getPillCategory(logicName: string): string {
  return pillByName.get(logicName)?.分类 ?? '';
}

export function getPillEffectLine(logicName: string): string {
  return pillByName.get(logicName)?.作用线 ?? '';
}
```

- [ ] **Step 4: Create pill worldbook file and mount it**

Create `src/雌堕合欢宗/世界书/道具/丹药叙事规则.yaml` using all 40 pills. Each entry must include at least:

```yaml
丹药使用读取规则:
  读取来源:
    - 系统.待处理交互
    - 道具.拥有
    - 道具.已生效效果
    - 系统.场景上下文
  核心原则:
    - 丹药只由前端扣库存，AI 不得重复扣除。
    - 丹药叙事必须先承接身体/心神/场景变化，再清空 系统.待处理交互。
    - 逻辑名用于变量主键，显示名用于正文叙事。

丹药叙事规则:
  体香丹:
    显示名: 引香丹
    分类: 永久丹药
    作用线: 体态/社交
    描写重点: 体香成为长期身体标识，紧张、靠近、出汗、被点名时香气更明显。
```

In `index.yaml`, add green-light entry under `世界设定` near `禁器叙事规则`:

```yaml
      - 名称: 丹药叙事规则
        启用: true
        激活策略:
          类型: 绿灯
          关键字:
            - 丹药叙事规则
            - 丹药
            - 临时丹药
            - 永久丹药
            - 仙奴丹
            - 使用物品
            - 道具.已生效效果
        插入位置:
          类型: 角色定义之前
          顺序: 10
        递归:
          不可被其他条目激活: true
          不可激活其他条目: true
        文件: 世界书/道具/丹药叙事规则
```

- [ ] **Step 5: Run GREEN test**

```powershell
npx vitest run src/雌堕合欢宗/界面/data/itemDisplay.test.ts
```

Expected: PASS.

---

### Task 3: Shop Grouping For Pills

**Files:**
- Modify: `src/雌堕合欢宗/界面/pages/ShopPage.vue`
- Test: `src/雌堕合欢宗/界面/pages/ShopPage.test.ts`

- [ ] **Step 1: Write failing shop tests**

Add to `ShopPage.test.ts`:

```ts
it('丹药分类按临时、永久、仙奴分组显示显示名但购买仍写逻辑名', async () => {
  mockData.系统.灵石 = 100000;
  mockData.NPC.白芷.好感度 = 100;
  mockData.NPC.白芷.状态 = '已完成';
  const wrapper = mountShop();

  await wrapper.findAll('.tab-btn')[2].trigger('click');
  await flushPromises();

  const floorTitles = wrapper.findAll('.floor-title').map(title => title.text());
  expect(floorTitles).toEqual(['临时丹药', '永久丹药', '仙奴丹']);
  expect(wrapper.find('[data-floor="永久丹药"]').text()).toContain('引香丹');
  expect(wrapper.find('[data-floor="仙奴丹"]').text()).toContain('玉户丹');

  const pillCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '引香丹');
  expect(pillCard).toBeTruthy();
  await pillCard!.trigger('click');
  expect(wrapper.find('.modal-title').text()).toBe('引香丹');
  expect(wrapper.find('.modal-meta').text()).toContain('永久丹药');
  expect(wrapper.find('.modal-meta').text()).toContain('体态/社交');
  await wrapper.find('.buy-btn').trigger('click');

  expect(mockData.道具.拥有['体香丹']).toBe(1);
  expect(mockData.道具.拥有['引香丹']).toBeUndefined();
});
```

- [ ] **Step 2: Run RED test**

```powershell
npx vitest run src/雌堕合欢宗/界面/pages/ShopPage.test.ts
```

Expected: FAIL because pills are not grouped and pill metadata is not shown.

- [ ] **Step 3: Implement grouping**

In `ShopPage.vue`:

- Import `丹药分类` from `items.ts`.
- Import `getPillCategory`, `getPillEffectLine` from `itemDisplay.ts`.
- Change `isFloorGroupedCategory` to include `pill`.
- Add pill grouping branch in `groupedCurrentItems`.
- Update `getItemMetaPrimary` to use `getPillCategory`.
- Add modal second metadata span for pill effect line.

Use this shape:

```ts
const 丹药分类顺序 = 丹药分类;

const isFloorGroupedCategory = computed(() => ['clothing', 'nsfw', 'pill'].includes(activeCategory.value));

function getItemMetaPrimary(name: string): string {
  return getOutfitFloor(name) || getContrabandTier(name) || getPillCategory(name);
}

const groupedCurrentItems = computed(() => {
  if (activeCategory.value === 'pill') {
    return 丹药分类顺序
      .map(floor => ({
        floor,
        items: currentItems.value.filter(item => '分类' in item && item.分类 === floor),
      }))
      .filter(group => group.items.length > 0);
  }
  // keep existing nsfw/clothing branches
});
```

- [ ] **Step 4: Run GREEN test**

```powershell
npx vitest run src/雌堕合欢宗/界面/pages/ShopPage.test.ts
```

Expected: PASS.

---

### Task 4: Pending Action Metadata For Pills

**Files:**
- Modify: `src/雌堕合欢宗/界面/composables/usePendingAction.ts`
- Test: `src/雌堕合欢宗/界面/composables/usePendingAction.test.ts`

- [ ] **Step 1: Write failing payload test**

Add to `usePendingAction.test.ts`:

```ts
it('记录丹药使用时携带显示名、分类、作用线和AI短提示', () => {
  const { 记录使用物品 } = usePendingAction();

  记录使用物品('体香丹', '白芷');

  expect(mockData.系统.待处理交互[0]).toMatchObject({
    类型: '使用物品',
    目标: '白芷',
    道具: '体香丹',
    道具显示名: '引香丹',
    丹药分类: '永久丹药',
    作用线: '体态/社交',
  });
  expect(mockData.系统.待处理交互[0].AI短提示).toContain('体香');
});
```

Extend local pending action test type with optional:

```ts
丹药分类?: string;
作用线?: string;
```

- [ ] **Step 2: Run RED test**

```powershell
npx vitest run src/雌堕合欢宗/界面/composables/usePendingAction.test.ts
```

Expected: FAIL because pill metadata is not included.

- [ ] **Step 3: Implement payload metadata**

In `usePendingAction.ts`, add fields:

```ts
丹药分类?: string;
作用线?: string;
```

Import helpers and extend `getItemNarrativeMeta`:

```ts
import { getContrabandBodyPart, getContrabandTier, getItemDisplayName, getItemShortHint, getPillCategory, getPillEffectLine } from '../data/itemDisplay';

const 丹药分类 = getPillCategory(道具);
const 作用线 = getPillEffectLine(道具);

Object.entries({
  道具显示名: 道具显示名 === 道具 ? '' : 道具显示名,
  器阶,
  作用部位,
  丹药分类,
  作用线,
  AI短提示,
}).filter(([, value]) => value)
```

- [ ] **Step 4: Update schema and variable docs**

In `schema.ts`, add to `待处理交互` object:

```ts
丹药分类: z.string().prefault(''),
作用线: z.string().prefault(''),
```

In `src/雌堕合欢宗/世界书/变量/变量列表.yaml`, add under `待处理交互`:

```yaml
        丹药分类: string  # 可选叙事辅助；临时丹药/永久丹药/仙奴丹，可为空
        作用线: string  # 可选叙事辅助；体态/生理/思维/命契等，可为空
```

Run:

```powershell
npm run dump
npx esbuild src/雌堕合欢宗/脚本/变量结构/index.ts --bundle --format=esm --outfile=dist/var_structure.js --external:https://*
```

- [ ] **Step 5: Run GREEN test**

```powershell
npx vitest run src/雌堕合欢宗/界面/composables/usePendingAction.test.ts
```

Expected: PASS.

---

### Task 5: Thresholds And Lifecycle

**Files:**
- Modify: `src/雌堕合欢宗/界面/guards.ts`
- Modify: `src/雌堕合欢宗/界面/data/itemLifecycle.ts` only if existing set behavior fails
- Tests: `src/雌堕合欢宗/界面/guards.test.ts`, `src/雌堕合欢宗/界面/data/itemLifecycle.test.ts`

- [ ] **Step 1: Write threshold tests**

Add examples:

```ts
it('新增临时与永久丹药遵守好感度门槛', () => {
  expect(checkItemThreshold(0, '温息丹')).toBe(true);
  expect(checkItemThreshold(49, '焚息丹')).toBe(false);
  expect(checkItemThreshold(50, '焚息丹')).toBe(true);
  expect(checkItemThreshold(69, '催乳丹')).toBe(false);
  expect(checkItemThreshold(70, '催乳丹')).toBe(true);
});

it('仙奴丹不靠普通好感度直接开放', () => {
  expect(checkItemThreshold(100, '玉户听命丹')).toBe(false);
});
```

For lifecycle test, assert:

```ts
expect(getItemLifecycle('温息丹')).toBe('目标消耗');
expect(getItemLifecycle('玉户听命丹')).toBe('目标消耗');
```

- [ ] **Step 2: Run RED tests**

```powershell
npx vitest run src/雌堕合欢宗/界面/guards.test.ts src/雌堕合欢宗/界面/data/itemLifecycle.test.ts
```

Expected: FAIL until new names are in data and threshold table.

- [ ] **Step 3: Update threshold table**

Add non-仙奴 pills to `好感度门槛` by their PRD门槛. Do not add 仙奴丹 to normal threshold table unless a separate status gate is implemented in a later task.

Suggested mapping:

- `0`: `温息丹`, `凝香丸`, `体香丹`
- `30`: `醉眸丹`, `柔骨散`, `听令丸`, `玉肌丹`, `柔腰丹`, `润声丹`
- `50`: `乳热丹`, `焚息丹`, `缄潮丹`, `媚体丹`, `固敏丹`, `含情丹`, `镜羞丹`
- `70`: `显情丹`, `梦潮丸`, `乱脉丹`, `催乳丹`, `催情丹`, `羞阈丹`
- `90`: `照欲丹`, `塑形丹`

- [ ] **Step 4: Run GREEN tests**

```powershell
npx vitest run src/雌堕合欢宗/界面/guards.test.ts src/雌堕合欢宗/界面/data/itemLifecycle.test.ts
```

Expected: PASS.

---

### Task 6: Worldbook And Docs Update

**Files:**
- Modify: `src/雌堕合欢宗/世界书/道具系统.yaml`
- Modify: `docs/前端架构指南.md`
- Test: existing `itemDisplay.test.ts` plus grep checks

- [ ] **Step 1: Update 道具系统.yaml**

Replace old permanent pill list with the new category summary:

```yaml
丹药系统:
  分类:
    临时丹药: 12枚，温药用于试探，烈药用于推动剧情失衡。
    永久丹药: 12枚，固化体态、生理、思维和羞耻机制。
    仙奴丹: 16枚，仙奴状态开放，服务性、取悦、身体可玩乐化与命契依赖。
  主键规则:
    - 变量与库存仍使用逻辑名。
    - 显示名、分类、作用线、AI短提示只用于叙事。
```

- [ ] **Step 2: Update frontend guide**

Add a section after 禁器器阶体系:

```md
## 丹药系统体系（2026-05-24）

丹药分为临时丹药、永久丹药、仙奴丹。临时丹药制造短期场景和剧情失衡；永久丹药固化体态、生理、思维变化；仙奴丹只在仙奴/牝奴后期开放，直接服务性、取悦、身体可玩乐化和归属展示。

库存与待处理交互仍以逻辑名为主键。显示名、丹药分类、作用线、AI短提示作为可选叙事元数据进入待处理交互。完整规则放入 `世界书/道具/丹药叙事规则.yaml`，作为绿灯资料库按需触发，不蓝灯常驻。
```

- [ ] **Step 3: Run tests and checks**

```powershell
npx vitest run src/雌堕合欢宗/界面/data/itemDisplay.test.ts
git diff --check -- docs/前端架构指南.md src/雌堕合欢宗/世界书/道具系统.yaml src/雌堕合欢宗/世界书/道具/丹药叙事规则.yaml
```

Expected: PASS and no diff-check errors.

---

### Task 7: Final Verification

**Files:** all touched files.

- [ ] **Step 1: Run focused test suite**

```powershell
npx vitest run src/雌堕合欢宗/界面/data/data.test.ts src/雌堕合欢宗/界面/data/itemDisplay.test.ts src/雌堕合欢宗/界面/data/itemLifecycle.test.ts src/雌堕合欢宗/界面/composables/usePendingAction.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts src/雌堕合欢宗/界面/pages/BackpackPage.test.ts src/雌堕合欢宗/界面/guards.test.ts
```

Expected: all listed tests pass.

- [ ] **Step 2: Verify generated artifacts**

```powershell
rg -n "丹药分类|作用线" src/雌堕合欢宗/schema.ts src/雌堕合欢宗/schema.json dist/var_structure.js src/雌堕合欢宗/世界书/变量/变量列表.yaml
rg -n "丹药叙事规则|引香丹|玉户丹|奉身丹" src/雌堕合欢宗/index.yaml src/雌堕合欢宗/世界书/道具/丹药叙事规则.yaml
```

Expected: all key strings are present. In `dist/var_structure.js`, Chinese may appear as unicode escapes; if direct `rg` misses, inspect the schema registration block near `待处理交互` with `Get-Content`.

- [ ] **Step 3: Run diff check**

```powershell
git diff --check
```

Expected: no whitespace errors. CRLF/LF warnings are acceptable if no error is reported.

- [ ] **Step 4: Summarize without claiming CDP validation**

Do not claim browser/CDP validation unless it was actually run. Summarize unit tests and generated artifact checks only.

---

## Self-Review Notes

- Spec coverage: The plan covers the 40-pill PRD, legacy-name compatibility, temporary/permanent/fairy split, shop grouping, pending action metadata, worldbook green-light mounting, schema regeneration, and verification.
- Scope boundary: This plan deliberately does not implement the final unified AI承接闭环 for服装/禁器/丹药. That should be a separate plan after this data layer lands.
- No placeholders: All tasks include explicit files, test snippets, commands, and expected outcomes.
- Type consistency: `丹药分类`, `作用线`, `AI短提示`, `显示名`, `分类`, `药阶` are used consistently across data, display, pending action, and schema tasks.
