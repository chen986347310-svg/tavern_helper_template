<template>
  <Teleport to="body">
    <div v-if="debug.visible.value" class="debug-overlay" @click.self="debug.toggle()">
      <div class="debug-panel">
        <div class="debug-header">
          <span class="debug-title">调试面板</span>
          <button class="debug-close" @click="debug.toggle()">✕</button>
        </div>

        <div class="debug-body">
          <!-- 阶段切换 -->
          <div class="debug-row">
            <label class="debug-label">阶段</label>
            <select v-model="store.data.系统.阶段" class="debug-select">
              <option value="攻略期">攻略期</option>
              <option value="牝奴期">牝奴期</option>
            </select>
          </div>

          <!-- 剩余天数 -->
          <div class="debug-row">
            <label class="debug-label">剩余天数</label>
            <input v-model.number="store.data.系统.剩余天数" type="number" min="0" max="30" class="debug-input" />
          </div>

          <!-- 灵石 -->
          <div class="debug-row">
            <label class="debug-label">灵石</label>
            <input v-model.number="store.data.系统.灵石" type="number" min="0" class="debug-input" />
          </div>

          <!-- v4 场景 / MVU 调试 -->
          <div class="debug-row">
            <label class="debug-label">时辰</label>
            <select v-model="store.data.系统.时辰" class="debug-select">
              <option value="晨时">晨时</option>
              <option value="午时">午时</option>
              <option value="酉时">酉时</option>
              <option value="亥时">亥时</option>
            </select>
          </div>
          <div class="debug-row">
            <label class="debug-label">当前场景</label>
            <input v-model="store.data.系统.当前场景" type="text" class="debug-input" />
          </div>
          <div class="debug-row">
            <label class="debug-label">地点</label>
            <input v-model="store.data.系统.场景上下文.地点" type="text" class="debug-input" />
          </div>
          <div class="debug-row">
            <label class="debug-label">子区域</label>
            <input v-model="store.data.系统.场景上下文.子区域" type="text" class="debug-input" />
          </div>
          <div class="debug-row">
            <label class="debug-label">公开度</label>
            <select v-model="store.data.系统.场景上下文.公开度" class="debug-select">
              <option value="公开">公开</option>
              <option value="半私密">半私密</option>
              <option value="私密">私密</option>
              <option value="禁地">禁地</option>
            </select>
          </div>
          <div class="debug-row">
            <label class="debug-label">在场NPC</label>
            <input v-model="presentNpcText" type="text" class="debug-input" placeholder="白芷,苏芸" />
          </div>
          <div class="debug-row debug-row--meta">
            <span class="debug-chip">风声 {{ store.data.系统.风声列表.length }}</span>
            <span class="debug-chip">心音 {{ store.data.系统.心音回响.length }}</span>
            <span class="debug-chip">待处理 {{ store.data.系统.待处理交互.length }}</span>
            <span class="debug-chip">效果 {{ store.data.道具.已生效效果.length }}</span>
          </div>
          <div class="debug-row">
            <button class="debug-mini-btn" @click="seedSceneContext()">生成测试场景</button>
            <button class="debug-mini-btn warn" @click="clearPending()">清空待处理</button>
          </div>

          <div class="debug-divider"></div>

          <!-- NPC 数值 -->
          <div v-for="npc in NPC列表" :key="npc" class="debug-npc">
            <div class="debug-npc-name">{{ npc }}</div>
            <div class="debug-row">
              <label class="debug-label">好感度</label>
              <input v-model.number="store.data.NPC[npc].好感度" type="range" min="0" max="100" class="debug-range" />
              <span class="debug-range-value">{{ store.data.NPC[npc].好感度 }}</span>
            </div>
            <div class="debug-row">
              <label class="debug-label">攻略值</label>
              <input v-model.number="store.data.NPC[npc].攻略值" type="range" min="0" max="100" class="debug-range" />
              <span class="debug-range-value">{{ store.data.NPC[npc].攻略值 }}</span>
            </div>
            <div class="debug-row">
              <label class="debug-label">状态</label>
              <select v-model="store.data.NPC[npc].状态" class="debug-select">
                <option value="未开始">未开始</option>
                <option value="进行中">进行中</option>
                <option value="已完成">已完成</option>
              </select>
            </div>
            <div class="debug-row">
              <label class="debug-label">心声态</label>
              <select v-model="store.data.NPC[npc].心声探测态" class="debug-select">
                <option value="无波动">无波动</option>
                <option value="可窥探">可窥探</option>
                <option value="已捕获">已捕获</option>
                <option value="反震">反震</option>
                <option value="锁闭">锁闭</option>
              </select>
            </div>
            <div class="debug-row">
              <button class="debug-mini-btn" @click="markNpcPresent(npc)">设为在场</button>
              <button class="debug-mini-btn" @click="focusSoulEcho(npc)">聚焦心音</button>
              <button class="debug-mini-btn" @click="appendSoulEcho(npc)">追加心音</button>
              <button class="debug-mini-btn warn" @click="injectBacklashSoul(npc)">注入反震</button>
              <button class="debug-mini-btn warn" @click="injectLockdownSoul(npc)">注入锁闭</button>
            </div>
          </div>

          <div class="debug-divider"></div>

          <!-- 牝奴期数值 -->
          <div class="debug-row">
            <label class="debug-label">堕落度</label>
            <input v-model.number="store.data.牝奴.堕落度" type="range" min="0" max="100" class="debug-range" />
            <span class="debug-range-value">{{ store.data.牝奴.堕落度 }}</span>
          </div>
          <div class="debug-row">
            <label class="debug-label">牝阴决层数</label>
            <input v-model.number="store.data.牝奴.牝阴决层数" type="range" min="0" max="9" class="debug-range" />
            <span class="debug-range-value">{{ store.data.牝奴.牝阴决层数 }}</span>
          </div>
          <div class="debug-row">
            <label class="debug-label">改造-泌乳</label>
            <input v-model="store.data.牝奴.改造进度.泌乳" type="checkbox" class="debug-checkbox" />
          </div>
          <div class="debug-row">
            <label class="debug-label">改造-肛门</label>
            <input v-model="store.data.牝奴.改造进度.肛门" type="checkbox" class="debug-checkbox" />
          </div>
          <div class="debug-row">
            <label class="debug-label">改造-憋尿</label>
            <input v-model="store.data.牝奴.改造进度.憋尿" type="checkbox" class="debug-checkbox" />
          </div>
        </div>

        <div class="debug-footer">
          <button class="debug-btn complete" @click="debug.completeAll()">一键全攻略完成</button>
          <button class="debug-btn reset" @click="debug.resetAll()">一键重置</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useDataStore } from '../store';
import { useDebug } from '../composables/useDebug';

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
type NpcName = (typeof NPC列表)[number];
const NPC_SET = new Set<string>(NPC列表);

const store = useDataStore();
const debug = useDebug();

function ensureDebugShape() {
  const system = store.data.系统 as any;
  system.时辰 ??= '晨时';
  system.当前场景 ??= '莲灯前苑';
  system.待处理交互 ??= [];
  system.风声列表 ??= [];
  system.当前追查风声ID ??= '';
  system.心音回响 ??= [];
  system.当前聚焦心声NPC ??= '';
  system.场景上下文 ??= {
    地点: system.当前场景,
    子区域: '',
    场景来源: '核心地点',
    公开度: '公开',
    在场NPC: [],
    NPC活动: {},
    氛围: [],
    故事钩子: [],
    特殊事件: '',
  };
  system.场景上下文.在场NPC ??= [];
  system.场景上下文.NPC活动 ??= {};
  system.场景上下文.氛围 ??= [];
  system.场景上下文.故事钩子 ??= [];
  for (const npc of NPC列表) {
    (store.data.NPC[npc] as any).心声探测态 ??= '无波动';
    store.data.NPC[npc].soul_whisper ??= {
      text: '',
      stage: '警戒',
      is_revealed: false,
    };
  }
  (store.data.道具 as any).已生效效果 ??= [];
}

const presentNpcText = computed({
  get() {
    ensureDebugShape();
    return store.data.系统.场景上下文.在场NPC.join(',');
  },
  set(value: string) {
    ensureDebugShape();
    store.data.系统.场景上下文.在场NPC = value
      .split(/[，,\s]+/)
      .map(item => item.trim())
      .filter((item): item is NpcName => NPC_SET.has(item));
  },
});

function markNpcPresent(npc: NpcName) {
  ensureDebugShape();
  const present = store.data.系统.场景上下文.在场NPC;
  if (!present.includes(npc)) present.push(npc);
  store.data.NPC[npc].状态 = '进行中';
}

function focusSoulEcho(npc: NpcName) {
  ensureDebugShape();
  store.data.系统.当前聚焦心声NPC = npc;
  store.data.NPC[npc].心声探测态 = '可窥探';
  markNpcPresent(npc);
}

function appendSoulEcho(npc: NpcName) {
  ensureDebugShape();
  store.data.NPC[npc].状态 = '进行中';
  store.data.NPC[npc].心声探测态 = '已捕获';
  store.data.NPC[npc].soul_whisper = {
    text: '调试心声：此处用于验证心音残片显影与主题可读性。',
    stage: '动摇',
    is_revealed: true,
  };
  store.data.系统.当前聚焦心声NPC = npc;
  store.data.系统.心音回响 = [
    ...store.data.系统.心音回响.slice(-11),
    {
      id: `debug_echo_${Date.now()}`,
      npc,
      text: '调试心音：命盘已捕获一缕可回看的心绪。',
      stage: '动摇',
      result: '捕获',
      scene: store.data.系统.场景上下文.地点 || store.data.系统.当前场景,
      time: store.data.系统.时辰,
      floor: 0,
      is_new: true,
    },
  ];
  markNpcPresent(npc);
}


function injectBacklashSoul(npc: NpcName) {
  ensureDebugShape();
  store.data.NPC[npc].状态 = '进行中';
  store.data.NPC[npc].心声探测态 = '反震';
  store.data.NPC[npc].soul_whisper = {
    text: '',
    stage: '警戒',
    is_revealed: false,
  };
  store.data.系统.当前聚焦心声NPC = npc;
  store.data.系统.心音回响 = [
    ...store.data.系统.心音回响.slice(-11),
    {
      id: `debug_backlash_${Date.now()}`,
      npc,
      text: '调试反震：道心坚如磐石，灵识触之即碎。',
      stage: '警戒',
      result: '反震',
      scene: store.data.系统.场景上下文.地点 || store.data.系统.当前场景,
      time: store.data.系统.时辰,
      floor: 0,
      is_new: true,
    },
  ];
  markNpcPresent(npc);
}

function injectLockdownSoul(npc: NpcName) {
  ensureDebugShape();
  store.data.NPC[npc].状态 = '进行中';
  store.data.NPC[npc].心声探测态 = '锁闭';
  store.data.NPC[npc].soul_whisper = {
    text: '',
    stage: '警戒',
    is_revealed: false,
  };
  store.data.系统.当前聚焦心声NPC = npc;
  store.data.系统.心音回响 = [
    ...store.data.系统.心音回响.slice(-11),
    {
      id: `debug_lockdown_${Date.now()}`,
      npc,
      text: '调试锁闭：神魂受震，心防彻底锁闭。',
      stage: '警戒',
      result: '锁闭',
      scene: store.data.系统.场景上下文.地点 || store.data.系统.当前场景,
      time: store.data.系统.时辰,
      floor: 0,
      is_new: true,
    },
  ];
  markNpcPresent(npc);
}
function seedSceneContext() {
  ensureDebugShape();
  store.data.系统.当前场景 = '调试幻境';
  store.data.系统.场景上下文 = {
    地点: '调试幻境',
    子区域: '命魂校验台',
    场景来源: '临时过渡',
    公开度: '半私密',
    在场NPC: ['白芷', '苏芸'],
    NPC活动: { 白芷: '校验命魂光晕', 苏芸: '校验风声流转' },
    氛围: ['调试灵雾', '界面热更新'],
    故事钩子: ['验证下一楼层 MVU 回写'],
    特殊事件: '调试面板种子场景',
  };
}

function clearPending() {
  ensureDebugShape();
  store.data.系统.待处理交互 = [];
  store.data.系统.当前追查风声ID = '';
}

ensureDebugShape();

onMounted(() => {
  ensureDebugShape();
  debug.initShortcut();
});
</script>
<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.debug-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.debug-panel {
  width: 90%;
  max-width: 380px;
  max-height: 80vh;
  background: $debug-bg;
  border: 1px solid $debug-border;
  border-radius: $radius-lg;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.debug-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid $debug-border;

  .debug-title {
    font-family: $font-铭文;
    font-size: 14px;
    color: $铭文赤金;
  }

  .debug-close {
    background: none;
    border: none;
    color: rgba(180, 150, 100, 0.5);
    cursor: pointer;
    font-size: 14px;

    &:hover {
      color: $铭文赤金;
    }
  }
}

.debug-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.debug-row {
  display: flex;
  align-items: center;
  gap: 8px;

  &--meta {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .debug-label {
    font-size: 11px;
    color: rgba(180, 150, 100, 0.5);
    min-width: 56px;
    flex-shrink: 0;
  }

  .debug-input {
    flex: 1;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(212, 160, 23, 0.15);
    border-radius: $radius-sm;
    color: rgba(212, 160, 23, 0.8);
    padding: 3px 6px;
    font-size: 12px;
    font-family: $font-等宽;
  }

  .debug-select {
    flex: 1;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(212, 160, 23, 0.15);
    border-radius: $radius-sm;
    color: rgba(212, 160, 23, 0.8);
    padding: 3px 6px;
    font-size: 12px;
  }

  .debug-range {
    flex: 1;
    accent-color: $铭文赤金;
  }

  .debug-range-value {
    font-family: $font-等宽;
    font-size: 11px;
    color: rgba(212, 160, 23, 0.7);
    min-width: 24px;
    text-align: right;
  }

  .debug-checkbox {
    accent-color: $铭文赤金;
  }
}


.debug-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  font-family: $font-铭文;
  font-size: 10px;
  color: var(--hh-text-primary);
  background: rgba(212, 160, 23, 0.08);
  border: 1px solid rgba(212, 160, 23, 0.12);
}

.debug-mini-btn {
  flex: 1;
  padding: 4px 6px;
  border: 1px solid rgba(212, 160, 23, 0.22);
  background: rgba(212, 160, 23, 0.08);
  color: var(--hh-text-primary);
  font-family: $font-铭文;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background: rgba(212, 160, 23, 0.16);
  }

  &.warn {
    border-color: rgba(156, 44, 49, 0.32);
    color: var(--hh-text-highlight);
  }
}

.debug-npc {
  padding: 6px 0;
  border-bottom: 1px solid rgba(212, 160, 23, 0.06);

  .debug-npc-name {
    font-family: $font-铭文;
    font-size: 12px;
    color: $铭文赤金;
    margin-bottom: 4px;
  }
}

.debug-divider {
  height: 1px;
  background: rgba(212, 160, 23, 0.1);
  margin: 4px 0;
}

.debug-footer {
  display: flex;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid $debug-border;
}

.debug-btn {
  flex: 1;
  padding: 6px 10px;
  border-radius: $radius-sm;
  font-family: $font-铭文;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.25s ease;

  &.complete {
    background: rgba(212, 160, 23, 0.15);
    border: 1px solid rgba(212, 160, 23, 0.3);
    color: $铭文赤金;

    &:hover {
      background: rgba(212, 160, 23, 0.25);
    }
  }

  &.reset {
    background: rgba(200, 64, 64, 0.15);
    border: 1px solid rgba(200, 64, 64, 0.3);
    color: $铭文赤金;

    &:hover {
      background: rgba(200, 64, 64, 0.25);
    }
  }
}
</style>
