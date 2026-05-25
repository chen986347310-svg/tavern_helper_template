# 世界运行核心与 P2 主控台变更分组清单

日期：2026-05-25

## 目的

当前工作区同时包含时间系统、商城道具、剧情钥匙、P2 主控台、DebugPanel、世界书和 PRD 多条工作线。为了避免后续开发时遗忘上下文或把不同功能混成一团，本文件把当前成果拆成可验收包，并列出每包的交付边界、验证证据、剩余风险和下一步动作。

本文件只整理现状，不回退、不清理、不提交任何已有改动。

## 总体验收状态

当前自动化验证已通过：

- P2 相关回归：`npx vitest run src/雌堕合欢宗/App.test.ts src/雌堕合欢宗/界面/components/SystemBar.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts`，结果 5 files / 69 tests pass。
- 全量测试：`npx vitest run`，结果 32 files / 481 tests pass。
- 构建：`npm run build` 成功，`schema_dump` 与 `tavern_sync` 均完成。
- `git diff --check` 未发现空白错误；仅提示多个既有文件未来会发生 CRLF/LF 换行转换。

已知非阻断警告：

- Vitest 仍出现既有 `--localstorage-file` 环境警告。
- Webpack 仍出现既有 `index.html 5.11 MiB` 体积警告和 code-splitting 建议。

## 验收包 1：世界时间与后果账本底座

### 目标

让世界从“玩家点击后 AI 单次承接”升级为“玩家行动会推动时间、欲海侦测、事件记录和后续日程”。

### 已完成

- 新增或扩展 `系统.时间状态`、`系统.欲海状态`、`剧情.事件记录` 等运行字段。
- 实现 `worldTime.ts`，用于时间流逝、欲海侦测和事件账本纯函数。
- `pendingActionPrompt.ts` 已能要求 AI 在承接待处理交互时同步结算时间、欲海和事件后果。
- DebugPanel 已能显示时间、欲海、事件记录，便于排查。

### 主要文件

- `src/雌堕合欢宗/界面/data/worldTime.ts`
- `src/雌堕合欢宗/界面/data/worldTime.test.ts`
- `src/雌堕合欢宗/schema.ts`
- `src/雌堕合欢宗/schema.json`
- `src/雌堕合欢宗/世界书/变量/initvar.yaml`
- `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts`
- `src/雌堕合欢宗/界面/components/DebugPanel.vue`

### 还缺什么

- 尚未做 CDP 实机验收：真实楼层里 AI 是否稳定写回时间、欲海和事件记录。
- 尚未把“时间流逝口径表”拆成更省 token 的世界书资料库结构。

### 下一步验收

1. 在真实 SillyTavern 中触发一次购买/使用/追查动作。
2. 用户发送下一条消息。
3. 检查正文是否承认时间流逝。
4. 检查 `<JSONPatch>` 是否更新 `系统.时间状态` 或相关后果字段。
5. 检查 `系统.待处理交互` 是否清空。

## 验收包 2：商城、道具、剧情钥匙闭环

### 目标

让玩家购买或使用服装、道具、丹药、剧情钥匙后，不只是库存变化，而是能进入叙事入口账本，并由 AI 在下一楼层承接。

### 已完成

- 商城、道具、丹药、服装等前序改动已进入工作区。
- 待处理交互已能携带显示名、器阶、作用部位、丹药分类、作用线和 AI 短提示等叙事辅助字段。
- 已生成多个 PRD 和计划文件，记录剧情钥匙、场景令牌、特殊道具和商城整改方向。

### 主要文件

- `src/雌堕合欢宗/界面/data/items.ts`
- `src/雌堕合欢宗/界面/data/itemDisplay.ts`
- `src/雌堕合欢宗/界面/data/itemLifecycle.ts`
- `src/雌堕合欢宗/界面/composables/usePendingAction.ts`
- `src/雌堕合欢宗/界面/pages/ShopPage.vue`
- `src/雌堕合欢宗/界面/pages/BackpackPage.vue`
- `src/雌堕合欢宗/脚本/服装叙事注入/`
- `docs/PRD/叙事入口账本-剧情钥匙场景令牌特殊道具整改PRD-2026-05-25.md`

### 还缺什么

- 需要单独复核剧情钥匙多次购买、入库上限、触发上限和重复入队防护。
- 需要实机验证：购买后是否只入库一次，触发后是否只排入一个待处理交互。
- 风声联动虽然有方案，但需要用真实剧情钥匙跑一遍闭环。

### 下一步验收

1. 购买同一个剧情钥匙多次。
2. 检查库存和队列是否按上限处理。
3. 进入推荐场景或触发风声线索。
4. 检查 AI 是否承接钥匙剧情，而不是普通闲聊。
5. 检查队列是否清空，并写入事件记录。

## 验收包 3：P2 牝奴期运行闭环

### 目标

让牝奴期成为第二套可运行玩法，而不是失败结局展示页。

### 已完成

- `phase2Runtime.ts` 已支持 P2 日课、调教结算、调教记录和 `worldEvent` 生成。
- `phase2Rumor.ts` 已支持从 P2 世界事件生成羞名风声。
- `牝奴.羞名标签` 已进入 schema、initvar、变量列表和 DebugPanel。
- P2 羞名风声点击后会进入 `系统.待处理交互`。
- 动态注入层会要求 AI 承接为传唤、日课异动、公开凝视或支配事件。

### 主要文件

- `src/雌堕合欢宗/界面/data/phase2Runtime.ts`
- `src/雌堕合欢宗/界面/data/phase2Runtime.test.ts`
- `src/雌堕合欢宗/界面/data/phase2Rumor.ts`
- `src/雌堕合欢宗/界面/data/phase2Rumor.test.ts`
- `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts`
- `src/雌堕合欢宗/界面/components/DebugPanel.vue`

### 还缺什么

- 需要实机验证 AI 是否在 P2 羞名风声后稳定更新 P2 字段。
- P2 日课候选表目前是最小闭环，不是完整路线树。
- P2 调教记录、事件记录、风声之间的长期节奏还需要玩法调优。

### 下一步验收

1. 在 P2 阶段制造一条公开羞名风声。
2. 点击 `WhisperPanel` 的羞名风声。
3. 检查 `系统.待处理交互` 最后一项是否为 `追查风声` 且 `剧情线=牝奴羞名`。
4. 用户发送下一条消息。
5. 检查 AI 是否更新 `牝奴.当前日课`、`牝奴.当前命令`、`牝奴.当前支配者`、`牝奴.今日调教次数` 或 `牝奴.调教记录`。

## 验收包 4：P2 UI 主控台与状态栏融合

### 目标

让玩家在 P2 第一屏直观看见牝印核心、日课、支配者、羞名风声和烙名标签，同时保证 P2 风格融入 P1，不像突然换皮肤。

### 已完成

- 新增 `phase2Display.ts`，把堕落度、牝阴决、命令强度、羞名等级、支配者转成 UI 语义。
- 新增 P2 五个组件：`StigmaCore`、`DailyRoutinePanel`、`DominatorPanel`、`WhisperPanel`、`BrandTagsPanel`。
- `Phase2Page.vue` 已组装五个组件，并保留旧信息为次级区域。
- `SystemBar.vue` 已升级 P2 模式，保留 P1 的透明阵列、圆环、铭文字体和弱风声涟漪，只把语义替换为牝印、日课、命令和羞名风声。
- `App.vue` 已把 P2 日课、命令、命令强度、风声列表传入状态栏。

### 主要文件

- `src/雌堕合欢宗/界面/data/phase2Display.ts`
- `src/雌堕合欢宗/界面/components/phase2/`
- `src/雌堕合欢宗/界面/pages/Phase2Page.vue`
- `src/雌堕合欢宗/界面/components/SystemBar.vue`
- `src/雌堕合欢宗/App.vue`

### 还缺什么

- 还没有真实截图或 CDP 视觉验收。
- P2 主控台当前是最小可用视觉，后续可继续加强凝视感和羞耻感。
- 需要确认长命令、长风声、移动端小视口不会挤压或重叠。

### 下一步验收

1. 用 CDP 打开真实 P2 页面。
2. 截图检查 P1/P2 风格是否连续。
3. 检查状态栏是否显示时辰、牝阴决、当前日课、当前命令。
4. 检查 P2 第一屏是否能看到主控台五个核心区。
5. 检查长命令是否省略自然，不遮挡主题按钮。

## 验收包 5：调试、文档与交接

### 目标

让当前阶段能被后续开发者、测试者和甲方理解，不依赖聊天上下文。

### 已完成

- `docs/superpowers/plans/2026-05-25-world-p2-runtime-progress.md` 已记录阶段 A-J。
- `docs/PRD/世界运行核心-时间日程事件后果账本PRD-2026-05-25.md` 已追加 P2 主控台落地口径。
- `docs/前端架构指南.md` 已追加 P2 UI 数据与风格边界。
- DebugPanel 已覆盖 P2 运行字段和 P2 风声元数据。

### 主要文件

- `docs/superpowers/plans/2026-05-25-world-p2-runtime-progress.md`
- `docs/superpowers/plans/2026-05-25-p2-uiux-master-console.md`
- `docs/PRD/世界运行核心-时间日程事件后果账本PRD-2026-05-25.md`
- `docs/前端架构指南.md`
- `src/雌堕合欢宗/界面/components/DebugPanel.vue`

### 还缺什么

- 尚未生成面向甲方的阶段验收报告。
- 尚未把巨大工作区拆成可提交包。
- 尚未做最终人工验收截图和 CDP 证据归档。

### 下一步验收

1. 生成阶段验收报告。
2. 基于本分组清单决定提交批次。
3. 每个批次只包含一个验收包的文件。
4. 每个批次提交前运行对应测试。

## 推荐下一步

下一步优先级如下：

1. **生成阶段验收报告**：面向项目验收，说明完成项、价值、证据、风险、剩余工作。
2. **做 CDP 实机闭环验收**：证明真实 SillyTavern 中队列、AI 承接、JSONPatch、UI 回流都能跑通。
3. **按验收包拆分提交**：避免一个巨大提交混入所有工作线。
4. **再做 P2 UI 视觉细化**：基于实机截图调密度、颜色和凝视感。

