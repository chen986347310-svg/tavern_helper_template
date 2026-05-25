# 待处理交互动态注入（强提示机制）

> 2026-05-24 | 解决 AI 忽略待处理交互 / 擅自重置灵石的问题

## 问题

实机测试发现两个 AI 故障模式：

1. **忽略待处理交互**：玩家通过前端商城购买了欲海回声，但 AI 正文一字未提，直接演 NPC 拜访。
2. **擅自重置灵石**：AI 将玩家通过调试面板调高的灵石 replace 回初始值 2000。

根因：世界书绿灯资料库只能被动触发，没有强制注入到 AI 当前上下文中。当 AI 正在演开场叙事或 NPC 互动时，绿灯关键词可能不被匹配，导致待处理交互被完全跳过。

## 方案

复用 `outfitPrompt.ts` / `contrabandPrompt.ts` 的动态注入架构，新增 `pendingActionPrompt.ts` 模块，在 `GENERATE_BEFORE_COMBINE_PROMPTS` 钩子中将待处理交互队列以 `position: 'in_chat'` 强制注入到 AI 上下文。

## 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts` | 新建 | Phase 1+2 注入逻辑，172 行 |
| `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` | 新建 | 16 项测试 |
| `src/雌堕合欢宗/脚本/后端校验/index.ts` | 修改 | 集成 `buildPendingActionPrompt`，添加 clear/refresh/事件钩子 |
| `dist/backend_validate.js` | 重建 | esbuild 独立脚本，~366 KB |
| `docs/PRD/当前大改动整理报告-2026-05-24.md` | 修改 | 新增 §3.11 |

## 实现细节

### 注入架构

```
GENERATE_BEFORE_COMBINE_PROMPTS
  ├── refreshOutfitPrompt()       → hehuan-current-outfit-summary
  ├── refreshContrabandPrompt()   → hehuan-current-contraband-summary
  └── refreshPendingActionPrompt() → hehuan-pending-action-summary
```

两层注入，与服装/禁器完全对称：

| 层级 | ID | position | 作用 |
|------|----|----------|------|
| 可见注入 | `hehuan-pending-action-summary` | `in_chat` | 逐条叙事指令，强制 AI 在本楼层正文承接 |
| 扫描注入 | `hehuan-pending-action-scan` | `none` + `should_scan: true` | 激活世界书绿灯（特殊道具事件规则、道具AI承接闭环等） |

清理时机：`GENERATION_ENDED` / `CHAT_CHANGED` — 与服装、禁器统一清理链路。

### Phase 1 — 全类型覆盖

| 交互类型 | 注入指令 |
|----------|---------|
| 购买物品（普通） | 正文至少一句承认道具入手，禁止"队列清空但正文一字未提" |
| 购买物品（购买即生效） | 高优先级承接：事件种子，不得被开场叙事或 NPC 互动压过 |
| 使用物品 | 写出使用效果：身体变化、气息波动、场景反应 |
| 装备道具 | 写出目标反应：顺从、抗拒、羞恼或沉默 |
| 卸下 | 写出残痕退去、压力消散或目标反应 |
| 追查风声 | 承接为场景遭遇，参考地点与故事钩子 |
| 灵识窃取 | 写出窥探结果：心音、心防反震或心音残片 |

购买即生效道具判断：复用 `getItemLifecycle(name) === '购买即生效'`，不硬编码名单。

### Phase 2 — AI 红线注入

当 `系统.灵石 > 500000` 时，在注入末尾追加：

> 灵石数值远超常规获取上限，此为玩家调试行为；AI禁止用replace将灵石修正回初始值或任何低值，必须保留当前数值继续叙事。

### Phase 3 — 场景上下文感知

框架已预留（`PendingActionPromptData` 含场景上下文字段），当前版本暂不触发具体场景切换指令。后续可根据剧情钥匙/特殊道具的推荐场景与当前场景不匹配时注入过渡提示。

### 扫描文本策略

扫描文本自动聚合以下关键词，用于激活世界书绿灯：

- 基础：`待处理交互`、`最低承认底线`
- 购买/使用：`道具AI承接闭环`、`特殊道具事件规则`（仅购买即生效）、`丹药叙事规则`（仅丹药）
- 装备/卸下：`禁器叙事规则`、器阶名、`服装叙事规则`
- 追查风声：`风声`
- 灵识窃取：`心音回响`、`灵识窃取`

## 验证

| 验证项 | 结果 |
|--------|------|
| TDD 红灯 | 删除实现文件，16 项测试全部报错（模块不存在） |
| TDD 绿灯 | 编写实现，16/16 测试通过 |
| TDD 重构 | 无额外改动（自查阶段已清理硬编码和死代码） |
| 全量测试 | 25 文件，411/411 通过 |
| webpack 生产构建 | 编译成功 |
| dist/backend_validate.js 重建 | 365.6 KB，含注入标识 |
| git diff --check | 无 whitespace error |

### TDD 过程记录

本次严格遵循红→绿→重构流程：

1. **红灯**：删除 `pendingActionPrompt.ts`，保留测试文件，运行确认 16 项测试全部失败（`Cannot find module './pendingActionPrompt'`）。
2. **绿灯**：编写 `pendingActionPrompt.ts` 最小实现，16 项测试一次性变绿。
3. **重构**：自查发现 3 个问题（硬编码 INSTANT_ITEMS、未使用 NPC 字段、空壳 buildSceneMismatchHint 函数），在绿灯基础上清理，测试不回退。

## 设计决策

| 决策 | 结论 | 原因 |
|------|------|------|
| 复用 getItemLifecycle | 不硬编码 INSTANT_ITEMS | 避免与 itemLifecycle.ts 重复，后续增减道具只需改一处 |
| in_chat 而非 none | 可见注入强制进入 AI 上下文 | 核心目标就是让 AI 不能忽略待处理交互 |
| 不新增前端改动 | 注入全在后端脚本层 | 前端 usePendingAction 已正确入队，问题在 AI 侧 |
| 不蓝灯常驻 | 扫描文本 + 绿灯世界书 | 跟服装/禁器/丹药一致的 token 控制策略 |
