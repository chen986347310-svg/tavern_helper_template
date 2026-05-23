import { 永久丹药, NSFW道具, 特殊道具, 牝奴道具 } from './items';
import { 服装列表, 牝奴服装列表 } from './outfits';
import { 特殊场景, 特殊剧情 } from './scenes';

export type ItemLifecycle = '可装备' | '目标消耗' | '自用消耗' | '解锁场景' | '解锁剧情' | '购买即生效' | '未知';

const 服装名称 = new Set([...服装列表, ...牝奴服装列表].map(item => item.名称));
const 装备名称 = new Set([...NSFW道具, ...牝奴道具].map(item => item.名称));
const 永久丹药名称 = new Set(永久丹药.map(item => item.名称));
const 自用消耗名称 = new Set(特殊道具.filter(item => item.名称 !== '改变阵法').map(item => item.名称));
const 场景名称 = new Set(特殊场景.map(item => item.名称));
const 剧情名称 = new Set(特殊剧情.map(item => item.NPC));

export function getItemLifecycle(name: string): ItemLifecycle {
  if (name === '改变阵法') return '购买即生效';
  if (场景名称.has(name)) return '解锁场景';
  if (剧情名称.has(name)) return '解锁剧情';
  if (永久丹药名称.has(name)) return '目标消耗';
  if (自用消耗名称.has(name)) return '自用消耗';
  if (服装名称.has(name) || 装备名称.has(name)) return '可装备';
  return '未知';
}

export function itemRequiresTarget(name: string): boolean {
  return getItemLifecycle(name) === '目标消耗';
}

export function isConsumableLifecycle(name: string): boolean {
  const lifecycle = getItemLifecycle(name);
  return lifecycle === '目标消耗' || lifecycle === '自用消耗';
}

export function isEquippableLifecycle(name: string): boolean {
  return getItemLifecycle(name) === '可装备';
}
