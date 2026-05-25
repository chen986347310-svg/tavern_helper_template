// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PageNav from '../components/PageNav.vue';

const pageNavSource = readFileSync('src/雌堕合欢宗/界面/components/PageNav.vue', 'utf8');

describe('PageNav', () => {
  it('渲染4个导航标签', () => {
    const wrapper = mount(PageNav, {
      props: { currentTab: 'home' },
    });
    const buttons = wrapper.findAll('.nav-tab');
    expect(buttons).toHaveLength(4);
  });

  it('通过 aria-label 保留语义标签且不渲染现代文字', () => {
    const wrapper = mount(PageNav, {
      props: { currentTab: 'home' },
    });
    const labels = wrapper.findAll('.nav-tab').map(w => w.attributes('aria-label'));
    expect(labels).toEqual(['首页', '商城', '背包', '图鉴']);
    expect(wrapper.findAll('.tab-label')).toHaveLength(0);
  });

  it('牝奴期替换功能区语义但保留原路由 key', async () => {
    const wrapper = mount(PageNav, {
      props: { currentTab: 'home', phase: '牝奴期' },
    });

    const labels = wrapper.findAll('.nav-tab').map(w => w.attributes('aria-label'));
    expect(labels).toEqual(['牝印', '执事库', '法器匣', '烙名录']);
    expect(wrapper.find('.page-nav').attributes('data-phase')).toBe('牝奴期');

    await wrapper.findAll('.nav-tab')[1].trigger('click');
    expect(wrapper.emitted('change')![0]).toEqual(['shop']);
  });

  it('牝奴期导航样式读取全局 P2 token，而不是写死旧色值', () => {
    expect(pageNavSource).toContain('var(--p2-blood)');
    expect(pageNavSource).toContain('var(--p2-gold)');
    expect(pageNavSource).not.toContain('#c84b5b');
  });

  it('牝奴期使用专属 P2 图标，不复用攻略期图标', () => {
    const wrapper = mount(PageNav, {
      props: { currentTab: 'home', phase: '牝奴期' },
    });
    expect(wrapper.findAll('.p2-tab-icon')).toHaveLength(4);
    expect(wrapper.findAll('.tab-icon')).toHaveLength(4);
  });

  it('使用 SVG 铭文图标而非文本符号', () => {
    const wrapper = mount(PageNav, {
      props: { currentTab: 'home' },
    });
    expect(wrapper.findAll('.tab-icon')).toHaveLength(4);
    expect(wrapper.findAll('.tab-glyph')).toHaveLength(0);
  });

  it('当前标签高亮 (active class)', () => {
    const wrapper = mount(PageNav, {
      props: { currentTab: 'shop' },
    });
    const buttons = wrapper.findAll('.nav-tab');
    expect(buttons[0].classes()).not.toContain('active');
    expect(buttons[1].classes()).toContain('active');
    expect(buttons[2].classes()).not.toContain('active');
    expect(buttons[3].classes()).not.toContain('active');
  });

  it('点击标签触发 change 事件', async () => {
    const wrapper = mount(PageNav, {
      props: { currentTab: 'home' },
    });
    await wrapper.findAll('.nav-tab')[2].trigger('click');
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('change')![0]).toEqual(['backpack']);
  });

  it('点击当前标签仍触发事件', async () => {
    const wrapper = mount(PageNav, {
      props: { currentTab: 'home' },
    });
    await wrapper.findAll('.nav-tab')[0].trigger('click');
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('change')![0]).toEqual(['home']);
  });
});
