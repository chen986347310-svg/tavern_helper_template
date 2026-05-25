// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SystemBar from './SystemBar.vue';

describe('SystemBar', () => {
  describe('攻略期模式', () => {
    const npcList = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;

    it('渲染 5 个太极图标', () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: '攻略期',
          npcList,
          npcStates: {
            白芷: { 状态: '未开始' },
            苏芸: { 状态: '未开始' },
            纪兰: { 状态: '未开始' },
            沈月秋: { 状态: '未开始' },
            柳素衣: { 状态: '未开始' },
          },
        },
      });
      expect(wrapper.findAll('.taiji-icon')).toHaveLength(5);
    });

    it('全未攻略时全蓝', () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: '攻略期',
          npcList,
          npcStates: {
            白芷: { 状态: '未开始' },
            苏芸: { 状态: '未开始' },
            纪兰: { 状态: '未开始' },
            沈月秋: { 状态: '未开始' },
            柳素衣: { 状态: '未开始' },
          },
        },
      });
      const icons = wrapper.findAll('.taiji-icon');
      icons.forEach(icon => expect(icon.classes()).toContain('taiji--unconquered'));
    });

    it('3 个已攻略时 3 粉 2 蓝', () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: '攻略期',
          npcList,
          npcStates: {
            白芷: { 状态: '已完成' },
            苏芸: { 状态: '已完成' },
            纪兰: { 状态: '已完成' },
            沈月秋: { 状态: '未开始' },
            柳素衣: { 状态: '未开始' },
          },
        },
      });
      const conquered = wrapper.findAll('.taiji--conquered');
      const unconquered = wrapper.findAll('.taiji--unconquered');
      expect(conquered).toHaveLength(3);
      expect(unconquered).toHaveLength(2);
    });

    it('全已攻略时全粉', () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: '攻略期',
          npcList,
          npcStates: {
            白芷: { 状态: '已完成' },
            苏芸: { 状态: '已完成' },
            纪兰: { 状态: '已完成' },
            沈月秋: { 状态: '已完成' },
            柳素衣: { 状态: '已完成' },
          },
        },
      });
      const conquered = wrapper.findAll('.taiji--conquered');
      expect(conquered).toHaveLength(5);
    });

    it('图标按攻略链排列', () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: '攻略期',
          npcList,
          npcStates: {
            白芷: { 状态: '未开始' },
            苏芸: { 状态: '未开始' },
            纪兰: { 状态: '未开始' },
            沈月秋: { 状态: '未开始' },
            柳素衣: { 状态: '未开始' },
          },
        },
      });
      const names = wrapper.findAll('.taiji-name').map(w => w.text());
      expect(names).toEqual(['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣']);
    });

    it('包含 SVG 太极图标', () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: '攻略期',
          npcList,
          npcStates: {
            白芷: { 状态: '未开始' },
            苏芸: { 状态: '未开始' },
            纪兰: { 状态: '未开始' },
            沈月秋: { 状态: '未开始' },
            柳素衣: { 状态: '未开始' },
          },
        },
      });
      const svgs = wrapper.findAll('.taiji-svg');
      expect(svgs).toHaveLength(5);
    });


    it('攻略期显示当前时辰', () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: '攻略期',
          npcList,
          npcStates: {
            白芷: { 状态: '未开始' },
            苏芸: { 状态: '未开始' },
            纪兰: { 状态: '未开始' },
            沈月秋: { 状态: '未开始' },
            柳素衣: { 状态: '未开始' },
          },
          时辰: '酉时',
          remainingDays: 30,
          gems: 100,
        },
      });
      expect(wrapper.find('.time-value').text()).toBe('酉时');
      expect(wrapper.find('.time-value').attributes('aria-label')).toBe('当前时辰 酉时');
    });
    it('攻略期有正确的无障碍属性', () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: '攻略期',
          npcList,
          npcStates: {
            白芷: { 状态: '已完成' },
            苏芸: { 状态: '未开始' },
            纪兰: { 状态: '未开始' },
            沈月秋: { 状态: '未开始' },
            柳素衣: { 状态: '未开始' },
          },
        },
      });
      const bar = wrapper.find('.system-bar');
      expect(bar.attributes('role')).toBe('toolbar');
      expect(bar.attributes('aria-label')).toBe('攻略进度状态栏');
      const firstIcon = wrapper.find('.taiji-icon');
      expect(firstIcon.attributes('role')).toBe('img');
      expect(firstIcon.attributes('aria-label')).toContain('已攻略');
    });
  });

  describe('牝奴期模式', () => {
    it('牝奴期沿用状态栏骨架并显示日课、命令与羞名风声', () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: '牝奴期',
          堕落度: 82,
          牝阴决层数: 6,
          时辰: '午时',
          当前日课: '午后点名',
          当前命令: '当众应名',
          命令强度: 88,
          rumorList: [
            {
              id: 'p2-shame-1',
              来源: '公开示众',
              地点: '莲灯前苑',
              风声文本: '有人念起你的羞名。',
              状态: '未读',
              羞名等级: '挂牌',
            },
          ],
        },
      });

      expect(wrapper.find('.system-bar').attributes('data-rumor-active')).toBe('true');
      expect(wrapper.find('.system-bar').classes()).toContain('system-bar--p2');
      expect(wrapper.find('.blossom-bar-wrapper').exists()).toBe(true);
      expect(wrapper.find('.p2-stigma-glyph').text()).toBe('印');
      expect(wrapper.text()).toContain('午时');
      expect(wrapper.text()).toContain('午后点名');
      expect(wrapper.text()).toContain('当众应名');
      expect(wrapper.text()).toContain('6/9');
      expect(wrapper.find('.theme-toggle').classes()).toContain('theme-toggle--p2');
      expect(wrapper.find('.p2-theme-mark').text()).toMatch(/香|绯/);
    });

    it('牝奴期主题按钮会切换根主题并同步按钮状态', async () => {
      const wrapper = mount(SystemBar, {
        props: { mode: '牝奴期', 堕落度: 82 },
      });

      const before = wrapper.find('.theme-toggle').attributes('data-theme-mode');

      await wrapper.find('.theme-toggle').trigger('click');
      await nextTick();

      const after = wrapper.find('.theme-toggle').attributes('data-theme-mode');
      expect(after).not.toBe(before);
      expect(document.documentElement.getAttribute('data-theme')).toBe(after);
      expect(wrapper.find('.p2-theme-mark').text()).toBe(after === 'chenxiang' ? '香' : '绯');
    });

    it('堕落度=0 时血墨条为空', () => {
      const wrapper = mount(SystemBar, {
        props: { mode: '牝奴期', 堕落度: 0 },
      });
      expect(wrapper.find('.blossom-bar-fill').attributes('style')).toContain('width: 0%');
    });

    it('堕落度=40 时血墨条填充40%', () => {
      const wrapper = mount(SystemBar, {
        props: { mode: '牝奴期', 堕落度: 40 },
      });
      expect(wrapper.find('.blossom-bar-fill').attributes('style')).toContain('width: 40%');
    });

    it('堕落度=100 时血墨条填满', () => {
      const wrapper = mount(SystemBar, {
        props: { mode: '牝奴期', 堕落度: 100 },
      });
      expect(wrapper.find('.blossom-bar-fill').attributes('style')).toContain('width: 100%');
    });

    it('条状进度匹配堕落度', () => {
      const wrapper = mount(SystemBar, {
        props: { mode: '牝奴期', 堕落度: 60 },
      });
      expect(wrapper.find('.blossom-bar-fill').attributes('style')).toContain('width: 60%');
    });

    it('显示堕落度百分比', () => {
      const wrapper = mount(SystemBar, {
        props: { mode: '牝奴期', 堕落度: 75 },
      });
      expect(wrapper.find('.blossom-value').text()).toBe('75%');
    });

    it('包含条状堕落度组件而非圆环花瓣', () => {
      const wrapper = mount(SystemBar, {
        props: { mode: '牝奴期', 堕落度: 50 },
      });
      expect(wrapper.find('.blossom-bar-track').exists()).toBe(true);
      expect(wrapper.find('.blossom-ring-svg').exists()).toBe(false);
      expect(wrapper.findAll('.blossom-petal')).toHaveLength(0);
    });

    it('牝奴期有正确的无障碍属性', () => {
      const wrapper = mount(SystemBar, {
        props: { mode: '牝奴期', 堕落度: 50 },
      });
      const bar = wrapper.find('.system-bar');
      expect(bar.attributes('role')).toBe('toolbar');
      expect(bar.attributes('aria-label')).toBe('牝奴堕落状态栏');
      const progress = wrapper.find('.blossom-bar-wrapper');
      expect(progress.attributes('role')).toBe('progressbar');
      expect(progress.attributes('aria-valuenow')).toBe('50');
    });
  });
});
