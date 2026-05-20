# 详细执行计划：紧凑化 + 性能优化 + 主题收尾

> 2026-05-20 | 基于 `handoff-layout-compact-perf.md` + `handoff-theme-decorations.md`

---

## 执行摘要

| 阶段 | 内容 | 文件数 | 预期效果 | 风险 |
|------|------|--------|----------|------|
| Phase A | 布局紧凑化 | 5 | 垂直空白 ~100px->0, 卡片 66->46px, 状态栏 68->50px | 低 |
| Phase B | 性能优化 | 3+10图 | dist 28.8->~8-10 MB | 中（图片不可逆） |
| 主题收尾 | CSS transition + 样式铺开 | 4 | 主题切换平滑, 子页面风格统一 | 低 |
| Phase C | light mode 卡片层次 | 1 | 日间模式视觉层次增强 | 低 |

**A/B/C 三阶段无文件冲突，可独立执行。** 建议顺序执行以便逐步验证。

---

## 约束清单（贯穿全程）

- 不改组件 props / emit 接口
- 不改 `aspect-ratio: 2/3` 容器约束
- 不改 `gold-foil` / `breathing-glow` 等共享 mixin
- 不动 CSS 动画（PC 运行无性能问题）
- iframe 单文件部署模型不变
- PageNav 已有 `flex-shrink: 0`（`PageNav.vue:44`），无需改动
- `.locked` 状态已有完整禁用样式
- `handleClick()` 已拦截未开始状态（`NpcCard.vue:153-156`）
- **文件写入一律使用 `apply_patch`**（禁止 PowerShell `Set-Content`/`Add-Content`）

---

## 智能体分工策略

### 主控智能体（当前会话）

- 负责：计划制定、任务分发、验证整合、最终交付

### Worker 智能体分配

| Worker | 职责 | Phase | 涉及文件 |
|--------|------|-------|----------|
| Worker A | 布局紧凑化 CSS 修改 | A | `App.vue`, `NpcCard.vue`, `SystemBar.vue`, `HomePage.vue`, `_variables.scss` |
| Worker B | 性能优化（webpack + 依赖清理） | B | `webpack.config.ts`, `package.json` |
| Worker C | 头像图片压缩 | B | `assets/avatars/*.png` (10 files) |
| Worker D | 主题过渡 + 子页面样式 | 收尾 | `useTheme.ts`, `_global.scss`, `NpcCard.vue` |

> Worker A 和 Worker B/C 无文件重叠，可完全并行。Worker D 需等 A 完成（共用 `NpcCard.vue`）。

### Skill 调用矩阵

| 时机 | Skill | 用途 |
|------|-------|------|
| 编码前 | `writing-plans` | （已完成，本文档） |
| 每个 Step 完成后 | `verification-before-completion` | 运行 `pnpm build:dev` + `npx vitest run` |
| Phase A 完成后 | `verification-before-completion` | build + test 通过 |
| Phase B 完成后 | `verification-before-completion` | build + test + dist 体积检查 |
| CSS 修改时 | `ui-ux-pro-max` | 设计间距/色值决策参考 |
| 全部完成后 | `review` | diff 审查 |
| 全部完成后 | `context-save` | 保存工作状态 |
| 全部完成后 | `handoff` | 生成交接文档 |

---
﻿
## Phase A: 布局紧凑化（视觉改动，低风险）

### Step 1: content-area 自适应

- **文件**: `src/雌堕合欢宗/App.vue` (L161-162)
- **Worker**: A
- **Skill**: `ui-ux-pro-max`（间距决策参考）
- **改动**: `.content-area` 的 `flex: 1` 改为 `flex: 0 1 auto`
- **原理**: `flex: 1` 等价 `flex: 1 1 0%`，强制撑满剩余空间；改为 `0 1 auto` 后内容少时收缩到内容高度
- **验证**: 滚动仍正常（`overflow-y: auto` 已存在 L164）
- **风险**: 低

### Step 2: NPC 卡片高度压缩

- **文件**: `src/雌堕合欢宗/界面/components/NpcCard.vue`
- **Worker**: A
- **改动**:
  - L237 `.avatar-fallback` min-height: `64px` -> `44px`
  - L297 `.text-zone` min-height: `64px` -> `44px`
- **同步**: `_variables.scss` 中 `$card-strip-高度: 64px` 改为 `44px`
- **效果**: 每张卡片 ~66px -> ~46px，5 张共节省 ~100px
- **风险**: 中低。需验证 expand-panel grid-template-rows 动画

### Step 3: 状态栏压缩

- **文件**: `src/雌堕合欢宗/界面/components/SystemBar.vue`
- **Worker**: A
- **改动明细**:

| 选择器 | 属性 | 改前 | 改后 |
|--------|------|------|------|
| `.system-bar` (L153) | padding | `8px 14px` | `6px 10px` |
| `.system-bar` (L154) | margin-bottom | `16px` | `8px` |
| `.taiji-icon` (L176-177) | min-width/min-height | `44px` | `38px` |
| `.taiji-svg` (L182-183) | width/height | `28px` | `24px` |
| `.theme-toggle` (L294-295) | width/height | `40px` | `34px` |
| `.theme-icon` (L315-316) | width/height | `20px` | `18px` |
| `.stat-value` (L280) | font-size | `13px` | `12px` |
| `.stat-label` (L274) | font-size | `10px` | `9px` |

- **效果**: 状态栏 ~68px -> ~50px

### Step 4: 区域标签 + 间距微调

- **文件**: `src/雌堕合欢宗/界面/pages/HomePage.vue` (L72-80)
- **Worker**: A
- **改动**:
  - L72 `.home-page` padding: `12px 0` -> `8px 0`, gap: `8px` -> `6px`
  - L77 `.section-label` margin-bottom: `4px` -> `2px`

### Step 5（可选）: 太极色值统一

- **文件**: `src/雌堕合欢宗/界面/styles/_variables.scss`
- **改动**:
  - `$taiji-未攻略色: #4a7a9b` -> `#7a8a6b`（青铜绿）
  - `$taiji-已攻略色: #d4608a` -> `$册缘鎏金` (#d4a017)
- **影响范围**: `SystemBar.vue` 中太极图标

### Phase A 验证

```powershell
pnpm build:dev
npx vitest run
# 预期: 221 tests passing, 无编译错误
```

---
﻿
## Phase B: 性能优化（资产 + 构建）

### Step 6: 头像图片压缩

- **Worker**: C（并行于 Worker B）
- **Skill**: 无（纯资产操作）
- **工具**: `npx sharp-cli` (v5.2.0 已安装)
- **源路径**: `src/雌堕合欢宗/界面/assets/avatars/*.png`
- **当前状态**:

| 文件 | 尺寸 | 大小 |
|------|------|------|
| 白芷.png | 1254x1254 | 1.91 MB |
| 白芷_fallen.png | 1254x1254 | 2.29 MB |
| 苏芸.png | 1254x1254 | 2.13 MB |
| 苏芸_fallen.png | 1122x1402 | 2.08 MB |
| 纪兰.png | 1254x1254 | 2.06 MB |
| 纪兰_fallen.png | 1254x1254 | 2.12 MB |
| 沈月秋.png | 1254x1254 | 2.07 MB |
| 沈月秋_fallen.png | 1122x1402 | 1.82 MB |
| 柳素衣.png | 1254x1254 | 2.00 MB |
| 柳素衣_fallen.png | 1254x1254 | 2.27 MB |
| **合计** | | **~20.75 MB** |

- **显示区域**: `avatar-zone` max-width: 120px（文档规范 512x512）
- **操作步骤**:
  1. 备份原图到 `assets/avatars/_backup/`
  2. 1254x1254 图片 -> `npx sharp-cli resize 512 512`
  3. 1122x1402 竖图（沈月秋_fallen, 苏芸_fallen）-> 按短边 512 等比缩放
  4. 输出 PNG quality 80-85%
  5. 预期合计 ~2.5 MB
- **验证**: `pnpm build:dev` 后检查 dist 大小
- **风险**: 中。**图片压缩不可逆**，必须先备份

### Step 7: 移除 WebpackObfuscator

- **文件**: `webpack.config.ts`
- **Worker**: B
- **改动**:
  - L19: 删除 `import WebpackObfuscator from 'webpack-obfuscator'`
  - L476-478: 删除 `should_obfuscate` 条件分支中的 `new WebpackObfuscator(...)`
  - L186-188: 删除 `should_obfuscate` 变量定义（如无其他用途）
  - 执行: `pnpm remove webpack-obfuscator`
- **保留**: TerserPlugin minify + mangle
- **效果**: JS 从 ~7.4 MB -> ~5 MB
- **风险**: 低。`controlFlowFlattening: true` 对 iframe 内游戏 mod 混淆收益极低

### Step 8: 清理未使用依赖

- **Worker**: B
- **操作**: `pnpm remove` 以下 14 个包:
```
pixi.js @pixi/react vue3-pixi react react-dom gsap axios
vue-final-modal vue-word-highlighter async-wait-until
compare-versions json5 jsonrepair
```
- **配套**: 从 `webpack.config.ts` auto-import 列表移除 `vue-final-modal`
- **验证**: `pnpm build:dev` 无编译错误
- **注意**: 这些包通过 webpack externals 处理，不影响 bundle 体积，但拖慢 `pnpm install`

### Phase B 验证

```powershell
pnpm build:dev
# 检查 dist 大小
$f = 'dist\雌堕合欢宗\index.html'
Write-Output "大小: $([math]::Round((Get-Item $f).Length/1MB, 2)) MB"
# 预期: ~8-10 MB（原 28.8 MB）
npx vitest run
# 预期: 221 tests passing
```

---
﻿
## 主题收尾工作（3 项，来自 handoff-theme-decorations）

### Task 9: 主题切换 CSS transition 过渡动画

- **文件**: `src/雌堕合欢宗/界面/composables/useTheme.ts`
- **Worker**: D
- **背景**: BUG-1 已修复（`void document.documentElement.offsetHeight` 强制同步重算），但主题切换仍是瞬间跳变
- **改动**:
  - 在 `applyTheme()` 中添加 CSS transition: 对 `--theme-*` 变量应用 `transition: all 0.35s ease`
  - 或在根元素上添加 `.theme-transitioning` class，350ms 后移除
- **验证**: dark -> light -> dark 切换平滑无闪烁
- **风险**: 低。注意不要与现有 `transition: all 0.35s`（NpcCard `.npc-strip`）冲突

### Task 10: Shop/Backpack/Gallery 页面样式铺开

- **Worker**: D
- **Skill**: `ui-ux-pro-max`（设计系统参考）
- **涉及文件**:
  - `src/雌堕合欢宗/界面/pages/ShopPage.vue` (13 KB)
  - `src/雌堕合欢宗/界面/pages/BackpackPage.vue` (7.8 KB)
  - `src/雌堕合欢宗/界面/pages/GalleryPage.vue` (8.9 KB)
- **目标**: 将 HomePage 的金册玉牒视觉风格（gold-foil, 铭文字体, 角落装饰）推广到这三个子页面
- **注意**: 已有测试文件（ShopPage.test.ts, BackpackPage.test.ts, GalleryPage.test.ts），修改后需同步更新
- **风险**: 中。页面体量大（合计 ~30 KB），建议逐页推进

### Task 11: NPC 完成态强调色精修

- **文件**: `src/雌堕合欢宗/界面/styles/_global.scss` (L683-709)
- **Worker**: D
- **背景**: `.npc-strip.completed` 已有 `border-color` 和 `box-shadow` 覆盖，使用 `color-mix()` 混合 `--npc-color`
- **目标**: 精修每个 NPC 的完成态视觉差异，强化专属色辨识度
- **改动**: 调整 L683-709 中 `color-mix()` 的比例参数
- **风险**: 低

---

## Phase C: light mode 卡片层次（可选）

- **文件**: `src/雌堕合欢宗/界面/styles/_global.scss`
- **Worker**: D
- **改动**: 在 `[data-theme="light"]` 块中为 `.npc-strip` 添加 `border-color` 和 `box-shadow` 覆盖
- **原理**: 日间模式卡片与背景色差过小，层次扁平
- **不改**: `gold-foil` mixin（避免全局影响）
- **风险**: 低

---

## 执行时间线

```
Phase A (Worker A)          Phase B (Worker B+C)
  Step 1-5  ─────────┐       Step 7-8 (webpack) ──┐
                     │       Step 6 (图片压缩) ──┤
  build:dev 验证 <───┼───>   build:dev 验证 <────┘
                     │
  build + test 验证    │
                     │
主题收尾 (Worker D)   │
  Task 9  ───────────┤
  Task 10 ───────────┤  (需等 Phase A 完成，共用 NpcCard.vue)
  Task 11 ───────────┤
                     │
Phase C (Worker D)   │
  light mode 层次 ───┘
                     │
review + context-save + handoff
```

## 预期成果

| 指标 | 当前 | 改后 |
|------|------|------|
| dist/index.html | 28.8 MB | ~8-10 MB |
| 图片资产 | 21.3 MB | ~2.5 MB |
| JS | 7.4 MB | ~5 MB |
| 页面垂直空白 | ~100px+ | 0（内容自适应） |
| 卡片高度 | ~66px | ~46px |
| 状态栏高度 | ~68px | ~50px |
| 主题切换 | 瞬间跳变 | 0.35s 平滑过渡 |
| 子页面风格 | 未统一 | 金册玉牒体系 |

## 关键文件索引

| 文件 | 路径 | 改动类型 |
|------|------|----------|
| App.vue | `src/雌堕合欢宗/App.vue` | content-area flex |
| NpcCard.vue | `src/雌堕合欢宗/界面/components/NpcCard.vue` | text-zone + avatar-fallback min-height |
| SystemBar.vue | `src/雌堕合欢宗/界面/components/SystemBar.vue` | 间距 + 图标尺寸 |
| HomePage.vue | `src/雌堕合欢宗/界面/pages/HomePage.vue` | padding + gap + section-label |
| _variables.scss | `src/雌堕合欢宗/界面/styles/_variables.scss` | 太极色值 + card-strip-高度 |
| _global.scss | `src/雌堕合欢宗/界面/styles/_global.scss` | light mode 覆盖 + completed 精修 |
| useTheme.ts | `src/雌堕合欢宗/界面/composables/useTheme.ts` | transition 过渡 |
| webpack.config.ts | `webpack.config.ts` | 移除 obfuscator + auto-import 清理 |
| package.json | `package.json` | 移除未使用依赖 |
| avatars/*.png | `src/雌堕合欢宗/界面/assets/avatars/` | 图片压缩 |
| ShopPage.vue | `src/雌堕合欢宗/界面/pages/ShopPage.vue` | 样式铺开 |
| BackpackPage.vue | `src/雌堕合欢宗/界面/pages/BackpackPage.vue` | 样式铺开 |
| GalleryPage.vue | `src/雌堕合欢宗/界面/pages/GalleryPage.vue` | 样式铺开 |
