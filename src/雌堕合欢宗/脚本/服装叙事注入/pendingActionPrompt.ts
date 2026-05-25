import { getContrabandTier, getItemDisplayName, getItemShortHint } from '../../界面/data/itemDisplay';
import { getItemLifecycle } from '../../界面/data/itemLifecycle';

type PromptRole = 'system' | 'assistant' | 'user';
type PromptPosition = 'in_chat' | 'none';

type InjectionPrompt = {
  id: string;
  position: PromptPosition;
  depth: number;
  role: PromptRole;
  content: string;
  should_scan?: boolean;
};

type PendingAction = {
  类型?: string;
  目标?: string;
  道具?: string;
  道具显示名?: string;
  AI短提示?: string;
  场景?: string;
  地点?: string;
  故事钩子?: string;
  剧情线?: string;
  风声ID?: string;
  关联NPC?: string;
  秘密主题?: string;
  入口类型?: string;
  线索ID?: string;
  丹药分类?: string;
  器阶?: string;
};

export type PendingActionPromptData = {
  系统?: {
    阶段?: string;
    当前场景?: string;
    待处理交互?: PendingAction[];
    场景上下文?: { 在场NPC?: string[]; 地点?: string; 公开度?: string };
    灵石?: number;
  };
};

export type PendingActionPromptResult = {
  visible: InjectionPrompt;
  scan: InjectionPrompt;
};

const PROMPT_ID_VISIBLE = 'hehuan-pending-action-summary';
const PROMPT_ID_SCAN = 'hehuan-pending-action-scan';

function uniq(items: string[]): string[] {
  return Array.from(new Set(items.filter(Boolean)));
}

function isInstantItem(name: string): boolean {
  return getItemLifecycle(name) === '购买即生效';
}

function isPhase2(data: PendingActionPromptData): boolean {
  return data.系统?.阶段 === '牝奴期';
}

function isPlayerTarget(target: string): boolean {
  return target === '玩家' || target === '己身' || target === '';
}

function buildActionLine(action: PendingAction, data: PendingActionPromptData): string {
  const type = action.类型 ?? '';
  const target = action.目标 ?? '';
  const logicName = action.道具 ?? '';
  const displayName = action.道具显示名 || getItemDisplayName(logicName);
  const hint = action.AI短提示 || getItemShortHint(logicName);

  switch (type) {
    case '购买物品': {
      if (isInstantItem(logicName)) {
        return `【高优先级承接】玩家购买了「${displayName}」(${logicName})，${getItemLifecycle(logicName)}，${hint}。这是购买即生效的事件种子，必须在本楼层正文叙事中立即承接，不得被开场叙事或NPC互动压过。`;
      }
      return `玩家购买了「${displayName}」(${logicName})，${hint}。正文必须至少一句承认该道具已入手或激活；禁止"队列清空但正文一字未提"。`;
    }
    case '领受法器':
      return `牝奴期玩家从执事库领受「${displayName}」(${logicName})，${hint}。这是宗门发付或日课领受，不是购物或灵石交易；正文必须承接发付来源、当前日课关系、执事或支配者记录。变量上承认前端已写入 道具.拥有，不要重复增加库存。`;
    case '使用物品':
      return `玩家对${target}使用了「${displayName}」(${logicName})，${hint}。正文必须在本楼层写出使用效果：身体变化、气息波动、场景反应或目标反应。`;
    case '装备道具':
      if (isPhase2(data) && isPlayerTarget(target)) {
        return `牝奴期玩家将「${displayName}」(${logicName})扣到己身，${hint}。这是法器匣承命，不是购物或普通穿戴；正文必须写出法器对身体的即时回响、对当前日课的影响，以及是否被执事或支配者记入羞名/承命痕。变量上只承认前端已完成的 道具.装备.玩家，不要重复插入装备。`;
      }
      return `玩家将「${displayName}」(${logicName})装备到${target}身上，${hint}。正文必须写出目标的反应：顺从、抗拒、羞恼或沉默。`;
    case '卸下':
      if (isPhase2(data) && isPlayerTarget(target)) {
        return `牝奴期玩家试图解除己身「${displayName}」(${logicName})。正文应写出法器残痕、日课违令风险、执事斥责或羞名余波；变量上只承认前端已完成的卸下结果，不要重复改写 道具.装备.玩家。`;
      }
      return `玩家解除了${target}身上的「${displayName}」(${logicName})。正文应写出残痕退去、压力消散或目标反应。`;
    case '追查风声': {
      const location = action.场景 || action.地点 || '';
      const hook = action.故事钩子 || '';
      if (action.剧情线 === '牝奴羞名' || action.AI短提示?.includes('P2羞名')) {
        return `${action.AI短提示 || 'P2羞名风声必须被承接'} 地点：${location || '当前场景'}${hook ? `，线索：${hook}` : ''}。正文必须承接为传唤、日课异动、公开凝视或支配事件，并在同次JSONPatch中更新牝奴.当前日课、牝奴.当前命令、牝奴.当前支配者、牝奴.今日调教次数或牝奴.调教记录中的至少一项。`;
      }
      return `玩家前往${location}追查风声${hook ? `，线索：${hook}` : ''}。正文必须承接为场景遭遇，写出探索过程与发现。`;
    }
    case '灵识窃取':
      return `玩家以合欢心典窥探${target}心绪。正文必须写出窥探结果：成功窥见心音、心防反震或心音残片。`;
    default:
      return `玩家执行了「${type}」操作${logicName ? `，涉及「${displayName}」` : ''}。正文必须在本楼层承认并承接此操作。`;
  }
}

function build灵石红线(data: PendingActionPromptData): string | null {
  const 灵石 = data.系统?.灵石 ?? 0;
  if (灵石 > 500000) {
    return '灵石数值远超常规获取上限，此为玩家调试行为；AI禁止用replace将灵石修正回初始值或任何低值，必须保留当前数值继续叙事。';
  }
  return null;
}

function buildPatchFormatLines(): string[] {
  return [
    '【变量输出格式硬约束】只能输出一个<UpdateVariable>，且其中只能输出一个完整<JSONPatch>；禁止输出第二个<UpdateVariable>、第二个<JSONPatch>、重复Analysis或补写变量块。',
    '【JSONPatch安全约束】JSONPatch必须是完整JSON数组并正常闭合；禁止使用insert，数组追加统一使用add到/-，字段改写使用replace；不确定路径存在时优先replace已有对象或用add追加数组项。',
    '【最短闭环优先】第一优先级只写闭环必需补丁：系统.待处理交互=[]、系统.当前追查风声ID=""、系统.时间状态、牝奴.当前日课/当前支配者/当前命令/今日调教次数/最近调教结算、剧情.事件记录。风声列表、心音、额外细节放在这些之后，输出空间不足时省略额外项。',
  ];
}

function buildWorldRuntimeLines(actions: PendingAction[]): string[] {
  const lines = [
    ...buildPatchFormatLines(),
    '【世界运行结算】本楼层处理待处理交互时，必须同步进行时间结算：判断耗时，必要时更新系统.时辰和系统.剩余天数，并写入系统.时间状态.最近耗时、最近结算原因、最近事件类型、是否过夜。禁止只清空队列不写时间结算。',
    '若事件涉及亲密、NSFW、欲海气息、投欲钥或改变阵法，必须同步更新系统.欲海状态；若事件重要，写入剧情.事件记录，记录摘要、日、时辰、地点、涉及NPC、公开度和后果标签。',
  ];

  for (const action of actions) {
    const item = action.道具 ?? '';
    if (item === '时间延长') {
      lines.push('【时间延长】必须增加系统.剩余天数，并在系统.时间状态写明最近结算原因；禁止只描写道具生效却不改天数。');
    }
    if (item === '欲海遮蔽符') {
      lines.push('【欲海遮蔽符】必须写入系统.欲海状态.遮蔽剩余时段和遮蔽来源；遮蔽期间若发生NSFW，不得明显增加搜寻进度。');
    }
    if (item === '投欲钥') {
      lines.push('【投欲钥】必须将系统.欲海状态推向锁定或已被定位，并进入牝奴期承接；禁止写成普通购买。');
    }
    if (item === '改变阵法' || action.类型 === '改变阵法') {
      lines.push('【改变阵法】必须改写或关闭欲海压力，更新系统.欲海状态，并写入事件后果账本。');
    }
  }

  return lines;
}

function needsP2Runtime(data: PendingActionPromptData, actions: PendingAction[]): boolean {
  if (data.系统?.阶段 === '牝奴期') return true;
  return actions.some((action) => action.剧情线 === '牝奴羞名' || action.类型 === 'P2日课' || action.类型 === '牝奴调教');
}

function buildP2RuntimeLines(): string[] {
  return [
    '【牝奴期运行结算】本楼层若承接牝奴期交互，必须同步判断当前日课、当前支配者、牝印命令与调教后果，并写入牝奴.当前日课、牝奴.当前支配者、牝奴.当前命令、牝奴.命令强度、牝奴.今日调教次数和牝奴.最近调教结算。',
    '牝奴期的重要羞名、日课、公开示众或支配事件必须追加牝奴.调教记录，并同步写入剧情.事件记录；若公开度为公开或涉及羞名流传，应生成或承接一条羞名风声。',
    '牝奴期必须读取 道具.装备.玩家 判断法器对身体、日课和羞名的影响：缺少日课所需法器时，可写斥责、羞名标签和更重日课；已扣法器时，应写承命、身体回响和被记录的压力。',
    '牝奴期没有商城购物语义；执事库发付只代表宗门下发或日课领受，AI不得叙述玩家用灵石购买牝奴期法器。',
  ];
}

function buildScanTokens(actions: PendingAction[]): string[] {
  const tokens = ['待处理交互', '最低承认底线', '时间结算', '系统.时间状态', '事件后果账本'];

  for (const action of actions) {
    const type = action.类型 ?? '';
    const logicName = action.道具 ?? '';
    const displayName = action.道具显示名 || getItemDisplayName(logicName);

    tokens.push(type);
    if (logicName) tokens.push(logicName);
    if (displayName && displayName !== logicName) tokens.push(displayName);

    if (type === '购买物品' || type === '使用物品' || type === '领受法器') {
      tokens.push('道具AI承接闭环');
      if (isInstantItem(logicName)) tokens.push('特殊道具事件规则');
      if (action.丹药分类) tokens.push('丹药叙事规则');
      if (logicName === '时间延长') tokens.push('时间延长', '剩余天数');
      if (logicName === '欲海遮蔽符') tokens.push('欲海状态', '遮蔽剩余时段');
      if (logicName === '投欲钥') tokens.push('欲海状态', '锁定', '牝奴期');
    }
    if (type === '领受法器') tokens.push('执事库', '发付', '日课领受', '道具.拥有', '法器匣');
    if (type === '装备道具' || type === '卸下') {
      const tier = action.器阶 || getContrabandTier(logicName);
      if (tier) tokens.push('禁器叙事规则', tier);
      tokens.push('服装叙事规则');
      tokens.push('道具.装备.玩家', '法器匣', '承命痕');
    }
    if (type === '追查风声') tokens.push('风声');
    if (action.剧情线 === '牝奴羞名' || action.AI短提示?.includes('P2羞名')) {
      tokens.push('牝奴羞名', '传唤', '日课异动', '公开凝视', '支配事件', '牝奴期后果账本');
    }
    if (type === '灵识窃取') tokens.push('心音回响', '灵识窃取');
    if (action.剧情线 === '牝奴羞名' || type === 'P2日课' || type === '牝奴调教') tokens.push('牝奴日课', '牝印命令', '调教记录', '羞名风声');
  }

  return tokens;
}

export function buildPendingActionPrompt(data: PendingActionPromptData): PendingActionPromptResult | null {
  const actions = data.系统?.待处理交互 ?? [];
  if (actions.length === 0) return null;

  const actionLines = actions.map(action => buildActionLine(action, data));

  actionLines.push(...buildWorldRuntimeLines(actions));
  if (needsP2Runtime(data, actions)) actionLines.push(...buildP2RuntimeLines());

  const 灵石红线 = build灵石红线(data);
  if (灵石红线) actionLines.push(灵石红线);

  const visibleContent = `待处理交互队列（本楼层必须逐条叙事承接，禁止只清队列不写剧情）：\n${actionLines.map((line, i) => `${i + 1}. ${line}`).join('\n')}\n承接后必须在同一次JSONPatch中清空系统.待处理交互为[]。`;

  const scanTokens = uniq(buildScanTokens(actions));
  if (needsP2Runtime(data, actions)) scanTokens.push('牝奴日课', '牝印命令', '调教记录', '羞名风声');

  return {
    visible: {
      id: PROMPT_ID_VISIBLE,
      position: 'in_chat',
      depth: 0,
      role: 'system',
      content: visibleContent,
      should_scan: false,
    },
    scan: {
      id: PROMPT_ID_SCAN,
      position: 'none',
      depth: 0,
      role: 'system',
      content: scanTokens.join(' '),
      should_scan: true,
    },
  };
}
