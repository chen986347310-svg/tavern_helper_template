# 世界运行核心与 P2 主控台执行留痕

日期：2026-05-25

## 当前目标

继续实现 `docs/PRD/世界运行核心-时间日程事件后果账本PRD-2026-05-25.md`，并把 `docs/superpowers/plans/2026-05-25-p2-uiux-master-console.md` 纳入后续工作流。

## 已完成基线

- 世界运行核心字段已落地：`系统.时间状态`、`系统.欲海状态`、`剧情.事件记录`、P2 运行字段。
- `worldTime.ts` 已实现时间、欲海、事件账本纯函数。
- `phase2Runtime.ts` 已实现 P2 日课、调教结算、调教记录与 `worldEvent` 生成。
- `pendingActionPrompt.ts` 已支持牝奴期/P2 羞名队列的强制结算提示。
- `DebugPanel.vue` 已显示时间、欲海、事件记录和 P2 运行字段。
- 最近一次全量验收：`npx vitest run` 为 29 files / 459 tests pass；`npm run build` 成功，仅保留既有体积警告。

## 当前阶段

### 阶段 A：P2 羞名风声生成闭环

状态：已完成核心纯函数与 P2 运行结算接入

目标：把 P2 调教事件或世界事件账本中 `已生成风声=true` 的事件，转化为可进入 `系统.风声列表` 的 P2 羞名风声，供后续 P2 主控台 `WhisperPanel` 展示和点击承接。

验收口径：

- 公开示众生成 `公开示众` 来源风声。
- 半私密调教余波可生成 `调教余波` 来源风声。
- 私密事件默认不生成风声。
- 风声包含 `凝视来源`、`羞名等级`、`羞名标签`、`反噬日课`、`是否可承接`。
- 插入风声时复用现有 3 条上限与去重规则。

完成记录：

- 新增 `src/雌堕合欢宗/界面/data/phase2Rumor.ts`。
- 新增 `src/雌堕合欢宗/界面/data/phase2Rumor.test.ts`。
- `createP2ShameRumorFromEvent` 已支持公开示众、半私密调教余波、私密事件不扩散。
- `appendP2ShameRumor` 复用 `insertEntryRumor`，保持风声列表 3 条上限与去重规则。
- `settleP2TrainingEvent` 已新增返回 `shameRumor`，P2 调教结算可直接产出可入库羞名风声。
- 阶段内验证：`npx vitest run src/雌堕合欢宗/界面/data/phase2Rumor.test.ts` 为 4 tests pass；`npx vitest run src/雌堕合欢宗/界面/data/phase2Runtime.test.ts` 为 5 tests pass。

## 后续阶段队列

1. 补齐 P2 数据契约缺口：核查 `羞名标签` 是否应进入 `牝奴` 顶层字段，统一调教记录上限为 10。
2. 实现 `phase2Display.ts`：把堕落度、牝阴决、命令强度、羞名等级映射为 UI 语义。
3. 实现 P2 主控台组件：牝印核心、日课、支配者、听风羞名、烙名标签。
4. 重构 `Phase2Page.vue` 为 P2 主控台。
5. 升级 `SystemBar.vue` 的 P2 模式。
6. 细化 P2 羞名风声动态注入承接文案。
7. 补完 DebugPanel 的 P2 风声元数据和羞名标签编辑。
8. 同步 PRD 附录与前端架构文档。
9. 全量测试与构建验收。

### 阶段 B：P2 羞名标签数据契约

状态：已完成

目标：补齐 P2 主控台需要的 `牝奴.羞名标签`，作为后续烙名痕迹、羞名标签面板和 DebugPanel 编辑入口的数据源。

完成记录：

- `schema.ts` 已新增 `牝奴.羞名标签: string[]`，最多 8 个。
- `initvar.yaml` 已新增 `牝奴.羞名标签: []`。
- `变量列表.yaml` 已记录 `羞名标签: string[]`。
- `validate.test.ts` 已增加旧存档默认值与 8 标签上限测试。
- 阶段内验证：`npx vitest run src/雌堕合欢宗/脚本/后端校验/validate.test.ts` 为 73 tests pass。

### 阶段 C：DebugPanel P2 风声与羞名标签可观测

状态：已完成

目标：在 P2 主控台 UI 尚未落地前，先让调试面板能够验证 P2 羞名风声是否入库、元数据是否正确、羞名标签是否可读可改。

完成记录：

- `DebugPanel.vue` 已新增 `羞名标签` 编辑入口，支持逗号/中文逗号分隔，最多保留 8 个。
- `DebugPanel.vue` 已新增 P2 风声摘要，只显示 `牝奴日课/牝印命令/调教余波/宗门闲谈/公开示众/支配者传唤` 来源且未失效的风声。
- P2 风声摘要显示：来源、羞名等级、凝视来源、地点、风声 ID、反噬日课、是否可承接、风声文本。
- `ensureDebugShape()` 已为旧数据补齐 `牝奴.羞名标签`。
- 阶段内验证：`npx vitest run src/雌堕合欢宗/界面/components/DebugPanel.test.ts` 为 12 tests pass。

### 阶段 D：P2 羞名风声动态注入专用承接

状态：已完成

目标：当玩家点击 P2 羞名风声并写入 `系统.待处理交互` 后，AI 下一楼层不再按普通风声探索处理，而是承接为 P2 牝奴期玩法事件。

完成记录：

- `pendingActionPrompt.ts` 的 `追查风声` 分支已识别 `剧情线: 牝奴羞名` 或 `AI短提示` 包含 `P2羞名` 的队列。
- P2 羞名风声会保留前端 `AI短提示`，并强制承接为传唤、日课异动、公开凝视或支配事件。
- 同次 JSONPatch 必须更新 `牝奴.当前日课`、`牝奴.当前命令`、`牝奴.当前支配者`、`牝奴.今日调教次数` 或 `牝奴.调教记录` 中至少一项。
- 扫描词已补充：`牝奴羞名`、`传唤`、`日课异动`、`公开凝视`、`支配事件`、`牝奴期后果账本`。
- 阶段内验证：`npx vitest run src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 为 23 tests pass。

## 留痕规则

- 每完成一个阶段，在本文件追加“阶段完成记录”。
- 每次验收记录命令、测试数量和失败/警告情况。
- 遇到取舍时记录决策原因，避免上下文压缩后方向漂移。

## 本轮总体验收

状态：通过

- 目标链路验证：`npx vitest run src/雌堕合欢宗/界面/data/phase2Rumor.test.ts src/雌堕合欢宗/界面/data/phase2Runtime.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts src/雌堕合欢宗/界面/components/DebugPanel.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts`，结果 5 files / 117 tests pass。
- 全量测试：`npx vitest run`，结果 30 files / 467 tests pass；仅出现既有 `--localstorage-file` 环境警告。
- 构建验证：`npm run build` 成功，`schema_dump` 已同步 `schema.json`，`tavern_sync` 已打包角色卡/世界书/预设；仅保留既有 webpack 体积警告 `index.html 5.1 MiB` 与 code-splitting 建议。

## 下一个推荐阶段

进入 `docs/superpowers/plans/2026-05-25-p2-uiux-master-console.md` 的 Task 2：实现 `phase2Display.ts`，把堕落度、牝阴决、命令强度、羞名等级映射为 P2 主控台可用的沉浸式显示语义。

### 阶段 E：P2 主控台显示语义映射

状态：已完成

目标：实现 `phase2Display.ts`，把 P2 主控台需要的堕落度、牝阴决、命令强度、羞名等级、当前支配者转成稳定、可测试、无副作用的显示语义。

完成记录：

- 新增 `src/雌堕合欢宗/界面/data/phase2Display.ts`。
- 新增 `src/雌堕合欢宗/界面/data/phase2Display.test.ts`。
- 已实现 `get堕落语义`：未刻、初染、纹醒、深缠、烙成。
- 已实现 `get牝阴决语义`：未启、绕脉、入髓、归炉。
- 已实现 `get命令状态`：沉寂、发热、强制。
- 已实现 `get羞名Marker`：支持 `微闻/传开/挂牌/示众/烙名` 五档，与当前 schema 保持一致。
- 已实现 `get支配者称谓`：空值为“无人牵丝”，柳素衣使用专属“静默牵丝”。
- 已增加非法数值兜底：NaN、Infinity、越界值会被夹到安全显示范围。
- 阶段内验证：`npx vitest run src/雌堕合欢宗/界面/data/phase2Display.test.ts` 为 5 tests pass。

## 新的下一个推荐阶段

进入 `docs/superpowers/plans/2026-05-25-p2-uiux-master-console.md` 的 Task 3：实现 P2 主控台组件集，先做 `StigmaCore.vue`、`DailyRoutinePanel.vue`、`DominatorPanel.vue`、`WhisperPanel.vue`、`BrandTagsPanel.vue` 的组件测试与最小可用组件。

### 阶段 F：P2 主控台组件集

状态：已完成

目标：实现 P2 主控台第一批可组合组件，不直接读写 store，只通过 props 展示和 emit 输出交互意图，为后续 `Phase2Page.vue` 主控台改造提供稳定零件。

完成记录：

- 新增 `src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts`。
- 新增 `StigmaCore.vue`：显示牝印核心、命令状态、当前命令、堕落语义、牝阴决语义，并提供 `data-stigma-state`。
- 新增 `DailyRoutinePanel.vue`：显示执事名册、当前日课、今日朱批/调教次数、最近结算；避免现代 UI 词“任务/通知”。
- 新增 `DominatorPanel.vue`：显示当前支配者、上次支配者、前三名支配次数；柳素衣使用“静默牵丝”专属称谓。
- 新增 `WhisperPanel.vue`：显示最多 3 条未失效 P2 羞名风声；点击风声 emit `chase-rumor`，不直接写 store。
- 新增 `BrandTagsPanel.vue`：显示最多 8 个羞名标签；空状态为“尚未烙名”。
- 设计边界：组件阶段不本地生成剧情、不调用 AI、不写 MVU，只展示 props 并发出交互事件。
- 阶段内验证：`npx vitest run src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts` 为 5 tests pass。

## 新的下一个推荐阶段

进入 `docs/superpowers/plans/2026-05-25-p2-uiux-master-console.md` 的 Task 4：把 `Phase2Page.vue` 改造成 P2 主控台，组合阶段 F 的五个组件，并让 `WhisperPanel` 点击写入 `系统.待处理交互`。

### 阶段 G：Phase2Page 主控台组装

状态：已完成

目标：把阶段 F 的五个 P2 主控台组件组合进 `Phase2Page.vue`，并保留旧的淫纹、身躯改塑、牝阴决、拘束法器信息作为次级区域。

完成记录：

- `Phase2Page.vue` 顶部新增 `phase2-console`，组合 `StigmaCore`、`DailyRoutinePanel`、`DominatorPanel`、`WhisperPanel`、`BrandTagsPanel`。
- P2 羞名风声过滤来源限定为 `牝奴日课/牝印命令/调教余波/宗门闲谈/公开示众/支配者传唤`，并排除 `已失效` 风声，最多展示 3 条。
- `WhisperPanel` 点击后通过 `queueShameRumor()` 写入 `系统.待处理交互`，类型为 `追查风声`，剧情线为 `牝奴羞名`，入口类型为 `特殊事件`，并同步 `系统.当前追查风声ID`。
- 队列项携带地点、子区域、在场 NPC、风声 ID、故事钩子、关联 NPC、羞名等级与 `P2羞名风声` AI短提示，供动态注入层强制承接。
- 旧的堕落阶段、淫纹、身躯改塑、牝阴决、拘束法器展示未删除，降为主控台下方次级信息。
- 新增页面测试覆盖：主控台核心内容渲染、羞名风声点击入队、旧信息保留。
- 阶段内验证：`npx vitest run src/雌堕合欢宗/界面/pages/Phase2Page.test.ts src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts` 为 2 files / 22 tests pass；仅出现既有 `--localstorage-file` 环境警告。

## 新的下一个推荐阶段

进入 `docs/superpowers/plans/2026-05-25-p2-uiux-master-console.md` 的 Task 5：升级 `SystemBar.vue` 的 P2 模式，让状态栏显示牝印、日课、命令，并让 P2 羞名风声在状态栏涟漪中可见。

### 阶段 H：SystemBar P2 模式融合升级

状态：已完成

目标：让 P2 状态栏承接 P1 的透明阵列、铭文字体、樱花圆环和风声涟漪骨架，只在语义层逐步转向牝印、日课、命令与羞名风声，避免 P2 UI 像突然换了一套突兀皮肤。

完成记录：

- `SystemBar.vue` 新增 `system-bar--p2` 状态类，P2 仍沿用原状态栏布局、圆环进度和右侧铭文数值区。
- P2 左侧保留樱花圆环作为连续视觉骨架，在圆环中心叠加低透明度 `印` 字暗纹，表达牝印污染而非重做一套新组件。
- P2 右侧新增 `时辰`、`牝阴决`、`当前日课`、`当前命令` 展示；日课和命令使用既有 `stat-item/stat-glyph/stat-value` 结构，保持 P1/P2 风格统一。
- `activeRumors` 不再只服务攻略期，P2 羞名风声也能触发 `system-bar--rumor` 与 `data-rumor-active="true"`。
- P2 命令文案做单行省略，防止状态栏被长命令撑开或与主题切换按钮重叠。
- 新增测试覆盖：P2 状态栏继承骨架、显示日课/命令/时辰/牝阴决、P2 风声激活涟漪。
- 阶段内验证：`npx vitest run src/雌堕合欢宗/界面/components/SystemBar.test.ts` 为 1 file / 16 tests pass；仅出现既有 `--localstorage-file` 环境警告。

## 新的下一个推荐阶段

进入 `docs/superpowers/plans/2026-05-25-p2-uiux-master-console.md` 的 Task 8/Task 9 收口：同步 PRD/架构文档，并跑 P2 主控台相关回归与全量验证。Task 6、Task 7 已在前置阶段完成，可作为复验项处理。

### 阶段 I：P2 状态栏实机入口与文档收口

状态：已完成

目标：修复“组件支持 P2 日课/命令/风声，但根组件未传参”的实机入口缺口，并把 P1/P2 风格融合边界写入长期文档。

完成记录：

- `App.vue` 的牝奴期 `SystemBar` 传参已补齐：`当前日课`、`当前命令`、`命令强度`、`rumorList`、`时辰`。
- `App.test.ts` 新增集成测试，覆盖牝奴期根组件把 P2 日课、命令和羞名风声传入状态栏。
- 红灯验证确认旧实现下 `data-rumor-active` 为 `false`，说明根层未传 P2 风声。
- 修复后 `App.test.ts` 回绿，确认真实 App 入口能激活 `system-bar--p2` 与 P2 风声涟漪，并显示当前日课/命令。
- `docs/PRD/世界运行核心-时间日程事件后果账本PRD-2026-05-25.md` 已追加 `P2牝奴期主控台落地口径`，明确数据闭环、UI 验收、状态栏融合口径。
- `docs/前端架构指南.md` 已追加 `P2 UI 数据与风格边界`，要求 P2 继承 P1 卷轴底色、透明阵列、铭文字体、圆环和弱风声涟漪，不另做突兀独立皮肤。
- 阶段内验证：`npx vitest run src/雌堕合欢宗/App.test.ts` 为 1 file / 8 tests pass；仅出现既有 `--localstorage-file` 环境警告。

## 新的下一个推荐阶段

进入全量收口验证：运行 P2 相关回归、`npx vitest run`、`npm run build`，再根据结果决定是否进入下一轮 UI 细化或开始新的工作项。

### 阶段 J：全量收口验证与工作区检查

状态：已完成

目标：在 P2 主控台、P2 状态栏融合、App 入口传参和文档同步后，做一次完整验证，确认当前阶段可以交付给下一轮工作。

完成记录：

- P2 相关回归通过：`npx vitest run src/雌堕合欢宗/App.test.ts src/雌堕合欢宗/界面/components/SystemBar.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts`，结果 5 files / 69 tests pass。
- 全量测试通过：`npx vitest run`，结果 32 files / 481 tests pass。
- 构建通过：`npm run build` 成功，`schema_dump` 与 `tavern_sync` 均完成。
- 构建仅保留既有 webpack 体积警告：`index.html 5.11 MiB` 超过推荐体积，以及 code-splitting 建议。
- 测试仅保留既有 `--localstorage-file` 环境警告。
- `git diff --check` 未发现空白错误；仅提示多个既有文件未来会发生 CRLF/LF 换行转换。
- `git status --short` 显示工作区存在大量前序任务改动与未跟踪文件，包含商城、道具、时间、P2、文档等多条工作线；本阶段不回退、不清理这些改动，避免误删前序成果。

## 新的下一个推荐阶段

建议进入“变更分组与交付整理”：把当前巨大工作区按功能线分成可验收包，例如 1）时间/后果账本底座，2）商城/道具/剧情钥匙闭环，3）P2 主控台与状态栏融合，4）文档/PRD 留痕。分组后再决定是否提交、打包或继续做视觉细化。

### 阶段 K：CDP 实机环境启动与非破坏性检查

状态：部分完成，等待队列隔离决策

目标：按照 `docs/教程/chrome调试启动指引.md` 启动 Chrome CDP，并验证真实 SillyTavern 页面中的 MVU、P2 UI 和后端校验 hook 是否可用。

完成记录：

- 已按指引执行 `./start-dev.ps1 -ChromeOnly -NoKill`，成功启动 Chrome 调试端口 `9222`。
- `http://127.0.0.1:9222/json/version` 返回 Chrome/148.0.7778.179，CDP 端点可用。
- 已通过 CDP 打开 `http://127.0.0.1:8000/`，SillyTavern 页面可访问。
- 初次检查发现当前选中角色为 `SillyTavern System`，`Mvu` 和 `__TEST_applyValidatedUpdate` 不可用。
- 已通过页面 DOM 点击 `#CharID1`，切换到 `雌堕合欢宗` 角色卡。
- 切换后 `node cdp-v4-mvu-check.mjs --port 9222 --json` 通过，确认：
  - latest `stat_data` 可读。
  - `系统.时辰`、`系统.当前场景`、`系统.待处理交互`、`系统.场景上下文`、`系统.风声列表`、`系统.当前追查风声ID` 均存在。
  - 当前场景为 `外门弟子舍`，时辰为 `晨时`，在场 NPC 为 `白芷`。
  - 后端校验 hook `__TEST_applyValidatedUpdate` 在 `TH-script--后端校验` iframe 中可用。
- 已确认真实消息 iframe `TH-message--4--0` 中 P2 UI 已渲染：`system-bar`、`phase2-page`、`phase2-console` 均存在，状态栏显示 `印 / 晨时 / 0/9 / 候命`，主控台显示牝印核心、执事名册、听风羞名、烙名痕迹等区域。

当前阻塞：

- 当前聊天的 `系统.待处理交互` 已有 3 条旧购买队列：两条 `经阁制服`、一条 `白芷旧誓线`。
- 这些队列属于真实聊天状态，不能由验收脚本擅自清空；否则会破坏尚未被 AI 承接的玩家操作。
- 由于队列非空，不能直接注入 P2 羞名风声做闭环验收，否则会和旧购买队列混在一起，验收结论不干净。

建议决策：

1. 新开一条测试聊天或复制当前聊天作为验收沙盒，再注入 P2 羞名风声测试。
2. 或由用户确认允许清空当前 3 条旧购买队列，再在当前聊天继续 P2 闭环验收。
3. 或先让 AI 承接当前 3 条购买队列，确认队列清空后再继续 P2 羞名风声测试。

### 阶段 L：P2 羞名风声实机点击入队验收

状态：已完成前端入队闭环，等待 AI 下一楼层承接验收

目标：在用户新开的干净测试聊天中，验证 P2 主控台真实 UI 能展示羞名风声，并在点击后写入 `系统.待处理交互`。

完成记录：

- 用户已新开测试聊天。
- `node cdp-v4-mvu-check.mjs --port 9222 --json` 通过，确认新聊天：
  - 当前场景为 `莲灯前苑`。
  - 时辰为 `晨时`。
  - `系统.待处理交互=[]`。
  - `系统.风声列表=[]`。
  - 后端校验 hook 可用。
- 已通过 `__TEST_applyValidatedUpdate` 注入最小 P2 测试状态：
  - `系统.阶段=牝奴期`。
  - `系统.时辰=午时`。
  - `系统.当前场景=莲灯前苑`。
  - `牝奴.当前日课=午后点名`。
  - `牝奴.当前支配者=柳素衣`。
  - `牝奴.当前命令=当众应名`。
  - `牝奴.命令强度=88`。
  - `牝奴.羞名标签=[听命, 示众]`。
  - `系统.风声列表` 注入 1 条 `公开示众` P2 羞名风声，风声 ID 为 `p2-cdp-shame-1`。
- 刷新当前消息 iframe 后，真实 UI 中 `TH-message--0--0` 已出现：
  - `system-bar`。
  - `phase2-page`。
  - `phase2-console`。
  - 1 个 `[data-testid="p2-whisper-action"]`。
- 已通过 CDP 点击真实 UI 的 P2 羞名风声按钮。
- 点击后读取 MVU，确认 `系统.待处理交互.length=1`，队列项为：
  - `类型=追查风声`。
  - `目标=玩家`。
  - `风声ID=p2-cdp-shame-1`。
  - `剧情线=牝奴羞名`。
  - `关联NPC=柳素衣`。
  - `秘密主题=挂牌`。
  - `入口类型=特殊事件`。
  - `线索ID=p2-cdp-shame-1`。
  - `AI短提示=P2羞名风声：请把挂牌承接为传唤、日课异动、公开凝视或支配事件。`
- 同步确认 `系统.当前追查风声ID=p2-cdp-shame-1`。

下一步：

- 需要触发 AI 下一楼层生成，验证动态注入是否让 AI 正文承接 P2 羞名风声，并在同次 JSONPatch 中清空 `系统.待处理交互`，同时更新 `牝奴.当前日课`、`牝奴.当前命令`、`牝奴.当前支配者`、`牝奴.今日调教次数` 或 `牝奴.调教记录` 中至少一项。

### 阶段 M：P2 羞名风声 AI 承接实机验收

状态：未通过，进入动态注入链路诊断

目标：验证玩家点击 P2 羞名风声后，AI 下一楼层是否能读取 `系统.待处理交互`，承接为 P2 牝奴期羞名剧情，并在 JSONPatch 中清空队列与更新 P2/时间/事件后果字段。

实机结果：

- 用户已发送测试消息：`顺着这条风声去照影廊看看。`
- AI 已回复，但回复没有承接 P2 羞名风声。
- CDP 复查 `node cdp-v4-mvu-check.mjs --port 9222 --json` 结构通过，但行为验收失败：
  - `系统.待处理交互.length=1`，队列仍保留同一条 `追查风声`。
  - `系统.当前追查风声ID=p2-cdp-shame-1` 未清空。
  - `系统.阶段=牝奴期` 保持正确。
  - `牝奴.当前日课=午后点名`、`牝奴.当前支配者=柳素衣`、`牝奴.当前命令=当众应名`、`牝奴.今日调教次数=3` 均未变化。
  - `牝奴.调教记录=[]`，未写入羞名/支配事件记录。
  - `时间状态.时段进度=0`、`时间状态.最近耗时=''`、`时间状态.最近结算原因=''`，未发生时间结算。
  - `剧情.事件记录=[]`，未写入事件后果账本。
- AI 正文表现为 P1 普通风声承接，而不是 P2 羞名承接：将照影廊风声写成“新来女修哭泣/未安排双修伴侣”的普通线索，没有出现挂牌、传唤、日课异动、公开凝视或支配事件。

阶段结论：

- 前端点击与入队闭环通过，不是 P2 主控台按钮问题。
- 失败点位于“动态注入 / AI 承接 / JSONPatch 应用”链路：AI 下一楼层没有被强制引导处理 P2 `待处理交互`，或生成后变量更新没有被正确写回。
- 下一步进入根因诊断：检查 `服装叙事注入` 脚本是否加载、是否读取 latest MVU 队列、是否把 P2 专用待处理交互提示注入到下一次 prompt，以及 AI 回复中是否存在隐藏变量更新但未通过校验。
### 阶段 N：P2 动态注入链路修复与实机探针验证

状态：已完成注入层修复，等待下一楼层 AI 承接复验

目标：修复阶段 M 暴露的 AI 未承接 P2 羞名风声问题，至少先证明动态注入层在真实 SillyTavern 生成链路中能读取 `系统.待处理交互` 并注入 P2 专用提示。

修复内容：

- `narrativePromptRuntime.ts` 新增最近一次注入快照：记录刷新原因、待处理交互数量、注入 prompt id、是否存在 P2 待处理交互、是否实际注入。
- `index.ts` 将叙事提示刷新从单一 `GENERATE_BEFORE_COMBINE_PROMPTS` 扩展为三段兜底：
  - `MESSAGE_SENT -> refresh('message_sent')`
  - `GENERATION_STARTED -> refresh('generation_started')`
  - `GENERATE_BEFORE_COMBINE_PROMPTS -> refresh('before_combine_prompts')`
- `index.ts` 暴露只读/测试探针：
  - `window.__HEHUAN_NARRATIVE_PROMPT_SNAPSHOT__()`：查看最近一次注入快照。
  - `window.__TEST_refreshNarrativePrompts(reason)`：手动刷新并返回快照，用于 CDP 验证，不清空队列、不写剧情、不代替 AI。
- `narrativePromptRuntime.test.ts` 新增测试，覆盖 P2 队列下快照应记录 `pendingCount=1`、`hasP2PendingAction=true`、pending prompt id 已注入。

验证结果：

- 红灯验证：新增测试先失败于 `runtime.getSnapshot is not a function`，确认测试覆盖的是缺失能力。
- 绿灯验证：`npx vitest run src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，2 files / 28 tests pass。
- `npm run build` 通过，仅保留既有 webpack 体积警告：`index.html 5.11 MiB` 超过推荐体积。
- 发现并处理既有构建坑：`npm run build` 不会更新 `dist/backend_validate.js`，已额外执行 esbuild 重建后端校验脚本，并按项目运行时要求将 lodash import 修补为 `const _2 = window._;`。
- CDP 刷新后首次未找到探针，原因不是代码失败，而是页面未加载角色卡脚本；重新通过 DOM 点击 `#CharID1` 切回 `雌堕合欢宗` 后，`TH-script--后端校验` 恢复。
- CDP 实机探针验证通过：
  - 后端校验 iframe 存在：`TH-script--后端校验--23255cb7-f141-40ab-982b-8af100a0c51d`。
  - `__HEHUAN_NARRATIVE_PROMPT_SNAPSHOT__` 与 `__TEST_refreshNarrativePrompts` 均存在。
  - 最近一次生成链路快照为 `reason=generation_started`。
  - `pendingCount=1`。
  - `hasP2PendingAction=true`。
  - `promptIds=[hehuan-pending-action-summary, hehuan-pending-action-scan]`。
  - `injected=true`。
- `node cdp-v4-mvu-check.mjs --port 9222 --json` 通过，当前 latest MVU 仍为：
  - `系统.阶段=牝奴期`。
  - `系统.待处理交互.length=1`。
  - 队列项为 P2 `追查风声` / `剧情线=牝奴羞名` / `风声ID=p2-cdp-shame-1`。
- `git diff --check` 未发现空白错误；仅有多个既有 CRLF/LF 换行转换警告。

阶段结论：

- 阶段 M 的失败点已经从“前端入队”排除，并进一步确认：新版动态注入层可以在真实生成链路里读取 P2 队列并注入专用 pending prompt。
- 当前还未完成最终 AI 承接验收，因为还需要用户再发送/触发一条新生成来验证：
  - AI 正文是否承接 P2 羞名/挂牌/传唤/日课异动/公开凝视/支配事件。
  - `系统.待处理交互` 是否在同次 JSONPatch 中清空。
  - `牝奴.*`、`系统.时间状态`、`剧情.事件记录` 是否至少发生合理更新。

下一步：

- 请在当前测试聊天继续发送一句追查/顺从类输入，触发 AI 下一楼层。
- AI 回复后执行 CDP 复查：若队列清空且 P2/时间/事件字段更新，则记录阶段 O 为 AI 承接闭环通过；若仍未承接，则根因将转向提示词强度/世界书变量规则/模型输出格式，而不是注入脚本加载问题。
### 阶段 O：P2 羞名风声 AI 二次承接验收

状态：未通过，根因定位到生成时 MVU 读取楼层错误

目标：验证阶段 N 修复后，AI 下一楼层能否承接 P2 羞名风声并完成 JSONPatch 闭环。

用户输入：

- `继续顺着羞名去照影廊，听柳素衣如何传唤我`

实机结果：

- 正文层面：部分通过。
  - AI 已写出照影廊、传唤、玄铁黑牌、掌门殿偏殿等承接内容。
  - 相比阶段 M 的“普通 P1 风声”，本次至少承接到了 P2 提示里的“传唤”方向。
- 变量闭环：未通过。
  - `系统.待处理交互.length=1`，P2 `追查风声` 队列仍未清空。
  - `系统.当前追查风声ID=p2-cdp-shame-1` 未清空。
  - `牝奴.当前日课`、`牝奴.当前支配者`、`牝奴.当前命令`、`牝奴.今日调教次数`、`牝奴.调教记录` 未实际写回变化。
  - `系统.时间状态` 未写回耗时、结算原因或事件类型。
  - `剧情.事件记录=[]`，事件后果账本未写入。
- AI 回复原文中出现 `<UpdateVariable><JSONPatch>` 开头，但 latest MVU 没有应用出清队列与 P2 更新；需要后续继续检查是否 JSONPatch 截断、格式不完整或被校验拒绝。

关键诊断证据：

- 新增注入探针显示，最近一次生成链路快照为：
  - `reason=generation_started`
  - `pendingCount=0`
  - `promptIds=[]`
  - `hasP2PendingAction=false`
  - `injected=false`
- 但生成结束后 latest MVU 仍显示：
  - `系统.待处理交互.length=1`
  - 队列项仍为 `剧情线=牝奴羞名` 的 P2 `追查风声`。

阶段结论：

- 阶段 N 的“探针存在、注入运行时可观测”是有效的；它帮助定位到了新的根因。
- 当前根因不是按钮、不是 dist 未加载，也不是 pending prompt 构造能力缺失，而是生成开始时 `getStatData: Mvu.getMvuData({ message_id: 'latest' })` 读到了新用户楼层；该楼层没有待处理交互，于是动态注入层误判 `pendingCount=0`，没有把 P2 队列注入给 AI。
- 下一步修复：叙事注入读取 MVU 时不能只读 `latest`，必须在 latest 无队列时向前回溯最近几楼，找到仍含 `系统.待处理交互` 的 MVU，并把该队列合并进本轮提示数据。
### 阶段 P：生成时 MVU 回溯读取修复

状态：已完成，等待下一楼层 AI 承接复验

目标：修复阶段 O 暴露的根因：生成开始时 `latest` 可能是新用户楼层，导致动态注入层读不到上一楼层仍存在的 `系统.待处理交互`。

修复内容：

- `narrativePromptRuntime.ts` 新增 `findStatDataForNarrativePrompt()`：
  - 先读取 `latest`。
  - 若 `latest` 没有 `系统.待处理交互`，继续回溯 `-1` 到 `-5`。
  - 找到最近一个含待处理交互的 MVU 后，使用该楼层 stat_data 构造动态注入。
  - 若所有楼层都没有队列，则回退 latest，避免影响普通服装/禁器摘要。
- `index.ts` 的 `getStatData` 改为调用 `findStatDataForNarrativePrompt(message_id => Mvu.getMvuData({ type: 'message', message_id })?.stat_data)`。
- `narrativePromptRuntime.test.ts` 新增红灯用例：latest 无队列、`-2` 有 P2 羞名队列时，读取器必须返回 `-2` 的 stat_data。

验证结果：

- 红灯验证：新增测试先失败于 `findStatDataForNarrativePrompt is not a function`。
- 绿灯验证：`npx vitest run src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，2 files / 29 tests pass。
- 已单独重建 `dist/backend_validate.js`：
  - `npx esbuild src/雌堕合欢宗/脚本/后端校验/index.ts --bundle --format=esm --target=es2022 --outfile=dist/backend_validate.js --external:lodash`
  - 已将产物 lodash import 修补为 `const _2 = window._;`。
  - 产物确认包含 `findStatDataForNarrativePrompt` 与 `__HEHUAN_NARRATIVE_PROMPT_SNAPSHOT__`。
- CDP 实机验证通过：刷新页面、重新点击 `#CharID1` 选择 `雌堕合欢宗` 后，后端校验 iframe 重新加载。
- CDP 手动探针 `__TEST_refreshNarrativePrompts('cdp_backfill_probe')` 返回：
  - `reason=cdp_backfill_probe`
  - `pendingCount=1`
  - `promptIds=[hehuan-pending-action-summary, hehuan-pending-action-scan]`
  - `hasP2PendingAction=true`
  - `injected=true`

阶段结论：

- 生成时读错楼层的问题已修复并经实机探针验证。
- 下一次用户发送消息时，即使新用户楼层自身没有队列，动态注入层也会从最近含队列的 MVU 楼层回溯读取 P2 `待处理交互`，并注入 pending action prompt。
- 最终闭环仍需下一楼层 AI 复验：正文承接、`系统.待处理交互=[]`、`系统.当前追查风声ID=''`、`牝奴.*`、`系统.时间状态`、`剧情.事件记录` 更新。
### 阶段 Q：P2 羞名风声三次承接验收

状态：未通过，根因转移到 AI 输出变量块格式与 JSONPatch 应用

目标：验证阶段 P 的 MVU 回溯读取修复后，AI 下一楼层能否完整承接 P2 羞名风声并完成变量闭环。

用户输入：

- `继续进入偏殿，听柳素衣当众宣读我的羞名，并按传唤完成日课结算。`

实机结果：

- 动态注入层：通过。
  - 探针显示最近一次生成链路快照：
    - `reason=generation_started`
    - `pendingCount=1`
    - `promptIds=[hehuan-pending-action-summary, hehuan-pending-action-scan]`
    - `hasP2PendingAction=true`
    - `injected=true`
  - 说明阶段 P 的回溯读取修复生效，生成开始时已经读取到 P2 待处理交互并注入提示。
- 正文层面：通过。
  - AI 写出柳素衣在掌门殿偏殿宣读羞名。
  - 羞名为 `窥鞋奴`。
  - 写出日课/挂牌/听风廊示众钩子。
- 变量闭环：未通过。
  - `系统.待处理交互.length=1`，队列仍未清空。
  - `系统.当前追查风声ID=p2-cdp-shame-1` 未清空。
  - latest MVU 的 `系统.时间状态` 读取为 `null`，`剧情.事件记录` 读取为 `null`。
  - latest `牝奴` 只剩部分字段：`堕落度`、`牝阴决层数`、`上次支配者`、`支配次数`、`情欲控制阶段`、`改造进度`，关键字段如 `当前日课`、`当前支配者`、`当前命令`、`今日调教次数`、`调教记录` 未保留在 latest 读取结果中。
  - `系统.风声列表` 被更新成新的 `rumor_shame_display_1` / `rumor_shame_1` 类型羞名风声，说明 AI 有尝试写入后果，但整体变量应用不完整。

关键诊断证据：

- AI 原文中出现了两个 `<UpdateVariable>` 块。
- 第一个 `<JSONPatch>` 看起来包含清空队列、写时间状态、更新 P2、添加事件记录、替换风声列表等操作。
- 第二个 `<JSONPatch>` 再次开始写变量，并在 `"path": "/牝奴/羞名标签/` 处截断，属于明显不完整/非法 JSONPatch。
- 这解释了为什么正文承接成功、注入成功，但 MVU 最终没有得到完整可靠结算：模型输出变量块重复且第二段截断，可能导致 MVU 解析/应用失败或只部分应用。

阶段结论：

- 前端点击链路：通过。
- 动态注入链路：通过。
- AI 正文承接：通过。
- JSONPatch/MVU 结算闭环：未通过。
- 当前下一步不应继续强化注入读取，而应收敛 AI 输出格式：强制只输出一个 `<UpdateVariable>`，只输出一个完整 `<JSONPatch>`，禁止重复变量块，且优先保证清空 `系统.待处理交互`、时间状态、P2 字段和事件记录完整写回。

建议下一步修复方向：

1. 强化 pending action prompt 的变量输出约束：明确“只能输出一个 `<UpdateVariable>`，禁止第二个变量块”。
2. 在 pending prompt 中要求 JSONPatch 最短闭环优先，减少长 patch 截断风险：先清队列、清当前追查风声、写时间状态、写 P2 关键字段、写事件记录；风声列表可作为后续项。
3. 避免使用不支持或不稳定的 JSONPatch op，例如 `insert`；统一使用 `add` 或 `replace`。
4. 增加测试覆盖 pending prompt 必须包含“唯一变量块/禁止重复/禁止截断/最短闭环优先”的硬约束文本。
### 阶段 R：AI 变量输出格式收敛修复

状态：已完成，等待下一楼层 JSONPatch 闭环复验

目标：修复阶段 Q 暴露的问题：AI 已承接剧情并收到 pending prompt，但输出了两个 `<UpdateVariable>`，第二个 JSONPatch 截断且包含不稳定 `insert`，导致 MVU 变量闭环失败。

修复内容：

- `pendingActionPrompt.ts` 新增变量输出格式硬约束：
  - 只能输出一个 `<UpdateVariable>`。
  - 一个 `<UpdateVariable>` 中只能输出一个完整 `<JSONPatch>`。
  - 禁止输出第二个 `<UpdateVariable>`、第二个 `<JSONPatch>`、重复 Analysis 或补写变量块。
- 新增 JSONPatch 安全约束：
  - JSONPatch 必须是完整 JSON 数组并正常闭合。
  - 禁止使用 `insert`。
  - 数组追加统一使用 `add` 到 `/-`。
  - 字段改写使用 `replace`。
- 新增最短闭环优先：
  - 第一优先级：`系统.待处理交互=[]`。
  - 清空 `系统.当前追查风声ID`。
  - 写入 `系统.时间状态`。
  - 写入 `牝奴.当前日课/当前支配者/当前命令/今日调教次数/最近调教结算`。
  - 写入 `剧情.事件记录`。
  - `系统.风声列表`、心音和额外细节放在后面；输出空间不足时省略额外项。
- `pendingActionPrompt.test.ts` 新增红灯用例，覆盖唯一变量块、完整 JSONPatch、禁止 insert、最短闭环优先等硬约束文本。

验证结果：

- 红灯验证：新增测试先失败于缺少 `只能输出一个<UpdateVariable>` 等约束文本。
- 绿灯验证：`npx vitest run src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，1 file / 24 tests pass。
- 相关回归：`npx vitest run src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，2 files / 30 tests pass。
- 已单独重建 `dist/backend_validate.js` 并修补 lodash import 为 `const _2 = window._;`。
- 产物确认包含 JSONPatch 硬约束、`findStatDataForNarrativePrompt` 与 `__HEHUAN_NARRATIVE_PROMPT_SNAPSHOT__`。
- `git diff --check` 未发现空白错误；仅有既有 CRLF/LF 换行转换警告。
- CDP 实机刷新并重新选择角色后，探针 `__TEST_refreshNarrativePrompts('cdp_format_probe')` 返回：
  - `pendingCount=1`
  - `promptIds=[hehuan-pending-action-summary, hehuan-pending-action-scan]`
  - `hasP2PendingAction=true`
  - `injected=true`

阶段结论：

- 注入层仍然稳定，且新版提示已随 `dist/backend_validate.js` 加载到实机。
- 当前修复针对 AI 变量块重复、JSONPatch 截断和不稳定 op。
- 下一步需要用户再触发一条较短回复，验证 AI 是否只输出一个完整 `<UpdateVariable>/<JSONPatch>`，并完成：队列清空、追查风声 ID 清空、P2 日课/命令更新、时间状态和事件记录写回。
### 阶段 S：P2 羞名挂牌最新楼层验收

状态：部分通过，JSONPatch 输出格式仍未收敛

目标：验证阶段 R 的变量输出格式收敛修复后，AI 是否能完成 P2 羞名挂牌日课结算，并只输出一个完整变量块。

实机结果：

- 动态注入层：通过。
  - `reason=generation_started`。
  - `pendingCount=1`。
  - `promptIds=[hehuan-pending-action-summary, hehuan-pending-action-scan]`。
  - `hasP2PendingAction=true`。
  - `injected=true`。
- 正文层面：通过。
  - AI 写出从掌门殿偏殿前往听风廊。
  - 写出将 `窥鞋奴` 木牌挂到听风廊示众石壁。
  - 写出女修围观与纪兰记录“日课挂牌，已录”。
- 队列闭环：通过。
  - latest `系统.待处理交互=[]`。
  - latest `系统.当前追查风声ID=""`。
  - latest `系统.当前场景=听风廊`。
  - latest `系统.场景上下文` 已更新为听风廊 / 示众石壁 / 在场 NPC 纪兰。
- 变量完整性：未通过。
  - latest `系统.时间状态` 读取为 `null`。
  - latest `剧情.事件记录` 读取为 `null`。
  - latest `牝奴` 只保留部分字段，`当前日课`、`当前支配者`、`当前命令`、`今日调教次数`、`调教记录` 等关键字段未稳定保留。
- 输出格式：未通过。
  - 最新回复仍包含 2 个 `<UpdateVariable>`。
  - 最新回复仍包含 2 个 `<JSONPatch>`。
  - 第二个 JSONPatch 使用了不稳定 op：`insert`、`delta`。
  - 虽然第一个 JSONPatch 已包含清空队列、清空风声 ID、时间状态、事件记录等补丁，但第二个变量块继续覆盖/干扰，导致最终 MVU 状态不完整。

阶段结论：

- 前端点击、动态注入、AI 正文承接、队列清空已经打通。
- 当前剩余核心问题是“变量输出后处理/格式约束”仍不足：仅靠 pending prompt 文本无法可靠阻止模型输出第二个变量块和非法 op。
- 下一步应从提示词约束升级为运行时/后处理防线：
  1. 在变量校验或消息后处理层检测重复 `<UpdateVariable>`，只保留第一个完整变量块或拒绝重复块。
  2. 检测 JSONPatch 中的非法 op（如 `insert`、`delta`），记录错误并阻止破坏性应用。
  3. 对待处理交互闭环字段做应用后校验：队列清空、当前追查风声 ID 清空、时间状态存在、P2 关键字段存在、事件记录存在。
  4. 若正文已承接但变量块失败，需要给调试面板或验收脚本明确报错，而不是静默留下半损坏 MVU。
### 阶段 T：额外模型解析层重复变量块防线

状态：代码防线已完成，待下一楼层实机触发验证

用户澄清：

- 第一个 `<UpdateVariable>` 是正文 AI 输出。
- 第二个 `<UpdateVariable>` 是额外模型解析输出。

根因重分类：

- 当前问题不再归类为“正文 AI 未遵守 pending prompt”。
- 新根因是额外模型 / MVU 变量解析层在正文变量块之后又生成了一组变量更新命令，且该组命令包含 `insert`、`delta` 对应的 MVU 命令类型，可能覆盖或破坏第一组已经正确闭环的关键字段。

本阶段修复：

- 新增 `src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.ts`。
  - 挂载到 `Mvu.events.COMMAND_PARSED`。
  - 兼容 `commands =>` 与 `(vars, commands, message_content) =>` 两种事件签名。
  - 删除额外解析层更容易破坏状态的 `insert` 与 `add` 命令。
  - 对关键闭环路径只保留第一次写入，后续重复写入丢弃：`系统.待处理交互`、`系统.当前追查风声ID`、`系统.时间状态`、`系统.欲海状态`、`剧情.事件记录`、`牝奴.当前日课/当前支配者/当前命令/今日调教次数/最近调教结算/调教记录/羞名标签`。
  - 写入 `window.__HEHUAN_MVU_COMMAND_SANITIZER_LAST__`，供 CDP 与调试面板查看最近一次过滤诊断。
- 扩展 `validateVariables()` 的世界运行核心字段恢复：
  - `系统.时间状态`、`系统.欲海状态` 为 `null` 或非对象时恢复安全结构。
  - `剧情.事件记录`、`剧情.已解锁`、`剧情.线索状态` 缺失或损坏时恢复安全结构。
  - P2 关键字段 `牝奴.当前日课/当前支配者/当前命令/命令强度/今日调教次数/待执行日课/最近调教结算/羞名标签/调教记录` 缺失或被写成 `null` 时恢复安全结构。
- 不在校验层自动清空 `系统.待处理交互`，避免吞掉未被 AI 正文承接的玩家操作。

测试留痕：

- 红灯 1：`mvuCommandSanitizer.test.ts` 初次运行失败于模块不存在，证明测试覆盖新防线。
- 绿灯 1：`mvuCommandSanitizer.test.ts` 通过，3 tests pass。
- 红灯 2：`validate.test.ts` 初次运行失败于 `系统.时间状态=null` 未恢复，复现实机坏法。
- 绿灯 2：`validate.test.ts` 通过，74 tests pass。
- 相关回归：`npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，4 files / 107 tests pass。
- 已重建 `dist/backend_validate.js`，并修补 lodash import 为 `const _2 = window._;`。
- 产物确认包含 `sanitizeMvuCommands` 与 `__HEHUAN_MVU_COMMAND_SANITIZER_LAST__`。
- `git diff --check` 未发现空白错误；仅有既有 CRLF/LF 换行转换警告。
- `node cdp-v4-mvu-check.mjs --port 9222 --json` 通过，当前最新楼层 `pendingCount=0`、当前场景 `听风廊`、在场 NPC `纪兰`。

下一步验收要求：

1. 刷新或重新加载角色脚本，使新版 `dist/backend_validate.js` 进入 SillyTavern 页面。
2. 再触发一次会产生额外模型解析的楼层。
3. 验收 `window.__HEHUAN_MVU_COMMAND_SANITIZER_LAST__`：若额外解析层仍生成 `insert/add` 或重复关键路径，应看到 `dropped > 0`。
4. 验收 latest MVU：`系统.时间状态`、`剧情.事件记录`、P2 牝奴关键字段不得再变成 `null` 或缺失。
5. 若第二个 `<UpdateVariable>` 仍显示在正文文本中，但命令过滤诊断显示已拦截且 MVU 最终状态完整，则该问题降级为“显示/正则隐藏问题”，不再是状态破坏问题。
### 阶段 U：新版后端脚本加载验收

状态：通过，等待下一楼层实机触发

本阶段目标：

- 确认 SillyTavern 当前页面已经重新加载新版 `dist/backend_validate.js`。
- 确认新增的 MVU 命令过滤诊断钩子已进入脚本 iframe。

验收过程：

- 刷新前检查发现：旧的 `__HEHUAN_NARRATIVE_PROMPT_SNAPSHOT__` 存在，但新的 `__HEHUAN_MVU_COMMAND_SANITIZER_LAST__` 为 `undefined`，说明页面仍在旧脚本状态。
- 已通过 CDP 执行 `Page.reload({ ignoreCache: true })`。
- 刷新后短时间内 `Mvu` 一度为 `undefined`，判断为角色/MVU 脚本尚未重新挂载。
- 用户重新打开角色聊天后复查：脚本 iframe 中新版钩子已加载。

关键证据：

- 脚本上下文：`sanitizerType=object`。
- 初始诊断值：`{ scanned: 0, kept: 0, dropped: 0, droppedCommands: [] }`。
- `promptSnapshotType=function`。
- `mvuType=object`。
- latest MVU 存在，`pendingCount=0`，当前场景为 `听风廊`。
- `node cdp-v4-mvu-check.mjs --port 9222 --json` 通过：`failureCount=0`，`warningCount=0`。

阶段结论：

- 新版 `backend_validate.js` 已进入实机页面。
- `COMMAND_PARSED` sanitizer 已待命，但尚未经历新一轮变量解析事件，因此诊断仍为初始空值。
- 下一步需要触发一次新的 P2 待处理交互并生成下一楼层，用来验证额外模型解析层的第二变量块是否被拦截，以及 latest MVU 是否保持完整。
### 阶段 V：P2 羞名风声新版 sanitizer 实机验收

状态：部分通过，防破坏通过，业务落账未通过

触发方式：

- 用户按建议触发 P2 羞名风声待处理交互，并发送：`继续顺着这条羞名风声，去听风廊看纪兰如何记录我的日课。`
- AI 已完成新楼层回复。

正文与注入验收：

- 动态注入层通过：
  - `reason=generation_started`
  - `pendingCount=1`
  - `promptIds=[hehuan-pending-action-summary, hehuan-pending-action-scan]`
  - `hasP2PendingAction=true`
  - `injected=true`
- 最新 AI 回复仍包含 2 个 `<UpdateVariable>` 与 2 个 `<JSONPatch>`。
- 正文叙事承接通过：到听风廊、纪兰记录、公开凝视/看鞋羞名压力都被承接。

sanitizer 验收：

- `window.__HEHUAN_MVU_COMMAND_SANITIZER_LAST__` 已生效。
- 本轮诊断：`scanned=30`，`kept=26`，`dropped=4`。
- 被拦截命令包括：
  - 1 条由 JSONPatch `add /牝奴/调教记录/-` 转成的 MVU `insert` 命令，原因 `disallowed_command_type`。
  - 3 条重复关键路径写入：`系统.当前追查风声ID`、`系统.待处理交互`、`剧情.事件记录`，原因 `duplicate_critical_path`。
- 结论：运行时命令过滤器确实拦到了额外模型解析层的破坏性/重复命令。

latest MVU 验收：

- 队列闭环通过：`系统.待处理交互=[]`。
- 当前追查风声闭环通过：`系统.当前追查风声ID=""`。
- 场景更新通过：`系统.当前场景=听风廊`，`场景上下文` 为听风廊/示众石壁/纪兰在场。
- 核心字段完整性防线通过：
  - `系统.时间状态` 不再是 `null`，已恢复安全结构。
  - `系统.欲海状态` 不再是 `null`，已恢复安全结构。
  - `剧情.事件记录` 不再是 `null`，已恢复为数组。
  - P2 `牝奴` 关键字段不再缺失或为 `null`。
- 业务落账未通过：
  - `系统.时间状态` 最终为默认值，未保留 AI 写入的 `时段进度=1`、`最近耗时=一刻钟内` 等。
  - `剧情.事件记录=[]`，未保留 AI 写入的事件记录。
  - `牝奴.当前日课=候命`、`当前命令=""`、`今日调教次数=0`、`调教记录=[]`，未保留 AI 写入的公开凝视/跪下看鞋结算。

阶段结论：

- 阶段 T 的防破坏目标达成：额外模型第二变量块不再把字段打成 `null` 或缺失。
- 但当前实现过于偏向“阻止重复关键路径”，导致第二变量块里更完整的业务落账被丢弃；第一变量块中的部分业务命令没有最终体现到 latest MVU。
- 因此当前闭环状态是：AI 叙事承接通过、队列清空通过、字段安全完整性通过、业务后果账本未通过。

下一步修复方向：

1. 将 sanitizer 从“关键路径首写 wins”升级为“同一回复内选择最佳变量块 wins”。
2. 选择标准建议：优先选择包含 `系统.待处理交互=[]`、`系统.时间状态`、`剧情.事件记录`、P2 `牝奴.当前日课/当前命令/今日调教次数` 的变量块。
3. 对 `add /数组/-` 不应一律丢弃；应转换为稳定的 `set/insert` 或在后处理阶段合并为完整数组后 `replace`。
4. 若正文有两个变量块，优先保留“业务完整度更高”的块，而不是简单保留第一块。
5. 补一个命令组级别测试：两组变量命令同时出现时，第二组如果业务字段更完整，应保留第二组关键路径，丢弃第一组重复关键路径。
### 阶段 W：变量块择优 sanitizer 修复

状态：代码完成，待实机重新加载后验收

本阶段目标：

- 修复阶段 V 暴露的问题：旧 sanitizer 使用“关键路径第一次写入 wins”，能防破坏，但会丢掉后续更完整的业务落账。
- 将策略升级为“同一批 MVU 命令中选择业务完整度最高的变量块”。

根因：

- 最新回复中仍有两个 `<UpdateVariable>`。
- 第一块能清空队列，但业务字段不完整。
- 第二块包含更完整的 `系统.时间状态`、`剧情.事件记录`、P2 `牝奴.当前日课/当前命令/今日调教次数` 等落账字段。
- 旧 sanitizer 以第一块为准，导致最终 MVU 只保住安全默认结构，没有保住业务后果账本。

本阶段修复：

- `mvuCommandSanitizer.ts` 新增命令组评分策略：
  - 遇到重复 `系统.当前场景` 时推断进入下一组变量块。
  - 对每组命令按业务字段加权评分。
  - 高权重字段包括：`系统.时间状态`、`剧情.事件记录`、`牝奴.当前日课`、`牝奴.当前命令`、`牝奴.今日调教次数`、`系统.待处理交互`。
  - 选择得分最高的命令组落账。
  - 非选中组标记为 `weaker_command_group` 并丢弃。
- 组内重复关键路径不再简单保留第一条：
  - 对 `null`、空数组、空对象、空字符串降低信息量评分。
  - 对更具体的文本、对象、数组保留更高分版本。
- `insert/add` 安全策略细化：
  - 仍默认拦截不稳定 `insert/add`。
  - 但允许已知账本数组的尾部追加：`牝奴.调教记录`、`剧情.事件记录`、`系统.风声列表`、`系统.心音回响`。
  - 这样 `add /牝奴/调教记录/-` 被 MVU 转成 `insert` 后不会再被一刀切丢掉。
- 诊断输出扩展：
  - `CommandSanitizerDiagnostics` 新增 `selectedGroupIndex`，方便调试面板显示本轮选择了第几组变量命令。

测试留痕：

- 新增红灯：后一组变量块业务字段更完整时，旧实现仍保留前一组弱字段，测试失败。
- 新增红灯：安全 P2 调教记录尾部追加被旧实现丢弃，测试失败。
- 绿灯后：`mvuCommandSanitizer.test.ts` 通过，5 tests pass。
- 相关回归：`npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，4 files / 109 tests pass。
- 已重建 `dist/backend_validate.js` 并修补 lodash import 为 `const _2 = window._;`。
- 产物确认包含 `SAFE_APPEND_PATHS`、`selectedGroupIndex`、`weaker_command_group`。
- `git diff --check` 未发现空白错误；仅有既有 CRLF/LF 换行转换警告。

下一步验收：

1. 需要重新加载 SillyTavern 角色脚本，使新版 `dist/backend_validate.js` 进入页面。
2. 验收 `window.__HEHUAN_MVU_COMMAND_SANITIZER_LAST__` 后续应出现 `selectedGroupIndex`。
3. 再触发一次 P2 羞名风声/日课闭环。
4. 期待结果：即使正文仍有两个 `<UpdateVariable>`，sanitizer 应选择业务完整度更高的一组，latest MVU 应保留 `系统.时间状态`、`剧情.事件记录`、P2 `牝奴.当前日课/当前命令/今日调教次数/调教记录`。
### 阶段 X：group_scoring_v1 实机加载验收

状态：通过，等待新一轮 P2 闭环触发

本阶段目标：

- 将阶段 W 的变量块择优版 sanitizer 重新加载到 SillyTavern 实机页面。
- 避免旧版 sanitizer 与新版 sanitizer 混淆。

处理过程：

- 初次检查发现当前页面仍是旧运行态：`__HEHUAN_MVU_COMMAND_SANITIZER_LAST__` 里没有 `selectedGroupIndex`，并保留上一轮 `disallowed_command_type` 诊断。
- 为避免空诊断无法区分版本，新增诊断标识：`strategy: group_scoring_v1`。
- 同步更新源码初始诊断对象与 `sanitizeMvuCommands()` 返回值。
- 重新运行相关测试并重建 `dist/backend_validate.js`。
- 再次通过 CDP 执行 `Page.reload({ ignoreCache: true })`。

验证结果：

- 相关回归通过：4 files / 109 tests pass。
- dist 产物确认包含：`group_scoring_v1`、`selectedGroupIndex`、`weaker_command_group`。
- 实机脚本 iframe 复查：
  - `sanitizerType=object`
  - `sanitizer.strategy=group_scoring_v1`
  - `scanned=0`、`kept=0`、`dropped=0`
  - `promptSnapshotType=function`
  - `mvuType=object`
  - latest MVU 存在，`pendingCount=0`，当前场景为 `听风廊`

阶段结论：

- 变量块择优版 sanitizer 已进入实机页面。
- 下一轮变量解析事件后，应能通过 `selectedGroupIndex` 和 `weaker_command_group` 判断是否选择了业务完整度更高的变量块。
- 下一步需要再次触发 P2 羞名风声/日课闭环，并验收 latest MVU 是否真正保留时间状态、事件记录和 P2 日课命令账本。
### 阶段 Y：group_scoring_v1 新楼层实机验收

状态：未通过，定位到分组边界不足

触发结果：

- 最新 AI 回复仍包含 2 个 `<UpdateVariable>` 与 2 个 `<JSONPatch>`。
- sanitizer 已是新版：`strategy=group_scoring_v1`。
- 本轮诊断：`scanned=19`，`kept=15`，`dropped=4`。
- latest MVU 仍未保留业务账本：
  - `系统.时间状态` 仍为默认值。
  - `剧情.事件记录=[]`。
  - `牝奴.当前日课=候命`。
  - `牝奴.调教记录=[]`。

关键新证据：

- sanitizer 诊断没有 `selectedGroupIndex`，也没有 `weaker_command_group`。
- 说明命令组评分策略已经加载，但分组器没有把两个变量块切开。
- 最新回复结构是：
  - 第一块先写 `系统.当前追查风声ID`、`系统.待处理交互=[]`、`系统.时间状态/最近耗时`、`牝奴.当前日课`、`剧情.事件记录 add`。
  - 第二块从 `系统.当前场景` 开始，随后写完整 `系统.时间状态`、`系统.待处理交互=[]`、`牝奴.当前日课`、`剧情.事件记录 insert`。
- 旧分组边界只识别“重复出现 `系统.当前场景`”，但本轮第一块没有完整 `系统.当前场景`，所以两块被误当作同一组。

阶段结论：

- `group_scoring_v1` 已运行，但分组边界规则不足。
- 需要识别“一个变量块已经清队列收束后，又出现新的 `系统.当前场景`”作为第二变量块开始。

### 阶段 Z：收束后新场景分组边界修复

状态：代码完成，待实机重新加载后验收

本阶段修复：

- `mvuCommandSanitizer.ts` 新增 `CLOSURE_PATHS`：`系统.待处理交互`、`/系统/待处理交互`。
- 分组器新增 `currentGroupHasClosure` 状态：
  - 当前组一旦出现清队列闭环信号，就标记该组已经收束。
  - 如果之后再遇到 `系统.当前场景` 或 `/系统/当前场景`，即使不是重复路径，也开启新命令组。
- 这样可以覆盖阶段 Y 的真实输出形态：第一变量块局部收束，第二变量块从完整场景更新开始。

测试留痕：

- 新增红灯：`starts a new group when a completed closure block is followed by a fresh scene update`。
- 红灯表现：旧实现 `selectedGroupIndex` 为 `undefined`，没有切开变量块。
- 绿灯后：`mvuCommandSanitizer.test.ts` 通过，6 tests pass。
- 相关回归：`npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，4 files / 110 tests pass。
- 已重建 `dist/backend_validate.js` 并修补 lodash import 为 `const _2 = window._;`。
- 产物确认包含 `currentGroupHasClosure`、`group_scoring_v1`、`selectedGroupIndex`。
- `git diff --check` 未发现空白错误；仅有既有 CRLF/LF 换行转换警告。

下一步验收：

1. 重新加载 SillyTavern 角色脚本，使新版 `dist/backend_validate.js` 进入页面。
2. 再触发一次 P2 羞名风声/日课闭环。
3. 期待 sanitizer 诊断出现 `selectedGroupIndex=1` 或至少出现 `weaker_command_group`。
4. 验收 latest MVU 是否保留：`系统.时间状态`、`剧情.事件记录`、`牝奴.当前日课`、`牝奴.调教记录`。
### 阶段 AA：阶段 Z 新版脚本实机加载验收

状态：通过，等待下一轮 P2 闭环触发

本阶段目标：

- 将阶段 Z 的 `currentGroupHasClosure` 分组边界修复加载到 SillyTavern 实机页面。
- 确保下一轮不是用旧运行态验证。

验收过程：

- 通过 CDP 执行 `Page.reload({ ignoreCache: true })`。
- 等待角色/MVU 脚本重新挂载。
- 复查脚本 iframe 状态。

实机结果：

- `sanitizerType=object`。
- `sanitizer.strategy=group_scoring_v1`。
- 初始诊断：`scanned=0`、`kept=0`、`dropped=0`、`droppedCommands=[]`。
- `promptSnapshotType=function`。
- `mvuType=object`。
- latest MVU 存在。
- `pendingCount=0`。
- 当前场景为 `听风廊`。

阶段结论：

- 阶段 Z 新版脚本已进入实机页面。
- 下一轮 P2 闭环验收应重点查看是否出现 `selectedGroupIndex` 或 `weaker_command_group`，并确认业务账本是否真正落入 latest MVU。
### 阶段 AB：收束后新场景分组实机验收

状态：部分通过，切组成功但评分选错

触发结果：

- 最新回复仍包含 2 个 `<UpdateVariable>` 与 2 个 `<JSONPatch>`。
- sanitizer 运行策略：`strategy=group_scoring_v1`。
- 本轮诊断：`scanned=17`、`kept=12`、`dropped=5`。
- 本轮已出现 `selectedGroupIndex=0` 与 `weaker_command_group`。

阶段进展：

- 阶段 Z 的分组边界修复生效：两个变量块已经被切开。
- 被丢弃的 `weaker_command_group` 来自第二组，说明当前评分选择了第一组。

未通过点：

- 最新 MVU 仍未保留业务账本：
  - `系统.时间状态` 仍为默认值。
  - `剧情.事件记录=[]`。
  - `牝奴.当前日课=候命`。
  - `牝奴.调教记录=[]`。
- 第二组包含完整 `系统.时间状态`，但被第一组大量零散 `系统.场景上下文.*` 子字段在评分上压过。

阶段结论：

- 问题已从“分组失败”推进为“评分权重失败”。
- 下一步需要提高完整核心对象权重，降低零散子路径噪声权重。

### 阶段 AC：完整时间状态优先评分修复

状态：代码完成，待实机重新加载后验收

本阶段修复：

- `mvuCommandSanitizer.ts` 调整评分规则：
  - 完整 `系统.时间状态` 权重从 12 提升到 40。
  - 完整 `剧情.事件记录` 权重从 12 提升到 40。
  - 完整 `系统.场景上下文` 增加权重 14。
  - 零散 `系统.场景上下文.*` 子路径降权，单条最高 4 分。
  - 零散 `系统.时间状态.*` 子路径降权，单条最高 9 分。
- 目标：防止一堆低价值局部字段压过完整世界运行账本对象。

测试留痕：

- 新增红灯：`prefers a full time-state group over a noisy partial scene-context group`。
- 红灯表现：旧评分选择 `selectedGroupIndex=0`，即第一组零散场景字段。
- 绿灯后：`mvuCommandSanitizer.test.ts` 通过，7 tests pass。
- 相关回归：`npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，4 files / 111 tests pass。
- 已重建 `dist/backend_validate.js` 并修补 lodash import 为 `const _2 = window._;`。
- 产物确认包含 `group_scoring_v1`、`selectedGroupIndex`。
- `git diff --check` 未发现空白错误；仅有既有 CRLF/LF 换行转换警告。

下一步验收：

1. 重新加载 SillyTavern 角色脚本，使阶段 AC 新版 `dist/backend_validate.js` 进入页面。
2. 再触发一次 P2 羞名风声/移动/日课闭环。
3. 期待 sanitizer 诊断选择完整账本组：通常应出现 `selectedGroupIndex=1`。
4. 验收 latest MVU 是否保留完整 `系统.时间状态`，并继续观察 `剧情.事件记录`、P2 牝奴账本是否落入。
### 阶段 AD：可信命令后置补写核心账本字段

状态：代码完成，待实机重新加载后验收

本阶段目标：

- 修复阶段 AC 实机验收后暴露的剩余问题：sanitizer 已经选中完整账本组，且 `系统.场景上下文`、`系统.风声列表` 能落入 MVU，但同组选中的完整 `系统.时间状态` 仍被最终 latest MVU 恢复为默认值。
- 目标不是扩大提示词，而是在后端校验链路里补上“可信命令重放”防线。

关键证据：

- 实机诊断显示：`selectedGroupIndex=1`，第一组被标记为 `weaker_command_group`。
- 第二组中的 `系统.场景上下文`、`系统.风声列表` 已落入 latest MVU。
- 第二组中的完整 `系统.时间状态` 未落入，latest 仍为默认 `{ 当前日:1, 时段进度:0, 最近耗时:'', 最近事件类型:'' }`。
- 因此问题不再是“选错变量块”，而是“选中命令中的核心账本字段在 MVU 应用/校验链路中丢失”。

本阶段修复：

- `mvuCommandSanitizer.ts` 扩展 `CommandSanitizerDiagnostics`：
  - 新增 `keptCommands`，记录 sanitizer 最终保留下来的可信命令快照。
- 新增 `applySanitizedCommandFallback(newData, diagnostics)`：
  - 只重放 `strategy=group_scoring_v1` 且来自 `keptCommands` 的命令。
  - 只补写核心账本白名单字段：`系统.时间状态`、`剧情.事件记录`、`牝奴.当前日课`、`牝奴.当前支配者`、`牝奴.当前命令`、`牝奴.今日调教次数`、`牝奴.最近调教结算`、`牝奴.调教记录`。
  - 不重放任意字段，避免把 sanitizer 变成第二套任意 patch 引擎。
- `index.ts` 在 `VARIABLE_UPDATE_ENDED` 中接入 fallback：
  - `validateVariables()` 前执行一次，防止缺字段被默认迁移覆盖。
  - `validateVariables()` 后再执行一次，防止校验链把可信核心账本字段恢复成默认值。

测试留痕：

- 新增红灯：`replays trusted selected commands into core ledger fields when MVU misses them`。
- 红灯表现：`applySanitizedCommandFallback is not a function`。
- 绿灯后：`mvuCommandSanitizer.test.ts` 通过，8 tests pass。
- 相关回归：`npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，4 files / 112 tests pass。
- 已重建 `dist/backend_validate.js` 并修补 lodash import 为 `const _2 = window._;`。
- 产物确认包含 `applySanitizedCommandFallback`、`keptCommands`、`group_scoring_v1`。
- `git diff --check` 未发现空白错误；仅有既有 CRLF/LF 换行转换警告。

下一步验收：

1. 重新加载 SillyTavern 角色脚本，使阶段 AD 新版 `dist/backend_validate.js` 进入页面。
2. 触发新楼层，优先使用会写完整 `系统.时间状态` 的移动/探索/日课闭环。
3. 验收 sanitizer 是否出现 `keptCommands`。
4. 验收 latest MVU 是否保留 `系统.时间状态.最近耗时/最近事件类型/时段进度`，并继续观察 `剧情.事件记录` 与 P2 账本字段。
### 阶段 AE：阶段 AD 后置补写脚本实机加载验收

状态：通过，等待下一轮新楼层触发

本阶段目标：

- 确认阶段 AD 的 `keptCommands` 与 `applySanitizedCommandFallback` 版本已经进入 SillyTavern 实机脚本 iframe。

实机结果：

- `sanitizerType=object`。
- `sanitizer.strategy=group_scoring_v1`。
- `sanitizer.keptCommands=[]`。
- `hasKeptCommands=true`。
- `promptSnapshotType=function`。
- `validateHookType=function`。
- `mvuType=object`。
- latest MVU 存在。
- `pendingCount=0`。
- 当前场景为 `外门广场`。
- 当前 `系统.时间状态` 仍为旧默认值，这是阶段 AD 要在下一轮变量解析后验证的目标。

阶段结论：

- 后置补写核心账本字段的新版脚本已加载成功。
- 下一轮新楼层应重点验收：sanitizer 是否记录非空 `keptCommands`，以及 latest MVU 是否保留 `系统.时间状态.最近耗时/最近事件类型/时段进度`。
### 阶段 AF：阶段 AD 后置补写实机验收

状态：部分通过，事件记录落账成功，时间状态子路径仍未落账

触发方式：

- 用户发送：`顺着苦味药粉继续往药庐方向走，留意路上还有没有新的线索。`
- AI 生成新楼层。

实机结果：

- 最新回复仍包含 2 个 `<UpdateVariable>` 与 2 个 `<JSONPatch>`。
- sanitizer 诊断已包含 `keptCommands`，说明阶段 AD 脚本生效。
- 本轮诊断：`scanned=14`、`kept=8`、`dropped=6`、`selectedGroupIndex=0`。
- `keptCommands` 非空，包含：
  - `系统.场景上下文`
  - `系统.当前场景`
  - `系统.时间状态.最近耗时`
  - `系统.时间状态.最近结算原因`
  - `系统.时间状态.最近事件类型`
  - `剧情.事件记录`
  - `系统.当前追查风声ID`
  - `系统.待处理交互`

通过项：

- `剧情.事件记录` 已成功落入 latest MVU。
- `系统.场景上下文` 已成功落入 latest MVU。
- `系统.当前场景=药庐`。
- `系统.待处理交互=[]`。

未通过项：

- `系统.时间状态` 仍为默认值：`最近耗时=''`、`最近结算原因=''`、`最近事件类型=''`、`时段进度=0`。
- 原因：本轮可信命令是 `系统.时间状态.最近耗时/最近结算原因/最近事件类型` 这些子路径，而阶段 AD fallback 白名单只允许完整 `系统.时间状态`，没有允许可信时间状态子路径。

阶段结论：

- 后置补写机制方向正确，已证明能让 `剧情.事件记录` 这种核心账本落入。
- 剩余问题收窄为：需要允许可信时间状态子路径后置补写。

### 阶段 AG：可信时间状态子路径后置补写修复

状态：代码完成，待实机重新加载后验收

本阶段修复：

- `mvuCommandSanitizer.ts` 的 `FALLBACK_PATHS` 增加可信时间状态子路径：
  - `系统.时间状态.最近耗时`
  - `系统.时间状态.最近结算原因`
  - `系统.时间状态.最近事件类型`
  - `系统.时间状态.时段进度`
  - `系统.时间状态.是否过夜`
  - 同时支持 `/系统/时间状态/...` JSON Pointer 形式。
- 仍不放开任意路径，只补世界运行核心时间账本字段。

测试留痕：

- 新增红灯：`replays trusted time-state subpath commands when MVU misses them`。
- 红灯表现：可信命令里的 `最近耗时/最近结算原因/最近事件类型` 未补写，latest 模拟数据仍为空字符串。
- 绿灯后：`mvuCommandSanitizer.test.ts` 通过，9 tests pass。
- 相关回归：`npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，4 files / 113 tests pass。
- 已重建 `dist/backend_validate.js` 并修补 lodash import 为 `const _2 = window._;`。
- 产物确认包含 `applySanitizedCommandFallback`、`keptCommands`、时间状态子路径白名单。
- `git diff --check` 未发现空白错误；仅有既有 CRLF/LF 换行转换警告。

下一步验收：

1. 重新加载 SillyTavern 角色脚本，使阶段 AG 新版 `dist/backend_validate.js` 进入页面。
2. 再触发一条包含时间状态子路径或完整时间状态的移动/探索楼层。
3. 验收 latest MVU 中 `系统.时间状态.最近耗时/最近结算原因/最近事件类型` 是否保留。

### 阶段 AH：path_scoring_v2 路径级择优策略升级

状态：代码完成，待实机重新加载后验收

本阶段目标：

- 回应实机新证据与用户建议：不再从两个 `<UpdateVariable>` 变量块中整块二选一，而是把两个变量块拆成命令候选池，按变量路径逐条评分录用。
- 解决互补变量块问题：第一块可能有 `剧情.事件记录`，第二块可能有完整 `系统.时间状态`，整块选择会必然丢失一部分可靠账本。

关键设计：

- sanitizer 策略从 `group_scoring_v1` 升级为 `path_scoring_v2`。
- 每条命令按路径进入候选池，相同路径只保留评分最高的一条。
- 允许核心路径跨变量块合成：`系统.时间状态`、`系统.时间状态.*`、`剧情.事件记录`、`系统.场景上下文`、`系统.待处理交互`、P2 牝奴核心账本等。
- 不再录用任意副作用路径：例如 `NPC.*.好感度`、心声状态、灵石、剩余天数等未在白名单内的路径会标记为 `untrusted_path` 或继续按 `disallowed_command_type` 丢弃。
- 完整 `系统.场景上下文` 存在时，丢弃零散 `系统.场景上下文.*` 子路径，避免噪声覆盖完整对象。
- 完整 `系统.时间状态` 与 `系统.时间状态.*` 可共存，并按父路径先、子路径后顺序应用，用完整对象打底、子字段补细节。
- `keptCommands` 诊断改为显式快照 `type/full_match/args`，修复 CDP 中命令对象显示 `{}` 的可观测性问题。
- `index.ts` 初始诊断策略同步改为 `path_scoring_v2`，避免刷新后空诊断误判为旧版本。

测试留痕：

- 新增/调整用例覆盖：跨变量块保留第一块 `剧情.事件记录` 与第二块完整 `系统.时间状态`，同时不回放 `NPC.苏芸.好感度 +2` 这类副作用。
- `mvuCommandSanitizer.test.ts` 通过，10 tests pass。
- 相关回归：`npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，4 files / 114 tests pass。
- 已重建 `dist/backend_validate.js` 并修补 lodash import 为 `const _2 = window._;`。
- 产物确认包含 `path_scoring_v2`，且未再出现 `group_scoring_v1` / `ledgerFallbackCommands`。

下一步验收：

1. 通过 CDP 刷新 SillyTavern 页面，使新版 `dist/backend_validate.js` 进入脚本 iframe。
2. 复查 `window.__HEHUAN_MVU_COMMAND_SANITIZER_LAST__.strategy === "path_scoring_v2"`。
3. 再触发新楼层，验收 `keptCommands` 是否同时保留不同变量块中的核心账本字段。
4. 验收 latest MVU 是否同时保留 `系统.时间状态.时段进度/最近耗时/最近结算原因/最近事件类型` 与 `剧情.事件记录`，且不因额外模型解析输出误增副作用。

### 阶段 AI：path_scoring_v2 实机加载验收

状态：通过，等待下一轮新楼层触发

本阶段目标：

- 确认路径级择优版 sanitizer 已经进入 SillyTavern 实机脚本 iframe，而不是仅停留在源码与 dist 产物。

实机结果：

- 通过 CDP 执行 `Page.reload({ ignoreCache: true })`，等待约 15 秒后复查。
- `node cdp-v4-mvu-check.mjs --port 9222 --json` 通过。
- 新脚本 iframe contextId 为 `313`，后端校验 hook `__TEST_applyValidatedUpdate` 可用。
- `window.__HEHUAN_MVU_COMMAND_SANITIZER_LAST__` 显示：
  - `strategy=path_scoring_v2`
  - `scanned=0`
  - `kept=0`
  - `dropped=0`
  - `selectedPathCount=0`
  - `keptCommands=[]`
- latest MVU 存在，当前场景仍为 `药庐`，待处理交互为空，事件记录保留上一轮 `药庐线索`。

说明：

- 刷新后 sanitizer 初始诊断为空是正常现象，说明新版脚本已加载但尚未经历新的 `COMMAND_PARSED`。
- 当前 latest 的 `系统.时间状态` 仍是旧楼层遗留空值；必须等下一次 AI 回复产生变量命令后，才能验证 `path_scoring_v2` 是否同时保留完整时间状态与事件记录。

下一步验收：

1. 用户触发下一条移动/探索/对话楼层，最好让 AI 继续药庐线索并自然写出时间流逝。
2. 读取 sanitizer 诊断，期望 `strategy=path_scoring_v2` 且 `scanned > 0`、`keptCommands` 可读。
3. 验收 `keptCommands` 是否跨变量块录用：完整 `系统.时间状态`、`剧情.事件记录`、`系统.待处理交互=[]`。
4. 验收 latest MVU 是否保留 `系统.时间状态.时段进度/最近耗时/最近结算原因/最近事件类型` 与 `剧情.事件记录`。

### 阶段 AJ：path_scoring_v2 新楼层实机验收与事件账本保留修复

状态：时间状态通过，事件账本保留规则代码完成，待下一轮变量更新验收

本阶段目标：

- 验收 `path_scoring_v2` 在用户新楼层中的真实表现。
- 追踪 `剧情.事件记录` 是否仍会被清空，并补上后果账本不可沉默回退的校验防线。

实机验收结果：

- 用户触发新楼层后，`node cdp-v4-mvu-check.mjs --port 9222 --json` 通过。
- latest 场景更新为 `外门广场至药庐小径`，时辰为 `午时`，待处理交互为 `[]`。
- sanitizer 运行结果：
  - `strategy=path_scoring_v2`
  - `scanned=16`
  - `kept=8`
  - `dropped=8`
  - `selectedPathCount=11`
- `keptCommands` 已可读，并保留：
  - `系统.待处理交互=[]`
  - 完整 `系统.时间状态`
  - `系统.时辰=午时`
  - `系统.当前场景=外门广场至药庐小径`
  - 完整 `系统.场景上下文`
  - `系统.时间状态.最近耗时/最近结算原因/最近事件类型`
- latest `系统.时间状态` 已成功落账：
  - `当前日=1`
  - `时段进度=1`
  - `最近耗时=一刻钟内`
  - `最近结算原因=普通对话不推进时辰`
  - `最近事件类型=对话`
  - `是否过夜=false`
- sanitizer 正确拦截副作用：
  - `NPC.苏芸.好感度 +3` 因 `disallowed_command_type` 丢弃。
  - `NPC.苏芸.心声探测态`、`系统.当前聚焦心声NPC`、`系统.心音回响` 因 `untrusted_path` 丢弃。
  - 零散 `系统.场景上下文.*` 因 `covered_by_full_scene_context` 丢弃。

新发现问题：

- 本轮变量命令中完全没有 `剧情.事件记录` 路径，sanitizer 没有丢弃事件记录。
- 但 latest `剧情.事件记录` 从上一轮 1 条变成 `[]`。
- 根因是校验层只在字段缺失/非法时补空数组，没有“旧事件账本存在，新楼层未写事件时保留旧账本”的防线。

本阶段修复：

- `validate.ts` 新增 `mergeEventLedger(new_data, old_data)`。
- 校验开头先执行 v4 默认结构补齐，再执行事件账本合并。
- 合并规则：
  - 旧事件与新事件按 `id` 去重合并。
  - 新事件同 id 可覆盖旧事件。
  - 新楼层没写事件或写空数组时，旧事件账本会保留。
  - 最多保留最近 20 条，与 schema 上限一致。

测试留痕：

- 新增红灯：新楼层未写事件记录时保留旧的世界后果账本。
- 新增红灯：新楼层写入新事件时按 id 合并旧账本并保留最近 20 条。
- 红灯表现：旧实现会把事件记录变为 `[]`，或只保留新事件两条。
- 绿灯后：`validate.test.ts` 通过，76 tests pass。
- 相关回归：`npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，4 files / 116 tests pass。
- 已重建 `dist/backend_validate.js` 并修补 lodash import 为 `const _2 = window._;`。
- 产物确认包含 `mergeEventLedger` 与 `path_scoring_v2`。

下一步验收：

1. 刷新 SillyTavern 页面，使包含 `mergeEventLedger` 的新版 `dist/backend_validate.js` 进入脚本 iframe。
2. 下一楼层后验收：即使 AI 没有写 `剧情.事件记录`，旧事件记录也不应被清空。
3. 如果 AI 写入新事件，验收 old+new 是否按 id 合并并保留最近 20 条。

### 阶段 AK：事件账本保留规则实机复验

状态：等待下一轮新楼层触发

本阶段目标：

- 验证阶段 AJ 的 `mergeEventLedger` 在真实 SillyTavern 变量更新链路中生效。
- 重点不是再验证 `path_scoring_v2`，而是确认“AI 漏写事件记录或写空数组时，旧世界后果账本不会被清空”。

当前基线：

- 新版脚本已通过 CDP 刷新加载。
- 当前后端脚本 contextId 为 `340`。
- `window.__HEHUAN_MVU_COMMAND_SANITIZER_LAST__.strategy=path_scoring_v2`。
- 后端校验 hook `__TEST_applyValidatedUpdate` 可用。
- 当前 latest `系统.时间状态` 已落账：`时段进度=1`、`最近耗时=一刻钟内`、`最近事件类型=对话`。
- 当前 latest `剧情.事件记录.length=0`，因为上一轮在修复前已经被清空；本阶段不追溯恢复旧事件，只验证后续不再沉默丢失。

实机验收口径：

1. 触发下一条自然新楼层，优先继续药庐小径/苏芸金珠线索。
2. 读取 sanitizer：期望 `strategy=path_scoring_v2`、`scanned>0`，副作用路径仍被拦截。
3. 读取 latest：
   - `系统.时间状态` 应继续保留最近耗时、结算原因、事件类型与时段进度。
   - 如果 AI 写入 `剧情.事件记录`，应能看到新事件入账。
   - 如果 AI 未写事件或写空数组，已有事件记录不得被清空。
4. 若仍出现事件账本丢失，需要追踪 `old_variables.stat_data.剧情.事件记录` 在 `VARIABLE_UPDATE_ENDED` 进入校验前是否已经为空。

### 阶段 AL：安全账本 append fallback 修复

状态：代码完成并已加载实机，等待下一轮新楼层复验

本阶段目标：

- 修复阶段 AK 实机复验暴露的新断点：sanitizer 已经录用 `insert 剧情.事件记录 '-'`，但 latest `剧情.事件记录` 仍为空。
- 目标是让可信的安全账本追加命令在 MVU 漏吃时也能通过 fallback 写回。

实机证据：

- 本轮 sanitizer：
  - `strategy=path_scoring_v2`
  - `scanned=12`
  - `kept=9`
  - `dropped=3`
  - `selectedPathCount=8`
- `keptCommands` 中包含可信安全追加：
  - `type=insert`
  - `path=剧情.事件记录`
  - `index='-'`
  - 事件 id：`event_1_午时_苏芸口谕`
- latest 中时间状态与场景上下文均通过：
  - `系统.时间状态.时段进度=1`
  - `最近耗时=一刻钟内`
  - `最近事件类型=对话`
  - 当前场景为 `药庐`
- latest `剧情.事件记录=[]`，说明问题不在 sanitizer 录用，而在 fallback 未处理安全 append。

根因：

- `applySanitizedCommandFallback()` 之前只回放 `set` 命令。
- `剧情.事件记录` 被 MVU 解析成安全 `insert ... '-'` 后，即使 sanitizer 已录用，fallback 也不会补写。

本阶段修复：

- `mvuCommandSanitizer.ts` 新增 `appendByPath()`。
- `applySanitizedCommandFallback()` 支持回放 `isSafeAppendCommand(command)`：
  - 只允许 `SAFE_APPEND_PATHS` 白名单内的账本数组。
  - 只允许尾部追加 `'-'`。
  - 只追加到数组，不执行任意 patch。
- 当前白名单仍限定在：
  - `剧情.事件记录`
  - `牝奴.调教记录`
  - `系统.风声列表`
  - `系统.心音回响`

测试留痕：

- 新增红灯：`replays trusted safe append commands into event ledger when MVU misses them`。
- 红灯表现：`剧情.事件记录` 仍为 `[]`。
- 绿灯后：`mvuCommandSanitizer.test.ts` 通过，11 tests pass。
- 相关回归：`npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts` 通过，4 files / 117 tests pass。
- 已重建 `dist/backend_validate.js` 并修补 lodash import 为 `const _2 = window._;`。
- 产物确认包含 `appendByPath`、`mergeEventLedger`、`path_scoring_v2`。
- 通过 CDP 刷新实机页面，新后端脚本 contextId 为 `367`，后端校验 hook 可用。

下一步验收：

1. 用户再触发一条新楼层，最好让 AI 写入 `剧情.事件记录 insert`。
2. 验收 `keptCommands` 中的安全 append 是否进入 latest `剧情.事件记录`。
3. 验收 `mergeEventLedger` 是否继续保留旧事件并按 id 合并。

### 阶段 AM：安全 append 实机复验

状态：等待下一轮新楼层触发

本阶段目标：

- 验证阶段 AL 的 `appendByPath()` 在真实 SillyTavern 变量更新链路中生效。
- 重点看 sanitizer 已录用的 `insert 剧情.事件记录 '-'` 是否能通过 fallback 进入 latest `剧情.事件记录`。

当前基线：

- 新版 `dist/backend_validate.js` 已加载到实机。
- 当前后端脚本 contextId 为 `367`。
- `path_scoring_v2`、`mergeEventLedger`、`appendByPath` 均已进入产物。
- 后端相关回归为 4 files / 117 tests pass。

实机验收口径：

1. 用户触发下一条自然新楼层，优先继续 `苏芸口谕 -> 酉时阴阳池擦玉阶` 线索。
2. 读取 sanitizer：期望 `strategy=path_scoring_v2`、`scanned>0`。
3. 如果 `keptCommands` 出现 `type=insert` 且 `path=剧情.事件记录`，latest `剧情.事件记录` 必须出现对应事件。
4. 如果 AI 没写事件记录，则验收现有事件账本不被清空。
5. 同时复查时间状态继续落账，副作用路径继续被拦截。

本轮实机结果：

- 用户已触发新楼层，latest 场景更新为 `阴阳池外围`，场景上下文为 `阴阳池 / 外围玉阶`。
- sanitizer 运行结果：
  - `strategy=path_scoring_v2`
  - `scanned=17`
  - `kept=8`
  - `dropped=9`
  - `selectedPathCount=15`
- 时间状态继续可靠落账：
  - `当前日=1`
  - `时段进度=1`
  - `最近耗时=一个时辰`
  - `最近结算原因=移动并观察阴阳池地形，等待酉时`
  - `最近事件类型=移动与观察`
  - `是否过夜=false`
- 场景上下文完整落账：
  - `地点=阴阳池`
  - `子区域=外围玉阶`
  - `公开度=半私密`
  - `故事钩子=等待酉时苏芸到来 / 观察玉阶地形`
- 副作用/危险清空拦截通过：
  - `系统.风声列表=[]` 被标记为 `untrusted_path` 丢弃，旧风声 `rumor_yaolu_spill_001` 未被清空。
  - 零散 `系统.场景上下文.*` 被完整 `系统.场景上下文` 覆盖丢弃。

未覆盖项：

- 本轮 AI 没有写 `剧情.事件记录`，因此没有出现 `insert 剧情.事件记录 '-'`。
- latest `剧情.事件记录` 仍为 `[]`，这是上一轮修复前已被清空后的基线；本轮无法验证 `appendByPath()` 的真实写入效果。

阶段结论：

- 时间系统、场景上下文、风声防清空、路径级择优策略均通过实机验证。
- 安全 append fallback 的代码和单测已通过，但仍需要一轮 AI 实际写入 `剧情.事件记录 insert` 的楼层来完成实机闭环。

下一步建议：

1. 增强动态注入/提示约束：凡发生移动、任务接取、NPC口谕、风声追查、P2日课等事件，必须写 `剧情.事件记录`。
2. 或先继续触发一条明确“接受酉时阴阳池任务并记录下来”的楼层，用于实机验证 `appendByPath()`。

### 阶段 AN：世界运行常驻账本提示技术验证

状态：技术验证通过，建议进入 TDD 实现

本阶段目标：

- 验证“队列为空时也注入轻量世界运行账本提示”的可行性。
- 解决阶段 AM 暴露的问题：自然移动/对话/观察没有 `系统.待处理交互`，因此现有 `pendingActionPrompt` 不会注入，AI 容易漏写 `剧情.事件记录`。

现有链路核查：

- `narrativePromptRuntime.ts` 当前只组合三类提示：
  - `buildOutfitPrompt(data)`
  - `buildContrabandPrompt(data)`
  - `buildPendingActionPrompt(data)`
- `pendingActionPrompt.ts` 只有在 `系统.待处理交互.length > 0` 时返回提示。
- 自然移动、自然观察、普通对话、NPC口谕如果没有队列，不会收到任何“必须写剧情.事件记录”的提示。
- 后端已经具备防线：
  - `path_scoring_v2` 可跨变量块择优录用核心账本。
  - `appendByPath()` 可兜底安全账本追加。
  - `mergeEventLedger()` 可保留旧事件并按 id 合并。
- 当前缺口在提示层：AI 不一定产出 `剧情.事件记录`。

可行方案：

- 新增 `worldRuntimePrompt.ts`，作为第四类叙事注入，与 outfit/contraband/pending 并列。
- 在队列为空时提供轻量常驻提示；在 pending prompt 存在时不重复注入或降级为 scan token，避免提示冲突。
- 提示不承担具体剧情，只承担变量账本约束：
  - 移动/探索/观察/NPC口谕/任务接取/风声追查/P2日课，必须追加 `剧情.事件记录`。
  - 必须同步写 `系统.时间状态`。
  - 场景变化时必须写完整 `系统.场景上下文`。
  - 使用 `add /剧情/事件记录/-` 或兼容现有 sanitizer 的安全 append 形式追加账本。

触发策略建议：

- 保守触发，不每楼无脑长提示。
- 触发条件包括任一项：
  - `系统.当前场景` 存在且 `系统.场景上下文.故事钩子` 非空。
  - `系统.时间状态.最近事件类型` 为 `移动`、`探索`、`移动与观察`、`对话`、`追查线索`、`任务`、`日课`。
  - `系统.阶段=牝奴期`。
  - `系统.当前追查风声ID` 非空。
- 若 `系统.待处理交互.length > 0`，由 `pendingActionPrompt` 负责强约束，`worldRuntimePrompt` 不再输出 visible prompt，最多提供 scan token。

token 与冲突评估：

- 预计 visible prompt 控制在 250-450 字符，比 pending action 提示短。
- scan prompt 控制在 10-15 个关键词。
- 与 pending action 的冲突风险可通过“pending 优先，world runtime 退让”规避。
- 与 outfit/contraband 不冲突：服装/禁器提示只管叙事锚点，不直接改变量；world runtime 提示只管时间/场景/事件账本。

测试验证计划：

- 新增 `worldRuntimePrompt.test.ts`：
  - 队列为空但有场景钩子时注入。
  - 队列非空时不输出 visible，避免和 pending action 重复。
  - 提示内容必须包含 `系统.时间状态`、`剧情.事件记录`、`系统.场景上下文`。
  - 提示内容必须要求移动/探索/NPC口谕/任务接取写事件账本。
  - 普通空状态不注入，避免 token 噪声。
- 更新 `narrativePromptRuntime.test.ts`：
  - runtime 可注入 world runtime prompt。
  - clear 会卸载 world runtime prompt id。
  - snapshot 记录是否注入 world runtime prompt，便于 CDP 验收。
- 保持现有 `pendingActionPrompt.test.ts` 不退化。

实机验证计划：

1. 实现后重建 `dist/backend_validate.js` 并刷新 CDP。
2. 在无待处理队列的自然移动/观察楼层触发生成。
3. 验收 `__HEHUAN_NARRATIVE_PROMPT_SNAPSHOT__()` 出现 world runtime prompt id。
4. 验收 AI 是否更稳定写入 `剧情.事件记录`。
5. 若 AI 写入安全 append，验收 `appendByPath()` 兜底进入 latest。

技术结论：

- 可行，且是当前缺口的正确层级修复。
- 后端防线已经足够接收并保护账本；现在需要前端/提示层提高 AI 产出账本的概率和稳定性。
- 建议下一阶段按 TDD 实现 `worldRuntimePrompt.ts` 并接入 `narrativePromptRuntime.ts`。

### 阶段 AO：worldRuntimePrompt 实机产出验收

状态：等待下一轮 AI 回复触发

本阶段目标：

- 验证阶段 AN 已实现并加载的 `worldRuntimePrompt` 是否能影响真实 AI 输出。
- 重点观察自然移动/观察楼层在无 `系统.待处理交互` 时，是否会写入 `剧情.事件记录`。

当前基线：

- `worldRuntimePrompt.ts` 已实现。
- `narrativePromptRuntime.ts` 已接入第四类提示：world runtime prompt。
- 相关回归通过：5 files / 122 tests pass。
- `dist/backend_validate.js` 已重建并修补 lodash import。
- CDP 实机已确认：
  - 后端 contextId 为 `402`。
  - `__HEHUAN_NARRATIVE_PROMPT_SNAPSHOT__()` 显示 `hasWorldRuntimePrompt=true`。
  - 当前 prompt ids 包含 `hehuan-world-runtime-summary`、`hehuan-world-runtime-scan`。
  - 当前 latest 无待处理队列，但有故事钩子：`等待酉时苏芸到来`、`观察玉阶地形`。

实机验收口径：

1. 用户触发下一条自然回复，优先继续阴阳池外围/酉时等待/玉阶观察线索。
2. 回复生成后读取 sanitizer：
   - `strategy=path_scoring_v2`
   - `scanned>0`
   - 若出现 `insert 剧情.事件记录 '-'`，应被 `keptCommands` 录用。
3. 读取 latest：
   - `系统.时间状态` 应继续落账。
   - `系统.场景上下文` 应保持完整。
   - `剧情.事件记录` 应出现新事件；如果 AI 写了安全 append，`appendByPath()` 应兜底写入。
4. 复查 `系统.风声列表=[]`、NPC 好感、心声等副作用路径是否仍被拦截。

建议触发语：

```text
我沿着阴阳池外围玉阶慢慢走一圈，记下哪里最容易被苏芸看见，又听听附近有没有弟子议论酉时擦玉阶的事。
```

实机验收结果：

- 用户触发新楼层后，latest 推进到 `阴阳池 / 酉时 / 玉阶底端`。
- CDP 读取 `__HEHUAN_NARRATIVE_PROMPT_SNAPSHOT__()` 显示本次生成后的 snapshot 为空注入，但上一轮手动刷新已确认 `worldRuntimePrompt` 在无队列、有故事钩子状态下可注入。
- sanitizer 运行结果：
  - `strategy=path_scoring_v2`
  - `scanned=22`
  - `kept=10`
  - `dropped=12`
  - `selectedPathCount=18`
- `keptCommands` 包含：
  - `系统.时辰=酉时`
  - `系统.当前场景=阴阳池`
  - `系统.待处理交互=[]`
  - 完整 `系统.时间状态`
  - 完整 `系统.场景上下文`
  - `insert 剧情.事件记录 '-'`
  - `系统.时间状态.时段进度/最近耗时/最近结算原因/最近事件类型`
- latest 时间状态通过：
  - `当前日=1`
  - `时段进度=2`
  - `最近耗时=两个时辰`
  - `最近结算原因=探查地形与等待时辰到来`
  - `最近事件类型=探索`
  - `是否过夜=false`
- latest 事件账本成功出现新事件：`event_1_酉时_等待指令`。

新发现问题：

- latest `剧情.事件记录` 中同 id 事件出现 2 条。
- 根因：本轮 MVU 本身已经应用了 `insert 剧情.事件记录 '-'`，fallback 又对同一条 `keptCommands` append 执行一次，导致重复追加。

阶段结论：

- `worldRuntimePrompt` 对 AI 输出有正向效果：本轮 AI 写出了 `剧情.事件记录 insert`。
- `path_scoring_v2` 与安全 append 录用链路通过。
- 需要补 `appendByPath()` 幂等，防止 fallback 与 MVU 双写同 id 事件。

### 阶段 AP：安全 append fallback 幂等修复

状态：代码完成并已加载实机，等待下一轮新事件复验

本阶段目标：

- 修复阶段 AO 暴露的同 id 事件重复追加问题。
- 保持“MVU 漏吃安全 append 时 fallback 能补写”的能力，同时避免“MVU 已吃时 fallback 再写一次”。

本阶段修复：

- `mvuCommandSanitizer.ts` 新增 `isPlainRecord()` 本地判断，避免在 sanitizer 模块中引入 lodash 依赖。
- `appendByPath()` 在追加对象时检查 `id`：
  - 如果目标数组中已有同 id 对象，则跳过追加。
  - 如果没有 id，则仍按普通数组追加。
- 该逻辑只作用于已通过 `isSafeAppendCommand()` 的安全白名单 append。

测试留痕：

- 新增红灯：`does not duplicate trusted append commands when MVU already applied them`。
- 红灯表现：同 id 事件被追加两次。
- 绿灯后：相关回归 `npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts` 通过，4 files / 99 tests pass。
- 已重建 `dist/backend_validate.js` 并修补 lodash import 为 `const _2 = window._;`。
- 产物确认包含 `isPlainRecord`、`appendByPath`、`hehuan-world-runtime-summary`。
- 通过 CDP 刷新实机页面，新后端脚本 contextId 为 `428`，后端校验 hook 可用。

注意：

- 当前 latest 中已经存在的重复事件不会被本修复自动清理。
- 本修复从下一轮变量更新开始阻止同 id 事件被 fallback 重复追加。

下一步验收：

1. 触发下一条自然楼层，继续阴阳池/苏芸赴约线。
2. 如果 AI 继续写 `insert 剧情.事件记录 '-'`，验收 latest 中同 id 事件不再重复。
3. 验收 `mergeEventLedger()` 是否在后续楼层保留旧事件并合并新事件。

### 阶段 AQ：事件账本幂等与合并实机复验

状态：等待下一轮 AI 回复触发

本阶段目标：

- 验证阶段 AP 的 `appendByPath()` 幂等修复在真实 SillyTavern 链路中生效。
- 确认后续楼层不会再因为 MVU 与 fallback 双写导致同 id 事件重复。
- 同时复验 `mergeEventLedger()` 对旧事件的保留与新事件合并。

当前基线：

- 新版 `dist/backend_validate.js` 已通过 CDP 刷新加载。
- 当前后端脚本 contextId 为 `428`。
- 当前 latest 已有重复的 `event_1_酉时_等待指令`，这是阶段 AP 修复前留下的旧状态；本阶段不追溯清理，只验证下一轮不再新增重复。

实机验收口径：

1. 用户触发下一条自然楼层，建议继续 `阴阳池 / 苏芸赴约 / 玉阶擦洗` 线。
2. 读取 sanitizer：
   - `strategy=path_scoring_v2`
   - `scanned>0`
   - 若 `keptCommands` 出现 `insert 剧情.事件记录 '-'`，记录其事件 id。
3. 读取 latest `剧情.事件记录`：
   - 若新事件 id 已被 MVU 应用，fallback 不得再追加第二条同 id。
   - 旧事件记录不得被清空。
   - 新事件应与旧事件共存，最多保留 20 条。
4. 继续复查：
   - `系统.时间状态` 是否落账。
   - `系统.场景上下文` 是否完整。
   - `系统.风声列表=[]`、NPC 好感、心声等副作用路径是否仍被拦截。

建议触发语：

```text
我在阴阳池玉阶底端等到酉时，先把衣摆束好，准备照苏芸的口谕擦洗玉阶，同时留意她会不会从药庐方向出现。
```

实机验收结果：

- 用户触发新楼层后，latest 仍在 `阴阳池 / 酉时 / 玉阶底端`，苏芸已入场。
- sanitizer 运行结果：
  - `strategy=path_scoring_v2`
  - `scanned=16`
  - `kept=10`
  - `dropped=6`
  - `selectedPathCount=11`
- `keptCommands` 包含：
  - `系统.待处理交互=[]`
  - `系统.当前场景=阴阳池`
  - `系统.时辰=酉时`
  - 完整 `系统.时间状态`
  - 完整 `系统.场景上下文`
  - `insert 剧情.事件记录 '-'`，事件 id 为 `event_1_酉时_遭遇`
  - `insert 系统.心音回响 '-'`
  - `系统.时间状态.最近耗时/最近结算原因/最近事件类型`
- `droppedCommands` 中：
  - `NPC.苏芸.心声探测态="可窥探"` 因 `untrusted_path` 被拦截。
  - 第二条 `insert 剧情.事件记录 '-'` 因 `duplicate_critical_path` 被丢弃。
  - 零散 `系统.场景上下文.*` 因 `covered_by_full_scene_context` 被丢弃。
- latest 时间状态通过：
  - `当前日=1`
  - `时段进度=2`
  - `最近耗时=一刻钟`
  - `最近结算原因=等待并观察`
  - `最近事件类型=对话/遭遇`
  - `是否过夜=false`
- latest 场景上下文通过：
  - `地点=阴阳池`
  - `子区域=玉阶底端`
  - `在场NPC=[苏芸]`
  - `NPC活动.苏芸=踩着步摇节奏走下玉阶，逼近玩家`
- latest 事件账本通过：
  - 事件数量为 2。
  - 旧事件 `event_1_酉时_等待指令` 保留。
  - 新事件 `event_1_酉时_遭遇` 入账。
  - `duplicateIds=[]`，阶段 AP 的 append 幂等修复生效。
- 风声列表保持旧风声 `rumor_yaolu_spill_001`，未被清空。
- NPC 苏芸好感与心声探测态保持旧值，未被 AI 副作用覆盖。

阶段结论：

- `worldRuntimePrompt -> AI 产出事件账本 -> path_scoring_v2 录用 -> appendByPath 幂等兜底 -> mergeEventLedger 保留旧事件` 闭环通过。
- 时间系统、场景上下文、事件账本三件套已在自然无队列楼层中形成可靠闭环。
- 当前可进入下一阶段：复查心音回响白名单策略，或进入全量回归/文档收口。

### 阶段 AR：心音回响策略技术核查

状态：核查完成，建议进入小步修复

本阶段目标：

- 复查 `系统.心音回响` 在 schema、世界书、UI、sanitizer 与实机链路中的边界。
- 判断是否应该继续允许 AI 写入心音回响，以及是否要允许配套更新 `NPC.${NPC}.心声探测态` 和 `系统.当前聚焦心声NPC`。

现有设计核查：

- schema 已定义：
  - `系统.心音回响: 心音回响Schema[]`，最多 12 条。
  - `系统.当前聚焦心声NPC: string`。
  - `NPC.${NPC}.心声探测态: 无波动 | 可窥探 | 已捕获 | 反震 | 锁闭`。
- 世界书已有规则：
  - 命盘点击只切换 `系统.当前聚焦心声NPC`，不是剧情动作。
  - AI 每楼层可读取 `系统.场景上下文.在场NPC`，仅对在场核心 NPC 评估心声探测态。
  - 捕获、反震、锁闭时可写入 `系统.心音回响`。
  - `系统.心音回响` 最多保留最近 12 条，NPC 离场后不删除历史回响。
- UI 已使用：
  - `HomePage.vue` 显示最近心音回响，NPC 离场后仍保留记录。
  - `GalleryPage.vue` 展示心音回响档案，并支持聚焦态。
  - `DebugPanel.vue` 支持测试注入捕获/反震/锁闭心音。
- sanitizer 当前策略：
  - `SAFE_APPEND_PATHS` 允许 `系统.心音回响` 安全 append。
  - `系统.心音回响` 的完整 replace 不是 selectable，会被 `untrusted_path` 丢弃。
  - `NPC.${NPC}.心声探测态` 和 `系统.当前聚焦心声NPC` 目前不是 selectable，会被 `untrusted_path` 丢弃。

实机证据：

- 当前 latest：
  - `系统.心音回响.length=2`。
  - 已有 `echo_suyun_001`：苏芸心音已入库。
  - `NPC.苏芸.心声探测态=无波动`。
  - `系统.当前聚焦心声NPC=''`。
  - `系统.场景上下文.在场NPC=[苏芸]`。
- 阶段 AQ sanitizer 录用了 `insert 系统.心音回响 '-'`，但拦截了 `NPC.苏芸.心声探测态="可窥探"`。
- 结果是“心音回响入库，但 NPC 心声状态仍无波动、焦点为空”的半闭环。

风险判断：

- 允许任意 AI 修改所有 NPC 心声状态有风险：可能让不在场 NPC 莫名可窥探或已捕获。
- 完全拦截心声状态也有问题：心音回响已经出现，但 UI 状态不一致，玩家难以理解为什么能看到回响但命盘仍显示无波动。
- 完整 replace `系统.心音回响` 有清空历史风险，不应放开。
- 安全 append `系统.心音回响` 方向正确，但需要更严格的幂等和上限保障。

建议方案：

1. 保留 `系统.心音回响` 安全 append 白名单。
2. 不放开完整 replace `系统.心音回响`，避免 AI 清空历史心音。
3. 允许受限 `NPC.${在场NPC}.心声探测态` 更新：
   - 只允许在场核心 NPC。
   - 只允许值为 `已捕获`、`反震`、`锁闭`。
   - 不允许 AI 把状态写成 `可窥探`，因为可窥探更像前端可操作状态，不是结果状态。
4. 允许 `系统.当前聚焦心声NPC` 设置为刚刚产生心音回响的 npc；若没有对应新回响则不允许。
5. `appendByPath()` 对 `系统.心音回响` 同样按 `id` 幂等，并保留最近 12 条。

测试建议：

- sanitizer 录用 `系统.心音回响` 安全 append，但不录用完整 replace 清空。
- 同 id 心音回响不会重复追加。
- 超过 12 条时裁剪最近 12 条。
- 在同一批命令里存在 `insert 系统.心音回响` 且 npc 为苏芸时，允许 `NPC.苏芸.心声探测态="已捕获"`。
- 不在场 NPC 的 `心声探测态` 仍拦截。
- `心声探测态="可窥探"` 仍拦截。

技术结论：

- 心音回响系统可以继续保留为世界运行副账本。
- 当前 append 入库能力已可用，但状态同步不足。
- 建议进入 TDD 小步修复，重点做“回响 append + 状态结果同步 + 上限 12 + 幂等”。

### 阶段 AS：心音回响状态同步修复

状态：代码完成并已加载实机，等待下一轮新楼层复验

本阶段目标：

- 修复“心音回响已经入库，但 NPC 心声探测态与当前聚焦 NPC 没有同步”的半闭环问题。
- 保持运行时安全边界：不放开完整 `系统.心音回响` 替换，不允许 AI 任意把 NPC 写成 `可窥探`，不允许无对应心音的 NPC 状态漂移。

实现内容：

- `mvuCommandSanitizer.ts` 新增心音结果态白名单：`已捕获`、`反震`、`锁闭`。
- 新增 `getTrustedSoulEchoNpcs()`：从同一批已录用的 `insert 系统.心音回响 '-'` 命令中提取可信 NPC。
- 新增 `isTrustedSoulCompanionSet()`：只有当同批命令存在对应 NPC 的可信心音回响时，才允许：
  - `NPC.${NPC}.心声探测态 = 已捕获/反震/锁闭`
  - `系统.当前聚焦心声NPC = ${NPC}`
- `可窥探` 继续被拦截；不相关 NPC 的心声状态继续被拦截。
- `appendByPath()` 对 `系统.心音回响` 继续按 `id` 幂等追加，并保留最近 12 条。

测试覆盖：

- 同批 `系统.心音回响` append + `NPC.苏芸.心声探测态="已捕获"` + `系统.当前聚焦心声NPC="苏芸"` 会被录用并落库。
- `NPC.苏芸.心声探测态="可窥探"` 会被拦截。
- 没有对应心音 append 的其他 NPC 心声状态会被拦截。
- 心音回响 fallback append 超过 12 条时只保留最新 12 条。

验证结果：

- 回归命令通过：
  - `npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts`
  - 4 个测试文件，102 个测试通过。
- 已重新构建 `dist/backend_validate.js`，并完成 lodash import 运行时补丁。
- 产物确认包含：
  - `SOUL_PROBE_RESULT_STATES`
  - `getTrustedSoulEchoNpcs`
  - `isTrustedSoulCompanionSet`
  - `appendByPath`
- CDP 刷新后基础校验通过：`node cdp-v4-mvu-check.mjs --port 9222 --json`。
- 当前后端脚本上下文已加载：`contextId=452`。

当前实机基线：

- 当前场景：`阴阳池`。
- 当前时辰：`酉时`。
- `系统.待处理交互=[]`。
- `系统.场景上下文.地点=阴阳池`，`子区域=玉阶底端`，`在场NPC=[苏芸]`。
- 当前风声数量为 1。

下一步验收：

1. 用户触发下一条自然楼层，优先继续 `阴阳池 / 苏芸 / 玉阶底端` 场景，诱发新的心音回响或心声探测结果。
2. 读取 sanitizer 诊断，期望：
   - `strategy=path_scoring_v2`。
   - `keptCommands` 包含 `insert 系统.心音回响 '-'`。
   - 若 AI 同批写入 `NPC.苏芸.心声探测态="已捕获/反震/锁闭"`，应被录用。
   - 若 AI 同批写入 `系统.当前聚焦心声NPC="苏芸"`，应被录用。
3. 检查 latest MVU：
   - `系统.心音回响.length <= 12`。
   - 没有重复心音 `id`。
   - 若 AI 写了结果态，`NPC.苏芸.心声探测态` 应与结果同步。
   - `可窥探` 仍不得由 AI 直接写入。

阶段结论：

- 心音回响已从“只入库”升级为“入库 + 受限状态同步”。
- 该修复不扩大完整对象替换权限，仍保持 path 级白名单与同批证据约束。
- 当前需要一条新的真实 AI 楼层来验收自然输出是否覆盖心音同步链路。

### 阶段 AT：心音回响状态同步实机复验

状态：主链路通过，发现语义重复心音新问题

本阶段目标：

- 验证阶段 AS 修复后，真实 AI 楼层是否能完成 `系统.心音回响` 入库、`NPC.苏芸.心声探测态` 同步、`系统.当前聚焦心声NPC` 同步。

实机结果：

- sanitizer 诊断通过：
  - `strategy=path_scoring_v2`。
  - `scanned=24`。
  - `kept=13`。
  - `dropped=11`。
  - `selectedPathCount=17`。
- 录用核心命令包括：
  - `系统.当前聚焦心声NPC="苏芸"`。
  - `系统.待处理交互=[]`。
  - `系统.当前场景="阴阳池底"`。
  - 完整 `系统.场景上下文`。
  - 完整 `系统.时间状态`。
  - `insert 系统.心音回响 '-'`。
  - `insert 剧情.事件记录 '-'`。
  - `NPC.苏芸.心声探测态="已捕获"`。
- latest MVU 结果：
  - `系统.当前聚焦心声NPC=苏芸`。
  - `NPC.苏芸.心声探测态=已捕获`。
  - `系统.心音回响.length=4`。
  - `soulEchoDuplicateIds=[]`。
  - `剧情.事件记录.length=3`。
  - `eventDuplicateIds=[]`。
  - `系统.时间状态.最近事件类型=灵识窃取与对话`。

通过项：

- 心音 append 录用通过。
- 同批可信心音驱动的 `NPC.苏芸.心声探测态="已捕获"` 录用通过。
- 同批可信心音驱动的 `系统.当前聚焦心声NPC="苏芸"` 录用通过。
- 事件账本继续保留旧事件并追加新事件，无重复 id。
- 时间状态、场景上下文继续稳定落库。
- `可窥探` 未被 AI 写入 latest。

发现的新问题：

- AI 同一楼层写入了两条内容几乎相同的苏芸心音：
  - `whisper_suyun_01`。
  - `echo_suyun_01`。
- 两条心音 `id` 不同，因此当前按 `id` 幂等的 `appendByPath()` 不会判定重复。
- 这不是数据破坏，但会让 UI 心音档案出现同一句话重复展示，影响可读性和沉浸感。

下一步修复建议：

1. 在 `path_scoring_v2` 对 `系统.心音回响` append 做同楼层择优：同一 `npc + text + scene + time` 只保留一条。
2. 在 `appendByPath()` 增加心音语义幂等：除 `id` 外，再用 `npc + text + scene + time` 判重。
3. 保留 `id` 判重作为第一层，语义判重作为第二层；避免不同 id 的重复心音进入 UI。
4. 不影响不同文本、不同场景、不同时间的连续心音记录。

阶段结论：

- 阶段 AS 的核心目标已通过实机验收：心音入库与状态同步闭环成立。
- 当前剩余问题从“状态不同步”收敛为“同楼层心音语义重复”。
- 建议下一阶段做小步 TDD 修复：心音回响语义去重。

### 阶段 AU：心音回响语义去重修复

状态：代码完成并已加载实机，等待下一轮新楼层复验

本阶段目标：

- 修复阶段 AT 发现的“同一楼层两条心音内容相同但 id 不同，导致 UI 重复展示”的问题。
- 保留正常连续心音：不同 NPC、不同文本、不同场景、不同时间的心音仍允许入库。

TDD 红灯：

- 新增失败用例 1：同一批命令里两条 `npc + text + scene + time` 相同但 `id` 不同的 `系统.心音回响`，只应保留一条。
- 新增失败用例 2：fallback 写入时，如果已有心音与新心音 `npc + text + scene + time` 相同，即使 `id` 不同也不得重复 append。
- 红灯结果：`mvuCommandSanitizer.test.ts` 17 个测试中新增 2 个失败，失败点符合预期。

实现内容：

- 新增 `getSoulEchoSemanticKey(value)`：用 `npc + text + scene + time` 生成心音语义 key。
- 新增 `getSoulEchoCommandSemanticKey(command)`：从心音 append 命令里提取语义 key。
- `sanitizeMvuCommands()` 处理安全 append 时，对 `系统.心音回响` 做同批语义去重；重复项记录为 `duplicate_soul_echo_semantic_key`。
- `appendByPath()` 写入 `系统.心音回响` 前，除原有 `id` 幂等外，再检查已有数组里是否存在相同语义 key。
- `系统.心音回响` 仍保留最近 12 条。

验证结果：

- 单文件回归通过：
  - `npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts`
  - 17 个测试通过。
- 相关链路回归通过：
  - `npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts`
  - 4 个测试文件，104 个测试通过。
- 已重新构建 `dist/backend_validate.js`：
  - `npx esbuild src/雌堕合欢宗/脚本/后端校验/index.ts --bundle --format=esm --target=es2022 --outfile=dist/backend_validate.js --external:lodash`
- 已完成 lodash import 运行时补丁。
- 产物确认包含：
  - `getSoulEchoSemanticKey`。
  - `duplicate_soul_echo_semantic_key`。
  - `const _2 = window._;`。
- CDP 强制刷新并通过基础检查：
  - `node cdp-v4-mvu-check.mjs --port 9222 --json`。
  - `pass=true`，`failureCount=0`。
  - 新后端脚本上下文：`contextId=476`。

当前实机基线：

- 当前场景：`阴阳池底`。
- 当前时辰：`酉时`。
- `系统.待处理交互=[]`。
- `系统.场景上下文.在场NPC=[苏芸]`。
- 当前风声数量为 1。

下一步验收：

1. 用户触发下一条自然楼层，继续 `阴阳池底 / 苏芸 / 心声捕获` 场景。
2. 若 AI 再次输出两条内容相同但 id 不同的心音，sanitizer 应只保留一条，并在 `droppedCommands` 里记录 `duplicate_soul_echo_semantic_key`。
3. latest MVU 应满足：
   - `系统.心音回响` 无同语义重复。
   - `系统.心音回响.length <= 12`。
   - `NPC.苏芸.心声探测态` 仍保持合法结果态。
   - 时间状态、场景上下文、事件账本继续稳定落库。

阶段结论：

- 心音系统现在具备两层幂等：`id` 幂等 + `npc/text/scene/time` 语义幂等。
- 阶段 AT 的重复心音问题已在代码层收口。
- 仍需下一条真实 AI 楼层确认自然输出下的去重诊断与 latest MVU 表现。

### 阶段 AV：历史心音回响自愈校验

状态：代码完成并已加载实机，等待下一次变量校验触发自愈

本阶段背景：

- 阶段 AU 解决了“未来新命令”的心音语义去重。
- CDP 读取 current latest 时发现，阶段 AT 修复前已经产生的旧重复心音仍在：
  - `whisper_suyun_01`
  - `echo_suyun_01`
- 仅刷新页面不会改变旧 MVU 数据，因此需要在 `validateVariables()` 校验层增加自愈能力。

TDD 红灯：

- 新增失败用例：`系统.心音回响` 同时包含 id 重复与 `npc + text + scene + time` 语义重复时，校验后应：
  - 清理 id 重复。
  - 清理语义重复。
  - 只保留最近 12 条。
- 红灯结果：旧逻辑保留 16 条，测试失败，符合预期。

实现内容：

- `ensureV4SystemFields()` 新增 `系统.心音回响` 数组兜底。
- 新增 `getSoulEchoSemanticKey(echo)`：按 `npc + text + scene + time` 生成语义 key。
- 新增 `normalizeSoulEchoLedger(new_data)`：
  - 非数组时恢复为空数组。
  - 跳过非对象脏项。
  - 按 `id` 去重。
  - 按 `npc/text/scene/time` 去重。
  - 最终只保留最近 12 条。
- `validateVariables()` 在 v4 字段兜底后立即调用 `normalizeSoulEchoLedger()`。

验证结果：

- 单文件回归通过：
  - `npx vitest run src/雌堕合欢宗/脚本/后端校验/validate.test.ts`
  - 77 个测试通过。
- 相关链路回归通过：
  - `npx vitest run src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts`
  - 4 个测试文件，105 个测试通过。
- 已重新构建 `dist/backend_validate.js`。
- 已完成 lodash import 运行时补丁。
- 产物确认包含：
  - `normalizeSoulEchoLedger`。
  - `getSoulEchoSemanticKey`。
  - `duplicate_soul_echo_semantic_key`。
  - `const _2 = window._;`。
- CDP 强制刷新并通过基础检查：
  - `node cdp-v4-mvu-check.mjs --port 9222 --json`。
  - `pass=true`，`failureCount=0`。
  - 新后端脚本上下文：`contextId=499`。

当前实机说明：

- 当前 latest 仍保留阶段 AT 之前产生的语义重复心音；这是旧 MVU 数据，刷新页面不会自动重写。
- 下一次 AI 楼层变量校验触发后，`normalizeSoulEchoLedger()` 应自动归并这些旧重复项。

下一步验收：

1. 用户触发下一条自然楼层。
2. 验收 latest：
   - `系统.心音回响` 不再存在同语义重复。
   - `系统.心音回响.length <= 12`。
   - 若 AI 新增重复心音，sanitizer 记录 `duplicate_soul_echo_semantic_key`。
   - 时间状态、场景上下文、事件账本继续稳定落库。

阶段结论：

- 心音重复治理现在覆盖三层：命令解析层、fallback append 层、最终校验自愈层。
- 新数据能挡住，旧数据能在下一次校验时自动清理。

### 阶段 AW：历史心音回响自愈实机验收

状态：通过

本阶段目标：

- 验证阶段 AV 的 `normalizeSoulEchoLedger()` 是否会在真实新楼层变量校验后，清理修复前遗留的旧重复心音。

实机结果：

- 新楼层已更新后读取 latest MVU。
- `系统.心音回响.length` 从旧状态 4 条变为 3 条。
- `soulEchoDuplicateIds=[]`。
- `soulEchoSemanticDuplicateKeys=[]`。
- 被清理的是阶段 AT 修复前留下的同语义重复：
  - 保留：`whisper_suyun_01`。
  - 清理：`echo_suyun_01`。
- `系统.当前聚焦心声NPC=苏芸`。
- `NPC.苏芸.心声探测态=已捕获`。

同时通过的世界运行字段：

- 当前场景：`阴阳池底`。
- 当前时辰：`酉时`。
- `系统.待处理交互=[]`。
- `系统.场景上下文.在场NPC=[苏芸]`。
- `系统.场景上下文.NPC活动.苏芸=踩着玩家的手背施压调戏`。
- `系统.时间状态.最近事件类型=对话`。
- `系统.时间状态.最近耗时=一刻钟内`。
- `剧情.事件记录.length=3`。
- `eventDuplicateIds=[]`。

注意事项：

- 本轮读取到 `sanitizer=null` 和 `prompt=null`，但 latest 数据已经变化并完成校验自愈；说明本次重点验收的最终校验层已经生效。
- 本轮 AI 没有新增新的事件记录，事件账本保持 3 条；旧账本未丢失，也无重复。

阶段结论：

- 历史重复心音自愈通过实机验收。
- 心音系统当前闭环为：新命令去重、fallback 幂等、旧数据校验自愈、NPC 心声状态同步。
- 该问题可以收口，下一步建议进入世界运行核心全量回归与剩余风险盘点。

### 阶段 AX：世界运行核心全量回归与剩余风险盘点

状态：通过，进入剩余风险收口

本阶段目标：

- 在心音回响闭环修复后，做一次世界运行核心全量验收。
- 覆盖时间系统、场景上下文、事件后果账本、风声、心音、待处理交互、P2 主控台与调试面板。
- 判断当前是否可以从“世界运行基础修复”进入下一轮玩法/UI/剧情钥匙推进。

代码回归结果：

- 脚本/数据层回归通过：9 个测试文件，160 个测试通过。
- 覆盖：`mvuCommandSanitizer.test.ts`、`validate.test.ts`、`narrativePromptRuntime.test.ts`、`worldRuntimePrompt.test.ts`、`pendingActionPrompt.test.ts`、`usePendingAction.test.ts`、`worldTime.test.ts`、`phase2Runtime.test.ts`、`phase2Rumor.test.ts`。
- 组件/页面层回归通过：7 个测试文件，183 个测试通过。
- 覆盖：`DebugPanel.test.ts`、`HomePage.test.ts`、`GalleryPage.test.ts`、`Phase2Page.test.ts`、`ShopPage.test.ts`、`BackpackPage.test.ts`、`guards.test.ts`。
- 构建验证通过：`npm run build`，webpack 编译成功。
- 构建仍有既有包体警告：`index.html (5.11 MiB)` 超过 webpack 推荐体积。

CDP 实机总检结果：

- 当前阶段：`牝奴期`。
- 当前场景：`阴阳池底`。
- 当前时辰：`酉时`。
- `系统.待处理交互=[]`。
- `系统.当前追查风声ID=''`。
- `系统.时间状态` 健康：`当前日=1`、`时段进度=2`、`最近耗时=一刻钟内`、`最近事件类型=对话`、`是否过夜=false`。
- `系统.欲海状态` 健康：`搜寻进度=0`、`警戒等级=平静`、`遮蔽剩余时段=0`、`已被定位=false`。
- `系统.场景上下文` 健康：`地点=阴阳池底`、`子区域=玉阶底端`、`公开度=半私密`、`在场NPC=[苏芸]`。
- `系统.风声列表` 健康：数量 1，`rumorDuplicateIds=[]`。
- `剧情.事件记录` 健康：数量 3，`eventDuplicateIds=[]`，旧事件保留，新事件未丢失。
- `系统.心音回响` 健康：数量 3，`soulEchoDuplicateIds=[]`，`soulEchoSemanticDuplicateKeys=[]`。
- 当前聚焦心声 NPC：`苏芸`。
- NPC 心声状态：`苏芸=已捕获`、`纪兰=已捕获`、其他核心 NPC 为 `无波动`。
- P2 主控台字段当前可用但未推进：`牝奴.当前日课=候命`、`牝奴.当前支配者=''`、`牝奴.当前命令=''`、`牝奴.今日调教次数=0`、`牝奴.调教记录.length=0`。

已闭环项：

- `path_scoring_v2` 路径级择优已覆盖重复变量块和跨块择优。
- `系统.时间状态` 可被完整对象与可信子路径稳定保留。
- `系统.场景上下文` 完整对象优先，子路径噪声会被覆盖剔除。
- `剧情.事件记录` 可安全 append、按 id 幂等、校验层保留旧账本并限制最近 20 条。
- `系统.心音回响` 已完成命令层去重、fallback 幂等、校验层自愈、NPC 状态同步。
- `系统.待处理交互` 与 `系统.当前追查风声ID` 的闭环字段在 sanitizer 与 prompt 中均有覆盖。
- P2 风声点击、商城/背包操作入队、调试面板显示队列均有测试覆盖。

观察项：

- 当前 latest 的 `sanitizer=null`、`prompt=null` 是刷新/读取时态下的状态，不代表解析链路缺失；后续验收仍应在新楼层后读取。
- 本轮新楼层没有追加新的 `剧情.事件记录`，但旧账本未丢失；AI 偶发漏写时系统会保旧账本，但不会凭空生成新事件。
- P2 当前字段仍处于 `候命/空命令/无调教记录`，说明当前实机剧情虽处于牝奴期，但尚未触发一次 P2 日课/调教命令闭环。
- Vitest 组件层出现 `--localstorage-file was provided without a valid path` 警告，不影响测试结果，可后续清理测试环境配置。
- `npm run build` 有既有包体警告，属于性能/包体优化项，不阻塞当前世界运行逻辑。

建议下一阶段：

1. 阶段 AY：P2 日课/调教命令闭环实机验证。
   - 目标：触发一次 P2 待处理交互或自然调教事件，让 AI 写入 `牝奴.当前日课`、`牝奴.当前支配者`、`牝奴.当前命令`、`牝奴.今日调教次数` 或 `牝奴.调教记录`。
   - 验收：P2 主控台字段不再只是 `候命`，并与时间/事件账本同步。
2. 阶段 AZ：世界运行核心收口报告。
   - 目标：把时间、场景、事件、风声、心音、P2 闭环的当前实现与剩余风险整理成 PRD/验收报告。
3. 后续优化项：测试环境 `--localstorage-file` 警告清理；构建包体拆分或示例资源体积治理。

阶段结论：

- 世界运行核心基础链路已具备可靠性：时间、场景、事件账本、风声、心音、队列均有代码回归与实机证据。
- 当前最大剩余业务缺口不是基础数据可靠性，而是 P2 牝奴期玩法字段还需要一次真实调教命令闭环验收。

### 阶段 AY：P2 无队列自然楼层提示增强

状态：代码完成并已加载实机，等待下一轮真实楼层验证 P2 主控台推进

本阶段目标：

- 解决 P2 主控台长期停留在 `候命/无人牵丝/无调教记录` 的风险。
- 在没有 `系统.待处理交互` 的自然牝奴期楼层中，也提醒 AI 同步推进 P2 日课、支配者、命令和调教账本字段。

实机核查：

- P2 主控台前端已在楼层 iframe 中正常显示。
- 当前显示状态：
  - `牝印=86%`。
  - `牝阴决=6/9`。
  - `日课=候命`。
  - `朱批=0`。
  - `当前支配者=无人牵丝`。
  - `调教记录=空`。
- 结论：UI 与数据结构可用，缺口在自然楼层提示未强制推进 P2 主控台字段。

提示层核查：

- 有待处理交互时，`pendingActionPrompt` 已明确要求写：
  - `牝奴.当前日课`。
  - `牝奴.当前支配者`。
  - `牝奴.当前命令`。
  - `牝奴.命令强度`。
  - `牝奴.今日调教次数`。
  - `牝奴.最近调教结算`。
  - `牝奴.调教记录`。
- 无队列时，`worldRuntimePrompt` 旧逻辑只要求追加 `牝奴.调教记录`，没有点名主控台核心字段。

TDD 红灯：

- 新增测试：牝奴期无队列自然楼层也应提示同步 `牝奴.当前日课`、`牝奴.当前支配者`、`牝奴.当前命令`、`牝奴.今日调教次数`、`牝奴.最近调教结算` 和 `add /牝奴/调教记录/-`。
- 红灯结果：旧提示不包含 `牝奴.当前日课`，测试失败，符合预期。

实现内容：

- `worldRuntimePrompt.ts` 的 P2 提示从“追加调教记录”增强为：
  - 牝奴期若发生日课、支配、公开调教、羞名凝视或牝印命令，必须同步写 `牝奴.当前日课`、`牝奴.当前支配者`、`牝奴.当前命令`、`牝奴.今日调教次数`、`牝奴.最近调教结算`，或用 `add /牝奴/调教记录/-` 追加 `牝奴.调教记录`。
- scan tokens 同步加入 P2 主控台字段，提升动态注入召回。

验证结果：

- 单文件回归通过：
  - `npx vitest run src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.test.ts`
  - 1 个测试文件，5 个测试通过。
- 相关链路回归通过：
  - `worldRuntimePrompt.test.ts`、`pendingActionPrompt.test.ts`、`narrativePromptRuntime.test.ts`、`mvuCommandSanitizer.test.ts`、`validate.test.ts`、`Phase2Page.test.ts`、`phase2Runtime.test.ts`、`phase2Rumor.test.ts`。
  - 8 个测试文件，156 个测试通过。
  - 仍有已知测试环境警告：`--localstorage-file was provided without a valid path`。
- 已重新构建 `dist/backend_validate.js`。
- 已完成 lodash import 运行时补丁。
- 产物确认包含增强后的 `worldRuntimePrompt` 逻辑；中文字符串在 bundle 中以 unicode 转义形式存在。
- CDP 强制刷新后，第一次 15 秒检查时 MVU 尚未初始化完成；继续等待 20 秒后基础检查通过。
- 当前后端脚本上下文：`contextId=546`。

下一步验收：

1. 用户触发下一条自然 P2 楼层，建议沿当前 `阴阳池底 / 苏芸 / 玉阶底端` 场景，让苏芸继续传唤、羞名凝视或下达牝印命令。
2. 新楼层后读取注入快照，期望：
   - `hasWorldRuntimePrompt=true`。
   - prompt 内容包含 `牝奴.当前日课`、`牝奴.当前支配者`、`牝奴.当前命令`、`牝奴.今日调教次数` 或 `add /牝奴/调教记录/-`。
3. 验收 latest MVU：
   - P2 主控台字段不再全是 `候命/空命令/0记录`。
   - 至少有一项被推进：`牝奴.当前日课`、`牝奴.当前支配者`、`牝奴.当前命令`、`牝奴.今日调教次数`、`牝奴.最近调教结算` 或 `牝奴.调教记录`。
   - 时间状态、场景上下文、剧情事件记录继续稳定。

阶段结论：

- P2 自然楼层提示已补齐主控台推进口径。
- 当前需要一条真实 AI 回复验证：P2 主控台是否能从空态被自然剧情推动。

### 阶段 AY-2：P2 world runtime 注入回溯修复

状态：根因修复完成并已加载实机，等待下一轮真实楼层复验

本阶段背景：

- 阶段 AY 提示增强后，用户触发新楼层。
- 最新楼层正文已经进入 `屈辱调教`：苏芸俯身凝视并监督玩家执行舔拭台阶的命令。
- 但 latest MVU 中 P2 主控台字段仍未推进：
  - `牝奴.当前日课=候命`。
  - `牝奴.当前支配者=''`。
  - `牝奴.当前命令=''`。
  - `牝奴.今日调教次数=0`。
  - `牝奴.调教记录.length=0`。

实机失败证据：

- 后端 sanitizer 记录：
  - `strategy=path_scoring_v2`。
  - `scanned=17`。
  - `kept=6`。
  - `dropped=11`。
- AI 写入并被保留的字段只有：
  - `系统.待处理交互=[]`。
  - `系统.时间状态`。
  - `系统.场景上下文`。
  - `系统.时间状态.最近耗时/最近结算原因/最近事件类型`。
- AI 未写入任何 `牝奴.*` 主控台字段，也未追加 `牝奴.调教记录` 或新的 `剧情.事件记录`。
- 注入快照显示旧产物下：
  - `reason=generation_started`。
  - `pendingCount=0`。
  - `promptIds=[]`。
  - `hasWorldRuntimePrompt=false`。
  - `injected=false`。

根因判断：

- `generation_started` 时，`Mvu.getMvuData({ message_id: 'latest' })` 可能拿到的是刚发出的用户楼层或空楼层，缺少有效 `stat_data.系统`。
- 旧 `findStatDataForNarrativePrompt()` 只会为了 `系统.待处理交互` 回溯历史楼层。
- 当 latest 没有队列且没有有效系统状态时，它直接返回空 latest，导致 `buildWorldRuntimePrompt()` 判断不到 `系统.阶段=牝奴期`，最终不注入 P2 world runtime prompt。

TDD 红灯：

- 新增测试：当 latest 是空用户楼层，而前一楼层存在有效 `牝奴期` 世界运行状态时，`findStatDataForNarrativePrompt()` 应回溯到前一楼层。
- 红灯结果：旧逻辑返回 `{}`，测试失败，符合实机症状。

实现内容：

- 新增 `hasValidWorldRuntimeState(data)`：识别有效世界运行状态。
- 有效状态条件包括：
  - `系统.阶段=牝奴期`。
  - 或 `系统.当前追查风声ID` 非空。
  - 或 `系统.当前场景` 非空。
- `findStatDataForNarrativePrompt()` 仍优先回溯含 `待处理交互` 的楼层。
- 若无队列且 latest 缺少有效世界状态，则继续向前回溯最近有效世界运行状态，用于生成 world runtime prompt。

验证结果：

- 单文件回归通过：
  - `npx vitest run src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts`
  - 1 个测试文件，8 个测试通过。
- 相关链路回归通过：
  - `narrativePromptRuntime.test.ts`、`worldRuntimePrompt.test.ts`、`pendingActionPrompt.test.ts`、`mvuCommandSanitizer.test.ts`、`validate.test.ts`。
  - 5 个测试文件，131 个测试通过。
- 已重新构建 `dist/backend_validate.js`。
- 已完成 lodash import 运行时补丁。
- 产物确认包含：
  - `hasValidWorldRuntimeState`。
  - `GENERATION_STARTED` 刷新逻辑。
  - `const _2 = window._;`。
- CDP 刷新后通用检查曾因上下文选择问题未抓到后端 iframe；手动枚举确认新的后端脚本上下文为 `contextId=570`。
- 在 `contextId=570` 中手动验证通过：
  - `hasMvu=true`。
  - `hasBackendHook=true`。
  - `snapshot.reason=generation_started`。
  - `snapshot.promptIds=[hehuan-world-runtime-summary, hehuan-world-runtime-scan]`。
  - `snapshot.hasWorldRuntimePrompt=true`。
  - `snapshot.injected=true`。

当前实机状态：

- P2 world runtime prompt 已在当前后端脚本中具备注入能力。
- 当前 latest 仍是修复前那条 AI 楼层的结果，因此 P2 主控台字段仍为空态。
- 必须触发下一条新 AI 楼层，才能验收修复后的注入是否推动 `牝奴.*` 主控台字段落库。

下一步验收：

1. 用户继续触发一条自然 P2 楼层，建议沿当前 `阴阳池 / 苏芸 / 舔拭台阶命令` 场景推进。
2. 新楼层后读取 `__HEHUAN_NARRATIVE_PROMPT_SNAPSHOT__()`：
   - 期望 `hasWorldRuntimePrompt=true`。
   - `promptIds` 包含 `hehuan-world-runtime-summary` 和 `hehuan-world-runtime-scan`。
3. 读取 sanitizer 与 latest：
   - 期望 AI 写入至少一项 `牝奴.当前日课/当前支配者/当前命令/今日调教次数/最近调教结算/调教记录`。
   - 时间状态、场景上下文、剧情事件记录继续稳定。

阶段结论：

- 阶段 AY 第一次实机验收失败的根因不是提示文本不够强，而是生成开始时取到了空 latest，导致 world runtime prompt 没有注入。
- 该根因已修复并在实机后端上下文确认生效。
- 需要下一条真实楼层完成 P2 主控台推进验收。

### 阶段 AY-3：P2 调教主控台后端兜底结算

状态：通过，当前 latest 已自愈

本阶段背景：

- 阶段 AY-2 修复后，用户再次触发新楼层。
- 注入快照通过：
  - `reason=generation_started`。
  - `promptIds=[hehuan-world-runtime-summary, hehuan-world-runtime-scan]`。
  - `hasWorldRuntimePrompt=true`。
  - `injected=true`。
- AI 本次写入了深度亲密/服从性调教链路：
  - `系统.当前场景=阴阳池`。
  - `系统.时间状态.最近事件类型=深度亲密/羞辱互动`。
  - `系统.欲海状态` 完整对象。
  - `系统.场景上下文.特殊事件=服从性调教`。
  - `剧情.事件记录` 追加 `event_0501_酉时_NSFW`。
  - `系统.心音回响` 追加苏芸心音。
- 但 AI 仍未写任何 `牝奴.*` 主控台字段，P2 主控台继续停留：
  - `牝奴.当前日课=候命`。
  - `牝奴.当前支配者=''`。
  - `牝奴.当前命令=''`。
  - `牝奴.今日调教次数=0`。
  - `牝奴.调教记录.length=0`。

根因判断：

- 提示注入已经生效，但 AI 仍可能漏写 P2 主控台字段。
- 仅靠 prompt 不能保证牝奴期核心 UI 一定推进。
- 需要后端校验层兜底：当 AI 已经明确写出 P2 调教/深度亲密事件，却漏写 `牝奴.*` 时，系统自动生成最小调教结算。

TDD 红灯：

- 新增测试：牝奴期中，`剧情.事件记录` 已出现 `深度亲密/服从测试/苏芸`，且 `系统.场景上下文.特殊事件=服从性调教`，但 `牝奴.*` 仍为空态时，`validateVariables()` 应自动补齐 P2 主控台字段。
- 红灯结果：旧逻辑保持 `牝奴.当前日课=候命`，测试失败，符合实机症状。

实现内容：

- 复用现有 `settleP2TrainingEvent()`，不新造结算规则。
- 新增 `autoSettleP2TrainingFallback(new_data)`：
  - 只在 `系统.阶段=牝奴期` 时运行。
  - 只在 P2 主控台为空态时运行，避免覆盖 AI 已写好的日课/命令。
  - 从最新 `剧情.事件记录` 或 `系统.场景上下文.特殊事件` 中识别 `调教/羞辱/服从/深度亲密/NSFW/欲海`。
  - 从事件涉及 NPC 或当前在场 NPC 推断支配者。
  - 从事件摘要、NPC 活动或故事钩子推断当前命令。
  - 调用 `settleP2TrainingEvent()` 生成 `当前日课/当前支配者/当前命令/命令强度/今日调教次数/最近调教结算/调教记录/支配次数`。

验证结果：

- 单文件回归通过：
  - `npx vitest run src/雌堕合欢宗/脚本/后端校验/validate.test.ts`
  - 1 个测试文件，78 个测试通过。
- P2/后端相关回归通过：
  - `validate.test.ts`、`mvuCommandSanitizer.test.ts`、`narrativePromptRuntime.test.ts`、`worldRuntimePrompt.test.ts`、`phase2Runtime.test.ts`、`Phase2Page.test.ts`。
  - 6 个测试文件，130 个测试通过。
- 已重新构建 `dist/backend_validate.js`。
- 已完成 lodash import 运行时补丁。
- 产物确认包含：
  - `autoSettleP2TrainingFallback`。
  - `findLatestP2TrainingEvent`。
  - `settleP2TrainingEvent`。
- CDP 刷新后，在新后端上下文 `contextId=594` 使用 `__TEST_applyValidatedUpdate([])` 触发校验自愈。

实机自愈结果：

- 自愈前：
  - `牝奴.当前日课=候命`。
  - `牝奴.当前支配者=''`。
  - `牝奴.当前命令=''`。
  - `牝奴.今日调教次数=0`。
  - `牝奴.调教记录.length=0`。
- 自愈后：
  - `牝奴.当前日课=阴阳池验身`。
  - `牝奴.当前支配者=苏芸`。
  - `牝奴.当前命令=玩家在阴阳池底执行苏芸的舔玉阶命令，引发苏芸合欢诀生理反应`。
  - `牝奴.命令强度=55`。
  - `牝奴.今日调教次数=1`。
  - `牝奴.最近调教结算=苏芸在阴阳池执行阴阳池验身：玩家在阴阳池底执行苏芸的舔玉阶命令，引发苏芸合欢诀生理反应。`
  - `牝奴.调教记录.length=1`。
  - 新调教记录：`p2_酉时_阴阳池_苏芸_1`，羞名等级 `传开`。
  - `牝奴.支配次数.苏芸` 从 1 增至 2。

阶段结论：

- P2 主控台闭环现在有三层保障：prompt 强提示、world runtime 注入回溯、后端校验兜底结算。
- 当前 latest 已从空态自愈为可读的 P2 调教状态。
- 下一步建议做一次普通新楼层验收，确认自愈后的 P2 主控台 UI 显示与后续连续调教不会重复结算。

## 阶段 AY-4：P2 支配次数幂等修复与连续性验收

时间：2026-05-25

触发背景：

- 新楼层连续验收时，P2 主控台主字段已经稳定：
  - `牝奴.当前日课=阴阳池验身`。
  - `牝奴.当前支配者=苏芸`。
  - `牝奴.当前命令=玩家在阴阳池底执行苏芸的舔玉阶命令，引发苏芸合欢诀生理反应`。
  - `牝奴.今日调教次数=1`。
  - `牝奴.调教记录.length=1`。
- 但 `牝奴.支配次数.苏芸` 从 `2` 漂移到 `3`，且没有新增调教记录。
- 这说明 AI 或额外解析层可能单独改写累计字段，破坏“调教记录账本才是支配次数增长依据”的规则。

根因取证：

- 初步已有 `normalizeP2DominanceCounts(new_data, old_data)`：当没有新增调教记录 id 时，用 old_data 回滚支配次数。
- CDP 空校验发现最新楼层已经被污染：
  - latest：`苏芸=3`，调教记录 `p2_酉时_阴阳池_苏芸_1`。
  - `-1`：`苏芸=3`，同一调教记录。
  - `-2/-3`：`苏芸=2`，同一调教记录。
- 结论：如果最新楼层和上一楼层都已污染，仅靠事件传入的 old_data 不够，需要从最近历史楼层中选择同一调教记录集下的较低可信基准。

TDD 红绿：

- 新增 `p2DominanceBaseline.test.ts`。
- 红灯：测试导入 `selectP2DominanceBaseline` 时模块不存在，失败符合预期。
- 绿灯：新增 `p2DominanceBaseline.ts`，实现：
  - 只处理 `系统.阶段=牝奴期`。
  - 只在 newData 与 eventOldData 拥有同一组 `牝奴.调教记录.id` 时考虑纠偏。
  - 从最近历史候选中筛选同一调教记录集、且支配次数低于当前 newData 的候选。
  - 选择支配次数总和最低的候选作为校验 old baseline。
  - 若存在新增调教记录，则不回退，避免阻止真实新增结算。

实现内容：

- 新增 `src/雌堕合欢宗/脚本/后端校验/p2DominanceBaseline.ts`。
- 新增 `src/雌堕合欢宗/脚本/后端校验/p2DominanceBaseline.test.ts`。
- 更新 `src/雌堕合欢宗/脚本/后端校验/index.ts`：
  - `VARIABLE_UPDATE_ENDED` 中不直接使用事件 old_data，而是调用 `selectP2DominanceBaseline()`。
  - 新增 `getRecentStatDataHistory()`，扫描最近 `-1` 到 `-8` 楼层的 `stat_data`。
  - `__TEST_applyValidatedUpdate([])` 也复用相同 baseline 选择逻辑，保证 CDP 验收与真实事件入口一致。

构建与产物修复：

- 执行后端校验产物重建：
  - `npx esbuild src/雌堕合欢宗/脚本/后端校验/index.ts --bundle --format=esm --target=es2022 --outfile=dist/backend_validate.js --external:lodash`
- 初次 CDP 刷新后，后端脚本 iframe 报错：
  - `TypeError: Failed to resolve module specifier "lodash"`。
- 原因：新增 baseline 模块后，esbuild 产物出现第二个 lodash 外部导入 `_3`，旧补丁只替换了 `_2`。
- 已将 dist 补丁方式调整为正则替换所有 `import _N from "lodash";` 为 `const _N = window._;`。
- 产物确认：
  - `const _2 = window._;`
  - `const _3 = window._;`
  - `selectP2DominanceBaseline`
  - `normalizeP2DominanceCounts`

自动化验证：

- 相关回归通过：
  - `npx vitest run src/雌堕合欢宗/脚本/后端校验/p2DominanceBaseline.test.ts src/雌堕合欢宗/脚本/后端校验/validate.test.ts src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.test.ts src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.test.ts src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.test.ts src/雌堕合欢宗/界面/data/phase2Runtime.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts`
  - 7 个测试文件，133 条测试通过。
  - 仍有项目既有警告：`--localstorage-file was provided without a valid path`。

CDP 实机验收：

- 页面 `ignoreCache` 刷新后，后端上下文恢复：`backendContextId=668`。
- 执行 `__TEST_applyValidatedUpdate([])`。
- 结果：
  - `牝奴.当前日课=阴阳池验身`。
  - `牝奴.当前支配者=苏芸`。
  - `牝奴.当前命令=玩家在阴阳池底执行苏芸的舔玉阶命令，引发苏芸合欢诀生理反应`。
  - `牝奴.命令强度=55`。
  - `牝奴.今日调教次数=1`。
  - `牝奴.调教记录.length=1`。
  - `调教记录Ids=[p2_酉时_阴阳池_苏芸_1]`。
  - `duplicateIds=[]`。
  - `牝奴.支配次数.苏芸` 从 `3` 回滚到 `2`。
  - trace 明确记录：`牝奴.支配次数.苏芸: 3 -> 2`。
- 世界运行提示仍正常注入：
  - `reason=generation_started`。
  - `promptIds=[hehuan-world-runtime-summary, hehuan-world-runtime-scan]`。
  - `hasWorldRuntimePrompt=true`。
  - `injected=true`。

阶段结论：

- P2 主控台字段、调教记录、支配次数三者已经形成更稳定的闭环。
- 支配次数不再允许在没有新增调教记录时单独漂移；即使最新楼层已被污染，也能从最近历史同记录集楼层中找回可信基准。
- 本阶段还修复了 `dist/backend_validate.js` 多 lodash 外部导入导致后端脚本无法加载的问题。

下一步建议：

- 继续推进普通新楼层验收：让 AI 再回复一层，观察在修复后的入口下，`牝奴.支配次数.苏芸` 是否保持 `2`，除非出现新的 `牝奴.调教记录.id`。
- 如果稳定，再进入 P2 主控台视觉验收：检查状态栏/主控台是否能直观看出日课、支配者、命令、朱批次数、羞名风声和烙名痕迹。

## 阶段 AY-5：P2 调教账本空写保护与新楼层连续性验收

时间：2026-05-25

触发背景：

- 用户推进一层真实 AI 回复后，CDP 读取最新楼层发现：
  - `牝奴.当前日课=听风廊示众`。
  - `牝奴.当前支配者=苏芸`。
  - `牝奴.当前命令=明日午时去听风廊，口衔铃铛跪迎内门女修。`
  - `牝奴.支配次数.苏芸=2`，没有再漂移到 3。
- 但 AI/额外解析层把 P2 调教账本清空：
  - `牝奴.今日调教次数=0`。
  - `牝奴.最近调教结算=''`。
  - `牝奴.调教记录.length=0`。
- 最新事件为 `event_1_酉时_日课`，类型 `P2日课`，本质是“下达明日听风廊示众任务”，不应该抹掉上一条已结算调教记录。

根因判断：

- AY-4 已经解决“支配次数无新增记录时单独漂移”。
- 但 P2 调教账本本身还缺少保护：AI 写空数组时，后端没有保留 old_data 的 `牝奴.调教记录/今日调教次数/最近调教结算`。
- 在当前实机状态中，latest 和 `-1` 都已经被空写污染，只有 `-2/-3/-4` 还保留调教记录，因此还需要 baseline 从历史楼层恢复非空账本。

TDD 红绿：

- 新增 `validate.test.ts` 用例：
  - old_data 有 `p2_酉时_阴阳池_苏芸_1`、`今日调教次数=1`、`最近调教结算`。
  - new_data 更新为 `听风廊示众` 与新命令，但把 `调教记录=[]`、`今日调教次数=0`、`最近调教结算=''`。
  - 期望保留新日课/新命令，同时恢复旧调教账本。
  - 红灯命中：旧逻辑得到 `调教记录=[]`。
- 新增 `p2DominanceBaseline.test.ts` 用例：
  - newData/eventOldData 都为空账本。
  - candidateHistory 中有非空账本。
  - 期望选择非空账本作为 baseline。
  - 红灯命中：旧 baseline 返回空账本。

实现内容：

- `validate.ts` 新增 `preserveP2TrainingLedger(new_data, old_data)`：
  - 只处理 `系统.阶段=牝奴期`。
  - 当 old_data 有 `牝奴.调教记录`、new_data 没有新调教记录时，恢复：
    - `牝奴.调教记录`。
    - `牝奴.今日调教次数`。
    - `牝奴.最近调教结算`。
  - 不覆盖新楼层写入的 `当前日课/当前支配者/当前命令`，允许剧情推进到“听风廊示众”。
- `p2DominanceBaseline.ts` 新增 `findNonEmptyLedgerCandidate()`：
  - 当 newData/eventOldData 都为空账本时，从最近历史候选中找 P2 非空调教账本作为 baseline。
  - 只在 P2 阶段启用，避免误伤非 P2 或真实空档。

自动化验证：

- 针对性验证通过：
  - `p2DominanceBaseline.test.ts` + `validate.test.ts`。
  - 2 个测试文件，83 条测试通过。
- 相关回归通过：
  - `p2DominanceBaseline.test.ts`、`validate.test.ts`、`mvuCommandSanitizer.test.ts`、`narrativePromptRuntime.test.ts`、`worldRuntimePrompt.test.ts`、`phase2Runtime.test.ts`、`Phase2Page.test.ts`。
  - 7 个测试文件，135 条测试通过。
  - 仍有项目既有警告：`--localstorage-file was provided without a valid path`。

构建与产物：

- 已重建 `dist/backend_validate.js`。
- 已用通用正则把所有 `import _N from "lodash";` 替换为 `const _N = window._;`。
- 产物确认包含：
  - `preserveP2TrainingLedger`。
  - `findNonEmptyLedgerCandidate`。
  - `selectP2DominanceBaseline`。
  - `const _2 = window._;`。
  - `const _3 = window._;`。

CDP 实机自愈验收：

- 页面 `ignoreCache` 刷新后，后端上下文恢复：`backendContextId=715`。
- 执行 `__TEST_applyValidatedUpdate([])`。
- 自愈后结果：
  - `牝奴.当前日课=听风廊示众`。
  - `牝奴.当前支配者=苏芸`。
  - `牝奴.当前命令=明日午时去听风廊，口衔铃铛跪迎内门女修。`
  - `牝奴.命令强度=0`。
  - `牝奴.今日调教次数=1`。
  - `牝奴.最近调教结算=苏芸在阴阳池执行阴阳池验身：玩家在阴阳池底执行苏芸的舔玉阶命令，引发苏芸合欢诀生理反应。`
  - `牝奴.支配次数.苏芸=2`。
  - `牝奴.调教记录.length=1`。
  - `调教记录Ids=[p2_酉时_阴阳池_苏芸_1]`。
  - `duplicateIds=[]`。
- trace 明确记录恢复项：
  - `牝奴.今日调教次数: 0 -> 1`。
  - `牝奴.最近调教结算: '' -> 上一条结算文本`。
  - `牝奴.调教记录: [] -> [p2_酉时_阴阳池_苏芸_1]`。

阶段结论：

- P2 连续性现在更稳：新楼层可以推进“下一日课/命令”，但不能把已结算调教账本清空。
- `支配次数`、`今日调教次数`、`调教记录` 三者重新一致：苏芸仍为 `2`，调教记录仍为 1 条，无重复。
- 当前 latest 已恢复为可读、可连续推进的 P2 主控台状态。

下一步建议：

- 再做一层真实回复连续验收，重点观察 AI 如果只是“前往听风廊/等待明日”是否保持账本不变。
- 若玩家真正进入听风廊示众并发生新调教结算，再验收是否生成新的唯一 `调教记录.id`，并使 `今日调教次数/支配次数` 合理增长。

## 阶段 AY-6：未支持时辰归一化与状态栏 ZodError 修复

时间：2026-05-25

触发背景：

- 用户推进“离开阴阳池，往听风廊方向走去”后报告新楼层出现错误。
- CDP 取证显示后端校验脚本仍在，P2 账本保护也没有失效：
  - `牝奴.今日调教次数=1`。
  - `牝奴.支配次数.苏芸=2`。
  - `牝奴.调教记录.length=1`。
- 控制台真实错误为状态栏/Pinia 读取层的 ZodError：
  - 路径：`剧情.事件记录[5].时辰`。
  - 输入：`戌时`。
  - 当前 schema 只允许：`晨时|午时|酉时|亥时`。

根因判断：

- 世界时间模型当前是四段制：`晨时/午时/酉时/亥时`。
- AI 在叙事里写入了更细的传统时辰 `戌时`，导致 `系统.时辰` 和 `剧情.事件记录[].时辰` 超出 schema 枚举。
- 前端读取 schema 时被非法时辰击穿，出现状态栏错误。

TDD 红绿：

- 新增 `validate.test.ts` 用例：
  - old_data：`系统.时辰=酉时`。
  - new_data：`系统.时辰=戌时`，并追加 `剧情.事件记录[0].时辰=戌时`。
  - 期望：后端校验后 `系统.时辰=酉时`，事件账本时辰也为 `酉时`。
- 红灯结果：旧逻辑保留 `戌时`，测试失败。
- 绿灯实现：新增时辰归一化后测试通过。

实现内容：

- `validate.ts` 新增四段合法时辰集合：
  - `晨时`、`午时`、`酉时`、`亥时`。
- 新增 `normalizeTimeName(value, fallback)`：
  - 合法值原样保留。
  - `卯/辰/巳/早/晨` 归入 `晨时`。
  - `午/未/昼` 归入 `午时`。
  - `申/酉/戌/暮/晚` 归入 `酉时`。
  - `亥/子/丑/寅/夜` 归入 `亥时`。
  - 其他异常值回退到 old_data 合法时辰，否则 `晨时`。
- 新增 `normalizeTimeFields(new_data, old_data)`：
  - 归一化 `系统.时辰`。
  - 遍历 `剧情.事件记录`，归一化每条事件的 `时辰`。
- 在 `validateVariables()` 早期流程接入：
  - `ensureV4SystemFields()`。
  - `normalizeSoulEchoLedger()`。
  - `mergeEventLedger()`。
  - `normalizeTimeFields()`。

自动化验证：

- 针对性红绿测试通过：
  - `npx vitest run src/雌堕合欢宗/脚本/后端校验/validate.test.ts -t "未支持时辰"`
  - 1 个测试文件，1 条目标测试通过。
- 相关回归通过：
  - `p2DominanceBaseline.test.ts`、`validate.test.ts`、`mvuCommandSanitizer.test.ts`、`narrativePromptRuntime.test.ts`、`worldRuntimePrompt.test.ts`、`phase2Runtime.test.ts`、`Phase2Page.test.ts`。
  - 7 个测试文件，136 条测试通过。
  - 仍有项目既有警告：`--localstorage-file was provided without a valid path`。

构建与产物：

- 已重建 `dist/backend_validate.js`。
- 已用通用正则把所有 `import _N from "lodash";` 替换为 `const _N = window._;`。
- 产物确认包含：
  - `normalizeTimeName`。
  - `normalizeTimeFields`。
  - `preserveP2TrainingLedger`。
  - `const _2 = window._;`。
  - `const _3 = window._;`。

CDP 实机验证：

- 刷新页面加载新后端产物后，执行 `__TEST_applyValidatedUpdate([])` 自愈。
- 自愈后：
  - `系统.时辰=酉时`。
  - 最新事件 `event_201_5_1_戌时_移动` 的 `时辰=酉时`。
  - `invalidEventTimes=[]`。
  - P2 账本仍稳定：`今日调教次数=1`、`调教记录.length=1`、`苏芸=2`。
- 再次读取主页面 MVU 状态确认：
  - `系统时辰=酉时`。
  - 最新事件时辰已为 `酉时`。
  - `invalidEventTimes=[]`。
- 复验窗口未再捕获新的 ZodError；先前输出中的 ZodError 是自愈前前端读取脏数据留下的旧控制台事件。

阶段结论：

- 状态栏错误根因已修复：AI 写入 `戌时` 这类细分时辰时，后端会自动归一到当前四段制，避免 schema 崩溃。
- 本次修复没有破坏 P2 账本：调教记录、支配次数、今日次数仍保持一致。

下一步建议：

- 继续推进“前往听风廊/等待明日午时”的过渡层。
- 特别观察 AI 是否继续写入 `戌时/未时/申时` 等细分时辰；系统应自动归一化，不再触发前端 ZodError。

## 阶段 AY-7：P2 主控台双主题视觉精修编译修复

时间：2026-05-25

触发问题：

- P2 UI 细化期间引入的 `WhisperPanel.vue` 样式块存在 SCSS 语法错误。
- `npm run build` 报错指向 `src/雌堕合欢宗/界面/components/phase2/WhisperPanel.vue`，根因是 `.p2-whisper-panel::after { bottom: 0; }` 后多出一个闭合花括号。

修复内容：

- 移除 `WhisperPanel.vue` 中多余的 `}`。
- 保持本轮 P2 视觉精修的既定方向不变：P2 样式继续接入 P1 双主题 token（`--hh-*`），不回退为单一硬编码暗红主题。
- 未改动数据流、事件接口和测试断言。

验证结果：

- P2 相关组件测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts`
  - 2 个测试文件通过，22 条测试通过。
  - 仍有项目既有警告：`--localstorage-file was provided without a valid path`。
- 生产构建通过：
  - `npm run build`
  - webpack 编译成功。
  - 仍有既有体积警告：`index.html (5.12 MiB)` 超过 webpack 推荐体积限制。

阶段结论：

- 本次编译错误已修复，P2 双主题视觉精修代码当前可以通过自动化组件测试和生产构建。
- 后续可继续进入 P2/P1 视觉融合的浏览器实机验收，重点看沉香/桃花主题切换下 P2 主控台是否自然、不突兀。

## 阶段 AY-8：P2 主控台问题区视觉精修

时间：2026-05-25

触发问题：

- 左上角牝印核心仍使用圆环仪表盘式设计，和 P2 的朱批、牵丝、命令感不匹配。
- 淫纹区域只是重复显示多个“纹”字，缺少身体图腾感。
- 拘束法器空状态只有三个固定空框，像临时占位，也不利于后续装备扩展。
- 身躯改造模板硬编码三项，后续追加新改造会继续改模板。

修复内容：

- `StigmaCore.vue`：
  - 移除圆环轨道视觉。
  - 改为竖向“牝印令牌”结构，保留命令状态 glyph。
  - 新增命令强度细线脉络，用于替代仪表盘式数值感。
- `Phase2Page.vue`：
  - 淫纹改为 5 段式对称图腾，按堕落度点亮 `2/3/4/5` 段。
  - 淫纹文案改为语义状态：`淫纹初醒/淫纹游身/淫纹成阵/淫纹满绽`。
  - 身躯改造改为 `TRANSFORM_MARK_CONFIG` 配置驱动，当前仍映射三项：乳泉、后庭、禁溺。
  - 拘束法器改为法器匣/锁链槽空态，并显示 `未佩/已佩 N`。
  - 装备列表改用 `getItemDisplayName()`，避免直接露内部道具 key。
- `Phase2Page.test.ts`：
  - 测试断言从旧的固定符号和 `.yinwen-mark` 改为新结构行为断言。
  - 覆盖改造谱系渲染、完成态点亮、淫纹激活段数、法器佩戴数量。

验证结果：

- P2 相关组件测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts`
  - 2 个测试文件通过，22 条测试通过。
  - 仍有项目既有警告：`--localstorage-file was provided without a valid path`。
- 生产构建通过：
  - `npm run build`
  - webpack 编译成功。
  - 仍有既有体积警告：`index.html (5.13 MiB)` 超过 webpack 推荐体积限制。

阶段结论：

- 用户截图中指出的四个 P2 问题区已完成第一轮代码整改。
- 本轮只改表现层和渲染组织，没有改 MVU/schema 数据结构。
- 后续建议进入浏览器实机视觉验收，重点查看移动宽度下淫纹图腾是否居中、法器匣展开后是否挤压底部导航、沉香/桃花双主题是否都自然。

## 阶段 AY-9：按参考图重绘 P2 淫纹图腾

时间：2026-05-25

触发问题：

- 用户提供参考图，要求淫纹按粉色对称图腾方向设计。
- AY-8 的五段线条图腾虽然比重复“纹”字更好，但仍不够接近参考图中的心形、翼纹、藤蔓和下坠纹身语言。

修复内容：

- `Phase2Page.vue`：
  - 将淫纹区域从 CSS 线段改为内联 SVG 图腾。
  - 图案结构改为 5 个可点亮部件：
    - `core`：中心心形主印。
    - `left`：左翼纹/外延纹。
    - `right`：右翼纹/外延纹。
    - `crown`：上方触角/藤蔓纹。
    - `root`：下方坠纹/尾纹。
  - 保持原有堕落度映射：50 点亮 2 段，60 点亮 3 段，70 点亮 4 段，90 点亮 5 段。
  - 使用 `--hh-*` 主题 token 与 `color-mix()`，在沉香/桃花双主题下都能随主题融合。
- `Phase2Page.test.ts`：
  - 测试从 `.yinwen-stroke` 更新为 `.yinwen-piece`。
  - 继续验证 5 个图腾部件和不同堕落度下的激活部件数量。

验证结果：

- P2 相关组件测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts`
  - 2 个测试文件通过，22 条测试通过。
  - 仍有项目既有警告：`--localstorage-file was provided without a valid path`。
- 生产构建通过：
  - `npm run build`
  - webpack 编译成功。
  - 仍有既有体积警告：`index.html (5.13 MiB)` 超过 webpack 推荐体积限制。

阶段结论：

- P2 淫纹已从文字/线段占位升级为接近参考图语言的粉色对称 SVG 图腾。
- 当前实现不依赖外部图片资源，便于后续继续按不同淫纹能力扩展更多部件。
- 下一步建议用浏览器实机截图验收：重点看图腾在状态栏宽度下是否足够清晰，粉色发光是否压过 P1 双主题，移动端是否居中不溢出。

## 阶段 AY-10：P2 牝奴期主控台【双色蔓延】前端视觉重构

时间：2026-05-26

触发需求：

- 用户给出“合欢宗·惑心魅影 P2 牝奴期主控台：【双色蔓延】UI/UX 全景重构规范”。
- 目标是把 P2 主控台从暗色卡片堆叠继续推进到“玉骨脂白皮肤质感 + 桃花血墨蔓延 + 暗金牵丝凹槽”的表现层。
- 本阶段只改前端视觉和局部交互反馈，不改 MVU schema、待处理交互载荷、动态注入规则或后端校验闭环。

修复内容：

- `StigmaCore.vue`：
  - 牝印核心改为脂白皮肉底、毛孔肌理、暗金丝线和凹槽结构。
  - 堕落度与牝阴决不再表现为传统 HUD，而是两条暗金凹槽；强制状态下凹槽由沉香熟褐转为桃花血墨。
  - 当前命令改为毛笔/行书感文本，强制状态有心跳式轻微脉动。
- `DominatorPanel.vue`：
  - 当前支配者改为悬针朱批与牵丝凝视结构。
  - 无支配者时整体退淡；有支配者时激活暗金与墨紫晕染，hover 时牵丝摆动加快。
- `DailyRoutinePanel.vue`：
  - 日课区域改为脂白纸肉底上的朱批名册，不使用现代任务语义。
  - 文案从“日课”强化为“日课伏侍”，仍保留 `执事名册 / 朱批 / 最近结算` 信息。
- `WhisperPanel.vue`：
  - 羞名风声从列表卡片改为水墨飞白丝线。
  - 空状态保留“风铃暂歇”，加入轻微空响波纹。
  - 点击风声后本地标记锁定态，出现朱砂因果牵丝勒紧动效；emit 与入队行为不变。
- `BrandTagsPanel.vue`：
  - 烙名标签改为脂白底上被血墨轻烙的短签，不再像普通 badge。
- `Phase2Page.vue`：
  - 页面全局改为从宣纸向脂白皮肉过渡的背景，并加入微弱肌理。
  - 身躯改塑从文字印记升级为合欢花图腾，完成态花瓣被桃花血墨浸染。
  - 牝阴决区域从现代条形进度改为暗金凹槽。
  - 拘束法器区域改为脂白底、暗金锁链槽与法器拓印语感。
- `Phase2Page.test.ts`：
  - 改造进度测试从旧的文字 glyph 断言改为合欢花结构断言。

验证结果：

- P2 针对测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts`
  - 2 个测试文件通过，22 条测试通过。
  - 仍有项目既有警告：`--localstorage-file was provided without a valid path`。
- 生产构建通过：
  - `npm run build`
  - webpack 编译成功，`schema_dump` 与 `tavern_sync` 均完成。
  - 仍有既有体积警告：`index.html (5.13 MiB)` 超过 webpack 推荐体积限制，以及 code-splitting 建议。
- `git diff --check` 未发现空白错误；仅提示 `Phase2Page.vue` 与 `Phase2Page.test.ts` 未来会发生 CRLF/LF 换行转换。

阶段结论：

- P2 主控台已完成第一轮“双色蔓延”视觉重构，当前不再以暗色卡片和普通列表为主，而以脂白基底、桃花血墨、暗金牵丝、水墨飞白和合欢花浸染作为主要视觉语言。
- 本阶段没有改变 P2 数据闭环：羞名风声点击仍写入 `系统.待处理交互`，AI 承接规则不变。
- 下一步建议进入浏览器实机视觉验收，重点查看沉香/桃花双主题下脂白底是否与全局状态栏自然衔接、移动端是否无横向溢出、飞白风声点击锁定动效是否足够清晰但不抢正文。

## 阶段 AY-11：P2 功能区语义与双色主题按钮特化

时间：2026-05-26

锚点：

- 已先创建 git 锚点提交：`caf2a5c chore: anchor p2双色蔓延视觉重构`。
- 本阶段改动在该锚点之后继续推进，便于回滚到 AY-10 视觉重构完成态。

触发需求：

- 用户指出 P2 牝奴期功能区仍是 `首页 / 商城 / 背包 / 图鉴`，没有进入牝奴期语义。
- 用户询问 P2 是否需要商城系统和背包系统。
- 决策：保留商城、背包、图鉴的功能内核和路由 key，避免破坏既有数据/交互闭环；在 P2 前端语义中改名为更贴合牝奴期世界观的入口。

修复内容：

- `App.vue`：
  - `PageNav` 新增传入 `store.data.系统.阶段`，使底部功能区能按当前阶段切换语义。
- `PageNav.vue`：
  - 新增 `phase` prop。
  - P1 保持原标签：`首页 / 商城 / 背包 / 图鉴`。
  - P2 改为：`牝印 / 执事库 / 法器匣 / 烙名录`。
  - 路由 key 仍保持 `home / shop / backpack / gallery`，不改变导航行为和页面挂载关系。
  - 牝奴期底栏新增脂白、桃花血墨、暗金牵丝的轻量视觉特化。
- `SystemBar.vue`：
  - 牝奴期主题按钮从通用日/月 SVG 改为 `香 / 绯` 印记按钮。
  - 沉香主题显示 `香`，桃花主题显示 `绯`。
  - 新增 `theme-toggle--p2`、`data-theme-mode`、`p2-theme-mark`、`p2-theme-thread`，让按钮在 P2 中呈现暗金牵丝和桃花血墨呼吸感。
  - 修正主题判断口径，使用现有 `chenxiang / taohua`，不再沿用旧的 `dark` 判断。
- 测试：
  - `PageNav.test.ts` 覆盖 P2 语义替换，并验证点击 `执事库` 仍 emit `shop`。
  - `SystemBar.test.ts` 覆盖 P2 主题按钮类名与 `香 / 绯` 标记。
  - `App.test.ts` 覆盖牝奴期 App 底部功能区显示 `牝印 / 执事库 / 法器匣 / 烙名录`。

验证结果：

- P2 相关目标测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/components/PageNav.test.ts src/雌堕合欢宗/界面/components/SystemBar.test.ts src/雌堕合欢宗/App.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts`
  - 4 个测试文件通过，49 条测试通过。
  - 仍有项目既有警告：`--localstorage-file was provided without a valid path`。
- 生产构建通过：
  - `npm run build`
  - webpack 编译成功，`schema_dump` 与 `tavern_sync` 均完成。
  - 仍有既有体积警告：`index.html (5.14 MiB)` 超过 webpack 推荐体积限制，以及 code-splitting 建议。
- `git diff --check` 未发现空白错误；仅提示部分已修改文件未来会发生 CRLF/LF 换行转换。

阶段结论：

- P2 不需要在当前阶段新增独立“商城/背包”业务系统；更稳妥的口径是保留系统内核，改变牝奴期前端命名与视觉。
- 当前完成的是入口语义和主题按钮特化，不是 `执事库 / 法器匣 / 烙名录` 三个页面的深层视觉重构。
- 下一步可继续把 `shop / backpack / gallery` 页面内部也按 P2 语义改造：执事库偏“承命/供奉/调度”，法器匣偏“拘束法器/身体痕迹”，烙名录偏“羞名、传闻与调教记录”。

## 阶段 AY-12：P2 双色主题 token 穿透修复

时间：2026-05-26

触发需求：

- 用户实机看到 P2 功能栏、导航栏颜色没有融入“双色蔓延”改动。
- P2 牝奴期主题按钮虽然显示 `香 / 绯`，但切换后没有明显作用到 P2 主控台。

根因：

- `useTheme()` 实际会切换 `document.documentElement[data-theme]`，按钮逻辑本身可用。
- 但 P2 色彩 token 原先定义在 `Phase2Page` 或各个 P2 子组件内部，状态栏与底部导航是兄弟节点，拿不到页面内部 token。
- 多个 P2 子组件还局部重定义 `--p2-blood / --p2-gold / --p2-skin` 等变量，导致全局主题切换被局部变量截断。
- `PageNav` 与 `SystemBar` 的 P2 特化样式仍有硬编码色值，无法随 `chenxiang / taohua` 变化。

修复内容：

- `_global.scss`：
  - 在 `data-theme="chenxiang"` 与 `data-theme="taohua"` 下新增全局 P2 token：
    - `--p2-skin / --p2-skin-rgb`
    - `--p2-incense / --p2-incense-rgb`
    - `--p2-blood / --p2-blood-rgb`
    - `--p2-gold / --p2-gold-rgb`
    - `--p2-mist / --p2-mist-rgb`
    - `--p2-skin-shadow / --p2-ash / --p2-purple`
- `App.vue`：
  - `scroll-frame` 新增 `data-phase`。
  - 牝奴期框架背景改为读取全局 P2 token，让状态栏、页面、底栏处在同一脂白/桃花基底中。
- `PageNav.vue`：
  - P2 导航颜色从硬编码 `#c84b5b / #a38353` 改为 `var(--p2-blood) / var(--p2-gold)` 与 `color-mix()`。
- `SystemBar.vue`：
  - P2 状态栏淡出层、堕落圆环、印记、命令高亮和 `香 / 绯` 按钮全部改读全局 P2 token。
  - P2 主题按钮点击后不仅切按钮文案，也能改变 P2 状态栏/导航/主控台可见色彩。
- `Phase2Page.vue` 与 P2 子组件：
  - 移除局部 `--p2-*` 变量覆盖，改为继承全局主题 token。

验证结果：

- 目标测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/components/PageNav.test.ts src/雌堕合欢宗/界面/components/SystemBar.test.ts src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts src/雌堕合欢宗/App.test.ts`
  - 5 个测试文件通过，58 条测试通过。
  - 仍有项目既有警告：`--localstorage-file was provided without a valid path`。
- 生产构建通过：
  - `npm run build`
  - webpack 编译成功，`schema_dump` 与 `tavern_sync` 均完成。
  - 仍有既有体积警告：`index.html (5.14 MiB)` 超过 webpack 推荐体积限制，以及 code-splitting 建议。
- `git diff --check` 未发现空白错误；仅提示部分已修改文件未来会发生 CRLF/LF 换行转换。

阶段结论：

- P2 双色按钮失效不是交互事件问题，而是主题 token 没有穿透到 P2 状态栏、底栏和子组件。
- 当前已把 P2 色彩系统提升到全局主题层，并让主要 P2 外壳/导航/状态栏/主控台继承同一组 token。
- 后续继续改 `执事库 / 法器匣 / 烙名录` 页面时，应直接使用全局 `--p2-*` token，禁止在页面或组件根节点重新定义同名 P2 变量。

## 阶段 AY-13：身体留痕实时改塑面板

时间：2026-05-26

触发需求：

- 用户希望 `身躯改塑` 一栏不再只是静态完成/未完成，而能写出玩家身体的实时变化。
- 约束：当前阶段不改 schema，不要求 AI 额外写入新字段；先用已有 P2 字段在前端派生实时表现。

修复内容：

- `Phase2Page.vue`：
  - 将 `身躯改塑` 改为 `身体留痕 · 实时改塑`。
  - 新增 `bodySignals` 前端派生层，按现有字段生成四条实时体征：
    - `牝印余温`：受 `当前命令 / 命令强度 / 堕落度` 影响。
    - `灵脉牵制`：受 `牝阴决层数` 影响。
    - `花谱染色`：受 `堕落度 / 今日调教次数 / 最近调教结算` 影响。
    - `法器压制`：受 `道具.装备.玩家` 与命令强度影响。
  - 新增 `bodyPressure` 与 `bodyPulseText`，在栏头显示 `脂白未惊 / 暗纹微动 / 牝印温燃 / 血墨急涌`。
  - 三项改造花谱从二值 `done` 扩展为前端阶段：
    - `silent`：未启。
    - `stirring`：异动。
    - `forming`：成形。
    - `sealed`：固化。
  - 花谱状态仍兼容原 `改造进度` 布尔字段；若原字段为 true，则直接进入固化态。
- 样式：
  - 新增牵丝读数条，按 `--signal-value` 显示体征强度。
  - 合欢花谱新增底部血墨浸染线，按 `--mark-value` 显示改塑程度。
  - 高压态加快牵丝呼吸，固化态增加暗金法咒拓印暗纹。
- `Phase2Page.test.ts`：
  - 更新旧的 `身躯改塑` 文案断言为 `身体留痕 / 实时改塑`。
  - 覆盖默认三项花谱与四条实时体征。
  - 覆盖高压命令、牝阴决层数、最近调教结算、装备法器共同影响实时体征。

验证结果：

- 目标测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/pages/Phase2Page.test.ts src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts src/雌堕合欢宗/App.test.ts`
  - 3 个测试文件通过，33 条测试通过。
  - 仍有项目既有警告：`--localstorage-file was provided without a valid path`。
- 生产构建通过：
  - `npm run build`
  - webpack 编译成功，`schema_dump` 与 `tavern_sync` 均完成。
  - 仍有既有体积警告：`index.html (5.15 MiB)` 超过 webpack 推荐体积限制，以及 code-splitting 建议。
- `git diff --check` 未发现空白错误；仅提示部分已修改文件未来会发生 CRLF/LF 换行转换。

阶段结论：

- `身体留痕 · 实时改塑` 现在是一个前端派生仪表层，不改变 P2 数据闭环。
- 它已经能把命令、牝阴决、最近结算、今日次数、装备法器转译为“身体正在变化”的即时反馈。
- 后续若需要更细的剧情驱动变化，可再新增 schema 字段如 `牝奴.身体实时变化[]`，让 AI 直接写入部位、变化、强度、来源与持续时间。

## 阶段 AY-14：五心纹身淫纹图腾替换

时间：2026-05-26

触发需求：

- 用户要求 `淫纹成阵` 使用 `docs/75427087_p0.png` 这张纹身图。
- 图上包含五颗爱心，希望每过一个阶段点亮一颗，并且火焰扩散从内向外加深，颜色随进度填充。

修复内容：

- `Phase2Page.vue`：
  - 将原本的 SVG 子宫心印替换为 PNG 纹身图层。
  - 使用 `?url` 引入 `docs/75427087_p0.png` 作为底图。
  - 叠加两层图像：
    - 底层：保留纹身轮廓，偏淡，使用 `mix-blend-mode: multiply`。
    - 填充层：直接跟随 `堕落度 0-100` 线性变化，按 `clip-path` 圆形扩散半径和透明度实现从内向外逐步浸染。
  - 新增火焰扩散层，模拟从中心向外更深的血墨燃烧。
  - 不再单独维护五颗爱心覆盖点，保留 PNG 原图自身的心形结构即可。
  - `yinwenLabel` 改为连续阶段语义，按 `0/25/50/75/100` 对应 `淫纹初醒 / 淫纹燃心 / 淫纹游身 / 淫纹成阵 / 淫纹满绽`。
- `Phase2Page.test.ts`：
  - 更新 `淫纹` 测试，断言 PNG 纹身层、五颗爱心、`data-yinwen-count`、`--yinwen-spread`、`--yinwen-fill` 和不同阶段亮灯数量。

验证结果：

- 目标测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/pages/Phase2Page.test.ts src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts`
  - 2 个测试文件通过，24 条测试通过。
  - 仍有项目既有警告：`--localstorage-file was provided without a valid path`。
- 生产构建通过：
  - `npm run build`
  - webpack 编译成功，`schema_dump` 与 `tavern_sync` 均完成。
  - 仍有既有体积警告：`index.html (6.09 MiB)` 超过 webpack 推荐体积限制，以及 code-splitting 建议。
- `git diff --check` 未发现空白错误；仅提示部分已修改文件未来会发生 CRLF/LF 换行转换。

阶段结论：

- 纹身图已经替代原 SVG 图腾，视觉重心从“符号线稿”转成“身体纹理”。
- 五颗爱心与扩散层让淫纹进度有了更明确的阶段感，不再只是二值点亮。
- 如果后面觉得 `50/60/70/80/90` 的心点节奏还需要更贴合剧情，我们可以只调阈值，不动现有图层结构。

补充校准：

- 将纹身容器改为 `1 / 1`，匹配 `docs/75427087_p0.png` 的正方形原图比例，避免 `object-fit: contain` 的左右留白导致心点错位。
- 取消额外心点覆盖，避免和 PNG 原生纹身结构产生双重心形。
- 新增 `堕落度=85` 用例，锁定 `淫纹成阵` 阶段的连续填充表现。

二次调整：

- 用户希望低堕落度时也显示淫纹，因此移除 `堕落度 >= 50` 的显示门槛。
- `data-yinwen-progress` 直接使用 `堕落度`，`--yinwen-fill` 从 `0` 到 `1` 连续变化，`--yinwen-spread` 从中心向外连续扩散。

## 阶段 AY-15：P2 法器匣筛选与日课缺装惩戒

时间：2026-05-26

触发需求：

- P2 没有灵石购买逻辑，法器不应呈现为商城商品。
- P2 道具来源应是宗门调教、日课完成、支配者发付，而不是玩家购物。
- P2 法器匣只应展示会扣在玩家身上、影响身体状态、服务日课的法器。
- 当日课要求佩戴指定法器而玩家没有装备时，应出现当场斥责、记入羞名、改派更重惩戒日课的反馈。

实现内容：

- 新增 `src/雌堕合欢宗/界面/data/phase2Routine.ts`：
  - 以前端派生方式建立日课规则，不改 schema。
  - 按当前日课文本推导须扣法器：
    - `听令 / 奉茶 / 侍寝 / 应名 / 点名` → `牝铃 / 听命耳坠`。
    - `束步 / 伏侍 / 行礼 / 跪坐 / 收身` → `牝链 / 束缚绳`。
    - `验印 / 烙名 / 牝印 / 印记` → `牝印 / 淫纹`。
    - `禁溺 / 憋尿 / 忍尿 / 锁溺` → `牝环 / 贞操带`。
  - 同一组需求视为择一满足；若全未装备，则返回 `违令` 状态、羞名与惩戒日课文案。
- `itemDisplay.ts`：
  - 新增 `isP2ArtifactItem`，P2 法器匣只保留：
    - `NSFW道具`
    - `牝奴道具`
    - `牝奴服装列表`
  - 新增 `getP2ArtifactFocus` 和 `getP2ArtifactBodyNote`，用于显示法器作用部位与身体回响。
  - P2 明确排除：特殊道具、剧情钥匙、特殊场景、普通 P1 服装、丹药。
- `BackpackPage.vue`：
  - 在 `系统.阶段 === '牝奴期'` 时改为 `法器匣` 语义。
  - P2 只显示可扣在玩家身上的法器；`时间延长 / 改变阵法 / 欲海回声 / 投欲钥` 等不会出现在 P2 法器匣。
  - P2 装备目标只显示 `己身`，不再展示 NPC 装备目标。
  - 已装备区域改为 `已落锁 / 虚槽未扣`，并显示 `法器身体回响`。
  - 当前日课需要的法器在待扣列表中标记 `朱批点名`。
  - P1 背包仍保留原有 `囊中藏珍 / 法器归属 / NPC 装备目标 / 消耗品使用` 行为。
- `DailyRoutinePanel.vue`：
  - 接收玩家已装备法器列表。
  - 显示 `须扣` 法器、`受令中` 或 `违令 · 羞名` 状态。
  - 缺装时显示改派惩戒日课，例如 `改派「廊前三巡听铃课」`。
  - 保留现代词禁令：不出现 `任务 / 通知 / 商城 / 购买 / 灵石`。
- `Phase2Page.vue`：
  - 将 `equippedItems` 传入 `DailyRoutinePanel`，让主控台能读取玩家装备状态。

验证结果：

- 目标测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/pages/BackpackPage.test.ts src/雌堕合欢宗/界面/components/phase2/phase2Components.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts`
  - 3 个测试文件通过，59 条测试通过。
  - 仍有既有警告：`--localstorage-file was provided without a valid path`。
- 生产构建通过：
  - `npm run build`
  - webpack 编译成功，`schema_dump` 与 `tavern_sync` 均完成。
  - 仍有既有体积警告：`index.html (6.1 MiB)` 超过 webpack 推荐体积限制，以及 code-splitting 建议。
- `git diff --check` 未发现空白错误；仅提示部分已修改文件未来会发生 CRLF/LF 换行转换。

阶段结论：

- P2 的 `法器匣` 已经脱离 P1 背包/特殊道具逻辑，只保留身体法器与牝奴期装备。
- 日课系统现在能从玩家装备状态读出是否满足法器要求，并在缺装时给出羞名与惩戒日课反馈。
- 后续 `执事库` 应继续沿用这个边界：不出现灵石、不出现购买，只做宗门日课、法器发付与承命记录。

## 阶段 AY-16：P2 执事库替代商城入口

时间：2026-05-26

触发需求：

- P2 没有灵石购买逻辑，不能把法器呈现为商城商品。
- P2 入口仍复用既有 `shop` 路由与业务 key，但牝奴期 UI 语义必须改为宗门执事库。
- 玩家获得法器应表现为宗门发付、日课领受、支配者授予，而不是消费购买。

实现内容：

- `ShopPage.vue`：
  - 在 `系统.阶段 === '牝奴期'` 时切换到 P2 专属 `执事库` 模板。
  - P2 顶部展示 `宗门执事库 / 日课发付 / 今日朱批 / 须扣法器`，读取 `getPhase2RoutineState` 的日课要求与缺装状态。
  - P2 分类改为 `日课 / 发付 / 承命`：
    - `日课`：优先展示当前日课点名的法器。
    - `发付`：展示全部可用于牝奴期的身体法器。
    - `承命`：展示当前已经扣在 `道具.装备.玩家` 的法器身体回响。
  - P2 详情弹窗使用 `授 / 身识 / 领受法器` 语义，不展示价格、灵石、购买按钮。
  - `领受法器` 直接增加 `道具.拥有[法器名]`，不扣除 `系统.灵石`，不调用 `记录购买物品`；后续 AY-28 已补强为写入 `系统.待处理交互[].类型=领受法器`，用于下一楼层承接执事库发付。
- P1 商城逻辑保留在 `v-else` 分支：
  - 原有灵石、价格、购买、剧情条目与 pending action 行为不受 P2 改造影响。

验证结果：

- 目标测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/pages/ShopPage.test.ts`
  - 1 个测试文件通过，36 条测试通过。
  - 仍有既有警告：`--localstorage-file was provided without a valid path`。
- 生产构建通过：
  - `npm run build`
  - webpack 编译成功，`schema_dump` 与 `tavern_sync` 均完成。
  - 仍有既有体积警告：`index.html (6.11 MiB)` 超过 webpack 推荐体积限制，以及 code-splitting 建议。
- `git diff --check` 未发现空白错误；仅提示部分已修改文件未来会发生 CRLF/LF 换行转换。

阶段结论：

- P2 的 `shop` 路由现在已经是世界观里的 `执事库`，用户在牝奴期不会看到灵石、价格、商城或购买语义。
- 法器来源闭环改为 `执事库发付 -> 道具.拥有 -> 法器匣扣合 -> 日课读取装备状态`。
- 这一版仍保持前端/MVU 层改造，没有新增 schema、后端校验、AI prompt 或世界书字段。

## 阶段 AY-17：P2 烙名录替代图鉴入口

时间：2026-05-26

触发需求：

- `gallery` 路由在牝奴期不能继续只做 P1 的命魂录图鉴。
- P2 需要一个专门承接羞名、风声、朱批、调教记录与法器承命痕的公开记录页。
- 这个页面必须与“身体留痕”分离，避免重复表达同一层数据。

实现内容：

- `GalleryPage.vue`：
  - 在 `系统.阶段 === '牝奴期'` 时切换到 P2 专属 `宗门烙名录` 模板。
  - P2 页面新增四个归档区：
    - `羞名册`：汇总 `牝奴.羞名标签`、缺装日课派生羞名与风声标签。
    - `朱批录`：汇总当前日课、当前命令、最近调教结算等朱批落账。
    - `风声牵丝`：汇总 P2 羞名风声，点击后只切换 `系统.当前追查风声ID`。
    - `承命痕`：汇总 `牝奴.调教记录` 与 `道具.装备.玩家`，显示已被世界记住的承命结果。
  - P1 原有的 `命魂录 / 心音册 / 风声卷 / 场景志 / 缘起簿` 全部保留在 `v-else` 分支，不影响攻略期。
- `GalleryPage.test.ts`：
  - 新增 P2 牝奴期断言，覆盖：
    - 图鉴入口替换为烙名录
    - 日课缺装派生羞名与惩戒朱批
    - 风声点击聚焦追查
    - 调教记录与已装备法器进入承命痕

验证结果：

- 目标测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/pages/GalleryPage.test.ts`
  - 1 个测试文件通过，31 条测试通过。
  - 仍有既有警告：`--localstorage-file was provided without a valid path`。

阶段结论：

- P2 的 `gallery` 路由现在不再只是 P1 图鉴，而是宗门怎么看你、怎么记你、怎么传你名字的 `烙名录`。
- 它和 `身体留痕` 的边界已经分开：前者记世界与名声，后者记身体与改塑。
- 下一步如果继续深一点，可以把 `烙名录` 再拆成“朱批册 / 风声卷 / 承命簿”三个更明确的页签，但当前版本已经足够把 P2 路由语义立住。

## 阶段 AY-18：P2 导航、执事库页签与状态栏可读性修补

时间：2026-05-26

触发需求：

- 宗门执事库的 `日课 / 发付 / 承命` 三个按钮背景颜色需要同步到 P2 脂白桃花主题。
- 底部导航栏四个入口需要 P2 阶段专属图标，不能继续复用 P1 图标语义。
- 状态栏左侧圆轮进度条需要改成条状。
- P2 状态栏 `辰 / 决 / 课 / 令` 四个状态项字体可见度不足，且 `令` 的命令文本发生溢出。

实现内容：

- `PageNav.vue`：
  - P2 阶段新增四枚专属 SVG 图标：
    - `牝印`：印纹花胚。
    - `执事库`：执事卷册。
    - `法器匣`：锁匣与牵链。
    - `烙名录`：烙名册与朱印。
  - P1 图标分支保留，P1 导航不受影响。
- `ShopPage.vue`：
  - 为 `.p2-tabs .tab-btn` 单独定义脂白、桃花血墨、暗金同步背景。
  - active、hover、默认态都改为 P2 token，不再继承 P1 金箔按钮底色。
- `SystemBar.vue`：
  - P2 左侧 `堕落度` 从圆形花环改为横向血墨进度条。
  - `辰 / 决 / 课 / 令` 四项改为统一脂白小签样式，提高沉香文字和桃花标记可见度。
  - `课 / 令` 文本允许两行内展示，使用 `overflow-wrap` 与 line clamp，避免命令文本横向溢出。

验证结果：

- 目标测试通过：
  - `npx vitest run src/雌堕合欢宗/界面/components/SystemBar.test.ts src/雌堕合欢宗/界面/components/PageNav.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts`
  - 3 个测试文件通过，63 条测试通过。
  - 仍有既有警告：`--localstorage-file was provided without a valid path`。

阶段结论：

- P2 底部导航、执事库页签与顶部状态栏现在都使用同一套脂白桃花视觉语言。
- `令` 不再用单行硬截断展示命令，短命令可以完整显示，长命令会在两行内自然收束。
- 这次仍是纯前端显示层调整，没有新增数据字段或后端逻辑。

## 阶段 AY-19：P2 世界书与叙事脚本闭环校准

时间：2026-05-26

触发需求：

- 用户确认四个功能入口前端闭环后，询问世界书和脚本是否需要同步修改。
- 目标是在不改 schema 的前提下，让 AI 叙事理解 P2 的新闭环：
  - 执事库发付
  - 法器匣扣合
  - 牝印日课读装备
  - 烙名录记录羞名、朱批、风声和承命痕

实现内容：

- `pendingActionPrompt.ts`：
  - P2 阶段玩家装备法器时，不再使用 P1 通用“装备到目标身上”的话术。
  - 新增牝奴期玩家己身装备提示：
    - 这是法器匣承命，不是购物或普通穿戴。
    - 正文必须写法器对身体的即时回响、对当前日课的影响，以及是否被记入羞名/承命痕。
    - 只承认前端已完成的 `道具.装备.玩家`，不要重复插入装备。
  - P2 阶段卸下己身法器时，提示写残痕、违令风险、执事斥责或羞名余波。
  - P2 运行结算提示新增：
    - 必须读取 `道具.装备.玩家` 判断法器对身体、日课和羞名的影响。
    - 缺少日课所需法器时，可写斥责、羞名标签和更重日课。
    - 执事库发付不是商城购买，不得叙述灵石交易。
- `worldRuntimePrompt.ts`：
  - P2 自然楼层提示新增读取 `道具.装备.玩家`。
  - 明确执事库发付不是商城购买，不写灵石交易。
  - scan tokens 增加 `道具.装备.玩家 / 法器匣 / 执事库发付 / 羞名风声`。
- 世界书：
  - `牝奴系统.yaml` 新增 P2 四入口语义、日课与法器规则。
  - `道具系统.yaml` 新增牝奴期法器特例：执事库发付不是购买，法器只扣玩家，AI 只写身体回响、日课影响、羞名压力和承命痕。
  - `变量更新规则.yaml` 新增当前日课、当前命令、命令强度、羞名标签、调教记录的 P2 更新规则，并强调读取 `道具.装备.玩家`。
  - `变量输出格式.yaml` 新增牝奴期法器扣合闭环样例，展示如何清空队列、写命令、最近结算和调教记录，同时不重复写装备数组。
- 测试：
  - `pendingActionPrompt.test.ts` 新增牝奴期玩家扣合法器测试。
  - `worldRuntimePrompt.test.ts` 新增 P2 自然楼层读取法器和禁止商城购买语义断言。

验证结果：

- 目标测试通过：
  - `npx vitest run src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.test.ts`
  - 2 个测试文件通过，30 条测试通过。

阶段结论：

- P2 现在不仅是前端闭环，世界书和叙事脚本也知道四个入口如何互相承接。
- 仍然没有新增 schema 或后端强校验，保持轻量校准。
- 后续若要更强约束，可以再新增显式字段如 `牝奴.当前日课要求法器[]`、`牝奴.违令记录[]`，但当前版本已足够支持 AI 按现有字段叙事。

## 阶段 AY-20：P2 重构工作留痕与恢复点

时间：2026-05-26

触发需求：

- 用户要求“把工作留痕”，用于后续继续开发、复盘或拆分提交。
- 当前 P2 已完成前端入口语义、法器闭环、日课缺装反馈、烙名录归档、世界书与脚本校准，但尚未整理为正式提交。

当前工作树摘要：

- 已改动范围：
  - P2 主控台：`Phase2Page.vue` 与相关测试。
  - P2 顶栏与导航：`SystemBar.vue`、`PageNav.vue` 与相关测试。
  - P2 执事库：`ShopPage.vue` 与相关测试。
  - P2 法器匣：`BackpackPage.vue` 与相关测试。
  - P2 烙名录：`GalleryPage.vue` 与相关测试。
  - P2 日课/法器 helper：`itemDisplay.ts`、`phase2Routine.ts`。
  - P2 世界书与脚本提示：牝奴系统、道具系统、变量更新规则、变量输出格式、`pendingActionPrompt.ts`、`worldRuntimePrompt.ts`。
  - 淫纹素材：`docs/75427087_p0.png`。
- 关键行为链：
  - `执事库发付 -> 道具.拥有`
  - `法器匣扣合 -> 道具.装备.玩家`
  - `牝印` 读取装备、日课和身体状态
  - `烙名录` 读取羞名、朱批、风声和承命痕
- P2 路由语义保持：
  - `home -> 牝印`
  - `shop -> 执事库`
  - `backpack -> 法器匣`
  - `gallery -> 烙名录`
- P1 路由和业务分支保留，当前改动策略仍是 P2 显示层与提示规则优先，不新增 schema，不引入后端强校验。

已验证结果：

- P2 页面和组件回归测试曾通过：
  - `npx vitest run src/雌堕合欢宗/App.test.ts src/雌堕合欢宗/界面/components/SystemBar.test.ts src/雌堕合欢宗/界面/components/PageNav.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts src/雌堕合欢宗/界面/pages/BackpackPage.test.ts src/雌堕合欢宗/界面/pages/GalleryPage.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts`
  - 7 个测试文件通过，154 条测试通过。
- P2 脚本提示回归测试曾通过：
  - `npx vitest run src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.test.ts`
  - 2 个测试文件通过，30 条测试通过。
- 构建曾通过：
  - `npm run build`
  - `schema_dump` 与 `tavern_sync` 完成。

已知风险：

- `docs/75427087_p0.png` 仍是未跟踪素材，且体积较大；当前构建会让 `dist/雌堕合欢宗/index.html` 达到约 6 MiB，并触发 webpack asset-size 警告。
- 工作树仍有大量未提交改动，后续若提交，建议按逻辑拆分：
  - P2 前端视觉与入口语义
  - P2 法器/日课 helper 与闭环
  - P2 世界书与脚本提示校准
  - 文档与素材
- 多个已触碰文件存在 CRLF/LF 提示，当前未发现实际空白错误。

下一步建议：

- 优先做一次浏览器实机 QA：
  - 检查 P2 底部四图标、顶部条状状态、执事库三按钮、`令` 文本换行。
  - 跑通 `执事库发付 -> 法器匣扣合 -> 牝印日课状态变化 -> 烙名录承命痕`。
- QA 通过后再决定是否压缩淫纹素材或调整图片打包方式。
- 若用户要求提交，先精确 stage 本轮 P2 文件，避免误收无关改动。

## 阶段 AY-21：世界书玩家条目模板化整理

时间：2026-05-26

触发需求：

- 用户要求开始整理世界书，并先从玩家条目开始。
- 用户指定参考 `docs/教程/玩家模版.md` 的角色卡方向。
- 用户确认 P2 玩家主体感采用强主体感：玩家仍清醒、有羞耻和抗拒，只是身体和处境被规训；叙事重点应持续体现羞耻感与被凝视感。

实现内容：

- `src/雌堕合欢宗/世界书/玩家/玩家设定.yaml`：
  - 保留 `玩家.meta` 作为蓝灯世界书元信息。
  - 将原本的章节式玩家说明重构为模板式角色卡字段：
    - `identity`
    - `age`
    - `background`
    - `key trait`
    - `physical trait`
    - `special trait`
    - `language style`
    - `relationship`
    - `behavioral tendency`
    - `awareness`
    - `扮演约束`
  - 保留 P1 核心设定：
    - 穿越前史
    - 合欢宗新入门男修身份
    - 九天驭奴诀
    - 系统灵幕
    - 攻略柳素衣与欲海核心主线
  - 新增 P2 玩家主体边界：
    - 牝奴期不是无意识堕落。
    - 玩家仍清醒，仍会羞耻、抗拒和自我审视。
    - 身体可以被牝印、牝阴决、法器、日课和宗门凝视规训，但除非玩家明确表态，不写成完全自愿、彻底认同或主动放弃人格。
  - 新增 P2 变量读取语义：
    - `牝奴.堕落度`
    - `牝奴.牝阴决层数`
    - `牝奴.当前日课`
    - `牝奴.当前命令`
    - `牝奴.命令强度`
    - `牝奴.当前支配者`
    - `牝奴.羞名标签`
    - `牝奴.调教记录`
    - `道具.装备.玩家`
  - 新增 P2 前端入口感知：
    - `牝印`：身体被命令牵动的核心。
    - `执事库`：宗门发付日课与法器的地方。
    - `法器匣`：法器扣到己身后的受控状态。
    - `烙名录`：世界如何记住玩家羞名、风声和承命痕。

验证结果：

- YAML 解析通过：
  - `node -e "const fs=require('fs'); const yaml=require('yaml'); const p='src/雌堕合欢宗/世界书/玩家/玩家设定.yaml'; yaml.parse(fs.readFileSync(p,'utf8')); console.log('YAML OK:', p);"`

阶段结论：

- 玩家条目现在已经和 `docs/教程/玩家模版.md` 的结构对齐。
- P1 的攻略主体和 P2 的受控主体被写在同一角色卡内，避免拆文件导致触发顺序和上下文重复。
- P2 的核心叙事方向已明确：强主体感、持续羞耻、持续被凝视、身体被规训但意识不默认投降。

## 阶段 AY-22：NPC 世界书模板化与 P2 闭环职责整理

时间：2026-05-26

触发需求：

- 用户要求按 `docs/教程/npc开发模版.md` 开始修改 NPC 角色。
- 用户要求先评估修改后是否会影响系统闭环。
- 用户确认白芷年龄改为十八岁，作为成年角色处理。

闭环影响判断：

- NPC 世界书主要影响叙事，不直接被前端代码读取。
- 本次整理保留以下闭环关键接口，避免破坏系统：
  - 顶层 NPC 名：`白芷 / 苏芸 / 纪兰 / 沈月秋 / 柳素衣`
  - `meta.触发词`
  - `meta.攻略链`
  - P1 攻略链顺序：`白芷 -> 苏芸 -> 纪兰 -> 沈月秋 -> 柳素衣`
  - P2 支配者枚举语义：`牝奴.当前支配者`
  - 装备读取边界：玩家法器是否扣合只看 `道具.装备.玩家`

实现内容：

- `src/雌堕合欢宗/世界书/NPC/白芷.yaml`
  - 年龄统一为十八岁。
  - 按 NPC 模板重构为：
    - `基本信息`
    - `外貌特征`
    - `性格特点`
    - `NSFW档案`
    - `背景设定`
    - `语言特征`
    - `关系设定`
    - `P1攻略职责`
    - `P2闭环职责`
    - `叙事边界`
  - P2 定位：低位见证者、羞耻见证与轻微怜悯，不承担主惩戒、记录或最终支配。
- `src/雌堕合欢宗/世界书/NPC/苏芸.yaml`
  - 按同一模板重构。
  - P2 定位：公开调笑、点名、羞耻压力来源；强化玩家被围观感，但不承担正式烙名记录。
- `src/雌堕合欢宗/世界书/NPC/纪兰.yaml`
  - 按同一模板重构。
  - P2 定位：验印、记录、朱批、烙名与承命痕的核心执行者之一。
  - 明确她可检查 `牝奴.当前日课`、`牝奴.当前命令`、命令强度与 `道具.装备.玩家`，但不能凭空替玩家装备法器。
- `src/雌堕合欢宗/世界书/NPC/沈月秋.yaml`
  - 按同一模板重构。
  - P2 定位：资源调配者、缺装惩戒与日课加重来源。
  - 明确她负责量化、复核、加重日课，但不能抢纪兰的记录烙名职责或柳素衣的最终裁定职责。
- `src/雌堕合欢宗/世界书/NPC/柳素衣.yaml`
  - 按同一模板重构。
  - P2 定位：最高支配源、牝印命令裁定者、身份朱批与最终烙名来源。
  - 明确她可裁定日课、命令强度、羞名等级和牝印复核，但不替玩家内心完全投降。

统一叙事红线：

- 不凭空替玩家装备法器；玩家是否扣合以 `道具.装备.玩家` 为准。
- 不把 `执事库` 写成商城，不把法器发付写成灵石购买。
- 不把 `法器匣` 写成普通背包。
- 不绕过 `牝奴.当前日课`、`牝奴.当前命令`、`牝奴.当前支配者` 写独立惩戒。
- P2 玩家仍保留强主体感：清醒、羞耻、抗拒、被凝视；NPC 可以规训身体与处境，但不能替玩家完成心理投降。

验证结果：

- 五个 NPC YAML 文件解析通过：
  - `白芷.yaml`
  - `苏芸.yaml`
  - `纪兰.yaml`
  - `沈月秋.yaml`
  - `柳素衣.yaml`
- `git diff --check -- src/雌堕合欢宗/世界书/NPC` 通过。
- `src/雌堕合欢宗/世界书/NPC` 中无 `十七岁` 或 `17岁` 残留。

阶段结论：

- NPC 世界书已经统一为模板化结构。
- P1 攻略链与 P2 闭环职责被分别写清，不改 schema、不改变量、不改前端。
- 后续整理可继续从 `宗门文化`、`世界运行规则` 或 `牝奴系统` 进入，进一步减少重复规则与冲突表述。

## 阶段 AY-23：玩家/NPC 验收后的 P2 规则校准

时间：2026-05-26

触发需求：

- 用户要求继续验收已修改的玩家和 NPC 世界书：
  - 是否贴合游戏机制。
  - 是否违背世界观。
  - 是否有出戏表述。
- 验收结论指出 `玩家设定.yaml` 与五个 NPC 模板化方向基本正确，但旧 `牝奴系统.yaml` 和 `世界运行规则.yaml` 存在会冲突的残留规则。

发现的问题：

- `牝奴系统.yaml` 仍保留旧 P2 表述：
  - 进入 P2 时“道具和服装随机装备在玩家身上”，会绕过现在的 `执事库发付 -> 法器匣扣合 -> 道具.装备.玩家` 闭环。
  - 高堕落阶段写“主动迎合”“开始享受”“完全接受牝奴身份”“主动请求永久标记”等，会冲掉玩家强主体感。
  - NPC 支配风格仍是旧版“温柔支配 / 药物控制 / 知识调教 / 全面掌控”，与新 NPC 职责分工不一致。
- `世界运行规则.yaml` 的 NPC 日程仍有 P1 语义，例如沈月秋午时的“灵石账房，核算与交易”，在 P2 容易误导为灵石交易或商城购买。

实现内容：

- `src/雌堕合欢宗/世界书/牝奴系统.yaml`
  - P2 进入条件改为：
    - 宗门可发付初始法器、服装或日课要求。
    - 不得凭空随机装备。
    - 玩家己身是否扣合只以 `道具.装备.玩家` 为准。
  - `日课与法器` 增补强主体感规则：
    - 玩家在牝奴期仍清醒、有羞耻、抗拒和被凝视感。
    - 高堕落度代表身体惯性、日课服从压力、羞名条件反射和法器约束增强。
    - 除非玩家明确表态或结局事件触发，不写成自愿放弃人格。
  - 堕落度 10-100 阶段全部校准：
    - 从“主动沉沦/主动迎合/享受支配”改为“身体先于意志回应、抗拒成本升高、被看见与被记录强化羞耻条件反射”。
    - 90-100 阶段也只写宗门默认身份与高强度记录/复核，不替玩家完成心理投降。
  - NPC 支配风格同步为新职责：
    - 白芷：低位见证。
    - 苏芸：公开调笑。
    - 纪兰：验印记录。
    - 沈月秋：资源调配。
    - 柳素衣：最终裁定。
- `src/雌堕合欢宗/世界书/世界运行规则.yaml`
  - `NPC日程资料` 新增 `P2转义`：
    - 牝奴期同一地点优先按日课、支配者传唤、执事库发付、法器匣扣合余波、验印、羞名风声和承命痕承接。
    - 牝奴期不写灵石交易、商城购买、普通任务领取。
    - 牝奴期 NPC 日程不改变 NPC 名称或场景，只改变叙事用途。
  - 沈月秋午时地点从“灵石账房，核算与交易”改为“资源账房”，并明确：
    - 攻略期可核算灵石与交易。
    - 牝奴期转为执事库发付、日课复核、缺装惩戒与牝奴资源调配。

验证结果：

- `世界运行规则.yaml` 可被普通 YAML 解析器解析通过。
- `牝奴系统.yaml` 含 EJS 分段标签，普通 YAML 解析器无法直接解析，这是既有文件结构；本次改用文本一致性检查。
- 已确认以下旧冲突关键词不再残留于 `牝奴系统.yaml`：
  - `主动迎合`
  - `开始享受`
  - `完全接受牝奴身份`
  - `以被支配为荣`
  - `主动制造`
  - `主动策划`
  - `主动寻求多个`
  - `主动配合NPC`
  - `随机装备在玩家身上`
  - `温柔而坚定`
  - `药物控制`
  - `知识调教`
  - `全面掌控`
- `git diff --check` 针对本次两个世界书文件通过。

阶段结论：

- 玩家、NPC、牝奴系统与世界运行规则现在对 P2 主体感和闭环语义基本一致。
- P2 的核心表达已从“自动沉沦”校准为“清醒主体被身体、法器、日课、羞名和宗门凝视持续规训”。
- 当前仍未改 schema、前端和后端校验，只做世界书规则校准。

## 阶段 AY-24：世界设定三层闭环重构

时间：2026-05-26

触发需求：

- 用户要求按照 `docs/教程/世界观开发模版.md` 重整世界设定。
- 需要把以下三个世界书条目纳入同一套闭环：
  - `src/雌堕合欢宗/世界书/世界设定.yaml`
  - `src/雌堕合欢宗/世界书/宗门文化.yaml`
  - `src/雌堕合欢宗/世界书/欲海与印记.yaml`
- 要求保证世界观、P1攻略期、P2牝奴期、欲海暗线、法器/日课/烙名闭环之间不互相冲突。

设计决策：

- 不物理合并三个文件，改为三层职责闭环：
  - `世界设定.yaml`：总纲层，负责地理、历史、功法、宗门架构、P1/P2阶段边界。
  - `宗门文化.yaml`：常驻表层，负责日常氛围、语言、服饰、建筑、凝视文化，不揭示欲海暗线真相。
  - `欲海与印记.yaml`：暗线机制层，负责青云宗、欲海核心、九天驭奴诀、驭奴印记、玄媚仙奴、牝印来源。
- 保留 `欲海与印记.yaml` 的绿灯触发，避免暗线内容常驻污染日常叙事。
- 将 `宗门文化` 在 `index.yaml` 中改为蓝灯，使合欢宗日常氛围稳定常驻。

实现内容：

- `src/雌堕合欢宗/世界书/世界设定.yaml`
  - 按世界观模板重写为：
    - `世界地理`
    - `关键历史/传说`
    - `功法体系`
    - `组织/势力/阵营`
    - `阶段闭环`
  - 明确 P1 攻略期：
    - 剩余天数、灵石、攻略值、欲海搜寻进度、NPC关系、道具拥有与事件记录。
    - 灵石、商会、遮蔽符和特殊道具可作为 P1 资源语义。
  - 明确 P2 牝奴期：
    - 读取 `牝奴.*`、`道具.装备.玩家`、`烙名录`。
    - 资源入口统一写作执事库发付、日课领受、法器匣扣合、烙名录记名。
    - 玩家仍清醒，有羞耻、抗拒、判断处境和被凝视感。
  - 增加 P1 到 P2 的转义规则：
    - P1 道具使用转为 P2 发付/扣合/承受。
    - P1 NPC偶遇转为 P2 召见/检视/日课/记录/风声。

- `src/雌堕合欢宗/世界书/宗门文化.yaml`
  - 按模板重写为常驻文化层：
    - `组织/势力`
    - `语言与称谓`
    - `服饰制度`
    - `建筑与日常`
    - `闭环边界`
  - 保留合欢宗双修、服饰、建筑、熏香、环佩、石壁阴气等氛围。
  - 增加 P2 转义：
    - 普通服饰进入 P2 后成为执事库发付、法器匣扣合、日课要求、羞名记录的载体。
    - 玩家可被称作牝奴、受印者、承命之身、课令承受者。
  - 明确本文件只提供表层文化，不主动揭示青云道人、欲海核心、九天驭奴诀真相。

- `src/雌堕合欢宗/世界书/欲海与印记.yaml`
  - 按模板重写为暗线机制层：
    - `关键历史/传说`
    - `特殊空间/领域`
    - `特殊能力/机制`
    - `具体功法/技术`
    - `交互/关系机制`
    - `P1/P2闭环接口`
  - 明确青云宗、青云道人、欲海核心、阴阳池之间的暗线关系。
  - 将 `九天驭奴诀 -> 驭奴印记 -> 玄媚仙奴` 定义为 P1 攻略成功线。
  - 将 `欲海检测 -> 阴阳池 -> 牝奴诀 -> 牝印` 定义为 P1 失败进入 P2 的机制来源。
  - 明确 P2 主体感边界：
    - 牝印影响身体、法器、日课、身份和凝视。
    - 不等同于完全洗脑。
    - 不把玄媚仙奴机制写成 P2 玩家心理模板。

- `src/雌堕合欢宗/index.yaml`
  - `宗门文化` 激活策略从绿灯改为蓝灯。
  - 使其与文件内 `meta.状态: 蓝灯` 一致，保证合欢宗常驻氛围稳定加载。

验证结果：

- 四个 YAML 均可被普通 YAML 解析器解析：
  - `世界设定.yaml`
  - `宗门文化.yaml`
  - `欲海与印记.yaml`
  - `index.yaml`
- `git diff --check` 针对本次文件通过；仅提示 `index.yaml` 工作区 CRLF 将在 Git 触碰时转为 LF，不是内容错误。
- 禁用/冲突术语检查无命中：
  - `商城购买`
  - `灵石交易`
  - `普通任务领取`
  - `随机装备`
  - `完全接受牝奴身份`
  - `主动迎合`
  - `背包整理`
  - `领取任务奖励`

阶段结论：

- 世界设定已经形成 `总纲层 -> 常驻文化层 -> 暗线机制层 -> P2规则/道具/运行闭环` 的结构。
- P1 的攻略、灵石、欲海倒计时与 P2 的牝印、日课、法器匣、烙名录之间现在有明确转义关系。
- 当前未改 schema、变量结构或前端，仅完成世界书设定闭环与一个必要的入口触发策略修正。

## 阶段 AY-25：合欢宗成人向文风指南补齐

时间：2026-05-26

触发需求：

- 用户要求按照 `docs/教程/仙侠成人向文风预设模版.md` 创建合欢宗专用文风。
- 文风目标：
  - 该保守时保守，该色情时色情。
  - 保持剧情张力。
  - 引导 AI 学会接戏。
  - 多描写样貌、服装、身体细节。
  - 释放玩家与 NPC 的性癖。
  - P2 阶段可增加 SM 百合情节。

发现的问题：

- `src/雌堕合欢宗/index.yaml` 已引用 `世界书/文风指南`，但实际 `文风指南.yaml` 文件不存在。
- 原入口将文风指南设为绿灯关键词触发，不适合作为全局创作规则。

实现内容：

- 新增 `src/雌堕合欢宗/世界书/文风指南.yaml`
  - `meta.状态` 设为蓝灯。
  - 定位为 `脂白桃墨合欢文风`。
  - 作为合欢宗专用仙侠成人向创作指南，覆盖：
    - 文风。
    - 尺度。
    - 身体描写。
    - 服饰描写。
    - 性癖释放。
    - AI接戏。
    - P1/P2叙事边界。

- `场景分层尺度`
  - `日常白描层`：
    - 多写样貌、服装、身体轮廓、动作和衣料牵扯。
    - 用衣物贴合、旁人视线、角色遮掩产生色气。
    - 不让日常场景滑成机械色情。
  - `暧昧蓄势层`：
    - 用距离、停顿、香气、衣料摩擦、灵息乱拍表现张力。
    - 不跳过试探和心理反应。
  - `成人亲密层`：
    - 可更直接写身体接触、衣物剥落、热度、湿意、喘息、压迫感和节奏变化。
    - 要服务关系推进，不写成孤立动作清单。
  - `P2牝奴规训层`：
    - 强调清醒羞耻、法器影响、身体变化、支配展示、宗门凝视。
    - 增加 P2 SM 百合作为可选情节张力。

- `样貌与服饰描写规则`
  - 要求 NPC 出场至少抓住两到三个可识别特征。
  - 样貌必须和身份、修为、性格、当前情绪相连。
  - 服饰作为身体与身份之间的界面来写：
    - 衣料厚薄。
    - 领口高低。
    - 腰带松紧。
    - 裙摆开合。
    - 法器牵动。
    - 旁人视线。
  - 身体细节按场景分级：
    - 日常写轮廓和反应。
    - 亲密写触感和热度。
    - P2写身体被规训的即时反馈。

- `性癖释放规则`
  - 玩家：
    - P1 可写算计、攻略、反向支配、窥探心音、征服欲。
    - P2 可写清醒羞耻、抗拒中的身体反应、被凝视、被命令、被法器改变姿态。
    - 不替玩家宣布彻底认同牝奴身份。
  - NPC：
    - 白芷：怯弱、被保护、偷看后的心虚、低位见证；保留成年设定，不幼态化。
    - 苏芸：骄纵、调笑、公开羞辱、越嘴硬越被身体或情绪出卖。
    - 纪兰：记录、检查、规章、朱批、被记录者反过来牵动她的失衡。
    - 沈月秋：资源调配、药性、法器效果、理性被身体结果反证。
    - 柳素衣：权柄、最终裁定、身份宣告、掌门威压、命契归属。

- `P2_SM百合`
  - 明确为牝奴期可选情节，不是每次 P2 必须触发。
  - 可用结构：
    - 示范型。
    - 共犯型。
    - 镜像型。
    - 交换凝视型。
  - 可写元素：
    - 束带、绛绳、腕扣、铃链、朱批、口令、跪垫、香案、屏风、法器匣。
    - 成年女修之间的耳语、按腕、扶颈、束腰、检视衣纹、整理裙摆、互相点破反应。
    - 玩家被要求旁观、复述、承认看见了什么，或在烙名录上承接这场示范后果。
  - 边界：
    - 不写未成年角色参与。
    - 不让百合情节抢走 P2 主闭环。
    - 必须回流到玩家处境：日课标准、旁观羞耻、法器调试、支配者命令、风声传播或烙名记录。

- `AI接戏协议`
  - 规定 AI 输出必须：
    - 先承接玩家上一句动作或意图。
    - 再让 NPC、法器、牝印、旁人或环境给出反应。
    - 然后推进一个明确后果。
    - 最后停在选择点，不替玩家决定接受、投降、反抗或重大路线。
  - 增加可用钩子：
    - 物件钩子。
    - 视线钩子。
    - 声音钩子。
    - 记录钩子。
    - 命令钩子。

- `src/雌堕合欢宗/index.yaml`
  - `文风指南` 激活策略从绿灯改为蓝灯。
  - 使文风指南成为常驻创作规则，而不是仅靠关键词触发。

阶段结论：

- 文风指南已补齐为可执行的创作规则。
- 它强化样貌、服饰、身体细节、性癖释放、P2羞耻规训和SM百合可选张力。
- 文风指南仍保留玩家强主体感，不把 P2 写成心理自动投降。

## 阶段 AY-26：P2 世界书运行闭环验收修复

时间：2026-05-26

触发需求：

- 用户要求对 P2 世界书闭环做验收，并修复验收发现的问题。
- 验收范围：
  - `变量更新规则.yaml`
  - `变量输出格式.yaml`
  - `动态场景系统.yaml`
  - `牝奴系统.yaml`
  - `文风指南.yaml`
  - `世界设定.yaml`
  - `欲海与印记.yaml`

发现的问题：

- `src/雌堕合欢宗/世界书/动态场景系统.yaml`
  - `v4_1实机兼容协议` 缩进错误，导致普通 YAML 解析失败。
- `src/雌堕合欢宗/世界书/变量/变量输出格式.yaml`
  - P2 法器扣合样例使用 `{ "op": "add" }`。
  - 当前变量输出格式只声明支持 `replace / delta / insert / remove / move`，没有 `add`。
- `src/雌堕合欢宗/世界书/变量/变量更新规则.yaml`
  - 调教记录说明使用 “add 到 /牝奴/调教记录/-”，会误导 AI 输出未声明操作。
- `src/雌堕合欢宗/世界书/世界设定.yaml`
  - P2 变量名写成 `牝奴.牝阴决`、`牝奴.今日支配强度`。
  - 真实变量为 `牝奴.牝阴决层数`、`牝奴.命令强度`。
- `src/雌堕合欢宗/世界书/欲海与印记.yaml`
  - 牝印读取字段写成 `牝奴.今日支配强度`，与真实变量不一致。

实现内容：

- `src/雌堕合欢宗/世界书/动态场景系统.yaml`
  - 将 `v4_1实机兼容协议` 缩进到 `动态场景系统` 条目内部。
  - 修复后普通 YAML 解析器可解析。
- `src/雌堕合欢宗/世界书/变量/变量输出格式.yaml`
  - 将 P2 法器扣合样例中的 `{ "op": "add" }` 改为 `{ "op": "insert" }`。
  - 将说明句中的 “add 到 /牝奴/调教记录/-” 改为 “insert 到 /牝奴/调教记录/-”。
- `src/雌堕合欢宗/世界书/变量/变量更新规则.yaml`
  - 将调教记录说明统一为 `insert 到 /牝奴/调教记录/-`。
- `src/雌堕合欢宗/世界书/世界设定.yaml`
  - 将 `牝奴.牝阴决` 改为 `牝奴.牝阴决层数`。
  - 将 `牝奴.今日支配强度` 改为 `牝奴.命令强度`。
- `src/雌堕合欢宗/世界书/欲海与印记.yaml`
  - 将牝印读取字段中的 `牝奴.今日支配强度` 改为 `牝奴.命令强度`。

验证结果：

- 以下文件均可被普通 YAML 解析器解析：
  - `动态场景系统.yaml`
  - `变量输出格式.yaml`
  - `变量更新规则.yaml`
  - `世界设定.yaml`
  - `欲海与印记.yaml`
- 已确认不再残留无效 `{ "op": "add" }`。
- 已确认关键世界书中不再残留 `今日支配强度`。
- 已确认关键世界书中不再残留错误字段 `牝奴.牝阴决`。
- `git diff --check` 针对本次修复文件通过。

阶段结论：

- P2 世界书闭环中的三个硬错误已修复。
- 当前 P2 变量名、补丁操作与 YAML 结构已与现有变量结构和输出协议对齐。
- 后续可继续做样例 prompt 验收，重点测试缺装惩戒、法器扣合、支配者命令、SM百合示范是否能稳定回流到 `牝奴.调教记录` 与 `牝奴.羞名标签`。

## 阶段 AY-27：P2 样例闭环验收与运行时提示词修复

时间：2026-05-26

触发需求：

- 用户要求继续做 P2 验收。
- 验收目标不是继续扩写设定，而是确认四类典型 P2 场景能否稳定落到现有变量闭环：
  - 缺装惩戒。
  - 法器扣合。
  - 支配者命令。
  - SM 百合示范。

验收依据：

- `src/雌堕合欢宗/界面/data/phase2Routine.ts`
  - `听令/奉茶/侍寝/应名/点名` 要求 `牝铃` 或 `听命耳坠`。
  - `束步/伏侍/行礼/跪坐/收身` 要求 `牝链` 或 `束缚绳`。
  - `验印/烙名/牝印/印记` 要求 `牝印` 或 `淫纹`。
  - `禁溺/憋尿/忍尿/锁溺` 要求 `牝环` 或 `贞操带`。
- `src/雌堕合欢宗/界面/data/phase2Runtime.ts`
  - P2 结算真实字段为：
    - `牝奴.当前日课`
    - `牝奴.当前支配者`
    - `牝奴.当前命令`
    - `牝奴.命令强度`
    - `牝奴.今日调教次数`
    - `牝奴.最近调教结算`
    - `牝奴.调教记录`
  - 调教记录最多保留最近 10 条。
- `src/雌堕合欢宗/界面/data/phase2Rumor.ts`
  - 公开或半私密 P2 事件可转为羞名风声。
  - 羞名风声可以回流为传唤、日课异动、公开凝视或支配事件。
- `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts`
  - 前端待处理交互由脚本提示词注入给 AI。
  - P2 玩家装备法器时应提示“法器匣承命”，并要求正文写身体回响、日课影响、执事/支配者记录。
- `src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.ts`
  - P2 无队列自然楼层也会注入运行账本提示，要求同步日课、支配者、命令和调教记录。

四类样例验收结论：

- 缺装惩戒：
  - 输入状态示例：`系统.阶段=牝奴期`，`牝奴.当前日课=廊前听令`，`道具.装备.玩家=[]`。
  - 前端日课规则会判定缺少 `牝铃 / 听命耳坠`。
  - AI 应写：
    - 执事或支配者发现缺装。
    - 玩家清醒羞耻与抗拒。
    - 身体仍被牝印或旁人目光牵动。
  - 变量应回流：
    - `牝奴.当前日课` 可改为惩戒日课。
    - `牝奴.当前命令` 写斥责、复命、验器或当众应名。
    - `牝奴.命令强度` 提升。
    - `牝奴.羞名标签` 可追加对应羞名。
    - `牝奴.调教记录` 用 `insert /牝奴/调教记录/-` 追加记录。

- 法器扣合：
  - 输入状态示例：`系统.待处理交互[].类型=装备道具`，目标为 `玩家`，道具为 `牝铃`，阶段为 `牝奴期`。
  - AI 应写：
    - 这是法器匣承命，不是普通穿戴。
    - 前端已写入 `道具.装备.玩家`，AI 不重复插入装备。
    - 法器如何影响身体、步态、声音、听令和日课压力。
  - 变量应回流：
    - 清空 `系统.待处理交互`。
    - 写 `系统.时间状态`。
    - 必要时写 `牝奴.当前命令`、`牝奴.最近调教结算`。
    - 若有公开后果，写 `剧情.事件记录` 与 `牝奴.调教记录`。

- 支配者命令：
  - 输入状态示例：当前场景为 `听风廊` 或 `掌门殿偏殿`，在场 NPC 为 `纪兰` 或 `柳素衣`。
  - AI 应写：
    - 支配者命令与当前日课、场景公开度、装备状态一致。
    - 纪兰偏记录、验印、朱批。
    - 柳素衣偏最终裁定、掌门威压、身份朱批。
  - 变量应回流：
    - `牝奴.当前支配者`
    - `牝奴.当前命令`
    - `牝奴.命令强度`
    - `牝奴.最近调教结算`
    - `牝奴.调教记录`

- SM 百合示范：
  - 输入状态示例：P2 场景中有成年女修示范束缚、检视、跪礼或训诫。
  - AI 应写：
    - 百合情节作为宗门女尊秩序和共犯凝视，不抢走 P2 主闭环。
    - 玩家被要求旁观、复述、承认看见了什么，或被要求按示范承接日课。
    - 仍保留玩家清醒羞耻、抗拒和选择点。
  - 变量应回流：
    - 若示范影响玩家日课，写 `牝奴.当前日课` 或 `牝奴.当前命令`。
    - 若示范公开传播，写 `剧情.事件记录`、羞名风声或 `牝奴.调教记录`。
    - 若涉及法器调试，必须读取 `道具.装备.玩家`。

发现的新问题：

- 世界书在 AY-26 已统一 JSONPatch 数组追加操作为 `insert`。
- 但运行时注入脚本仍残留旧口径：
  - `pendingActionPrompt.ts` 中写着“禁止使用insert，数组追加统一使用add到/-”。
  - `worldRuntimePrompt.ts` 中写着“add /剧情/事件记录/-”和“add /牝奴/调教记录/-”。
- 这会直接覆盖世界书规则，导致 AI 在实机里输出未声明的 `add` 操作。

实现修复：

- `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts`
  - 将 JSONPatch 安全约束改为：
    - 数组追加统一使用 `insert到/-`。
    - 字段改写使用 `replace`。
    - 禁止使用未声明的 `add` 操作。
- `src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.ts`
  - 将 `add /剧情/事件记录/-` 改为 `insert /剧情/事件记录/-`。
  - 将 `add /牝奴/调教记录/-` 改为 `insert /牝奴/调教记录/-`。
  - 将运行账本里的现代词 `任务接取` 改为 `事务承接`。
- `src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts`
  - 更新断言，要求提示词包含 `insert到/-` 和 `禁止使用未声明的add操作`。
- `src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.test.ts`
  - 更新断言，要求提示词包含 `insert /剧情/事件记录/-` 与 `insert /牝奴/调教记录/-`。

验证结果：

- 定向测试通过：
  - `pendingActionPrompt.test.ts`
  - `worldRuntimePrompt.test.ts`
  - 共 30 个测试全部通过。
- 残留检索无命中：
  - `add /`
  - `"op": "add"`
  - `禁止使用insert`
  - `add到/-`
  - `任务接取`
  - `今日支配强度`
- `git diff --check` 针对本次脚本和测试文件通过。
- YAML 检查：
  - `动态场景系统.yaml` 通过。
  - `变量输出格式.yaml` 通过。
  - `变量更新规则.yaml` 通过。
  - `文风指南.yaml` 通过。
  - `牝奴系统.yaml` 因含 EJS 分阶段标签，不能用普通 YAML 解析器解析，这是既有结构，不作为失败项。

阶段结论：

- P2 四类样例闭环在规则层可落到现有变量。
- 运行时注入提示词已与世界书输出协议统一为 `insert`。
- 目前最值得继续实测的是“AI实际楼层输出”：
  - 玩家缺少日课法器时，AI 是否真的写羞名与调教记录。
  - 玩家扣合牝铃时，AI 是否只承认前端装备，不重复改变量。
  - 柳素衣/纪兰命令是否能写入正确支配者和命令强度。
  - SM 百合示范是否回流到玩家日课和烙名记录，而不是游离成支线。

## 阶段 AY-28：P2 执事库领受闭环与调试面板可读性修复

时间：2026-05-26

触发需求：

- 继续 P2 验收时发现 `执事库` 领受法器只增加 `道具.拥有`，没有写入 `系统.待处理交互`。
- 这会导致下一楼层 AI 无法承接“宗门发付 / 日课领受”的剧情事实。
- 调试面板部分文字透明度过低，在验收 P2 状态时可读性不足。

实现内容：

- `usePendingAction.ts`
  - 新增待处理交互类型 `领受法器`。
  - 新增 `记录领受法器()`，写入：
    - `类型=领受法器`
    - `目标=玩家`
    - `道具`
    - `道具显示名`
    - 数量、时辰、场景和叙事辅助字段。
- `ShopPage.vue`
  - P2 点击 `领受法器` 后继续即时增加 `道具.拥有[法器名]`。
  - 同时写入 `系统.待处理交互[].类型=领受法器`。
  - 不扣 `系统.灵石`，不调用 `记录购买物品`。
- `pendingActionPrompt.ts`
  - 新增 `领受法器` 分支：
    - 明确这是 `执事库领受 / 宗门发付 / 日课领受`。
    - 明确不是购物或灵石交易。
    - 要求正文承接发付来源、当前日课关系、执事或支配者记录。
    - 明确变量层只承认前端已写入 `道具.拥有`，不要重复增加库存。
  - 扫描词新增 `执事库 / 发付 / 日课领受 / 道具.拥有 / 法器匣`。
- `schema.ts` 与 `schema.json`
  - `系统.待处理交互[].类型` 允许 `领受法器`。
- 世界书规则：
  - `变量列表.yaml` 类型枚举加入 `领受法器`。
  - `变量更新规则.yaml` 新增 `领受法器` 承接规则。
  - `道具系统.yaml` 明确执事库领受只写库存和 `领受法器` 队列，AI 不重复加库存。
- `DebugPanel.vue`
  - 新增 `--debug-text / --debug-muted / --debug-field / --debug-strong` 高对比调试色。
  - 提升标签、输入框、下拉框、数值、空状态、待处理字段和关闭按钮的文字可读性。

验证结果：

- TDD 红测确认旧缺口：
  - `ShopPage.test.ts` 先失败于 `系统.待处理交互` 长度为 0。
  - `pendingActionPrompt.test.ts` 先失败于 `领受法器` 落入默认分支。
  - `DebugPanel.test.ts` 先失败于主要文字命中低透明颜色。
- 修复后定向测试通过：
  - `pnpm vitest run "src/雌堕合欢宗/界面/pages/ShopPage.test.ts" "src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.test.ts" "src/雌堕合欢宗/界面/components/DebugPanel.test.ts"`
  - 3 个测试文件通过，76 条测试通过。
- 兼容测试通过：
  - `pnpm vitest run "src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.test.ts" "src/雌堕合欢宗/脚本/后端校验/validate.test.ts"`
  - 2 个测试文件通过，86 条测试通过。
- `git diff --check` 无空白错误；仅保留既有 CRLF/LF 换行提示。
- 浏览器实机验收：
  - 当前 SillyTavern 页面 `http://localhost:8000/`，iframe 可访问。
  - 通过调试面板切换 `系统.阶段=牝奴期`。
  - 原 `商城` 导航在 P2 显示为 `执事库`，页面显示 `宗门执事库 / 日课发付 / 今日朱批`。
  - `发付` 页签显示可发付法器列表。
  - 点击 `牝铃 -> 领受法器` 后，页面显示 `牝铃 / 牝奴体器 / 已领受`。
  - 调试面板显示 `待处理 1`，队列内容为 `#1 领受法器 / 玩家 / 道具 牝铃 / 数量 1 / 时辰 晨时 / 场景 莲灯前苑`。
  - 调试面板文字在快照中可正常读取。

阶段结论：

- P2 `执事库发付 -> 道具.拥有 -> 系统.待处理交互(领受法器) -> 下一楼层叙事承接` 已补齐。
- P2 仍不引入商城、灵石购买或普通背包购物语义。
- 调试面板可读性已提升，后续实机验收更容易确认变量变化。

## 阶段 AY-29：P2 实际楼层输出验收

时间：2026-05-26

验收目标：

- 验证 `执事库领受法器 -> 下一楼层 AI 承接 -> JSONPatch 清空队列 -> P2 状态栏更新` 是否真实闭环。
- 验证 P2 语义是否保持为 `发付 / 日课 / 法器 / 牝印规训`，不回退成商城、灵石交易或普通背包语义。

实测输入：

- 前置状态：
  - `系统.阶段=牝奴期`
  - `系统.待处理交互[0].类型=领受法器`
  - `系统.待处理交互[0].道具=牝铃`
  - 前端执事库显示 `牝铃 / 牝奴体器 / 已领受`
- 用户发送：
  - `我低头看着刚领到的牝铃，强忍羞耻，等执事下一步吩咐。`

实测输出结果：

- 正文承接成功：
  - AI 用中文承接 `牝铃`、`沈月秋`、`执事库`、`扣合左脚踝`。
  - 叙事明确写出沈月秋要求玩家扣上牝铃，牝铃以灵气封锁并被执事名册朱批记录。
  - 未出现购物、灵石支付、商城购买等出戏语义。
- 最新状态栏更新成功：
  - 顶栏显示 `课 佩戴牝铃`。
  - 顶栏显示 `令 扣合左脚踝，听铃应命`。
  - `执事名册` 显示 `日课伏侍 / 佩戴牝铃`。
  - `牵丝凝视` 显示 `沈月秋 · 牵丝在手`。
  - `身体留痕 · 实时改塑` 显示 `牝印余温 / 受令 / 扣合左脚踝，听铃应命的残响仍压在灵识边缘`。
- 最新调试面板验证成功：
  - `待处理 0`
  - `待处理交互为空`
  - `当前场景=执事库`
  - `地点=执事库`
  - `子区域=发付案台`
  - `公开度=半私密`
  - `在场NPC=沈月秋`
  - `系统.时间状态.当前日=31`
  - `系统.时间状态.最近耗时=一刻钟内`
  - `系统.时间状态.最近结算原因=执事库发付法器`
  - `系统.时间状态.最近事件类型=领受法器`
  - `剧情.事件记录` 写入 `玩家在执事库由沈月秋监督扣合牝铃`
  - `牝奴.当前日课=佩戴牝铃`
  - `牝奴.当前支配者=沈月秋`
  - `牝奴.当前命令=扣合左脚踝，听铃应命`
  - `牝奴.最近调教结算=沈月秋于执事库监督你扣合牝铃，并于名册划下朱批。`
  - `牝奴.调教记录` 写入 `被迫扣合牝铃`

诊断说明：

- 验收过程中一度看到首楼调试面板仍显示 `待处理 1`。
- 根因不是变量未清空，而是页面存在多个状态 iframe；首楼 iframe 保留旧变量快照，最新回复楼层 iframe 才是本次变量更新结果。
- 切换打开最新回复楼层的 `__HH_DEBUG__` 后，确认最新变量为 `待处理 0`。

阶段结论：

- P2 `领受法器` 实际楼层闭环通过。
- 前端、运行时提示词、世界书规则、AI 输出和状态栏展示已在这一条链路上对齐。
- 下一步建议继续验收：
  - 玩家有日课要求但未装备指定法器时，AI 是否写入差别对待、羞名和调教记录。
  - 玩家装备/卸下法器后，法器匣是否能继续写入待处理交互并被下一楼层承接。
  - P2 羞名风声点击后，是否能推进 `烙名录 / 听风羞名 / 调教记录` 三处状态。

## 阶段 AY-30：add 协议回退、时辰崩栏修复与快速测试矩阵

时间：2026-05-26

触发问题：

- 实机 P2 缺装惩戒楼层已能叙事承接，但额外变量更新层输出 `add /牝奴/调教记录/-`、`add /剧情/事件记录/-`。
- 之前世界书和运行时提示曾临时统一到 `insert`，但当前预设/额外模型侧已修补并要求回到 `add`。
- 状态栏出现 ZodError：
  - `牝奴.调教记录[0].时辰 = "辰时"`
  - schema 只允许 `晨时/午时/酉时/亥时`
  - 导致 P2 状态栏无法正确渲染。

实现修复：

- JSONPatch 输出协议回退到 `add`：
  - `世界书/变量/变量输出格式.yaml`
  - `世界书/变量/变量更新规则.yaml`
  - `世界书/动态场景系统.yaml`
  - `worldRuntimePrompt.ts`
  - `pendingActionPrompt.ts` 保持“禁止 insert，数组追加 add 到 /-”。
- `mvuCommandSanitizer.ts`
  - 放行白名单安全数组追加：
    - `add /牝奴/调教记录/-`
    - `add /剧情/事件记录/-`
    - `add /系统/风声列表/-`
    - `add /系统/心音回响/-`
  - 继续拦截非白名单 `add/insert`，例如数值加减或非可信路径。
  - 兼容额外解析器把 `add /数组/-` 转成内部 `insert 数组 '-' value` 的情况。
- `schema.ts`
  - 记录类时辰字段改为字符串兜底，避免旧楼层或 AI 写入 `辰时/戌时` 时整栏崩溃。
  - `系统.时辰` 仍保持四段枚举，避免时间推进逻辑变乱。
- `validate.ts`
  - 在变量校验阶段把未支持时辰归一化到四段时辰。
  - 已覆盖：
    - `系统.时辰`
    - `剧情.事件记录[].时辰`
    - `牝奴.调教记录[].时辰`
- `itemDisplay.test.ts`
  - 修复后端入口测试：改为验证 `createNarrativePromptRuntime` 功能接入，不再依赖精确 import 排版。

快速验证结果：

- 定向协议/状态栏测试：
  - `pendingActionPrompt.test.ts`
  - `worldRuntimePrompt.test.ts`
  - `mvuCommandSanitizer.test.ts`
  - `characterRegex.test.ts`
  - 结果：50 passed。
- 逻辑 / MVU / P1 组合：
  - `validate.test.ts`
  - `mvuCommandSanitizer.test.ts`
  - `p2DominanceBaseline.test.ts`
  - `guards.test.ts`
  - 结果：147 passed。
- P1 与通用前端组合：
  - `App.test.ts`
  - `SystemBar.test.ts`
  - `HomePage.test.ts`
  - `BackpackPage.test.ts`
  - `ShopPage.test.ts`
  - `itemDisplay.test.ts`
  - 结果：133 passed。
- 角色卡全量测试：
  - `pnpm vitest run "src/雌堕合欢宗"`
  - 结果：36 files passed，544 tests passed。
- 构建：
  - `npm run build:dev`
  - 结果：通过，已重新生成 `schema.json` 并同步角色卡/世界书/预设。

浏览器实机快检：

- SillyTavern 页面：`http://localhost:8000/`
- 刷新后滚动到最新 P2 楼层，最新状态栏 iframe 正常显示。
- 可见 P2 状态栏 iframe 数量：1。
- 旧状态栏 iframe 已隐藏：`display=none`、`height=0`。
- 最新状态栏显示：
  - `课 执事库复核`
  - `令 领受牝铃，即刻前往执事库复核`
  - `听风羞名 / 挂牌`
  - `身体留痕 · 实时改塑`
- iframe 内无 `ZodError / invalid_value / 无效选项 / TypeError` 文本。
- 刷新后的当前控制台无新的 ZodError；剩余 `SPresetSettings already declared` 与 404 资源错误来自外部扩展/资源层，不属于本项目状态栏链路。

阶段结论：

- `add` 协议已恢复，并与世界书、运行时提示、sanitizer、fallback 保持一致。
- `辰时` 这类非四段时辰不会再导致状态栏崩溃；validate 会尽量归一化，schema 作为防崩兜底。
- P1、MVU 逻辑、P2 状态栏与构建均已快速通过。

## 阶段 AY-31：P1 主闭环回归、背包玩家目标移除与最终收口

时间：2026-05-26

触发问题：

- P1 背包仍显示 `玩家` 作为装备目标，且允许把 P1 物品装备到玩家身上。
- P2 要保留 `己身` / `玩家` 法器扣合逻辑，不能被 P1 修复误伤。
- P2 大改后需要快速确认 P1 主玩法闭环没有被导航、商城、背包、图鉴和 MVU 规则改动打断。

实现修复：

- `BackpackPage.vue`
  - P1 装备目标改为仅 NPC：
    - `白芷`
    - `苏芸`
    - `纪兰`
    - `沈月秋`
    - `柳素衣`
  - P1 下 `玩家` 不再显示在装备按钮或法器归属区域。
  - P1 下 `toggleEquip('玩家')` 直接拒绝。
  - P1 玩家专属 / 牝奴服不再提供装备目标。
  - P2 仍保持只显示 `己身`，并写入底层 `道具.装备.玩家`。
- `BackpackPage.test.ts`
  - 补充 P1 不显示玩家目标、不允许装备玩家的回归测试。
  - 调整 P1 目标索引，白芷从旧的第 2 个目标变为第 1 个目标。
  - 保留 P2 `己身` 法器扣合测试。

P1 闭环验收：

- NPC 攻略闭环：
  - 首页按 `场景上下文.在场NPC` 或当前场景过滤 NPC。
  - NPC 卡片、好感 / 攻略值、心音聚焦、风声追查、后端攻略值推进规则通过。
  - 自动化结果：
    - 前端 / 场景 / 待处理 / 后端组合共 232 tests passed。
- 特殊道具：
  - `时间延长`
  - `欲海遮蔽符`
  - `改变阵法`
  - `欲海回声`
  - `投欲钥`
  - 自动化结果：5 files，190 tests passed。
  - 浏览器现场确认 P1 商城特殊页显示 5 个特殊道具，未混入 P2 法器。
- 普通物品购买 / 装备：
  - 自动化结果：
    - `ShopPage / BackpackPage / usePendingAction`：83 tests passed。
    - `pendingActionPrompt / validate`：107 tests passed。
  - 浏览器现场确认：
    - 选择 `裂裾启羞裤` 后只显示 5 个 NPC 目标。
    - 未出现 `玩家` / `己身`。
    - 点击 `白芷` 后显示 `白芷：裂裾启羞裤`。
    - 背包库存扣除。
- 丹药闭环：
  - 自动化结果：6 files，197 tests passed。
  - 浏览器现场确认：
    - 商城丹药页分组显示 `临时丹药 / 永久丹药 / 仙奴丹`。
    - 购买 `引香丹` 成功并进入背包。
    - 选择 `引香丹` 后只显示当前在场 NPC `纪兰`。
    - 未出现 `玩家` / `己身`。
    - 使用后背包扣除。
- 场景令牌 / 图鉴闭环：
  - 自动化结果：6 files，201 tests passed。
  - 浏览器现场确认：
    - 购买 `合契浴令` 后解锁真实地点 `阴阳池`。
    - `风声卷` 出现场景令牌入口风声。
    - `场景志` 的 `已解锁` 中出现 `阴阳池`。
    - 令牌不作为背包物品处理。
- 剧情钥匙 / 图鉴闭环：
  - 自动化结果：
    - 前端剧情 / 图鉴 / 风声：94 tests passed。
    - 提示注入 + 后端校验：107 tests passed。
  - 浏览器现场确认：
    - 购买 `断鸢玉扣` 成功。
    - 不进入背包。
    - `风声卷` 出现 `剧情钥匙` 入口风声。
    - `缘起簿` 出现 `白芷旧誓线`。
- P1 -> P2 阶段切换回归：
  - 后端校验 + MVU sanitizer：99 tests passed。
  - P2 前端初始化 / 状态栏 / 组件：53 tests passed。
  - P1/P2 商城、背包、图鉴隔离：146 tests passed。
  - 覆盖：
    - `剩余天数=0` 进入 `牝奴期`。
    - P2 初始化字段正常。
    - P2 中 NPC 攻略值冻结。
    - P1 普通道具不污染 P2 法器匣。
    - P2 法器仍只允许 `己身`。
    - MVU 校验不因 P1 留存数据崩溃。

最终收口验证：

- 全量角色卡测试：
  - 命令：`pnpm vitest run "src/雌堕合欢宗"`
  - 结果：36 files passed，545 tests passed。
- 构建：
  - 命令：`npm run build:dev`
  - 结果：通过。
  - `schema_dump` 已生成 `schema.json`。
  - `tavern_sync` 已同步角色卡 / 世界书 / 预设。

阶段结论：

- P1 背包已彻底移除玩家装备目标。
- P1 物品、丹药、特殊道具、场景令牌、剧情钥匙、图鉴与风声入口闭环通过。
- P2 法器 `己身` 扣合逻辑未被 P1 修复破坏。
- P1/P2 前端语义隔离、MVU 校验、运行时提示注入和构建链均通过最终收口。

## 阶段 AY-32：发布、角色卡 JSON 打包与入口主页修复

时间：2026-05-26

目标：

- 将状态栏、入口主页、MVU 脚本、变量结构脚本、后端校验脚本发布到公开仓库并由 CDN 加载。
- 打包可导入酒馆的角色卡。
- 修复导入后入口主页点击入口无反应的问题。

发布路线结论：

- 当前主仓库已设为公开仓库：`chen986347310-svg/tavern_helper_template`。
- 当前运行资源目录为 `public/hehuan/`。
- 当前角色卡运行资源统一使用：
  - `https://cdn.jsdelivr.net/gh/chen986347310-svg/tavern_helper_template@main/public/hehuan`
- 已废弃路线：
  - 本地 `5500` 端口交付。
  - 独立 `hehuan-cloud-assets` 仓库。
  - 私有仓库直接给 CDN 读取。
  - JSON 内容伪装为 `.png` 交付。

角色卡打包问题与修复：

- 根因：
  - `src/雌堕合欢宗/index.yaml` 中 `头像: null`。
  - `tavern_sync.mjs bundle 雌堕合欢宗` 在头像为空时生成的是 JSON 内容。
  - 工具仍按 `导出文件路径` 输出为 `dist/雌堕合欢宗.png`，导致酒馆按图片导入失败。
- 处理：
  - 打包后将 `dist/雌堕合欢宗.png` 改名为 `dist/雌堕合欢宗.json`。
  - 确认 JSON 可解析，规格为 `chara_card_v3`，`spec_version = 3.0`。

入口主页点击无反应问题：

- 根因：
  - 入口页通过 `$('body').load(...)` 注入后，旧脚本依赖 `document.currentScript.closest('[data-hh-entry-home]')`。
  - 在酒馆 iframe / jQuery load 场景中，`document.currentScript` 可能无法稳定指向入口页脚本，导致根节点为空、按钮事件未绑定。
- 修复：
  - 改为 `document.querySelectorAll('[data-hh-entry-home]')` 获取最后一个入口根节点。
  - 点击时再从 `globalThis`、`parent`、`top` 多路径解析 `setChatMessages`。
  - 若 API 不存在，必须在入口页显示提示，不再静默失败。
- 本地最小验证：
  - 4 个入口按钮均能绑定 click。
  - 点击第 4 个入口会调用 `setChatMessages([{ message_id: 0, swipe_id: 3 }], { refresh: 'all' })`。

CDN 缓存处理：

- `testingcf.jsdelivr.net @main` 在本次发布中持续返回旧入口页缓存。
- 使用 `https://www.jsdelivr.com/tools/purge` 刷新标准 `cdn.jsdelivr.net` URL 后，`cdn.jsdelivr.net @main` 已返回新版入口页。
- 后续发布统一使用 `cdn.jsdelivr.net`，并用 jsDelivr purge 工具刷新：
  - `entry-home.html`
  - `status/index.html`
  - `mvu.js`
  - `var_structure.js`
  - `backend_validate.js`

验证记录：

- `cdn.jsdelivr.net` 入口页检查：
  - `stableRootSelector = True`
  - `oldCurrentScriptCode = False`
  - `resolveApi = True`
- 定向测试：
  - `pnpm vitest run "src/雌堕合欢宗/characterRegex.test.ts" "src/雌堕合欢宗/界面/data/itemDisplay.test.ts"`
  - 结果：2 files passed，20 tests passed。
- 角色卡 JSON 检查：
  - 包含 `cdn.jsdelivr.net/gh/chen986347310-svg/tavern_helper_template@main/public/hehuan`。
  - 不包含 `testingcf.jsdelivr.net`。
  - 包含入口主页和状态栏地址。

文档沉淀：

- 新增 `docs/雌堕合欢宗-发布维护与开发经验-2026-05-26.md`，作为后续发布和维护的权威手册。
- 更新 `docs/前端架构指南.md` 与 `docs/教程/开发规范与智能体协作指南.md` 的当前发布口径。
- 更新状态栏和前端构建教程，将 `localhost:5500` 降级为历史本地调试方式。
