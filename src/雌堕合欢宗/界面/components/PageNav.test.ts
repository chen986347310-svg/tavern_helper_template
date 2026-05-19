// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PageNav from '../components/PageNav.vue';

describe('PageNav', () => {
  it('渲染4个导航标签', () => {
    const wrapper = mount(PageNav, {
      props: { currentTab: 'home' },
    });
    const buttons = wrapper.findAll('.nav-tab');
    expect(buttons).toHaveLength(4);
  });

  it('显示正确的标签文字', () => {
    const wrapper = mount(PageNav, {
      props: { currentTab: 'home' },
    });
    const labels = wrapper.findAll('.tab-label').map(w => w.text());
    expect(labels).toEqual(['首页', '商城', '背包', '图鉴']);
  });

  it('显示正确的铭文符号', () => {
    const wrapper = mount(PageNav, {
      props: { currentTab: 'home' },
    });
    const glyphs = wrapper.findAll('.tab-glyph').map(w => w.text());
    expect(glyphs).toEqual(['阁', '坊', '囊', '鉴']);
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
