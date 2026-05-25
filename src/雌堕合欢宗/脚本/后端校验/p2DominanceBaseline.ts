import _ from 'lodash';

const NPC列表 = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'] as const;

function getTrainingRecordIds(data: Record<string, any>): string[] {
  const records = _.get(data, '牝奴.调教记录', []);
  if (!Array.isArray(records)) return [];
  return records.map(record => (_.isPlainObject(record) && typeof record.id === 'string' ? record.id : '')).filter(Boolean);
}

function hasSameTrainingRecords(a: Record<string, any>, b: Record<string, any>): boolean {
  const aIds = getTrainingRecordIds(a);
  const bIds = getTrainingRecordIds(b);
  return aIds.length > 0 && aIds.length === bIds.length && aIds.every((id, index) => id === bIds[index]);
}

function dominanceTotal(data: Record<string, any>): number {
  return NPC列表.reduce((sum, npc) => sum + Number(_.get(data, `牝奴.支配次数.${npc}`, 0) || 0), 0);
}

function hasLowerDominance(candidate: Record<string, any>, target: Record<string, any>): boolean {
  return NPC列表.some(npc => Number(_.get(candidate, `牝奴.支配次数.${npc}`, 0) || 0) < Number(_.get(target, `牝奴.支配次数.${npc}`, 0) || 0));
}

function findNonEmptyLedgerCandidate(input: {
  newData: Record<string, any>;
  eventOldData: Record<string, any>;
  candidateHistory: Record<string, any>[];
}): Record<string, any> | null {
  if (getTrainingRecordIds(input.newData).length > 0 || getTrainingRecordIds(input.eventOldData).length > 0) return null;

  return input.candidateHistory.find(candidate => (
    _.isPlainObject(candidate)
    && _.get(candidate, '系统.阶段') === '牝奴期'
    && getTrainingRecordIds(candidate).length > 0
  )) ?? null;
}

export function selectP2DominanceBaseline(input: {
  newData: Record<string, any>;
  eventOldData: Record<string, any>;
  candidateHistory: Record<string, any>[];
}): Record<string, any> {
  if (_.get(input.newData, '系统.阶段') !== '牝奴期') return input.eventOldData;
  const nonEmptyLedgerCandidate = findNonEmptyLedgerCandidate(input);
  if (nonEmptyLedgerCandidate) return nonEmptyLedgerCandidate;
  if (!hasSameTrainingRecords(input.newData, input.eventOldData)) return input.eventOldData;

  const lowerCandidates = input.candidateHistory
    .filter(candidate => _.isPlainObject(candidate))
    .filter(candidate => hasSameTrainingRecords(input.newData, candidate))
    .filter(candidate => hasLowerDominance(candidate, input.newData));

  if (lowerCandidates.length === 0) return input.eventOldData;
  return lowerCandidates.reduce((best, candidate) => (dominanceTotal(candidate) < dominanceTotal(best) ? candidate : best));
}
