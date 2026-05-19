# PRD: 雌堕合欢宗 界面架构重组

## Problem Statement

雌堕合欢宗项目的前端界面存在以下问题：
- NPC 卡片使用网格布局，信息密度过高，首页视觉杂乱
- 系统状态栏使用简单的文字标签（"境 攻略期"），缺乏修仙世界观的沉浸感
- 没有牝奴期（Phase 2）的独立界面，无法展示堕落度、改造进度等关键信息
- 缺少开发阶段的调试工具，无法快速测试各种游戏状态下的视觉效果
- NPC 角色没有立绘图片，视觉辨识度低

## Solution

对前端界面进行全面架构重组：
- NPC 卡片从网格改为水平横条折叠式，三态视觉（灰锁→专属色→金框），带角色立绘
- 系统状态栏重新设计：攻略期用 5 个太极图标显示攻略进度，牝奴期用樱花圆环显示堕落度
- 新增牝奴期独立页面，展示堕落度、改造进度、牝阴决层数、道具状态
- 新增仅开发模式可用的调试面板（Ctrl+Shift+D 触发），可手动操控所有游戏变量
- 生成角色立绘图片提示词文档，用于 AI 生成 5 位 NPC 的半身像立绘

## User Stories

1. As a 玩家, I want to see NPC 卡片以水平横条形式排列, so that 首页信息层次更清晰不杂乱
2. As a 玩家, I want to see未开始的 NPC 卡片显示为灰色且不可点击, so that 我能一眼区分哪些 NPC 还未攻略
3. As a 玩家, I want to see进行中的 NPC 卡片显示该 NPC 的专属色光晕, so that 每个 NPC 有独特的视觉身份
4. As a 玩家, I want to see已完成的 NPC 卡片显示金色边框, so that 我能清晰看到攻略成就
5. As a 玩家, I want to see NPC 卡片左侧显示角色立绘, so that 我能通过图片辨认角色
6. As a 玩家, I want to click 彩色或金色卡片后从名字下方展开详细信息, so that 我能查看好感度、攻略值和装备
7. As a 玩家, I want to see展开区域中好感度和攻略值的进度条和数字, so that 我能精确了解攻略进度
8. As a 玩家, I want to see展开区域中装备信息用折叠面板显示, so that 界面不会因为装备过多而显得拥挤
9. As a 玩家, I want to see同时只展开一个 NPC 卡片, so that 界面保持整洁
10. As a 玩家, I want to see首页顶部用 5 个太极图标显示攻略进度, so that 我能一眼看到整体攻略情况
11. As a 玩家, I want to see未攻略的太极图标显示蓝色幽光, so that 我知道哪些 NPC 还未完成
12. As a 玩家, I want to see已攻略的太极图标显示粉红色幽光, so that 我知道哪些 NPC 已完成
13. As a 玩家, I want to see太极图标按攻略链顺序排列, so that 我能看到攻略的线性进度
14. As a 玩家, I want to see当剩余天数归零时自动切换到牝奴期界面, so that 游戏阶段转换是无缝的
15. As a 玩家, I want to see牝奴期页面用樱花圆环显示堕落度, so that 我能直观感受到角色的堕落程度
16. As a 玩家, I want to see樱花圆环每 20% 堕落度亮一瓣, so that 堕落进度有清晰的视觉分段
17. As a 玩家, I want to see牝奴期页面显示当前阶段的身体变化描述, so that 我能沉浸在角色的转变过程中
18. As a 玩家, I want to see牝奴期页面显示改造进度（泌乳/肛门/憋尿）, so that 我能了解改造状态
19. As a 玩家, I want to see牝奴期页面显示牝阴决层数和进度条, so that 我能了解功法修炼进度
20. As a 玩家, I want to see牝奴期页面用折叠面板显示道具状态, so that 界面保持简洁
21. As a 玩家, I want to see页面切换时有平滑的过渡动画, so that 界面切换更流畅自然
22. As a 开发者, I want to use Ctrl+Shift+D 调出调试面板, so that 我能快速测试各种游戏状态
23. As a 开发者, I want to see调试面板中可以一键切换攻略期/牝奴期, so that 我能快速验证两个阶段的界面
24. As a 开发者, I want to see调试面板中可以手动修改好感度、攻略值、堕落度等数值, so that 我能测试三态视觉效果
25. As a 开发者, I want to see调试面板中有一键全攻略完成和一键重置按钮, so that 我能快速切换到极端状态进行测试
26. As a 开发者, I want to see调试面板仅在开发模式下存在, so that 正式发布时玩家看不到调试工具
27. As a 开发者, I want to see调试面板修改数据后界面实时更新, so that 我不需要手动刷新页面
28. As a 开发者, I want to have角色立绘图片提示词文档, so that 我能用 AI 工具生成 NPC 立绘图片
29. As a 开发者, I want to see提示词文档中每个角色有详细的中文和英文提示词, so that 我能在不同的 AI 图片生成工具中使用
30. As a 开发者, I want to see提示词文档中包含图片规格要求（尺寸、风格、构图）, so that 生成的图片能直接用于项目

## Implementation Decisions

### 模块划分

**新建模块：**
- `SystemBar.vue` — 系统状态栏组件，双模式（攻略期太极图标/牝奴期樱花圆环）
- `NpcCardExpanded.vue` — NPC 卡片展开内容组件（好感度条+攻略值条+装备折叠面板）
- `EnslavedPage.vue` — 牝奴期独立页面
- `DebugPanel.vue` — 调试面板组件（仅开发模式）
- `useNavigation.ts` — 导航逻辑 composable
- `useDebug.ts` — 调试面板逻辑 composable

**重写模块：**
- `NpcCard.vue` — 从网格卡片改为水平横条折叠式，三态视觉含专属色
- `HomePage.vue` — 从网格布局改为纵向卡片流 + SystemBar

**修改模块：**
- `App.vue` — 使用 useNavigation composable
- `_variables.scss` — 新增卡片/动画变量
- `_mixins.scss` — 新增 taiji-glow、blossom-ring、breathing-glow、expand-panel
- `_global.scss` — 新增页面过渡样式

### NPC 专属色系统

三态视觉规则：
- 未开始：`grayscale(100%) brightness(0.4)`，不可点击，无好感度条
- 进行中：专属色光晕+边框（白芷=#a8c4e0冷蓝、苏芸=#e0a860暖金、纪兰=#b088d4紫、沈月秋=#d46048赤红、柳素衣=#e8e0d0白金），可点击，显示好感度条
- 已完成：金色边框+专属色保留，可点击，好感度条消失

NPC 专属色定义在 `_variables.scss` 的 `$npc专属色` map 中，已存在可直接复用。

### 系统状态栏双模式

攻略期模式：5 个太极图标（☯）并排，蓝色幽光=未攻略，粉红色幽光=已攻略，按攻略链顺序排列
牝奴期模式：圆环角度条+5 瓣樱花，每 20% 堕落度亮一瓣，颜色随堕落度变化

通过 `mode` prop 切换：
```
mode: '攻略期' | '牝奴期'
攻略期 props: npcList, npcStates
牝奴期 props: 堕落度
```

### NPC 卡片折叠/展开

- 同时只展开一个卡片（点击新卡片自动收起旧的）
- 展开方向：向下推长（保持文档流）
- 展开内容：好感度+攻略值进度条（上下排列）+ 可折叠装备面板
- 粘滞计数不在界面显示（后台系统读取）

### 调试面板

- 触发方式：`Ctrl+Shift+D` 快捷键切换显示/隐藏
- 技术原理：直接修改 `useDataStore().data` 属性，pinia 的 watchEffect 自动同步到 MVU 变量，所有组件响应式实时更新
- 编译条件：仅 `process.env.NODE_ENV === 'development'` 时编译进代码
- 生产构建：`pnpm build` 时通过条件编译 tree-shaken 移除

### 牝奴期页面

- 阶段描述从世界书读取（单个条目，按堕落度阶段索引，无标题前缀）
- 与攻略期共享 SystemBar 组件（mode='牝奴期'）
- 布局：堕落度进度条+阶段描述+改造进度+牝阴决+道具折叠面板

### 角色立绘图片

- 提示词模板：`[主体描述]，[环境背景]，[风格]风格，[景别/角度]拍摄，[光照]，[色调]，[画质] —比例 1:1`
- 图片规格：512×512px 方形，半写实东方仙侠风格
- 使用方式：左侧 64×64px 区域 CSS `object-fit: cover` 裁切
- 状态切换：未开始用 CSS grayscale 滤镜变灰，不需要额外图片

### 导航方案

保持现有的 `ref + v-if` 方式，不引入 vue-router。导航逻辑从 App.vue 抽取到 `useNavigation.ts` composable，为将来可能的 vue-router 迁移预留接口。

## Testing Decisions

### 测试策略

- 只测试外部行为，不测试实现细节
- 组件测试使用 `@vue/test-utils` 的 `mount`，mock store 使用 `vi.mock`
- 测试环境使用 `happy-dom`（已有先例）

### 需要测试的模块

**更新现有测试：**
- `HomePage.test.ts` — 适配 SystemBar + NpcCard 新结构
- `NpcCard.test.ts` — 适配三态行为（灰锁/专属色/金框）和折叠/展开

**新增测试：**
- `SystemBar.test.ts` — 太极图标数量/颜色、樱花圆环进度
- `NpcCardExpanded.test.ts` — 展开内容渲染、装备折叠交互
- `useNavigation.test.ts` — 导航 composable

**保持不变：**
- `PageNav.test.ts`、`ShopPage.test.ts`、`BackpackPage.test.ts`、`GalleryPage.test.ts`、`NpcDetail.test.ts`、`guards.test.ts`

### 先例参考

现有测试文件使用 `// @vitest-environment happy-dom` 头部、`vi.mock('../store')` mock store、`createPinia()` 插件注入。新测试应遵循相同模式。

## Out of Scope

- vue-router 引入（当前保持 ref + v-if）
- 角色立绘图片的实际生成（仅提供提示词文档）
- 牝奴期页面的具体交互逻辑（仅提供功能骨架）
- 商城、背包、图鉴页面的视觉重构（保持现有样式）
- 高级视觉效果（粒子、流光等）——留待第二、三阶段
- 酒馆助手 MVU 框架本身的修改
- 世界书条目内容的编写（阶段描述文本由用户自行编写）

## Further Notes

- 金册风格主题保持不变，所有视觉升级在现有风格基础上增强
- NPC 专属色变量已存在于 `_variables.scss` 的 `$npc专属色` map 中，可直接复用
- `vue-router` 已在 `dependencies` 中（^4.6.4），但本次不引入
- `defineMvuDataStore` 创建的 pinia store 自带 watchEffect，调试面板修改数据会自动同步到 MVU 变量
- 项目使用 webpack 构建，可通过 `process.env.NODE_ENV` 实现条件编译
- Chrome CDP 调试端口已配置（9222），可用于视觉回归测试截图
