// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { reactive } from 'vue';

const mockData = reactive({
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石: 1000, 已使用阵法: false, 时辰: '午时', 当前场景: '醉玉小筑', 待处理交互: [] as any[] },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      上次支配者: '',
      支配次数: {},
      改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
    },
    NPC: {
      白芷: { 好感度: 50, 攻略值: 30, 粘滞计数: 1, 状态: '进行中', 当前场景: '醉玉小筑' },
      苏芸: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '醉玉小筑' },
      纪兰: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' },
      沈月秋: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '绮梦幽阁' },
      柳素衣: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' },
    },
    道具: { 拥有: {}, 装备: { 玩家: [], 白芷: [], 苏芸: [], 纪兰: [], 沈月秋: [], 柳素衣: [] } },
    场景: { 已解锁: [] },
    剧情: { 已解锁: [] },
  })

vi.mock('../store', () => ({
  useDataStore: () => ({ data: mockData }),
}));



import HomePage from '../pages/HomePage.vue';

describe('HomePage', () => {
  beforeEach(() => {
    mockData.系统.阶段 = '攻略期';
    mockData.系统.剩余天数 = 30;
    mockData.系统.灵石 = 1000;
    mockData.系统.时辰 = '午时';
    mockData.系统.当前场景 = '醉玉小筑';
    mockData.系统.待处理交互 = [];
    // 重置 NPC 状态
    mockData.NPC.白芷 = { 好感度: 50, 攻略值: 30, 粘滞计数: 1, 状态: '进行中', 当前场景: '醉玉小筑' };
    mockData.NPC.苏芸 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '醉玉小筑' };
    mockData.NPC.纪兰 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' };
    mockData.NPC.沈月秋 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '绮梦幽阁' };
    mockData.NPC.柳素衣 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始', 当前场景: '莲灯前苑' };
  });

  // SystemBar 相关断言已迁移至 App.test.ts（当前 SystemBar 由 App.vue 渲染）

  it('默认只渲染当前场景NPC卡片', () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const npcCards = wrapper.findAll('.npc-strip');
    expect(npcCards).toHaveLength(2);
  });

  it('NPC卡片显示正确名字', () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const names = wrapper.findAll('.strip-name').map(w => w.text());
    expect(names).toEqual(['白芷', '苏芸']);
  });

  it('点击进行中卡片展开', async () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll('.npc-strip');
    await cards[0].trigger('click');
    await flushPromises();
    expect(wrapper.findAll('.npc-strip')[0].classes()).toContain('expanded');
  });

  it('再次点击同一卡片收起', async () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll('.npc-strip');
    await cards[0].trigger('click');
    await flushPromises();
    await cards[0].trigger('click');
    await flushPromises();
    expect(wrapper.findAll('.npc-strip')[0].classes()).not.toContain('expanded');
  });

  it('点击不同卡片切换展开', async () => {
    // 设两个进行中卡片以测试切换
    mockData.NPC.苏芸.状态 = '进行中';
    mockData.NPC.苏芸.当前场景 = '醉玉小筑';
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll('.npc-strip');
    await cards[0].trigger('click');
    await flushPromises();
    expect(wrapper.findAll('.npc-strip')[0].classes()).toContain('expanded');
    await cards[1].trigger('click');
    await flushPromises();
    expect(wrapper.findAll('.npc-strip')[0].classes()).not.toContain('expanded');
    expect(wrapper.findAll('.npc-strip')[1].classes()).toContain('expanded');
  });

  it('同时只有一个卡片展开', async () => {
    mockData.NPC.苏芸.状态 = '进行中';
    mockData.NPC.苏芸.当前场景 = '醉玉小筑';
    mockData.NPC.纪兰.状态 = '已完成';
    mockData.NPC.纪兰.当前场景 = '醉玉小筑';
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll('.npc-strip');
    await cards[0].trigger('click');
    await flushPromises();
    await cards[1].trigger('click');
    await flushPromises();
    await cards[2].trigger('click');
    await flushPromises();
    const expandedCount = wrapper.findAll('.npc-strip.expanded').length;
    expect(expandedCount).toBeLessThanOrEqual(1);
  });

  // 全部完成时太极图标全粉 已迁移至 App.test.ts（断言依赖 App 层 SystemBar）

  it('未开始卡片有 locked class', () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll('.npc-strip');
    // 苏芸是未开始
    expect(cards[1].classes()).toContain('locked');
  });

  it('currentScene 属性切换NPC列表且不写入待处理交互', async () => {
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    expect(wrapper.findAll('.strip-name').map(w => w.text())).toEqual(['白芷', '苏芸']);

    await wrapper.setProps({ currentScene: '莲灯前苑' });
    await flushPromises();

    expect(wrapper.findAll('.strip-name').map(w => w.text())).toEqual(['纪兰', '柳素衣']);
    expect(mockData.系统.待处理交互).toEqual([]);
  });

  it('当前场景无NPC时显示氛围留白文案', async () => {
    mockData.NPC.沈月秋.当前场景 = '莲灯前苑';
    const wrapper = mount(HomePage, { props: { currentScene: '绮梦幽阁' }, global: { plugins: [createPinia()] } });

    expect(wrapper.findAll('.npc-strip')).toHaveLength(0);
    expect(wrapper.find('.scene-empty').text()).toContain('幽阁灯火低垂');
  });
  it('点击命轮区记录灵识窃取并等待下一楼层处理', async () => {
    const generateSpy = vi.fn();
    (globalThis as any).generate = generateSpy;
    const wrapper = mount(HomePage, { props: { currentScene: '醉玉小筑' }, global: { plugins: [createPinia()] } });
    await wrapper.find('.dual-ring-panel').trigger('click');
    await flushPromises();
    expect(mockData.系统.待处理交互).toEqual([
      { 类型: '灵识窃取', 目标: '白芷', 道具: '', 数量: 1, 时辰: '午时', 场景: '醉玉小筑' },
    ]);
    expect(generateSpy).not.toHaveBeenCalled();
    delete (globalThis as any).generate;
  });
});
