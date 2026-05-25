import { describe, expect, it } from 'vitest';
import { applySanitizedCommandFallback, sanitizeMvuCommands } from './mvuCommandSanitizer';

function command(type: string, path: string, value = 'null') {
  return {
    type,
    full_match: `${type}:${path}`,
    args: [path, value],
    reason: 'test',
  } as any;
}

function appendCommand(path: string, value: string) {
  return {
    type: 'add',
    full_match: `append:${path}`,
    args: [`${path}/-`, value],
    reason: 'test',
  } as any;
}

describe('sanitizeMvuCommands', () => {
  it('removes unsafe insert and add commands produced by the extra variable parser', () => {
    const commands = [
      command('set', '/系统/待处理交互', '[]'),
      command('set', '/系统/当前追查风声ID', '""'),
      command('insert', '/系统/剩余天数', '-1'),
      command('add', '/系统/剩余天数', '-1'),
    ];

    const diagnostics = sanitizeMvuCommands(commands);

    expect(commands.map(item => item.type)).toEqual(['set', 'set']);
    expect(diagnostics.dropped).toBe(2);
    expect(diagnostics.droppedCommands.map(item => item.type)).toEqual(['insert', 'add']);
  });

  it('keeps the richer critical path update and drops weaker duplicate writes', () => {
    const commands = [
      command('set', '/系统/待处理交互', '[]'),
      command('set', '/系统/时间状态', 'null'),
      command('set', '/系统/时间状态', 'null'),
      command('set', '/牝奴/当前日课', 'null'),
      command('set', '/牝奴/当前日课', '"公开凝视"'),
    ];

    const diagnostics = sanitizeMvuCommands(commands);

    expect(commands.map(item => item.args[0])).toEqual([
      '/系统/待处理交互',
      '/系统/时间状态',
      '/牝奴/当前日课',
    ]);
    expect(commands[1].args[1]).toBe('null');
    expect(commands[2].args[1]).toBe('"公开凝视"');
    expect(diagnostics.dropped).toBe(2);
    expect(diagnostics.droppedCommands.map(item => item.reason)).toEqual([
      'lower_scored_path_candidate',
      'lower_scored_path_candidate',
    ]);
  });

  it('selects the business-complete variable block when a later block has stronger P2 ledger coverage', () => {
    const commands = [
      command('set', '系统.当前场景', '"听风廊"'),
      command('set', '系统.当前追查风声ID', '""'),
      command('set', '系统.待处理交互', '[]'),
      command('set', '剧情.事件记录', '[]'),
      command('set', '系统.当前场景', '"听风廊"'),
      command('set', '系统.时间状态', '{"当前日":1,"时段进度":1,"最近耗时":"一刻钟内","最近事件类型":"追查风声"}'),
      command('set', '系统.当前追查风声ID', '""'),
      command('set', '系统.待处理交互', '[]'),
      command('set', '牝奴.当前日课', '"公开凝视"'),
      command('set', '牝奴.当前命令', '"跪下看鞋"'),
      command('set', '牝奴.今日调教次数', '1'),
      command('set', '剧情.事件记录', '[{"id":"event_1"}]'),
    ];

    const diagnostics = sanitizeMvuCommands(commands);

    expect(new Set(commands.map(item => item.args[0]))).toEqual(new Set([
      '系统.当前场景',
      '系统.时间状态',
      '系统.当前追查风声ID',
      '系统.待处理交互',
      '牝奴.当前日课',
      '牝奴.当前命令',
      '牝奴.今日调教次数',
      '剧情.事件记录',
    ]));
    expect(commands.find(item => item.args[0] === '系统.时间状态')?.args[1]).toContain('一刻钟内');
    expect(commands.find(item => item.args[0] === '剧情.事件记录')?.args[1]).toBe('[{"id":"event_1"}]');
    expect(diagnostics.strategy).toBe('path_scoring_v2');
    expect(diagnostics.droppedCommands.map(item => item.reason)).toContain('lower_scored_path_candidate');
  });

  it('starts a new group when a completed closure block is followed by a fresh scene update', () => {
    const commands = [
      command('set', '系统.当前追查风声ID', '""'),
      command('set', '系统.待处理交互', '[]'),
      command('set', '系统.时间状态.最近耗时', '"一刻钟内"'),
      command('set', '牝奴.当前日课', '"已完成"'),
      appendCommand('剧情.事件记录', '{"id":"weak_event"}'),
      command('set', '系统.当前场景', '"听风廊"'),
      command('set', '系统.时间状态', '{"当前日":1,"时段进度":1,"最近耗时":"一刻钟内","最近事件类型":"追查风声"}'),
      command('set', '系统.待处理交互', '[]'),
      command('set', '系统.当前追查风声ID', '""'),
      command('set', '牝奴.当前日课', '"已完成"'),
      appendCommand('剧情.事件记录', '{"id":"strong_event","摘要":"纪兰记录日课"}'),
    ];

    const diagnostics = sanitizeMvuCommands(commands);

    expect(diagnostics.strategy).toBe('path_scoring_v2');
    expect(new Set(commands.map(item => item.args[0]))).toEqual(new Set([
      '系统.当前场景',
      '系统.时间状态',
      '系统.待处理交互',
      '系统.当前追查风声ID',
      '牝奴.当前日课',
      '剧情.事件记录',
      '系统.时间状态.最近耗时',
    ]));
    expect(commands.find(item => item.args[0] === '剧情.事件记录')?.args.at(-1)).toContain('strong_event');
    expect(diagnostics.droppedCommands.map(item => item.reason)).toContain('lower_scored_path_candidate');
  });

  it('prefers a full time-state group over a noisy partial scene-context group', () => {
    const commands = [
      command('set', '系统.场景上下文.地点', '"外门广场"'),
      command('set', '系统.场景上下文.子区域', '"广场边缘"'),
      command('set', '系统.场景上下文.公开度', '"公开"'),
      command('set', '系统.场景上下文.在场NPC', '[]'),
      command('set', '系统.场景上下文.NPC活动', '{}'),
      command('set', '系统.场景上下文.氛围', '["午时阳光","扫帚沙沙声"]'),
      command('set', '系统.场景上下文.故事钩子', '["杂役的扫地声"]'),
      command('set', '系统.时间状态.最近耗时', '"一刻钟内"'),
      command('set', '系统.时间状态.最近结算原因', '"离开听风廊"'),
      command('set', '系统.时间状态.最近事件类型', '"移动"'),
      command('set', '系统.当前场景', '"外门广场"'),
      command('set', '系统.待处理交互', '[]'),
      command('set', '系统.当前场景', '"外门广场"'),
      command('set', '系统.场景上下文', '{"地点":"外门广场","子区域":"广场边缘","公开度":"公开","在场NPC":[]}'),
      command('set', '系统.时辰', '"午时"'),
      command('set', '系统.时间状态', '{"当前日":1,"时段进度":1,"最近耗时":"一刻钟内","最近结算原因":"离开听风廊前往外门广场","最近事件类型":"移动","是否过夜":false}'),
      command('set', '系统.待处理交互', '[]'),
    ];

    const diagnostics = sanitizeMvuCommands(commands);

    expect(diagnostics.strategy).toBe('path_scoring_v2');
    expect(new Set(commands.map(item => item.args[0]))).toEqual(new Set([
      '系统.当前场景',
      '系统.场景上下文',
      '系统.时辰',
      '系统.时间状态',
      '系统.待处理交互',
      '系统.时间状态.最近耗时',
      '系统.时间状态.最近结算原因',
      '系统.时间状态.最近事件类型',
    ]));
    expect(commands.find(item => item.args[0] === '系统.时间状态')?.args[1]).toContain('离开听风廊前往外门广场');
  });

  it('keeps safe P2 ledger append commands from the selected business-complete block', () => {
    const commands = [
      command('set', '系统.当前场景', '"听风廊"'),
      command('set', '系统.待处理交互', '[]'),
      command('set', '系统.时间状态', '{"最近耗时":"一刻钟内"}'),
      appendCommand('牝奴.调教记录', '{"id":"event_1","摘要":"跪下看鞋"}'),
      command('add', '系统.剩余天数', '-1'),
    ];

    const diagnostics = sanitizeMvuCommands(commands);

    expect(commands.map(item => item.type)).toEqual(['set', 'set', 'set', 'add']);
    expect(commands.find(item => item.type === 'add')?.args).toEqual([
      '牝奴.调教记录',
      "'-'",
      '{"id":"event_1","摘要":"跪下看鞋"}',
    ]);
    expect(diagnostics.droppedCommands.map(item => item.type)).toEqual(['add']);
  });

  it('keeps parser-converted insert appends for backwards compatibility', () => {
    const commands = [
      command('set', '系统.待处理交互', '[]'),
      {
        type: 'insert',
        full_match: 'insert:剧情.事件记录',
        args: ['剧情.事件记录', "'-'", '{"id":"event_1"}'],
        reason: 'test',
      } as any,
    ];

    const diagnostics = sanitizeMvuCommands(commands);

    expect(commands.map(item => item.type)).toEqual(['set', 'insert']);
    expect(diagnostics.dropped).toBe(0);
  });

  it('returns an empty diagnostic for non-array command payloads', () => {
    const diagnostics = sanitizeMvuCommands(undefined as any);

    expect(diagnostics).toMatchObject({ scanned: 0, kept: 0, dropped: 0 });
  });

  it('replays trusted selected commands into core ledger fields when MVU misses them', () => {
    const commands = [
      command('set', '系统.当前场景', '"外门广场"'),
      command('set', '系统.时间状态', '{"当前日":1,"时段进度":1,"最近耗时":"一刻钟内","最近事件类型":"探索","是否过夜":false}'),
      command('set', '剧情.事件记录', '[{"id":"event_1","摘要":"发现药粉"}]'),
      command('set', '系统.待处理交互', '[]'),
    ];
    const diagnostics = sanitizeMvuCommands(commands);
    const data = {
      系统: {
        当前场景: '外门广场',
        时间状态: { 当前日: 1, 时段进度: 0, 最近耗时: '', 最近结算原因: '', 最近事件类型: '', 是否过夜: false },
        待处理交互: [],
      },
      剧情: { 事件记录: [] },
    } as any;

    applySanitizedCommandFallback(data, diagnostics);

    expect(data.系统.时间状态).toMatchObject({ 时段进度: 1, 最近耗时: '一刻钟内', 最近事件类型: '探索' });
    expect(data.剧情.事件记录).toEqual([{ id: 'event_1', 摘要: '发现药粉' }]);
  });

  it('replays trusted time-state subpath commands when MVU misses them', () => {
    const commands = [
      command('set', '系统.当前场景', '"药庐"'),
      command('set', '系统.时间状态.最近耗时', '"一刻钟内"'),
      command('set', '系统.时间状态.最近结算原因', '"循线索走到药庐外围，遭遇NPC"'),
      command('set', '系统.时间状态.最近事件类型', '"追查线索/对话"'),
      command('set', '系统.待处理交互', '[]'),
    ];
    const diagnostics = sanitizeMvuCommands(commands);
    const data = {
      系统: {
        当前场景: '药庐',
        时间状态: { 当前日: 1, 时段进度: 0, 最近耗时: '', 最近结算原因: '', 最近事件类型: '', 是否过夜: false },
        待处理交互: [],
      },
    } as any;

    applySanitizedCommandFallback(data, diagnostics);

    expect(data.系统.时间状态).toMatchObject({
      最近耗时: '一刻钟内',
      最近结算原因: '循线索走到药庐外围，遭遇NPC',
      最近事件类型: '追查线索/对话',
    });
  });

  it('replays stronger core ledger fields from a weaker command group without applying unsafe side effects', () => {
    const commands = [
      command('set', '系统.场景上下文', '{"地点":"药庐外围","在场NPC":["苏芸"]}'),
      command('set', '系统.当前场景', '"药庐"'),
      command('set', '系统.时间状态.最近耗时', '"一刻钟内"'),
      command('set', '系统.时间状态.最近结算原因', '"循线索抵达药庐"'),
      command('set', '系统.时间状态.最近事件类型', '"追查线索"'),
      command('set', '剧情.事件记录', '[{"id":"event_1","摘要":"玩家抵达药庐外围"}]'),
      command('set', '系统.待处理交互', '[]'),
      command('set', '系统.当前场景', '"药庐"'),
      command('set', '系统.时间状态', '{"当前日":1,"时段进度":1,"最近耗时":"一刻钟内","最近结算原因":"循线索抵达药庐并触发NPC遭遇","最近事件类型":"追查线索","是否过夜":false}'),
      command('add', 'NPC.苏芸.好感度', '2'),
      command('set', '系统.待处理交互', '[]'),
    ];
    const diagnostics = sanitizeMvuCommands(commands);
    const data = {
      系统: {
        当前场景: '药庐',
        时间状态: { 当前日: 1, 时段进度: 0, 最近耗时: '', 最近结算原因: '', 最近事件类型: '', 是否过夜: false },
        待处理交互: [],
      },
      剧情: { 事件记录: [] },
      NPC: { 苏芸: { 好感度: 0 } },
    } as any;

    applySanitizedCommandFallback(data, diagnostics);

    expect(diagnostics.strategy).toBe('path_scoring_v2');
    expect(data.系统.时间状态).toMatchObject({
      时段进度: 1,
      最近耗时: '一刻钟内',
      最近结算原因: '循线索抵达药庐',
      最近事件类型: '追查线索',
      是否过夜: false,
    });
    expect(data.剧情.事件记录).toEqual([{ id: 'event_1', 摘要: '玩家抵达药庐外围' }]);
    expect(data.NPC.苏芸.好感度).toBe(0);
  });

  it('replays trusted safe append commands into event ledger when MVU misses them', () => {
    const event = {
      id: 'event_1_午时_苏芸口谕',
      类型: '对话',
      摘要: '苏芸要求玩家在酉时前往阴阳池清理玉阶。',
      日: 1,
      时辰: '午时',
      地点: '药庐',
      涉及NPC: ['苏芸'],
      公开度: '公开',
      后果标签: ['任务指引'],
      已生成风声: true,
    };
    const commands = [
      command('set', '系统.当前场景', '"药庐"'),
      appendCommand('剧情.事件记录', JSON.stringify(event)),
      command('set', '系统.待处理交互', '[]'),
    ];
    const diagnostics = sanitizeMvuCommands(commands);
    const data = {
      系统: { 当前场景: '药庐', 待处理交互: [] },
      剧情: { 事件记录: [] },
    } as any;

    applySanitizedCommandFallback(data, diagnostics);

    expect(data.剧情.事件记录).toEqual([event]);
  });

  it('does not duplicate trusted append commands when MVU already applied them', () => {
    const event = {
      id: 'event_1_酉时_等待指令',
      类型: '探索',
      摘要: '玩家按约抵达阴阳池玉阶底端。',
    };
    const commands = [
      appendCommand('剧情.事件记录', JSON.stringify(event)),
      command('set', '系统.待处理交互', '[]'),
    ];
    const diagnostics = sanitizeMvuCommands(commands);
    const data = {
      系统: { 待处理交互: [] },
      剧情: { 事件记录: [event] },
    } as any;

    applySanitizedCommandFallback(data, diagnostics);

    expect(data.剧情.事件记录).toEqual([event]);
  });

  it('allows soul echo append with matching captured probe state and focus', () => {
    const echo = {
      id: 'echo_suyun_001',
      npc: '苏芸',
      text: '这新来的竟然不躲。',
      stage: '警戒',
      result: '捕获',
      scene: '阴阳池',
      time: '酉时',
      is_new: true,
    };
    const commands = [
      appendCommand('系统.心音回响', JSON.stringify(echo)),
      command('set', 'NPC.苏芸.心声探测态', '"已捕获"'),
      command('set', '系统.当前聚焦心声NPC', '"苏芸"'),
    ];
    const diagnostics = sanitizeMvuCommands(commands);
    const data = {
      系统: { 心音回响: [], 当前聚焦心声NPC: '' },
      NPC: { 苏芸: { 心声探测态: '无波动' } },
    } as any;

    applySanitizedCommandFallback(data, diagnostics);

    expect(new Set(commands.map(item => item.args[0]))).toEqual(new Set(['系统.心音回响', '系统.当前聚焦心声NPC', 'NPC.苏芸.心声探测态']));
    expect(data.系统.心音回响).toEqual([echo]);
    expect(data.系统.当前聚焦心声NPC).toBe('苏芸');
    expect(data.NPC.苏芸.心声探测态).toBe('已捕获');
  });

  it('rejects probe state 可窥探 and unrelated NPC probe updates', () => {
    const commands = [
      appendCommand('系统.心音回响', '{"id":"echo_suyun_001","npc":"苏芸","text":"心音","result":"捕获"}'),
      command('set', 'NPC.苏芸.心声探测态', '"可窥探"'),
      command('set', 'NPC.白芷.心声探测态', '"已捕获"'),
    ];

    const diagnostics = sanitizeMvuCommands(commands);

    expect(commands.map(item => item.args[0])).toEqual(['系统.心音回响']);
    expect(diagnostics.droppedCommands.map(item => item.reason)).toEqual(['untrusted_path', 'untrusted_path']);
  });

  it('keeps only the latest 12 soul echoes when fallback appends', () => {
    const existing = Array.from({ length: 12 }, (_, index) => ({ id: `echo_old_${index}`, npc: '苏芸', text: `旧心音${index}` }));
    const nextEcho = { id: 'echo_new_1', npc: '苏芸', text: '新心音', result: '捕获' };
    const commands = [appendCommand('系统.心音回响', JSON.stringify(nextEcho))];
    const diagnostics = sanitizeMvuCommands(commands);
    const data = { 系统: { 心音回响: existing } } as any;

    applySanitizedCommandFallback(data, diagnostics);

    expect(data.系统.心音回响).toHaveLength(12);
    expect(data.系统.心音回响[0].id).toBe('echo_old_1');
    expect(data.系统.心音回响.at(-1)).toEqual(nextEcho);
  });

  it('keeps one soul echo when the same npc repeats the same text in the same scene and time', () => {
    const firstEcho = {
      id: 'whisper_suyun_01',
      npc: '苏芸',
      text: '……还不低头。胆子倒挺大。',
      stage: '动摇',
      result: '捕获',
      scene: '阴阳池底',
      time: '酉时',
    };
    const secondEcho = {
      ...firstEcho,
      id: 'echo_suyun_01',
    };
    const commands = [
      appendCommand('系统.心音回响', JSON.stringify(firstEcho)),
      appendCommand('系统.心音回响', JSON.stringify(secondEcho)),
      command('set', 'NPC.苏芸.心声探测态', '"已捕获"'),
    ];
    const diagnostics = sanitizeMvuCommands(commands);
    const data = {
      系统: { 心音回响: [] },
      NPC: { 苏芸: { 心声探测态: '无波动' } },
    } as any;

    applySanitizedCommandFallback(data, diagnostics);

    expect(commands.filter(item => item.args[0] === '系统.心音回响')).toHaveLength(1);
    expect(data.系统.心音回响).toEqual([firstEcho]);
    expect(data.NPC.苏芸.心声探测态).toBe('已捕获');
    expect(diagnostics.droppedCommands.map(item => item.reason)).toContain('duplicate_soul_echo_semantic_key');
  });

  it('does not append a soul echo when an existing echo has the same npc text scene and time', () => {
    const existingEcho = {
      id: 'whisper_suyun_01',
      npc: '苏芸',
      text: '……还不低头。胆子倒挺大。',
      scene: '阴阳池底',
      time: '酉时',
    };
    const duplicateEcho = {
      ...existingEcho,
      id: 'echo_suyun_01',
    };
    const commands = [appendCommand('系统.心音回响', JSON.stringify(duplicateEcho))];
    const diagnostics = sanitizeMvuCommands(commands);
    const data = { 系统: { 心音回响: [existingEcho] } } as any;

    applySanitizedCommandFallback(data, diagnostics);

    expect(data.系统.心音回响).toEqual([existingEcho]);
  });
});
