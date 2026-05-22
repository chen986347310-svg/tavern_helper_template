# PRD: 合欢宗 · 惑心魅影 UI 重构

> 产品级别：S 级（核心视觉重构）
> 评估日期：2026-05-21
> 状态：Phase 1-2 已完成（四页面深度改造 + SystemBar 图标化）
> 前置文档：PRD-雌堕合欢宗.md, PRD-界面架构重组.md, vue-状态栏美学设计方案.md

---

## 一、项目概述

### 1.1 背景

雌堕合欢宗前端界面当前采用「金册玉牒」视觉主题（2026-05-20 完成），包含日/夜双主题切换。
用户要求将视觉体系全面升级为「阴阳双生」美学——两套截然不同的东方意境皮肤：

- 【脂白沉香】：暖色调，依红偎翠的闺阁意境
- 【玉骨桃花】：冷色调，清冷月光下的深潭古玉

### 1.2 目标

在**不改动任何 HTML 模板结构**的前提下，通过纯 CSS 层改造实现：

1. 将现有「金册玉牒」日/夜主题替换为「脂白沉香」/「玉骨桃花」双主题
2. 全面去除界面中的「工业机械感」和「现代网页感」
3. 牝奴期页面四区域（堕/造/决/器）进行深度视觉转译
4. 所有页面（首页/商城/背包/图鉴/牝奴期）统一适配新主题

### 1.3 约束

- **HTML 结构零改动**：不增加、不删除、不重排任何 DOM 节点
- **逻辑代码零改动**：不修改 schema.ts、guards.ts、store.ts、validate.ts
- **Props/Emit 零改动**：不修改任何组件的接口定义
- **构建模型不变**：webpack 单文件 HTML + esbuild 独立脚本
- **aspect-ratio: 2/3 不变**
- **文件写入遵守开发规范 1.6 节**：SCSS 文件用 Python 脚本，其余用 apply_patch

---

## 二、设计规范

### 2.1 阴阳双生主题色系

| 视觉维度 | 【脂白沉香】（暖） | 【玉骨桃花】（冷） |
| :--- | :--- | :--- |
| 美学意境 | 依红偎翠的香闺、红烛与沉香木 | 危险的红粉骷髅、清冷月光下的深潭古玉 |
| 大背景色 | 紫檀绛黑 #120a0a | 墨黛黑 #080c0a |
| 线条与边界 | 泥金丝缕 #bfa17a | 月影流银 #b8c2c6 |
| 标准高亮 | 胭脂红 #9c2c31 | 桃花窃脂 #e0b3b1 |
| 数据数字 | 熟铜金 #d9b48f | 月光白 #b8c2c6 |
| 纹理质感 | 丝绸经纬暗纹 | 深夜古玉质感 |
| NPC 光晕叠加 | 红烛滤镜 sepia(0.15) hue-rotate(-10deg) | 无滤镜，纯色高反差 |

### 2.2 NPC 功法光晕「灵气雾化」规范

摒弃旧做法（锐利高饱和度小半径硬质发光），采用新规范：

- 模糊半径：10px-15px（原 6px 扩大一倍至两倍）
- 不透明度：30%-40%（原 60% 降低一半）
- 效果：从头像边缘「渗」出来的雾化灵气，轻飘飘浸润在深色背景上
- CSS 实现：ilter: drop-shadow(0 0 12px rgba(..., 0.35))

### 2.3 去工业化全面替换法则

#### 2.3.1 边界去框化

- 彻底隐藏最外层大方框（.scroll-frame 的 border + box-shadow）
- 彻底隐藏四角 L 型装饰线（.corner-ornament x4）
- 彻底隐藏卷轴顶部装饰条（.scroll-header）
- 整个大容器采用无框化设计，大背景色直接融于屏幕黑暗

#### 2.3.2 状态标签媚态化

- 【脂白沉香】圆点 -> 缠绕红丝绒线；进度条 -> 情丝线+古铜钱末端
- 【玉骨桃花】圆点 -> 粉色狐火/烟雾；进度条 -> 月影流银丝线

#### 2.3.3 字形字间距仙气化

- 中文字体：Noto Serif SC（思源宋体），letter-spacing: 4px
- 数字字体：Georgia / Cinzel 等古典衬线体
- 所有中文标签强制拉开字间距

### 2.4 牝奴期页面四区域视觉转译

#### 【堕】心神状态区（`stage-card`）

| 要求 | 实现方式 |
| :--- | :--- |
| 去除表格框 | `border: none; box-shadow: none;` |
| 水墨晕染背景 | radial-gradient 从中心向外淡出 |
| 进度条道心裂痕 | 2px细线 + box-shadow 雾化发光 + 呼吸动画 |
| 文字呼吸起伏 | animation text-breathe 4s 控制 opacity 0.7到1 |

#### 【造】身躯改塑区（`transform-section`）

| 要求 | 实现方式 |
| :--- | :--- |
| 消灭原生单选框 | 当前已是span文本字符 非input 仅改视觉 |
| 未激活暗金花苞 | before伪元素 content为菱形花苞 opacity 0.3 |
| 激活胭脂红烙印(脂白沉香) | 背景radial-gradient晕染 + box-shadow |
| 激活桃花粉花苞绽开(玉骨桃花) | 背景色 + before伪元素content为花朵Unicode |

#### 【决】功法运转区（`yinjue-section`）

| 要求 | 实现方式 |
| :--- | :--- |
| 数字放大加古典衬线体 | font-size 22px + Cinzel Georgia serif |
| 燃烧沉香线进度条(脂白沉香) | 2px细线 + 末端火星粒子keyframes spark |
| 流动玉髓丝线进度条(玉骨桃花) | linear-gradient + 流动动画 |

#### 【器】拘束道具区（`item-section`）

| 要求 | 实现方式 |
| :--- | :--- |
| 禁用简陋文字提示 | 替换为多宝阁锦盒视觉 |
| 暗色木质托盘阴影 | border 1px dashed + 微型渐变底色 |
| 虚位以待半透明小字 | after伪元素 content 虚位以待 opacity 0.2 |
| 实现方式 | 纯CSS before加after画三个托盘轮廓 零DOM改动 |

---

## 三、CSS 变量体系

### 3.1 变量命名规范

使用 `--hh-` 前缀（合欢），语义化命名。

### 3.2 完整变量清单

#### [data-theme=chenxiang] 脂白沉香

| 变量 | 值 | 语义 |
| :--- | :--- | :--- |
| --hh-bg-main | #120a0a | 紫檀绛黑主背景 |
| --hh-bg-surface | rgba(26,15,15,0.85) | 卡片面板背景 |
| --hh-bg-elevated | rgba(30,18,18,0.95) | 弹窗浮层背景 |
| --hh-bg-glow | rgba(156,44,49,0.04) | 胭脂红微光底 |
| --hh-divider | #bfa17a | 泥金丝缕分割线 |
| --hh-divider-alpha | rgba(191,161,122,0.25) | 分割线半透明 |
| --hh-border | rgba(191,161,122,0.15) | 标准边框 |
| --hh-border-accent | rgba(156,44,49,0.3) | 强调边框 |
| --hh-accent | #9c2c31 | 胭脂红高亮 |
| --hh-accent-glow | rgba(156,44,49,0.12) | 高亮微光 |
| --hh-accent-glow-strong | rgba(156,44,49,0.25) | 高亮强光 |
| --hh-text-primary | #d9b48f | 熟铜金主文字 |
| --hh-text-secondary | rgba(191,161,122,0.6) | 次要文字 |
| --hh-text-muted | rgba(191,161,122,0.3) | 弱化文字 |
| --hh-text-value | #d9b48f | 数值专用 |
| --hh-gold | #d9b48f | 金册纹饰色 |
| --hh-gold-alpha | rgba(217,180,143,0.15) | 金色半透明 |
| --hh-gold-glow | rgba(217,180,143,0.1) | 金色微光 |
| --hh-bar-fill | linear-gradient(90deg,#6b3a3a,#9c2c31) | 进度条填充 |
| --hh-progress-fill | linear-gradient(90deg,#5a3020,#9c2c31) | 进度条填充2 |
| --hh-texture-filter | sepia(0.15) hue-rotate(-10deg) | 红烛滤镜 |

#### [data-theme=taohua] 玉骨桃花

| 变量 | 值 | 语义 |
| :--- | :--- | :--- |
| --hh-bg-main | #080c0a | 墨黛黑主背景 |
| --hh-bg-surface | rgba(12,18,14,0.85) | 卡片面板背景 |
| --hh-bg-elevated | rgba(16,22,18,0.95) | 弹窗浮层背景 |
| --hh-bg-glow | rgba(224,179,177,0.03) | 桃花窃脂微光底 |
| --hh-divider | #b8c2c6 | 月影流银分割线 |
| --hh-divider-alpha | rgba(184,194,198,0.2) | 分割线半透明 |
| --hh-border | rgba(184,194,198,0.12) | 标准边框 |
| --hh-border-accent | rgba(224,179,177,0.25) | 强调边框 |
| --hh-accent | #e0b3b1 | 桃花窃脂高亮 |
| --hh-accent-glow | rgba(224,179,177,0.1) | 高亮微光 |
| --hh-accent-glow-strong | rgba(224,179,177,0.2) | 高亮强光 |
| --hh-text-primary | #b8c2c6 | 月光白主文字 |
| --hh-text-secondary | rgba(184,194,198,0.55) | 次要文字 |
| --hh-text-muted | rgba(184,194,198,0.25) | 弱化文字 |
| --hh-text-value | #b8c2c6 | 数值专用 |
| --hh-gold | #b8c2c6 | 金册纹饰色 |
| --hh-gold-alpha | rgba(184,194,198,0.12) | 银色半透明 |
| --hh-gold-glow | rgba(184,194,198,0.08) | 银色微光 |
| --hh-bar-fill | linear-gradient(90deg,#3a4a4a,#b8c2c6) | 进度条填充 |
| --hh-progress-fill | linear-gradient(90deg,#2a3a3a,#b8c2c6) | 进度条填充2 |
| --hh-texture-filter | none | 无滤镜纯色高反差 |

### 3.3 SCSS变量到CSS变量映射

| 旧SCSS变量 | 新CSS变量引用 |
| :--- | :--- |
| $册底玄金 (#1a1008) | var(--hh-bg-main) |
| $册面古铜 (#2a1f14) | var(--hh-bg-surface) |
| $册缘鎏金 (#d4a017) | var(--hh-gold) |
| $铭文赤金 (#e8c44a) | var(--hh-text-primary) |
| $渗血朱砂 (#c84040) | var(--hh-accent) |
| $shadow-金色发光 | 0 0 12px var(--hh-gold-glow) |
| $shadow-金色发光强 | 0 0 16px var(--hh-gold-alpha) |

### 3.4 旧硬编码色到CSS变量映射

| 旧硬编码模式 | 新CSS变量 |
| :--- | :--- |
| rgba(212,160,23,x) | var(--hh-gold) with opacity |
| rgba(180,150,100,x) | var(--hh-text-secondary) or var(--hh-text-muted) |
| #d4a017 | var(--hh-gold) |
| #b8860b | var(--hh-gold) |
| #e8c44a | var(--hh-text-primary) |
| #c84040 | var(--hh-accent) |


---

## 四、技术方案

### 4.1 改造策略：三层联动

#### 第一层：SCSS源头（_variables.scss + _mixins.scss）

- 将SCSS色彩变量改为CSS变量引用：`$册底玄金: var(--hh-bg-main)`
- mixin内部所有硬编码色改为CSS变量引用
- 影响：所有使用mixin的组件自动跟随新主题
- **写入方式：Python脚本**（避免PowerShell的$插值问题）

#### 第二层：全局样式（_global.scss）

- 删除旧[data-theme=light]全部覆写（约200行）
- 新增[data-theme=chenxiang]和[data-theme=taohua]两套完整变量定义
- 新增两套主题的背景纹理、去框化、字体声明
- **写入方式：Python脚本**（大文件，分段写入）

#### 第三层：各页面scoped style
n- 将所有硬编码色值替换为var(--hh-xxx)引用
- 将硬编码渐变改为引用var(--hh-bar-fill)等语义变量
- 弹窗角落装饰、卡片角落装饰统一用CSS变量控制
- **写入方式：apply_patch**（增量修改）

### 4.2 主题切换逻辑改造

文件：useTheme.ts

改动点：
- Theme类型从 dark/light 改为 chenxiang/taohua
- localStorage key 从 theme 改为 hh-theme（避免旧缓存冲突）
- 默认主题：chenxiang（脂白沉香）
- 过渡动画：transition all 0.5s cubic-bezier(0.4,0,0.2,1)

### 4.3 字体加载方案

- Noto Serif SC：已有（fontsapi.zeoseven.com/256）
- Cinzel（数字字体）：新增Google Fonts引用
- Fallback：Georgia, Times New Roman, serif
- font-display: swap 防FOUT

### 4.4 动画清单

| 动画名 | 用途 | 参数 |
| :--- | :--- | :--- |
| theme-transition | 主题切换全局过渡 | 0.5s cubic-bezier(0.4,0,0.2,1) |
| text-breathe | 文字呼吸起伏 | 4s ease-in-out infinite opacity 0.7到1 |
| spark | 沉香线末端火星 | 2s ease-in-out infinite box-shadow脉动 |
| foxfire-flicker | 狐火跳动(玉骨桃花圆点) | 1.5s ease-in-out infinite |
| velvet-pulse | 红丝绒线脉动(脂白沉香圆点) | 2s ease-in-out infinite |
| incense-flow | 沉香线/玉髓丝线流动 | 2s linear infinite background-position |
| yinwen-glow | 淫纹发光 | 2s ease-in-out infinite（已有） |


---

## 五、逐文件改造规格

### 5.1 样式层（Python脚本写入）

#### _variables.scss

- 改造范围：全部色彩SCSS变量
- 改造方式：硬编码色值改为CSS变量引用
- 具体改动：
  - $册底玄金: var(--hh-bg-main)
  - $册面古铜: var(--hh-bg-surface)
  - $册缘鎏金: var(--hh-gold)
  - $铭文赤金: var(--hh-text-primary)
  - $渗血朱砂: var(--hh-accent)
  - $shadow-金色发光: 0 0 12px var(--hh-gold-glow)
  - $shadow-金色发光强: 0 0 16px var(--hh-gold-alpha)
  - $金色系列 map: 全部改为var引用
  - $褐色系列 map: 全部改为var引用
- 保留不变：$font-xxx、$spacing-xxx、$radius-xxx、$npc专属色 map
- 风险：mixin和所有scoped style引用这些变量，改动后全局跟随
- 验证：pnpm build 编译无SCSS错误

#### _mixins.scss

- 改造范围：4个核心mixin内部硬编码色
- 改造方式：rgba色值改为var引用
- 具体改动：
  - gold-book-bg: 径向渐变色改为var(--hh-gold-glow)，SVG noise保留，线性渐变改为var(--hh-bg-main)
  - gold-foil: border改为var(--hh-border)，box-shadow改为var引用，before渐变改为var(--hh-gold-alpha)
  - section-header: header-line渐变改为var(--hh-divider-alpha)，header-glyph色改为var(--hh-gold-alpha)，header-text色改为var(--hh-text-secondary)
  - inscription-engrave: text-shadow改为var(--hh-gold-glow)
  - gold-seal-btn: background/border改为var引用
  - status-badge: 所有色改为var引用
- 新增mixin（可选）：
  - chenxiang-dot: 脂白沉香红丝绒线圆点样式
  - taohua-dot: 玉骨桃花狐火圆点样式
  - incense-progress: 沉香线/玉髓丝线进度条
- 验证：pnpm build 编译无SCSS错误

#### _global.scss

- 改造范围：全局主题定义 + 旧light主题覆写
- 删除：
  - [data-theme=light] 块全部内容（约200行）
  - html[data-theme=light] 块全部内容（约200行）
- 新增：
  - [data-theme=chenxiang] CSS变量定义块（21个变量）
  - [data-theme=taohua] CSS变量定义块（21个变量）
  - 两套主题的.page-view背景纹理
  - 两套主题的.scroll-frame/app-container背景覆写
  - 两套主题的滚动条样式
  - Cinzel字体@import引用
  - 全局letter-spacing声明
  - 主题切换transition规则
- 保留：基础样式（scrollbar、gold-book-title等非主题相关）
- 验证：pnpm build + npx vitest run

### 5.2 逻辑层（apply_patch写入）

#### useTheme.ts

- Theme类型：dark|light -> chenxiang|taohua
- localStorage key：theme -> hh-theme
- 默认值：dark -> chenxiang
- 过渡动画时长：350ms -> 500ms
- cubic-bezier：无 -> (0.4,0,0.2,1)
- 迁移逻辑：读取旧theme值时，dark映射为chenxiang，light映射为taohua
- 验证：npx vitest run

### 5.3 组件层（apply_patch写入）

#### App.vue（去框化）

- .corner-ornament x4：新增display:none规则
- .scroll-header：新增display:none规则
- .scroll-frame：border改为none，box-shadow改为none
- .app-container背景：改为var(--hh-bg-main)
- 新增丝绸经纬暗纹/古玉纹理背景
- 验证：pnpm build + 视觉检查

#### SystemBar.vue

- 切换按钮：太阳/月亮图标改为对应新主题的图标
- .stat-item：background和border改为var引用
- .stat-label：font-family保留，color改为var(--hh-text-muted)
- .stat-value：font-family改为Cinzel/Georgia
- 太极图标光晕：drop-shadow半径6px->15px，opacity 0.6->0.3
- 时辰图标：光晕同样雾化
- letter-spacing：4px
- 验证：pnpm build + 视觉检查

#### NpcCard.vue

- .avatar-zone::before：渐变参数调整实现羽化过渡
- .strip-name：color改为var(--hh-text-primary)
- .strip-status：color改为var(--hh-text-secondary)
- .status-dot：双主题差异化（红丝绒线/狐火）
- .favor-fill：background改为var(--hh-bar-fill)
- .expand-bar-fill：background改为var(--hh-progress-fill)
- NPC光晕：drop-shadow半径6px->12px，opacity 0.6->0.35
- 已攻略呼吸光效：box-shadow色改为var引用
- .seal-badge：色改为var(--hh-accent)
- .card-corner：色改为var(--hh-gold)
- letter-spacing：4px
- 验证：pnpm build + npx vitest run

#### Phase2Page.vue（重灾区）

- stage-card：去框（border:none, box-shadow:none），背景改为水墨晕染
- stage-glyph/stage-title/stage-desc：色全部改为var引用
- transform-section：去框，背景改为晕染
- transform-item：未激活花苞样式（before伪元素），激活态双主题差异化
- yinjue-section：去框
- yinjue-value：font-size 14px->22px，font-family改为Cinzel/Georgia
- yinjue-bar：6px实心改为2px细线+发光+呼吸动画
- yinjue-fill：background改为var(--hh-accent)
- item-section：去框
- item-empty：替换为多宝阁锦盒CSS（before+after伪元素画托盘）
- 淫纹色阶梯：改为根据主题返回不同色值（唯一TypeScript改动）
- letter-spacing：全局4px
- 验证：pnpm build + npx vitest run

#### ShopPage.vue

- .item-card：gold-foil mixin跟随（自动），额外硬编码色改var引用
- .tab-btn active：border/background/color改var引用
- .detail-modal：box-shadow改var引用
- .modal-ornament：background改var(--hh-gold-alpha)
- .modal-title：color改var(--hh-gold)
- .modal-price .price-num：color改var(--hh-text-primary)
- .buy-btn：跟随gold-seal-btn mixin（自动）
- letter-spacing：4px
- 验证：pnpm build + npx vitest run

#### BackpackPage.vue

- .item-row：border-color改var引用
- .item-row.selected：background改var(--hh-gold-alpha)
- .target-btn.equipped：background/border/box-shadow改var引用
n- .equip-row：background改var(--hh-bg-surface)，border改var(--hh-border)
- letter-spacing：4px
- 验证：pnpm build + npx vitest run

#### GalleryPage.vue

- .npc-entry：background改var(--hh-bg-surface)
- .npc-entry.unlocked：border/border-color改var引用
- .cell-glyph：border/background/color改var引用
- .cell-value.status：各状态色改var引用
- letter-spacing：4px
- 验证：pnpm build + npx vitest run

#### PageNav.vue

- .page-nav：border-top改var(--hh-divider-alpha)
- .nav-tab.active：border/background改var引用
- .tab-icon active：color改var(--hh-gold)
- 底部指示线：background改var(--hh-gold)
- 验证：pnpm build

#### HomePage.vue

- .section-label .label-line：background改var(--hh-divider-alpha)
- .label-text：color改var(--hh-text-muted)
- letter-spacing：4px
- 验证：pnpm build


---

## 六、风险矩阵

### 6.1 风险等级定义

| 等级 | 含义 | 处理策略 |
| :--- | :--- | :--- |
| P0-致命 | 阻塞构建或导致白屏 | 必须在当前Phase内解决 |
| P1-严重 | 功能异常或视觉严重偏差 | 当前Phase解决或降级处理 |
| P2-一般 | 视觉细节不符预期 | 可延后到打磨阶段 |
| P3-轻微 | 微小差异，不影响体验 | 记录备查 |

### 6.2 风险清单

#### R1: SCSS变量改CSS变量后编译失败 [P0]

- 概率：中
- 影响：pnpm build 失败，无法生成 dist
- 根因：CSS变量在SCSS编译时不存在，可能导致calc()或color.adjust()失败
- 检测：Phase A完成后立即 pnpm build
- 缓解：
  - gold-book-bg mixin中的darken()函数需要改为直接写入色值或用CSS color-mix()
  - color.adjust()改为预计算的固定值
  - mixin中的SCSS函数（如darken/lighten/color.mix）改为纯CSS等价物
- 回滚：git checkout还原_variables.scss和_mixins.scss

#### R2: 旧light主题覆写删除后样式丢失 [P1]

- 概率：低（我们将完全替换为新主题）
- 影响：切换到新主题时部分组件样式异常
- 根因：旧覆写层中有些规则不是纯色覆写，而是布局/尺寸调整
- 检测：逐组件视觉走查
- 缓解：删除前逐行审查旧覆写层，保留非色值相关的规则
- 回滚：git checkout还原_global.scss

#### R3: gold-foil mixin改造后所有卡片边框消失 [P1]

- 概率：低
- 影响：所有使用gold-foil的组件失去边框
- 根因：CSS变量在scoped style编译时可能未定义
- 检测：pnpm build后视觉检查NpcCard/ShopPage/Phase2Page
- 缓解：确保CSS变量定义在_global.scss中（全局作用域），scoped style通过var()引用全局变量
- 回滚：git checkout还原_mixins.scss

#### R4: Cinzel字体CDN加载失败 [P2]

- 概率：低
- 影响：数字显示为fallback字体（Georgia）
- 根因：Google Fonts CDN在国内可能不稳定
- 检测：刷新页面检查数字字体
- 缓解：
  - fallback字体栈：Cinzel, Georgia, Times New Roman, serif
  - 考虑使用fontsapi.zeoseven.com替代Google Fonts
- 回滚：无需回滚，fallback可用

#### R5: 牝奴期淫纹色阶梯TypeScript改动引入类型错误 [P1]

- 概率：低
- 影响：npx vitest run 失败
- 根因：淫纹色阶梯从硬编码4色改为computed属性，需要根据主题返回不同色值
- 检测：npx vitest run
- 缓解：保持computed返回类型为string，新增主题判断逻辑
- 回滚：git checkout还原Phase2Page.vue script部分

#### R6: 去框化后iframe背景色不一致 [P2]

- 概率：中
- 影响：界面边缘可见一条色差线
- 根因：酒馆iframe父页面背景色与--hh-bg-main不同
- 检测：CDP连接iframe截图检查
- 缓解：.app-container设置100%宽高+背景色填满
- 回滚：无需回滚，纯视觉微调

#### R7: SystemBar padding在iframe中不生效（已有P0） [P1]

- 概率：高（已确认存在）
- 影响：去框化后padding问题更明显
- 根因：未确定（iframe宽度/父页面覆盖样式/怪异模式）
- 检测：CDP连接iframe，getComputedStyle验证
- 缓解：去框化时一并排查，必要时用!important强制padding
- 回滚：无需回滚

#### R8: 主题切换时旧localStorage缓存冲突 [P2]

- 概率：高（首次加载）
- 影响：用户首次进入时主题可能是旧的dark/light值
- 根因：旧theme key存储了dark或light
- 检测：清除localStorage后刷新
- 缓解：useTheme.ts中读取旧值时做映射（dark->chenxiang, light->taohua）
- 回滚：无需回滚

#### R9: apply_patch在SCSS文件中留下End Patch残留 [P0]

- 概率：中（历史教训）
- 影响：SCSS编译失败
- 根因：apply_patch工具可能在文件末尾留下标记
- 检测：每次apply_patch后检查文件末尾
- 缓解：SCSS文件用Python脚本写入，避免apply_patch
- 回滚：删除残留行

#### R10: pnpm build产物体积变化 [P3]

- 概率：确定会发生
- 影响：dist体积可能变化（增减几KB CSS）
- 根因：新增两套主题变量 + 删除旧覆写层
- 检测：构建后检查文件大小
- 缓解：正常范围内的体积变化无需处理
- 回滚：无需回滚

### 6.3 回滚策略

#### 全局回滚

```powershell
git stash  # 暂存当前改动
# 或
git checkout -- src/雌堕合欢宗/  # 还原全部源码
```

#### 局部回滚（按文件）

```powershell
git checkout -- src/雌堕合欢宗/界面/styles/_variables.scss
git checkout -- src/雌堕合欢宗/界面/styles/_mixins.scss
git checkout -- src/雌堕合欢宗/界面/styles/_global.scss
# 以此类推
```

#### Phase级回滚

每个Phase完成后打git tag，出问题时回退到上一个tag：

```powershell
git tag ui-refactor-phase-a
git tag ui-refactor-phase-b
# 回退
git reset --hard ui-refactor-phase-a
```

---

## 七、测试与验收

### 7.1 测试层级

| 层级 | 工具 | 命令 | 验收标准 |
| :--- | :--- | :--- | :--- |
| L1 单元测试 | Vitest | npx vitest run | 251/251 PASS（不因UI改动失败） |
| L2 集成测试 | CDP | node cdp-l2-test.mjs | 21/21 PASS |
| L3 构建验证 | Webpack | pnpm build | 0 错误，产物正常 |
| L4 视觉验证 | CDP截图 | 手动/脚本 | 双主题切换正常，无视觉异常 |

### 7.2 逐Phase验收检查点

#### Phase A完成后（变量层）

- [ ] pnpm build 编译成功（SCSS无错误）
- [ ] npx vitest run 251/251 PASS
- [ ] dist/雌堕合欢宗/index.html 存在且大小合理（5-8MB）
- [ ] SCSS变量引用CSS变量后mixin编译正常

#### Phase B完成后（全局层）

- [ ] 两套主题CSS变量正确定义
- [ ] 旧light主题覆写已删除
- [ ] Cinzel字体引用已添加
- [ ] pnpm build 编译成功

#### Phase C完成后（逻辑+骨架层）

- [ ] useTheme.ts 切换到chenxiang/taohua正常
- [ ] localStorage读写正常
- [ ] 旧theme值映射正确
- [ ] App.vue去框化视觉正常
- [ ] 主题切换0.5s过渡动画流畅

#### Phase D完成后（组件层）

- [ ] NpcCard三态视觉正常（灰锁/专属色/金框）
- [ ] NPC光晕雾化效果正确
- [ ] 头像羽化过渡正确
- [ ] SystemBar数值显示正确
- [ ] npx vitest run 251/251 PASS

#### Phase E完成后（牝奴期页面）

- [ ] 堕落度道心裂痕进度条显示正确
- [ ] 改造选项花苞/绽开双主题差异化
- [ ] 牝阴决数字放大+Cinzel字体
- [ ] 沉香线/玉髓丝线进度条动画正常
- [ ] 多宝阁锦盒空状态显示正确
- [ ] npx vitest run 251/251 PASS

#### Phase F完成后（其余页面）

- [ ] 商城物品卡/弹窗样式正确
- [ ] 背包装备区样式正确
- [ ] 图鉴NPC列表/详情样式正确
- [ ] 底部导航栏样式正确
- [ ] npx vitest run 251/251 PASS

#### Phase G完成后（验证）

- [ ] pnpm build 0错误
- [ ] npx vitest run 251/251 PASS
- [ ] node cdp-l2-test.mjs 21/21 PASS
- [ ] 双主题切换视觉无异常
- [ ] 5个页面全部走查通过
- [ ] 字体显示正确（中文宋体+数字衬线体）
- [ ] letter-spacing全局生效

### 7.3 回归测试要点

- NPC三态视觉（未开始/进行中/已完成）是否正常
- 好感度/攻略值进度条数值显示是否正确
- 商城购买弹窗交互是否正常
- 背包装备/卸下操作是否正常
- 调试面板（Ctrl+Shift+D）是否正常
- 牝奴期阶段切换是否正常

---

## 八、执行计划

### 8.1 Phase划分

| Phase | 内容 | 文件 | 写入方式 | 依赖 | 预估 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| A | SCSS变量层 | _variables.scss, _mixins.scss | Python脚本 | 无 | 1.5h |
| B | 全局样式层 | _global.scss | Python脚本 | A | 1.5h |
| C | 逻辑+骨架层 | useTheme.ts, App.vue | apply_patch | B | 0.5h |
| D | 核心组件层 | SystemBar.vue, NpcCard.vue | apply_patch | C | 1h |
| E | 牝奴期页面 | Phase2Page.vue | apply_patch | D | 2h |
| F | 其余页面 | ShopPage/Backpack/Gallery/PageNav/HomePage | apply_patch | D | 1.5h |
| G | 验证收尾 | 全部 | 无 | E+F | 0.5h |

### 8.2 依赖关系

```
A -> B -> C -> D -> E（牝奴期，重灾区）
                  -> F（其余页面，可与E并行）
              -> G（验证，等E+F完成）
```

### 8.3 总预估

- 串行执行：8.5小时
- 并行执行（E+F同时）：7小时

---

## 九、附录

### 9.1 文件索引

| 文件 | 路径 | 改造类型 |
| :--- | :--- | :--- |
| _variables.scss | src/雌堕合欢宗/界面/styles/ | SCSS变量改CSS变量引用 |
| _mixins.scss | src/雌堕合欢宗/界面/styles/ | mixin内硬编码色改CSS变量 |
| _global.scss | src/雌堕合欢宗/界面/styles/ | 删除旧主题+写入新主题 |
| useTheme.ts | src/雌堕合欢宗/界面/composables/ | Theme类型+localStorage |
| App.vue | src/雌堕合欢宗/ | 去框化+背景纹理 |
| SystemBar.vue | src/雌堕合欢宗/界面/components/ | 切换按钮+色值+雾化 |
| NpcCard.vue | src/雌堕合欢宗/界面/components/ | 光晕+羽化+色值 |
| Phase2Page.vue | src/雌堕合欢宗/界面/pages/ | 四区域全改造 |
| ShopPage.vue | src/雌堕合欢宗/界面/pages/ | 弹窗+卡片+标签 |
| BackpackPage.vue | src/雌堕合欢宗/界面/pages/ | 装备区+列表 |
| GalleryPage.vue | src/雌堕合欢宗/界面/pages/ | NPC列表+详情 |
| PageNav.vue | src/雌堕合欢宗/界面/components/ | 导航栏 |
| HomePage.vue | src/雌堕合欢宗/界面/pages/ | 区域标签 |

### 9.2 参考文档

- PRD-雌堕合欢宗.md：主PRD，40条用户故事
- PRD-界面架构重组.md：架构重组PRD，30条用户故事
- vue-状态栏美学设计方案.md：金册玉牒主题实施记录
- 架构报告-界面架构重组.md：架构详细报告（含主题系统第十三节）
- 开发规范与智能体协作指南.md：开发规范（含文件写入1.6节）
- 前端架构指南.md：快速上手指南
- 前端构建修复指南.md：构建问题排查

### 9.3 变更日志

| 日期 | 版本 | 变更 |
| :--- | :--- | :--- |
| 2026-05-21 | 1.0 | 初始版本 |
| 2026-05-21 | 2.0 | 四页面深度改造完成：商城流光按钮+灵石联动、牝奴期四区域转译、背包去框化、图鉴去框化、SystemBar图标化、_global.scss新增4变量 |

