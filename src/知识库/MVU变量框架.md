# MVU变量框架

> MVU ZOD 变量结构指南、MVU 变量框架接口、MVU 自查标准、MVU 前端状态栏自查

## MVU_ZOD指南

MVU ZOD 变量框架工作流

系统组成：
- 变量结构脚本（Zod Schema，角色脚本）→ 定义类型和约束
- [initvar]初始变量（世界书条目，禁用）→ YAML初始值
- 变量列表（世界书条目）→ 让AI看到当前值
- [mvu_update]变量更新规则（世界书条目）→ 告诉AI何时更新
- [mvu_update]变量输出格式（世界书条目）→ 告诉AI用JSON Patch输出
- 酒馆正则 → 隐藏<UpdateVariable>块
- 脚本/界面（可选）→ 后台控制/显示变量

一、变量结构脚本

z和_已全局可用，不要import。放在角色脚本中。

import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';
export const Schema = z.object({
  角色: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    物品栏: z.record(z.string().describe('物品名'), z.object({
      描述: z.string(),
      数量: z.coerce.number().prefault(1),
    })).transform(data => _.pickBy(data, ({数量}) => 数量 > 0)),
  }),
});
$(() => { registerMvuSchema(Schema); });

Zod 4规则：
- z.coerce.number() 优于 z.number()
- z.prefault 优于 z.default
- z.transform做约束（clamp而非min/max）
- 对象优于数组（z.record优于z.array）
- 不用z.strict/z.passthrough（不存在）
- transform只接受一个参数(value)=>...
- 保持幂等：Schema.parse(Schema.parse(x)) === Schema.parse(x)

二、初始变量

条目名：[initvar]变量初始化勿开，禁用状态
YAML格式，与Schema对应：
角色:
  好感度: 35
  物品栏:
    创可贴:
      描述: 卡通创可贴
      数量: 1

不同开局方案：
- 全量：开局消息中<UpdateVariable><initvar>完整YAML</initvar></UpdateVariable>
- 增量：<UpdateVariable><JSONPatch>[{"op":"replace","path":"/角色/好感度","value":50}]</JSONPatch></UpdateVariable>

三、变量列表

条目名：变量列表（不加[mvu_update]），D0/D1，顺序200
固定内容：
---
<status_current_variable>
{{format_message_variable::stat_data}}
</status_current_variable>

四、变量更新规则

条目名：[mvu_update]变量更新规则，D0，顺序200
---
变量更新规则:
  角色:
    好感度:
      type: number
      range: 0~100
      check:
        - 根据角色反应调整±(3~6)
    物品栏:
      type: |-
        { [物品名: string]: { 描述: string; 数量?: number } }
      check:
        - 获取/消耗物品时更新

编写技巧：自明变量省略规则，同类变量合并，_开头只读变量不写

五、变量输出格式

条目名：[mvu_update]变量输出格式，D0(Gemini)/D4(Claude)，顺序200
固定内容（英文或中文版均可）：
---
变量输出格式:
  rule:
    - you must output the update analysis and the actual update commands at once in the end of the next reply
    - the update commands works like **JSON Patch (RFC 6902)**, supports: replace/delta/insert/remove/move
    - don't update fields starting with `_`
  format: |-
    <UpdateVariable>
    <Analysis>$(IN ENGLISH, no more than 80 words)
    - ${calculate time passed}
    - ${decide dramatic updates allowed: yes/no}
    - ${analyze every variable based on check}
    </Analysis>
    <JSONPatch>
    [
      { "op": "replace", "path": "${/path}", "value": "${new}" },
      { "op": "delta", "path": "${/path}", "value": "${delta}" },
      { "op": "insert", "path": "${/path/new_key}", "value": "${new}" },
      { "op": "remove", "path": "${/path}" },
      ...
    ]
    </JSONPatch>
    </UpdateVariable>

JSON Patch路径：用/分隔，不需要stat_data前缀

六、正则配置

导入三个正则（美化/折叠/仅提示版）：
- [不发送]去除变量更新：仅格式提示词，替换<UpdateVariable>为空
- [美化/折叠]变量更新中：仅格式显示，美化显示
- [美化/折叠]完整变量更新：仅格式显示

七、脚本控制变量

前置：await waitGlobalInitialized('Mvu');

获取变量：
const vars = Mvu.getMvuData({type:'message', message_id:-1});
const stat = _.get(vars, 'stat_data');

写回变量：
await Mvu.replaceMvuData(vars, {type:'message', message_id:id});

监听更新命令解析：
eventOn(Mvu.events.COMMAND_PARSED, commands => {
  commands.forEach(cmd => { cmd.args[0] = cmd.args[0].replaceAll('-',''); });
});

监听更新结束：
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_vars, old_vars) => {
  // 限制变动幅度
  const old = _.get(old_vars, 'stat_data.好感度');
  _.update(new_vars, 'stat_data.好感度', v => _.clamp(v, old-3, old+3));
});

解析AI生成结果中的命令：
const data = await Mvu.parseMessage(message, old_data);
await Mvu.replaceMvuData(data, {type:'message', message_id:id});

八、界面显示

MVU自动附加<StatusPlaceHolderImpl/>，配合正则：
- [不发送]界面占位符：仅格式提示词，替换为空
- [界面]状态栏：仅格式显示，替换为界面代码

纯文本示例：
💖 好感度: {{format_message_variable::stat_data.角色.好感度}}

前端界面须在init中：
await waitGlobalInitialized('Mvu');
populateCharacterData();
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => populateCharacterData());

九、特殊前缀

无前缀：AI可见可更新
_前缀：AI可见不可更新（只读）
$前缀：AI不可见，脚本/提示词可更新

十、EJS读取 vs AI更新路径

EJS/状态栏：stat_data.角色.好感度
AI JSON Patch：/角色/好感度（无stat_data）

---

## 16_MVU变量框架

【MVU变量框架】
来源: @types/iframe/exported.mvu.d.ts
用途: 与MVU变量框架交互——获取/修改MVU变量、解析变量更新命令、监听变量事件
前提: 必须先 await waitGlobalInitialized('Mvu') 才能使用

════════════════════════════════════════
一、获取MVU数据
════════════════════════════════════════

Mvu.getMvuData(option) → MvuData

  option: 与变量读写相同的VariableOption
  MvuData: {
    initialized_lorebooks: Record     // 已初始化的世界书
    stat_data: Record<string,any>     // 实际变量数据(核心!)
    ...
  }

  示例:
    await waitGlobalInitialized('Mvu');
    // 获取最新楼层的MVU数据
    const data = Mvu.getMvuData({type:'message', message_id:'latest'});
    const stat = data.stat_data;  // 这就是变量

    // 获取前端界面所在楼层
    const data = Mvu.getMvuData({type:'message', message_id:getCurrentMessageId()});

════════════════════════════════════════
二、替换MVU数据
════════════════════════════════════════

Mvu.replaceMvuData(mvu_data, option) → Promise<void>

  示例:
    const data = Mvu.getMvuData({type:'message', message_id:'latest'});
    _.set(data, 'stat_data.角色.好感度', 30);
    await Mvu.replaceMvuData(data, {type:'message', message_id:'latest'});

════════════════════════════════════════
三、解析变量更新命令
════════════════════════════════════════

Mvu.parseMessage(message, old_data) → Promise<MvuData>

  解析包含 _.set() 等命令的消息字符串，更新变量
  用于自行调用generate后手动更新变量(因为不会自动触发MVU)

  示例:
    const old_data = Mvu.getMvuData({type:'message', message_id:getCurrentMessageId()});
    const message = await generate({user_input:'你好'});
    const new_data = await Mvu.parseMessage(message, old_data);
    await Mvu.replaceMvuData(new_data, {type:'message', message_id:getCurrentMessageId()});

════════════════════════════════════════
四、MVU事件
════════════════════════════════════════

Mvu.events.VARIABLE_INITIALIZED
  新开聊天时变量初始化完成
  listener: (variables, swipe_id) => void

Mvu.events.VARIABLE_UPDATE_STARTED
  变量更新开始
  listener: (variables) => void

Mvu.events.COMMAND_PARSED
  变量更新命令解析完成(可修复命令!)
  listener: (variables, commands, message_content) => void

  命令类型: set|insert|delete|add|move
  每个命令: {type, full_match, args:[], reason}

  示例:
    // 修复gemini在中文间加的'-'
    eventOn(Mvu.events.COMMAND_PARSED, (vars, commands) => {
      commands.forEach(cmd => { cmd.args[0] = cmd.args[0].replaceAll('-',''); });
    });

Mvu.events.VARIABLE_UPDATE_ENDED
  变量更新结束(可修改最终结果!)
  listener: (new_variables, old_variables) => void

  示例:
    // 限制好感度0~100
    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, vars => {
      _.update(vars, 'stat_data.角色.好感度', v => _.clamp(v, 0, 100));
    });

    // 限制变动幅度不超过3
    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (newV, oldV) => {
      const oldVal = _.get(oldV, 'stat_data.角色.好感度');
      _.update(newV, 'stat_data.角色.好感度', v => _.clamp(v, oldVal-3, oldVal+3));
    });

Mvu.events.BEFORE_MESSAGE_UPDATE
  即将用更新后的变量更新楼层
  listener: ({variables, message_content}) => void

════════════════════════════════════════
五、其他
════════════════════════════════════════

Mvu.isDuringExtraAnalysis() → boolean
  酒馆是否正在进行额外模型解析

---

## MVU自查

MVU变量系统自查标准

本文件供AI在完成MVU相关创作后自动审查使用。
涵盖：变量结构脚本、初始变量、变量列表、变量更新规则、变量输出格式、变量输出格式强调。

═══════════════════════════════════════
一、变量结构脚本自查
═══════════════════════════════════════

1. 头尾检查
变量结构脚本必须原封不动地包含：

开头：
import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

结尾：
$(() => {
  registerMvuSchema(Schema);
})

2. javascript语法检查
- javascript语法正确（括号、逗号、引号配对）
- 数组和对象的嵌套层级正确

3. zod 4使用检查
- 没有使用任何 .strict() 或 .passthrough()
- 没有滥用 .optional()
- 没有对根变量的字段使用 .optional() 或 .prefault()
- .prefault/catch(value | () => value) 使用正确
- 针对复杂 .object 有使用 .or(z.literal('待初始化')).prefault('待初始化') 等手段保证变量能有效更新
- 只对必要的键使用了 .describe() 解释用途
- 尽量地使用了 z.object() 而不是 z.array()

4. 代码导入检查
确保代码中仅导入了 registerMvuSchema，没有导入 zod 或 lodash 库。
zod 和 lodash 库已经默认可用，在代码中导入它们反而会导致问题。

5. 常见错误检查
- 数组、对象嵌套层级混乱
- 过分使用了 .optional() 或 .prefault()
- 错误使用了繁体字！需要把所有繁体字改为简体字！

═══════════════════════════════════════
二、初始变量自查
═══════════════════════════════════════

1. YAML格式检查
- YAML语法正确（括号、逗号、引号配对）
- 数组和对象的嵌套层级正确

2. 变量结构检查
- 变量初始值的类型符合变量结构要求

3. 常见错误检查
- 错误使用了繁体字！需要把所有繁体字改为简体字！

4. 条目配置
- 条目名：[initvar]变量初始化勿开
- 位置：D齿轮在深度
- 深度：4
- 顺序：200

═══════════════════════════════════════
三、变量列表自查
═══════════════════════════════════════

变量列表是固定格式，必须与以下完全一致：

```yaml
---
<status_current_variables>
{{format_message_variable::stat_data}}
</status_current_variables>
```

条目配置：
- 条目名：变量列表（不要添加[mvu_update]）
- 位置：D齿轮在深度
- 深度：0
- 顺序：200

═══════════════════════════════════════
四、变量更新规则自查
═══════════════════════════════════════

1. 精简性检查
- 是否对变量名已经解释清楚该如何更新的自明变量填写了大量更新规则
- 是否有变量还能够合并变量更新规则

2. 变量更新结构
检查每个变量mapping：
- z.record 变量是否正确区分了变量路径和 type 中的键名
- type 是否与变量结构脚本中的定义一致
- 是否有 check 字段

3. 特殊规则检查（如有）
如果有特殊系统（傲娇、敌意等），检查：
- 数值范围
- 变化步长
- 特殊条件
- 边界处理

4. 条目配置
- 条目名：[mvu_update]变量更新规则（一定不要忘记[mvu_update]）
- 位置：D齿轮在深度
- 深度：0
- 顺序：200

═══════════════════════════════════════
五、变量输出格式自查
═══════════════════════════════════════

变量输出格式是固定格式，必须与以下完全一致：

```yaml
---
变量输出格式:
  rule:
    - you must output the update analysis and the actual update commands at once in the end of the next reply
    - the update commands works like the **JSON Patch (RFC 6902)** standard, must be a valid JSON array containing operation objects, but supports the following operations instead:
      - replace: replace the value of existing paths
      - delta: update the value of existing number paths by a delta value
      - insert: insert new items into an object or array (using `-` as array index intends appending to the end)
      - remove
      - move
    - don't update field names starts with `_` as they are readonly, such as `_变量`
  format: |-
    <UpdateVariable>
    <Analysis>$(IN ENGLISH, no more than 80 words)
    - ${calculate time passed: ...}
    - ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes/no}
    - ${analyze every variable based on its corresponding `check`, according only to current reply instead of previous plots: ...}
    </Analysis>
    <JSONPatch>
    [
      { "op": "replace", "path": "${/path/to/variable}", "value": "${new_value}" },
      { "op": "delta", "path": "${/path/to/number/variable}", "value": "${positive_or_negative_delta}" },
      { "op": "insert", "path": "${/path/to/object/new_key}", "value": "${new_value}" },
      { "op": "insert", "path": "${/path/to/array/-}", "value": "${new_value}" },
      { "op": "remove", "path": "${/path/to/object/key}" },
      { "op": "remove", "path": "${/path/to/array/0}" },
      { "op": "move", "from": "${/path/to/variable}", "to": "${/path/to/another/path}" },
      ...
    ]
    </JSONPatch>
    </UpdateVariable>
```

条目配置：
- 条目名：[mvu_update]变量输出格式（一定不要忘记[mvu_update]）
- 位置：D齿轮在深度
- 深度：Gemini设置成0 / Claude设置成4
- 顺序：200

═══════════════════════════════════════
六、变量输出格式强调自查
═══════════════════════════════════════

变量输出格式强调是固定格式，必须与以下完全一致：

```yaml
---
变量输出格式强调:
  rule: The following must be inserted to the end of reply, and cannot be omitted
  format: |-
    <UpdateVariable>
    ...
    </UpdateVariable>
```

注意：这个条目只在最后测试角色卡时，发现AI经常不输出变量更新（即<UpdateVariable>块）时才需要。

条目配置：
- 条目名：[mvu_update]变量输出格式强调（一定不要忘记[mvu_update]）
- 位置：D齿轮在深度
- 深度：0
- 顺序：200

═══════════════════════════════════════
通用自查原则
═══════════════════════════════════════

1. 只检查结构和格式正确性，不检查内容丰富度
2. 如果正确就说正确，不要为了检查而找问题
3. 给出具体错误位置和修正方案
4. 发现错误时直接输出修正后的完整代码

---

## MVU前端状态栏自查

MVU前端状态栏自查标准

本文件供AI在完成MVU前端状态栏创作后自动审查使用。

═══════════════════════════════════════
检查清单
═══════════════════════════════════════

1. HTML结构完整性
- 有 <head> 和 <body>
- <head> 里有 <script type="module">
- <body> 里有HTML内容（结构可以任意）

2. CSS样式检查（必须严格检查）
- body 必须有 margin: 0; padding: 0;
- 重要：不能是 padding: 10px 或其他任何非0的值
- 如果需要边距，应该给容器元素加 margin，而不是给 body 加 padding
- 样式符合用户要求的UI风格
- 样式不会导致布局错乱或显示异常

3. 变量获取检查（重点！）
- 使用了 getAllVariables()
- 所有变量路径都以 'stat_data.' 开头（必须！）
- 使用了 _.get(all_variables, 'stat_data.xxx', '默认值')

对于数组类型变量（如背包、记忆列表）：
- 正确遍历并显示数组内容

对于嵌套对象（如用户信息.背包.材料）：
- 使用 _.get 访问嵌套路径

4. 初始化检查（核心逻辑，必须严格检查）
- 必须使用 await waitGlobalInitialized('Mvu')
- 必须使用 $(errorCatched(init))
- populateCharacterData() 在 init 里调用
- 必须有 eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, ...) 监听变量更新
- 监听回调中必须调用 populateCharacterData()

═══════════════════════════════════════
核心检查重点
═══════════════════════════════════════

最重要的检查点：

1. 所有变量路径必须以 'stat_data.' 开头
- 错误：_.get(all_variables, '角色.年龄', ...)
- 正确：_.get(all_variables, 'stat_data.角色.年龄', ...)

2. 防御性编程（重要，提高代码健壮性）
- 使用 _.get 访问嵌套路径

═══════════════════════════════════════
常见错误
═══════════════════════════════════════

1. body 的 padding 不是 0
   错误：body { padding: 10px; }
   正确：body { margin: 0; padding: 0; }
   如果需要边距：#container { margin: 10px; }

2. 缺少 stat_data 前缀
   错误：_.get(all_variables, '角色.年龄', 'N/A')
   正确：_.get(all_variables, 'stat_data.角色.年龄', 'N/A')

3. 缺少变量更新监听
   必须有 eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, ...) 并在回调中重新渲染

---

