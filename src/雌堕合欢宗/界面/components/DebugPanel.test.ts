// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { reactive } from 'vue';
import DebugPanel from './DebugPanel.vue';
import { useDebug, __resetDebugState } from '../composables/useDebug';

function createData(灵石 = 0) {
  return reactive({
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石, 已使用阵法: false, 时辰: '晨时', 当前场景: '莲灯前苑', 待处理交互: [], 风声列表: [], 当前追查风声ID: '', 心音回响: [], 当前聚焦心声NPC: '', 场景上下文: { 地点: '莲灯前苑', 子区域: '', 场景来源: '核心地点', 公开度: '公开', 在场NPC: [], NPC活动: {}, 氛围: [], 故事钩子: [], 特殊事件: '' } },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      上次支配者: '',
      支配次数: { 白芷: 0, 苏芸: 0, 纪兰: 0, 沈月秋: 0, 柳素衣: 0 },
      改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
    },
    NPC: {
      白芷: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 心声探测态: '无波动' },
      苏芸: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 心声探测态: '无波动' },
      纪兰: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 心声探测态: '无波动' },
      沈月秋: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 心声探测态: '无波动' },
      柳素衣: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 心声探测态: '无波动' },
    },
    道具: { 拥有: {}, 装备: { 玩家: [], 白芷: [], 苏芸: [], 纪兰: [], 沈月秋: [], 柳素衣: [] }, 已生效效果: [] },
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

  it('提供 v4 场景上下文调试能力并能设置在场 NPC', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    expect(document.body.textContent).toContain('当前场景');
    expect(document.body.textContent).toContain('在场NPC');
    const presentInput = Array.from(document.body.querySelectorAll<HTMLInputElement>('.debug-input')).find(input => input.placeholder === '白芷,苏芸');
    expect(presentInput).toBeTruthy();
    presentInput!.value = '白芷,苏芸';
    presentInput!.dispatchEvent(new Event('input'));
    await flushPromises();

    expect(mockStore.data.系统.场景上下文.在场NPC).toEqual(['白芷', '苏芸']);
    wrapper.unmount();
  });

  it('调试按钮能生成测试场景并追加 NPC 心音回响', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    const buttons = Array.from(document.body.querySelectorAll<HTMLButtonElement>('.debug-mini-btn'));
    buttons.find(button => button.textContent === '生成测试场景')!.click();
    await flushPromises();
    expect(mockStore.data.系统.当前场景).toBe('调试幻境');
    expect(mockStore.data.系统.场景上下文.在场NPC).toEqual(['白芷', '苏芸']);

    buttons.find(button => button.textContent === '追加心音')!.click();
    await flushPromises();
    expect(mockStore.data.NPC.白芷.soul_whisper?.is_revealed).toBe(true);
    expect(mockStore.data.NPC.白芷.心声探测态).toBe('已捕获');
    expect(mockStore.data.系统.当前聚焦心声NPC).toBe('白芷');
    expect(mockStore.data.系统.心音回响).toHaveLength(1);
    expect(mockStore.data.系统.心音回响[0]?.npc).toBe('白芷');
    expect(mockStore.data.NPC.白芷.状态).toBe('进行中');
    wrapper.unmount();
  });


  it('注入反震：设置心声探测态为反震并写入反震心音回响', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    const buttons = Array.from(document.body.querySelectorAll<HTMLButtonElement>('.debug-mini-btn'));
    buttons.find(button => button.textContent === '注入反震')!.click();
    await flushPromises();

    expect(mockStore.data.NPC.白芷.心声探测态).toBe('反震');
    expect(mockStore.data.NPC.白芷.soul_whisper?.is_revealed).toBe(false);
    expect(mockStore.data.系统.心音回响).toHaveLength(1);
    expect(mockStore.data.系统.心音回响[0]?.result).toBe('反震');
    expect(mockStore.data.系统.心音回响[0]?.npc).toBe('白芷');
    wrapper.unmount();
  });

  it('注入锁闭：设置心声探测态为锁闭并写入锁闭心音回响', async () => {
    const debug = useDebug();
    debug.toggle();
    const wrapper = mount(DebugPanel, { attachTo: document.body });
    await flushPromises();

    const buttons = Array.from(document.body.querySelectorAll<HTMLButtonElement>('.debug-mini-btn'));
    buttons.find(button => button.textContent === '注入锁闭')!.click();
    await flushPromises();

    expect(mockStore.data.NPC.白芷.心声探测态).toBe('锁闭');
    expect(mockStore.data.NPC.白芷.soul_whisper?.is_revealed).toBe(false);
    expect(mockStore.data.系统.心音回响).toHaveLength(1);
    expect(mockStore.data.系统.心音回响[0]?.result).toBe('锁闭');
    expect(mockStore.data.系统.当前聚焦心声NPC).toBe('白芷');
    wrapper.unmount();
  });
});