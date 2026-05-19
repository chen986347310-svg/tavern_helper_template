# Handoff: L2 CDP 集成测试 + coerceNumeric 脏数据修复

## 会话摘要

完成 L2 CDP 集成测试的脏数据处理修复、L1 测试扩展、dist 重建、文档巩固。核心发现：replaceMvuData 不触发 VARIABLE_UPDATE_ENDED，需通过 __TEST_applyValidatedUpdate 测试管线直接调用 validateVariables。

---

## 已完成

### 1. Git 仓库初始化
- .gitignore（排除 node_modules、dist、临时文件）
- 7 commits，完整历史可追溯

### 2. coerceNumeric 脏数据处理（核心修复）
- 文件：src/雌堕合欢宗/脚本/后端校验/validate.ts
- 在 validateVariables 入口添加 coerceNumeric 函数
- 处理：null/undefined→0, NaN→0, Infinity→max, 字符串数字→Number()→clamp
- 灵石上限为 Infinity（无上限）
- 原因：replaceMvuData 绕过 Zod z.coerce，AI 原始数据未经清洗

### 3. L1 测试扩展
- validate.test.ts：66 个测试（含 6 个脏数据）
- guards.test.ts：40 个测试
- 结果：106/106 PASS

### 4. L2 Phase 5 升级
- 从 WARN 升级为 PASS（使用 __TEST_applyValidatedUpdate 替代 __L2_writeVar）
- 结果：21/21 PASS，0 FAIL，0 WARN

### 5. dist/backend_validate.js 重建
- 命令：npx esbuild src/.../index.ts --bundle --format=esm --platform=browser --external:lodash --outfile=dist/backend_validate.js --target=esnext
- 重建后需 patch import → window._ 和移除 export
- 浏览器缓存需 CDP Page.reload({ignoreCache: true}) 刷新

### 6. 文档巩固
- CONTEXT.md：完整重写（76 行，领域词汇表）
- docs/PRD-L2-CDP集成测试.md：追加 5 个新章节
- docs/handoff-l2-dirty-data-fix.md：脏数据修复 handoff

---

## 关键发现

- replaceMvuData 不触发 VARIABLE_UPDATE_ENDED — MVU 框架设计，不是 bug
- __TEST_applyValidatedUpdate 是 L2 测试正确入口 — 在 iframe context 直接调用 validateVariables
- coerceNumeric 解决 Zod coerce 绕过 — replaceMvuData 路径不经 Pinia store
- webpack 不编译 dist/backend_validate.js — 需用 esbuild 手动重建
- eventOn 仅限 iframe — 主页面不可用，改用 monkey-patch + 行为验证

---

## Git 提交历史

`
fb0e604 chore: cleanup temp file
2d2986e docs: rewrite CONTEXT.md + update PRD-L2
d08863c chore: cleanup temp files
496d861 fix: rebuild dist/backend_validate.js + update L2 Phase 5
97fb616 chore: remove temp file
711b2d0 feat: add coerceNumeric for dirty data + L1 tests
d5acb33 initial commit - pre-L2 dirty data fix baseline
`

---

## 关键文件引用

- src/雌堕合欢宗/脚本/后端校验/validate.ts — coerceNumeric + 15 条校验规则
- src/雌堕合欢宗/脚本/后端校验/validate.test.ts — 66 个测试（含 6 个脏数据）
- src/雌堕合欢宗/界面/guards.ts — NPC 逻辑、好感度门槛、Phase 2 初始化
- src/雌堕合欢宗/界面/guards.test.ts — 40 个 guards 测试
- cdp-l2-test.mjs — L2 CDP 测试运行器（21 个测试）
- dist/backend_validate.js — 浏览器端校验脚本（esbuild 编译）
- CONTEXT.md — 领域词汇表（76 行）
- docs/PRD-L2-CDP集成测试.md — L2 测试 PRD

---

## 待完成方向

- 生产环境验证：SillyTavern 实际游玩，验证好感度/攻略值/阶段切换
  - 状态：⬜ 待用户手动
- 新功能开发：状态栏美化 / 新 NPC / 新道具 / 新阶段逻辑
  - 状态：⬜ 未开始
- L3 事件管线测试：验证 MVU → eventOn → validate 完整事件链
  - 状态：⬜ 可选
- 测试基础设施增强：CI 集成 / Headless 自动化 / Fuzz Testing
  - 状态：⬜ 可选

---

## 用户偏好

- 使用 gitbash 或 node.js 写文件（避免 PowerShell 编码问题）
- 中文回复
- 优先巩固基础再开发新功能
- 重视测试覆盖和文档完整性

---

## 建议的 Skill

- /diagnose — 生产环境 bug 排查
- /tdd — 新功能测试驱动开发
- /grill-with-docs — 新功能设计审查
- /improve-codebase-architecture — 架构优化