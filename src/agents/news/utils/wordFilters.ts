
const COMMON_WORDS = new Set([
  'THE', 'AND', 'FOR', 'NEW', 'NOW', 'HOW', 'WHY', 'WHO', 'WHAT', 'WHEN',
  'CEO', 'CFO', 'IPO', 'USA', 'FDA', 'SEC', 'ETF', 'GDP'
]);

export const isCommonWord = (word: string): boolean => {
  return COMMON_WORDS.has(word);
};
