// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import BrandTagsPanel from './BrandTagsPanel.vue';
import DailyRoutinePanel from './DailyRoutinePanel.vue';
import DominatorPanel from './DominatorPanel.vue';
import StigmaCore from './StigmaCore.vue';
import WhisperPanel from './WhisperPanel.vue';

const phase2ComponentSources = [
  'src/雌堕合欢宗/界面/components/phase2/StigmaCore.vue',
  'src/雌堕合欢宗/界面/components/phase2/DailyRoutinePanel.vue',
  'src/雌堕合欢宗/界面/components/phase2/DominatorPanel.vue',
  'src/雌堕合欢宗/界面/components/phase2/WhisperPanel.vue',
  'src/雌堕合欢宗/界面/components/phase2/BrandTagsPanel.vue',
].map(path => readFileSync(path, 'utf8'));

describe('P2 master console components', () => {
  it('core panels inherit global P2 tokens so theme toggle can recolor them', () => {
    phase2ComponentSources.forEach(source => {
      expect(source).not.toMatch(/\.p2-[\w-]+\s*\{[\s\S]*?--p2-blood:/);
      expect(source).not.toContain('#c84b5b');
    });
  });

  it('renders stigma core with forced command state', () => {
    const wrapper = mount(StigmaCore, { props: { corruption: 86, yinjueLayer: 6, command: '当众应名', intensity: 88 } });

    expect(wrapper.text()).toContain('强制');
    expect(wrapper.text()).toContain('当众应名');
    expect(wrapper.attributes('data-stigma-state')).toBe('强制');
  });

  it('renders routine ledger without modern task wording', () => {
    const wrapper = mount(DailyRoutinePanel, { props: { routine: '午后点名', count: 3, settlement: '廊下应名一次' } });

    expect(wrapper.text()).toContain('午后点名');
    expect(wrapper.text()).toContain('廊下应名一次');
    expect(wrapper.text()).not.toContain('任务');
    expect(wrapper.text()).not.toContain('通知');
  });

  it('renders routine required gear and missing gear punishment', () => {
    const wrapper = mount(DailyRoutinePanel, {
      props: { routine: '廊前听令', count: 1, settlement: '', equippedItems: [] },
    });

    expect(wrapper.text()).toContain('须扣');
    expect(wrapper.text()).toContain('牝铃');
    expect(wrapper.text()).toContain('听命耳坠');
    expect(wrapper.text()).toContain('违令');
    expect(wrapper.text()).toContain('拒铃迟令');
    expect(wrapper.text()).toContain('廊前三巡听铃课');
  });

  it('renders routine as active when required gear is equipped', () => {
    const wrapper = mount(DailyRoutinePanel, {
      props: { routine: '廊前听令', count: 1, settlement: '', equippedItems: ['牝铃'] },
    });

    expect(wrapper.text()).toContain('受令中');
    expect(wrapper.text()).not.toContain('违令');
  });

  it('renders dominator gaze including Liu special state', () => {
    const wrapper = mount(DominatorPanel, {
      props: { current: '柳素衣', last: '沈月秋', counts: { 白芷: 0, 苏芸: 1, 纪兰: 2, 沈月秋: 3, 柳素衣: 4 } },
    });

    expect(wrapper.text()).toContain('柳素衣');
    expect(wrapper.text()).toContain('静默牵丝');
    expect(wrapper.text()).toContain('沈月秋');
  });

  it('emits chase action for shame rumor', async () => {
    const rumor = {
      id: 'p2-shame-1',
      来源: '公开示众',
      地点: '莲灯前苑',
      风声文本: '有人念起你的羞名。',
      状态: '未读',
      羞名等级: '挂牌',
      故事钩子: '廊下名牌微晃',
    };
    const wrapper = mount(WhisperPanel, { props: { rumors: [rumor] } });

    await wrapper.get('[data-testid="p2-whisper-action"]').trigger('click');

    expect(wrapper.emitted('chase-rumor')?.[0]?.[0]).toMatchObject({ id: 'p2-shame-1', 羞名等级: '挂牌' });
  });

  it('renders brand tags as seal marks', () => {
    const wrapper = mount(BrandTagsPanel, { props: { tags: ['听命', '示众', '候传'] } });

    expect(wrapper.findAll('[data-testid="p2-brand-tag"]')).toHaveLength(3);
    expect(wrapper.text()).toContain('听命');
  });
});
