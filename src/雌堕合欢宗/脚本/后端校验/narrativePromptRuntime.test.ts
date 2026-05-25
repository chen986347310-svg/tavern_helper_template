import { describe, expect, it, vi } from 'vitest';

import { createNarrativePromptRuntime, findStatDataForNarrativePrompt } from './narrativePromptRuntime';

describe('findStatDataForNarrativePrompt', () => {
  it('latest 没有待处理交互时回溯最近含队列的楼层', () => {
    const latest = { 系统: { 阶段: '牝奴期', 待处理交互: [] } };
    const previousWithPending = {
      系统: {
        阶段: '牝奴期',
        待处理交互: [{ 类型: '追查风声', 剧情线: '牝奴羞名', AI短提示: 'P2羞名风声' }],
      },
    };
    const getByMessageId = vi.fn((messageId: number | 'latest') => {
      if (messageId === 'latest' || messageId === -1) return latest;
      if (messageId === -2) return previousWithPending;
      return null;
    });

    const result = findStatDataForNarrativePrompt(getByMessageId);

    expect(result).toBe(previousWithPending);
    expect(getByMessageId).toHaveBeenCalledWith('latest');
    expect(getByMessageId).toHaveBeenCalledWith(-2);
  });

  it('latest 是空用户楼层时回溯最近有效世界运行状态用于 P2 world runtime 注入', () => {
    const latest = {};
    const previousP2Runtime = {
      系统: {
        阶段: '牝奴期',
        当前场景: '阴阳池底',
        待处理交互: [],
        场景上下文: { 地点: '阴阳池', 故事钩子: ['苏芸的羞辱命令'] },
        时间状态: { 最近事件类型: '对话' },
      },
    };
    const getByMessageId = vi.fn((messageId: number | 'latest') => {
      if (messageId === 'latest' || messageId === -1) return latest;
      if (messageId === -2) return previousP2Runtime;
      return null;
    });

    const result = findStatDataForNarrativePrompt(getByMessageId);

    expect(result).toBe(previousP2Runtime);
    expect(getByMessageId).toHaveBeenCalledWith('latest');
    expect(getByMessageId).toHaveBeenCalledWith(-2);
  });
});
describe('createNarrativePromptRuntime', () => {
  it('pending action 非空且无装备时只注入 pending visible 与 scan prompt', () => {
    const uninject = vi.fn();
    const injectPrompts = vi.fn(() => ({ uninject }));
    const uninjectPrompts = vi.fn();
    const getStatData = vi.fn(() => ({ 系统: { 待处理交互: [{ 类型: '购买物品', 目标: '玩家', 道具: '欲海回声' }], 灵石: 2000 } }));

    const runtime = createNarrativePromptRuntime({ getStatData, injectPrompts, uninjectPrompts });
    runtime.refresh();

    expect(injectPrompts).toHaveBeenCalledTimes(1);
    expect(injectPrompts.mock.calls[0][0].map((prompt: { id: string }) => prompt.id)).toEqual([
      'hehuan-pending-action-summary',
      'hehuan-pending-action-scan',
    ]);
  });

  it('存在当前装备时同时注入服装与禁器 prompt', () => {
    const injectPrompts = vi.fn(() => ({ uninject: vi.fn() }));
    const uninjectPrompts = vi.fn();
    const getStatData = vi.fn(() => ({
      系统: { 待处理交互: [], 场景上下文: { 在场NPC: ['白芷'] } },
      道具: { 装备: { 玩家: ['杂役服'], 白芷: ['阴蒂环'] } },
    }));

    const runtime = createNarrativePromptRuntime({ getStatData, injectPrompts, uninjectPrompts });
    runtime.refresh();

    expect(injectPrompts).toHaveBeenCalledTimes(1);
    expect(injectPrompts.mock.calls[0][0].map((prompt: { id: string }) => prompt.id)).toEqual([
      'hehuan-current-outfit-summary',
      'hehuan-current-outfit-scan',
      'hehuan-current-contraband-summary',
      'hehuan-current-contraband-scan',
    ]);
  });

  it('pending action 为空时清理旧 pending prompt 且不注入 pending prompt', () => {
    const injectPrompts = vi.fn(() => ({ uninject: vi.fn() }));
    const uninjectPrompts = vi.fn();
    const runtime = createNarrativePromptRuntime({ getStatData: () => ({ 系统: { 待处理交互: [] } }), injectPrompts, uninjectPrompts });

    runtime.refresh();

    expect(uninjectPrompts).toHaveBeenCalledWith(['hehuan-pending-action-summary', 'hehuan-pending-action-scan']);
    expect(injectPrompts).not.toHaveBeenCalled();
  });

  it('无待处理交互但存在世界运行钩子时注入 world runtime prompt', () => {
    const injectPrompts = vi.fn(() => ({ uninject: vi.fn() }));
    const uninjectPrompts = vi.fn();
    const runtime = createNarrativePromptRuntime({
      getStatData: () => ({
        系统: {
          当前场景: '阴阳池外围',
          待处理交互: [],
          场景上下文: { 地点: '阴阳池', 故事钩子: ['等待酉时苏芸到来'] },
          时间状态: { 最近事件类型: '移动与观察' },
        },
      }),
      injectPrompts,
      uninjectPrompts,
    });

    runtime.refresh('message_sent');

    expect(injectPrompts).toHaveBeenCalledTimes(1);
    expect(injectPrompts.mock.calls[0][0].map((prompt: { id: string }) => prompt.id)).toEqual([
      'hehuan-world-runtime-summary',
      'hehuan-world-runtime-scan',
    ]);
    expect(runtime.getSnapshot()).toMatchObject({
      promptIds: ['hehuan-world-runtime-summary', 'hehuan-world-runtime-scan'],
      hasWorldRuntimePrompt: true,
      injected: true,
    });
  });

  it('clear 会卸载全部叙事注入 id', () => {
    const injectPrompts = vi.fn(() => ({ uninject: vi.fn() }));
    const uninjectPrompts = vi.fn();
    const runtime = createNarrativePromptRuntime({ getStatData: () => ({}), injectPrompts, uninjectPrompts });

    runtime.clear();

    expect(uninjectPrompts).toHaveBeenCalledWith(['hehuan-current-outfit-summary', 'hehuan-current-outfit-scan']);
    expect(uninjectPrompts).toHaveBeenCalledWith(['hehuan-current-contraband-summary', 'hehuan-current-contraband-scan']);
    expect(uninjectPrompts).toHaveBeenCalledWith(['hehuan-pending-action-summary', 'hehuan-pending-action-scan']);
    expect(uninjectPrompts).toHaveBeenCalledWith(['hehuan-world-runtime-summary', 'hehuan-world-runtime-scan']);
  });

  it('records the latest injection snapshot for CDP diagnostics', () => {
    const injectPrompts = vi.fn(() => ({ uninject: vi.fn() }));
    const uninjectPrompts = vi.fn();
    const getStatData = vi.fn(() => ({
      系统: {
        阶段: '牝奴期',
        待处理交互: [{ 类型: '追查风声', 剧情线: '牝奴羞名', AI短提示: 'P2羞名风声' }],
      },
    }));

    const runtime = createNarrativePromptRuntime({ getStatData, injectPrompts, uninjectPrompts });
    runtime.refresh('message_sent');

    expect(runtime.getSnapshot()).toMatchObject({
      reason: 'message_sent',
      pendingCount: 1,
      promptIds: ['hehuan-pending-action-summary', 'hehuan-pending-action-scan'],
      hasP2PendingAction: true,
      injected: true,
    });
  });
});
