# 道具 AI 承接闭环 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让服装、禁器、丹药三套道具在下一楼层由 AI 稳定承接，做到“前端只入队，AI 叙事回应并回写变量，最后清空队列”。

**Architecture:** 不新增前端状态机，不让前端直接调用 AI。承接规则集中写入世界书变量规则与输出格式，三套道具的完整叙事库继续以绿灯资料库按需触发；前端只负责把逻辑名、显示名、器阶/部位、丹药分类/作用线、AI短提示写入 `系统.待处理交互`。

**Tech Stack:** YAML worldbook, TypeScript tests, Vitest, Zod schema, MVU JSONPatch.

---

## File Map

- Modify: `src/雌堕合欢宗/世界书/变量/变量更新规则.yaml`  
  Add unified rules for `购买物品` / `装备道具` / `卸下` / `使用物品`, including clothing, contraband, and pill metadata usage.
- Modify: `src/雌堕合欢宗/世界书/变量/变量输出格式.yaml`  
  Add concrete next-floor examples for clothing equip, contraband equip, and pill use; every example must narrate first and clear `系统.待处理交互` in the same patch.
- Modify: `src/雌堕合欢宗/世界书/道具系统.yaml`  
  Add a short “AI承接协议” section that points to logic-name keying, green-light narrative libraries, and no duplicate front-end mutations.
- Modify: `src/雌堕合欢宗/界面/composables/usePendingAction.test.ts`  
  Extend existing worldbook consistency test to assert the new closure phrases and fields exist in variable rules/output format.
- Modify: `src/雌堕合欢宗/界面/data/itemDisplay.test.ts`  
  Extend worldbook green-light tests only if needed to check all three narrative libraries are referenced by the closure docs.

---

### Task 1: Lock The Closure Contract In Tests

**Files:**
- Modify: `src/雌堕合欢宗/界面/composables/usePendingAction.test.ts`

- [ ] **Step 1: Write failing contract assertions**

Add these assertions inside `待处理交互类型在schema与世界书中保持一致` after the existing `outputFormat` checks:

```ts
expect(updateRules).toContain('道具AI承接闭环');
expect(updateRules).toContain('道具显示名');
expect(updateRules).toContain('丹药分类');
expect(updateRules).toContain('作用线');
expect(updateRules).toContain('道具.已生效效果');
expect(outputFormat).toContain('丹药使用下一楼层闭环样例');
expect(outputFormat).toContain('禁器装备下一楼层闭环样例');
expect(outputFormat).toContain('服装装备下一楼层闭环样例');
```

- [ ] **Step 2: Run RED test**

Run:

```powershell
npx vitest run src/雌堕合欢宗/界面/composables/usePendingAction.test.ts
```

Expected: FAIL because the new closure section and examples do not exist yet.

---

### Task 2: Add Unified AI Closure Rules

**Files:**
- Modify: `src/雌堕合欢宗/世界书/变量/变量更新规则.yaml`

- [ ] **Step 1: Add the closure section**

Append this section after `UI待处理交互闭环` and before `开放动态场景与双块兼容红线`:

```yaml
道具AI承接闭环:
  适用范围:
    - 服装、禁器、丹药、普通消耗品、特殊道具的购买、装备、卸下、使用承接。
    - 本节只约束下一楼层 AI 如何读取前端已入队动作，不要求前端直接调用 AI。
  主键原则:
    - 系统.待处理交互[].道具 永远是逻辑名，是库存、装备、变量回写的主键。
    - 道具显示名 只用于正文叙事，不得写回 道具.拥有 或 道具.装备。
    - 器阶、作用部位、丹药分类、作用线、AI短提示 都是叙事辅助字段，可为空。
  读取顺序:
    - 先读 系统.待处理交互。
    - 再读 道具.装备、道具.拥有、道具.已生效效果。
    - 再根据 道具显示名、器阶、作用部位、丹药分类、作用线、AI短提示 选择对应叙事重点。
    - 最后按需触发 世界书/道具/服装叙事规则、世界书/道具/禁器叙事规则、世界书/道具/丹药叙事规则。
  类型承接:
    购买物品:
      - 正文表现为玩家已获得该物，可写库藏、商会、宗门法阵或药匣交割。
      - 不要重复扣灵石，不要重复增加 道具.拥有；前端已经完成。
    装备道具:
      - 若有 器阶/作用部位，按禁器承接；若有服装显示名或服装世界书命中，按服装承接。
      - 不要重复插入 道具.装备；前端已经完成装备写入。
      - 可根据公开度、在场NPC、目标好感度写羞耻、抗拒、顺从或旁人反应。
    卸下:
      - 正文表现为装备或禁器被解除、残痕退去或身份压力暂时消散。
      - 不要重复从 道具.装备 移除；前端已经完成。
      - 卸下后不得继续写当前效果，除非作为残留痕迹、回忆或风声。
    使用物品:
      - 若有 丹药分类/作用线，按丹药承接；若是时间延长，按普通自用消耗承接。
      - 不要重复扣除 道具.拥有；前端已经完成库存减少。
      - 丹药优先写身体、气息、心神、公开羞耻或命契反应，再决定是否写 道具.已生效效果。
  已生效效果写入建议:
    - 临时丹药可以不写 道具.已生效效果，除非剧情需要跨楼层残留。
    - 永久丹药和仙奴丹若要形成长期痕迹，可 insert 到 /道具/已生效效果/-。
    - 来源交互ID 可为空字符串；效果标签使用短标签，例如 体香、羞耻阈值、命令反应、乳房外显。
  清空规则:
    - 已经叙事承接的交互，必须在同一次 <JSONPatch> 中 replace /系统/待处理交互 为 []。
    - 禁止只清空队列不写剧情。
    - 禁止让同一条待处理交互跨越超过一个 AI 回复楼层。
```

- [ ] **Step 2: Run RED/GREEN target after edit**

Run:

```powershell
npx vitest run src/雌堕合欢宗/界面/composables/usePendingAction.test.ts
```

Expected after only Task 2: still FAIL because output-format examples are not added yet.

---

### Task 3: Add Output Format Examples

**Files:**
- Modify: `src/雌堕合欢宗/世界书/变量/变量输出格式.yaml`

- [ ] **Step 1: Add clothing equip example**

Append after `使用物品下一楼层闭环样例`:

```yaml
服装装备下一楼层闭环样例:
  purpose: "用于约束AI承接前端服装装备：先写衣装在场景中的自然影响，再清空待处理交互。"
  input_state_example: |-
    系统:
      待处理交互:
        - 类型: 装备道具
          目标: 白芷
          道具: 透视罗裙
          道具显示名: 湿雾贴身裙
          AI短提示: 雾绡遇热贴身，行动时显出身体轮廓。
  reply_requirement:
    - 正文使用显示名或自然描述，不机械复述逻辑名。
    - 不要重复写入 道具.装备；前端已经装备。
    - 同一次 JSONPatch 必须清空 系统.待处理交互。
  output_example: |-
    <UpdateVariable>
    <Analysis>Handled pending outfit equip and cleared the queue.</Analysis>
    <JSONPatch>
    [
      { "op": "replace", "path": "/系统/待处理交互", "value": [] }
    ]
    </JSONPatch>
    </UpdateVariable>
```

- [ ] **Step 2: Add contraband equip example**

Append immediately after the clothing example:

```yaml
禁器装备下一楼层闭环样例:
  purpose: "用于约束AI承接禁器装备：使用器阶、作用部位和AI短提示写羞耻触发，不重复装备变量。"
  input_state_example: |-
    系统:
      待处理交互:
        - 类型: 装备道具
          目标: 白芷
          道具: 铃铛项圈
          道具显示名: 听铃颈环
          器阶: 启羞器阶
          作用部位: 颈项
          AI短提示: 细铃贴在颈侧，越想端住仪态，铃声越会替她泄露动作。
  reply_requirement:
    - 正文必须写佩戴后的当前场景反应，例如铃声、颈侧、旁人视线或遮掩动作。
    - 不要重复插入 道具.装备；前端已经装备。
    - 同一次 JSONPatch 必须清空 系统.待处理交互。
  output_example: |-
    <UpdateVariable>
    <Analysis>Handled pending contraband equip and cleared the queue.</Analysis>
    <JSONPatch>
    [
      { "op": "replace", "path": "/系统/待处理交互", "value": [] }
    ]
    </JSONPatch>
    </UpdateVariable>
```

- [ ] **Step 3: Add pill use example**

Append immediately after the contraband example:

```yaml
丹药使用下一楼层闭环样例:
  purpose: "用于约束AI承接丹药使用：使用显示名、分类、作用线和AI短提示写药性反应，按需写长期效果，并清空队列。"
  input_state_example: |-
    系统:
      待处理交互:
        - 类型: 使用物品
          目标: 白芷
          道具: 体香丹
          道具显示名: 引香丹
          丹药分类: 永久丹药
          作用线: 体态/社交
          AI短提示: 体香长期标记她的变化。
  reply_requirement:
    - 正文必须先写服丹后的气息、身体或心神变化，不要说“读取变量”。
    - 不要重复扣除 道具.拥有；前端已经扣库存。
    - 若写长期效果，可 insert 到 /道具/已生效效果/-。
    - 同一次 JSONPatch 必须清空 系统.待处理交互。
  output_example: |-
    <UpdateVariable>
    <Analysis>Handled pending pill use, recorded lasting scent effect, and cleared the queue.</Analysis>
    <JSONPatch>
    [
      { "op": "insert", "path": "/道具/已生效效果/-", "value": { "目标": "白芷", "道具": "体香丹", "来源交互ID": "", "生效楼层": 0, "效果标签": ["体香", "社交外显"], "可被AI覆盖": true } },
      { "op": "replace", "path": "/系统/待处理交互", "value": [] }
    ]
    </JSONPatch>
    </UpdateVariable>
```

- [ ] **Step 4: Run GREEN test**

Run:

```powershell
npx vitest run src/雌堕合欢宗/界面/composables/usePendingAction.test.ts
```

Expected: PASS.

---

### Task 4: Update 道具系统 Summary

**Files:**
- Modify: `src/雌堕合欢宗/世界书/道具系统.yaml`

- [ ] **Step 1: Add AI承接协议 summary**

Add under `道具系统.meta` or after `丹药系统`:

```yaml
  AI承接协议:
    - 前端只做购买、装备、卸下、使用的即时变量变化，并写入 系统.待处理交互。
    - AI 下一楼层必须先叙事承接，再按需写变量，最后清空 系统.待处理交互。
    - 逻辑名是变量主键；显示名、器阶、作用部位、丹药分类、作用线、AI短提示只是叙事辅助。
    - 服装、禁器、丹药完整描写规则分别保存在对应绿灯资料库，禁止蓝灯常驻整表。
```

- [ ] **Step 2: Run focused checks**

Run:

```powershell
npx vitest run src/雌堕合欢宗/界面/composables/usePendingAction.test.ts src/雌堕合欢宗/界面/data/itemDisplay.test.ts
git diff --check -- src/雌堕合欢宗/世界书/变量/变量更新规则.yaml src/雌堕合欢宗/世界书/变量/变量输出格式.yaml src/雌堕合欢宗/世界书/道具系统.yaml
```

Expected: tests PASS and no whitespace errors. CRLF/LF warnings are acceptable.

---

### Task 5: Final Verification

**Files:**
- All touched files.

- [ ] **Step 1: Run focused worldbook tests**

```powershell
npx vitest run src/雌堕合欢宗/界面/composables/usePendingAction.test.ts src/雌堕合欢宗/界面/data/itemDisplay.test.ts src/雌堕合欢宗/界面/pages/BackpackPage.test.ts src/雌堕合欢宗/界面/pages/ShopPage.test.ts
```

Expected: all listed tests pass.

- [ ] **Step 2: Verify key text exists**

```powershell
rg -n "道具AI承接闭环|丹药使用下一楼层闭环样例|禁器装备下一楼层闭环样例|服装装备下一楼层闭环样例|道具.已生效效果" src/雌堕合欢宗/世界书/变量/变量更新规则.yaml src/雌堕合欢宗/世界书/变量/变量输出格式.yaml src/雌堕合欢宗/世界书/道具系统.yaml
```

Expected: every key phrase appears.

- [ ] **Step 3: Run diff check**

```powershell
git diff --check
```

Expected: no whitespace errors. CRLF/LF warnings are acceptable.

- [ ] **Step 4: Summarize without claiming CDP validation**

Do not claim browser/CDP validation unless it was actually run. Summarize unit tests and worldbook text checks only.
