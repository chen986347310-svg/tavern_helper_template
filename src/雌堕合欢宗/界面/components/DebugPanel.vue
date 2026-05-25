<template>
  <Teleport to="body">
    <div
      v-if="debug.visible.value"
      class="debug-panel"
      :style="panelStyle"
    >
        <div class="debug-header" @mousedown="startDrag">
          <span class="debug-title">调试面板</span>
          <button class="debug-close" @mousedown.stop @click="debug.toggle()">✕</button>
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

          <section class="debug-runtime" aria-label="世界运行核心">
            <div class="debug-section-title">时间状态</div>
            <div class="debug-row debug-row--meta">
              <span class="debug-chip">当前日 {{ store.data.系统.时间状态.当前日 }}</span>
              <span class="debug-chip">进度 {{ store.data.系统.时间状态.时段进度 }}</span>
              <span class="debug-chip">过夜 {{ store.data.系统.时间状态.是否过夜 ? '是' : '否' }}</span>
            </div>
            <div class="debug-row">
              <label class="debug-label">最近耗时</label>
              <input v-model="store.data.系统.时间状态.最近耗时" type="text" class="debug-input" />
              <span class="debug-runtime-value">{{ store.data.系统.时间状态.最近耗时 || '未结算' }}</span>
            </div>
            <div class="debug-row">
              <label class="debug-label">结算原因</label>
              <input v-model="store.data.系统.时间状态.最近结算原因" type="text" class="debug-input" />
              <span class="debug-runtime-value">{{ store.data.系统.时间状态.最近结算原因 || '无' }}</span>
            </div>
            <div class="debug-row">
              <label class="debug-label">事件类型</label>
              <input v-model="store.data.系统.时间状态.最近事件类型" type="text" class="debug-input" />
            </div>

            <div class="debug-section-title debug-section-title--sub">欲海状态</div>
            <div class="debug-row">
              <label class="debug-label">搜寻进度</label>
              <input v-model.number="store.data.系统.欲海状态.搜寻进度" type="range" min="0" max="100" class="debug-range" />
              <span class="debug-range-value">{{ store.data.系统.欲海状态.搜寻进度 }}</span>
            </div>
            <div class="debug-row">
              <label class="debug-label">警戒等级</label>
              <select v-model="store.data.系统.欲海状态.警戒等级" class="debug-select">
                <option value="平静">平静</option>
                <option value="微动">微动</option>
                <option value="警觉">警觉</option>
                <option value="锁定">锁定</option>
                <option value="已改写">已改写</option>
              </select>
            </div>
            <div class="debug-row">
              <label class="debug-label">遮蔽时段</label>
              <input v-model.number="store.data.系统.欲海状态.遮蔽剩余时段" type="number" min="0" max="99" class="debug-input" />
            </div>
            <div class="debug-row">
              <label class="debug-label">遮蔽来源</label>
              <input v-model="store.data.系统.欲海状态.遮蔽来源" type="text" class="debug-input" />
              <span class="debug-runtime-value">{{ store.data.系统.欲海状态.遮蔽来源 || '无' }}</span>
            </div>
            <div class="debug-row">
              <label class="debug-label">暴露原因</label>
              <input v-model="store.data.系统.欲海状态.最近暴露原因" type="text" class="debug-input" />
            </div>

            <div class="debug-section-title debug-section-title--sub">最近事件记录</div>
            <div v-if="recentEventRecords.length === 0" class="debug-event-empty">事件记录为空</div>
            <div v-else class="debug-pending-list debug-pending-list--compact">
              <article v-for="record in recentEventRecords" :key="record.id || record.摘要" class="debug-pending-item">
                <div class="debug-pending-head">
                  <span class="debug-pending-type">{{ record.类型 || '事件' }}</span>
                  <span>{{ record.日 || 1 }}日</span>
                  <span>{{ record.时辰 || '晨时' }}</span>
                  <span>{{ record.地点 || '莲灯前苑' }}</span>
                </div>
                <p class="debug-pending-hint">{{ record.摘要 || '无摘要' }}</p>
              </article>
            </div>
          </section>
          <section class="debug-pending" aria-label="待处理交互队列">
            <div class="debug-section-title">待处理交互队列</div>
            <div v-if="pendingActions.length === 0" class="debug-pending-empty">待处理交互为空</div>
            <div v-else class="debug-pending-list">
              <article v-for="(action, index) in pendingActions" :key="index" class="debug-pending-item">
                <div class="debug-pending-head">
                  <span class="debug-pending-index">#{{ index + 1 }}</span>
                  <span class="debug-pending-type">{{ displayValue(action.类型, '未知交互') }}</span>
                  <span class="debug-pending-target">{{ displayValue(action.目标, '未指定目标') }}</span>
                </div>
                <div class="debug-pending-fields">
                  <span v-if="action.道具显示名 || action.道具">道具 {{ displayItem(action) }}</span>
                  <span v-if="action.数量">数量 {{ action.数量 }}</span>
                  <span v-if="action.时辰">时辰 {{ action.时辰 }}</span>
                  <span v-if="action.场景 || action.地点">场景 {{ displayScene(action) }}</span>
                  <span v-if="action.子区域">子区域 {{ action.子区域 }}</span>
                  <span v-if="action.风声ID">风声 {{ action.风声ID }}</span>
                  <span v-if="action.故事钩子">钩子 {{ action.故事钩子 }}</span>
                  <span v-if="action.器阶">器阶 {{ action.器阶 }}</span>
                  <span v-if="action.作用部位">部位 {{ action.作用部位 }}</span>
                  <span v-if="action.丹药分类">丹药 {{ action.丹药分类 }}</span>
                  <span v-if="action.作用线">作用 {{ action.作用线 }}</span>
                  <span v-if="action.剧情线">剧情 {{ action.剧情线 }}</span>
                  <span v-if="action.关联NPC">关联 {{ action.关联NPC }}</span>
                  <span v-if="action.秘密主题">秘密 {{ action.秘密主题 }}</span>
                  <span v-if="action.入口类型">入口 {{ action.入口类型 }}</span>
                  <span v-if="action.线索ID">线索 {{ action.线索ID }}</span>
                </div>
                <p v-if="action.AI短提示" class="debug-pending-hint">{{ action.AI短提示 }}</p>
              </article>
            </div>
          </section>
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
          <section class="debug-runtime" aria-label="牝奴期运行">
            <div class="debug-section-title">牝奴期运行</div>
            <div class="debug-row debug-row--meta">
              <span class="debug-chip">当前日课 {{ store.data.牝奴.当前日课 || '候命' }}</span>
              <span class="debug-chip">支配者 {{ store.data.牝奴.当前支配者 || '无' }}</span>
              <span class="debug-chip">今日调教 {{ store.data.牝奴.今日调教次数 || 0 }}</span>
            </div>
            <div class="debug-row">
              <label class="debug-label">牝印命令</label>
              <input v-model="store.data.牝奴.当前命令" type="text" class="debug-input" />
              <span class="debug-runtime-value">{{ store.data.牝奴.当前命令 || '无' }}</span>
            </div>
            <div class="debug-row">
              <label class="debug-label">命令强度</label>
              <input v-model.number="store.data.牝奴.命令强度" type="range" min="0" max="100" class="debug-range" />
              <span class="debug-range-value">{{ store.data.牝奴.命令强度 || 0 }}</span>
            </div>
            <div class="debug-row">
              <label class="debug-label">最近结算</label>
              <input v-model="store.data.牝奴.最近调教结算" type="text" class="debug-input" />
              <span class="debug-runtime-value">{{ store.data.牝奴.最近调教结算 || '无' }}</span>
            </div>
            <div class="debug-row">
              <label class="debug-label">羞名标签</label>
              <input v-model="shameTagsText" type="text" class="debug-input" />
              <span class="debug-runtime-value">{{ shameTagsText || '无' }}</span>
            </div>

            <div class="debug-section-title debug-section-title--sub">最近调教记录</div>
            <div v-if="recentTrainingRecords.length === 0" class="debug-event-empty">调教记录为空</div>
            <div v-else class="debug-pending-list debug-pending-list--compact">
              <article v-for="record in recentTrainingRecords" :key="record.id || record.摘要" class="debug-pending-item">
                <div class="debug-pending-head">
                  <span class="debug-pending-type">{{ record.支配者 || '无支配者' }}</span>
                  <span>{{ record.时辰 || '晨时' }}</span>
                  <span>{{ record.羞名等级 || '微闻' }}</span>
                </div>
                <p class="debug-pending-hint">{{ record.摘要 || '无摘要' }}</p>
              </article>
            </div>

            <div class="debug-section-title debug-section-title--sub">P2风声 {{ p2Rumors.length }}</div>
            <div v-if="p2Rumors.length === 0" class="debug-event-empty">P2风声为空</div>
            <div v-else class="debug-pending-list debug-pending-list--compact">
              <article v-for="rumor in p2Rumors" :key="rumor.id || rumor.风声文本" class="debug-pending-item">
                <div class="debug-pending-head">
                  <span class="debug-pending-type">{{ rumor.来源 || 'P2风声' }}</span>
                  <span>{{ rumor.羞名等级 || '微闻' }}</span>
                  <span>{{ rumor.凝视来源 || '未知凝视' }}</span>
                  <span>{{ rumor.地点 || '莲灯前苑' }}</span>
                </div>
                <div class="debug-pending-fields">
                  <span v-if="rumor.id">风声 {{ rumor.id }}</span>
                  <span v-if="rumor.反噬日课">日课 {{ rumor.反噬日课 }}</span>
                  <span>承接 {{ rumor.是否可承接 ? '是' : '否' }}</span>
                </div>
                <p class="debug-pending-hint">{{ rumor.风声文本 || '无风声文本' }}</p>
              </article>
            </div>
          </section>
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
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive } from 'vue';
import { useDataStore } from '../store';
import { useDebug } from '../composables/useDebug';

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;
type NpcName = (typeof NPC列表)[number];
const NPC_SET = new Set<string>(NPC列表);

const store = useDataStore();
const debug = useDebug();
const panelPosition = reactive({ x: 16, y: 72 });
const dragState = reactive({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });

type DebugPendingAction = {
  类型?: string;
  目标?: string;
  道具?: string;
  数量?: number;
  时辰?: string;
  场景?: string;
  地点?: string;
  子区域?: string;
  风声ID?: string;
  故事钩子?: string;
  道具显示名?: string;
  器阶?: string;
  作用部位?: string;
  丹药分类?: string;
  作用线?: string;
  剧情线?: string;
  关联NPC?: string;
  秘密主题?: string;
  入口类型?: string;
  线索ID?: string;
  AI短提示?: string;
};

type DebugEventRecord = {
  id?: string;
  类型?: string;
  摘要?: string;
  日?: number;
  时辰?: string;
  地点?: string;
};

type DebugTrainingRecord = {
  id?: string;
  时辰?: string;
  支配者?: string;
  摘要?: string;
  羞名等级?: string;
};

type DebugRumorRecord = {
  id?: string;
  来源?: string;
  地点?: string;
  风声文本?: string;
  状态?: string;
  凝视来源?: string;
  羞名等级?: string;
  羞名标签?: string[];
  反噬日课?: string;
  是否可承接?: boolean;
};

const P2_RUMOR_SOURCES = new Set(['牝奴日课', '牝印命令', '调教余波', '宗门闲谈', '公开示众', '支配者传唤']);

const panelStyle = computed(() => ({
  position: 'fixed',
  left: `${panelPosition.x}px`,
  top: `${panelPosition.y}px`,
}));

const pendingActions = computed(() => {
  ensureDebugShape();
  return store.data.系统.待处理交互 as DebugPendingAction[];
});

const recentEventRecords = computed(() => {
  ensureDebugShape();
  return ((store.data.剧情 as any).事件记录 as DebugEventRecord[]).slice(-5).reverse();
});

const recentTrainingRecords = computed(() => {
  ensureDebugShape();
  return ((store.data.牝奴 as any).调教记录 as DebugTrainingRecord[]).slice(-5).reverse();
});

const p2Rumors = computed(() => {
  ensureDebugShape();
  return ((store.data.系统 as any).风声列表 as DebugRumorRecord[])
    .filter(rumor => P2_RUMOR_SOURCES.has(rumor.来源 ?? '') && rumor.状态 !== '已失效')
    .slice(0, 3);
});

function getViewportLimit() {
  const width = typeof window === 'undefined' ? 1024 : window.innerWidth || 1024;
  const height = typeof window === 'undefined' ? 768 : window.innerHeight || 768;
  return {
    maxX: Math.max(0, width - 280),
    maxY: Math.max(0, height - 120),
  };
}

function clampPanelPosition(x: number, y: number) {
  const { maxX, maxY } = getViewportLimit();
  panelPosition.x = Math.min(Math.max(0, x), maxX);
  panelPosition.y = Math.min(Math.max(0, y), maxY);
}

function startDrag(event: MouseEvent) {
  dragState.active = true;
  dragState.startX = event.clientX;
  dragState.startY = event.clientY;
  dragState.originX = panelPosition.x;
  dragState.originY = panelPosition.y;
  document.addEventListener('mousemove', moveDrag);
  document.addEventListener('mouseup', stopDrag);
}

function moveDrag(event: MouseEvent) {
  if (!dragState.active) return;
  clampPanelPosition(dragState.originX + event.clientX - dragState.startX, dragState.originY + event.clientY - dragState.startY);
}

function stopDrag() {
  dragState.active = false;
  document.removeEventListener('mousemove', moveDrag);
  document.removeEventListener('mouseup', stopDrag);
}

function displayValue(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function displayItem(action: DebugPendingAction) {
  if (action.道具显示名 && action.道具 && action.道具显示名 !== action.道具) return `${action.道具显示名} / ${action.道具}`;
  return action.道具显示名 || action.道具 || '无';
}

function displayScene(action: DebugPendingAction) {
  if (action.地点 && action.场景 && action.地点 !== action.场景) return `${action.地点} / ${action.场景}`;
  return action.地点 || action.场景 || '未指定';
}

function ensureDebugShape() {
  const system = store.data.系统 as any;
  system.时辰 ??= '晨时';
  system.当前场景 ??= '莲灯前苑';
  system.时间状态 ??= {
    当前日: 1,
    时段进度: 0,
    最近耗时: '',
    最近结算原因: '',
    最近事件类型: '',
    是否过夜: false,
  };
  system.时间状态.当前日 ??= 1;
  system.时间状态.时段进度 ??= 0;
  system.时间状态.最近耗时 ??= '';
  system.时间状态.最近结算原因 ??= '';
  system.时间状态.最近事件类型 ??= '';
  system.时间状态.是否过夜 ??= false;
  system.欲海状态 ??= {
    搜寻进度: 0,
    警戒等级: '平静',
    遮蔽剩余时段: 0,
    遮蔽来源: '',
    最近暴露原因: '',
    已被定位: false,
  };
  system.欲海状态.搜寻进度 ??= 0;
  system.欲海状态.警戒等级 ??= '平静';
  system.欲海状态.遮蔽剩余时段 ??= 0;
  system.欲海状态.遮蔽来源 ??= '';
  system.欲海状态.最近暴露原因 ??= '';
  system.欲海状态.已被定位 ??= false;
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
  (store.data.剧情 as any).事件记录 ??= [];
  const phase2 = store.data.牝奴 as any;
  phase2.入场日 ??= 0;
  phase2.当前日课 ??= '候命';
  phase2.当前支配者 ??= '';
  phase2.当前命令 ??= '';
  phase2.命令强度 ??= 0;
  phase2.今日调教次数 ??= 0;
  phase2.待执行日课 ??= [];
  phase2.最近调教结算 ??= '';
  phase2.羞名标签 ??= [];
  phase2.调教记录 ??= [];
}

const shameTagsText = computed({
  get() {
    ensureDebugShape();
    return ((store.data.牝奴 as any).羞名标签 as string[]).join(',');
  },
  set(value: string) {
    ensureDebugShape();
    (store.data.牝奴 as any).羞名标签 = value
      .split(/[，,]/)
      .map(item => item.trim())
      .filter(Boolean)
      .slice(0, 8);
  },
});

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

onBeforeUnmount(() => {
  stopDrag();
});
</script>
<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.debug-panel {
  --debug-text: rgba(246, 238, 224, 0.95);
  --debug-muted: rgba(222, 196, 154, 0.82);
  --debug-field: rgba(242, 202, 126, 0.94);
  --debug-strong: #f1c66b;

  z-index: 9999;
  width: min(380px, calc(100vw - 32px));
  max-height: min(82vh, 720px);
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
  cursor: move;
  user-select: none;

  .debug-title {
    font-family: $font-铭文;
    font-size: 14px;
    color: $铭文赤金;
  }

  .debug-close {
    background: none;
    border: none;
    color: var(--debug-muted);
    cursor: pointer;
    font-size: 14px;

    &:hover {
      color: var(--debug-strong);
    }
  }
}

.debug-section-title {
  font-family: $font-铭文;
  font-size: 11px;
  color: var(--debug-strong);
}

.debug-pending {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  border: 1px solid rgba(212, 160, 23, 0.12);
  background: rgba(0, 0, 0, 0.18);
}

.debug-pending-empty {
  font-size: 11px;
  color: var(--debug-muted);
}

.debug-pending-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;
}

.debug-pending-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 6px;
  border: 1px solid rgba(212, 160, 23, 0.1);
  background: rgba(212, 160, 23, 0.05);
}

.debug-pending-head,
.debug-pending-fields {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}

.debug-pending-index,
.debug-pending-type,
.debug-pending-target,
.debug-pending-fields span {
  display: inline-flex;
  align-items: center;
  padding: 1px 5px;
  border: 1px solid rgba(212, 160, 23, 0.1);
  color: var(--debug-field);
  font-family: $font-等宽;
  font-size: 10px;
}

.debug-pending-type {
  color: var(--debug-strong);
}

.debug-pending-hint {
  margin: 0;
  color: var(--debug-text);
  font-size: 11px;
  line-height: 1.45;
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
    color: var(--debug-muted);
    min-width: 56px;
    flex-shrink: 0;
  }

  .debug-input {
    flex: 1;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(212, 160, 23, 0.15);
    border-radius: $radius-sm;
    color: var(--debug-field);
    padding: 3px 6px;
    font-size: 12px;
    font-family: $font-等宽;
  }

  .debug-select {
    flex: 1;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(212, 160, 23, 0.15);
    border-radius: $radius-sm;
    color: var(--debug-field);
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
    color: var(--debug-field);
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
