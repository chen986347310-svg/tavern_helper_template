# 世界系统与待处理交互闭环修复 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复世界系统验收报告与待处理交互动态注入中发现的文档一致性、类型口径、动态注入边界、队列清空验收和死代码归类问题。

**Architecture:** 保持现有 AIRP 边界：前端只写 `系统.待处理交互`，AI 下一楼层承接并清空，后端脚本只做提示注入与校验，不在 `validate.ts` 强制吞掉队列。修复分为四层：变量文档补齐、注入模块稳健性、集成/验收测试、报告与代码清理归类。

**Tech Stack:** TypeScript, Vue 3, Pinia, Zod 4, Vitest, Webpack, SillyTavern MVU, PowerShell on Windows.

---

## File Map

- Modify: `src/雌堕合欢宗/世界书/变量/变量列表.yaml` — 补齐 `道具.已生效效果`，修正“字段缺失”事实基础。
- Modify: `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts` — 补 `当前场景` 类型，禁器扫描使用数据源兜底，导出刷新逻辑的可测纯函数。
- Modify: `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` — 覆盖类型字段、旧队列缺元数据禁器、无待处理交互不注入。
- Create: `src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.ts` — 抽出 refresh/clear 注入运行时，避免直接测试全局事件层。
- Create: `src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts` — 测试 pending 非空注入两个 prompt、pending 为空清理、生成结束清理。
- Modify: `src/雌堕合欢宗/脚本/后端校验/index.ts` — 使用 runtime 模块接线，保留事件注册职责。
- Create: `cdp-pending-action-clearance-check.mjs` — CDP 验收脚本，检查 AI 承接后队列是否清空；只验收，不强清。
- Modify: `src/雌堕合欢宗/界面/guards.ts` and `src/雌堕合欢宗/界面/guards.test.ts` — 合并 phase2 重复函数，修正情欲控制错字，保留兼容别名。
- Modify: `docs/PRD/世界系统内部验收报告-2026-05-24.md` — 修正错误结论，更新风险表。
- Modify: `docs/PRD/当前大改动整理报告-2026-05-24.md` — 追加修复闭环记录。
- Modify: `dist/backend_validate.js` — 最后用 esbuild 重建并验证包含新注入逻辑。

---

### Task 1: 补齐变量列表中的 `道具.已生效效果`

**Files:**
- Modify: `src/雌堕合欢宗/世界书/变量/变量列表.yaml`
- Test: `src/雌堕合欢宗/界面/composables/usePendingAction.test.ts`

- [ ] **Step 1: 写失败测试，锁定变量列表必须声明已生效效果**

在 `src/雌堕合欢宗/界面/composables/usePendingAction.test.ts` 现有“跨文件一致性”测试附近追加：

```ts
it('变量列表声明道具已生效效果结构', () => {
  const variableList = readFileSync(join(process.cwd(), 'src/雌堕合欢宗/世界书/变量/变量列表.yaml'), 'utf8');

  expect(variableList).toContain('已生效效果');
  expect(variableList).toContain('目标: string');
  expect(variableList).toContain('道具: string');
  expect(variableList).toContain('来源交互ID: string');
  expect(variableList).toContain('生效楼层: number');
  expect(variableList).toContain('效果标签: string[]');
  expect(variableList).toContain('可被AI覆盖: boolean');
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/雌堕合欢宗/界面/composables/usePendingAction.test.ts`

Expected: FAIL，提示 `已生效效果` 或子字段不存在。

- [ ] **Step 3: 补变量列表**

在 `变量列表.yaml` 的 `道具:` 下追加：

```yaml
    已生效效果:
      - 目标: string
        道具: string
        来源交互ID: string
        生效楼层: number
        效果标签: string[]
        可被AI覆盖: boolean
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/雌堕合欢宗/界面/composables/usePendingAction.test.ts`

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/雌堕合欢宗/世界书/变量/变量列表.yaml src/雌堕合欢宗/界面/composables/usePendingAction.test.ts
git commit -m "fix: declare active item effects in variable list"
```

---

### Task 2: 修复 pendingActionPrompt 类型口径与禁器扫描兜底

**Files:**
- Modify: `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts`
- Modify: `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts`

- [ ] **Step 1: 写失败测试，旧队列缺 `器阶` 时仍触发禁器规则**

在 `pendingActionPrompt.test.ts` 的扫描文本分组追加：

```ts
it('旧队列缺器阶时仍用道具数据源触发禁器扫描词', () => {
  const result = buildPendingActionPrompt({
    系统: {
      待处理交互: [{ 类型: '装备道具', 目标: '白芷', 道具: '阴蒂环', 道具显示名: '命门欲环' }],
      场景上下文: { 在场NPC: ['白芷'] },
      灵石: 2000,
      当前场景: '醉玉小筑',
    },
  });

  expect(result).not.toBeNull();
  expect(result!.scan.content).toContain('禁器叙事规则');
  expect(result!.scan.content).toContain('化器器阶');
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts`

Expected: FAIL，`禁器叙事规则` 或 `化器器阶` 缺失。

- [ ] **Step 3: 修改实现**

在 `pendingActionPrompt.ts` 中增加导入并扩展类型：

```ts
import { getContrabandTier, getItemDisplayName, getItemShortHint } from '../../界面/data/itemDisplay';
```

将 `PendingActionPromptData` 的 `系统` 扩展为：

```ts
  系统?: {
    当前场景?: string;
    待处理交互?: PendingAction[];
    场景上下文?: { 在场NPC?: string[]; 地点?: string; 公开度?: string };
    灵石?: number;
  };
```

将扫描逻辑中的装备/卸下分支替换为：

```ts
    if (type === '装备道具' || type === '卸下') {
      const tier = action.器阶 || getContrabandTier(logicName);
      if (tier) tokens.push('禁器叙事规则', tier);
      tokens.push('服装叙事规则');
    }
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts`

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts
git commit -m "fix: harden pending action prompt scan tokens"
```

---

### Task 3: 抽出动态注入运行时并补集成测试

**Files:**
- Create: `src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.ts`
- Create: `src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts`
- Modify: `src/雌堕合欢宗/脚本/后端校验/index.ts`

- [ ] **Step 1: 写 runtime 测试**

创建 `narrativePromptRuntime.test.ts`：

```ts
import { describe, expect, it, vi } from 'vitest';

import { createNarrativePromptRuntime } from './narrativePromptRuntime';

describe('createNarrativePromptRuntime', () => {
  it('pending action 非空且无装备时只注入 pending visible 与 scan prompt', () => {
    const uninject = vi.fn();
    const injectPrompts = vi.fn(() => ({ uninject }));
    const uninjectPrompts = vi.fn();
    const getStatData = vi.fn(() => ({ 系统: { 待处理交互: [{ 类型: '购买物品', 目标: '玩家', 道具: '欲海回声' }], 灵石: 2000 } }));

    const runtime = createNarrativePromptRuntime({ getStatData, injectPrompts, uninjectPrompts });
    runtime.refresh();

    expect(injectPrompts).toHaveBeenCalledTimes(1);
    expect(injectPrompts.mock.calls[0][0].map((prompt: { id: string }) => prompt.id)).toEqual([
      'hehuan-pending-action-summary',
      'hehuan-pending-action-scan',
    ]);
  });

  it('存在当前装备时同时注入服装与禁器 prompt', () => {
    const injectPrompts = vi.fn(() => ({ uninject: vi.fn() }));
    const uninjectPrompts = vi.fn();
    const getStatData = vi.fn(() => ({
      系统: { 待处理交互: [], 场景上下文: { 在场NPC: ['白芷'] } },
      道具: { 装备: { 玩家: ['杂役服'], 白芷: ['阴蒂环'] } },
    }));

    const runtime = createNarrativePromptRuntime({ getStatData, injectPrompts, uninjectPrompts });
    runtime.refresh();

    expect(injectPrompts).toHaveBeenCalledTimes(1);
    expect(injectPrompts.mock.calls[0][0].map((prompt: { id: string }) => prompt.id)).toEqual([
      'hehuan-current-outfit-summary',
      'hehuan-current-outfit-scan',
      'hehuan-current-contraband-summary',
      'hehuan-current-contraband-scan',
    ]);
  });

  it('pending action 为空时清理旧 pending prompt 且不注入 pending prompt', () => {
    const injectPrompts = vi.fn(() => ({ uninject: vi.fn() }));
    const uninjectPrompts = vi.fn();
    const runtime = createNarrativePromptRuntime({ getStatData: () => ({ 系统: { 待处理交互: [] } }), injectPrompts, uninjectPrompts });

    runtime.refresh();

    expect(uninjectPrompts).toHaveBeenCalledWith(['hehuan-pending-action-summary', 'hehuan-pending-action-scan']);
    expect(injectPrompts).not.toHaveBeenCalled();
  });

  it('clear 会卸载全部叙事注入 id', () => {
    const injectPrompts = vi.fn(() => ({ uninject: vi.fn() }));
    const uninjectPrompts = vi.fn();
    const runtime = createNarrativePromptRuntime({ getStatData: () => ({}), injectPrompts, uninjectPrompts });

    runtime.clear();

    expect(uninjectPrompts).toHaveBeenCalledWith(['hehuan-current-outfit-summary', 'hehuan-current-outfit-scan']);
    expect(uninjectPrompts).toHaveBeenCalledWith(['hehuan-current-contraband-summary', 'hehuan-current-contraband-scan']);
    expect(uninjectPrompts).toHaveBeenCalledWith(['hehuan-pending-action-summary', 'hehuan-pending-action-scan']);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts`

Expected: FAIL，模块不存在。

- [ ] **Step 3: 创建 runtime 模块**

创建 `narrativePromptRuntime.ts`：

```ts
import { buildContrabandPrompt } from '../服装叙事注入/contrabandPrompt';
import { buildOutfitPrompt } from '../服装叙事注入/outfitPrompt';
import { buildPendingActionPrompt } from '../服装叙事注入/pendingActionPrompt';

type InjectionPrompt = { id: string; position: 'in_chat' | 'none'; depth: number; role: 'system' | 'assistant' | 'user'; content: string; should_scan?: boolean };
type InjectPrompts = (prompts: InjectionPrompt[]) => { uninject: () => void };

export function createNarrativePromptRuntime(deps: {
  getStatData: () => Record<string, unknown>;
  injectPrompts: InjectPrompts;
  uninjectPrompts: (ids: string[]) => void;
}) {
  let uninjectCurrent: (() => void) | null = null;

  const ids = {
    outfit: ['hehuan-current-outfit-summary', 'hehuan-current-outfit-scan'],
    contraband: ['hehuan-current-contraband-summary', 'hehuan-current-contraband-scan'],
    pending: ['hehuan-pending-action-summary', 'hehuan-pending-action-scan'],
  };

  function clear() {
    uninjectCurrent?.();
    uninjectCurrent = null;
    deps.uninjectPrompts(ids.outfit);
    deps.uninjectPrompts(ids.contraband);
    deps.uninjectPrompts(ids.pending);
  }

  function refresh() {
    const data = deps.getStatData();
    const prompts = [buildOutfitPrompt(data), buildContrabandPrompt(data), buildPendingActionPrompt(data)]
      .filter(Boolean)
      .flatMap(prompt => [prompt!.visible, prompt!.scan]);

    clear();
    if (prompts.length === 0) return;
    uninjectCurrent = deps.injectPrompts(prompts).uninject;
  }

  return { refresh, clear };
}
```

- [ ] **Step 4: 简化 `index.ts` 接线**

在 `index.ts` 中替换三套 clear/refresh 函数为：

```ts
import { createNarrativePromptRuntime } from './narrativePromptRuntime';

const narrativePromptRuntime = createNarrativePromptRuntime({
  getStatData: () => Mvu.getMvuData({ type: 'message', message_id: 'latest' })?.stat_data ?? {},
  injectPrompts,
  uninjectPrompts,
});

eventOn(tavern_events.GENERATE_BEFORE_COMBINE_PROMPTS, narrativePromptRuntime.refresh);
eventOn(tavern_events.GENERATION_ENDED, narrativePromptRuntime.clear);
eventOn(tavern_events.CHAT_CHANGED, narrativePromptRuntime.clear);
```

保留 `waitGlobalInitialized('Mvu')`、`BEFORE_MESSAGE_UPDATE`、`VARIABLE_UPDATE_ENDED` 和 `__TEST_applyValidatedUpdate` 原逻辑。

- [ ] **Step 5: 运行测试确认通过**

Run: `npx vitest run src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts`

Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add src/雌堕合欢宗/脚本/后端校验/index.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts
git commit -m "test: cover narrative prompt injection runtime"
```

---

### Task 4: 增加待处理交互清空验收脚本，不做强制清空

**Files:**
- Create: `cdp-pending-action-clearance-check.mjs`
- Modify: `docs/前端架构指南.md`

- [ ] **Step 1: 创建 CDP 脚本**

创建 `cdp-pending-action-clearance-check.mjs`：

```js
const CDP_PORT = process.env.CDP_PORT ?? '9223';

async function json(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return res.json();
}

async function main() {
  const targets = await json(`http://localhost:${CDP_PORT}/json`);
  const target = targets.find(t => /SillyTavern/i.test(t.title ?? '') || /SillyTavern/i.test(t.url ?? ''));
  if (!target?.webSocketDebuggerUrl) throw new Error('未找到 SillyTavern CDP target，请确认 Chrome 以 --remote-debugging-port 启动');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();

  ws.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  });

  await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
  function send(method, params = {}) {
    const callId = ++id;
    ws.send(JSON.stringify({ id: callId, method, params }));
    return new Promise(resolve => pending.set(callId, resolve));
  }

  const expression = `(() => {
    const data = Mvu.getMvuData({ type: 'message', message_id: 'latest' })?.stat_data;
    return data?.系统?.待处理交互 ?? null;
  })()`;
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  const queue = result.result?.result?.value;

  if (!Array.isArray(queue)) throw new Error('无法读取 系统.待处理交互');
  if (queue.length > 0) {
    console.error(JSON.stringify(queue, null, 2));
    throw new Error('待处理交互仍非空：AI 承接后必须清空队列。本脚本只验收，不自动清空。');
  }

  console.log('PASS: 系统.待处理交互 已清空');
  ws.close();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
```

- [ ] **Step 2: 文档追加验收命令**

在 `docs/前端架构指南.md` 的“待处理交互一致性护栏验收”附近追加：

```md
### 待处理交互清空验收脚本

AI 已承接购买、使用、装备、卸下、追查风声或旧版灵识窃取后，运行：

```bash
node cdp-pending-action-clearance-check.mjs
```

脚本只读取最新楼层 `系统.待处理交互` 并判定是否为空；不得在验收脚本或 `validate.ts` 中自动清空队列，避免吞掉未被 AI 承接的动作。
```

- [ ] **Step 3: 本地语法检查**

Run: `node --check cdp-pending-action-clearance-check.mjs`

Expected: no output and exit 0。

- [ ] **Step 4: Commit**

```bash
git add cdp-pending-action-clearance-check.mjs docs/前端架构指南.md
git commit -m "test: add pending action clearance check"
```

---

### Task 5: 整理 guards 重复函数与错字，不删除兼容旧链路

**Files:**
- Modify: `src/雌堕合欢宗/界面/guards.ts`
- Modify: `src/雌堕合欢宗/界面/guards.test.ts`

- [ ] **Step 1: 写测试锁定兼容别名与情欲控制**

在 `guards.test.ts` 的 phase2 与情欲控制测试附近补充：

```ts
it('canEnterPhase2 保持 shouldEnterPhase2 的兼容别名行为', () => {
  expect(canEnterPhase2(0)).toBe(shouldEnterPhase2(0));
  expect(canEnterPhase2(1)).toBe(shouldEnterPhase2(1));
});

it('牝奴期且堕落度达标时可升级情欲控制', () => {
  expect(canUpgrade情欲控制('牝奴期', 1, 30)).toBe(true);
  expect(canUpgrade情欲控制('牝奴期', 2, 60)).toBe(true);
  expect(canUpgrade情欲控制('攻略期', 1, 99)).toBe(false);
});
```

- [ ] **Step 2: 运行测试确认当前错字导致失败**

Run: `npx vitest run src/雌堕合欢宗/界面/guards.test.ts`

Expected: `canUpgrade情欲控制('牝奴期', ...)` FAIL。

- [ ] **Step 3: 修改 guards**

将重复函数改为兼容别名：

```ts
export function shouldEnterPhase2(剩余天数: number): boolean {
  return 剩余天数 <= 0;
}

export function canEnterPhase2(剩余天数: number): boolean {
  return shouldEnterPhase2(剩余天数);
}
```

修正情欲控制签名和变量名：

```ts
export function canUpgrade情欲控制(当前阶段: '攻略期' | '牝奴期', 当前情欲控制阶段: number, 堕落度: number): boolean {
  if (当前阶段 !== '牝奴期') return false;
  if (当前情欲控制阶段 >= 3) return false;
  if (当前情欲控制阶段 === 1 && 堕落度 >= 30) return true;
  if (当前情欲控制阶段 === 2 && 堕落度 >= 60) return true;
  return false;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/雌堕合欢宗/界面/guards.test.ts src/雌堕合欢宗/界面/guards.scene.test.ts`

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/雌堕合欢宗/界面/guards.ts src/雌堕合欢宗/界面/guards.test.ts
git commit -m "fix: clean guard compatibility helpers"
```

---

### Task 6: 修正验收报告和大改动报告口径

**Files:**
- Modify: `docs/PRD/世界系统内部验收报告-2026-05-24.md`
- Modify: `docs/PRD/当前大改动整理报告-2026-05-24.md`

- [ ] **Step 1: 更新验收报告错误结论**

将 `schema.ts ↔ 变量列表.yaml` 结论改为：

```md
| schema.ts ↔ 变量列表.yaml | **1 字段缺声明，7 字段位于补充变量区** |
```

将“8 字段缺主表、1 字段全缺”段落改为：

```md
核查修正：`系统.风声列表`、`系统.当前追查风声ID`、`系统.心音回响`、`系统.当前聚焦心声NPC`、`NPC.当前场景`、`NPC.soul_whisper`、`NPC.心声探测态` 已在 `变量列表.yaml` 的“补充变量”区声明，不属于字段缺失。若后续希望减少 AI 阅读歧义，可考虑提升到主表，但这不是阻塞项。

当前唯一确认缺声明字段为 `道具.已生效效果`。
```

- [ ] **Step 2: 更新 H-1 整改建议**

将“validate.ts 强制清空”替换为：

```md
不建议在 `validate.ts` 中强制清空非空队列。程序无法可靠判断 AI 是否已叙事承接，强清可能吞掉未处理交互。整改方式改为：动态注入强提示 + CDP/L2 队列清空验收 + 残留告警；只有验收失败时人工或测试报告提示，不自动改写玩家状态。
```

- [ ] **Step 3: 更新死代码口径**

将 `whispers.ts` 与 `NpcDetail.vue` 从“完全死文件”改为“生产未接入模块”：

```md
`whispers.ts` 与 `NpcDetail.vue` 当前仅测试引用，未进入生产页面；删除前需确认心音文本是否完全改由世界书/MVU 生成、NPC详情是否已被 NpcCard/GalleryPage 替代。暂不直接删除，标记为生产未接入模块。
```

- [ ] **Step 4: 更新当前大改动报告**

追加一节：

```md
### 待处理交互注入核查修复计划

已确认 `pendingActionPrompt.ts`、`GENERATE_BEFORE_COMBINE_PROMPTS` 集成与 dist 重建完成；后续补强项为：类型口径补 `系统.当前场景`、禁器扫描使用数据源兜底、抽出 narrativePromptRuntime 并补集成测试、增加 CDP 队列清空验收脚本。
```

- [ ] **Step 5: Commit**

```bash
git add docs/PRD/世界系统内部验收报告-2026-05-24.md docs/PRD/当前大改动整理报告-2026-05-24.md
git commit -m "docs: correct world system acceptance findings"
```

---

### Task 7: 重建后端校验 dist 并做最终验证

**Files:**
- Modify: `dist/backend_validate.js`

- [ ] **Step 1: 运行全量测试**

Run: `npx vitest run`

Expected: 25+ files PASS，所有测试通过。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: webpack compiled successfully；允许既有 `index.html` 体积 warning。

- [ ] **Step 3: 重建 `dist/backend_validate.js`**

Run:

```bash
npx esbuild src/雌堕合欢宗/脚本/后端校验/index.ts --bundle --format=esm --platform=browser --external:lodash --outfile=dist/backend_validate.js --target=esnext
```

Expected: `dist/backend_validate.js` 生成成功。

- [ ] **Step 4: 按项目约定修补 dist lodash 和 export**

在 `dist/backend_validate.js` 中：

```js
// replace
import _2 from "lodash";
// with
const _2 = window._;
```

并移除 bundle 中残留的顶层 `export` 关键字。

- [ ] **Step 5: 验证 dist 包含新逻辑**

Run:

```bash
Select-String -Path dist\backend_validate.js -Pattern 'createNarrativePromptRuntime|hehuan-pending-action-summary|hehuan-pending-action-scan|禁器叙事规则|GENERATE_BEFORE_COMBINE_PROMPTS'
```

Expected: 每个关键字至少命中一次。

- [ ] **Step 6: whitespace 检查**

Run: `git diff --check`

Expected: no output and exit 0。

- [ ] **Step 7: Commit**

```bash
git add dist/backend_validate.js
git commit -m "build: refresh backend validation bundle"
```

---

## Self-Review

- Spec coverage: 覆盖 `道具.已生效效果` 缺声明、pendingActionPrompt 类型不一致、禁器扫描旧队列缺元数据、index.ts 无集成测试、队列清空无验收、guards 重复/错字、报告口径错误、dist 重建。
- Deliberate non-goals: 不在 `validate.ts` 强制清空 `系统.待处理交互`；不直接删除 `whispers.ts`、`NpcDetail.vue` 或旧灵识窃取兼容函数；不实现 Phase 3 场景切换智能提示。
- Verification commands: `npx vitest run`, `npm run build`, `node --check cdp-pending-action-clearance-check.mjs`, `git diff --check`, dist keyword scan.
