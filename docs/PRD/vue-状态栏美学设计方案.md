# 状态栏美学设计方案实施计划

## Context

用户希望对雌堕合欢宗状态栏进行美学升级，采用"金册玉牒"主题——一本沉睡在合欢宗密室中的《群芳金册》，记录宿主对五位女修的征服与调教进程。

### 设计目标
- 保持现有功能和交互逻辑不变
- 仅修改视觉样式，不涉及组件结构或逻辑代码
- 创建共享样式机制，减少代码重复
- 以首页为示例先完成，再推广到其他页面

### 核心美学要素
1. **金册幽光背景**：径向渐变模拟烛光照在展开的金册上 + SVG 噪点（3% 透明度）
2. **金箔贴片效果**：双层描边（深金 + 浅金） + 金属拉丝横向渐变 + 内阴影
3. **NPC专属微色**：仅在特定状态（已完成攻略）时显示专属色系
4. **页面渐变中心**：使用 CSS 变量动态调整

---

## 实施步骤

### 阶段一：创建共享样式基础

#### 1.1 创建 SCSS 变量文件
**文件**: `src/雌堕合欢宗/界面/styles/_variables.scss`

```scss
// 金册五色
$册底玄金: #1a1008;
$册面古铜: #2a1f14;
$册缘鎏金: #d4a017;
$铭文赤金: #e8c44a;
$渗血朱砂: #c84040;

// 色彩透明度变体
$金色系列: (
  极淡: rgba(212, 160, 23, 0.02),
  淡: rgba(212, 160, 23, 0.06),
  中: rgba(212, 160, 23, 0.15),
  浓: rgba(212, 160, 23, 0.3),
  极浓: rgba(212, 160, 23, 0.5),
  纯金: #d4a017
);

$褐色系列: (
  深: rgba(30, 21, 13, 0.95),
  中: rgba(42, 31, 20, 0.8),
  浅: rgba(180, 150, 100, 0.5)
);

// NPC 专属色（已完成攻略状态）
$npc专属色: (
  白芷: #a8c4e0,  // 冷金（晨露）
  苏芸: #e0a860,  // 暖金（骄阳）
  纪兰: #b088d4,  // 紫金（暮霭）
  沈月秋: #d46048, // 赤金（炉火）
  柳素衣: #e8e0d0  // 白金（月光）
);

// 字体
$font-铭文: 'Noto Serif SC', 'Source Han Serif SC', serif;
$font-行书: 'LXGW WenKai', cursive;
$font-等宽: 'Courier New', monospace;

// 间距
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 12px;
$spacing-lg: 16px;
$spacing-xl: 20px;

// 圆角
$radius-sm: 4px;
$radius-md: 6px;
$radius-lg: 8px;

// 阴影
$shadow-金色发光: 0 0 12px rgba(212, 160, 23, 0.1);
$shadow-金色发光强: 0 0 16px rgba(212, 160, 23, 0.15);
$shadow-卡片: 0 8px 24px rgba(0, 0, 0, 0.5);
$shadow-弹窗: 0 0 40px rgba(0, 0, 0, 0.6);
```

#### 1.2 创建 Mixins 文件
**文件**: `src/雌堕合欢宗/界面/styles/_mixins.scss`

```scss
// 纸张纤维纹理
@mixin paper-texture {
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(139, 90, 43, 0.03) 3px,
      rgba(139, 90, 43, 0.03) 4px
    ),
    linear-gradient(180deg, rgba(42, 31, 20, 0.8) 0%, rgba(30, 21, 13, 0.9) 100%);
}

// 金册幽光背景
@mixin gold-book-bg($center-x: 50%, $center-y: 50%) {
  background: 
    radial-gradient(ellipse at $center-x $center-y, rgba(212, 160, 23, 0.06) 0%, transparent 60%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"),
    linear-gradient(180deg, $册底玄金 0%, darken($册底玄金, 5%) 100%);
}

// 金箔贴片效果
@mixin gold-foil {
  border: 1px solid rgba(212, 160, 23, 0.2);
  box-shadow: 
    inset 0 1px 0 rgba(212, 160, 23, 0.1),
    inset 0 -1px 0 rgba(212, 160, 23, 0.05),
    $shadow-金色发光;
  
  // 金属拉丝效果（横向渐变）
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(212, 160, 23, 0.03) 25%,
      transparent 50%,
      rgba(212, 160, 23, 0.03) 75%,
      transparent 100%
    );
    pointer-events: none;
  }
}

// 区域标题装饰
@mixin section-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;

  .header-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 160, 23, 0.2), transparent);
  }

  .header-glyph {
    font-family: $font-铭文;
    font-size: 13px;
    color: rgba(212, 160, 23, 0.5);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(212, 160, 23, 0.15);
    border-radius: 3px;
    background: rgba(212, 160, 23, 0.03);
  }

  .header-text {
    font-family: $font-铭文;
    font-size: 13px;
    color: rgba(180, 150, 100, 0.5);
    letter-spacing: 0.1em;
  }
}

// 三态样式
@mixin status-badge($status) {
  @if $status == 'completed' {
    border-color: rgba(212, 160, 23, 0.5);
    box-shadow: $shadow-金色发光强, inset 0 0 20px rgba(212, 160, 23, 0.03);
    
    .npc-name {
      color: $册缘鎏金;
      text-shadow: 0 0 8px rgba(212, 160, 23, 0.3);
    }
  } @else if $status == 'active' {
    border-color: rgba(180, 150, 100, 0.3);
    
    .status-dot {
      background: #8b7355;
      box-shadow: 0 0 4px rgba(139, 115, 85, 0.4);
    }
  } @else {
    opacity: 0.45;
    filter: saturate(0.3);
  }
}

// 悬停上浮效果
@mixin hover-float($distance: 3px) {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-$distance);
    box-shadow: $shadow-卡片;
  }
}

// 铭文刻入效果
@mixin inscription-engrave {
  text-shadow: 
    0 1px 0 rgba(0, 0, 0, 0.3),
    0 0 8px rgba(212, 160, 23, 0.3);
}

// 金印押章按钮
@mixin gold-seal-btn {
  background: rgba(212, 160, 23, 0.15);
  border: 1px solid rgba(212, 160, 23, 0.3);
  border-radius: $radius-md;
  cursor: pointer;
  transition: all 0.25s ease;
  
  &:hover:not(:disabled) {
    background: rgba(212, 160, 23, 0.25);
    box-shadow: 0 0 12px rgba(212, 160, 23, 0.15);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
```

#### 1.3 创建全局样式文件
**文件**: `src/雌堕合欢宗/界面/styles/_global.scss`

```scss
// 页面容器
.page-view {
  --gradient-center-x: 50%;
  --gradient-center-y: 50%;
  
  @include gold-book-bg(var(--gradient-center-x), var(--gradient-center-y));
}

// 通用动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb {
  background: rgba(212, 160, 23, 0.15);
  border-radius: 3px;
}
```

---

### 阶段二：首页（阁）示例实现

#### 2.1 修改 App.vue 添加全局样式导入
**文件**: `src/雌堕合欢宗/App.vue`

在 `<script setup>` 中添加：
```scss
import './界面/styles/_variables.scss';
import './界面/styles/_mixins.scss';
import './界面/styles/_global.scss';
```

#### 2.2 修改 HomePage.vue 样式
**文件**: `src/雌堕合欢宗/界面/pages/HomePage.vue`

主要修改点：

1. **宿主信息区 - 金册扉页**
   - 称号使用铭文赤金 + 铭文刻入效果
   - 阶段名添加细金线装饰
   - 灵石数使用赤金 + 微光晕
   - 剩余天数根据天数动态变色（>7天金色，3-7天铜色，≤3天渗血色）

2. **牝奴状态区 - 驯化刻录**
   - 堕落度根据数值动态变色
   - 使用金箔贴片效果

3. **NPC卡片组 - 五位女修的命格金页**
   - 应用金箔贴片效果
   - 好感度条使用温度计隐喻（冷铜→暖金→炽金）
   - NPC专属微色仅在已完成攻略状态时显示

4. **渐变中心调整**
   - 首页渐变中心偏上（命格所在）

#### 2.3 修改 NpcCard.vue 样式
**文件**: `src/雌堕合欢宗/界面/components/NpcCard.vue`

主要修改点：

1. **应用金箔贴片效果**
   - 使用 `@include gold-foil`
   - 添加双层描边（深金 + 浅金，间距 2px）

2. **好感度条 - 温度计隐喻**
   - 色温渐变：冷铜色（0）→ 暖金色（50）→ 炽金色（100）
   - 当前位置添加小光点

3. **NPC专属微色**
   - 仅在已完成攻略状态时应用专属色

---

### 阶段三：推广到其他页面

#### 3.1 商城页面（坊）
**文件**: `src/雌堕合欢宗/界面/pages/ShopPage.vue`

修改点：
- 灵石余额使用"金库天窗"隐喻（数字发光，余额越大光晕越大）
- 分类标签使用"金箔签条"效果
- 物品格子使用"金册货架"效果
- 六类商品使用微底色区分

#### 3.2 背包页面（囊）
**文件**: `src/雌堕合欢宗/界面/pages/BackpackPage.vue`

修改点：
- 道具列表使用"囊中金石"效果
- 装备选择使用"金印分配"效果
- 已装备状态使用"已盖金印"图标标记

#### 3.3 图鉴页面（鉴）
**文件**: `src/雌堕合欢宗/界面/pages/GalleryPage.vue`

修改点：
- 关系图谱使用"金线姻缘"效果（连接线粗细随好感度变化）
- 剧情时间线使用"金册年表"效果
- 成就系统使用"功勋金章"效果

---

### 阶段四：优化和调整

#### 4.1 渐变中心调整
根据实际视觉效果调整四个页面的渐变中心位置：
- 阁：偏上（命格所在）
- 坊：偏中（琳琅满目）
- 囊：偏下（囊中沉淀）
- 鉴：均匀（万象收录）

#### 4.2 性能优化
- 简化复杂渐变，减少性能开销
- 使用 `will-change` 优化动画性能
- 避免过度使用 `box-shadow`

#### 4.3 响应式适配
- 确保在不同屏幕尺寸下正常显示
- 调整移动端的间距和字号

---

## 关键文件

### 需要创建的文件
1. `src/雌堕合欢宗/界面/styles/_variables.scss` - SCSS 变量
2. `src/雌堕合欢宗/界面/styles/_mixins.scss` - SCSS Mixins
3. `src/雌堕合欢宗/界面/styles/_global.scss` - 全局样式

### 需要修改的文件
1. `src/雌堕合欢宗/App.vue` - 导入全局样式
2. `src/雌堕合欢宗/界面/pages/HomePage.vue` - 首页样式
3. `src/雌堕合欢宗/界面/components/NpcCard.vue` - NPC卡片样式
4. `src/雌堕合欢宗/界面/pages/ShopPage.vue` - 商城样式
5. `src/雌堕合欢宗/界面/pages/BackpackPage.vue` - 背包样式
6. `src/雌堕合欢宗/界面/pages/GalleryPage.vue` - 图鉴样式

---

## 验证方案

### 1. 视觉验证
- 使用 chrome-devtools MCP 连接酒馆网页
- 截图对比修改前后的效果
- 检查各页面的渐变中心、金箔效果、NPC专属色

### 2. 功能验证
- 确保所有交互功能正常（点击、悬停、切换页面）
- 验证数据绑定正常（好感度、灵石、状态等）
- 测试弹窗、动画效果

### 3. 性能验证
- 检查页面加载速度
- 监控内存使用情况
- 确保动画流畅度

### 4. 兼容性验证
- 测试不同浏览器（Chrome、Firefox、Edge）
- 测试不同屏幕尺寸
- 测试暗色/亮色模式（如有）

---

## 实施顺序

1. **阶段一**：创建共享样式基础（_variables.scss、_mixins.scss、_global.scss）
2. **阶段二**：完成首页示例（HomePage.vue、NpcCard.vue）
3. **阶段三**：推广到其他页面（ShopPage、BackpackPage、GalleryPage）
4. **阶段四**：优化调整（渐变中心、性能、响应式）

---

## 注意事项

1. **仅样式修改**：不涉及组件结构或逻辑代码的修改
2. **核心优先**：优先实现金箔贴片和金册幽光背景，其他效果可简化
3. **NPC专属色**：仅在已完成攻略状态时显示
4. **渐变中心**：使用 CSS 变量动态调整，根据实际效果优化
5. **性能考虑**：避免过度使用复杂渐变和动画
`n`n---`n`n## 实施状态 (2026-05-20 更新)`n`n### 已完成`n`n- [x] 阶段一: SCSS 变量/Mixin/全局样式创建`n- [x] 阶段二: 首页 NpcCard 样式 + 金箔贴片效果`n- [x] SystemBar SVG 图标替换（太极/樱花/太阳月亮）`n- [x] NpcCard 展开区域进度条重设计`n- [x] 装备按钮加大 + 文字颜色修复`n- [x] 日/夜主题切换系统（useTheme + CSS 自定义属性）`n- [x] mixin 硬编码色覆写（html[data-theme=light] 块）`n- [x] 日间模式字体对比度优化（深褐色系替换金色系）`n- [x] 攻略完成卡片装饰系统（封章+角落+呼吸光效）`n- [x] NPC 专属色双色映射（--npc-accent 自动切换）`n- [x] 主题切换 CSS transition 过渡动画（0.35s ease，防止快速切换闪烁）`n- [x] NPC 完成态强调色精修（color-mix 比例提升：border 65%, glow 45%, name 65%）`n- [x] 日间模式卡片层次增强（border-color + box-shadow 覆写）`n- [x] 布局紧凑化（content-area 自适应、卡片 66→46px、状态栏 68→50px）`n- [x] 性能优化（dist 28.8→6.0 MB：图片压缩、移除 WebpackObfuscator、清理 14 个未使用依赖）`n`n### 已知问题`n`n- [x] 切换到夜间模式时字体显示异常 — 已修复（BUG-1: void document.documentElement.offsetHeight 强制同步重算）`n- [x] 主题切换瞬间跳变 — 已修复（添加 0.35s CSS transition 过渡动画）`n`n### 待实施`n`n- [x] 阶段三: 商城/背包/图鉴页面样式推广（2026-05-20 完成，金册玉牒视觉风格已铺开）`n- [ ] 阶段四: 渐变中心优化 + 性能调优 + 响应式适配
