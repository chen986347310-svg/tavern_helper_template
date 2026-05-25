// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { reactive } from 'vue';

const mockData = reactive({
    系统: {
      阶段: '牝奴期',
      剩余天数: 0,
      灵石: 0,
      已使用阵法: false,
      时辰: '午时',
      当前场景: '莲灯前苑',
      当前追查风声ID: '',
      待处理交互: [] as any[],
      风声列表: [] as any[],
      场景上下文: {
        地点: '莲灯前苑',
        子区域: '',
        场景来源: '核心地点',
        公开度: '公开',
        在场NPC: [] as string[],
        NPC活动: {},
        氛围: [] as string[],
        故事钩子: [] as string[],
        特殊事件: '',
      },
    },
    牝奴: {
      堕落度: 0,
      牝阴决层数: 0,
      上次支配者: '',
      支配次数: {},
      当前日课: '候命',
      当前支配者: '',
      当前命令: '',
      命令强度: 0,
      今日调教次数: 0,
      最近调教结算: '',
      羞名标签: [] as string[],
      调教记录: [] as any[],
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
    Object.assign(mockData.系统, {
      阶段: '牝奴期',
      剩余天数: 0,
      灵石: 0,
      已使用阵法: false,
      时辰: '午时',
      当前场景: '莲灯前苑',
      当前追查风声ID: '',
      待处理交互: [],
      风声列表: [],
      场景上下文: {
        地点: '莲灯前苑',
        子区域: '',
        场景来源: '核心地点',
        公开度: '公开',
        在场NPC: [] as string[],
        NPC活动: {},
        氛围: [] as string[],
        故事钩子: [] as string[],
        特殊事件: '',
      },
    });
    Object.assign(mockData.牝奴, {
      堕落度: 0, 牝阴决层数: 0, 情欲控制阶段: 1,
      上次支配者: '', 支配次数: {},
      当前日课: '候命', 当前支配者: '', 当前命令: '', 命令强度: 0,
      今日调教次数: 0, 最近调教结算: '', 羞名标签: [], 调教记录: [],
      改造进度: { 泌乳: false, 肛门: false, 憋尿: false },
    });
    mockData.道具.装备.玩家 = [] as string[];
  });

  describe('牝奴期主控台', () => {
    it('组装牝印核心、日课、支配者、羞名风声与旧信息', () => {
      Object.assign(mockData.系统, {
        风声列表: [
          {
            id: 'p2-shame-1',
            来源: '公开示众',
            地点: '莲灯前苑',
            风声文本: '有人念起你的羞名。',
            状态: '未读',
            羞名等级: '挂牌',
            故事钩子: '廊下名牌微晃',
          },
        ],
      });
      Object.assign(mockData.牝奴, {
        堕落度: 86,
        牝阴决层数: 6,
        当前日课: '午后点名',
        当前支配者: '柳素衣',
        当前命令: '当众应名',
        命令强度: 88,
        今日调教次数: 3,
        最近调教结算: '廊下应名一次',
        羞名标签: ['听命', '示众'],
        上次支配者: '沈月秋',
        支配次数: { 白芷: 0, 苏芸: 1, 纪兰: 2, 沈月秋: 3, 柳素衣: 4 },
      });

      const wrapper = mount(Phase2Page);

      expect(wrapper.text()).toContain('强制');
      expect(wrapper.text()).toContain('当众应名');
      expect(wrapper.text()).toContain('午后点名');
      expect(wrapper.text()).toContain('柳素衣');
      expect(wrapper.text()).toContain('有人念起你的羞名');
      expect(wrapper.text()).toContain('听命');
      expect(wrapper.text()).toContain('身躯改塑');
      expect(wrapper.text()).toContain('牝阴决');
    });

    it('点击羞名风声后写入待处理交互队列', async () => {
      Object.assign(mockData.系统, {
        当前场景: '莲灯前苑',
        场景上下文: {
          地点: '莲灯前苑',
          子区域: '',
          场景来源: '核心地点',
          公开度: '公开',
          在场NPC: ['柳素衣'],
          NPC活动: {},
          氛围: [],
          故事钩子: [],
          特殊事件: '',
        },
        风声列表: [
          {
            id: 'p2-shame-1',
            来源: '公开示众',
            地点: '莲灯前苑',
            风声文本: '有人念起你的羞名。',
            状态: '未读',
            羞名等级: '挂牌',
            故事钩子: '廊下名牌微晃',
          },
        ],
      });
      Object.assign(mockData.牝奴, { 当前支配者: '柳素衣' });

      const wrapper = mount(Phase2Page);

      await wrapper.get('[data-testid="p2-whisper-action"]').trigger('click');

      expect(mockData.系统.待处理交互.at(-1)).toMatchObject({
        类型: '追查风声',
        目标: '玩家',
        风声ID: 'p2-shame-1',
        剧情线: '牝奴羞名',
        入口类型: '特殊事件',
        AI短提示: expect.stringContaining('P2羞名风声'),
      });
      expect(mockData.系统.当前追查风声ID).toBe('p2-shame-1');
    });
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
    it('默认按改造谱系渲染三项未完成状态', () => {
      const wrapper = mount(Phase2Page);
      const items = wrapper.findAll('.transform-item');
      expect(items).toHaveLength(3);
      expect(items.map(item => item.find('.item-label').text())).toEqual(['乳泉', '后庭', '禁溺']);
      expect(items.map(item => item.find('.item-trace').text())).toEqual(['未启', '未驯', '未锁']);
      expect(wrapper.findAll('.transform-item.done')).toHaveLength(0);
    });

    it('泌乳完成后点亮对应改造谱系', () => {
      mockData.牝奴.改造进度.泌乳 = true;
      const wrapper = mount(Phase2Page);
      const doneItems = wrapper.findAll('.transform-item.done');
      expect(doneItems).toHaveLength(1);
      expect(doneItems[0].find('.item-icon').text()).toBe('沁');
      expect(doneItems[0].find('.item-label').text()).toBe('乳泉');
      expect(doneItems[0].find('.item-trace').text()).toBe('已醒');
    });
  });

  describe('淫纹视觉', () => {
    it('堕落度<50时不显示淫纹区域', () => {
      mockData.牝奴.堕落度 = 30;
      const wrapper = mount(Phase2Page);
      expect(wrapper.find('.yinwen-section').exists()).toBe(false);
    });

    it('堕落度=50时点亮2段淫纹图腾', () => {
      mockData.牝奴.堕落度 = 50;
      const wrapper = mount(Phase2Page);
      expect(wrapper.findAll('.yinwen-piece')).toHaveLength(5);
      expect(wrapper.findAll('.yinwen-piece.active')).toHaveLength(2);
      expect(wrapper.find('.yinwen-label').text()).toBe('淫纹初醒');
    });

    it('堕落度=75时点亮4段淫纹图腾', () => {
      mockData.牝奴.堕落度 = 75;
      const wrapper = mount(Phase2Page);
      expect(wrapper.findAll('.yinwen-piece')).toHaveLength(5);
      expect(wrapper.findAll('.yinwen-piece.active')).toHaveLength(4);
      expect(wrapper.find('.yinwen-label').text()).toBe('淫纹成阵');
    });

    it('堕落度=95时点亮完整淫纹图腾', () => {
      mockData.牝奴.堕落度 = 95;
      const wrapper = mount(Phase2Page);
      expect(wrapper.findAll('.yinwen-piece')).toHaveLength(5);
      expect(wrapper.findAll('.yinwen-piece.active')).toHaveLength(5);
      expect(wrapper.find('.yinwen-label').text()).toBe('淫纹满绽');
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
      expect(wrapper.find('.item-count').text()).toBe('已佩 2');
    });
  });
});
