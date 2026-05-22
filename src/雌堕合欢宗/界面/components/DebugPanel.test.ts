// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { reactive } from 'vue';
import DebugPanel from './DebugPanel.vue';
import { useDebug, __resetDebugState } from '../composables/useDebug';

function createData(灵石 = 0) {
  return reactive({
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石, 已使用阵法: false, 时辰: '晨时', 当前场景: '莲灯前苑', 待处理交互: [] },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      上次支配者: '',
      支配次数: { 白芷: 0, 苏芸: 0, 纪兰: 0, 沈月秋: 0, 柳素衣: 0 },
      改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
    },
    NPC: {
      白芷: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      苏芸: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      纪兰: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      沈月秋: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      柳素衣: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
    },
    道具: { 拥有: {}, 装备: { 玩家: [], 白芷: [], 苏芸: [], 纪兰: [], 沈月秋: [], 柳素衣: [] } },
    场景: { 已解锁: [] },
    剧情: { 已解锁: [] },
  });
}

const mockStore = reactive({ data: createData(1000) });

vi.mock('../store', () => ({
  useDataStore: () => mockStore,
}));

describe('DebugPanel', () => {
  beforeEach(() => {
    __resetDebugState();
    mockStore.data = createData(1000) as typeof mockStore.data;
    document.body.innerHTML = '';
  });

  it('MVU轮询替换data后，灵石输入仍写入最新store.data', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    const oldData = mockStore.data;
    mockStore.data = createData(0) as typeof mockStore.data;
    await flushPromises();

    const inputs = document.body.querySelectorAll<HTMLInputElement>('.debug-input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
    inputs[1].value = '7777';
    inputs[1].dispatchEvent(new Event('input'));
    await flushPromises();

    expect(mockStore.data.系统.灵石).toBe(7777);
    expect(oldData.系统.灵石).toBe(1000);
    wrapper.unmount();
  });
});