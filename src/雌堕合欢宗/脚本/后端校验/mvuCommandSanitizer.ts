export type SanitizedCommand = {
  type?: string;
  args?: unknown[];
  full_match?: string;
  reason?: string;
  [key: string]: unknown;
};

export type CommandSanitizerDiagnostics = {
  strategy: 'path_scoring_v2';
  scanned: number;
  kept: number;
  dropped: number;
  droppedCommands: Array<SanitizedCommand & { reason: string }>;
  keptCommands?: SanitizedCommand[];
  selectedPathCount?: number;
};

const DISALLOWED_COMMAND_TYPES = new Set(['insert', 'add']);
const SAFE_APPEND_PATHS = new Set([
  '/牝奴/调教记录',
  '牝奴.调教记录',
  '/剧情/事件记录',
  '剧情.事件记录',
  '/系统/风声列表',
  '系统.风声列表',
  '/系统/心音回响',
  '系统.心音回响',
]);
const CRITICAL_PATHS = new Set([
  '/系统/当前场景',
  '/系统/待处理交互',
  '/系统/当前追查风声ID',
  '/系统/时间状态',
  '/系统/欲海状态',
  '/剧情/事件记录',
  '/牝奴/当前日课',
  '/牝奴/当前支配者',
  '/牝奴/当前命令',
  '/牝奴/今日调教次数',
  '/牝奴/最近调教结算',
  '/牝奴/调教记录',
  '/牝奴/羞名标签',
  '系统.当前场景',
  '系统.待处理交互',
  '系统.当前追查风声ID',
  '系统.时间状态',
  '系统.欲海状态',
  '剧情.事件记录',
  '牝奴.当前日课',
  '牝奴.当前支配者',
  '牝奴.当前命令',
  '牝奴.今日调教次数',
  '牝奴.最近调教结算',
  '牝奴.调教记录',
  '牝奴.羞名标签',
]);

const GROUP_BOUNDARY_PATHS = new Set(['/系统/当前场景', '系统.当前场景']);
const CLOSURE_PATHS = new Set(['/系统/待处理交互', '系统.待处理交互']);
const BUSINESS_PATH_WEIGHTS = new Map([
  ['/系统/待处理交互', 8],
  ['系统.待处理交互', 8],
  ['/系统/时间状态', 40],
  ['系统.时间状态', 40],
  ['/系统/场景上下文', 14],
  ['系统.场景上下文', 14],
  ['/剧情/事件记录', 40],
  ['剧情.事件记录', 40],
  ['/牝奴/当前日课', 8],
  ['牝奴.当前日课', 8],
  ['/牝奴/当前命令', 8],
  ['牝奴.当前命令', 8],
  ['/牝奴/今日调教次数', 8],
  ['牝奴.今日调教次数', 8],
  ['/牝奴/最近调教结算', 4],
  ['牝奴.最近调教结算', 4],
  ['/牝奴/调教记录', 4],
  ['牝奴.调教记录', 4],
  ['/系统/当前追查风声ID', 3],
  ['系统.当前追查风声ID', 3],
]);

const FALLBACK_PATHS = new Set([
  '系统.时间状态',
  '/系统/时间状态',
  '系统.时间状态.最近耗时',
  '/系统/时间状态/最近耗时',
  '系统.时间状态.最近结算原因',
  '/系统/时间状态/最近结算原因',
  '系统.时间状态.最近事件类型',
  '/系统/时间状态/最近事件类型',
  '系统.时间状态.时段进度',
  '/系统/时间状态/时段进度',
  '系统.时间状态.是否过夜',
  '/系统/时间状态/是否过夜',
  '剧情.事件记录',
  '/剧情/事件记录',
  '牝奴.当前日课',
  '/牝奴/当前日课',
  '牝奴.当前支配者',
  '/牝奴/当前支配者',
  '牝奴.当前命令',
  '/牝奴/当前命令',
  '牝奴.今日调教次数',
  '/牝奴/今日调教次数',
  '牝奴.最近调教结算',
  '/牝奴/最近调教结算',
  '牝奴.调教记录',
  '/牝奴/调教记录',
]);

const SOUL_PROBE_RESULT_STATES = new Set(['已捕获', '反震', '锁闭']);

const SELECTABLE_PATHS = new Set([
  ...CRITICAL_PATHS,
  ...BUSINESS_PATH_WEIGHTS.keys(),
  ...FALLBACK_PATHS,
  '系统.场景上下文',
  '/系统/场景上下文',
  '系统.时辰',
  '/系统/时辰',
]);

function getAppendBasePath(command: SanitizedCommand): string {
  const path = getCommandPath(command);
  if (command.type === 'insert') {
    const indexOrKey = command.args?.[1];
    return SAFE_APPEND_PATHS.has(path) && (indexOrKey === "'-'" || indexOrKey === '-' || indexOrKey === '"-"') ? path : '';
  }
  if (command.type !== 'add') return '';
  if (SAFE_APPEND_PATHS.has(path)) {
    const indexOrKey = command.args?.[1];
    return indexOrKey === "'-'" || indexOrKey === '-' || indexOrKey === '"-"'
      ? path
      : '';
  }
  if (path.endsWith('/-')) {
    const basePath = path.slice(0, -2);
    return SAFE_APPEND_PATHS.has(basePath) ? basePath : '';
  }
  if (path.endsWith('.-')) {
    const basePath = path.slice(0, -2);
    return SAFE_APPEND_PATHS.has(basePath) ? basePath : '';
  }
  return '';
}

function normalizeSafeAppendCommand(command: SanitizedCommand): SanitizedCommand {
  const basePath = getAppendBasePath(command);
  if (!basePath) return command;
  return {
    ...command,
    args: [basePath, "'-'", command.args?.at(-1)],
  };
}

function getCommandPath(command: SanitizedCommand): string {
  const firstArg = command.args?.[0];
  return typeof firstArg === 'string' ? firstArg : '';
}

function drop(command: SanitizedCommand, reason: string): SanitizedCommand & { reason: string } {
  return { ...command, reason };
}

function getCommandValueLiteral(command: SanitizedCommand): string {
  const value = command.args?.at(-1);
  return typeof value === 'string' ? value.trim() : JSON.stringify(value ?? null);
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path.slice(1).replaceAll('/', '.') : path;
}

function parseLiteral(literal: string): unknown {
  try {
    return JSON.parse(literal);
  } catch {
    return literal.replace(/^['"]|['"]$/g, '');
  }
}

function getSoulEchoNpc(command: SanitizedCommand): string {
  if (!isSafeAppendCommand(command)) return '';
  const path = getAppendBasePath(command);
  if (path !== '系统.心音回响' && path !== '/系统/心音回响') return '';
  const value = parseLiteral(getCommandValueLiteral(command));
  return isPlainRecord(value) && typeof value.npc === 'string' ? value.npc : '';
}

function getSoulEchoSemanticKey(value: unknown): string {
  if (!isPlainRecord(value)) return '';
  const npc = typeof value.npc === 'string' ? value.npc.trim() : '';
  const text = typeof value.text === 'string' ? value.text.trim() : '';
  const scene = typeof value.scene === 'string' ? value.scene.trim() : '';
  const time = typeof value.time === 'string' ? value.time.trim() : '';
  return npc && text && scene && time ? `${npc}\u0000${text}\u0000${scene}\u0000${time}` : '';
}

function getSoulEchoCommandSemanticKey(command: SanitizedCommand): string {
  const path = getAppendBasePath(command);
  if (path !== '系统.心音回响' && path !== '/系统/心音回响') return '';
  return getSoulEchoSemanticKey(parseLiteral(getCommandValueLiteral(command)));
}

function getTrustedSoulEchoNpcs(commands: SanitizedCommand[]): Set<string> {
  return new Set(commands.map(getSoulEchoNpc).filter(Boolean));
}

function getProbeNpcFromPath(path: string): string {
  const normalized = normalizePath(path);
  const match = /^NPC\.([^\.]+)\.心声探测态$/.exec(normalized);
  return match?.[1] ?? '';
}

function isTrustedSoulCompanionSet(command: SanitizedCommand, trustedSoulNpcs: Set<string>): boolean {
  if (command.type !== 'set' || trustedSoulNpcs.size === 0) return false;
  const path = getCommandPath(command);
  const value = parseLiteral(getCommandValueLiteral(command));
  if ((path === '系统.当前聚焦心声NPC' || path === '/系统/当前聚焦心声NPC') && typeof value === 'string') {
    return trustedSoulNpcs.has(value);
  }
  const npc = getProbeNpcFromPath(path);
  if (!npc || !trustedSoulNpcs.has(npc) || typeof value !== 'string') return false;
  return SOUL_PROBE_RESULT_STATES.has(value);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function setByPath(target: Record<string, any>, path: string, value: unknown): void {
  const parts = normalizePath(path).split('.').filter(Boolean);
  let cursor: Record<string, any> = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (typeof cursor[part] !== 'object' || cursor[part] === null || Array.isArray(cursor[part])) {
      cursor[part] = {};
    }
    cursor = cursor[part];
  }
  cursor[parts.at(-1)!] = value;
}

function appendByPath(target: Record<string, any>, path: string, value: unknown): void {
  const parts = normalizePath(path).split('.').filter(Boolean);
  let cursor: Record<string, any> = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (typeof cursor[part] !== 'object' || cursor[part] === null || Array.isArray(cursor[part])) {
      cursor[part] = {};
    }
    cursor = cursor[part];
  }
  const leaf = parts.at(-1)!;
  if (!Array.isArray(cursor[leaf])) {
    cursor[leaf] = [];
  }
  if (isPlainRecord(value) && typeof value.id === 'string') {
    const id = value.id;
    const alreadyExists = cursor[leaf].some((item: unknown) => isPlainRecord(item) && item.id === id);
    if (alreadyExists) return;
  }
  if (path === '系统.心音回响' || path === '/系统/心音回响') {
    const semanticKey = getSoulEchoSemanticKey(value);
    if (semanticKey) {
      const alreadyExists = cursor[leaf].some((item: unknown) => getSoulEchoSemanticKey(item) === semanticKey);
      if (alreadyExists) return;
    }
  }
  cursor[leaf].push(value);
  if (path === '系统.心音回响' || path === '/系统/心音回响') {
    cursor[leaf] = cursor[leaf].slice(-12);
  }
}

function snapshotCommand(command: SanitizedCommand): SanitizedCommand {
  return {
    type: command.type,
    full_match: command.full_match,
    args: command.args ? [...command.args] : undefined,
  };
}

function pathDepth(command: SanitizedCommand): number {
  return normalizePath(getCommandPath(command)).split('.').filter(Boolean).length;
}

function sortParentPathsFirst(commands: SanitizedCommand[]): SanitizedCommand[] {
  return commands.map((command, index) => ({ command, index })).sort((a, b) => {
    const depthDiff = pathDepth(a.command) - pathDepth(b.command);
    return depthDiff === 0 ? a.index - b.index : depthDiff;
  }).map(item => item.command);
}

function pruneSceneContextChildren(commands: SanitizedCommand[], droppedCommands: Array<SanitizedCommand & { reason: string }>): SanitizedCommand[] {
  const hasFullSceneContext = commands.some(command => {
    const path = getCommandPath(command);
    return path === '系统.场景上下文' || path === '/系统/场景上下文';
  });
  if (!hasFullSceneContext) return commands;

  return commands.filter(command => {
    const path = getCommandPath(command);
    const isSceneContextChild = path.startsWith('系统.场景上下文.') || path.startsWith('/系统/场景上下文/');
    if (isSceneContextChild) {
      droppedCommands.push(drop(command, 'covered_by_full_scene_context'));
      return false;
    }
    return true;
  });
}

function isSelectableCommand(command: SanitizedCommand): boolean {
  const path = getCommandPath(command);
  return SELECTABLE_PATHS.has(path) || path.startsWith('系统.场景上下文.') || path.startsWith('/系统/场景上下文/') || path.startsWith('系统.时间状态.') || path.startsWith('/系统/时间状态/');
}

function isSafeAppendCommand(command: SanitizedCommand): boolean {
  return Boolean(getAppendBasePath(command));
}

function valueScore(command: SanitizedCommand): number {
  const literal = getCommandValueLiteral(command);
  if (!literal || literal === 'null' || literal === 'undefined') return -20;
  if (literal === '[]' || literal === '{}' || literal === '""') return 0;
  if (/^\[\s*\]/.test(literal) || /^\{\s*\}/.test(literal)) return 0;
  return Math.min(20, literal.length);
}

function commandScore(command: SanitizedCommand): number {
  const path = getCommandPath(command);
  if (path.startsWith('系统.场景上下文.') || path.startsWith('/系统/场景上下文/')) {
    return Math.min(4, valueScore(command));
  }
  if (path.startsWith('系统.时间状态.') || path.startsWith('/系统/时间状态/')) {
    return 3 + Math.min(6, valueScore(command));
  }
  const base = BUSINESS_PATH_WEIGHTS.get(path) ?? 1;
  return base + valueScore(command);
}

function splitCommandGroups(commands: SanitizedCommand[]): SanitizedCommand[][] {
  const groups: SanitizedCommand[][] = [[]];
  const seenPaths = new Set<string>();
  let currentGroupHasClosure = false;

  for (const command of commands) {
    const path = getCommandPath(command);
    if (groups.at(-1)!.length > 0 && GROUP_BOUNDARY_PATHS.has(path) && (seenPaths.has(path) || currentGroupHasClosure)) {
      groups.push([]);
      currentGroupHasClosure = false;
    }
    groups.at(-1)!.push(command);
    seenPaths.add(path);
    if (CLOSURE_PATHS.has(path)) {
      currentGroupHasClosure = true;
    }
  }

  return groups;
}

function scoreGroup(group: SanitizedCommand[]): number {
  return group.reduce((total, command) => total + commandScore(command), 0);
}

function chooseBestGroup(groups: SanitizedCommand[][]): number {
  let bestIndex = 0;
  let bestScore = Number.NEGATIVE_INFINITY;
  groups.forEach((group, index) => {
    const score = scoreGroup(group);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function dedupeCriticalPaths(commands: SanitizedCommand[], droppedCommands: Array<SanitizedCommand & { reason: string }>): SanitizedCommand[] {
  const indexesByPath = new Map<string, number>();
  const kept: SanitizedCommand[] = [];

  for (const command of commands) {
    const path = getCommandPath(command);
    if (!CRITICAL_PATHS.has(path)) {
      kept.push(command);
      continue;
    }

    const existingIndex = indexesByPath.get(path);
    if (existingIndex === undefined) {
      indexesByPath.set(path, kept.length);
      kept.push(command);
      continue;
    }

    const existing = kept[existingIndex];
    if (commandScore(command) > commandScore(existing)) {
      droppedCommands.push(drop(existing, 'duplicate_critical_path'));
      kept[existingIndex] = command;
    } else {
      droppedCommands.push(drop(command, 'duplicate_critical_path'));
    }
  }

  return kept;
}

export function sanitizeMvuCommands(commands: SanitizedCommand[] | undefined): CommandSanitizerDiagnostics {
  if (!Array.isArray(commands)) {
    return {
      strategy: 'path_scoring_v2',
      scanned: 0,
      kept: 0,
      dropped: 0,
      droppedCommands: [],
      keptCommands: [],
      selectedPathCount: 0,
    };
  }

  const originalLength = commands.length;
  const droppedCommands: Array<SanitizedCommand & { reason: string }> = [];
  const bestByPath = new Map<string, SanitizedCommand>();
  const keptSafeAppends: SanitizedCommand[] = [];
  const keptSoulEchoKeys = new Set<string>();
  const trustedSoulNpcs = getTrustedSoulEchoNpcs(commands);

  for (const command of commands) {
    if (isSafeAppendCommand(command)) {
      const appendCommand = normalizeSafeAppendCommand(command);
      const soulEchoKey = getSoulEchoCommandSemanticKey(appendCommand);
      if (soulEchoKey) {
        if (keptSoulEchoKeys.has(soulEchoKey)) {
          droppedCommands.push(drop(appendCommand, 'duplicate_soul_echo_semantic_key'));
          continue;
        }
        keptSoulEchoKeys.add(soulEchoKey);
      }
      keptSafeAppends.push(appendCommand);
      continue;
    }

    const commandType = String(command.type ?? '');
    if (DISALLOWED_COMMAND_TYPES.has(commandType)) {
      droppedCommands.push(drop(command, 'disallowed_command_type'));
      continue;
    }

    if (!isSelectableCommand(command) && !isTrustedSoulCompanionSet(command, trustedSoulNpcs)) {
      droppedCommands.push(drop(command, 'untrusted_path'));
      continue;
    }

    const path = getCommandPath(command);
    const existing = bestByPath.get(path);
    if (!existing || commandScore(command) > commandScore(existing)) {
      if (existing) droppedCommands.push(drop(existing, 'lower_scored_path_candidate'));
      bestByPath.set(path, command);
    } else {
      droppedCommands.push(drop(command, 'lower_scored_path_candidate'));
    }
  }

  const kept = sortParentPathsFirst(
    pruneSceneContextChildren(dedupeCriticalPaths([...bestByPath.values(), ...keptSafeAppends], droppedCommands), droppedCommands),
  );

  commands.splice(0, commands.length, ...kept);

  return {
    strategy: 'path_scoring_v2',
    scanned: originalLength,
    kept: kept.length,
    dropped: droppedCommands.length,
    droppedCommands,
    keptCommands: kept.map(snapshotCommand),
    selectedPathCount: bestByPath.size,
  };
}

export function applySanitizedCommandFallback(newData: Record<string, any>, diagnostics?: CommandSanitizerDiagnostics | null): void {
  if (!newData || diagnostics?.strategy !== 'path_scoring_v2' || !Array.isArray(diagnostics.keptCommands)) return;

  const trustedSoulNpcs = getTrustedSoulEchoNpcs(diagnostics.keptCommands);

  for (const command of diagnostics.keptCommands) {
    const path = getCommandPath(command);
    if (command.type === 'set') {
      if (!FALLBACK_PATHS.has(path) && !isTrustedSoulCompanionSet(command, trustedSoulNpcs)) continue;
      setByPath(newData, path, parseLiteral(getCommandValueLiteral(command)));
      continue;
    }
    if (isSafeAppendCommand(command)) {
      appendByPath(newData, getAppendBasePath(command), parseLiteral(getCommandValueLiteral(command)));
    }
  }
}
