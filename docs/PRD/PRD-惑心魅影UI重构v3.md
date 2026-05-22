# PRD: 合欢宗 · 惑心魅影 UI v3.0 — 五气朝元阵 · NPC命魂盘 · 须弥法囊深度重构

> 产品级别：S 级（核心视觉重构 v3.0）
> 评估日期：2026-05-22
> 状态：待执行
> 前置版本：PRD-惑心魅影UI重构.md v2.0（四页面深度改造已完成）
> 技术栈：Vue 3 + Pinia + SCSS + Webpack 5 + Zod 4

---

## 一、项目概述

### 1.1 背景

甲方基于 v2.0 改造成果，提出新一轮深度视觉重构需求：
- 宗门顶栏升级为“五气朝元阵”（无边框羽化流动 + 阵眼自转 + 墨迹扩散）
- NPC 命魂盘（太极）升级为“石质底 + 中心灵气渲染 + 因果联动”
- 须弥法囊（背包）升级为“数字上浮 + 归零湮灭”动态消耗系统
- 全局执行“去工业化铁律”：禁止 border / 禁止纯色方块 / 统一 cubic-bezier

### 1.2 约束（不变）

- **HTML 结构零改动**：不增删 DOM 节点
- **逻辑代码零改动**：schema.ts / guards.ts / store.ts / validate.ts 不触碰
- **Props/Emit 零改动**：不修改组件接口
- **文件写入规范**：SCSS 用 Python 脚本，Vue/TS 用 apply_patch

### 1.3 P3 降级说明

甲方确认以下原 P3 项可通过 CSS 动画 + 极简 JS 钩子实现，降级为 P0/P1：

| 原 P3 项 | 降级后 | 技术方案 | PRD 合规性 |
| :--- | :---: | :--- | :---: |
| 悬停色相偏移 | P0 | CSS `:has()` 选择器，零 JS | ✅ |
| 数字上浮动效 | P1 | CSS `@keyframes` + Vue watch（3行钩子） | ✅ |
| 归零湮灭动效 | P1 | 移除 filter + CSS `animation: dissolve` | ✅ |

---

## 二、改造范围与文件清单

### 2.1 受影响文件

| 文件 | 改造类型 | 改造内容 |
| :--- | :--- | :--- |
| SystemBar.vue | CSS + Template | 去框化 + 两端淡出 + bar-stats 横向 + 阵眼 20s 自转 + 墨迹扩散 |
| NpcCard.vue | CSS + Template(1行) | 去 gold-foil + radial-gradient 中心灵气 + scale 呼吸 + data-npc 属性 |
| NpcDetail.vue | CSS | 去 gold-foil + 去 border |
| PageNav.vue | CSS | 去 border-top 改渐变线 + 去 border + 气运流线布局 |
| BackpackPage.vue | CSS + Script(4行) | 数字上浮动效 + 归零湮灭动效 |
| ShopPage.vue | CSS | 去剩余 gold-foil |
| _global.scss | CSS | 统一 cubic-bezier + 新增 keyframes + :has() 因果联动 |
| _mixins.scss | CSS | gold-foil / gold-seal-btn 废弃标记 |

### 2.2 不受影响文件

| 文件 | 原因 |
| :--- | :--- |
| schema.ts | 约束：逻辑代码零改动 |
| guards.ts | 约束：逻辑代码零改动 |
| store.ts | 约束：逻辑代码零改动 |
| validate.ts | 约束：逻辑代码零改动 |
| App.vue | 仅使用 :has() CSS 选择器，不改 template |
| HomePage.vue | 无改造需求 |
| Phase2Page.vue | v2.0 已完成深度改造 |
| GalleryPage.vue | v2.0 已完成深度改造 |

---

## 三、详细改造规格

### 3.1 宗门顶栏 · 五气朝元阵（SystemBar.vue）

#### 3.1.1 去框化 + 两端淡出

**当前问题**：`.system-bar` 使用 `@include gold-foil`（L155），含 border + box-shadow。

**改造方案**：
```scss
.system-bar {
  border: none;
  box-shadow: none;
  background: transparent;
  position: relative;
  // 两端淡出效果
  &::before {
    content: '''';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      var(--hh-bg-main) 0%,
      transparent 15%,
      transparent 85%,
      var(--hh-bg-main) 100%
    );
    pointer-events: none;
    z-index: 1;
  }
}
```

#### 3.1.2 bar-stats 横向排列

**当前问题**：`.bar-stats` 是 `flex-direction: column`（L264），纵向堆叠。

**改造方案**：
```scss
.bar-stats {
  flex-direction: row;  // column -> row
  gap: 12px;
  align-items: center;
}
```

#### 3.1.3 阵眼 20s 自转 + 墨迹扩散

**当前问题**：`.theme-toggle` 无旋转动画，点击无反馈。

**改造方案**：
```scss
.theme-toggle {
  border: none;  // 去 border
  animation: array-eye-rotate 20s linear infinite;

  &:active {
    animation: ink-spread 0.6s ease-out;
  }
}

@keyframes array-eye-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ink-spread {
  0% { box-shadow: 0 0 0 0 var(--hh-glow-color); }
  50% { box-shadow: 0 0 20px 8px var(--hh-glow-color); }
  100% { box-shadow: 0 0 0 0 transparent; }
}
```

#### 3.1.4 悬停色相偏移（因果联动）

**技术方案**：纯 CSS `:has()` 选择器，在 `_global.scss` 中添加：
```css
/* 因果联动：NPC 悬停时顶栏色相微偏 */
.scroll-frame:has(.npc-strip:hover) .system-bar .bar-stats {
  filter: hue-rotate(15deg);
  transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 按 NPC 专属色偏移 */
.scroll-frame:has(.npc-strip[data-npc="baiji"]:hover) .bar-stats {
  filter: hue-rotate(10deg) saturate(1.2);
}
.scroll-frame:has(.npc-strip[data-npc="suyun"]:hover) .bar-stats {
  filter: hue-rotate(-10deg) saturate(1.1);
}
```

**注意**：需要在 NpcCard template 的 `.npc-strip` 上添加 `data-npc` 属性（1行改动）。

---

### 3.2 NPC 命魂盘 · 专属色渲染（NpcCard.vue）

#### 3.2.1 去 gold-foil + 石质底

**当前问题**：`.npc-strip` 使用 `@include gold-foil`（L172）。

**改造方案**：
```scss
.npc-strip {
  border: none;
  box-shadow: none;
  // 石质底纹理
  background:
    linear-gradient(135deg, rgba(40,30,20,0.6) 0%, rgba(20,15,10,0.8) 100%);
  position: relative;
}
```

#### 3.2.2 攻略态 radial-gradient 中心灵气渲染

**当前问题**：已完成状态用 `box-shadow` + `border-color` 整体覆盖。

**改造方案**：
```scss
.npc-strip.completed {
  border: none;
  // 从中心向外晕染 NPC 专属色
  background:
    radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--npc-accent) 20%, transparent) 0%, transparent 60%),
    linear-gradient(135deg, rgba(40,30,20,0.6) 0%, rgba(20,15,10,0.8) 100%);
  animation: soul-breathe 4s ease-in-out infinite;
}

@keyframes soul-breathe {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 8px color-mix(in srgb, var(--npc-accent) 25%, transparent));
  }
  50% {
    transform: scale(1.02);
    filter: drop-shadow(0 0 16px color-mix(in srgb, var(--npc-accent) 45%, transparent));
  }
}
```

#### 3.2.3 seal-badge 去 border

**当前问题**：`.seal-text` 有 `border: 1.5px solid`（L537）。

**改造方案**：用 `text-shadow` + `background` 渐变替代边框：
```scss
.seal-text {
  border: none;
  background: color-mix(in srgb, var(--npc-accent) 15%, transparent);
  text-shadow:
    0 0 8px color-mix(in srgb, var(--npc-accent) 60%, transparent),
    0 0 16px color-mix(in srgb, var(--npc-accent) 30%, transparent);
}
```

#### 3.2.4 card-corner L 型装饰线

**当前问题**：已完成状态有 L 型角落装饰线。

**改造方案**：改为渐变线（非 border）：
```scss
.card-corner {
  &::before, &::after {
    background: linear-gradient(90deg, var(--npc-accent), transparent);
  }
}
```

---

### 3.3 须弥法囊 · 动态消耗（BackpackPage.vue）

#### 3.3.1 数字上浮动效

**改动范围**：Script 4行 + CSS 1个 keyframes

**Script 改动**（在 `<script setup>` 中添加）：
```ts
import { watch } from 'vue';
const countAnimating = ref(false);
watch(() => data.道具.拥有, () => {
  countAnimating.value = true;
  setTimeout(() => { countAnimating.value = false; }, 300);
}, { deep: true });
```

**Template 改动**（L20 附近）：
```html
<span :class="[''item-count'', { ''count-up'': countAnimating }]">x{{ count }}</span>
```

**CSS 改动**：
```scss
.item-count.count-up {
  animation: number-float-up 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes number-float-up {
  0% { transform: translateY(0); opacity: 1; }
  40% { transform: translateY(-8px); opacity: 0.6; }
  100% { transform: translateY(0); opacity: 1; }
}
```

#### 3.3.2 归零湮灭动效

**改动范围**：Script 1行移除 filter + Template 1行 class 绑定 + CSS keyframes

**Script 改动**（L88-89）：
```ts
// 旧：filter(([_, count]) => count > 0)
// 新：不过滤，让 count=0 的也进入渲染
const ownedItems = computed(() => {
  return Object.fromEntries(Object.entries(data.道具.拥有));
});
```

**Template 改动**（L16-17 附近）：
```html
<div
  v-for="(count, name) in ownedItems"
  :key="name"
  :class="[''item-row'', { selected: selectedItem === String(name), ''is-empty'': count === 0 }]"
  @click="count > 0 && selectItem(String(name))"
>
```

**CSS 改动**：
```scss
.item-row.is-empty {
  animation: dissolve 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  pointer-events: none;
  overflow: hidden;
}

@keyframes dissolve {
  0% { filter: blur(0); opacity: 1; transform: scale(1); max-height: 60px; }
  50% { filter: blur(4px); opacity: 0.5; transform: scale(0.9); }
  100% { filter: blur(8px); opacity: 0; transform: scale(0.8); max-height: 0; padding: 0; margin: 0; }
}
```

---

### 3.4 导航栏 · 气运流线（PageNav.vue）

#### 3.4.1 去 border + 流线布局

**当前问题**：`.page-nav` 有 `border-top: 1px solid`（L69），`.nav-tab` 有 `border: 1px solid transparent`（L79）。

**改造方案**：
```scss
.page-nav {
  border-top: none;
  // 用渐变替代分割线
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 30%);
  // 气运流线
  justify-content: center;
  gap: 8px;
}

.nav-tab {
  border: none;
  &.active {
    border-color: transparent;
    // 用 radial-gradient 替代
    background: radial-gradient(ellipse at 50% 80%, var(--hh-glow-color) 0%, transparent 70%);
  }
}
```

---

### 3.5 全局动效统一（_global.scss）

#### 3.5.1 cubic-bezier 统一

在 `_global.scss` 中添加全局动效变量：
```css
:root {
  --hh-ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### 3.5.2 新增全局 keyframes

```css
/* 五气朝元阵 · 阵眼自转 */
@keyframes array-eye-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 墨迹扩散 */
@keyframes ink-spread {
  0% { box-shadow: 0 0 0 0 var(--hh-glow-color); }
  50% { box-shadow: 0 0 20px 8px var(--hh-glow-color); }
  100% { box-shadow: 0 0 0 0 transparent; }
}

/* 命魂呼吸 */
@keyframes soul-breathe {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px var(--hh-glow-color)); }
  50% { transform: scale(1.02); filter: drop-shadow(0 0 16px var(--hh-glow-color)); }
}

/* 数字上浮 */
@keyframes number-float-up {
  0% { transform: translateY(0); opacity: 1; }
  40% { transform: translateY(-8px); opacity: 0.6; }
  100% { transform: translateY(0); opacity: 1; }
}

/* 归零湮灭 */
@keyframes dissolve {
  0% { filter: blur(0); opacity: 1; transform: scale(1); }
  100% { filter: blur(8px); opacity: 0; transform: scale(0.8); }
}

/* 因果联动（:has 选择器） */
.scroll-frame:has(.npc-strip:hover) .system-bar .bar-stats {
  filter: hue-rotate(15deg);
  transition: filter 0.5s var(--hh-ease);
}
```

---

## 四、改造执行计划

### Phase 1：SystemBar 五气朝元阵（P0）
1. SystemBar.vue — 去 gold-foil + 两端淡出
2. SystemBar.vue — bar-stats 横向排列
3. SystemBar.vue — 阵眼 20s 自转 + 墨迹扩散
4. _global.scss — :has() 因果联动

### Phase 2：NPC 命魂盘（P0/P1）
5. NpcCard.vue — 去 gold-foil + 石质底
6. NpcCard.vue — radial-gradient 中心灵气
7. NpcCard.vue — scale(1.1) 呼吸动画
8. NpcCard.vue — seal-badge 去 border
9. NpcDetail.vue — 去 gold-foil + 去 border

### Phase 3：PageNav 气运流线（P0）
10. PageNav.vue — 去 border + 渐变线 + 流线布局

### Phase 4：须弥法囊动态消耗（P1）
11. BackpackPage.vue — 数字上浮动效（Script 4行 + CSS）
12. BackpackPage.vue — 归零湮灭动效（Script 1行 + CSS）

### Phase 5：全局收尾（P0）
13. _global.scss — 统一 cubic-bezier 变量
14. _mixins.scss — gold-foil / gold-seal-btn 废弃标记
15. ShopPage.vue — 去剩余 gold-foil
16. 全局验收：pnpm build + vitest

---

## 五、风险矩阵

| 风险 | 级别 | 缓解措施 |
| :--- | :---: | :--- |
| :has() 浏览器兼容性 | P1 | Chrome 105+ 原生支持，SillyTavern 满足 |
| 归零湮灭 DOM 残留 | P2 | animation-fill-mode: forwards + pointer-events: none |
| gold-foil 废弃影响 | P2 | 逐文件替换，不删除 mixin 定义（向后兼容） |
| 数字上浮 watch 性能 | P3 | deep watch + 300ms debounce，道具数量有限 |
| PageNav 气运流线破坏对齐 | P2 | 保持 space-around 备选，仅调整 gap |

---

## 六、验收标准

### 6.1 构建验收
- `pnpm build` — 0 errors
- `npx vitest run` — ≥ 249/251 PASS（PageNav 预存失败除外）

### 6.2 视觉验收
- [ ] SystemBar 无边框，两端向背景淡出
- [ ] bar-stats 横向排列，数值紧邻图标
- [ ] theme-toggle 20s 匀速自转，点击有墨迹扩散
- [ ] NPC 悬停时顶栏色相微偏（:has 联动）
- [ ] NPC 太极盘石质底 + 攻略态中心灵气晕染
- [ ] NPC 攻略态 scale 呼吸动画
- [ ] seal-badge 无 border，用 text-shadow 替代
- [ ] PageNav 无 border-top，用渐变线替代
- [ ] 背包数字变化时有上浮动效
- [ ] 背包道具归零时有湮灭动效
- [ ] 所有 transition 使用 cubic-bezier(0.4, 0, 0.2, 1)

### 6.3 回归验收
- [ ] 四个页面切换正常
- [ ] 主题切换（脂白沉香/玉骨桃花）丝滑过渡
- [ ] NPC 卡片展开/收起正常
- [ ] 商城购买流程正常
- [ ] 背包装备/卸下正常
- [ ] 牝奴期四区域显示正常

---

## 七、变更日志

| 日期 | 版本 | 变更 |
| :--- | :--- | :--- |
| 2026-05-21 | 1.0 | 初始版本 |
| 2026-05-21 | 2.0 | 四页面深度改造完成 |
| 2026-05-22 | 3.0 | 五气朝元阵 + NPC命魂盘 + 须弥法囊 + 去工业化铁律 |