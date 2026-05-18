# EJS模板语法

> SillyTavern EJS 模板引擎语法、变量操作、装饰器、多阶段人设、函数速查、动态内容控制器

## EJS基础语法

EJS基础语法（SillyTavern + ST-Prompt-Template扩展）

运行环境：世界书条目、预设提示词、角色卡定义、消息中均可执行EJS代码。
核心用途：根据变量值动态控制哪些提示词发送给AI，实现多阶段人设、条件分支、状态栏渲染等。

═══════════════════════════════════════
一、标签语法
═══════════════════════════════════════

<%_ 代码 _%>    执行代码，不输出，自动去空白（推荐）
<%= 表达式 %>    输出值（HTML转义）
<%- 表达式 %>    输出值（原样，不转义）
<%# 注释 %>      注释，不执行

标签外的文本是普通提示词，会直接发送给AI。

═══════════════════════════════════════
二、条件控制（if/else）
═══════════════════════════════════════

<%_ if (getvar('stat_data.角色.好感度') < 30) { _%>
好感度低时AI看到的提示词
<%_ } else if (getvar('stat_data.角色.好感度') < 60) { _%>
中等好感度提示词
<%_ } else { _%>
高好感度提示词
<%_ } _%>

文本相等用 ===：
<%_ if (getvar('stat_data.天气') === '晴天') { _%>

多条件用 && 和 ||：
<%_ if (getvar('stat_data.好感度') > 50 && getvar('stat_data.信任') > 30) { _%>

═══════════════════════════════════════
三、易错点
═══════════════════════════════════════

1. getwi必须加await：
   ✅ <%- await getwi('条目名') %>
   ❌ <%- getwi('条目名') %>

2. MVU变量路径必须带stat_data前缀：
   ✅ getvar('stat_data.角色.好感度')
   ❌ getvar('角色.好感度')

3. 不需要[0]索引：
   ✅ getvar('stat_data.角色.好感度')
   ❌ getvar('stat_data.角色.好感度[0]')

4. 多条目共享变量名用typeof防重复声明：
   ✅ if (typeof v === 'undefined') var v = getvar('路径');
   ❌ const v = getvar('路径');  // 第二个条目会报错

5. activewi必须在[GENERATE:BEFORE]或@@generate_before中使用

6. @INJECT条目必须设为禁用状态

7. 装饰器之间不能有空行

8. define函数内必须用this访问getvar/setvar等：
   ✅ define('fn', function() { return this.getvar('key'); })
   ❌ define('fn', () => getvar('key'))

9. @@preprocessing不能和@@generate_before/@@generate_after同时使用

10. setvar后立即读取需要 { noCache: true }

---

## EJS变量与输出

EJS变量读写与输出

═══════════════════════════════════════
一、变量读写
═══════════════════════════════════════

【读取变量】
getvar('路径')                              → 值
getvar('路径', { defaults: 0 })             → 不存在时返回0
getvar('stat_data.角色.好感度')             → MVU变量（stat_data前缀必写）
getvar('stat_data.角色.好感度') !== undefined → 判断是否存在

【设置变量】
setvar('key', value, { scope: 'local' })     → 写入聊天变量
setvar('key', value, { scope: 'message' })   → 写入消息变量（默认）
setvar('key', value, { flags: 'nx' })        → 仅不存在时写入
setvar('key', value, 'global')               → scope快捷写法
setvar('key', value, 'nx')                   → flags快捷写法

【增减变量】
incvar('好感度', 5, { scope: 'local', min: 0, max: 100 })  → +5，限制范围
decvar('金币', 100, { scope: 'local', min: 0 })             → -100，不低于0

【删除/插入】
delvar('key')                    → 删除变量
delvar('key', '属性名')          → 删除对象属性
insvar('数组', '新元素')         → 追加到数组末尾

【作用域】
global   全局变量，持久化，跨角色跨对话共享
local    聊天变量，持久化，当前聊天记录
message  消息变量，持久化，绑定到具体消息楼层（默认）
cache    临时变量，不持久化（默认读取源）
initial  初始变量，只读

优先级（高→低）：消息变量(最新→最旧) → 聊天变量 → 全局变量
合并后的变量在 variables 对象中可直接访问。

═══════════════════════════════════════
二、输出与世界书条目加载
═══════════════════════════════════════

【print输出】
<%_
if (getvar('stat_data.天气') === '晴天') {
  print('【阳光明媚，适合出门】');
}
_%>

【getwi加载其他条目】必须加await
<%_
if (getvar('stat_data.好感度') < 30) {
  print(await getwi('角色_阶段01'));
} else {
  print(await getwi('角色_阶段02'));
}
_%>

等价写法：<%- await getwi('条目名') %>

getwi参数：
await getwi('条目名')                → 自动推断世界书
await getwi('世界书名', '条目名')     → 指定世界书
await getwi('条目名', { key: value }) → 传递数据

【activewi激活条目】让酒馆原生处理（遵循绿灯/向量化等）
await activewi('条目名')         → 普通激活
await activewi('条目名', true)   → 强制激活
※ 必须在 [GENERATE:BEFORE] 或 @@generate_before 条目中使用

【填入变量值】
<%= getvar('stat_data.好感度') %>
<%= YAML.stringify(getvar('stat_data'), { blockQuote: 'literal' }) %>
<%= JSON.stringify(getvar('stat_data')) %>

═══════════════════════════════════════
三、聊天消息操作
═══════════════════════════════════════

getChatMessage(idx)                  → 指定楼层消息内容
getChatMessages(count)               → 最后N条消息
getChatMessages(start, end)          → 范围内消息
matchChatMessages(['关键词'])         → 最后2楼是否包含关键词
matchChatMessages(['关键词'], { start: -4 })  → 扩大扫描范围
matchChatMessages([/正则/s])         → 正则匹配

---

## EJS装饰器与注入

EJS装饰器与注入

═══════════════════════════════════════
一、装饰器（条目内容开头，每行一个，不能有空行）
═══════════════════════════════════════

@@activate              视为蓝灯永久激活
@@dont_activate         完全禁止激活
@@generate_before       注入到提示词开头
@@generate_after        注入到提示词末尾
@@render_before         渲染到消息开头（不发给AI）
@@render_after          渲染到消息末尾（不发给AI）
@@preprocessing         在世界书处理前执行（用于动态激活绿灯）
@@initial_variables     将内容视为初始变量
@@private               自动包裹作用域，避免变量重复声明
@@if 条件               条件为false时排除此条目
@@iframe                创建iframe包裹，避免样式污染
@@iframe 标题文字       自动折叠的iframe

@@if 示例：
@@if variables.好感度 >= 90
好感度很高时才发送的内容

═══════════════════════════════════════
二、内容注入（条目标题/备忘前缀）
═══════════════════════════════════════

[GENERATE:BEFORE]     提示词开头（仅蓝灯）
[GENERATE:AFTER]      提示词末尾（蓝灯和绿灯）
[RENDER:BEFORE]       消息开头渲染（不发给AI）
[RENDER:AFTER]        消息末尾渲染（不发给AI）
[InitialVariables]    初始变量（标准JSON）

═══════════════════════════════════════
三、@INJECT注入（条目必须设为禁用）
═══════════════════════════════════════

以独立 {role, content} 消息插入Prompt（比世界书合并更精确）。

@INJECT pos=1,role=system              绝对位置
@INJECT pos=-1,role=user               最后位置
@INJECT target=user,index=1,at=before,role=system    目标消息前
@INJECT target=assistant,index=-1,at=after,role=user  最后助手消息后
@INJECT regex=你好,at=before,role=system              正则匹配

═══════════════════════════════════════
四、injectPrompt（依赖倒置注入）
═══════════════════════════════════════

世界书中定义：
<% injectPrompt("CoT", `思考步骤内容`) %>

预设中使用：
<%- getPromptsInjected("CoT") %>

用途：世界书定义提示词片段，在预设指定位置精确注入。

═══════════════════════════════════════
五、正则激活
═══════════════════════════════════════

activateRegex(/<think>[\s\S]*?<\/think>/gi, "");   → 隐藏思维链
activateRegex(/pattern/gi, '替换', { message: true, html: true });  → 楼层HTML替换

---

## EJS多阶段人设

EJS多阶段人设系统

═══════════════════════════════════════
一、多阶段人设（控制器+分阶段条目）
═══════════════════════════════════════

结构：
  控制器条目（蓝灯永久激活）→ 读变量 → getwi加载对应阶段条目
  阶段条目（禁用）→ 被控制器按需加载

控制器写法：
<%_
if (typeof goodwill === 'undefined') var goodwill = getvar('stat_data.好感度', { defaults: 0 });
_%>
<%_ if (goodwill < 30) { _%>
<%- await getwi('角色_阶段01') %>
<%_ } else if (goodwill < 60) { _%>
<%- await getwi('角色_阶段02') %>
<%_ } else { _%>
<%- await getwi('角色_阶段03') %>
<%_ } _%>

条目配置：
  控制器   → 蓝灯永久激活，顺序100
  阶段条目 → 禁用，顺序98~800

防重复声明（多条目共享变量名时必用）：
if (typeof value === 'undefined') var value = getvar('路径', { defaults: 0 });

或使用 @@private 装饰器自动包裹作用域。

═══════════════════════════════════════
二、@@iframe状态栏示例
═══════════════════════════════════════

@@render_after
@@iframe
@@if !is_user && !is_system
<html>
<head></head>
<body>
<div>
好感度：<%- variables.stat_data.角色.好感度 %>
</div>
</body>
</html>

折叠版：
@@render_after
@@iframe 状态栏（点击展开）
@@if !is_user && !is_system
<html>...内容...</html>

═══════════════════════════════════════
三、@@preprocessing动态激活示例
═══════════════════════════════════════

@@preprocessing
<%_ if (getvar('stat_data.天气') === '晴天') { _%>
晴天关键词
<%_ } _%>

条目内容处理后变为"晴天关键词"，激活以此为绿灯关键词的其他条目。
要求：SillyTavern 1.13.4+

---

## EJS函数速查

EJS函数速查与内置常量

═══════════════════════════════════════
一、常用内置常量
═══════════════════════════════════════

variables         合并后的所有变量对象
_                 Lodash库
$                 jQuery库
toastr            通知库（toastr.info/success/warning/error）
userName          用户名
charName          角色名
lastMessageId     最后消息ID
lastUserMessage   最后用户消息内容
lastCharMessage   最后角色消息内容
generateType      生成类型：normal/continue/regenerate/swipe
runType           当前阶段：generate/preparation/render

仅渲染时（runType='render'）：
message_id        消息楼层号
is_last           是否最后一条
is_user           是否用户消息
is_system         是否系统消息

═══════════════════════════════════════
二、调试方法
═══════════════════════════════════════

提示词查看器：输入框左下角魔棒 → 提示词查看器（查看实际发送内容）
弹窗：alert('消息')
通知：toastr.info('消息')
控制台：console.log('消息')（F12 → Console）
断点：<%_ debugger; _%>（F12打开后暂停执行）

═══════════════════════════════════════
三、完整函数速查
═══════════════════════════════════════

变量：getvar setvar incvar decvar delvar insvar define patchVariables
世界书：await getwi  await activewi  await getEnabledWorldInfoEntries
角色/预设：await getchar  await getpreset  await getqr  await getCharData
消息：getChatMessage  getChatMessages  matchChatMessages
输出：print  injectPrompt  getPromptsInjected  hasPromptsInjected
正则：activateRegex
工具：parseJSON  jsonPatch  await evalTemplate  await execute

---

## EJS调色盘多阶段自查

EJS调色盘多阶段人设自查标准

本文件供AI在完成EJS调色盘多阶段人设整合后自动审查使用。
注意：调色盘内容本身是用户手写的，不做内容审查，只检查EJS代码结构和配置。

═══════════════════════════════════════
一、前提检查
═══════════════════════════════════════

- MVU变量结构（schema.ts）是否已定义好感度/关系状态等阶段判定变量？
- 初始变量（initvar.yaml）中是否有对应的初始值？
- 变量更新规则中是否包含这些变量的更新逻辑？

═══════════════════════════════════════
二、EJS语法检查
═══════════════════════════════════════

1. 变量读取是否用typeof防重复声明？
   ✅ if (typeof gw === 'undefined') var gw = getvar('stat_data.角色.好感度', { defaults: 0 });
   ❌ const gw = getvar('stat_data.角色.好感度');

2. 变量声明是否用var？
   ✅ var gw = getvar(...)
   ❌ let gw = getvar(...)
   ❌ const gw = getvar(...)

3. MVU变量路径是否带stat_data前缀？
   ✅ getvar('stat_data.角色.好感度')
   ❌ getvar('角色.好感度')

4. EJS标签是否使用 <%_ _%> 格式（自动去空白）？
   ✅ <%_ if (gw < 250) { _%>
   ❌ <% if (gw < 250) { %>

5. 是否没有遗漏闭合大括号 } ？
   每个 { 必须有对应的 }

═══════════════════════════════════════
三、调色盘结构完整性检查
═══════════════════════════════════════

- 是否有调色盘头部声明（底色/主色调/点缀）？
- 头部是否随阶段变化（被if/else包裹）？
- 每个阶段是否至少有2-3个专属衍生？
- 是否有跨阶段通用衍生（放在所有if/else外面）？
- 是否有"对角色的理解与思考:"部分（二次解释）？
- 是否有总结？

═══════════════════════════════════════
四、阶段衔接检查
═══════════════════════════════════════

- 阶段判定条件的边界值是否无重叠无遗漏？
  ✅ gw < 250 / gw >= 250 && gw < 500 / gw >= 500
  ❌ gw < 250 / gw > 200 && gw < 500（250和200之间重叠）
  ❌ gw < 250 / gw >= 300（250~299遗漏）

- 组合条件是否逻辑正确？
  ✅ gw >= 500 && rel !== '恋人'（好感高但非恋人）
  ❌ gw >= 500 || rel !== '恋人'（逻辑太宽）

- 是否存在某个变量值组合没有被任何分支覆盖的情况？

═══════════════════════════════════════
五、二次解释匹配检查
═══════════════════════════════════════

- 每个阶段专属衍生是否有对应的阶段专属二次解释？
- 跨阶段通用衍生是否有对应的通用二次解释？
- 二次解释的if条件是否和对应衍生的if条件一致？
- 二次解释是否放在衍生之后（先读衍生再读解释）？

═══════════════════════════════════════
六、条目配置检查
═══════════════════════════════════════

- 是否设为蓝灯常驻？（strategy: constant）
- 位置是否为角色定义后？（position: after_character_definition）
- 顺序是否为99？
- 是否勾选不可递归 + 防止进一步递归？
- 是否是一个条目（不是拆分成多个禁用条目+控制器的模式）？

---

## EJS调色盘多阶段人设

EJS调色盘多阶段人设写法

前提：必须先完成MVU变量结构设计（schema.ts + initvar.yaml），确保有好感度、关系状态等可用于阶段判定的变量。

═══════════════════════════════════════
一、核心思路
═══════════════════════════════════════

将调色盘、衍生、二次解释写在同一个EJS条目中，用if/else根据MVU变量切换不同阶段的内容。

不是"每个阶段一个条目+控制器getwi加载"的模式，而是"一个条目内用EJS分支控制显示哪些内容"。

优势：
- 所有阶段内容集中管理，便于维护
- 不需要额外的禁用条目
- 调色盘底色/主色调可以随阶段变化
- 二次解释和衍生在同一条目中紧密联动

═══════════════════════════════════════
二、结构模板
═══════════════════════════════════════

<%_
if (typeof gw === 'undefined') var gw = getvar('stat_data.角色.好感度', { defaults: 0 });
if (typeof rel === 'undefined') var rel = getvar('stat_data.角色.关系状态', { defaults: '陌生人' });
_%>

性格调色盘：人的性格就像调色盘，由多种性格衍生组合而成才是活生生的人

<%_ if (rel !== '恋人') { _%>
<%_ if (gw < 500) { _%>
底色：[阶段1底色]
主色调：[阶段1主色调]
性格点缀：[阶段1点缀]
<%_ } else { _%>
底色：[阶段2底色]
主色调：[阶段2主色调]
性格点缀：[阶段2点缀]
<%_ } _%>
<%_ } else { _%>
底色：[恋人阶段底色]
主色调：[恋人阶段主色调]
性格点缀：[恋人阶段点缀]
<%_ } _%>

<%_ if (gw < 250) { _%>
[阶段1专属衍生]
<%_ } _%>

<%_ if (gw >= 250 && gw < 500) { _%>
[阶段2专属衍生]
<%_ } _%>

<%_ if (gw >= 500 && rel !== '恋人') { _%>
[阶段3专属衍生]
<%_ } _%>

<%_ if (rel === '恋人') { _%>
[恋人阶段专属衍生]
<%_ } _%>

[跨阶段通用衍生——不用if包裹，始终显示]

对角色的理解与思考:

<%_ if (gw < 250) { _%>
[阶段1专属二次解释]
<%_ } _%>

<%_ if (gw >= 250 && gw < 500) { _%>
[阶段2专属二次解释]
<%_ } _%>

<%_ if (gw >= 500 && rel !== '恋人') { _%>
[阶段3专属二次解释]
<%_ } _%>

<%_ if (rel === '恋人') { _%>
[恋人阶段专属二次解释]
<%_ } _%>

[跨阶段通用二次解释——不用if包裹，始终显示]

  总结: |
    这就是[角色名]的性格调色盘...

═══════════════════════════════════════
三、阶段划分方式
═══════════════════════════════════════

纯好感度阶段：
  gw < 250 → 初识期
  gw >= 250 && gw < 500 → 熟悉期
  gw >= 500 && gw < 750 → 暧昧期
  gw >= 750 → 深入期

好感度+关系状态组合：
  rel !== '恋人' 时按好感度分段
  rel === '恋人' 时使用恋人专属内容

多变量组合：
  可同时判断好感度、信任度、关系状态等
  用 && 和 || 组合条件

═══════════════════════════════════════
四、实例结构解析（秋啾啾）
═══════════════════════════════════════

秋啾啾的调色盘人设使用好感度+关系状态双变量控制：

变量读取：
  gw = getvar('stat_data.秋啾啾.好感度')
  rel = getvar('stat_data.秋啾啾.关系状态')

调色盘头部随阶段变化：
  非恋人 + gw<500 → 底色：好奇，主色调：莽、心软
  非恋人 + gw>=500 → 底色：喜欢，主色调：莽与害羞的拉扯
  恋人 → 底色：爱，主色调：撒娇与莽的融合

阶段专属衍生：
  gw<250：好奇衍生（EMOJI收集欲、观察者、越界）
  gw 250~500：在意衍生（记名字、EMOJI变晴雨表）
  gw 500~750 非恋人：喜欢衍生（命名、小心翼翼、吃醋）+ 害羞衍生
  gw>=750 非恋人：藏不住衍生 + 心疼衍生
  恋人：恋人衍生（安心、撒娇、莽回归、占有欲、害怕）

跨阶段通用衍生（不包在if里）：
  莽衍生、心软衍生、不怕衍生——始终存在

二次解释也按相同阶段分支：
  gw<250：关于好奇的本质、关于距离感
  gw 250~500：关于好奇到在意的过渡
  gw 500~750 非恋人：关于喜欢的自觉、吃醋、害羞
  gw>=750 非恋人：关于藏不住、心疼的深度
  恋人：关于确认关系后的变化、撒娇、占有欲、害怕

跨阶段通用二次解释（不包在if里）：
  关于可爱、关于莽和心软的关系、关于语气词、关于霸凌、关于笑

═══════════════════════════════════════
五、配置
═══════════════════════════════════════

条目配置：
  蓝灯常驻（strategy: constant）
  角色定义后（position: after_character_definition, order: 99）
  递归：不可递归 + 防止进一步递归

═══════════════════════════════════════
六、易错点
═══════════════════════════════════════

1. 变量路径必须带stat_data前缀
2. 必须用typeof防重复声明
3. 必须用var而非const/let
4. 通用衍生/通用二次解释放在所有if/else外面
5. 每个阶段的二次解释要和对应衍生匹配
6. 阶段判定条件的边界值不能重叠也不能遗漏
7. 关系状态判定用 === 或 !== 而非 < >

---

## EJS动态内容控制器

动态内容控制器示例（@@preprocessing + getwi）

用途：根据MVU变量值（地点、角色、事件等）动态加载对应世界书条目，避免所有条目同时激活浪费token。

结构：
@@preprocessing
<%
// 读取变量
if (typeof currentDomain === 'undefined') var currentDomain = getvar('stat_data.世界定位.当前大域', { defaults: '中央神州' });
if (typeof currentArea === 'undefined') var currentArea = getvar('stat_data.世界定位.当前区域', { defaults: '' });
if (typeof currentScene === 'undefined') var currentScene = getvar('stat_data.世界定位.当前场景', { defaults: '' });
if (typeof presentCharacters === 'undefined') var presentCharacters = getvar('stat_data.在场人物', { defaults: {} });
if (typeof messageText === 'undefined') {
  const userMessages = getChatMessages(-1, -1, 'user');
  var messageText = userMessages.length > 0 ? userMessages[userMessages.length - 1].message : '';
}
%>

// 跳过第0楼（开局消息）
<% if (!isFloorZero) { %>

// 根据大域加载地图
<% if (currentDomain.includes('中央神州')) { %>
<%- await getwi('地图_中央神州') %>
<% } else if (currentDomain.includes('东荒妖域')) { %>
<%- await getwi('地图_东荒妖域') %>
<% } %>

// 根据场景加载具体地点
<% if (currentArea.includes('万剑山脉') || currentScene.includes('剑宗')) { %>
<%- await getwi('剑宗') %>
<% } %>

// 根据事件加载指南
<% if (currentEvent === '炼丹' || messageText.includes('炼丹')) { %>
<%- await getwi('动态事件_炼丹指南') %>
<% } %>

// 根据在场角色加载人设（别名映射）
<%
if (typeof detectedCharacters === 'undefined') {
  const aliasMap = { '冬雪': '殷冬雪', '疏影': '卫疏影' /* ... */ };
  var detectedCharacters = new Set();
  if (presentCharacters && typeof presentCharacters === 'object') {
    for (const name of Object.keys(presentCharacters)) {
      detectedCharacters.add(aliasMap[name] || name);
    }
  }
  for (const alias of Object.keys(aliasMap)) {
    if (messageText.includes(alias)) detectedCharacters.add(aliasMap[alias]);
  }
  detectedCharacters = Array.from(detectedCharacters);
}
%>
<% for (const charName of detectedCharacters) { %>
<%- await getwi(charName.trim()) %>
<% } %>

<% } %>

配置：蓝灯顺序100，不勾防递归
要点：
1. 必须@@preprocessing开头
2. 用getvar读MVU变量，用getChatMessages读用户消息文本
3. 用.includes()做模糊匹配
4. 角色别名用Map映射到标准名
5. 加载的条目可以是禁用或绿灯

---

