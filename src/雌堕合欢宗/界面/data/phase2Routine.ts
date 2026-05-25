import { getItemDisplayName } from './itemDisplay';

type RoutineRule = {
  keywords: string[];
  requiredItems: string[];
  punishment: string;
  shame: string;
  bodyNote: string;
};

const ROUTINE_RULES: RoutineRule[] = [
  {
    keywords: ['听令', '奉茶', '侍寝', '应名', '点名'],
    requiredItems: ['牝铃', '听命耳坠'],
    punishment: '改派「廊前三巡听铃课」',
    shame: '拒铃迟令',
    bodyNote: '铃音贴着步子发颤，身体会先替你应命。',
  },
  {
    keywords: ['束步', '伏侍', '行礼', '跪坐', '收身'],
    requiredItems: ['牝链', '束缚绳'],
    punishment: '改派「束步伏侍课」',
    shame: '解链偷闲',
    bodyNote: '腰腹与腕侧被牵住，动作会自己收回去。',
  },
  {
    keywords: ['验印', '烙名', '牝印', '印记'],
    requiredItems: ['牝印', '淫纹'],
    punishment: '改派「验印受训课」',
    shame: '抗印失仪',
    bodyNote: '印纹伏在皮下，命令一落就会先热起来。',
  },
  {
    keywords: ['禁溺', '憋尿', '忍尿', '锁溺'],
    requiredItems: ['牝环', '贞操带'],
    punishment: '改派「锁溺伏身课」',
    shame: '违环失守',
    bodyNote: '下身会被暗扣提醒，越忍越像在被宗门看着。',
  },
];

const DEFAULT_RULE = {
  requiredItems: [] as string[],
  punishment: '',
  shame: '',
  bodyNote: '候命时身体暂且静伏，等下一道朱批落下。',
};

export interface Phase2RoutineState {
  routine: string;
  requiredItems: string[];
  requiredLabel: string;
  missingItems: string[];
  hasRequirement: boolean;
  isMissing: boolean;
  punishment: string;
  shame: string;
  bodyNote: string;
}

export function getPhase2RoutineState(routine: string, equippedItems: readonly string[]): Phase2RoutineState {
  const rule = ROUTINE_RULES.find(entry => entry.keywords.some(keyword => routine.includes(keyword))) ?? DEFAULT_RULE;
  const requiredItems = rule.requiredItems;
  const hasRequiredItem = requiredItems.length === 0 || requiredItems.some(item => equippedItems.includes(item));
  const missingItems = hasRequiredItem ? [] : requiredItems;
  return {
    routine: routine || '候命',
    requiredItems,
    requiredLabel: requiredItems.map(getItemDisplayName).join(' / '),
    missingItems,
    hasRequirement: requiredItems.length > 0,
    isMissing: missingItems.length > 0,
    punishment: rule.punishment,
    shame: rule.shame,
    bodyNote: rule.bodyNote,
  };
}
