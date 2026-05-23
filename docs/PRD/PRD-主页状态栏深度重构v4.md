# PRD: 合欢宗 · 惑心魅影 主页状态栏深度重构 v4.0

> 产品级别：S 级（核心交互 + 数据结构扩展 + 场景生态系统）
> 评估日期：2026-05-22
> 状态：前端主体已落地；真实酒馆闭环验收发现世界书/角色卡同步断点，当前以“先同步规则、再复验回流”为最高优先级
> 前置版本：PRD-惑心魅影UI重构v3.md（五气朝元阵 + NPC命魂盘 + 须弥法囊）
> 技术栈：Vue 3 + Pinia + SCSS + Webpack 5 + Zod 4

---

## 当前权威结论（2026-05-22 实机复验后）

> 本节优先级高于后文早期规划表。后文 Phase A-H 保留为历史设计与执行轨迹；若状态冲突，以本节和第 14.12 节为准。

- **前端主体状态**：主页状态栏、NPC 命轮、心音显影条件、四页面视觉清尾、商城/背包生命周期、待处理交互入队均已落地，并通过 v4 回归测试。
- **实机通过项**：点击命轮可触发 `心防反震`，并写入 `系统.待处理交互`；前端不调用 `generate()`，符合 UI→下一楼层 AI 的闭环边界。
- **实机通过项补充**：v4 系统字段已在最新 MVU 中回流，`系统.当前场景` 已支持开放字符串，`backend_validate.js` 迁移兜底已在脚本 iframe 上下文验证通过。
- **当前最高风险**：AI 后续楼层必须持续按标准 `<UpdateVariable><JSONPatch>` 输出，并对 v4 系统字段使用 `replace`；`pnpm build` 只能证明前端状态栏已构建，不能证明世界书提示词已同步。
- **同步断点**：`package.json` 的 `sync` 指向 `node tavern_sync.mjs`，但当前工作区缺少 `tavern_sync.mjs`；必须先恢复或替代同步链路，再进行下一次实机验收。
- **开放场景约束**：`系统.当前场景` / `NPC.*.当前场景` 均为开放字符串，允许 AI 创建 `外门广场`、`药庐`、`经阁` 等贴合世界观的新场景；`莲灯前苑`、`醉玉小筑`、`绮梦幽阁` 仅保留为前端快捷入口与旧数据回退锚点。
## 一、项目概述

### 1.1 背景

甲方基于 v3.0 改造成果，提出主页状态栏深度重构 + 场景化遭遇系统需求：

- **双环命轮系统**：将传统进度条替换为太极盘周遭的 SVG 双环，数值替换为状态语
- **心里话 (Soul Whispers) 系统**：新增 NPC 心理活动数据 + 灵识窃取交互
- **状态语义映射**：严禁展示原始数值（85/100），全部翻译为修仙叙事状态语
- **窃听反噬机制**：高道心 NPC 反噬 + 好感度扣除 + 界面 shake 动画
- **场景化遭遇系统（新增）**：三阶场景（莲灯前苑/醉玉小筑/绮梦幽阁）+ NPC 动态分布 + 场景感知心里话 + 场景色相滤镜

### 1.2 约束

- HTML 结构零改动（允许新增子节点）
- guards.ts 现有函数不修改，仅新增；schema.ts 允许新增字段（甲方已授权）
- **MVU 架构铁律**：前端是纯读取层。defineMvuDataStore 每 2s 轮询 stat_data → Pinia；watchIgnorable 监听 data 变化 → 即时写回 MVU。NPC 场景位移由 AI 通过 JSON Patch 驱动，前端不运行随机算法。
- 文件写入规范：SCSS 用 Python 脚本，Vue/TS 用 apply_patch

### 1.3 闭环数据流架构

```
AI 角色卡（世界书/变量更新规则）
    ↓ JSON Patch 更新 NPC.当前场景
MVU 消息楼层变量 (stat_data)
    ↓ 2s 轮询 (defineMvuDataStore)
Pinia Store (data)
    ↓ computed 按场景过滤
Vue 组件（按场景渲染 NPC + 心里话 + 灵识窃取）
    ↓ 玩家交互（太极盘/装备道具/切换场景）
前端修改 data → watchIgnorable 即时同步回 MVU
    ↓ AI 下次生成时读取最新变量
AI 角色卡（生成剧情回复，含场景感知心里话）
```

### 1.4 技术可行性验证结果（当前基线持续更新）

| 验证项 | 结果 | 风险 | 测试影响 |
|--------|------|------|----------|
| schema.ts 新增 soul_whisper | 通过 | 低 | prefault 兼容 |
| schema.ts 新增 当前场景 | 通过 | 低 | prefault 默认莲灯前苑 |
| guards.ts 新增函数 | 通过 | 低 | 纯增量 |
| NpcCard 状态语义替换 | 通过 | 低 | 6 个测试需更新 |
| NpcCard SVG 双环替换 | 通过 | 中 | 3 个测试需更新 |
| NpcDetail 状态语义替换 | 通过 | 低 | 2 个测试需更新 |
| Composable 新建 | 通过 | 极低 | 遵循 useTheme.ts 模式 |
| Whispers.ts 数据文件 | 通过 | 极低 | 新建文件 |
| _effects.scss 动效文件 | 通过 | 极低 | 新建文件 |
| 场景配置数据文件 | 通过 | 极低 | 纯数据 |
| HomePage 场景过滤 | 通过 | 低 | TransitionGroup + computed |

**总测试影响**：约 11 个测试需更新断言，3 个新增场景测试，0 个新增失败风险

## 二、改造范围与文件清单

### 2.1 新建文件（6 个）

| 文件 | 用途 | 行数 |
|------|------|------|
| 界面/composables/useStatusText.ts | 状态语义映射 composable | ~40 行 |
| 界面/data/whispers.ts | 心里话文案库（含场景分级） | ~80 行 |
| 界面/styles/_effects.scss | 独立动效（shake / ink-reveal / 入场离场） | ~70 行 |
| 界面/data/场景配置.ts | 三场景定义（ID / 名称 / 色调 / 氛围文案） | ~45 行 |
| 界面/composables/useScene.ts | 场景切换 composable（前端 UI 状态） | ~30 行 |
| 界面/components/SceneIndicator.vue | 场景指示器 / 切换器组件 | ~35 行 |

### 2.2 修改文件（8 个）

| 文件 | 改造类型 | 改造内容 |
|------|----------|----------|
| schema.ts | 新增字段 | NPC 新增 soul_whisper + 当前场景；系统新增当前场景 |
| guards.ts | 新增函数 | get灵犀等级 / get道心侵蚀 / perform灵识窃取 / get场景NPC列表 |
| NpcCard.vue | Template + CSS + Script | SVG 双环 + 状态语义 + 灵识窃取 + 心里话弹出 + 入场离场 |
| NpcDetail.vue | Template + CSS | 状态语义替换数值 |
| HomePage.vue | Template + Script | v-for 按场景过滤 + TransitionGroup + 空状态氛围文案 |
| SystemBar.vue | Template + CSS | 场景切换器 UI 集成 |
| _global.scss | 新增 @use | 导入 _effects.scss + 场景色相滤镜 + 入场离场 keyframes |
| 变量更新规则.yaml | 新增规则 | NPC 当前场景更新规则 |

### 2.3 测试更新

- 约 11 个测试需更新断言（状态语义替换 + SVG 双环）
- 3 个新增测试（场景过滤 + 场景切换 + 心里话随机）


---

## 三、详细改造规格

### Phase A：状态语义 composable（P0，先行）

创建 界面/composables/useStatusText.ts（~40 行），包含：

- get灵犀等级(v: number): string
  - 0-20 → 冷若冰霜
  - 21-40 → 渐生疑窦
  - 41-60 → 暗生情愫
  - 61-80 → 灵犀相照
  - 81+ → 生死相随

- get道心侵蚀(v: number): string
  - 0-20 → 道心稳固
  - 21-40 → 心防松动
  - 41-60 → 欲念暗生
  - 61-80 → 道心破碎
  - 81+ → 沦为牝奴

**修改点：**

| 文件 | 行号 | 改动 |
|------|------|------|
| NpcCard.vue | L43 / L55 / L62 | 数值显示替换为状态语 |
| NpcDetail.vue | L24 / L40 | 数值显示替换为状态语 |

**测试更新：**

- NpcCard.test.ts：6 个断言从数值改为状态语
- NpcDetail.test.ts：2 个断言从数值改为状态语

---

### Phase B：SVG 双环命轮（P1）

NpcCard 展开区进度条替换为 SVG 双环：

- **外环** = 道心侵蚀（stroke-dashoffset 映射 0-100%）
- **内环** = 灵犀等级
- strip-favor 区域替换为迷你双环
- CSS 动画 + 呼吸光效（@keyframes breathe）

**测试更新：** 3 个测试断言更新（进度条 → SVG 双环结构验证）

---

### Phase C：心里话数据结构（P1，场景感知版）

#### C1：schema.ts NPC 对象新增字段

`	ypescript
soul_whisper: z.object({
  text: z.string().prefault(''),
  stage: z.enum(['警戒', '动摇', '沉沦']).prefault('警戒'),
  is_revealed: z.boolean().prefault(false),
}).prefault({})
`

#### C2：guards.ts 新增函数

- get窃听阶段(攻略值: number): '警戒' | '动摇' | '沉沦'
  - 0-30 → 警戒
  - 31-70 → 动摇
  - 71+ → 沉沦

- perform灵识窃取(粘滞计数: number, 攻略值: number, 当前场景: string): { success: boolean, backlash: number }
  - 场景成功率：莲灯前苑 = 60% / 醉玉小筑 = 75% / 绮梦幽阁 = 90%
  - 场景反噬强度系数：前苑 ×0.5 / 小筑 ×1.0 / 幽阁 ×1.5

#### C3：心里话文案库

新建 界面/data/whispers.ts（~80 行），按 **NPC × 场景 × 阶段** 三层结构组织：

`
白芷:
  莲灯前苑:
    警戒: ['此人身在前苑，倒也无妨……', '众目睽睽，量他不敢造次。']
    动摇: ['他怎的又来了……莫要看这边。']
    沉沦: ['他站在那里……我却只想走近些。']
  醉玉小筑:
    警戒: ['小筑灯暖，但这人靠近得太近了……']
    动摇: ['他为我倒酒……手背碰到我的手指了。']
    沉沦: ['酒意上涌，他说什么我都想答应……']
  绮梦幽阁:
    警戒: ['此处只有我二人……得打起精神。']
    动摇: ['他关上门的那一刻，心跳漏了一拍。']
    沉沦: ['幽阁的烛火摇曳，如同我此刻的心。']
苏芸: （同结构，3 场景 × 3 阶段）
纪兰: （同结构）
沈月秋: （同结构）
柳素衣: （同结构）
`

导出函数：getRandomWhisper(npc名: string, 当前场景: string, 阶段: string): string

---

### Phase D：灵识窃取 UI（P1，场景感知版）

- NpcCard 太极盘中心添加 @click 事件
- 点击命轮区仅追加 系统.待处理交互，不调用 generate()；下一楼层由 AI 读取队列并回应
- 心里话弹出层：<Transition name="ink-reveal"> + clip-path 墨迹扩散效果
- 场景感知：成功时弹出该场景对应阶段的心里话文案
- 失败时触发 shake 动画（<Transition name="shake-fail">）

**_effects.scss 新增动画：**

`scss
@keyframes ink-reveal {
  from { clip-path: circle(0% at 50% 50%); opacity: 0; }
  to   { clip-path: circle(100% at 50% 50%); opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-6px); }
  40%      { transform: translateX(6px); }
  60%      { transform: translateX(-4px); }
  80%      { transform: translateX(4px); }
}
`

---

### Phase E：窃听反噬（P2，场景感知版）

- shake 动画 + 好感度视觉反馈（CSS animation: shake 0.4s）
- 场景影响反噬严重度：前苑轻 / 小筑中 / 幽阁重
- 窃听失败时好感度数值 CSS 抖动（**不改实际值** —— 实际扣除由 AI JSON Patch 执行）

---

### Phase F：场景化遭遇系统（P1，新增）

#### F1：数据层

**schema.ts 系统新增：**

`	ypescript
当前场景: z.string().prefault('莲灯前苑') // 开放场景名；三核心地点仅作快捷入口/回退
`

**schema.ts NPC 新增：**

`	ypescript
当前场景: z.string().prefault('莲灯前苑') // 开放场景名；三核心地点仅作快捷入口/回退
`

**变量更新规则.yaml 新增规则：**

| 变量 | 更新方式 | 触发条件 |
|------|----------|----------|
| 系统.当前场景 | replace | 玩家主动移动时 |
| NPC.*.当前场景 | replace | AI 每 2-3 时辰重排；私密互动时锁定 |

概率分布：前苑 50% / 小筑 35% / 幽阁 15%

#### F2：场景配置数据

新建 界面/data/场景配置.ts（~45 行）：

| 场景 | ID | 色调 | hueRotate | 饱和度 |
|------|----|------|-----------|--------|
| 莲灯前苑 | forecourt | 暖橙 | hue-rotate(15deg) | 1.1 |
| 醉玉小筑 | jadehouse | 暖金 | 无滤镜 | 1.0 |
| 绮梦幽阁 | dreampavilion | 暗紫 | hue-rotate(-15deg) | 0.9 |

每场景含：id / 名称 / 色调 / hueRotate / 饱和度 / 空闲文案 / 心里话风格

#### F3：useScene composable

新建 界面/composables/useScene.ts（~30 行）：

- 纯前端 UI 状态（类似 useNavigation.ts 模式）
- 管理 currentScene ref（'莲灯前苑' | '醉玉小筑' | '绮梦幽阁'）
- 切换场景(场景) 函数
- **不写入 MVU**，仅控制前端渲染层

#### F4：HomePage 场景过滤（~30 行改动）

- computed 过滤 visibleNpcs：NPC.当前场景 === currentScene
- TransitionGroup 包裹 v-for（
ame="scene-slide"）
- 空场景时渲染该场景对应氛围文案

#### F5：SystemBar 场景切换器（~20 行改动）

- bar-left 区域添加三场景选择按钮（前苑 / 小筑 / 幽阁）
- 当前场景高亮显示
- 点击触发 useScene.切换场景()

#### F6：场景色相滤镜（_global.scss，~15 行）

`scss
.scroll-frame[data-scene="hall"]  { filter: hue-rotate(15deg)  saturate(1.1); }
.scroll-frame[data-scene="bar"]   { filter: none; }
.scroll-frame[data-scene="room"]  { filter: hue-rotate(-15deg) saturate(0.9); }

.scroll-frame {
  transition: filter 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
`

#### F7：NPC 入场/离场动画（_effects.scss，~25 行）

`scss
@keyframes scene-enter {
  from { transform: translateX(-30px); filter: blur(5px); opacity: 0; }
  to   { transform: translateX(0);     filter: blur(0);   opacity: 1; }
}

@keyframes scene-exit {
  from { transform: scale(1);   opacity: 1; }
  to   { transform: scale(0.95); opacity: 0; }
}
`

#### F8：UI 交互 → 下一楼层 AI 回应机制

封装 usePendingAction composable。前端 UI 不直接调用 generate()，而是把有叙事意义的操作写入 MVU 的待处理交互队列。用户下一次正常发送消息后，AI 在新楼层读取该队列，生成剧情回应与新的变量更新。

**闭环原则：**

| 阶段 | 行为 |
|------|------|
| UI 交互 | 更新 data，并追加一条 待处理交互 |
| 当前楼层 | watchIgnorable 自动同步到 MVU stat_data |
| 下一楼层 | 用户正常回复触发 AI 生成 |
| AI 回复 | AI 读取 待处理交互，叙事回应并用 JSON Patch 清空已处理项 |

**关键函数：**

| 函数 | 行为 |
|------|------|
| 记录装备道具(道具名, npc名) | 更新装备数据 + 追加 待处理交互 |
| 记录购买物品(物品名) | 更新灵石/拥有数据 + 追加 待处理交互 |
| 记录灵识窃取(npc名) | 追加 待处理交互，等待 AI 在下一楼层判定 |
| 切换场景(场景) | 纯前端 local state 更新，不写入待处理交互 |

**schema.ts 新增字段建议：**

```typescript
待处理交互: z.array(z.object({
  类型: z.enum(['装备', '卸下', '购买', '灵识窃取', '装备道具', '购买物品', '使用物品', '追查风声']).prefault('购买'),
  目标: z.string().prefault(''),
  道具: z.string().prefault(''),
  数量: z.coerce.number().prefault(1),
  时辰: z.enum(['晨时', '午时', '酉时', '亥时']).prefault('晨时'),
  场景: z.string().prefault('莲灯前苑'), // 开放场景名，随系统.场景上下文承载真实地点
})).prefault([])
```

**变量更新规则.yaml 新增要求：**

- AI 回复时必须优先检查 系统.待处理交互
- 已叙事回应的交互必须用 remove 或 replace 清空
- 未处理交互不得跨越超过 1 个 AI 回复楼层

---

## 四、执行计划

| Phase | 内容 | 优先级 | 当前状态 | 证据/备注 |
|:------|:-----|:------:|:--------|:----------|
| A | 状态语义 composable | P0 | 已落地 | `useStatusText.ts` 已接入 `NpcCard` / `NpcDetail`，状态语测试已覆盖 |
| B | SVG 双环命轮 | P1 | 已落地主体 | `NpcCard.vue` 已使用 SVG 双环与 `stroke-dasharray` / `stroke-dashoffset` 渲染 |
| C | 心里话数据结构（场景感知） | P1 | 已落地骨架，文案待重写 | `schema.ts` 已有 `soul_whisper`，`whispers.ts` 已建；后续按世界观重写文案 |
| D | 灵识窃取 UI（场景感知） | P1 | 已落地基础闭环 | 点击命轮只写入 `系统.待处理交互`，等待下一楼层 AI 回写 `soul_whisper` |
| E | 窃听反噬（场景感知） | P2 | 待清尾 | 前端 shake / 失败反馈与 AI JSON Patch 扣减规则需最终验收 |
| F | 场景化遭遇系统 | P1 | 已落地核心版 | 三场景已统一为 `莲灯前苑` / `醉玉小筑` / `绮梦幽阁`，主页按场景过滤 NPC |
| G | 商城/背包物品生命周期 | P1 | 已落地并进入回归 | 购买、装备、卸下、消耗品、即时解锁与待处理交互已串联 |
| H | 四页面最终视觉验收 | P1 | 进行中 | 商城分类栏、灵石一致性已修；仍需逐页最终视觉走查 |


### 4.1 当前执行计划校正（以实机结果为准）

| 项目 | 当前判定 | 后续动作 |
|:---|:---|:---|
| Phase A/B/C/D/E/F/G 前端工程 | 已完成主体落地 | 仅做 bug 修复和视觉小修，不再扩大范围 |
| 四页面视觉清尾 | 已完成一轮 | 后续按实机截图逐点修，不再重开大改 |
| `soul_whisper` 前端显影 | 前端逻辑正确 | 等待下一楼层 MVU 真正回流后复验 |
| UI 交互入队 | 实机通过 | 保持前端只入队、不触发 `generate()` |
| AI 下一楼层承接 | 未通过最终验收 | 必须先让酒馆吃到新版世界书 `MVU解析硬约束` |
| 世界书/角色卡同步 | 当前阻塞项 | 恢复 `tavern_sync.mjs` 或确认替代同步方式，重新导入后复验 |
| 场景枚举约束 | 发现漂移风险 | 加强规则：正文地点可自由，MVU 场景只允许三大 UI 场景 |
## 五、风险矩阵

| 风险 | 级别 | 缓解措施 |
|:-----|:----:|:---------|
| schema 新增字段兼容性 | P2 | prefault 默认值，旧数据自动填充 |
| AI 不按规则更新 NPC 场景 | P3 | 变量更新规则 check 约束 + 前端 prefault 兜底 |
| SVG 双环性能 | P3 | 纯 CSS stroke-dashoffset，无 JS 计算开销 |
| hue-rotate 影响子组件颜色精度 | P2 | 只应用于 scroll-frame 层，NPC 专属色独立设置 |
| TransitionGroup 场景切换卡顿 | P3 | 仅 5 个 NPC，开销可忽略 |
| 心里话文案库维护成本 | P3 | 独立数据文件，按 NPC×场景×阶段 组织 |
| 反噬好感度扣除时序 | P2 | 前端仅展示视觉效果，实际扣除由 AI JSON Patch 执行 |
| 测试断言更新量 | P2 | 约 11+3=14 个测试，均为断言值更新 |
| 待处理交互队列一致性 | P1 | 前端只入队，AI 下一楼层读取并清空，禁止直接 generate |


### 5.1 当前新增风险（实机复验暴露）

| 风险 | 级别 | 现象 | 缓解措施 |
|:---|:---:|:---|:---|
| 世界书未同步到酒馆 | P0 | 本地已追加 `MVU解析硬约束`，但新楼层仍输出旧格式 | 恢复/替代 `tavern_sync.mjs`，重新 bundle/import 后再验收 |
| 裸 JSON Patch 不回流 | P0 | 正文可见 Patch，但 `Mvu.getMvuData(...latest)` 没有 `soul_whisper` | 强制 `<UpdateVariable><JSONPatch>` 包裹，禁止 `变量更新情况` 裸输出 |
| 场景上下文缺失 | P1 | AI 只写开放场景名但未同步 `系统.场景上下文` | 世界书规则要求每次场景变化同步地点、子区域、公开度、在场NPC、氛围、故事钩子 |
| 误判 UI 缺陷 | P1 | 前端未显示“心音残片”容易被误认为渲染失败 | 验收必须先查 MVU 最新变量是否实际回流 |
| 构建与同步混淆 | P1 | `pnpm build` 通过但世界书未必进入 SillyTavern | 文档和流程拆分“前端构建验收”与“酒馆导入验收” |
---

## 六、验收标准

### 6.0 验收口径校正

> 下列 6.1-6.4 保留早期规划验收项；当前最终验收必须额外满足 6.5。只通过 `pnpm build` 与单元测试，不代表 v4 闭环完成。

### 6.1 构建验收

- pnpm build — 0 errors
- 
px vitest run — ≥ 249/251 PASS

### 6.2 视觉验收（Phase A-E）

- NpcCard 不显示任何原始数值（85/100）
- 好感度显示状态语（冷若冰霜 / 渐生疑窦 / 暗生情愫 / 灵犀相照 / 生死相随）
- 攻略值显示状态语（道心稳固 / 心防松动 / 欲念暗生 / 道心破碎 / 沦为牝奴）
- SVG 双环正确反映弧度（外环=道心侵蚀，内环=灵犀等级）
- 太极盘点击触发心里话（墨迹扩散动画）
- 窃听失败时 shake 动画播放
- 所有动效使用 cubic-bezier(0.4, 0, 0.2, 1)

### 6.3 视觉验收（Phase F 场景系统）

- 场景切换器在 SystemBar 中正确显示三个场景按钮
- 点击场景后 NPC 列表平滑过渡（入场 / 离场动画）
- 空场景显示对应氛围文案
- 场景色相滤镜平滑过渡（0.8s）
- 心里话文案与当前场景匹配
- 装备 / 购买 / 灵识窃取交互写入 系统.待处理交互，下一楼层 AI 读取并叙事回应后清空队列

### 6.4 回归验收

- 四个页面切换正常
- 主题切换丝滑过渡
- NPC 卡片展开 / 收起正常
- 商城购买流程正常（购买后写入 `系统.待处理交互`，不直接触发 generate）
- 背包装备 / 卸下正常（操作后写入 `系统.待处理交互`，不直接触发 generate）
- 牝奴期四区域显示正常
- 场景切换与 NPC 卡片联动正常

---


### 6.5 v4 最终闭环验收（新增，必须全部通过）

- **世界书同步验收**：确认 SillyTavern 实际启用的角色卡/世界书包含 `MVU解析硬约束`、`<UpdateVariable>`、`<JSONPatch>` 与 `soul_whisper` 标准样例。
- **输出格式验收**：下一楼层 AI 回复尾部必须输出完整 `<UpdateVariable><Analysis>...</Analysis><JSONPatch>...</JSONPatch></UpdateVariable>`，不得只输出 `变量更新情况`、YAML 摘要或裸 JSON Patch。
- **变量回流验收**：CDP 读取 `Mvu.getMvuData({ type: 'message', message_id: 'latest' })`，确认 `NPC.目标.soul_whisper.text` 非空且 `is_revealed` 按剧情要求更新。
- **前端显影验收**：只有当最新 MVU 变量已回流时，前端才显示“心音残片”；未回流时不显示是正确行为。
- **队列清空验收**：AI 已叙事承接的交互必须在同一个 `<JSONPatch>` 中清空 `系统.待处理交互`，不得跨越超过一个 AI 回复楼层。
- **开放场景验收**：写入 MVU 的 `系统.当前场景` 与 `NPC.*.当前场景` 可以是任意贴合合欢宗世界观的场景名；验收重点是同步写入 `系统.场景上下文`、`公开度`、`在场NPC`、`故事钩子`，而不是收敛到三枚举。
- **构建验收**：`pnpm build` 通过仅作为前端构建验收；若涉及后端校验脚本，还需单独确认 `dist/backend_validate.js` 已按 esbuild 流程更新。
## 七、变更日志

| 日期 | 版本 | 变更 |
|:-----|:-----|:-----|
| 2026-05-21 | 1.0 | 初始版本 |
| 2026-05-21 | 2.0 | 四页面深度改造完成 |
| 2026-05-22 | 3.0 | 五气朝元阵 + NPC命魂盘 + 须弥法囊 |
| 2026-05-22 | 4.0 | 双环命轮 + 心里话系统 + 状态语义映射 + 窃听反噬 + 场景化遭遇系统 + UI交互→AI回应机制 |

## 附录：待办登记

### 场景名世界观替换

- 已完成旧临时场景名到合欢宗世界观命名的统一迁移：`喧闹大堂 → 莲灯前苑`、`微醺吧台 → 醉玉小筑`、`幽寂厢房 → 绮梦幽阁`。
- 已同步迁移范围：`schema.ts` / `schema.json`、场景守卫、心里话文案库、待处理交互、世界书变量规则、页面测试与 PRD 描述。
- 除本迁移映射留痕外，当前代码与 PRD 正文不再使用旧三场景名；后续仅允许做剧情文案润色，不再引入旧命名。
### 心里话前端显影验收

- 心里话前端显影已完成：`NpcCard` 只在 `soul_whisper.is_revealed === true` 且 `text` 非空时显示“心音残片”。
- 点击命轮仍只追加 `系统.待处理交互`，不在前端伪造心音结果。
- 下一楼层 AI 更新 `NPC.*.soul_whisper` 后，前端随 MVU 变量回流自动显影。
### Phase E/F：AI下一楼层闭环验收

- 前端 UI 操作只写入 `系统.待处理交互`，不得直接触发 AI 回复。
- AI 在下一楼层回复时必须优先读取 `系统.待处理交互`，自然承接购买、装备、卸下、灵识窃取等交互结果。
- AI 已回应的交互必须在同一次变量更新中使用 JSON Patch 清空：`{ "op": "replace", "path": "/系统/待处理交互", "value": [] }`。
- AI 不得重复执行前端已完成的数据变化，例如重复扣灵石、重复增加道具、重复插入装备。
- 场景名 `莲灯前苑`、`醉玉小筑`、`绮梦幽阁` 已完成世界观替换，后续仅按剧情需要微调文案。


### 商城页内部验收（2026-05-22）

- 已完成商城页轻量去现代化收尾：`NSFW` 分类文案替换为 `禁器`，商品门槛文案由 `好感` 转为 `灵犀`，详情效果标签由 `效：` 转为 `灵效：`。
- 已补充购买闭环测试：购买成功后必须写入 `系统.待处理交互`，灵石不足时不得入队，且仍不直接触发 AI generate。
- 验证结果：`npx vitest run src/雌堕合欢宗/界面/pages/ShopPage.test.ts src/雌堕合欢宗/界面/composables/usePendingAction.test.ts` 通过，2 个测试文件 / 20 个断言全部通过。
- 回归结果：四页面与场景联动回归通过，10 个测试文件 / 124 个断言全部通过。
- 构建结果：`pnpm build` 通过，仅保留既有 `index.html 4.95 MiB` 体积 warning，未出现新的构建错误。

### 背包与商城物品生命周期验收（2026-05-22）

- 装备类闭环：服装 / 禁器 / 牝奴装备进入背包后可装备；装备时扣减 `道具.拥有` 库存，库存归零后从背包列表消失；从“当前装备”栏选中并卸下后归还库存。
- 消耗品闭环：丹药 / 时间延长进入背包后显示“启用法效”，不再显示 NPC 装备目标；使用后扣减库存并写入 `系统.待处理交互`，等待下一楼层 AI 叙事回应与变量清算。
- 即时解锁类：特殊场景 / 特殊剧情购买后不进入背包，直接写入 `场景.已解锁` / `剧情.已解锁`，避免玩家误以为可重复使用。
- 即时生效类：改变阵法购买后不进入背包，直接设置 `系统.已使用阵法 = true`，并保留购买交互入队供下一楼层叙事承接。
- 防重复装备：库存为 0 的装备不能继续分配给第二个对象，修复“一件商品可装备多人”的背包漏洞。
- AI 闭环边界：前端只负责即时库存表现与 `系统.待处理交互` 入队，不直接调用 `generate`，不替 AI 生成剧情结果。
- 验证结果：`npx vitest run src/雌堕合欢宗/界面/pages/BackpackPage.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts src/雌堕合欢宗/界面/composables/usePendingAction.test.ts` 通过，3 个测试文件 / 47 个断言全部通过。
- 回归结果：四页面与场景联动回归通过，10 个测试文件 / 135 个断言全部通过。
- 构建结果：`pnpm build` 通过，仅保留既有 `index.html 4.95 MiB` 体积 warning，未出现新的构建错误。
### 待处理交互一致性护栏验收（2026-05-22）

- 已补齐 `使用物品` 在 `schema.ts`、`usePendingAction`、世界书变量清单、变量更新规则、变量输出格式中的一致性链路。
- 已新增 `usePendingAction` 单元测试：`记录使用物品` 只写入 `系统.待处理交互`，不直接调用 `generate`。
- 已新增跨文件一致性护栏测试：校验待处理交互类型在 `schema.ts` 与 `世界书/变量/变量列表.yaml` 中同步，并强制检查 `使用物品` 在 AI 更新规则和输出样例中存在。
- 该护栏用于防止后续新增交互类型时遗漏世界书或 schema 同步，避免 AI 下一楼层无法承接前端 UI 操作。
- 验证结果：`npx vitest run src/雌堕合欢宗/界面/composables/usePendingAction.test.ts src/雌堕合欢宗/界面/pages/BackpackPage.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts src/雌堕合欢宗/界面/pages/HomePage.test.ts` 通过，4 个测试文件 / 59 个断言全部通过。
- 构建结果：`pnpm build` 通过，仅保留既有 `index.html 4.95 MiB` 体积 warning，未出现新的构建错误。
## 十三、调试灵石跨页面一致性修复记录（2026-05-22）

### 13.1 问题描述

开发调试面板修改 `系统.灵石` 后，主页 `SystemBar` 可即时显示新灵石，但切换到商城页时 `ShopPage` 余额回退为 `0`。

### 13.2 根因结论

`defineMvuDataStore` 会每 2 秒从 MVU `stat_data` 轮询并在数据不一致时整体替换 `store.data`。旧实现中 `DebugPanel.vue`、`App.vue`、`ShopPage.vue` 与 `usePendingAction.ts` 在 setup 阶段缓存 `const data = store.data`，当 MVU 轮询替换整棵数据后，部分组件仍读写旧对象引用，导致主页显示端与商城读取端出现短暂分叉。

### 13.3 修复方案

- `DebugPanel.vue`：调试输入统一绑定 `store.data` 活引用，避免写入旧对象。
- `App.vue`：顶栏传参与阶段判断统一读取 `store.data` 活引用。
- `ShopPage.vue`：余额显示、购买判定、扣费与解锁逻辑统一读取/写入 `store.data` 活引用。
- `usePendingAction.ts`：待处理交互写入统一走 `store.data` 活引用。

### 13.4 验收标准

- 调试面板修改灵石后，主页顶栏与商城余额必须显示同一 `系统.灵石` 值。
- 即使 MVU 轮询导致 `store.data` 整体替换，调试面板后续输入仍必须写入最新 `store.data`。
- 商城购买扣费与 `系统.待处理交互` 追加必须写入最新 MVU 数据源。

### 13.5 验证结果

- `npx vitest run src/雌堕合欢宗/界面/components/DebugPanel.test.ts src/雌堕合欢宗/App.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts src/雌堕合欢宗/界面/components/SystemBar.test.ts src/雌堕合欢宗/界面/composables/usePendingAction.test.ts`：46/46 PASS。
- `pnpm build`：PASS；仅保留既有 `index.html 4.95 MiB` 体积 warning。
## 十四、v4 最终验收进度台账（2026-05-22）

### 14.1 已完成范围

- 主页状态栏：五气朝元阵、时辰显示、灵石显示、场景切换、太极名牌排版已完成主要修复。
- NPC 命魂盘：状态语义、SVG 双环、心音残片显影、灵识窃取入队已完成基础闭环。
- 场景系统：三场景已统一为 `莲灯前苑`、`醉玉小筑`、`绮梦幽阁`，主页按 `NPC.当前场景` 过滤显示。
- 商城页面：购买扣费、购买入队、特殊解锁、牝奴分类、灵石跨页一致性、分类栏固定排版已完成。
- 背包页面：装备扣库存、归零消失、卸下归还、消耗品入队、避免一件装备多人使用已完成。
- AI 闭环边界：前端只追加 `系统.待处理交互`，不直接触发 AI 回复；下一楼层由 AI 读取、叙事回应并清空队列。

### 14.2 待清尾范围

| 项目 | 当前风险 | 收尾动作 | 优先级 |
|------|----------|----------|--------|
| 心里话文案库 | 部分文案不够贴合雌堕合欢宗世界观 | 重写 `whispers.ts`，保留数据结构与测试 | P1 |
| Phase E 窃听反噬 | 反噬仍偏规则登记，缺少最终体验验收 | 明确失败反馈、shake 样式与 AI JSON Patch 扣减边界 | P2 |
| 四页面视觉验收 | 仍可能有局部现代网页残留 | 主页 / 牝奴期 / 商城 / 背包逐页截图或手工走查 | P1 |
| PRD 状态同步 | 旧章节仍有“待执行”语气 | 本台账作为当前状态源，后续继续原地追加 | P1 |
| 真实酒馆运行验收 | 单元测试不能完全覆盖 SillyTavern 楼层回写 | 在浏览器中验证 UI 交互 → 下一楼层 AI 承接 → MVU 回流 | P1 |

### 14.3 下一步执行顺序

1. 重写 `whispers.ts` 文案库，并保持 `whispers.test.ts` 通过。
2. 做四页面最终视觉走查，优先处理明显破坏沉浸感的标签、滚动条、表单感和布局挤压。
3. 明确 Phase E 反噬边界：前端只做失败视觉反馈，实际扣数值仍由 AI 下一楼层 JSON Patch 执行。
4. 跑 v4 相关测试集与 `pnpm build`，把最新通过结果继续追加到本 PRD。
### 14.4 当前验证基线（2026-05-22）

- v4 相关测试：`npx vitest run src/雌堕合欢宗/界面/composables/useStatusText.test.ts src/雌堕合欢宗/界面/data/whispers.test.ts src/雌堕合欢宗/界面/components/NpcCard.test.ts src/雌堕合欢宗/界面/components/NpcDetail.test.ts src/雌堕合欢宗/界面/pages/HomePage.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts src/雌堕合欢宗/界面/pages/BackpackPage.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts src/雌堕合欢宗/界面/components/SystemBar.test.ts src/雌堕合欢宗/界面/components/DebugPanel.test.ts src/雌堕合欢宗/界面/composables/usePendingAction.test.ts`。
- 测试结果：11 个测试文件 / 126 个断言全部通过。
- 构建命令：`pnpm build`。
- 构建结果：通过；仅保留既有 `index.html 4.95 MiB` 体积 warning，未出现新的构建错误。
- 当前结论：v4 主体工程基线稳定，可进入 `whispers.ts` 文案重写、Phase E 反噬清尾与四页面视觉最终验收。
### 14.5 心里话文案库重写验收（2026-05-22）

- 已重写 `src/雌堕合欢宗/界面/data/whispers.ts`，保持 `5名NPC × 3场景 × 3阶段` 数据结构不变。
- 新文案方向：按 `莲灯前苑` / `醉玉小筑` / `绮梦幽阁` 分层递进，强化合欢宗成人向、功法扰心、阳气感应、权力失控与 NPC 个性差异。
- 安全边界：白芷因世界书年龄设定为十七岁，心音仅写暧昧、功法扰动与欲念觉醒，不写露骨色情；其余成年/高阶 NPC 提高 NSFW 张力但保持修仙文风，不使用低俗现代词。
- 验证命令：`npx vitest run src/雌堕合欢宗/界面/data/whispers.test.ts src/雌堕合欢宗/界面/components/NpcCard.test.ts src/雌堕合欢宗/界面/pages/HomePage.test.ts`。
- 验证结果：3 个测试文件 / 34 个断言全部通过。
### 14.6 Phase E 窃听反噬验收（2026-05-22）

- 已在 `NpcCard.vue` 完成命魂盘灵识反噬的前端表现：高心防目标（`攻略值 < 40` 或 `soul_whisper.stage = 警戒`）被点击命轮时，局部触发 `soul-backlash` 抖动与“心防反震”提示。
- 已保持 MVU 闭环边界：反噬只作为前端即时反馈，不直接扣减 `NPC.${目标}.好感度`、不改写 `soul_whisper`、不调用 `generate`；后续成功、失败、扣减与文本揭示仍由下一楼层 AI 根据 `系统.待处理交互` 执行 JSON Patch。
- 已新增 `NpcCard.test.ts` 反噬测试：高心防目标点击命轮会显示反噬提示并继续 emit `soulWhisper`；未开始目标不显示反噬、不记录灵识事件。
- 已补充定时器卸载清理，避免卡片离场后残留反噬计时器。
- 局部验证：`npx vitest run src/雌堕合欢宗/界面/components/NpcCard.test.ts src/雌堕合欢宗/界面/pages/HomePage.test.ts` 通过，2 个测试文件 / 34 个断言全部通过。
- v4 回归验证：`npx vitest run src/雌堕合欢宗/界面/composables/useStatusText.test.ts src/雌堕合欢宗/界面/data/whispers.test.ts src/雌堕合欢宗/界面/components/NpcCard.test.ts src/雌堕合欢宗/界面/components/NpcDetail.test.ts src/雌堕合欢宗/界面/pages/HomePage.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts src/雌堕合欢宗/界面/pages/BackpackPage.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts src/雌堕合欢宗/界面/components/SystemBar.test.ts src/雌堕合欢宗/界面/components/DebugPanel.test.ts src/雌堕合欢宗/界面/composables/usePendingAction.test.ts` 通过，11 个测试文件 / 128 个断言全部通过。
- 构建验证：`pnpm build` 通过；仅保留既有 `index.html 4.96 MiB` 体积 warning 与 webpack code-splitting 建议，未出现新的构建错误。
- 当前结论：Phase E 已收口，主页命魂盘具备“风险可感知、逻辑不越权、下一楼层可承接”的完整前端闭环。
### 14.7 四页面视觉清尾验收（2026-05-22）

- 已完成主页 / 牝奴期 / 商城 / 背包的玩家可见文案复扫，重点清理“已拥有道具、暂无道具、当前装备、暂无装备、道具状态、好感度不足、灵效、○/✓”等现代网页或表单感残留。
- 背包页：`已拥有道具` 转译为 `囊中藏珍`，空状态转译为 `锦囊尚空`，归属区转译为 `法器归属`，无装备状态转译为 `虚位`，限制反馈转译为 `灵犀未至` / `禁制未开` 等宗门语境。
- 牝奴期页：玩家可见标题 `改造进度` 转译为 `身躯改塑`，`道具状态` 转译为 `拘束法器`，原生表单感 `○/✓` 视觉符号替换为 `✧/✦` 符纹态；底层 MVU 字段 `改造进度` 保持不变。
- 商城页：详情中的 `灵效` 转译为 `法效`，不可购买反馈从 `好感度不足` 转译为 `灵犀未至`，柳素衣前置条件转译为 `素衣因果未满`。
- NPC 卡片：展开区 `好感度/攻略值` 转译为 `灵犀/蚀心`，装备折叠文案转译为 `佩器`，空装备文案转译为 `未供法器`。
- 复扫结果：四页面玩家可见残留词复扫未再发现上述现代网页文案；命中的 `改造进度`、`记录购买物品` 等仅为变量名、函数名或注释，不属于前端展示文本。
- 局部验证：`npx vitest run src/雌堕合欢宗/界面/components/NpcCard.test.ts src/雌堕合欢宗/界面/pages/BackpackPage.test.ts src/雌堕合欢宗/界面/pages/Phase2Page.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts` 通过，4 个测试文件 / 82 个断言全部通过。
### 14.8 真实酒馆楼层回写验收准备（2026-05-22）

- 已复查 UI 交互闭环链路：前端只追加 `系统.待处理交互`，下一楼层由 AI 读取队列、叙事承接、输出 JSON Patch，并在同一次更新中清空队列。
- 已修复 `src/雌堕合欢宗/世界书/变量/变量更新规则.yaml` 中两处换行损坏：`系统.剩余天数.check` 与 `灵识窃取` 规则重新拆回标准 YAML 列表格式，避免 AI 读取规则时把条目误判为同一行文本。
- 已补强 `usePendingAction.test.ts` 护栏：检查 `灵识窃取` 规则必须保留换行列表格式，并禁止出现 `check:\`、`灵识窃取:      -` 这类断裂文本。
- 真实酒馆验收步骤：
  1. 在主页点击 NPC 命魂盘，确认 `系统.待处理交互[0].类型 = 灵识窃取`，且当前楼层不调用 `generate`。
  2. 用户发送下一条消息触发 AI 回复，正文必须自然承接窥心结果，不出现“读取变量/处理队列”等出戏词。
  3. 同一楼层 `<JSONPatch>` 必须按成功/失败写入 `NPC.${目标}.soul_whisper` 或克制反噬变量，并执行 `{ "op": "replace", "path": "/系统/待处理交互", "value": [] }`。
  4. 变量回流后，前端应显示“心音残片”或保留反噬后的状态，不重复扣灵石、不重复增减道具、不重复插入装备。
  5. 对商城购买、背包装备、卸下、使用物品各做一次同样闭环检查，确认 UI 已完成的数据变化不被 AI 重复执行。
- 当前结论：真实运行前的规则链路与测试护栏已补齐，下一步可进入浏览器 / SillyTavern 实机楼层验收。
### 14.9 CDP 实机 UI 入队验收（2026-05-22）

- 已按 `docs/教程/chrome调试启动指引.md` 启动 Chrome CDP：`.\start-dev.ps1 -ChromeOnly -NoKill`，实际连接端口为 `http://127.0.0.1:9222`。
- 已确认 SillyTavern 实机页面打开：`http://localhost:8000/`，状态栏真实渲染在酒馆助手 iframe `TH-message--0--0` 内。
- 已确认 iframe 内存在 `.system-bar = 1`、`.home-page = 1`、`.npc-strip = 5`、`.dual-ring-panel = 5`，说明主页状态栏与 NPC 命魂盘已在实机中加载。
- 实机验收中，当前剧情初始态 5 名 NPC 均为 `未开始`，命轮按设计锁定；为验证链路，临时将白芷置为 `进行中`、`好感度=35`、`攻略值=20`、`当前场景=莲灯前苑`、`soul_whisper.stage=警戒`。
- 点击白芷卡片与命魂盘后，前端即时出现 `心防反震`，并保持高心防反噬表现。
- 实机读取到 `系统.待处理交互` 已写入：`[{ "类型": "灵识窃取", "目标": "白芷", "道具": "", "数量": 1, "时辰": "晨时", "场景": "莲灯前苑" }]`。
- 按验收指示，本次没有清空 `系统.待处理交互`，保留现场供下一楼层 AI 读取与承接。
- 当前结论：UI 点击 → 前端反噬反馈 → `系统.待处理交互` 入队 的实机链路已通过；下一步应由用户发送下一楼层消息，验收 AI 是否自然叙事承接并在 JSON Patch 中清空队列。
### 14.10 手动点击复核补充（2026-05-22）

- 用户在 SillyTavern 实机界面手动点击命魂盘后，确认前端提示 `心防反震` 正常出现。
- 随后通过 CDP 读取 `系统.待处理交互`，当前队列仅保留 1 条：`灵识窃取 / 白芷 / 晨时 / 莲灯前苑`，未出现重复入队。
- 当前状态适合进入下一楼层 AI 承接验收：用户发送下一条消息后，AI 应自然描写白芷心防反震或心音残片，并在同次 JSON Patch 中清空 `系统.待处理交互`。
### 14.11 下一楼层变量回流实机验收补记（2026-05-22）
- 实机现象：用户触发下一楼层后，AI 正文已经自然承接白芷心音，并在消息末尾输出了包含 `NPC.白芷.soul_whisper.*` 与 `系统.待处理交互=[]` 的 JSON Patch。
- CDP 结论：最新楼层 `TH-message--4--0` / `Mvu.getMvuData({ type: 'message', message_id: 'latest' })` 中，`系统.待处理交互` 已清空，但 `NPC.白芷.soul_whisper` 未回流，前端自然无法显示“心音残片”。
- 根因判断：AI 输出的是“变量更新情况”摘要 + 裸 JSON Patch 数组，没有完整包裹在 `<UpdateVariable><JSONPatch>...</JSONPatch></UpdateVariable>` 内；MVU 解析器把裸 Patch 当普通正文，导致心音补丁未被正式应用。
- 修复动作：已在 `src/雌堕合欢宗/世界书/变量/变量输出格式.yaml` 追加 `MVU解析硬约束`，强制禁止裸 JSON Patch，并给出心音回流 + 清空队列的标准包裹样例。
- 护栏动作：已在 `src/雌堕合欢宗/界面/composables/usePendingAction.test.ts` 增加跨文件测试，校验 `变量输出格式.yaml` 必须保留 `<UpdateVariable>`、`<JSONPatch>`、`/NPC/白芷/soul_whisper/*` 与 `/系统/待处理交互` 的标准闭环样例。
- 复验标准：下一次实机回复必须在消息尾部输出标准 `<UpdateVariable>` 块；刷新最新楼层后，`NPC.白芷.soul_whisper.is_revealed=true` 且 `text` 非空，前端显示“心音残片”。
- 验证结果：`npx vitest run src/雌堕合欢宗/界面/composables/usePendingAction.test.ts` 通过，1 个测试文件 / 7 个断言 PASS。
- v4 回归结果：`npx vitest run` 指定 11 个 v4 测试文件通过，11 个测试文件 / 129 个断言 PASS；仅保留既有 `--localstorage-file` 测试环境 warning。
- 构建结果：`pnpm build` PASS；仅保留既有 `index.html 4.96 MiB` 体积 warning 与 webpack code-splitting 建议，无新增构建错误。
### 14.12 新楼层复验与规则同步断点补记（2026-05-22）
- 复验背景：用户继续发送新消息后，实机新增 `#6` 楼层，对应状态栏 iframe 为 `TH-message--6--0`。
- CDP 读取结论：最新楼层正文仍出现 `变量更新情况` 与裸 JSON Patch 数组，未出现标准 `<UpdateVariable>` / `<JSONPatch>` 标签。
- MVU 回流结论：`Mvu.getMvuData({ type: 'message', message_id: 'latest' })` 中，`NPC.白芷.soul_whisper` 仍未回流；前端未显示“心音残片”是正确表现，不是 UI 渲染错误。
- 口径修正：AI 写入 `外门广场` 本身不再视为错误；真正风险是只写场景名但未同步 `系统.场景上下文`，或仍把三核心地点误当作唯一合法枚举。
- 根因升级：仅修改本地 `src/雌堕合欢宗/世界书/变量/变量输出格式.yaml` 与运行 `pnpm build` 不等于 SillyTavern 已吃到新世界书；`dist/雌堕合欢宗/index.html` 是前端状态栏产物，不是世界书提示词产物。
- 同步断点：当前 `package.json` 中 `sync` 指向 `node tavern_sync.mjs`，但工作区内 `tavern_sync.mjs` 缺失，需先恢复/确认同步工具链，再重新 bundle/import 角色卡或世界书。
- 下一步验收标准：必须先确认新 `MVU解析硬约束` 已进入酒馆实际启用的角色卡/世界书，再进行下一楼层生成；通过标准为 AI 输出完整 `<UpdateVariable><Analysis>...</Analysis><JSONPatch>...</JSONPatch></UpdateVariable>`，且最新楼层 `soul_whisper.is_revealed` 与 `text` 正常回流。

### 14.13 v4 系统字段落地链路补记（2026-05-23）

- 新实机问题：`var_structure.js` 已热更新且包含 v4 字段，但最新楼层 `stat_data.系统` 仍停留在旧结构；`NPC.白芷.好感度` 等旧字段可回流，说明 MVU 基础链路不是全断。
- 根因定位：角色卡 `index.yaml` 中 `变量结构` 与 `后端校验` 脚本库仍指向远程 CDN；本地 `dist/backend_validate.js` 没有被酒馆页面加载，导致 `ensureV4SystemFields` 迁移兜底与 `__TEST_applyValidatedUpdate` 测试钩子均不生效。
- 修复动作：已将脚本库切换为本地热更新入口：`http://localhost:5500/dist/var_structure.js` 与 `http://localhost:5500/dist/backend_validate.js`。
- 工程口径：v4 系统字段必须使用 `replace`，不得使用 `insert`；字段包括 `/系统/当前场景`、`/系统/时辰`、`/系统/待处理交互`、`/系统/场景上下文`、`/系统/风声列表`、`/系统/当前追查风声ID`。
- 迁移兜底：`validateVariables` 开头执行 `ensureV4SystemFields(new_data)`，用于旧聊天快照缺字段时补齐开放动态场景、风声列表与待处理交互默认值。
- 验证结果：`npx vitest run src/雌堕合欢宗/脚本/后端校验/validate.test.ts` 通过，1 个测试文件 / 69 个断言 PASS；`dist/var_structure.js` 与 `dist/backend_validate.js` HTTP 200，且后者包含 `ensureV4SystemFields` 与 `__TEST_applyValidatedUpdate`。
- 实机复验标准：刷新/重载酒馆脚本后，控制台检查 `typeof window.__TEST_applyValidatedUpdate === 'function'` 必须为 `true`；下一楼层 `<JSONPatch>` 对 v4 系统字段使用 `replace` 后，最新 `Mvu.getMvuData({ type: 'message', message_id: 'latest' }).stat_data.系统` 必须包含完整 v4 字段。

### 14.14 v4 系统字段实机复验通过（2026-05-23）

- CDP 连接：Chrome 调试端口 `9222` 可用，当前页面为 `http://localhost:8000/`。
- 本地脚本服务：`http://localhost:5500/dist/var_structure.js`、`http://localhost:5500/dist/backend_validate.js`、状态栏 `index.html` 均返回 HTTP 200。
- 最新 MVU 状态：`Mvu.getMvuData({ type: 'message', message_id: 'latest' }).stat_data.系统` 已包含 v4 字段：`时辰`、`当前场景`、`待处理交互`、`场景上下文`、`风声列表`、`当前追查风声ID`。
- 开放场景验收：最新 `系统.当前场景 = 外门弟子舍`，证明开放字符串已可进入 MVU，不再受三核心地点枚举限制。
- 场景上下文验收：最新 `系统.场景上下文` 已包含 `地点=外门弟子舍`、`子区域=宿舍走廊`、`公开度=公开`、`在场NPC=[]`、`氛围`、`故事钩子`。
- 后端校验脚本验收：`__TEST_applyValidatedUpdate` 不在顶层 window，而在酒馆助手脚本 iframe 上下文；已定位到该上下文并执行空更新测试，返回 v4 系统字段完整且 `trace=[]`。
- 当前结论：本地热更新入口、变量结构注册、后端校验迁移兜底、开放动态场景字段回流均已通过实机验证；下一步验收重点转为 AI 下一楼层是否持续使用 `replace` 写 v4 系统字段，并自然承接风声 / 道具 / 灵识交互。

### 14.15 v4 MVU 自动验收脚本固化（2026-05-23）

- 新增 `cdp-v4-mvu-check.mjs`，用于将 CDP 手工实机检查固化为可重复运行的验收工具。
- 新增 `package.json` 脚本：`pnpm check:mvu`，默认仅读取最新楼层 MVU，不写入变量。
- 脚本覆盖项：本地热更新入口 HTTP 200、v4 系统字段完整、开放当前场景、完整场景上下文、风声列表上限、酒馆助手脚本 iframe 中的 `__TEST_applyValidatedUpdate` 钩子。
- 可选排查模式：`node .\cdp-v4-mvu-check.mjs --port 9222 --apply-empty-validation`，用于显式触发一次空校验，确认 `backend_validate.js` 可执行。
- 实机验证结果：只读模式与空校验模式均 PASS；当前最新楼层显示 `当前场景=宗门广场`，`在场NPC=[白芷, 苏芸]`，`风声列表=2`，`待处理交互=1`。
- 后续验收口径：每次用户粘贴新楼层 MVU 或完成下一楼层互动后，优先运行 `pnpm check:mvu`，再判断 UI 是否需要修复。

### 14.16 新楼层自动验收记录（2026-05-23）

- 用户更新新楼层后，已运行 `pnpm check:mvu`，结果 PASS：0 failures，0 warnings。
- 最新 MVU 状态：`当前场景=宗门广场`，`时辰=晨时`，`在场NPC=[苏芸, 白芷]`，`风声列表=1`，`待处理交互=[]`。
- v4 字段验收：`系统.当前场景`、`系统.待处理交互`、`系统.场景上下文`、`系统.风声列表`、`系统.当前追查风声ID` 均使用 `replace`，未再出现 v4 系统字段 `insert`。
- 风险记录：本楼层原文出现两个 `<UpdateVariable>` 块；用户确认 `<UpdateVariable>` 属于额外模型变量更新，因此不再判定为“正文模型双写”。当前风险应表述为：额外变量解析链路可能在同一楼层输出了两次变量块，虽然最终 MVU 以后一块成功回流，但后续仍应争取单楼层单变量块，避免前后补丁互相覆盖。
- 当前结论：UI/变量回流链路正常，下一轮重点继续观察额外变量模型是否稳定单块输出，并自然承接 `风声列表` 与 `在场NPC`。

### 14.17 午时楼层自动验收记录（2026-05-23）

- 用户更新新楼层后，已运行 `pnpm check:mvu`，结果 PASS：0 failures，0 warnings。
- 最新 MVU 状态：`当前场景=宗门广场`，`时辰=午时`，`在场NPC=[苏芸, 白芷]`，`风声列表=2`，`待处理交互=[]`。
- v4 字段验收：系统字段均保持完整，`系统.当前场景` 为开放字符串，`系统.场景上下文` 完整包含地点、子区域、公开度、在场NPC、NPC活动、氛围、故事钩子、特殊事件。
- Patch 操作验收：本楼层 v4 系统字段未出现 `insert`，共检测到 `replace=21`、`delta=2`；`delta` 仅用于 NPC 好感度变化，符合当前变量更新策略。
- 风声系统验收：`风声列表` 成功更新为 2 条，分别指向 `醉玉小筑/后院花圃/苏芸` 与 `药庐/外廊/白芷`，未超过 3 条上限。
- 风险记录：额外变量模型仍输出 2 个 `<UpdateVariable>` 块；最终 MVU 以后一个块成功回流。该问题不阻塞当前验收，但仍需继续优化为单楼层单变量块，减少补丁覆盖风险。

### 14.18 白芷单人在场楼层验收记录（2026-05-23）

- 用户更新新楼层后，已运行 `pnpm check:mvu`，结果 PASS：0 failures，0 warnings。
- 最新 MVU 状态：`当前场景=宗门广场`，`时辰=晨时`，`在场NPC=[白芷]`，`风声列表=1`，`待处理交互=[]`。
- 动态角色栏验收：苏芸离开后，`系统.场景上下文.在场NPC` 成功收敛为仅 `白芷`，满足“不在场 NPC 不显示”的核心要求。
- 风声系统验收：`风声列表` 更新为 1 条，指向 `药庐/前廊/苏芸`，用于驱动玩家下一步追查。
- Patch 操作验收：本楼层 v4 系统字段未出现 `insert`，共检测到 `replace=11`、`delta=2`；`delta` 仅用于 NPC 好感度变化。
- 风险记录：额外变量模型仍输出 2 个 `<UpdateVariable>` 块；最终 MVU 以后一个块成功回流，当前不阻塞，但仍建议继续压缩为单楼层单变量块。

### 14.19 白芷递丹楼层验收记录（2026-05-23）

- 用户更新新楼层后，已运行 `pnpm check:mvu`，结果 PASS：0 failures，0 warnings。
- 最新 MVU 状态：`当前场景=宗门广场`，`时辰=晨时`，`在场NPC=[白芷]`，`风声列表=0`，`待处理交互=[]`。
- 动态角色栏验收：本楼层继续保持白芷单人在场，`系统.场景上下文.在场NPC` 与角色栏显示口径一致。
- 事件回流验收：`系统.场景上下文.特殊事件=同门接济`，`NPC活动.白芷=小心翼翼地递出辟谷丹`，可支撑前端场景叙事与后续 AI 承接。
- Patch 操作验收：本楼层 v4 系统字段未出现 `insert`，共检测到 `replace=10`、`delta=1`；`delta` 仅用于 `NPC/白芷/好感度 +5`。
- 风声系统验收：`风声列表=[]` 合法，表示该楼层没有新的可追查风声。
- 风险记录：额外变量模型仍输出 2 个 `<UpdateVariable>` 块；最终 MVU 以后一个块成功回流，当前不阻塞。

### 14.20 双变量块兼容模式验收记录（2026-05-23）

- 用户指出正文模型无法知道是否启用额外模型更新，因此项目需要评估“双变量块兼容模式”。
- 本楼层实机表现支持兼容模式：第一个 `<UpdateVariable>` 将 `系统.当前场景` 写为 `宗门广场`，第二个 `<UpdateVariable>` 将其补充/修正为 `药庐`，最终 `pnpm check:mvu` 读取到的最新 MVU 为 `当前场景=药庐`。
- 最新 MVU 状态：`当前场景=药庐`，`时辰=晨时`，`在场NPC=[苏芸]`，`公开度=半私密`，`风声列表=1`，`待处理交互=[]`。
- 兼容结论：在当前 SillyTavern/MVU 解析链路下，正文模型变量块可视作“剧情即时初稿”，额外模型变量块可视作“最终结构化补全/覆盖”；以后块成功回流为准。
- 风险边界：双块兼容只在后块字段更完整、无 v4 `insert`、`pnpm check:mvu` PASS 时成立；若前后块对库存扣减、灵石消耗、装备增减等非幂等操作都使用 `delta`，可能造成重复结算风险。
- 工程建议：短期保留额外模型作为最终变量裁决层；正文模型允许输出变量块但不得承担唯一权威。验收以最新 MVU 回流结果和额外模型后块为准。

---

## v4.1 双 UpdateVariable 块兼容实机验收结论（2026-05-23）

### 验收背景

实机楼层中同时出现正文模型与额外变量模型各自输出的 `<UpdateVariable><JSONPatch>`。项目需要确认这不会破坏 MVU 回流，也不会导致前端角色栏、开放场景、待处理交互闭环失效。

### 最终协议

- 允许同一楼层出现多个 `<UpdateVariable>` 块；工程推荐仍是单块输出，但解析与验收必须兼容双块。
- MVU 应按文本出现顺序应用每个 `JSONPatch` 数组。
- 同一路径多次更新时，以后出现的块为准。
- 正文模型块负责叙事承接与基础变量推进。
- 额外变量模型块负责字段补全、数值 `delta`、场景上下文精修。
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
