import { getItemLifecycle } from './itemLifecycle';
import { 特殊场景, 特殊剧情 } from './scenes';

type NpcName = '白芷' | '苏芸' | '纪兰' | '沈月秋' | '柳素衣';
type EntryType = '剧情钥匙' | '场景令牌' | '特殊事件';
type EntryStatusName = '可追查' | '追查中' | '已触发' | '已失效';

export type NarrativeEntryStatus = {
  类型: EntryType;
  状态: EntryStatusName;
  风声ID: string;
  关联名称: string;
  关联NPC?: NpcName | string;
  推荐场景?: string[];
  触发次数: number;
  最近场景?: string;
};

export type EntryRumor = {
  id: string;
  来源: '剧情钥匙' | '场景令牌' | '特殊事件' | string;
  地点: string;
  子区域?: string;
  相关NPC?: string[];
  紧急度?: '低' | '中' | '高';
  风声文本: string;
  故事钩子?: string;
  状态: '未读' | '已读' | '已追查' | '已失效' | '追查中' | string;
};

export type NarrativeEntry = {
  key: string;
  status: NarrativeEntryStatus;
  rumor: EntryRumor;
};

const storyRumorSeeds: Record<string, { id: string; 地点: string; 子区域?: string; 风声文本: string; 故事钩子: string }> = {
  白芷旧誓线: {
    id: 'story_baizhi_old_oath_1',
    地点: '听风廊',
    子区域: '廊下风铃',
    风声文本: '听风廊有人拾到一枚裂开的玉扣，扣内旧誓灵纹仍在发热。',
    故事钩子: '白芷旧誓被重新牵动',
  },
  苏芸错炉线: {
    id: 'story_suyun_wrong_furnace_1',
    地点: '药庐暖阁',
    子区域: '暖炉旁',
    风声文本: '药庐暖阁的炉灰里翻出一枚写错剂量的药签，署名被人抹去。',
    故事钩子: '苏芸错炉记录重新浮现',
  },
  纪兰禁录线: {
    id: 'story_jilan_forbidden_record_1',
    地点: '经阁密室',
    子区域: '残卷案前',
    风声文本: '经阁密室昨夜多了一页朱批禁录，字迹像是纪兰亲手压下的。',
    故事钩子: '纪兰禁录与破戒边界被牵出',
  },
  沈月秋失衡线: {
    id: 'story_shenyueqiu_lost_balance_1',
    地点: '渊底灵脉',
    子区域: '测灵石阶',
    风声文本: '渊底灵脉旁的玉筹裂开一线，算痕偏偏停在沈月秋的名册旁。',
    故事钩子: '沈月秋理性推演出现失衡裂缝',
  },
  柳素衣命契线: {
    id: 'story_liusuyi_fate_contract_1',
    地点: '掌门殿偏殿',
    子区域: '偏殿门缝',
    风声文本: '掌门殿偏殿的残契印忽然亮过一瞬，像在回应某个旧主。',
    故事钩子: '柳素衣命契真相开始回应',
  },
};

function sceneId(name: string) {
  const idMap: Record<string, string> = {
    阴阳池: 'scene_yinyang_pool_1',
    经阁密室: 'scene_scripture_secret_room_1',
    掌门殿偏殿: 'scene_leader_side_hall_1',
    渊底灵脉: 'scene_abyss_spirit_vein_1',
    药庐暖阁: 'scene_herb_warm_room_1',
    听风廊: 'scene_listening_wind_corridor_1',
    锁心静室: 'scene_heart_lock_room_1',
    莲纹浴房: 'scene_lotus_bath_room_1',
  };
  return idMap[name] ?? `scene_${name}_1`;
}

export function createNarrativeEntryForPurchase(name: string): NarrativeEntry | null {
  const lifecycle = getItemLifecycle(name);
  if (lifecycle === '解锁剧情') {
    const story = 特殊剧情.find(item => item.名称 === name);
    const seed = storyRumorSeeds[name];
    if (!story || !seed) return null;
    return {
      key: story.名称,
      status: {
        类型: '剧情钥匙',
        状态: '可追查',
        风声ID: seed.id,
        关联名称: story.名称,
        关联NPC: story.NPC,
        推荐场景: [...story.推荐场景],
        触发次数: 0,
      },
      rumor: {
        id: seed.id,
        来源: '剧情钥匙',
        地点: seed.地点,
        子区域: seed.子区域 ?? '',
        相关NPC: [story.NPC],
        紧急度: '中',
        风声文本: seed.风声文本,
        故事钩子: seed.故事钩子,
        状态: '未读',
      },
    };
  }

  if (lifecycle === '解锁场景') {
    const scene = 特殊场景.find(item => item.名称 === name);
    if (!scene) return null;
    return {
      key: scene.名称,
      status: {
        类型: '场景令牌',
        状态: '可追查',
        风声ID: sceneId(scene.名称),
        关联名称: scene.名称,
        推荐场景: [scene.名称],
        触发次数: 0,
      },
      rumor: {
        id: sceneId(scene.名称),
        来源: '场景令牌',
        地点: scene.名称,
        子区域: '',
        相关NPC: [...scene.关联NPC],
        紧急度: '低',
        风声文本: scene.风声钩子,
        故事钩子: scene.进入理由,
        状态: '未读',
      },
    };
  }

  return null;
}

export function insertEntryRumor<T extends { id?: string; 来源?: string; 状态?: string }>(current: T[], rumor: T): T[] {
  if (current.some(item => item.id === rumor.id)) return current;
  if (current.length < 3) return [...current, rumor];
  const replaceIndex = current.findIndex(item => item.状态 !== '追查中' && item.来源 !== '剧情钥匙' && item.来源 !== '场景令牌');
  if (replaceIndex < 0) return current;
  return [...current.slice(0, replaceIndex), ...current.slice(replaceIndex + 1), rumor];
}

export function hasPendingPurchase(actions: Array<{ 类型?: string; 道具?: string }>, name: string): boolean {
  return actions.some(action => action.类型 === '购买物品' && action.道具 === name);
}

export function getStoryRumorSeed(name: string) {
  return storyRumorSeeds[name];
}
