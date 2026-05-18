# PRD: L2 CDP 集成测试

## Problem Statement

L1 纯函数单元测试（100 个）已完成并全部通过，覆盖了 guards.ts 和 validate.ts 的全部场景。但单元测试无法验证从 MVU API 到 validateVariables 的完整事件链路在真实浏览器环境中是否正常工作。需要 L2 CDP 注入集成测试来弥补这一缺口。

已知的关键未知项：
1. Mvu.replaceMvuData() 是否触发 VARIABLE_UPDATE_ENDED 事件？
2. validateVariables 在真实事件链路中是否被正确调用？
3. Zod schema 的 clamp/transform 与后端校验的执行顺序是否正确？

## Solution

通过 Chrome DevTools Protocol 连接运行中的 SillyTavern，使用 Mvu.replaceMvuData 写入变量后读回，以行为验证方式确认 validateVariables 在完整链路中正确执行。

产出一个单文件测试运行器 cdp-l2-test.mjs，内置 Snapshot 隔离、状态稳定检测、monkey-patch 追踪、递归保护、18 个测试场景、JSON 报告输出。

运行方式：``node cdp-l2-test.mjs [--port 9223]``

## User Stories

1. 作为开发者，我希望通过 CDP 自动连接 SillyTavern 页面，以便无需手动操作浏览器
2. 作为开发者，我希望自动发现 SillyTavern target（按 title 匹配），以便无需硬编码页面 ID
3. 作为开发者，我希望每个测试用例独立运行（Snapshot/Restore），以便测试之间不互相污染
4. 作为开发者，我希望用 waitForStableState 替代固定 sleep，以便测试更快更可靠
5. 作为开发者，我希望通过 monkey-patch 追踪 replaceMvuData 调用，以便验证写入链路
6. 作为开发者，我希望检测值振荡（Mutation Loop Guard），以便发现无限递归问题
7. 作为开发者，我希望验证 Mvu API 在主页面上下文可用，以便确认基础设施就绪
8. 作为开发者，我希望验证灵石/好感度/攻略值的基本读写，以便确认 MVU 数据管道通畅
9. 作为玩家，我希望好感度超过 100 时被 clamp 到 100，以便数值不溢出
10. 作为玩家，我希望好感度为负数时被 clamp 到 0，以便数值不为负
11. 作为玩家，我希望灵石为负数时被修正为 0，以便不会欠系统钱
12. 作为玩家，我希望攻略值超过 100 时被 clamp 到 100，以便数值在合理范围
13. 作为玩家，我希望剩余天数 29.998 被取整为 29，以便显示整数天数
14. 作为玩家，我希望好感度>=30 时攻略值能正常保留，以便亲密行为有合理的情感基础
15. 作为玩家，我希望好感度<30 时攻略值被清零，以便防止数值错乱
16. 作为玩家，我希望粘滞计数达到 3 时自动触发攻略值增长，以便防爆机制正常
17. 作为玩家，我希望装备道具时检查好感度门槛，以便低好感度 NPC 不能装备高级道具
18. 作为玩家，我希望非当前攻略链 NPC 的攻略值增长被阻止，以便攻略链顺序被强制执行
19. 作为玩家，我希望剩余天数归零时自动切换到 Phase 2，以便游戏阶段正确转换
20. 作为玩家，我希望 Phase 2 中 NPC 变量被冻结，以便 Phase 1 的成果被保留
21. 作为开发者，我希望测试 null/字符串/Infinity 等非法输入，以便验证脏数据容错
22. 作为开发者，我希望每次测试后检测值是否振荡，以便发现异步事件链中的二次触发
23. 作为开发者，我希望测试结果以 JSON 格式输出，以便后续 CI 集成
24. 作为开发者，我希望 Phase 0.3 作为链路验证的哨兵测试，以便快速判断事件链是否通畅

## Implementation Decisions

### 核心架构决策

1. **行为验证而非事件验证**
   - eventOn / eventEmit 在 CDP 主页面上下文不可用（仅限酒馆助手脚本 iframe）
   - 改为写入应被修正的值，读回后检查是否被 validateVariables 修正
   - 例：写入 好感度=0 + 攻略值=5，读回攻略值=0 则说明校验已执行

2. **Snapshot/Restore 测试隔离**
   - 测试开始时用 structuredClone 保存 MVU 数据快照
   - 每个测试前用原始 replaceMvuData（绕过 monkey-patch）恢复快照
   - 获得测试独立性、可重复性、顺序无关性

3. **waitForStableState 替代固定 sleep**
   - 连续 3 次读取（间隔 100ms）状态相同则判定稳定
   - 超时 2 秒，比固定 500ms 更快更可靠

4. **Monkey-patch 追踪替代 eventOn 监听**
   - 包装 Mvu.replaceMvuData 添加调用日志到 window.__L2.trace
   - restore 使用原始函数（不触发追踪），测试写入使用包装函数

5. **Mutation Loop Guard**
   - 写入后连续读取 3 次（间隔 200ms），检测值是否振荡
   - 用于发现 validateVariables 可能的二次触发或死循环

### CDP 连接层

- GET http://localhost:9223/json 自动发现 SillyTavern target（按 title 匹配）
- 原生 WebSocket 连接（Node.js v25 内置，零依赖）
- Runtime.evaluate + returnByValue + awaitPromise，10 秒超时
- 端口可配置（默认 9223）

### 浏览器端基础设施

- 全部注入到 window.__L2 命名空间
- 一次 cdpEval 注入，后续测试通过该命名空间调用
- 包含：snapshot、restore、readVar、writeVar、writeVars、waitStable、checkStable、trace

### 测试执行策略

- 每个测试用例为独立的 cdpEval 调用（一个 async IIFE 字符串）
- 返回 ``{ actual, expected, pass, note? }`` 结构化结果
- Phase 5（非法类型）标记为 WARN，不计入通过率
- Phase 0.3 作为哨兵：如果失败则后续校验类测试可能受影响

### 备选方案

如果 replaceMvuData 不触发 VARIABLE_UPDATE_ENDED：
- 回退到 parseMessage + replaceMvuData 组合
- 或回退到纯数据比较（验证 Zod schema coerce/clamp）
- Phase 0.3 自动检测并报告

## Testing Decisions

### 测试标准

- 行为验证：只检查输入到输出，不检查内部实现
- 每个测试对应一个具体的游戏场景
- 测试名称使用中文描述，便于理解
- Snapshot/Restore 保证测试独立性

### 测试场景（18 个）

**Phase 0: API 发现（3 个）**
- 0.1 Mvu 全局存在
- 0.2 replaceMvuData 可用
- 0.3 写入读回链路验证（哨兵测试：好感度<30 应清零攻略值）

**Phase 1: 基础读写（3 个）**
- 1.1 灵石写入读回
- 1.2 白芷好感度写入读回
- 1.3 白芷攻略值写入读回

**Phase 2: 范围校验（5 个）**
- 2.1 好感度溢出 → clamp 到 100
- 2.2 好感度负数 → clamp 到 0
- 2.3 灵石负数 → clamp 到 0
- 2.4 攻略值溢出 → clamp 到 100
- 2.5 剩余天数取整 29.998 → 29

**Phase 3: 游戏逻辑（5 个）**
- 3.1 好感度>=30 保留攻略值
- 3.2 好感度<30 清零攻略值
- 3.3 粘滞=3 触发攻略值增长
- 3.4 装备门槛校验（口塞需好感度>=30）
- 3.5 攻略链强制（非当前NPC攻略值回退）

**Phase 4: 阶段切换（2 个）**
- 4.1 剩余天数=0 触发 Phase 2
- 4.2 Phase 2 冻结 NPC 变量

**Phase 5: 非法类型注入（3 个，WARN）**
- 5.1 null 值输入
- 5.2 字符串数字输入
- 5.3 Infinity 输入

### 已有测试基础

- L1 guards.test.ts（40 个）和 validate.test.ts（60 个）全部通过
- 本 PRD 是 L2 层，验证完整链路而非纯函数

## Out of Scope

- L3 实际消息端到端测试（依赖 AI 输出质量）
- MVU 框架本身的测试（第三方代码）
- Zod 4 的 clamp/transform 机制测试（第三方代码）
- SillyTavern 核心功能测试
- 前端 UI 组件测试（Vue 组件）
- 性能测试
- AI 输出质量测试（prompt engineering）
- Property-based Fuzz Testing（P3 后续增强）
- Headless 自动启动 Chrome + SillyTavern（P3 后续增强）
- Schema vs Runtime 分层验证（P2 后续增强）
- 并发写入测试（P2 后续增强）

## Further Notes

### 前置条件

1. Chrome 调试模式：``--remote-debugging-port=9223``
2. SillyTavern 运行中，雌堕合欢宗角色卡已加载
3. Node.js >= 18（当前 v25.8.1，原生 WebSocket + structuredClone）

### 可行性验证结果

已通过实际 CDP 连接验证：
- **CDP 连接**：原生 WebSocket 可连接，Runtime.evaluate 可执行 JS
- **Mvu API**：Mvu / TavernHelper / replaceMvuData / parseMessage / getMvuData 全部可用
- **数据结构**：stat_data 包含 系统（阶段/剩余天数/灵石）和 NPC（白芷/苏芸/纪兰/沈月秋/柳素衣）
- **事件系统**：eventOn / eventEmit / waitGlobalInitialized 在主页面不可用（仅限 iframe）
- **structuredClone** 可用

### 关键设计决策速查

| 决策 | 理由 |
|------|------|
| 行为验证而非事件验证 | eventOn 在 CDP 主页面不可用 |
| monkey-patch 替代 event trace | 可在主页面追踪 replaceMvuData 调用 |
| Snapshot/Restore | 测试独立，可单独重跑 |
| waitForStableState | 比固定 sleep 更快更可靠 |
| Phase 5 标记 WARN | 非法类型行为需实际运行确认 |
| 原生 WebSocket | Node v25 内置，零依赖 |

### 产出文件

| 文件 | 操作 | 说明 |
|------|------|------|
| cdp-l2-test.mjs | 新增 | 单文件测试运行器，约 400 行 |
| l2-report.json | 生成 | 测试结果 JSON 报告（运行时生成） |

### 后续步骤

1. 实现 cdp-l2-test.mjs
2. 运行测试，根据结果修复发现的问题
3. （P2）JSON 报告输出 + CI 集成
4. （P3）Headless 自动启动 + Fuzz Testing
