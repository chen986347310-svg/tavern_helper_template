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
import { onMounted } from 'vue';
import { useDataStore } from '../store';
import { useDebug } from '../composables/useDebug';

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;

const store = useDataStore();
const debug = useDebug();
onMounted(() => debug.initShortcut());
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
  max-width: 320px;
  max-height: 80vh;
  background: -bg;
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
  border-bottom: 1px solid -border;

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
  border-top: 1px solid -border;
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
