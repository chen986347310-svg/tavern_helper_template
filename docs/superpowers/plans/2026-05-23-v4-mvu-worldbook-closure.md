# v4 MVU 世界书同步收口 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将已通过实机验证的“双 UpdateVariable 块兼容、开放动态场景、角色栏在场 NPC、待处理交互闭环”固化到 PRD、变量规则、世界书同步与回归验收中，避免后续 AI/开发者误读旧三场景方案。

**Architecture:** 前端继续作为 MVU 显示端和交互暂存端；UI 只写 `系统.待处理交互`，不直接调用生成。AI/额外模型在下一楼层输出一个或多个 `<UpdateVariable><JSONPatch>`，系统按顺序应用，后块覆盖前块；`系统.当前场景` 为开放字符串，角色栏只从 `系统.场景上下文.在场NPC` 渲染。

**Tech Stack:** Vue 3 + Pinia + TypeScript + Zod 4 + SCSS + Webpack + Vitest + SillyTavern/MVU + PowerShell UTF-8 写入。

---

## File Structure

- Modify: `docs/PRD/PRD-主页状态栏深度重构v4.md`
  - 追加“v4.1 双块兼容与开放场景实机验收结论”。
  - 修正仍残留的“三场景只允许”口径，明确三场景只是快捷入口/旧数据回退。
- Modify: `docs/PRD/动态场景系统技术验证与实施计划.md`
  - 追加“开放动态场景 + 风声 + 道具生命周期 + AI 双块补丁”的技术验证结果。
- Modify: `docs/教程/开发规范与智能体协作指南.md`
  - 增加 MVU 楼层验收流程：用 `docs/变量MVU.md` 作为临时收件箱，验收后清空。
- Modify: `docs/教程/前端构建修复指南.md`
  - 补充 `pnpm check:mvu`、`npm run build`、CDP/热更新脚本验证边界。
- Modify: `src/雌堕合欢宗/世界书/变量更新规则.yaml`
  - 若存在，补充双块兼容协议、开放场景字段规则、待处理交互清空要求。
- Modify: `src/雌堕合欢宗/世界书/变量输出格式.yaml`
  - 若存在，补充 `<UpdateVariable><JSONPatch>` 包裹、正文模型/额外模型双输出兼容说明。
- Test/Verify: `docs/变量MVU.md`
  - 只作为人工粘贴验收收件箱，不作为长期记录。

---

### Task 1: PRD v4 实机验收收口

**Files:**
- Modify: `docs/PRD/PRD-主页状态栏深度重构v4.md`

- [ ] **Step 1: 定位追加位置**

Run:
```powershell
Select-String -LiteralPath 'docs\PRD\PRD-主页状态栏深度重构v4.md' -Pattern '当前权威结论|Phase E-Fix|开放场景|双 UpdateVariable' -Encoding UTF8
```
Expected: 找到“当前权威结论”和 Phase E-Fix 附近位置。

- [ ] **Step 2: 追加 v4.1 实机验收结论**

Append this section near the current authoritative conclusion or after Phase E-Fix:

```markdown
---

## v4.1 双 UpdateVariable 块兼容实机验收结论（2026-05-23）

### 验收背景

实机楼层中同时出现正文模型与额外变量模型各自输出的 `<UpdateVariable><JSONPatch>`。项目需要确认这不会破坏 MVU 回流，也不会导致前端角色栏、开放场景、待处理交互闭环失效。

### 最终协议

- 允许同一楼层出现多个 `<UpdateVariable>` 块。
- MVU 应按文本出现顺序应用每个 `JSONPatch` 数组。
- 同一路径多次更新时，以后出现的块为准。
- 正文模型块负责叙事承接与基础变量推进。
- 额外变量模型块负责字段补全、数值 delta、场景上下文精修。
- 已处理的 `系统.待处理交互` 必须在最后有效块中清空为 `[]`。

### 已验证样例

- `药庐 / 药庐前堂 / 半私密 / 苏芸在场`：双块合并后稳定显示苏芸，白芷不显示，符合“角色栏只显示在场 NPC”。
- `药庐 / 丹炉房 / 验阳气`：第二块覆盖第一块场景上下文，并追加 `NPC.苏芸.好感度 +2`，最终状态一致。

### 开放场景红线

- `系统.当前场景` 是开放字符串，允许 AI 写入 `药庐`、`外门广场`、`经阁` 等世界观内场景。
- `莲灯前苑 / 醉玉小筑 / 绮梦幽阁` 只保留为前端快捷入口、商城解锁入口或旧数据回退锚点。
- 角色栏不得遍历全部 NPC；只能读取 `系统.场景上下文.在场NPC`。
- AI 创建或切换场景时，必须同步更新 `系统.场景上下文`，至少包含 `地点 / 子区域 / 场景来源 / 公开度 / 在场NPC / NPC活动 / 氛围 / 故事钩子 / 特殊事件`。

### 当前结论

UI 点击影响下一楼层剧情与变量的链路已通过：前端写入 `系统.待处理交互`，用户下一次发送消息后，AI 读取并叙事承接，再通过一个或多个 `<UpdateVariable><JSONPatch>` 回写并清空队列。v4 动态场景、风声、角色栏与灵识交互具备继续扩展条件。
```

- [ ] **Step 3: 修正过时三场景口径**

Search and replace only misleading lines that say MVU scene is restricted to three options. Keep historical notes if clearly marked as旧方案.

Run:
```powershell
Select-String -LiteralPath 'docs\PRD\PRD-主页状态栏深度重构v4.md' -Pattern '三场景|三选一|只允许|莲灯前苑 / 醉玉小筑 / 绮梦幽阁' -Encoding UTF8
```
Expected: Any current-rule sentence should say “三地点是快捷入口/回退锚点，不限制 AI 开放场景”。

---

### Task 2: 世界书变量规则收口

**Files:**
- Modify: `src/雌堕合欢宗/世界书/变量更新规则.yaml`
- Modify: `src/雌堕合欢宗/世界书/变量输出格式.yaml`

- [ ] **Step 1: 确认文件存在**

Run:
```powershell
Get-ChildItem -LiteralPath 'src\雌堕合欢宗\世界书' -File | Select-Object Name
```
Expected: 能看到 `变量更新规则.yaml` 和 `变量输出格式.yaml`；若名称不同，用实际文件名更新本计划执行。

- [ ] **Step 2: 在变量输出格式中加入双块兼容规则**

Append or merge this rule:

```yaml
MVU双更新块兼容协议:
  优先级: 最高
  规则:
    - 同一楼层允许出现正文模型与额外变量模型各自输出的 UpdateVariable 块。
    - 每个 UpdateVariable 内必须包含且只包含一个 JSONPatch 数组。
    - 系统按文本出现顺序应用 JSONPatch；同一路径冲突时以后出现的块为准。
    - 正文模型可以负责剧情承接与基础变量推进；额外变量模型可以负责字段补全、delta 数值、场景上下文精修。
    - 禁止输出裸 JSONPatch；必须包裹在 <UpdateVariable><JSONPatch>...</JSONPatch></UpdateVariable> 中。
    - 若待处理交互已经在叙事中承接，最后有效块必须 replace /系统/待处理交互 为 []。
```

- [ ] **Step 3: 在变量更新规则中加入开放场景规则**

Append or merge this rule:

```yaml
开放动态场景规则:
  优先级: 最高
  规则:
    - 系统.当前场景 是开放字符串，不是枚举。
    - AI 可以创建符合合欢宗世界观的新场景，例如 药庐、外门广场、经阁、阴阳池、掌门殿偏殿。
    - 莲灯前苑、醉玉小筑、绮梦幽阁只是前端快捷入口、商城解锁入口或旧数据回退锚点，不能限制剧情场景生成。
    - 每次 replace /系统/当前场景 时，必须同步 replace 或 insert /系统/场景上下文。
    - 系统.场景上下文.在场NPC 是角色栏唯一可信数据源；不在该数组内的 NPC 不应显示在角色栏。
    - 若当前楼层没有 NPC 在场，在场NPC 必须写为 []，不得省略字段。
```

- [ ] **Step 4: 在变量更新规则中加入待处理交互规则**

Append or merge this rule:

```yaml
待处理交互闭环规则:
  优先级: 最高
  规则:
    - AI 回复开头必须检查 系统.待处理交互。
    - 已被剧情承接的交互必须在本楼层 JSONPatch 中清空。
    - 清空方式优先使用 { op: replace, path: /系统/待处理交互, value: [] }。
    - 前端交互只代表玩家意图，不代表结果；结果必须由 AI 叙事和 JSONPatch 决定。
    - 灵识窃取、追查风声、使用物品、装备道具都必须遵守当前楼层暂存、下一楼层结算。
```

---

### Task 3: 开发规范补充楼层验收流程

**Files:**
- Modify: `docs/教程/开发规范与智能体协作指南.md`

- [ ] **Step 1: 追加人工 MVU 收件箱流程**

Append:

```markdown
---

## MVU 楼层人工验收流程（v4.1）

当 CDP 或额外模型解析无法稳定读取最新楼层变量时，使用 `docs/变量MVU.md` 作为临时收件箱：

1. 用户把当前楼层完整 `<UpdateVariable>` 原文粘贴到 `docs/变量MVU.md`。
2. 开发者读取并检查：是否存在 `JSONPatch`、是否有多个块、是否清空 `系统.待处理交互`、是否同步 `系统.当前场景` 与 `系统.场景上下文`。
3. 若同一楼层有多个块，按出现顺序合并判断；同路径以后块为准。
4. 验收完成后立即清空 `docs/变量MVU.md`，保留文件标题和说明，等待下一楼层。
5. `docs/变量MVU.md` 不作为长期证据；长期结论必须回填 PRD 或验收记录。
```

- [ ] **Step 2: 补充 PowerShell UTF-8 写入红线**

Append:

```markdown
### 中文文档写入要求

在 PowerShell 中写入中文 Markdown/YAML，优先使用：

```powershell
[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
```

避免使用会破坏中文、反引号或 Markdown 表格的复杂 here-string 与跨 shell 转义。
```

---

### Task 4: 前端构建与 MVU 验证文档收口

**Files:**
- Modify: `docs/教程/前端构建修复指南.md`

- [ ] **Step 1: 追加验证命令表**

Append:

```markdown
---

## v4.1 验证命令补充

| 目标 | 命令 | 说明 |
| :--- | :--- | :--- |
| 单元回归 | `npx vitest run` | 验证 Vue/TS 层逻辑，不证明 SillyTavern 已加载新世界书 |
| 前端构建 | `npm run build` | 生成前端与同步包；通过不等于实机 MVU 回流通过 |
| MVU 实机只读检查 | `pnpm check:mvu` | 检查热更新入口、最新楼层 v4 字段、脚本 iframe 测试钩子 |
| 临时人工验收 | 读取 `docs/变量MVU.md` | 用于 CDP/额外模型解析不可见时的楼层补充验收 |

### 验收边界

- `npm run build` 只能证明构建链路可用。
- `pnpm check:mvu` 只能证明当前 SillyTavern 页面可读到预期字段或测试钩子。
- 真正的 AIRP 闭环必须看到：UI 写入 `系统.待处理交互` → 下一楼层 AI 叙事承接 → `<UpdateVariable><JSONPatch>` 清空队列并更新场景/NPC。
```

---

### Task 5: 回归验证

**Files:**
- Test: docs and source rules touched above

- [ ] **Step 1: Markdown/YAML 关键字检查**

Run:
```powershell
Select-String -LiteralPath 'docs\PRD\PRD-主页状态栏深度重构v4.md','docs\教程\开发规范与智能体协作指南.md','docs\教程\前端构建修复指南.md' -Pattern '双 UpdateVariable|开放动态场景|待处理交互|变量MVU' -Encoding UTF8
```
Expected: 命中新增收口内容。

- [ ] **Step 2: 源世界书规则检查**

Run:
```powershell
Select-String -LiteralPath 'src\雌堕合欢宗\世界书\变量更新规则.yaml','src\雌堕合欢宗\世界书\变量输出格式.yaml' -Pattern '双更新块|开放动态场景|待处理交互|UpdateVariable' -Encoding UTF8
```
Expected: 命中新增规则。

- [ ] **Step 3: 运行项目验证命令**

Run:
```powershell
npx vitest run
npm run build
pnpm check:mvu
```
Expected:
- Vitest 全量通过。
- Build 通过，允许既有体积警告。
- `pnpm check:mvu` 能读取 v4 字段；若 SillyTavern 未打开或 Chrome CDP 未连接，记录为环境未就绪而非代码失败。

---

## Self-Review

### Spec Coverage

- 双 UpdateVariable 块兼容：Task 1 + Task 2 + Task 5 覆盖。
- 开放动态场景：Task 1 + Task 2 覆盖。
- 角色栏只显示在场 NPC：Task 1 + Task 2 覆盖。
- 待处理交互下一楼层结算：Task 1 + Task 2 + Task 4 覆盖。
- 工作留痕：Task 1 + Task 3 + Task 4 覆盖。

### Placeholder Scan

No TBD/TODO placeholders. Each task has exact files, exact text, exact commands, and expected outcomes.

### Type Consistency

This plan is documentation/rules focused. It does not introduce new TS types. Field names consistently use `系统.当前场景`、`系统.场景上下文`、`系统.场景上下文.在场NPC`、`系统.待处理交互`.