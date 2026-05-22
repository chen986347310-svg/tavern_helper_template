# Handoff: v4 文档清理与闭环验收接力（2026-05-22）

## 接手目标

下一会话优先继续《雌堕合欢宗》v4 收尾工作：确认文档口径已经统一，随后恢复/替代世界书同步链路，完成 UI → AI → MVU 的实机闭环复验。

## 当前状态

- v4 前端主体已完成并经过多轮单元测试与构建验证。
- 最近一次实机复验显示：前端 UI 入队成功，但下一楼层 AI 仍输出“变量更新情况”与裸 JSON Patch，缺少标准 `<UpdateVariable><JSONPatch>` 包裹。
- `NPC.白芷.soul_whisper` 未回流到最新 MVU；前端不显示“心音残片”是正确表现，不是 UI 渲染 bug。
- 本地世界书规则已补强，但 SillyTavern 实际启用的角色卡/世界书可能仍是旧版本。
- `package.json` 中 `sync` 指向 `node tavern_sync.mjs`，但当前工作区缺失 `tavern_sync.mjs`，这是当前最高优先级同步断点。

## 本次已完成的文档留痕

已按“逐份更新，避免旧文档误导”的方式精修以下 6 份文档：

1. `docs/PRD/PRD-主页状态栏深度重构v4.md`
   - 前置“当前权威结论”。
   - 明确前端主体完成、实机闭环未最终通过、世界书/角色卡同步为阻塞项。
   - 新增最终闭环验收标准。

2. `docs/教程/开发规范与智能体协作指南.md`
   - 前置 v4 协作口径。
   - 明确前端可写 `系统.待处理交互`，但不得调用 `generate()` 或伪造剧情结果。
   - 将 `pnpm sync` 标为当前不可直接视为可用。
   - 补充 PowerShell UTF-8 安全写入模板。

3. `docs/教程/前端构建修复指南.md`
   - 明确 `pnpm build` 只证明前端状态栏产物成功。
   - 明确 `dist/雌堕合欢宗/index.html` 不是世界书产物。
   - 明确 `dist/var_structure.js` 与 `dist/backend_validate.js` 需要独立 esbuild 流程。
   - 补充 v4 构建验收口径。

4. `docs/PRD/vue-状态栏美学设计方案.md`
   - 前置 v4 阴阳双生、五气朝元阵、太极/命轮与心音显影口径。
   - 将早期“金册玉牒”“日/夜主题”标为历史实现记录。
   - 补充不得回退到旧场景名与错误术语的设计红线。

5. `docs/架构报告-界面架构重组.md`
   - 修正“前端纯读”的旧误解。
   - 明确前端是局部即时写入层 + 交互入队层，不是剧情生成层。
   - 补充 UI → AI → MVU 闭环链路与架构验收红线。

6. `docs/前端架构指南.md`
   - 前置当前权威入口结论。
   - 补充 `usePendingAction`、`store.data` 活引用、三场景枚举、CDP 闭环验收流程。
   - 清理历史换行残留与错误术语。

## 当前权威约束

### 数据流边界

- 前端可以即时更新：商城扣费、背包数量、装备/卸下、按钮抖动、归零消散、`系统.待处理交互` 入队。
- 前端不可以伪造：`soul_whisper.text`、剧情解锁、反噬扣数、NPC 心境变化。
- 用户发送下一条消息后，AI 必须读取 `系统.待处理交互`，自然叙事承接，并输出标准变量块。
- AI 承接后必须在同一次 JSON Patch 中清空 `系统.待处理交互`。

### AI 输出格式

必须使用：

```xml
<UpdateVariable>
<Analysis>...</Analysis>
<JSONPatch>
[
  { "op": "replace", "path": "/NPC/白芷/soul_whisper/text", "value": "..." },
  { "op": "replace", "path": "/NPC/白芷/soul_whisper/is_revealed", "value": true },
  { "op": "replace", "path": "/系统/待处理交互", "value": [] }
]
</JSONPatch>
</UpdateVariable>
```

禁止只输出“变量更新情况”、YAML 摘要或裸 JSON Patch。

### 场景与术语

- UI/MVU 场景枚举只允许：`莲灯前苑`、`醉玉小筑`、`绮梦幽阁`。
- 正文可描写更细地点，但写入 MVU 必须映射回上述三者。
- 必须写 `牝奴`，禁止写 `牡奴`。
- 命魂盘使用 `太极/命轮`，禁止误称 `八卦`。
- 使用 `牝阴诀`，不要写 `牝阴决`。

## 下一步建议

1. 优先处理同步断点：恢复 `tavern_sync.mjs` 或明确替代的角色卡/世界书导入流程。
2. 确认 SillyTavern 实际启用版本包含 `src/雌堕合欢宗/世界书/变量/变量输出格式.yaml` 中的 `MVU解析硬约束`。
3. 再进行新楼层实机复验：触发 UI 交互 → 用户发送下一条消息 → 检查 AI 输出格式 → 检查最新 MVU 回流。
4. 若仍裸 Patch：优先修世界书/角色卡同步，不要先改 Vue UI。
5. 若格式正确但 MVU 不回流：再检查 MVU 解析器、路径、schema 字段和楼层变量读取方式。

## 建议使用的技能

- `$diagnose` 或 `$systematic-debugging`：用于同步断点和实机回流失败的根因排查。
- `$document-release`：用于下一轮实现完成后的文档收口。
- `$verification-before-completion`：用于声称“闭环通过”前的最终验证。
- `$handoff`：用于下一次较大阶段结束后继续交接。

## 关键验证命令

```powershell
# 前端 v4 重点测试集合
npx vitest run "src/雌堕合欢宗/界面/composables/useStatusText.test.ts" "src/雌堕合欢宗/界面/data/whispers.test.ts" "src/雌堕合欢宗/界面/components/NpcCard.test.ts" "src/雌堕合欢宗/界面/components/NpcDetail.test.ts" "src/雌堕合欢宗/界面/pages/HomePage.test.ts" "src/雌堕合欢宗/界面/pages/ShopPage.test.ts" "src/雌堕合欢宗/界面/pages/BackpackPage.test.ts" "src/雌堕合欢宗/界面/pages/Phase2Page.test.ts" "src/雌堕合欢宗/界面/components/SystemBar.test.ts" "src/雌堕合欢宗/界面/components/DebugPanel.test.ts" "src/雌堕合欢宗/界面/composables/usePendingAction.test.ts"

# 前端构建
pnpm build

# 检查同步脚本是否恢复
Test-Path .\tavern_sync.mjs

# 检查世界书源规则
Select-String -Path "src/雌堕合欢宗/世界书/变量/变量输出格式.yaml" -Pattern "MVU解析硬约束|<UpdateVariable>|<JSONPatch>"
```

## 注意事项

- 当前 `git status` 中存在大量既有改动、删除和临时文件；不要在未确认来源前清理或回滚。
- 多个 docs 和源码文件已修改，下一位 agent 应先查看 `git diff -- docs` 与核心源码 diff，再决定是否继续实现或验收。
- PowerShell 写中文文档建议使用 `[System.IO.File]::ReadAllText/WriteAllText` + `[Text.UTF8Encoding]::new($false)`，避免默认编码污染。