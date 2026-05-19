# PRD: 后端校验系统增强 — 攻略链强制、粘滞触发兜底、道具门槛执行

## Problem Statement

雌堕合欢宗角色卡的后端校验（`脚本/后端校验/index.ts`）当前只做了基础的数值范围校验（好感度 0~100、灵石不为负等），缺少多个关键的游戏规则强制执行。这导致 AI 可能输出违反游戏设计的变量更新，例如：

- 剩余天数归零时未自动切换为牝奴期
- 粘滞计数到达阈值时未自动触发攻略值增长
- 攻略链顺序被打破（跳过前置 NPC 直接攻略后面的 NPC）
- 好感度不足时仍能装备高级道具
- Phase 2 时 NPC 变量仍被修改

同时，`guards.ts` 中存在道具名称不一致（幻影分类名）和缺失道具的问题，且 `ShopPage.vue` 和 `BackpackPage.vue` 从未调用 `checkItemThreshold` 函数。

## Solution

扩展后端校验系统，将所有核心游戏规则从"仅提示词约束"升级为"提示词引导 + 后端校验兜底"。修复 guards.ts 中的数据不一致问题。将 guards 函数接入前端 UI。

## User Stories

1. As a 玩家, I want 剩余天数归零时自动进入牝奴期, so that 不会因 AI 遗忘导致卡在攻略期
2. As a 玩家, I want 粘滞计数到达阈值时自动触发攻略值增长并归零, so that 攻略值推进不依赖 AI 正确执行计数逻辑
3. As a 玩家, I want 只能按攻略链顺序攻略 NPC, so that 体验连贯的剧情推进
4. As a 玩家, I want 当前 NPC 之外的其他 NPC 攻略值被锁定, so that 不能跳跃式攻略
5. As a 玩家, I want 好感度可以自由提升不受攻略链限制, so that 可以提前培养后续 NPC 的好感
6. As a 玩家, I want 装备道具时检查好感度门槛, so that 不能在好感度不足时使用高级道具
7. As a 玩家, I want 购买道具时不检查好感度门槛, so that 可以提前囤货
8. As a 玩家, I want 进入牝奴期后 NPC 变量被冻结, so that Phase 1 变量不会在 Phase 2 被意外修改
9. As a 玩家, I want 购买改变阵法需要柳素衣攻略值=100, so that GOOD END 有明确的前置条件
10. As a 玩家, I want 不满足购买条件的商品灰置不可购买, so that UI 反馈清晰
11. As a 玩家, I want Phase 1 购买的道具在 Phase 2 随机装备在玩家身上, so that 体验道具反噬的叙事张力
12. As a 玩家, I want 装备语义在两个阶段有明确区分, so that AI 不会搞混道具的使用方向
13. As a 开发者, I want guards.ts 中的道具名称与 items.ts/outfits.ts 完全一致, so that 校验逻辑不会因名称不匹配而失效
14. As a 开发者, I want checkItemThreshold 被 ShopPage 和 BackpackPage 正确调用, so that 好感度门槛在 UI 层生效
15. As a 开发者, I want 后端校验逻辑按职责拆分为独立的校验函数, so that 每个规则可独立测试
16. As a 开发者, I want guards.ts 的单元测试覆盖所有新增逻辑, so that 回归测试有保障

## Implementation Decisions

### 1. 后端校验扩展（脚本/后端校验/index.ts）

在 `VARIABLE_UPDATE_ENDED` 事件中新增以下校验逻辑，按执行顺序排列：

**1a. Phase 切换自动触发**
- 当 `系统.剩余天数` 变为 0 时，自动将 `系统.阶段` 设为 `'牝奴期'`
- 同时触发 Phase 2 初始化：冻结 NPC 变量、灵石归零、道具随机装备到玩家

**1b. 攻略链顺序强制**
- 计算"当前 NPC"：攻略链 `['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣']` 中第一个 `状态 !== '已完成'` 的 NPC
- 只有当前 NPC 的攻略值允许增长，其他 NPC 的攻略值回退到旧值
- 好感度不受此限制，所有 NPC 均可自由提升

**1c. 粘滞触发兜底**
- 对每个 NPC：当 `粘滞计数 >= 阈值`（亲密接触 3 / NSFW 行为 2）且 `好感度 >= 30` 时：
  - 自动计算攻略值增量：`floor(基础值 × 好感度 ÷ 50)`
  - 将增量加到攻略值上（上限 100）
  - 粘滞计数归零
- 当 `粘滞计数 > 3`（超过最大阈值）时强制归零

**1d. 装备门槛校验**
- 当 `道具.装备` 字段发生变化时，检查新增装备的道具是否满足对应角色的好感度门槛
- 不满足时移除该装备项

**1e. 改变阵法购买前置校验**
- 当 `道具.拥有.改变阵法` 从 0 变为 1 时，检查柳素衣攻略值是否 = 100
- 不满足时回退购买（灵石返还、道具移除）

**1f. Phase 2 变量冻结**
- 当 `系统.阶段 === '牝奴期'` 时，NPC 的好感度/攻略值/粘滞计数不允许变化
- 回退到旧值

### 2. Guards 模块修复（界面/guards.ts）

**2a. 修复幻影分类名**
- 将 `'绑定系服装'` 替换为实际道具名：`'绑带装', '龟甲缚衣', '吊带束缚裙'`
- 将 `'金属系服装'` 替换为：`'金属链衣', '金属胸罩', '金属腰链'`
- 将 `'绘纹系服装'` 替换为：`'淫纹绘衣', '符文肚兜'`
- 将 `'永久丹药全部'` 替换为实际丹药名列表
- 将 `'所有服装'` 替换为实际服装名列表（或改用前缀匹配逻辑）

**2b. 补充缺失道具**
- 添加 `固敏丹`（门槛 50）到 guards.ts 的门槛映射

**2c. 新增攻略链校验函数**
- `getCurrentNpc(npcStates): string` — 返回当前可攻略的 NPC 名
- `canIncrease攻略值(npcName, currentNpc): boolean` — 判断是否允许增长攻略值

**2d. 新增 Phase 切换函数**
- `shouldEnterPhase2(剩余天数): boolean` — 判断是否应切换到 Phase 2
- `initializePhase2(data): void` — 执行 Phase 2 初始化逻辑

### 3. 前端 UI 接入 guards（ShopPage.vue / BackpackPage.vue）

**3a. ShopPage**
- `canBuy` 函数增加好感度门槛检查（仅对装备类道具，非消耗品）
- 改变阵法：检查柳素衣攻略值 = 100，不满足时灰置

**3b. BackpackPage**
- `toggleEquip` 函数在装备前调用 `checkItemThreshold`
- 不满足门槛时显示提示（锁定图标 + 好感度要求）

### 4. Schema 无需变更

当前 `schema.ts` 的变量结构已经覆盖所有需要的字段，无需新增或修改。

## Testing Decisions

### 测试原则

- 测试外部行为（变量校验结果），不测试实现细节
- 每个校验规则对应独立的测试用例组
- 覆盖正常路径和边界条件

### 需要测试的模块

**1. guards.ts — 新增函数**
- `getCurrentNpc`：各种 NPC 完成组合下的返回值
- `canIncrease攻略值`：当前 NPC vs 非当前 NPC
- `shouldEnterPhase2`：剩余天数 = 0 和 > 0
- `checkItemThreshold`：修复后的道具名匹配

**2. 后端校验逻辑**
- Phase 切换：剩余天数 30→1 不触发，30→0 触发
- 攻略链：白芷未完成时苏芸攻略值不允许增长
- 粘滞触发：计数 2→3 时触发增长并归零
- 装备门槛：好感度 20 时装备淫纹应被拒绝
- Phase 2 冻结：牝奴期时 NPC 变量变化应被回退
- 改变阵法：柳素衣攻略值 < 100 时购买应被回退

**3. 已有测试更新**
- `guards.test.ts`：更新道具名称以匹配修复后的 guards.ts
- 补充 `固敏丹` 的测试用例

### 不需要测试的部分

- Vue 组件渲染（依赖酒馆 iframe 环境）
- AI 输出内容（由世界书规则约束）
- EJS 模板解析（酒馆内置功能）

## Out of Scope

1. **NPC 条目 EJS 条件分支** — 暂不添加，先观察实际效果
2. **Phase 2 牝奴系统的扩展** — 本次只涉及 Phase 2 初始化和变量冻结
3. **前端界面视觉改版** — 只接入校验逻辑，不改 UI 设计
4. **流式楼层界面** — 不在本次范围内
5. **世界书条目内容修改** — 只修改后端校验和前端 guards
6. **tavern_sync 配置修复** — YAML 语法问题单独处理

## Further Notes

### 开发顺序

1. 修复 `guards.ts`（幻影名称 + 缺失道具 + 新增函数）
2. 更新 `guards.test.ts`
3. 扩展 `后端校验/index.ts`
4. 接入 `ShopPage.vue` 和 `BackpackPage.vue`
5. 端到端测试：pnpm watch → 酒馆实时调试

### 依赖关系

- guards.ts 的修复必须先于后端校验扩展（后端校验会调用 guards 函数）
- ShopPage/BackpackPage 的接入独立于后端校验，可并行开发
- 所有改动不涉及 schema.ts，无需重新注册变量结构

### 风险

- 粘滞触发的自动增长可能与 AI 的 `<UpdateVariable>` 输出冲突（AI 同时也在更新攻略值）→ 需要在后端校验中处理并发更新的情况
- Phase 2 初始化的"道具随机装备"逻辑需要明确随机规则（哪些道具参与、装备到哪个槽位）
