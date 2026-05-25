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
