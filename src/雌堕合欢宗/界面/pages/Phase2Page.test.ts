// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { reactive } from 'vue';

const mockData = reactive({
    系统: { 阶段: '牝奴期', 剩余天数: 0, 灵石: 0, 已使用阵法: false },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      上次支配者: '',
      支配次数: {},
      改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
      情欲控制阶段: 1,
    },
    NPC: {
      白芷: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      苏芸: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      纪兰: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      沈月秋: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
      柳素衣: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: '未开始' },
    },
    道具: { 拥有: {}, 装备: { 玩家: [] as string[], 白芷: [] as string[], 苏芸: [] as string[], 纪兰: [] as string[], 沈月秋: [] as string[], 柳素衣: [] as string[] } },
    场景: { 已解锁: [] },
    剧情: { 已解锁: [] },
});

vi.mock('../store', () => ({
  useDataStore: () => ({ data: mockData }),
}));

vi.mock('../styles/_variables.scss', () => ({}));
vi.mock('../styles/_mixins.scss', () => ({}));
vi.mock('../styles/_global.scss', () => ({}));

import Phase2Page from './Phase2Page.vue';
// mockData defined above

describe('Phase2Page', () => {
  beforeEach(() => {
    createPinia();
    // 重置为默认值
    Object.assign(mockData.牝奴, {
      堕落度: 0, 牝阴决层数: 0, 情欲控制阶段: 1,
      改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
    });
    mockData.道具.装备.玩家 = [] as string[];
  });

  describe('堕落阶段描述', () => {
    const cases = [
      { 堕落度: 0, 阶段: '清醒隐忍期' },
      { 堕落度: 25, 阶段: '动摇挣扎期' },
      { 堕落度: 45, 阶段: '本能屈从期' },
      { 堕落度: 65, 阶段: '淫纹发情期' },
      { 堕落度: 85, 阶段: '欲壑难填期' },
      { 堕落度: 95, 阶段: '彻底雌堕期' },
    ];

    cases.forEach(({ 堕落度, 阶段 }) => {
      it(`堕落度=${堕落度} 时显示${阶段}`, () => {
        mockData.牝奴.堕落度 = 堕落度;
        const wrapper = mount(Phase2Page);
        expect(wrapper.find('.stage-title').text()).toBe(阶段);
      });
    });
  });

  describe('改造进度', () => {
    it('默认三项均未完成显示封闭符纹', () => {
      const wrapper = mount(Phase2Page);
      const icons = wrapper.findAll('.transform-item .item-icon');
      expect(icons).toHaveLength(3);
      icons.forEach(icon => expect(icon.text()).toBe('✧'));
    });

    it('泌乳完成后显示绽开符纹', () => {
      mockData.牝奴.改造进度.泌乳 = true;
      const wrapper = mount(Phase2Page);
      const doneItems = wrapper.findAll('.transform-item.done');
      expect(doneItems).toHaveLength(1);
      expect(doneItems[0].find('.item-icon').text()).toBe('✦');
    });
  });

  describe('淫纹视觉', () => {
    it('堕落度<50时不显示淫纹区域', () => {
      mockData.牝奴.堕落度 = 30;
      const wrapper = mount(Phase2Page);
      expect(wrapper.find('.yinwen-section').exists()).toBe(false);
    });

    it('堕落度=50时显示2个淫纹', () => {
      mockData.牝奴.堕落度 = 50;
      const wrapper = mount(Phase2Page);
      expect(wrapper.findAll('.yinwen-mark')).toHaveLength(2);
    });

    it('堕落度=75时显示4个淫纹', () => {
      mockData.牝奴.堕落度 = 75;
      const wrapper = mount(Phase2Page);
      expect(wrapper.findAll('.yinwen-mark')).toHaveLength(4);
    });

    it('堕落度=95时显示5个淫纹', () => {
      mockData.牝奴.堕落度 = 95;
      const wrapper = mount(Phase2Page);
      expect(wrapper.findAll('.yinwen-mark')).toHaveLength(5);
    });
  });

  describe('牝阴决', () => {
    it('显示当前层数/9', () => {
      mockData.牝奴.牝阴决层数 = 5;
      const wrapper = mount(Phase2Page);
      expect(wrapper.find('.yinjue-value').text()).toBe('5/9');
    });
  });

  describe('道具状态', () => {
    it('无装备时显示虚位以待', () => {
      const wrapper = mount(Phase2Page);
      expect(wrapper.find('.item-empty').text()).toContain('虚位以待');
    });

    it('有装备时显示道具列表', () => {
      mockData.道具.装备.玩家 = ['牝印', '牝铃'] as string[];
      const wrapper = mount(Phase2Page);
      const rows = wrapper.findAll('.item-row');
      expect(rows).toHaveLength(2);
    });
  });
});