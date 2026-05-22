// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NpcDetail from './NpcDetail.vue';

function createNpcData(overrides: Partial<{ 好感度: number; 攻略值: number; 粘滞计数: number; 状态: string }> = {}) {
  return {
    好感度: 0,
    攻略值: 0,
    粘滞计数: 0,
    状态: '未开始' as string,
    ...overrides,
  };
}

describe('NpcDetail', () => {
  it('显示NPC名号', () => {
    const wrapper = mount(NpcDetail, {
      props: { npc名: '柳素衣', data: createNpcData() },
    });
    expect(wrapper.find('.detail-name').text()).toBe('柳素衣');
  });

  it('显示灵犀状态语', () => {
    const wrapper = mount(NpcDetail, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 80 }) },
    });
    expect(wrapper.find('.bar-value').text()).toBe('灵犀相照');
  });

  it('好感度进度条宽度匹配', () => {
    const wrapper = mount(NpcDetail, {
      props: { npc名: '白芷', data: createNpcData({ 好感度: 65 }) },
    });
    const favorBar = wrapper.find('.bar-fill.favor');
    expect(favorBar.attributes('style')).toContain('width: 65%');
  });

  it('攻略值进度条宽度匹配', () => {
    const wrapper = mount(NpcDetail, {
      props: { npc名: '白芷', data: createNpcData({ 攻略值: 40 }) },
    });
    const progressBar = wrapper.find('.bar-fill.progress');
    expect(progressBar.attributes('style')).toContain('width: 40%');
  });

  it('显示粘滞计数', () => {
    const wrapper = mount(NpcDetail, {
      props: { npc名: '白芷', data: createNpcData({ 粘滞计数: 2 }) },
    });
    expect(wrapper.find('.value-num').text()).toBe('2');
  });

  it('显示状态文字', () => {
    const wrapper = mount(NpcDetail, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '进行中' }) },
    });
    expect(wrapper.find('.status-badge').text()).toContain('进行中');
  });

  it('状态=未开始 → 对应CSS类', () => {
    const wrapper = mount(NpcDetail, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '未开始' }) },
    });
    expect(wrapper.find('.status-badge').classes()).toContain('未开始');
  });

  it('状态=已完成 → 对应CSS类', () => {
    const wrapper = mount(NpcDetail, {
      props: { npc名: '白芷', data: createNpcData({ 状态: '已完成' }) },
    });
    expect(wrapper.find('.status-badge').classes()).toContain('已完成');
  });

  it('4个属性行全部渲染', () => {
    const wrapper = mount(NpcDetail, {
      props: { npc名: '白芷', data: createNpcData() },
    });
    const rows = wrapper.findAll('.detail-row');
    expect(rows).toHaveLength(4); // 好感度、攻略值、粘滞计数、状态
  });

  it('标签文字正确', () => {
    const wrapper = mount(NpcDetail, {
      props: { npc名: '白芷', data: createNpcData() },
    });
    const labels = wrapper.findAll('.label-text').map(w => w.text());
    expect(labels).toEqual(['好感度', '攻略值', '粘滞计数', '状态']);
  });
});
