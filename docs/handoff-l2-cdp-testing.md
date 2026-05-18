# Handoff: 雌堕合欢宗 — 后端校验提取 + 测试覆盖

## 会话摘要

完成了后端校验逻辑的纯函数提取、粘滞阈值统一、剩余天数取整，并编写了 100 个单元测试全部通过。产出了 PRD 和 L2 CDP 测试计划。

## 产出物

- **docs/PRD-后端校验与测试系统.md** — 完整 PRD，25 条用户故事，三层测试体系
- **docs/handoff-后端校验增强.md** — 上次会话 handoff（设计阶段）
- **docs/handoff.md** — 最初 handoff（实现前）

## 已完成的工作

1. **提取 validate.ts**（新增）
   - 从 脚本/后端校验/index.ts 提取出 `validateVariables(new_data, old_data)` 纯函数
   - 包含全部 15 条校验规则
   - 路径: `src/雌堕合欢宗/脚本/后端校验/validate.ts`

2. **简化 index.ts**（已修改）
   - 仅保留事件监听（BEFORE_MESSAGE_UPDATE + VARIABLE_UPDATE_ENDED）
   - 调用 `validateVariables()` 执行实际校验
   - 路径: `src/雌堕合欢宗/脚本/后端校验/index.ts`

3. **粘滞阈值统一为 3**（已修改）
   - `guards.ts` 中 `check粘滞触发` 和 `get粘滞阈值` 统一返回 3
   - 之前: 亲密接触=3, NSFW行为=2
   - 现在: 统一=3
   - 函数签名仍接受 `行为类型` 参数（接口兼容），但内部忽略
   - CONTEXT.md 已更新

4. **剩余天数 Math.floor 取整**（新增逻辑）
   - 在 validate.ts 中，Phase 2 切换检查之后执行
   - 29.998 -> 29, 28.998 -> 28
   - 0.5 不触发 Phase 2（因为 0.5 > 0），但 floor 后存储为 0

5. **100 个单元测试**（全部通过）
   - `界面/guards.test.ts` — 40 个测试
   - `脚本/后端校验/validate.test.ts` — 60 个测试
   - 覆盖: 好感度增量、攻略值解锁、粘滞触发、攻略链强制、装备门槛、灵石负数、数值溢出、Phase 2 转换/冻结、改变阵法购买、堕落度单调、剩余天数取整等

## 当前代码状态

项目路径: `D:\ai\tavern_helper_template-main\tavern_helper_template-main\`

| 文件 | 状态 | 说明 |
|------|------|------|
| src/雌堕合欢宗/脚本/后端校验/validate.ts | 新增 | 纯校验函数，15 条规则 |
| src/雌堕合欢宗/脚本/后端校验/validate.test.ts | 新增 | 60 个测试 |
| src/雌堕合欢宗/脚本/后端校验/index.ts | 已简化 | 仅事件接线 |
| src/雌堕合欢宗/界面/guards.ts | 已修改 | 粘滞阈值统一为 3 |
| src/雌堕合欢宗/界面/guards.test.ts | 已重写 | 40 个测试（编码修复+阈值更新） |
| CONTEXT.md | 已更新 | 粘滞计数描述 |
| docs/PRD-后端校验与测试系统.md | 新增 | 完整 PRD |

运行测试: `cd tavern_helper_template-main && npx vitest run`

## 待完成: L2 CDP 注入测试

PRD 中已规划，下一步需要执行:

### 前置条件
- Chrome 调试模式 (`--remote-debugging-port=9223`)
- SillyTavern 运行中，MVU 已加载
- localhost:5500 状态栏服务

### CDP 工具
- 辅助脚本: `C:\Users\98634\AppData\Local\Temp\cdp.mjs`
- 用法: `node cdp.mjs eval "JS表达式"`
- 注意: 需要先确认端口是否为 9223，脚本内硬编码了端口

### 测试计划（9 个场景）

Phase 0: API 发现
- 确认 Mvu / TavernHelper 全局存在
- 读取 stat_data 确认路径结构
- 测试哪个 API 能触发 VARIABLE_UPDATE_ENDED

Phase 1: 基础读写 (3项)
- 灵石=999 -> 读回
- 白芷好感度=50 -> 读回
- 白芷攻略值=5 -> 读回

Phase 2: 范围校验 (5项)
- 好感度=150 -> 应为 100
- 好感度=-5 -> 应为 0
- 灵石=-100 -> 应为 0
- 攻略值=105 -> 应为 100
- 剩余天数=29.998 -> 应为 29

Phase 3: 游戏逻辑 (5项)
- 好感度=30, 攻略值=5 -> 应保留
- 好感度=29, 攻略值=5 -> 应为 0
- 粘滞=3, 好感度=50 -> 攻略值增加, 粘滞=0
- 装备口塞(好感度20) -> 被移除
- 同时改白芷+苏芸攻略值 -> 苏芸被回退

Phase 4: 阶段切换 (2项)
- 剩余天数=0 -> 牝奴期
- Phase 2 改白芷好感度 -> 回退

### 关键未知项
- `Mvu.setVariable()` 是否触发 `VARIABLE_UPDATE_ENDED`？如果不触发，需要用 `TavernHelper.updateVariablesWith()` 或其他 API
- MVU 变量更新是同步还是异步？可能需要等待 200-500ms
- Zod schema 的 clamp 是在事件触发前还是后执行？这决定了后端校验的 clamp 是冗余还是必要

## 建议的 Skill

- `/diagnose` — 如果 L2 测试发现变量更新异常，用此 skill 系统性排查
- `/grill-with-docs` — 如果需要对测试结果进行设计审查

## 关键设计决策速查

- **粘滞阈值**: 统一 3（guards + 后端校验一致）
- **剩余天数**: Math.floor 取整，在 Phase 2 检查之后执行
- **校验顺序**: Phase 2 切换 -> 冻结 -> 攻略链 -> 装备门槛 -> 改变阵法 -> 粘滞 -> 范围校验
- **攻略值公式**: floor(基础值 x 好感度 / 50)
- **好感度门槛**: 0/30/50/70/90 五档
- **改变阵法前置**: 柳素衣攻略值=100，不满足退款 500000