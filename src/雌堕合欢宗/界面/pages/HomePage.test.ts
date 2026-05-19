// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { ref, reactive } from 'vue';

// Mock the store module before importing component
vi.mock('../store', () => {
  const mockData = reactive({
    系统: { 阶段: '攻略期', 剩余天数: 30, 灵石: 1000, 已使用阵法: false },
    牝奴: { 堕落度: 0, 牝阴决层数: 0, 上次支配者: '', 支配次数: {}, 改造进度: { 泌乳: false, 肛门: false, 憋尿: false } },
    NPC: {
      白芷: { 好感度: 50, 攻略值: 30, 粘滞计数: 1, 状态: '进行中' },
      苏芸: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      纪兰: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      沈月秋: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      柳素衣: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
    },
    道具: { 拥有: {}, 装备: { '玩家': [], '白芷': [], '苏芸': [], '纪兰': [], '沈月秋': [], '柳素衣': [] } },
    场景: { 已解锁: [] },
    剧情: { 已解锁: [] },
  });

  return {
    useDataStore: () => ({ data: mockData }),
    __mockData: mockData,
  };
});

import HomePage from '../pages/HomePage.vue';
import { __mockData as mockData } from '../store';

describe('HomePage 系统状态栏', () => {
  beforeEach(() => {
    // Reset mock data
    mockData.系统.阶段 = '攻略期';
    mockData.系统.剩余天数 = 30;
    mockData.系统.灵石 = 1000;
  });

  it('显示当前阶段', () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    expect(wrapper.find('.badge-text').text()).toBe('攻略期');
  });

  it('显示剩余天数', () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const statValues = wrapper.findAll('.stat-value');
    expect(statValues[0].text()).toBe('30');
  });

  it('显示灵石', () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const statValues = wrapper.findAll('.stat-value');
    expect(statValues[1].text()).toBe('1000');
  });

  it('阶段变化时更新显示', async () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    mockData.系统.阶段 = '牝奴期';
    await flushPromises();
    expect(wrapper.find('.badge-text').text()).toBe('牝奴期');
  });

  it('灵石变化时更新显示', async () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    mockData.系统.灵石 = 5000;
    await flushPromises();
    const statValues = wrapper.findAll('.stat-value');
    expect(statValues[1].text()).toBe('5000');
  });

  it('渲染5个NPC卡片', () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const npcCards = wrapper.findAll('.npc-card');
    expect(npcCards).toHaveLength(5);
  });

  it('NPC卡片显示正确名字', () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const names = wrapper.findAll('.npc-name').map(w => w.text());
    expect(names).toEqual(['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣']);
  });

  it('点击NPC卡片显示详情面板', async () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const firstCard = wrapper.findAll('.npc-card')[0];
    await firstCard.trigger('click');
    expect(wrapper.find('.npc-detail').exists()).toBe(true);
    expect(wrapper.find('.detail-name').text()).toBe('白芷');
  });

  it('再次点击同一NPC隐藏详情面板', async () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const firstCard = wrapper.findAll('.npc-card')[0];
    await firstCard.trigger('click');
    expect(wrapper.find('.npc-detail').exists()).toBe(true);
    await firstCard.trigger('click');
    expect(wrapper.find('.npc-detail').exists()).toBe(false);
  });

  it('点击不同NPC切换详情', async () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    await wrapper.findAll('.npc-card')[0].trigger('click');
    expect(wrapper.find('.detail-name').text()).toBe('白芷');
    await wrapper.findAll('.npc-card')[2].trigger('click');
    expect(wrapper.find('.detail-name').text()).toBe('纪兰');
  });
});
