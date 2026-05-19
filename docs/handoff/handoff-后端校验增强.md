# Handoff: 雌堕合欢宗 — 后端校验增强

## 会话摘要

本次会话完成了一次完整的 design grill，对「雌堕合欢宗」MVU 角色卡项目的设计进行了压力测试。发现并确认了多个后端校验缺失的问题，产出了一份 PRD 和更新后的 CONTEXT.md。

## 产出物

- **PRD**: `docs/PRD-后端校验增强.md` — 16 条用户故事，6 项后端校验扩展，guards.ts 修复，前端接入
- **CONTEXT.md**: 已更新 — 新增攻略链顺序强制、装备语义、好感度门槛执行规则等定义
- **全景指南**: `src/知识库/青空莉教程/stagedog_site/青空莉酒馆开发全景指南.md` — 从教程站整理的开发知识框架

## 当前代码状态

项目路径: `d:\ai\tavern_helper_template-main\tavern_helper_template-main\src\雌堕合欢宗\`

已有且可工作的:
- `schema.ts` — Zod 变量结构定义，无需修改
- `脚本/变量结构/index.ts` — 注册 schema 到 MVU，无需修改
- `脚本/后端校验/index.ts` — 基础范围校验（好感度/攻略值/灵石/堕落度），**需要大幅扩展**
- `界面/guards.ts` — 校验函数集，**需要修复幻影名称 + 新增函数**
- `界面/guards.test.ts` — 单元测试，**需要更新以匹配 guards.ts 修复**
- `界面/pages/` — 四个页面组件，**ShopPage 和 BackpackPage 需要接入 guards**
- `界面/store.ts` — Pinia MVU store，无需修改
- `世界书/` — 全部条目已就绪，无需修改

## 已确认的设计决策（10 项）

详见 PRD 的 Implementation Decisions 和 CONTEXT.md。核心要点:

1. 剩余天数=0 → 后端自动切换为「牝奴期」
2. 粘滞计数到达阈值 → 后端自动触发攻略值增长并归零
3. Phase 2 时冻结 NPC 变量
4. 攻略链顺序强制: 只有当前 NPC 攻略值可增长
5. 装备时（非购买时）检查好感度门槛
6. 改变阵法购买前置: 柳素衣攻略值=100
7. 装备语义: Phase 1 玩家→NPC / Phase 2 NPC→玩家
8. guards.ts 幻影分类名替换为真实道具名
9. `固敏丹` 补充到 guards.ts 门槛映射
10. ShopPage/BackpackPage 接入 `checkItemThreshold`

## 下一步

按 PRD 中的开发顺序执行:

1. **修复 `guards.ts`** — 幻影名称替换 + 补充固敏丹 + 新增 getCurrentNpc / canIncrease攻略值 / shouldEnterPhase2 函数
2. **更新 `guards.test.ts`** — 匹配修复后的 guards.ts
3. **扩展 `后端校验/index.ts`** — 6 项新校验逻辑
4. **接入 ShopPage / BackpackPage** — 调用 checkItemThreshold
5. **端到端测试** — pnpm watch → 酒馆实时调试

## 建议的 Skill

- `/tdd` — 用于按 red-green-refactor 循环实现 guards.ts 新增函数和后端校验逻辑
- `/diagnose` — 如果调试过程中发现变量更新异常，用此 skill 进行系统性排查
