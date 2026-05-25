import { NSFW道具, 永久丹药, 特殊道具 } from './items';
import { 服装列表 } from './outfits';
import { 特殊场景, 特殊剧情 } from './scenes';

export type NpcName = '白芷' | '苏芸' | '纪兰' | '沈月秋' | '柳素衣';

const outfitByName = new Map(服装列表.map(outfit => [outfit.名称, outfit]));
const contrabandByName = new Map(NSFW道具.map(item => [item.名称, item]));
const pillByName = new Map(永久丹药.map(item => [item.名称, item]));
const sceneByName = new Map(特殊场景.map(scene => [scene.名称, scene]));
const storyByName = new Map(特殊剧情.map(story => [story.名称, story]));
const specialByName = new Map(特殊道具.map(special => [special.名称, special]));

export function getItemDisplayName(logicName: string): string {
  return outfitByName.get(logicName)?.显示名 ?? contrabandByName.get(logicName)?.显示名 ?? pillByName.get(logicName)?.显示名 ?? sceneByName.get(logicName)?.显示名 ?? storyByName.get(logicName)?.显示名 ?? specialByName.get(logicName)?.显示名 ?? logicName;
}

export function getItemShortHint(logicName: string): string {
  return outfitByName.get(logicName)?.AI短提示 ?? contrabandByName.get(logicName)?.AI短提示 ?? pillByName.get(logicName)?.AI短提示 ?? sceneByName.get(logicName)?.AI短提示 ?? storyByName.get(logicName)?.AI短提示 ?? specialByName.get(logicName)?.AI短提示 ?? '';
}

export function getStoryNpc(logicName: string): string {
  return storyByName.get(logicName)?.NPC ?? '';
}

export function getStoryTheme(logicName: string): string {
  return storyByName.get(logicName)?.秘密主题 ?? '';
}

export function getStoryLine(logicName: string): string {
  return storyByName.get(logicName)?.剧情线 ?? '';
}

export function getOutfitFloor(logicName: string): string {
  return outfitByName.get(logicName)?.楼层 ?? '';
}

export function getContrabandTier(logicName: string): string {
  return contrabandByName.get(logicName)?.器阶 ?? '';
}

export function getContrabandBodyPart(logicName: string): string {
  return contrabandByName.get(logicName)?.作用部位 ?? '';
}

export function getPillCategory(logicName: string): string {
  return pillByName.get(logicName)?.分类 ?? '';
}

export function getPillEffectLine(logicName: string): string {
  return pillByName.get(logicName)?.作用线 ?? '';
}

export function getExclusiveOutfitNpc(logicName: string): NpcName | undefined {
  return outfitByName.get(logicName)?.专属NPC;
}

export function isPlayerOnlyOutfit(logicName: string): boolean {
  return outfitByName.get(logicName)?.适用对象 === '玩家';
}

export function isExclusiveOutfitUnlocked(logicName: string, npcData: Record<string, { 状态?: string; 攻略值?: number }>): boolean {
  const npc = getExclusiveOutfitNpc(logicName);
  if (!npc) return true;
  const data = npcData[npc];
  return data?.状态 === '已完成' || (data?.攻略值 ?? 0) >= 100;
}

export function sortEquipmentForDisplay(items: readonly string[]): string[] {
  return [...items].sort((a, b) => {
    const aExclusive = getExclusiveOutfitNpc(a) ? 0 : 1;
    const bExclusive = getExclusiveOutfitNpc(b) ? 0 : 1;
    return aExclusive - bExclusive;
  });
}
