# 合欢宗·惑心魅影 P2 牝奴期主控台与状态栏视觉交互规范 (v1.2)

本规范依据 `P2 牝奴期 UI/UX 设计需求-2026-05-25.md` 制定，旨在构建一套深度沉浸、具备高策略性的修仙游戏第二主玩法界面。通过“去工业化”的视觉语言，将现代网页架构伪装成一套由牝印支配、宗门议论流转的“命运主控台”。

核心目标在于：让玩家第一眼感到被牝印控制、被日课驱动、被特定 NPC 支配、被宗门持续凝视和低声议论，彻底完成从“攻略者”到“受控中心”的视觉与交互解构。

---

## 1. 设计哲学与全局视觉资产

系统整体气质必须极其克制，避免任何轻浮的现代游戏 HUD 或大面积纯粉色风格，利用材质、光效与水墨残痕传递“法器刻印”的痕迹与宗门秩序的凝视。

### 1.1 专属色相定义 (Palette)
* **深空底墨 (`#0F0A14`)**：页面全局背景色。带有微弱墨紫偏光的黑，代表合欢宗宗门夜色。
* **朱批血墨 (`#9C2C31`)**：名册审讯、规则篡改、高级烙名与强制状态专用的朱砂暗红。
* **受控朱红 (`#D44D54`)**：牝印命令、状态发热、强制指令专用的亮红微光。
* **秩序暗金 (`#A38353`)**：宗门日课、执事记录、名册暗纹等绝对秩序的铜金色。
* **灵识玉白 (`#E6E1DA`)**：主要文本、心里话和风声低语的常规白，去高光，呈宣纸微黄。

### 1.2 绝对视觉禁令
* 严禁使用现代互联网风格的直角容器、圆角胶囊组件、纯色硬边填充或发光边框。
* 严禁直接展示任何明文数值（如 `85/100` 或 `3/5`），所有进度、属性、好感与堕落全部通过**语义翻译钩子、光晕亮灭或图腾填充**隐晦表达。
* 严禁在 P2 界面使用“任务/成就/通知/领取奖励”等带有强烈现代工业游戏感的词汇。

---

## 2. 全局状态栏细化设计 (StatusBar.vue)

### 2.1 视觉形态 (Visual Spec)
窄屏顶部的状态栏不再堆砌复杂的进度条，而是由一个**“发光体核心” + “三个古典字牌”**流线组合。整体高度固定在 `44px`，无边框，两端向外水墨淡出。

+------------------------------------------------------------------------+
| (☼)  堕落·[神魂渐染]    牝阴·[三层]    [辰时] ▫ [验身]    ((( ¤ )))    |
+------------------------------------------------------------------------+


1. **牝印核心微缩盘 (左侧固定)**：一个极其精致的合欢花阵纹圆形图标，靠内部像素级的亮灭表达状态。
2. **气运阶段字牌 (居中)**：使用古董衬线体渲染。不显示数值，直接回写语义字样：`堕落·[神魂渐染]` 与 `牝阴·[三层]`。
3. **时辰日课表 (右侧偏左)**：显示当前宗门对玩家身体的占用时间：`[辰时] ▫ [验身]`。字色为极暗的秩序暗金。
4. **低语涟漪感应点 (最右侧)**：当 AI 回写的`听风羞名区`存在未点击的活跃风声时，最右侧常驻一个类似古铃形态的微光符文，自身向外辐射极其轻微的、淡紫色的 CSS 高斯模糊涟漪，暗示宗门正在对你低声议论。

### 2.2 状态机视觉响应 (State Controller)
根据 AI 下发的 Patch 变量，状态栏最左侧的“牝印核心微缩盘”将触发以下三种视觉状态切换：
* **【沉寂状态】**：常规无命令时，图标呈现黯淡的玉白灰度，执行周期的无规则微光呼吸（10s/周期）。
* **【发热状态】**（当存在常规命令短句时）：图标整体转为浅受控朱红，高斯模糊光晕从 2px 扩大到 8px，呼吸频率加快一倍，传达身体被牝印灼烧的异样感。
* **【强制状态】**（当命令强度升高或被柳素衣强制命令时）：图标变为刺眼的**朱批血墨色**（`#9C2C31`）。停止呼吸动画，转为**高频的间歇性闪烁（Glitch 脉冲动效）**。此时，右侧所有的字牌全部会覆上一层淡淡的血红色滤镜，产生强烈的逼迫感。

---

## 3. P2 首页核心五个主要区域设计

首页布局采用**纵向主控台**形式，单列瀑布流展开，严禁组件相互层叠堆卡。

### 3.1 牝印核心主控区 (Stigma Core Zone)
页面主视觉，将堕落度、牝阴决层数以及命令强度围绕同一个核心进行组织。

* **双重交织阵纹**：主视觉由一个直径 `160px` 的圆形 SVG 阵纹构成。外轨道（堕落轨）是由无数微小的合欢花瓣（秩序暗金）拼接而成的圆环，花瓣亮起的数量代表堕落度的深浅；内轨道（牝阴轨）由古文字符组成，逆时针慢速自转。
* **命令朱批横幅**：当存在当前命令时，阵纹正中心会产生一条横向贯穿、两端水墨淡出的暗红色丝带。命令短句以**亮金色、粗衬线体**直接烙印在丝带之上（例如：`“今日晨课，不准遮蔽牝印。”`）。
* **命令强度升高**：当 AI 推送的 `命令强度` 升级时，圆环中心的朱批横幅边缘会产生“墨汁渗开、开裂”的动画效果，阵纹中心的朱红光晕开始无规则脉冲放大，视觉上极具侵略性。

### 3.2 今日日课区：执事名册 (Daily Routine Zone)
告诉玩家当前时辰世界正在如何使用她。

* **卷轴名册解构**：组件不设任何边框容器，背景直接采用一张极其轻薄、纵向两端墨迹消散的古旧名册宣纸纹理。
* **层级对比排版**：
    * **当前时辰日课**：字体放大 1.2 倍，字色采用绝对醒目的**朱红血墨色**，前方挂载一个小小的执事朱砂印章（`[执事殿·核]`）。
    * **后续待执行日课**：字体缩小，字色为透明度 40% 的暗金色。名册下方隐隐能看到未到时辰的模糊字迹。
* **日课异动篡改**：如果当前日课被羞名或支配者强行更改（例如由“验身”变为“寝役”），前端通过 Patch 触发重绘：原本的日课文字上会直接出现一条**被毛笔粗暴划掉的朱红横线**（`text-decoration: line-through`），并在其侧边以更深的血墨色写下全新的日课名称。旁边盖上支配者（如白芷）的专属气运私章。

### 3.3 当前支配者区：牵丝凝视 (Dominator Zone)
表达“现在谁拥有玩家的处置权”，要让玩家感觉“被某人看着”。

* **无支配者状态**：该区域呈一片暗淡的灰色烟雾，中间竖排显示极淡的四个字：`【暂归宗门】`。
* **常规支配状态（白芷/苏芸/纪兰/沈月秋）**：
    * 不展示全画幅立绘，而是展示对应 NPC 的**双眸局部剪影**（带有高斯模糊）。
    * 卡片上方以**暗金色朱批**呈现其名牌（如 `【代掌训诫·纪兰】`）。
    * **牵丝线隐喻**：从卡片底部边缘，向下延伸出三条极细的、具有物理悬挂晃动感的**“傀儡金丝线”**（SVG 线条），垂直连接到主界面的“今日日课区”，代表当前日课正由该 NPC 死死操纵。
* **至高法旨：柳素衣注视**：
    * 当掌门强行介入或触发掌门寝役时，整个支配者组件的底色瞬间被**墨紫色（`#0F0A14`）与月光白金（`#e8e0d0`）**吞噬。
    * 金丝线全部异变为**血红色的因果牵丝**。右上角盖上巨大的、高频间歇性闪烁（Glitch 脉冲动效）的血色印章——`【掌门法旨·禁断】`。整个界面产生无处可逃的隐秘窒息感。

### 3.4 听风羞名区：宗门低语流 (Whisper Stream Zone)
P2 阶段的核心风声交互触发器。玩家在此不是在接任务，而是“因为自己的失态在宗门传开，导致神魂被舆论低语生生拽入下一场调教事件”。

* **弱化容器长轴**：组件彻底废除任何现代按钮。整体表现为一个**两端完全淡入淡出的“低语流动长轴”**。
* **流言级别挂载**：文字横向排列，字距拉开。每条风声根据其`羞名等级`挂载不同的视觉标记：
    * `[微闻]`：淡灰色文本，最前方是一个空心的古铃标记（`◎`）。
    * `[传开 / 挂牌]`：暗金色文本，文字周遭带有极淡的雾气扩散效果（`◉`）。
    * `[示众 / 烙名]`：**亮朱红色文本**，字形带有轻微的向右倾斜，前方挂载双重血色方印（`◆`）。
* **交互锁定 (Pending Action)**：
    1. 活跃的风声文字保持每 10 秒一次的轻微纵向漂移动效，模拟低语盘旋。
    2. 当玩家点击某条风声时，触发风铃破碎单音，该条风声文字瞬间**死死定格**并高亮为**秩序暗金**。
    3. 其余 2 条风声在 0.5s 内迅速化为黑色烟雾消散。风声下方渐显一行朱批大字：`【靈識已被低語牽引... 無法脫身】`。动作写入 `PendingAction`，允许再次点击解锁反悔。

### 3.5 烙名痕迹区：朱批与残光 (Brand Tags Zone)
展示玩家近期获得的羞名标签，让调教后果有不可抹去的永久记忆点。

+-------------------------------------------------------------+
| [ 烙名痕迹 ]                                                |
|  [印·铃声失序]  [批·验身迟疑]  [印·药香外泄]  [烙·寝役留名] |
+-------------------------------------------------------------+


* **去 Badge 标签化**：严禁采用网页胶囊标签。每个标签设计为一枚**“盖在皮肤或名册纸页上的暗色印记”**。
* **按强度与新旧层级排列**：
    * **普通标签**（如 `[目光回避]`）：采用淡灰色的字色，字距 `2px` 的衬线体，无背景框。
    * **朱批标签**（如 `[名册朱批]` `[铃声失序]`）：字色为朱砂红，字形如同毛笔写就，边缘隐隐带有墨迹晕染。
    * **【最高等级：烙名】**（如 `[寝役留名]`）：标签整体呈**烧灼后的暗金色裂纹效果**。标签周围常驻一圈极其微弱的、由于皮肤灼伤而外溢的浅红色残光（`box-shadow` 模糊流光），并在图层层级上置顶，绝不随页面滚动而淡化。

---

## 4. 核心组件 Vue 3 实现代码

### 4.1 牝印核心组件 (`StigmaCore.vue`)

```vue
<template>
  <div class="stigma-core-container" :data-status="stigmaStatus">
    <div class="stigma-matrix-wrapper">
      <svg class="stigma-svg-canvas" viewBox="0 0 200 200">
        <circle
          class="track-outer-corrupt"
          cx="100" cy="100" r="80"
          :style="{ 'stroke-dasharray': corruptDashArray }"
        />
        <g class="track-inner-gongfa">
          <circle class="track-inner-line" cx="100" cy="100" r="60" />
          <text class="gongfa-text-path">
            <textPath href="#innerPath">牝陰訣層數</textPath>
          </text>
        </g>
        <path id="innerPath" d="M 40,100 A 60,60 0 1,1 160,100" fill="none" />
      </svg>

      <div class="core-semantics">
        <span class="stage-text">{{ yinyinLayerText }}</span>
      </div>
    </div>

    <transition name="ink-ribbon-fade">
      <div v-if="currentCommand" class="command-vermilion-ribbon">
        <div class="ribbon-bg"></div>
        <div class="command-text-content">
          「 {{ currentCommand.text }} 」
          <span class="intensity-indicator" :style="{ opacity: currentCommand.intensity / 100 }">
            ⚡
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  corruptValue: Number, // 堕落度 (0-100)
  yinyinLayer: Number,   // 牝阴决层数
  currentCommand: Object // { text: string, intensity: number, status: '沉寂'|'发热'|'强制' }
});

// 计算属性：将堕落度映射为外轨花瓣的点亮长度
const corruptDashArray = computed(() => {
  const perimeter = 2 * Math.PI * 80;
  const activeLength = (props.corruptValue / 100) * perimeter;
  return `${activeLength} ${perimeter - activeLength}`;
});

// 计算属性：根据组件状态机映射样式状态
const stigmaStatus = computed(() => {
  if (!props.currentCommand) return '沉寂';
  return props.currentCommand.status; // '发热' 或 '强制'
});

const yinyinLayerText = computed(() => `牝陰訣: 第${props.yinyinLayer}層`);
</script>

<style lang="scss" scoped>
.stigma-core-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 20px auto;

  // 状态机：沉寂
  &[data-status="沉寂"] {
    .track-outer-corrupt { stroke: #A38353; opacity: 0.4; }
    .stigma-matrix-wrapper { animation: slow-rotation 20s linear infinite; }
  }

  // 状态机：发热
  &[data-status="发热"] {
    .track-outer-corrupt { stroke: #D44D54; filter: drop-shadow(0 0 4px #D44D54); }
    .stigma-matrix-wrapper { animation: slow-rotation 10s linear infinite; }
  }

  // 状态机：强制
  &[data-status="强制"] {
    .track-outer-corrupt { stroke: #9C2C31; }
    .stigma-matrix-wrapper {
      animation: glitch-pulse 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) infinite alternate;
    }
  }
}

@keyframes slow-rotation {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes glitch-pulse {
  0% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 2px #9C2C31); }
  100% { transform: scale(1.02); filter: brightness(1.3) drop-shadow(0 0 8px #D44D54); }
}
</style>
4.2 听风羞名组件 (WhisperPanel.vue)
代码段


<template>
  <div class="whisper-panel-container">
    <div class="whisper-header">
      <span class="header-icon">¤</span>
      <span class="header-title">聽風羞名</span>
    </div>

    <div v-if="rumors.length === 0" class="whisper-empty-state">
      <div class="ink-mist"></div>
      <p class="empty-serif-text">宗門闐然，唯風鈴空響……</p>
    </div>

    <div v-else class="whisper-stream" :class="{ 'has-locked': lockedId }">
      <div
        v-for="rumor in rumors"
        :key="rumor.id"
        class="whisper-item"
        :class="[
          `grade-${rumor.grade}`,
          { 'is-locked': lockedId === rumor.id, 'is-hidden': lockedId && lockedId !== rumor.id }
        ]"
        @click="handleWhisperClick(rumor)"
      >
        <div class="whisper-meta">
          <span class="meta-bullet">{{ getBullet(rumor.grade) }}</span>
          <span class="meta-source">{{ rumor.source }}</span>
          <span class="meta-splitter">·</span>
          <span class="meta-location">{{ rumor.location }}</span>
          <span class="meta-grade-badge">【{{ rumor.gradeText }}】</span>
        </div>

        <p class="whisper-text-content whisper-text-truncate">
          {{ rumor.text }}
        </p>

        <transition name="ink-drop">
          <div v-if="lockedId === rumor.id" class="lock-indicator-text">
            【靈識已被低語牽引... 無法脫身】
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  rumors: {
    type: Array,
    default: () => [] // 包含 id, source, location, grade ('微闻'|'挂牌'|'烙名'), text
  }
});

const emit = defineEmits(['update:pendingAction']);
const lockedId = ref(null);

const getBullet = (grade) => {
  if (grade === '烙名') return '◆';
  if (grade === '挂牌') return '◉';
  return '◎';
};

const handleWhisperClick = (rumor) => {
  if (lockedId.value === rumor.id) {
    lockedId.value = null;
    emit('update:pendingAction', null);
    return;
  }
  lockedId.value = rumor.id;

  emit('update:pendingAction', {
    target_zone: "LISTEN_RUMOR",
    rumor_id: rumor.id,
    lock_type: "TRAILING",
    context_snapshot: {
      rumor_text: rumor.text,
      grade: rumor.grade
    }
  });
};
</script>

<style lang="scss" scoped>
$color-brand-vermilion: #9C2C31;
$color-stigma-glow: #D44D54;
$color-order-gold: #A38353;
$color-whisper-white: #E6E1DA;

.whisper-panel-container {
  width: 100%;
  margin-top: 16px;
  font-family: 'Noto Serif SC', serif;
}

.whisper-header {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: $color-order-gold;
  letter-spacing: 2px;
  margin-bottom: 12px;
  padding-left: 4px;
  .header-icon { margin-right: 6px; opacity: 0.8; }
}

.whisper-empty-state {
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px dashed rgba($color-order-gold, 0.15);
  .empty-serif-text {
    font-size: 12px;
    color: rgba($color-whisper-white, 0.35);
    letter-spacing: 3px;
  }
}

.whisper-stream {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.whisper-item {
  cursor: pointer;
  padding: 10px 12px;
  background: transparent;
  border-bottom: 1px solid rgba($color-whisper-white, 0.04);
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-height: 48px; // 窄屏移动端大触控热区

  .whisper-meta {
    font-size: 11px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .whisper-text-content {
    font-size: 13px;
    line-height: 1.6;
    letter-spacing: 1px;
  }

  &.grade-微闻 {
    .whisper-meta { color: rgba($color-whisper-white, 0.4); }
    .whisper-text-content { color: rgba($color-whisper-white, 0.7); }
  }
  &.grade-挂牌 {
    .whisper-meta { color: $color-order-gold; }
    .whisper-text-content { color: $color-whisper-white; }
  }
  &.grade-烙名 {
    .whisper-meta { color: $color-stigma-glow; }
    .whisper-text-content { color: #ffffff; font-weight: 500; }
    border-bottom: 1px dashed rgba($color-brand-vermilion, 0.3);
  }
}

.whisper-item.is-locked {
  background: linear-gradient(90deg, rgba($color-brand-vermilion, 0.08) 0%, transparent 100%);
  border-bottom: 1px solid rgba($color-order-gold, 0.3);
  transform: scale(1.01);
  .whisper-text-content { color: $color-order-gold !important; }
  .lock-indicator-text {
    font-size: 11px;
    color: $color-brand-vermilion;
    margin-top: 8px;
    letter-spacing: 1px;
    font-weight: bold;
  }
}

.whisper-item.is-hidden {
  opacity: 0;
  filter: blur(4px);
  transform: translateY(4px);
  pointer-events: none;
}

// 窄屏两行硬截断，末尾水墨淡出
.whisper-text-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: clip;
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%),
              linear-gradient(to right, black 85%, transparent 100%);
  mask-composite: intersect;
}

.ink-drop-enter-active {
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.1, 0.8, 0.2, 1);
}
.ink-drop-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
  filter: blur(2px);
}
</style>
5. 前端通用样式与窄屏适配规范 (Scss)
由于酒馆属于窄屏卷轴式容器，布局必须在有限的宽度内打满信息密度，且按钮点击区域要足够大，避免依赖复杂 Hover。

SCSS


// _p2_master_style.scss

// 全局容器定义
.p2-console-viewport {
  width: 100%;
  max-width: 420px; // 限制主流窄屏容器宽度
  margin: 0 auto;
  background-color: #0F0A14;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

// 身体改造/拘束法器 下半部分折叠收纳容器
.p2-foldable-section {
  width: 100%;
  border-top: 1px solid rgba(#A38353, 0.15);
  margin-top: 20px;
  padding-top: 10px;
  opacity: 0.5; // 弱化非核心展示区
  transition: opacity 0.4s ease;

  &:focus-within, &:hover {
    opacity: 1;
  }
}

// 烙名标签最高等级特化样式
.brand-tag-ultimate {
  font-family: 'Noto Serif SC', serif;
  color: #A38353;
  font-weight: bold;
  position: relative;
  background: transparent;
  padding: 4px 8px;
  text-shadow: 0 0 2px rgba(156, 44, 49, 0.5);

  // 标签周遭的灼伤残光
  box-shadow: 0 0 6px rgba(#D44D54, 0.25);
  border: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(#9C2C31, 0.15) 0%, transparent 80%);
    pointer-events: none;
  }
}
6. P2 数据交互载荷与数据流标准
6.1 前端提交载荷标准 (Payload)
当玩家在首页锁定某条“听风羞名”并输入文本点击发送时，生成的 PendingAction 载荷必须准确捕获现场快照，打包送入下一回合：

JSON


{
  "current_turn": 42,
  "stage": "P2_MINU",
  "player_action": "SUBMIT_TEXT",
  "player_raw_text": "执事殿复查便复查，我问心无愧……",
  "pending_interaction": {
    "target_zone": "LISTEN_RUMOR",
    "rumor_id": "rumor_089_listen_gallery",
    "lock_type": "TRAILING",
    "context_snapshot": {
      "active_dominator": "纪兰",
      "current_stigma_command": "今日晨课，不准遮蔽牝印",
      "current_routine": "晨时·验身"
    }
  }
}
6.2 后端/AI 响应回写补丁标准 (AI Response Patch)
AI 处理完锁定行为后，下发的因果补丁直接对主控台进行增量更新（Patch 重绘）：

JSON


{
  "world_patch": {
    "scene_context": {
      "time_slot": "巳时",
      "routine": {
        "name": "听风廊示众",
        "modified_by": "纪兰",
        "modification_reason": "验身记录存在敷衍，牝印反应未达深层"
      }
    },
    "dominator": {
      "name": "纪兰",
      "status": "训诫惩戒中",
      "gaze_intensity": "HIGH"
    },
    "stigma_command": {
      "text": "跪行至听风廊，沿途不准平息牝印铃声",
      "intensity": 85,
      "status": "强制"
    },
    "new_brands": [
      { "id": "brand_012", "text": "验身迟疑", "type": "VERMILION" },
      { "id": "brand_055", "text": "示众未毕", "type": "ULTIMATE" }
    ]
  }
}
7. 验收红线 (Acceptance Criteria)
若开发交付物出现以下任一情况，即视为未达到 P2 阶段的沉浸式设计标准，触发拒收：

[ ] 现代 UI 污染：界面中出现任何现代直角胶囊容器、现代工业风进度条，或直接展示明文数值。

[ ] 文本布局溢出：在窄屏/移动端模式下，风声短句或日课名册发生横向切边、溢出滚动条。必须强制执行两行 mask-image 水墨淡出截断。

[ ] 支配感缺失：不在场的 NPC 依然在主控台留有灰显占位卡片；当前支配者区域沦为普通的头像展示，缺乏傀儡线或掌门因果牵丝的动态隐喻。

[ ] 交互越权与弹窗：点击听风羞名风声后，前端直接在本地弹窗生成剧情结果或跳转，而不是将状态变更为锁定、写入 待处理交互 并等待下一回合 AI 回写。

---
这份文档已全量闭环，没有拆分任何子模块，你可以随时将其交付技术团队执行重构。
