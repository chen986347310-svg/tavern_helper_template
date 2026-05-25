# P2 牝奴期主控台 UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `docs/PRD/p2阶段uiux设计.md` 的视觉风格与交互方案落地为现有 MVU 架构可驱动、可测试、可调试的 P2 牝奴期主控台。

**Architecture:** 以 `store.data` 为唯一 UI 数据源，先扩展 schema/initvar/worldbook 变量，再用纯函数把 P2 数值映射为玩家可读的沉浸式语义，最后由 `Phase2Page.vue` 组合局部组件。前端交互继续写入 `系统.待处理交互`，动态注入由 `pendingActionPrompt.ts` 负责约束 AI 承接，DebugPanel 只显示后台可见信息。

**Tech Stack:** Vue 3 `<script setup>`, Pinia/MVU, TypeScript, SCSS scoped styles, Zod 4, Vitest + Vue Test Utils, SillyTavern `<UpdateVariable><JSONPatch>` 链路。

---

## Source Design Boundaries

采用 `docs/PRD/p2阶段uiux设计.md` 的这些内容：

- 色彩：深空底墨 `#0F0A14`、朱批血墨 `#9C2C31`、受控朱红 `#D44D54`、秩序暗金 `#A38353`、灵识玉白 `#E6E1DA`。
- P2 主界面气质：牝奴期主控台，而不是失败结局状态卡。
- 组件意象：牝印核心、朱批命令、执事名册、日课篡改、牵丝凝视、听风羞名、烙名痕迹。
- 交互方向：点击羞名风声、日课异动、支配者传唤时，进入 `系统.待处理交互`，由 AI 在下一楼层强制承接。

不采用参考稿中的这些内容：

- 不引入 `world_patch`、`target_zone`、`current_turn`、`stage: P2_MINU`。
- 不复制参考稿 Vue 代码。
- 不让前端本地生成剧情正文。
- 不绕过现有 `<JSONPatch>`、`系统.待处理交互`、`系统.风声列表`、`牝奴.*` 数据模型。

## File Structure

- Modify: `src/雌堕合欢宗/schema.ts` 负责新增 P2 UI/runtime 字段与风声元数据校验。
- Modify: `src/雌堕合欢宗/世界书/变量/initvar.yaml` 负责新字段初始值。
- Modify: `src/雌堕合欢宗/世界书/变量/变量列表.yaml` 负责给 AI 与维护者说明字段含义。
- Create: `src/雌堕合欢宗/界面/data/phase2Display.ts` 负责纯显示映射，无 store 读写。
- Create: `src/雌堕合欢宗/界面/data/phase2Display.test.ts` 覆盖阈值、称谓、兜底。
- Create: `src/雌堕合欢宗/界面/components/phase2/StigmaCore.vue` 显示牝印核心、命令强度、当前命令。
- Create: `src/雌堕合欢宗/界面/components/phase2/DailyRoutinePanel.vue` 显示当前日课、今日调教次数、最近结算。
- Create: `src/雌堕合欢宗/界面/components/phase2/DominatorPanel.vue` 显示当前/上次支配者与支配次数。
- Create: `src/雌堕合欢宗/界面/components/phase2/WhisperPanel.vue` 显示 P2 羞名风声并发起追查交互。
- Create: `src/雌堕合欢宗/界面/components/phase2/BrandTagsPanel.vue` 显示羞名标签与烙名等级。
- Modify: `src/雌堕合欢宗/界面/pages/Phase2Page.vue` 组合新组件，保留旧的改造、牝阴决、装备信息为次级区域。
- Modify: `src/雌堕合欢宗/界面/pages/Phase2Page.test.ts` 改为主控台验收测试。
- Modify: `src/雌堕合欢宗/界面/components/SystemBar.vue` 让 P2 状态栏支持牝印微缩盘、日课、命令、P2 风声涟漪。
- Modify: `src/雌堕合欢宗/界面/components/SystemBar.test.ts` 覆盖 P2 风声不再被过滤掉。
- Modify: `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts` 让 P2 羞名风声/传唤/日课异动有专用承接措辞。
- Create or Modify: `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 覆盖 P2 追查风声提示。
- Modify: `src/雌堕合欢宗/界面/components/DebugPanel.vue` 增加 P2 字段和羞名风声调试视图。
- Modify: `src/雌堕合欢宗/界面/components/DebugPanel.test.ts` 若已存在则扩展；若不存在则新增基础渲染测试。
- Modify: `docs/PRD/世界运行核心-时间日程事件后果账本PRD-2026-05-25.md` 记录 P2 UI 落地字段与验收口径。

## Data Contract

新增字段以兼容旧存档为原则，所有字段都有 `prefault` 或可选兜底：

```ts
牝奴: {
  当前日课: string;
  当前支配者: '' | '白芷' | '苏芸' | '纪兰' | '沈月秋' | '柳素衣';
  当前命令: string;
  命令强度: number; // 0..100
  今日调教次数: number; // 0..99
  最近调教结算: string;
  羞名标签: string[]; // max 8
  调教记录: Array<{
    id: string;
    时辰: '晨时' | '午时' | '酉时' | '亥时';
    支配者: string;
    摘要: string;
    羞名等级: '微闻' | '挂牌' | '烙名';
  }>; // max 12
}

系统.风声列表[]: {
  来源: '弟子传闻' | '灵气异动' | '器物残痕' | 'NPC行踪' | '宗门告示' | '梦兆' | '剧情钥匙' | '场景令牌' | '特殊事件' | '牝奴日课' | '牝印命令' | '调教余波' | '宗门闲谈' | '公开示众' | '支配者传唤';
  凝视来源?: string;
  羞名等级?: '微闻' | '挂牌' | '烙名';
  羞名标签?: string[];
  反噬日课?: string;
  是否可承接?: boolean;
}
```

## Tasks

### Task 1: Schema and Init Variables

**Files:**
- Modify: `src/雌堕合欢宗/schema.ts`
- Modify: `src/雌堕合欢宗/世界书/变量/initvar.yaml`
- Modify: `src/雌堕合欢宗/世界书/变量/变量列表.yaml`

- [ ] **Step 1: Write schema regression tests if schema tests exist**

Run: `rg "Schema.safeParse|validateVariables|schema" src -g "*.test.ts"`

If a schema test file exists, add this test near the existing schema parse tests:

```ts
import { describe, expect, it } from 'vitest';
import { Schema } from './schema';

describe('P2 牝奴期 runtime fields', () => {
  it('fills P2 master-console defaults for old saves', () => {
    const parsed = Schema.parse({ 系统: { 阶段: '牝奴期' }, 牝奴: {} });

    expect(parsed.牝奴.当前日课).toBe('候命');
    expect(parsed.牝奴.当前支配者).toBe('');
    expect(parsed.牝奴.当前命令).toBe('');
    expect(parsed.牝奴.命令强度).toBe(0);
    expect(parsed.牝奴.今日调教次数).toBe(0);
    expect(parsed.牝奴.最近调教结算).toBe('');
    expect(parsed.牝奴.羞名标签).toEqual([]);
    expect(parsed.牝奴.调教记录).toEqual([]);
  });

  it('accepts P2 shame rumor metadata', () => {
    const parsed = Schema.parse({
      系统: {
        风声列表: [
          {
            来源: '公开示众',
            地点: '莲灯前苑',
            风声文本: '廊下有人低声念起你的羞名。',
            凝视来源: '执事名册',
            羞名等级: '挂牌',
            羞名标签: ['听命', '示众'],
            反噬日课: '午后点名',
            是否可承接: true,
          },
        ],
      },
    });

    expect(parsed.系统.风声列表[0].来源).toBe('公开示众');
    expect(parsed.系统.风声列表[0].羞名等级).toBe('挂牌');
  });
});
```

- [ ] **Step 2: Run schema test and verify it fails before implementation**

Run the exact test file found in Step 1, for example: `npx vitest run src/雌堕合欢宗/schema.test.ts`

Expected: FAIL because fields such as `当前日课` or source `公开示众` are not defined.

- [ ] **Step 3: Extend `schema.ts`**

Add near the existing enums:

```ts
const 羞名等级Schema = z.enum(['微闻', '挂牌', '烙名']);
const P2支配者Schema = z.union([NPC名Schema, z.literal('')]);
```

Extend `风声Schema.来源` enum to include:

```ts
'牝奴日课', '牝印命令', '调教余波', '宗门闲谈', '公开示众', '支配者传唤'
```

Add to `风声Schema`:

```ts
凝视来源: z.string().optional(),
羞名等级: 羞名等级Schema.optional(),
羞名标签: z.array(z.string()).max(8).optional(),
反噬日课: z.string().optional(),
是否可承接: z.boolean().optional(),
```

Add inside `牝奴` object:

```ts
当前日课: z.string().prefault('候命'),
当前支配者: P2支配者Schema.prefault(''),
当前命令: z.string().prefault(''),
命令强度: z.coerce.number().transform(value => _.clamp(value, 0, 100)).prefault(0),
今日调教次数: z.coerce.number().transform(value => _.clamp(value, 0, 99)).prefault(0),
最近调教结算: z.string().prefault(''),
羞名标签: z.array(z.string()).max(8).prefault([]),
调教记录: z
  .array(
    z.object({
      id: z.string().prefault(''),
      时辰: TimeNameSchema.prefault('晨时'),
      支配者: z.string().prefault(''),
      摘要: z.string().prefault(''),
      羞名等级: 羞名等级Schema.prefault('微闻'),
    }),
  )
  .max(12)
  .prefault([]),
```

- [ ] **Step 4: Update worldbook variable defaults**

In `src/雌堕合欢宗/世界书/变量/initvar.yaml`, add the same fields under `牝奴` with these values:

```yaml
当前日课: 候命
当前支配者: ''
当前命令: ''
命令强度: 0
今日调教次数: 0
最近调教结算: ''
羞名标签: []
调教记录: []
```

In `src/雌堕合欢宗/世界书/变量/变量列表.yaml`, document each field in one line, using these meanings:

```yaml
当前日课: P2阶段当前被安排或反噬出的日课名，用于UI和AI承接。
当前支配者: 当前牵丝凝视的NPC名，为空表示无人直接支配。
当前命令: 牝印正在压下的命令短句。
命令强度: 0-100，决定牝印核心从沉寂、发热到强制的视觉状态。
今日调教次数: 当日已发生的调教/示众/传唤次数。
最近调教结算: 最近一次后果账本给出的玩家可见摘要。
羞名标签: 世界流传在玩家身上的羞名短标签。
调教记录: 最近12条P2调教、示众、传唤记录。
```

- [ ] **Step 5: Run schema and targeted UI tests**

Run: `npx vitest run src/雌堕合欢宗/schema.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts`

Expected: PASS for schema tests; Phase2Page may still pass because new fields have defaults.

- [ ] **Step 6: Commit**

```bash
git add src/雌堕合欢宗/schema.ts src/雌堕合欢宗/世界书/变量/initvar.yaml src/雌堕合欢宗/世界书/变量/变量列表.yaml
git commit -m "feat: extend p2 runtime data contract"
```

### Task 2: P2 Display Mapping Helpers

**Files:**
- Create: `src/雌堕合欢宗/界面/data/phase2Display.ts`
- Create: `src/雌堕合欢宗/界面/data/phase2Display.test.ts`

- [ ] **Step 1: Write failing helper tests**

Create `src/雌堕合欢宗/界面/data/phase2Display.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { get命令状态, get堕落语义, get牝阴决语义, get羞名Marker, get支配者称谓 } from './phase2Display';

describe('phase2Display', () => {
  it('maps corruption into immersive labels', () => {
    expect(get堕落语义(0).label).toBe('未刻');
    expect(get堕落语义(52).label).toBe('纹醒');
    expect(get堕落语义(91).label).toBe('烙成');
  });

  it('maps command intensity into stigma state', () => {
    expect(get命令状态('', 0).state).toBe('沉寂');
    expect(get命令状态('跪候传唤', 55).state).toBe('发热');
    expect(get命令状态('当众应名', 88).state).toBe('强制');
  });

  it('maps yinjue layer and shame markers', () => {
    expect(get牝阴决语义(0).label).toBe('未启');
    expect(get牝阴决语义(5).label).toBe('入髓');
    expect(get羞名Marker('烙名').glyph).toBe('烙');
  });

  it('keeps dominator names world-facing', () => {
    expect(get支配者称谓('柳素衣').title).toContain('柳素衣');
    expect(get支配者称谓('').title).toBe('无人牵丝');
  });
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npx vitest run src/雌堕合欢宗/界面/data/phase2Display.test.ts`

Expected: FAIL because `phase2Display.ts` does not exist.

- [ ] **Step 3: Implement helper file**

Create `src/雌堕合欢宗/界面/data/phase2Display.ts`:

```ts
export type StigmaState = '沉寂' | '发热' | '强制';
export type ShameLevel = '微闻' | '挂牌' | '烙名';

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), 100);
}

export function get堕落语义(value: number) {
  const v = clampPercent(value);
  if (v >= 90) return { label: '烙成', tone: 'forced', glyph: '烙' } as const;
  if (v >= 70) return { label: '深缠', tone: 'heated', glyph: '缠' } as const;
  if (v >= 50) return { label: '纹醒', tone: 'heated', glyph: '纹' } as const;
  if (v >= 30) return { label: '初染', tone: 'awake', glyph: '染' } as const;
  return { label: '未刻', tone: 'quiet', glyph: '寂' } as const;
}

export function get牝阴决语义(layer: number) {
  const v = Math.min(Math.max(Math.round(Number.isFinite(layer) ? layer : 0), 0), 9);
  if (v >= 8) return { label: '归炉', glyph: '炉' } as const;
  if (v >= 5) return { label: '入髓', glyph: '髓' } as const;
  if (v >= 2) return { label: '绕脉', glyph: '脉' } as const;
  return { label: '未启', glyph: '决' } as const;
}

export function get命令状态(command: string, intensity: number): { state: StigmaState; label: string; glyph: string } {
  const v = clampPercent(intensity);
  if (!command && v === 0) return { state: '沉寂', label: '候命', glyph: '寂' };
  if (v >= 75) return { state: '强制', label: command || '强令压印', glyph: '令' };
  return { state: '发热', label: command || '牝印发热', glyph: '印' };
}

export function get羞名Marker(level: ShameLevel | string | undefined) {
  if (level === '烙名') return { level: '烙名', glyph: '烙', className: 'shame--branded' } as const;
  if (level === '挂牌') return { level: '挂牌', glyph: '牌', className: 'shame--posted' } as const;
  return { level: '微闻', glyph: '闻', className: 'shame--whisper' } as const;
}

export function get支配者称谓(name: string) {
  if (!name) return { title: '无人牵丝', glyph: '空', className: 'dominator--none' } as const;
  if (name === '柳素衣') return { title: '柳素衣 · 静默牵丝', glyph: '柳', className: 'dominator--liu' } as const;
  return { title: `${name} · 牵丝在手`, glyph: name.slice(0, 1), className: 'dominator--active' } as const;
}
```

- [ ] **Step 4: Run helper tests**

Run: `npx vitest run src/雌堕合欢宗/界面/data/phase2Display.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/雌堕合欢宗/界面/data/phase2Display.ts src/雌堕合欢宗/界面/data/phase2Display.test.ts
git commit -m "feat: add p2 display mappings"
```

### Task 3: P2 Component Set

**Files:**
- Create: `src/雌堕合欢宗/界面/components/phase2/StigmaCore.vue`
- Create: `src/雌堕合欢宗/界面/components/phase2/DailyRoutinePanel.vue`
- Create: `src/雌堕合欢宗/界面/components/phase2/DominatorPanel.vue`
- Create: `src/雌堕合欢宗/界面/components/phase2/WhisperPanel.vue`
- Create: `src/雌堕合欢宗/界面/components/phase2/BrandTagsPanel.vue`
- Create: `src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts`

- [ ] **Step 1: Write component tests first**

Create `src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts`:

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StigmaCore from './StigmaCore.vue';
import DailyRoutinePanel from './DailyRoutinePanel.vue';
import DominatorPanel from './DominatorPanel.vue';
import WhisperPanel from './WhisperPanel.vue';
import BrandTagsPanel from './BrandTagsPanel.vue';

describe('P2 master console components', () => {
  it('renders stigma core with forced command state', () => {
    const wrapper = mount(StigmaCore, { props: { corruption: 86, yinjueLayer: 6, command: '当众应名', intensity: 88 } });
    expect(wrapper.text()).toContain('强制');
    expect(wrapper.text()).toContain('当众应名');
    expect(wrapper.attributes('data-stigma-state')).toBe('强制');
  });

  it('renders routine ledger without modern task wording', () => {
    const wrapper = mount(DailyRoutinePanel, { props: { routine: '午后点名', count: 3, settlement: '廊下应名一次' } });
    expect(wrapper.text()).toContain('午后点名');
    expect(wrapper.text()).toContain('廊下应名一次');
    expect(wrapper.text()).not.toContain('任务');
  });

  it('renders dominator gaze including Liu special state', () => {
    const wrapper = mount(DominatorPanel, { props: { current: '柳素衣', last: '沈月秋', counts: { 白芷: 0, 苏芸: 1, 纪兰: 2, 沈月秋: 3, 柳素衣: 4 } } });
    expect(wrapper.text()).toContain('柳素衣');
    expect(wrapper.text()).toContain('静默牵丝');
  });

  it('emits chase action for shame rumor', async () => {
    const wrapper = mount(WhisperPanel, {
      props: {
        rumors: [{ id: 'p2-shame-1', 来源: '公开示众', 地点: '莲灯前苑', 风声文本: '有人念起你的羞名。', 状态: '未读', 羞名等级: '挂牌', 故事钩子: '廊下名牌微晃' }],
      },
    });
    await wrapper.get('[data-testid="p2-whisper-action"]').trigger('click');
    expect(wrapper.emitted('chase-rumor')?.[0]?.[0]).toMatchObject({ id: 'p2-shame-1', 羞名等级: '挂牌' });
  });

  it('renders brand tags as seal marks', () => {
    const wrapper = mount(BrandTagsPanel, { props: { tags: ['听命', '示众', '候传'] } });
    expect(wrapper.findAll('[data-testid="p2-brand-tag"]')).toHaveLength(3);
    expect(wrapper.text()).toContain('听命');
  });
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npx vitest run src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts`

Expected: FAIL because components do not exist.

- [ ] **Step 3: Implement `StigmaCore.vue`**

Create a focused component using `get命令状态`, `get堕落语义`, `get牝阴决语义`. Required DOM contract:

```vue
<template>
  <section class="p2-stigma-core" :data-stigma-state="commandState.state" aria-label="牝印核心">
    <div class="stigma-orbit" aria-hidden="true"><span>{{ commandState.glyph }}</span></div>
    <div class="stigma-copy">
      <div class="stigma-state">{{ commandState.state }}</div>
      <div class="stigma-command">{{ commandState.label }}</div>
      <div class="stigma-metrics">
        <span>{{ corruptionText.glyph }} {{ corruptionText.label }} {{ corruption }}%</span>
        <span>{{ yinjueText.glyph }} {{ yinjueText.label }} {{ yinjueLayer }}/9</span>
      </div>
    </div>
  </section>
</template>
```

Use scoped SCSS colors from Source Design Boundaries and keep border radius at `6px` or below.

- [ ] **Step 4: Implement `DailyRoutinePanel.vue`**

Props: `{ routine: string; count: number; settlement: string }`. Render `执事名册`, `日课`, `朱批`, and fallback text `候命` / `尚无结算` when strings are empty. Do not render `任务`, `成就`, `领取奖励`, or `通知`.

- [ ] **Step 5: Implement `DominatorPanel.vue`**

Props: `{ current: string; last: string; counts: Record<string, number> }`. Use `get支配者称谓(current)`, show the top three non-zero counts as gaze traces, and render empty state as `牵丝未落`.

- [ ] **Step 6: Implement `WhisperPanel.vue`**

Props: `rumors: Array<{ id?: string; 来源?: string; 地点: string; 风声文本: string; 状态?: string; 羞名等级?: string; 故事钩子?: string }>`.

Emit: `chase-rumor` with the full rumor object when the player clicks a rumor. Filter out `状态 === '已失效'`, show at most three, render empty state `风铃暂歇`.

- [ ] **Step 7: Implement `BrandTagsPanel.vue`**

Props: `{ tags: string[] }`. Render up to eight tags with `data-testid="p2-brand-tag"`; empty state is `尚未烙名`.

- [ ] **Step 8: Run component tests**

Run: `npx vitest run src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts`

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/雌堕合欢宗/界面/components/phase2
git commit -m "feat: add p2 master console components"
```

### Task 4: Refactor Phase2Page Into Master Console

**Files:**
- Modify: `src/雌堕合欢宗/界面/pages/Phase2Page.vue`
- Modify: `src/雌堕合欢宗/界面/pages/Phase2Page.test.ts`

- [ ] **Step 1: Update page tests**

Add or replace tests so they assert the new console while preserving legacy information:

```ts
it('renders P2 as master console with core sections', () => {
  store.data.牝奴.堕落度 = 86;
  store.data.牝奴.牝阴决层数 = 6;
  store.data.牝奴.当前日课 = '午后点名';
  store.data.牝奴.当前支配者 = '柳素衣';
  store.data.牝奴.当前命令 = '当众应名';
  store.data.牝奴.命令强度 = 88;
  store.data.牝奴.羞名标签 = ['听命', '示众'];
  store.data.系统.风声列表 = [{ id: 'p2-shame-1', 来源: '公开示众', 地点: '莲灯前苑', 风声文本: '有人念起你的羞名。', 状态: '未读', 羞名等级: '挂牌' }];

  const wrapper = mount(Phase2Page);

  expect(wrapper.text()).toContain('强制');
  expect(wrapper.text()).toContain('午后点名');
  expect(wrapper.text()).toContain('柳素衣');
  expect(wrapper.text()).toContain('有人念起你的羞名');
  expect(wrapper.text()).toContain('身躯改塑');
  expect(wrapper.text()).toContain('牝阴决');
});
```

Add an interaction test:

```ts
it('pushes P2 shame rumor into pending action queue', async () => {
  store.data.系统.风声列表 = [{ id: 'p2-shame-1', 来源: '公开示众', 地点: '莲灯前苑', 风声文本: '有人念起你的羞名。', 状态: '未读', 羞名等级: '挂牌', 故事钩子: '廊下名牌微晃' }];
  const wrapper = mount(Phase2Page);

  await wrapper.get('[data-testid="p2-whisper-action"]').trigger('click');

  expect(store.data.系统.待处理交互.at(-1)).toMatchObject({
    类型: '追查风声',
    风声ID: 'p2-shame-1',
    入口类型: '特殊事件',
    AI短提示: expect.stringContaining('羞名'),
  });
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npx vitest run src/雌堕合欢宗/界面/pages/Phase2Page.test.ts`

Expected: FAIL because new components are not wired into the page.

- [ ] **Step 3: Compose components in `Phase2Page.vue`**

At the top of the template, render:

```vue
<StigmaCore :corruption="data.牝奴.堕落度" :yinjue-layer="data.牝奴.牝阴决层数" :command="data.牝奴.当前命令" :intensity="data.牝奴.命令强度" />
<DailyRoutinePanel :routine="data.牝奴.当前日课" :count="data.牝奴.今日调教次数" :settlement="data.牝奴.最近调教结算" />
<DominatorPanel :current="data.牝奴.当前支配者" :last="data.牝奴.上次支配者" :counts="data.牝奴.支配次数" />
<WhisperPanel :rumors="p2Rumors" @chase-rumor="queueShameRumor" />
<BrandTagsPanel :tags="data.牝奴.羞名标签" />
```

Keep existing transformation, yinjue, and equipment sections below these components.

Add computed and action:

```ts
const p2Rumors = computed(() => data.系统.风声列表.filter(rumor => ['牝奴日课', '牝印命令', '调教余波', '宗门闲谈', '公开示众', '支配者传唤'].includes(rumor.来源)));

function queueShameRumor(rumor: { id?: string; 地点?: string; 子区域?: string; 风声文本?: string; 故事钩子?: string; 羞名等级?: string }) {
  data.系统.待处理交互.push({
    类型: '追查风声',
    目标: '玩家',
    道具: '',
    数量: 1,
    时辰: data.系统.时辰,
    场景: data.系统.当前场景,
    地点: rumor.地点 || data.系统.场景上下文.地点,
    子区域: rumor.子区域 || data.系统.场景上下文.子区域,
    风声ID: rumor.id || '',
    故事钩子: rumor.故事钩子 || rumor.风声文本 || '',
    在场NPC: data.系统.场景上下文.在场NPC,
    道具显示名: '',
    器阶: '',
    作用部位: '',
    丹药分类: '',
    作用线: '',
    剧情线: '牝奴羞名',
    关联NPC: data.牝奴.当前支配者 || data.牝奴.上次支配者,
    秘密主题: rumor.羞名等级 || '微闻',
    入口类型: '特殊事件',
    线索ID: rumor.id || '',
    AI短提示: `P2羞名风声：请把${rumor.羞名等级 || '微闻'}承接为传唤、日课、公开凝视或支配事件。`,
  });
}
```

- [ ] **Step 4: Apply P2 visual style in scoped SCSS**

Use a page wrapper with stable narrow layout:

```scss
.phase2-page {
  --p2-void: #0f0a14;
  --p2-blood: #9c2c31;
  --p2-red: #d44d54;
  --p2-gold: #a38353;
  --p2-jade: #e6e1da;
  padding: 10px 0 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
```

- [ ] **Step 5: Run page tests**

Run: `npx vitest run src/雌堕合欢宗/界面/pages/Phase2Page.test.ts src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/雌堕合欢宗/界面/pages/Phase2Page.vue src/雌堕合欢宗/界面/pages/Phase2Page.test.ts
git commit -m "feat: refactor p2 page into master console"
```

### Task 5: Upgrade SystemBar P2 Mode

**Files:**
- Modify: `src/雌堕合欢宗/界面/components/SystemBar.vue`
- Modify: `src/雌堕合欢宗/界面/components/SystemBar.test.ts`

- [ ] **Step 1: Add P2 status bar tests**

Add tests:

```ts
it('shows active P2 shame rumors in p2 mode', () => {
  const wrapper = mount(SystemBar, {
    props: {
      mode: '牝奴期',
      堕落度: 82,
      牝阴决层数: 6,
      时辰: '午时',
      当前日课: '午后点名',
      当前命令: '当众应名',
      rumorList: [{ id: 'p2-shame-1', 来源: '公开示众', 地点: '莲灯前苑', 风声文本: '有人念起你的羞名。', 状态: '未读', 羞名等级: '挂牌' }],
    },
  });

  expect(wrapper.attributes('data-rumor-active')).toBe('true');
  expect(wrapper.text()).toContain('午后点名');
  expect(wrapper.text()).toContain('当众应名');
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npx vitest run src/雌堕合欢宗/界面/components/SystemBar.test.ts`

Expected: FAIL because P2 active rumors currently filter to empty and props do not include `当前日课` / `当前命令`.

- [ ] **Step 3: Extend props and activeRumors**

Extend the P2 branch of `SystemBarProps`:

```ts
当前日课?: string;
当前命令?: string;
命令强度?: number;
```

Change `activeRumors` to:

```ts
const activeRumors = computed(() => (props.rumorList ?? []).filter(rumor => rumor.状态 !== '已失效').slice(0, 3));
```

- [ ] **Step 4: Replace P2 blossom-only display with micro stigma display**

In the P2 template branch, keep the circular progress for continuity but change text and glyphs to `牝印`, `时辰`, `日课`, `命令`. Required visible fields: `堕落度%`, `牝阴决层数/9`, `时辰`, `当前日课`, `当前命令` when present.

- [ ] **Step 5: Run SystemBar tests**

Run: `npx vitest run src/雌堕合欢宗/界面/components/SystemBar.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/雌堕合欢宗/界面/components/SystemBar.vue src/雌堕合欢宗/界面/components/SystemBar.test.ts
git commit -m "feat: upgrade p2 system bar"
```

### Task 6: P2 Pending Action Prompt Closure

**Files:**
- Modify: `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts`
- Create or Modify: `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts`

- [ ] **Step 1: Add P2 prompt test**

Add:

```ts
it('builds a P2 shame-rumor continuation prompt', () => {
  const result = buildPendingActionPrompt({
    系统: {
      当前场景: '莲灯前苑',
      灵石: 0,
      场景上下文: { 地点: '莲灯前苑', 公开度: '公开', 在场NPC: ['柳素衣'] },
      待处理交互: [
        {
          类型: '追查风声',
          目标: '玩家',
          场景: '莲灯前苑',
          地点: '莲灯前苑',
          风声ID: 'p2-shame-1',
          剧情线: '牝奴羞名',
          秘密主题: '挂牌',
          入口类型: '特殊事件',
          AI短提示: 'P2羞名风声：请把挂牌承接为传唤、日课、公开凝视或支配事件。',
        },
      ],
    },
  });

  expect(result?.visible.content).toContain('P2羞名风声');
  expect(result?.visible.content).toContain('传唤');
  expect(result?.visible.content).toContain('公开凝视');
  expect(result?.scan.content).toContain('牝奴羞名');
});
```

- [ ] **Step 2: Run and verify failure or missing coverage**

Run: `npx vitest run src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts`

Expected before implementation: FAIL if `PendingAction` lacks fields or prompt does not include scan tokens; PASS is acceptable only if current generic path already preserves `AI短提示` and scan terms are updated elsewhere.

- [ ] **Step 3: Extend `PendingAction` type**

Add fields used by P2 queue:

```ts
风声ID?: string;
剧情线?: string;
关联NPC?: string;
秘密主题?: string;
入口类型?: string;
线索ID?: string;
```

- [ ] **Step 4: Specialize `追查风声` action line**

Inside `case '追查风声'`, before the generic return, add:

```ts
if (action.剧情线 === '牝奴羞名' || action.AI短提示?.includes('P2羞名')) {
  return `${action.AI短提示 || 'P2羞名风声必须被承接'} 地点：${location || '当前场景'}${hook ? `，线索：${hook}` : ''}。正文必须承接为传唤、日课异动、公开凝视或支配事件，并在同次JSONPatch中更新牝奴.当前日课、牝奴.当前命令、牝奴.当前支配者、牝奴.今日调教次数或牝奴.调教记录中的至少一项。`;
}
```

- [ ] **Step 5: Add P2 scan tokens**

Inside `buildScanTokens`, when action is P2 shame:

```ts
if (action.剧情线 === '牝奴羞名' || action.AI短提示?.includes('P2羞名')) {
  tokens.push('牝奴羞名', '传唤', '日课', '公开凝视', '支配事件', '牝奴期后果账本');
}
```

- [ ] **Step 6: Run prompt tests**

Run: `npx vitest run src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts
git commit -m "feat: enforce p2 shame rumor prompt closure"
```

### Task 7: DebugPanel P2 Observability

**Files:**
- Modify: `src/雌堕合欢宗/界面/components/DebugPanel.vue`
- Create or Modify: `src/雌堕合欢宗/界面/components/DebugPanel.test.ts`

- [ ] **Step 1: Add DebugPanel test**

Add a test that toggles visible debug state according to the existing `useDebug` test pattern and asserts these labels are present:

```ts
expect(wrapper.text()).toContain('P2日课');
expect(wrapper.text()).toContain('当前支配者');
expect(wrapper.text()).toContain('当前命令');
expect(wrapper.text()).toContain('羞名标签');
expect(wrapper.text()).toContain('P2风声');
```

- [ ] **Step 2: Run and verify failure**

Run: `npx vitest run src/雌堕合欢宗/界面/components/DebugPanel.test.ts`

Expected: FAIL if the file or assertions do not exist.

- [ ] **Step 3: Add P2 controls**

Under the existing 牝奴期数值 section in `DebugPanel.vue`, add inputs/selects for:

```vue
<input v-model="store.data.牝奴.当前日课" class="debug-input" />
<select v-model="store.data.牝奴.当前支配者" class="debug-select">
  <option value="">无人</option>
  <option v-for="npc in NPC列表" :key="npc" :value="npc">{{ npc }}</option>
</select>
<input v-model="store.data.牝奴.当前命令" class="debug-input" />
<input v-model.number="store.data.牝奴.命令强度" type="range" min="0" max="100" class="debug-range" />
<input v-model.number="store.data.牝奴.今日调教次数" type="number" min="0" max="99" class="debug-input" />
<input v-model="store.data.牝奴.最近调教结算" class="debug-input" />
```

Use a computed string for `羞名标签` editing:

```ts
const shameTagsText = computed({
  get: () => store.data.牝奴.羞名标签.join(','),
  set: value => {
    store.data.牝奴.羞名标签 = value.split(',').map(item => item.trim()).filter(Boolean).slice(0, 8);
  },
});
```

- [ ] **Step 4: Add P2 wind metadata summary**

Add a compact read-only block listing `系统.风声列表` entries whose `来源` is one of `牝奴日课/牝印命令/调教余波/宗门闲谈/公开示众/支配者传唤`, showing `来源`, `羞名等级`, `地点`, and `风声ID`.

- [ ] **Step 5: Run DebugPanel tests**

Run: `npx vitest run src/雌堕合欢宗/界面/components/DebugPanel.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/雌堕合欢宗/界面/components/DebugPanel.vue src/雌堕合欢宗/界面/components/DebugPanel.test.ts
git commit -m "feat: expose p2 runtime state in debug panel"
```

### Task 8: Documentation Sync

**Files:**
- Modify: `docs/PRD/世界运行核心-时间日程事件后果账本PRD-2026-05-25.md`
- Modify if present: `docs/前端架构指南.md`

- [ ] **Step 1: Add PRD appendix**

Append a section named `## 附录：P2牝奴期主控台落地口径` with these points:

```md
### 数据闭环

- P2 UI 只读 `store.data`，不生成剧情正文。
- 玩家点击羞名风声、日课异动、支配者传唤时，只写入 `系统.待处理交互`。
- AI 必须在下一楼层正文承接，并在同次 JSONPatch 中清队列，同时更新 P2 时间、日课、命令、支配者、调教记录或后果账本字段。

### UI 验收

- P2 第一屏必须出现牝印核心、日课、支配者、羞名风声、烙名标签。
- 旧的堕落度、牝阴决、改造进度、拘束法器不可丢失，但降为次级信息。
- 玩家可见文案避免现代 UI 词：任务、成就、通知、领取奖励。
```

- [ ] **Step 2: Add architecture note if `docs/前端架构指南.md` exists**

Add:

```md
### P2 UI 数据边界

P2 牝奴期主控台组件不得直接调用 AI、不得本地编排剧情、不得写入非 MVU 状态。组件只能读取 Pinia/MVU store；玩家点击产生的意图统一进入 `系统.待处理交互`，由动态注入层和世界书规则约束 AI 承接。
```

- [ ] **Step 3: Commit**

```bash
git add docs/PRD/世界运行核心-时间日程事件后果账本PRD-2026-05-25.md docs/前端架构指南.md
git commit -m "docs: record p2 master console acceptance"
```

### Task 9: Full Verification

**Files:**
- No source files changed in this task.

- [ ] **Step 1: Run targeted tests**

```bash
npx vitest run src/雌堕合欢宗/界面/data/phase2Display.test.ts
npx vitest run src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts
npx vitest run src/雌堕合欢宗/界面/pages/Phase2Page.test.ts
npx vitest run src/雌堕合欢宗/界面/components/SystemBar.test.ts
npx vitest run src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts
```

Expected: all PASS.

- [ ] **Step 2: Run full test suite**

Run: `npx vitest run`

Expected: all PASS. If unrelated existing failures appear, record exact failing file and assertion in the final handoff.

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: build completes without TypeScript or Vue template errors.

- [ ] **Step 4: Manual UI sanity pass**

Use the existing frontend dev workflow. In P2 mode, verify:

- Status bar shows P2 as 牝印/日课/命令, not only blossom progress.
- First P2 viewport shows the core console sections.
- Clicking a P2 shame rumor adds one `追查风声` item to `系统.待处理交互`.
- DebugPanel shows the pending queue and the new P2 runtime fields.
- No visible player-facing text uses `任务`、`成就`、`通知`、`领取奖励`.

- [ ] **Step 5: Final diff review**

Run: `git diff --stat` and `git diff -- src/雌堕合欢宗 docs/PRD docs/前端架构指南.md`

Expected: changes are limited to the files in this plan, plus generated schema artifacts if the project build process creates them.

## Self-Review

### Spec Coverage

- P2 视觉风格已覆盖：Task 3、Task 4、Task 5 使用深空底墨、朱批血墨、受控朱红、秩序暗金、灵识玉白。
- P2 主控台结构已覆盖：Task 3 创建牝印核心、日课、支配者、羞名、烙名组件；Task 4 组合进 `Phase2Page.vue`。
- P2 风声联动已覆盖：Task 4 点击进入 `系统.待处理交互`；Task 6 强化 AI 承接提示。
- SystemBar P2 升级已覆盖：Task 5 让 P2 风声生效并显示日课/命令。
- DebugPanel 可观测性已覆盖：Task 7 增加 P2 字段和 P2 风声元数据。
- 世界书与 PRD 同步已覆盖：Task 1 更新变量，Task 8 更新文档。

### Placeholder Scan

- 未使用 `TBD`、`TODO`、`implement later`。
- 每个代码相关任务都给出测试、实现要点、命令和预期结果。
- 需要按现有测试文件位置微调的地方已明确先用 `rg` 查找，再使用找到的文件。

### Type Consistency

- `牝奴.当前日课`、`牝奴.当前支配者`、`牝奴.当前命令`、`牝奴.命令强度`、`牝奴.今日调教次数`、`牝奴.最近调教结算`、`牝奴.羞名标签`、`牝奴.调教记录` 在 schema、页面、DebugPanel 中名称一致。
- P2 风声来源枚举在 schema、页面过滤、DebugPanel 过滤中一致。
- P2 待处理交互复用 `追查风声`，通过 `剧情线: '牝奴羞名'`、`入口类型: '特殊事件'`、`AI短提示` 区分，不新增不必要的交互类型。
