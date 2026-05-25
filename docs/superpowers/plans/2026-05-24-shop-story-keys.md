# 商城剧情钥匙整改 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 将商城剧情从“购买 NPC 名称并直接剧透一句秘密”整改为“购买剧情信物，解锁每名 NPC 一条深层剧情钥匙”。

**Architecture:** 第一版采用 A 保守方案：不改 `schema.ts`，继续使用 `剧情.已解锁: string[]`。每条剧情商品以逻辑名作为解锁主键，商城展示剧情信物名，购买后不进入背包，只写入 `剧情.已解锁` 并把剧情线元数据写入 `系统.待处理交互`，由下一楼层 AI 承接。

**Tech Stack:** Vue 3, Pinia, TypeScript, Vitest, YAML worldbook, SillyTavern MVU.

---

## Scope

本轮只做每个 NPC 一条剧情钥匙，共 5 条：白芷、苏芸、纪兰、沈月秋、柳素衣。不新增剧情进度字段，不做分段进度 UI，不改 `剧情.已解锁` schema。

## Files

- Modify: `src/雌堕合欢宗/界面/data/scenes.ts` — 扩展 `Story` 类型与 5 条剧情钥匙数据。
- Modify: `src/雌堕合欢宗/界面/data/itemDisplay.ts` — 支持剧情商品显示名、短提示与剧情线元数据读取。
- Modify: `src/雌堕合欢宗/界面/data/itemLifecycle.ts` — 剧情生命周期从旧 `NPC` 主键切换到剧情逻辑名。
- Modify: `src/雌堕合欢宗/界面/data/itemDisplay.test.ts` — 锁定剧情显示名、短提示、世界书覆盖和绿灯挂载。
- Modify: `src/雌堕合欢宗/界面/pages/ShopPage.vue` — 剧情弹窗不再显示硬剧透，改为剧情信物、关联 NPC、秘密主题、解锁提示。
- Modify: `src/雌堕合欢宗/界面/pages/ShopPage.test.ts` — 锁定剧情页商品显示、购买写入和待处理交互元数据。
- Modify: `src/雌堕合欢宗/界面/composables/usePendingAction.ts` — 购买剧情时附加剧情线、关联 NPC、秘密主题、AI 短提示。
- Create: `src/雌堕合欢宗/世界书/道具/剧情叙事规则.yaml` — 绿灯资料库，约束 AI 如何承接剧情钥匙。
- Modify: `src/雌堕合欢宗/index.yaml` — 挂载 `剧情叙事规则` 绿灯条目。
- Modify: `docs/前端架构指南.md` — 记录商城剧情商品边界。
- Modify: `docs/PRD/当前大改动整理报告-2026-05-24.md` — 追加本轮整改说明。

---

### Task 1: Write Red Tests For Story Keys

**Files:**
- Modify: `src/雌堕合欢宗/界面/data/itemDisplay.test.ts`
- Modify: `src/雌堕合欢宗/界面/pages/ShopPage.test.ts`

- [x] **Step 1: Add itemDisplay failing test**

Add imports and assertions that prove剧情逻辑名 maps to剧情信物 display data.

```ts
import { 特殊剧情 } from './scenes';

it('剧情逻辑名映射为商城信物名、剧情线与AI短提示', () => {
  expect(getItemDisplayName('白芷旧誓线')).toBe('断鸢玉扣');
  expect(getItemShortHint('白芷旧誓线')).toContain('旧誓');
  expect(特殊剧情).toHaveLength(5);
});
```

- [x] **Step 2: Add ShopPage failing test**

Replace the old `购买特殊剧情后加入剧情解锁列表且不进入背包` expectations with剧情钥匙 behavior.

```ts
it('剧情商城显示剧情信物名，购买后解锁剧情线且不进入背包', async () => {
  mockData.系统.灵石 = 100000;
  const wrapper = mountShop();
  await wrapper.findAll('.tab-btn')[4].trigger('click');
  await flushPromises();

  expect(wrapper.findAll('.item-card')).toHaveLength(5);
  const storyCard = wrapper.findAll('.item-card').find(c => c.find('.item-name').text() === '断鸢玉扣');
  expect(storyCard).toBeTruthy();

  await storyCard!.trigger('click');
  expect(wrapper.find('.modal-title').text()).toBe('断鸢玉扣');
  expect(wrapper.find('.modal-hint').text()).toContain('旧誓');
  expect(wrapper.text()).toContain('白芷');
  expect(wrapper.text()).toContain('旧誓');

  await wrapper.find('.buy-btn').trigger('click');

  expect(mockData.剧情.已解锁).toContain('白芷旧誓线');
  expect(mockData.剧情.已解锁).not.toContain('白芷');
  expect(mockData.道具.拥有['白芷旧誓线']).toBeUndefined();
  expect(mockData.系统.待处理交互[0]).toMatchObject({
    类型: '购买物品',
    目标: '玩家',
    道具: '白芷旧誓线',
    道具显示名: '断鸢玉扣',
    剧情线: '白芷旧誓线',
    关联NPC: '白芷',
    秘密主题: '旧誓/依赖/被保护欲',
  });
});
```

- [x] **Step 3: Run red tests**

Run:

```powershell
npx vitest run src/雌堕合欢宗/界面/data/itemDisplay.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts
```

Expected: FAIL. `白芷旧誓线` is unknown, story tab still shows `白芷`, and pending action lacks剧情元数据.

---

### Task 2: Expand Story Data Model

**Files:**
- Modify: `src/雌堕合欢宗/界面/data/scenes.ts`
- Modify: `src/雌堕合欢宗/界面/data/itemLifecycle.ts`

- [x] **Step 1: Replace Story interface**

Use a剧情钥匙 structure that still fits existing shop item shape.

```ts
export interface Story {
  名称: string;
  显示名: string;
  NPC: string;
  价格: number;
  好感度门槛: number;
  剧情线: string;
  秘密主题: string;
  推荐场景: string[];
  关联道具: string[];
  解锁提示: string;
  AI短提示: string;
  揭示?: undefined;
  类型?: undefined;
  效果?: undefined;
}
```

- [x] **Step 2: Replace 特殊剧情 with 5 story keys**

Use these five first-version entries.

```ts
export const 特殊剧情: Story[] = [
  {
    名称: '白芷旧誓线',
    显示名: '断鸢玉扣',
    NPC: '白芷',
    价格: 2200,
    好感度门槛: 50,
    剧情线: '白芷旧誓线',
    秘密主题: '旧誓/依赖/被保护欲',
    推荐场景: ['听风廊', '锁心静室', '阴阳池'],
    关联道具: ['灵识禁器', '铃系禁器', '温药'],
    解锁提示: '玉扣牵出白芷旧日誓言，后续风声与心音会更容易触到她不敢承认的依赖。',
    AI短提示: '白芷旧誓会让保护欲转向羞耻依赖，适合温柔逼近和心防松动。',
  },
  {
    名称: '苏芸错炉线',
    显示名: '错炉药签',
    NPC: '苏芸',
    价格: 2600,
    好感度门槛: 50,
    剧情线: '苏芸错炉线',
    秘密主题: '药庐失控/骄纵反噬/试药羞耻',
    推荐场景: ['药庐暖阁', '渊底灵脉', '莲纹浴房'],
    关联道具: ['临时丹药', '永久丹药', '体香类效果'],
    解锁提示: '药签指向苏芸曾经遮掩的错炉记录，后续试药与药性反噬会更容易被触发。',
    AI短提示: '苏芸的错炉记录会把骄纵变成反噬，适合试药、误服和药性失控。',
  },
  {
    名称: '纪兰禁录线',
    显示名: '朱批禁录',
    NPC: '纪兰',
    价格: 3000,
    好感度门槛: 70,
    剧情线: '纪兰禁录线',
    秘密主题: '禁录审问/执事破戒/记录羞耻',
    推荐场景: ['经阁密室', '锁心静室', '听风廊'],
    关联道具: ['灵识禁器', '口舌禁器', '心音回响'],
    解锁提示: '朱批禁录让纪兰的公正外壳出现裂缝，后续审问与记录会牵出她的破戒边界。',
    AI短提示: '纪兰会在记录与被记录之间失衡，适合审问、心音和执事破戒。',
  },
  {
    名称: '沈月秋失衡线',
    显示名: '裂算玉筹',
    NPC: '沈月秋',
    价格: 3600,
    好感度门槛: 70,
    剧情线: '沈月秋失衡线',
    秘密主题: '数据调教/长老失衡/理性破防',
    推荐场景: ['渊底灵脉', '锁心静室', '阴阳池'],
    关联道具: ['命契禁器', '烈药', '阵法道具'],
    解锁提示: '玉筹记录着沈月秋算错的一次身体反应，后续理性推演会被羞耻数据反噬。',
    AI短提示: '沈月秋越想精密控制，越容易被身体数据反证，适合理性破防。',
  },
  {
    名称: '柳素衣命契线',
    显示名: '素印残契',
    NPC: '柳素衣',
    价格: 4800,
    好感度门槛: 90,
    剧情线: '柳素衣命契线',
    秘密主题: '掌门真相/命契归属/宗门权力',
    推荐场景: ['掌门殿偏殿', '听风廊', '莲纹浴房'],
    关联道具: ['命契层服装', '命契器阶禁器', '仙奴丹'],
    解锁提示: '残契牵出柳素衣真正想重写的宗门秩序，后续命契、权位与归属会开始互相咬合。',
    AI短提示: '柳素衣的掌门威严会与命契真相冲突，适合权力羞耻和最终归属推进。',
  },
];
```

- [x] **Step 3: Update lifecycle story key set**

Change剧情名称 from NPC to logic name.

```ts
const 剧情名称 = new Set(特殊剧情.map(item => item.名称));
```

- [x] **Step 4: Run focused tests**

Run:

```powershell
npx vitest run src/雌堕合欢宗/界面/data/itemLifecycle.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts
```

Expected: Some tests still fail because display helpers and pending metadata are not implemented yet.

---

### Task 3: Add Story Display Helpers And Pending Metadata

**Files:**
- Modify: `src/雌堕合欢宗/界面/data/itemDisplay.ts`
- Modify: `src/雌堕合欢宗/界面/composables/usePendingAction.ts`

- [x] **Step 1: Import 特殊剧情 and add map**

```ts
import { 特殊场景, 特殊剧情 } from './scenes';

const storyByName = new Map(特殊剧情.map(story => [story.名称, story]));
```

- [x] **Step 2: Include story display and hint**

```ts
export function getItemDisplayName(logicName: string): string {
  return outfitByName.get(logicName)?.显示名
    ?? contrabandByName.get(logicName)?.显示名
    ?? pillByName.get(logicName)?.显示名
    ?? sceneByName.get(logicName)?.显示名
    ?? storyByName.get(logicName)?.显示名
    ?? logicName;
}

export function getItemShortHint(logicName: string): string {
  return outfitByName.get(logicName)?.AI短提示
    ?? contrabandByName.get(logicName)?.AI短提示
    ?? pillByName.get(logicName)?.AI短提示
    ?? sceneByName.get(logicName)?.AI短提示
    ?? storyByName.get(logicName)?.AI短提示
    ?? '';
}
```

- [x] **Step 3: Add story metadata helpers**

```ts
export function getStoryNpc(logicName: string): string {
  return storyByName.get(logicName)?.NPC ?? '';
}

export function getStoryTheme(logicName: string): string {
  return storyByName.get(logicName)?.秘密主题 ?? '';
}

export function getStoryLine(logicName: string): string {
  return storyByName.get(logicName)?.剧情线 ?? '';
}
```

- [x] **Step 4: Extend pending action type**

Add fields:

```ts
  剧情线?: string;
  关联NPC?: string;
  秘密主题?: string;
```

- [x] **Step 5: Attach story metadata in getItemNarrativeMeta**

```ts
const 剧情线 = getStoryLine(道具);
const 关联NPC = getStoryNpc(道具);
const 秘密主题 = getStoryTheme(道具);

return Object.fromEntries(
  Object.entries({
    道具显示名: 道具显示名 === 道具 ? '' : 道具显示名,
    器阶,
    作用部位,
    丹药分类,
    作用线,
    剧情线,
    关联NPC,
    秘密主题,
    AI短提示,
  }).filter(([, value]) => value),
) as Partial<PendingAction>;
```

- [x] **Step 6: Run focused tests**

Run:

```powershell
npx vitest run src/雌堕合欢宗/界面/data/itemDisplay.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts
```

Expected: Remaining failures should be only modal text and old test expectations.

---

### Task 4: Update Shop Story UI

**Files:**
- Modify: `src/雌堕合欢宗/界面/pages/ShopPage.vue`

- [x] **Step 1: Render story metadata instead of old hard reveal**

Replace:

```vue
<p v-if="'揭示' in selectedItem" class="modal-desc">{{ selectedItem.NPC }}：{{ selectedItem.揭示 }}</p>
```

With:

```vue
<div v-if="'剧情线' in selectedItem" class="modal-story">
  <p class="modal-desc">{{ selectedItem.NPC }} · {{ selectedItem.秘密主题 }}</p>
  <p class="modal-desc">{{ selectedItem.解锁提示 }}</p>
</div>
```

- [x] **Step 2: Ensure getItemName uses 名称 for stories**

Keep this behavior, now that story has `名称`:

```ts
function getItemName(item: ShopItem): string {
  return '名称' in item && item.名称 ? item.名称 : 'NPC' in item ? item.NPC : '';
}
```

- [x] **Step 3: Run ShopPage focused test**

Run:

```powershell
npx vitest run src/雌堕合欢宗/界面/pages/ShopPage.test.ts
```

Expected: PASS after updating old story expectations.

---

### Task 5: Add Story Worldbook Rules

**Files:**
- Create: `src/雌堕合欢宗/世界书/道具/剧情叙事规则.yaml`
- Modify: `src/雌堕合欢宗/index.yaml`
- Modify: `src/雌堕合欢宗/界面/data/itemDisplay.test.ts`

- [x] **Step 1: Add worldbook test**

```ts
it('世界书剧情叙事规则覆盖全部剧情钥匙并作为绿灯资料库挂载', () => {
  const yaml = readFileSync('src/雌堕合欢宗/世界书/道具/剧情叙事规则.yaml', 'utf-8');
  const indexYaml = readFileSync('src/雌堕合欢宗/index.yaml', 'utf-8');

  expect(yaml).toContain('剧情购买读取规则');
  expect(yaml).toContain('剧情.已解锁');
  expect(yaml).toContain('不是一次性剧透');
  for (const story of 特殊剧情) {
    expect(yaml, `missing story narrative rule for ${story.名称}`).toContain(`  ${story.名称}:`);
    expect(yaml, `missing story token name for ${story.名称}`).toContain(`显示名: ${story.显示名}`);
  }
  expect(indexYaml).toMatch(/名称: 剧情叙事规则[\s\S]*?激活策略:[\s\S]*?类型: 绿灯/);
  expect(indexYaml).toContain('文件: 世界书/道具/剧情叙事规则');
});
```

- [x] **Step 2: Create concise worldbook file**

The file must include: core boundary, AI承接方式, and all 5 story keys with显示名、关联NPC、秘密主题、推荐场景、关联道具、解锁提示、叙事重点.

- [x] **Step 3: Mount green-light entry**

Insert after `场景叙事规则` or before `动态场景系统` in `src/雌堕合欢宗/index.yaml`.

```yaml
      - 名称: 剧情叙事规则
        启用: true
        激活策略:
          类型: 绿灯
          关键字:
            - 剧情叙事规则
            - 剧情.已解锁
            - 断鸢玉扣
            - 错炉药签
            - 朱批禁录
            - 裂算玉筹
            - 素印残契
            - 白芷旧誓线
            - 苏芸错炉线
            - 纪兰禁录线
            - 沈月秋失衡线
            - 柳素衣命契线
        插入位置:
          类型: 角色定义之前
          顺序: 12
        递归:
          不可被其他条目激活: true
          不可激活其他条目: true
        文件: 世界书/道具/剧情叙事规则
```

- [x] **Step 4: Run itemDisplay focused test**

Run:

```powershell
npx vitest run src/雌堕合欢宗/界面/data/itemDisplay.test.ts
```

Expected: PASS.

---

### Task 6: Documentation And Verification

**Files:**
- Modify: `docs/前端架构指南.md`
- Modify: `docs/PRD/当前大改动整理报告-2026-05-24.md`

- [x] **Step 1: Update architecture guide**

Add a section `商城剧情商品边界（2026-05-24）` near the场景商品边界 section:

```md
商城剧情商品采用“剧情信物 / 线索钥匙”表达。前端展示信物名，变量层写入剧情线逻辑名；购买后只写入 `剧情.已解锁`，不写入 `道具.拥有`。第一版不新增 schema 字段，不记录剧情分段进度；AI 后续根据已解锁剧情线、当前场景、风声、心音和 NPC 状态自然承接。
```

- [x] **Step 2: Update current big-change report**

Add subsection `3.9 商城剧情钥匙整改` with 5 story keys and no-schema-change boundary.

- [x] **Step 3: Run focused verification**

```powershell
npx vitest run src/雌堕合欢宗/界面/data/itemDisplay.test.ts src/雌堕合欢宗/界面/data/itemLifecycle.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts
```

Expected: all selected files pass.

- [x] **Step 4: Run full verification**

```powershell
npx vitest run
git diff --check
npm run build
```

Expected: tests pass, no whitespace errors, build succeeds. Existing `index.html` size warning is acceptable if unchanged.

---

## Self-Review

- Spec coverage: A 保守方案、不改 schema、每 NPC 一条剧情钥匙、购买写入 `剧情.已解锁`、不进入背包、绿灯世界书、文档留痕均有任务覆盖。
- Placeholder scan: No TBD/TODO placeholders remain; all required names, fields, commands, and expected outcomes are explicit.
- Type consistency: `Story.名称` is the lifecycle key, `Story.显示名` is player-facing name, `Story.剧情线` mirrors logical line id for AI metadata, and `PendingAction` uses optional story metadata fields only for story purchases.
