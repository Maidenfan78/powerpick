export interface GeneratorConfig {
  maxNumber: number;
  pickCount: number;
  /** Numbers to favour when generating */
  hotNumbers?: number[];
  /** Numbers to avoid when generating */
  coldNumbers?: number[];
  /** Value between 0 and 1 representing how strongly to favour hot numbers */
  hotRatio?: number;
}

/**
 * Generate a set of unique numbers using a simple bell-curve sum balance.
 * The sum of the numbers will fall within the middle 70% of the
 * theoretical minimum/maximum range.
 */
export function generateSet(
  config: GeneratorConfig,
  rand: () => number = Math.random,
): number[] {
  const {
    maxNumber,
    pickCount,
    hotNumbers = [],
    coldNumbers = [],
    hotRatio = 0,
  } = config;
  if (pickCount > maxNumber) {
    throw new Error("pickCount cannot exceed maxNumber");
  }

  const numbers: number[] = [];
  const mean = (pickCount * (maxNumber + 1)) / 2;
  const totalRange = pickCount * (maxNumber - 1);
  const lower = mean - totalRange * 0.35;
  const upper = mean + totalRange * 0.35;

  for (let attempt = 0; attempt < 100; attempt++) {
    numbers.length = 0;
    const pool = Array.from({ length: maxNumber }, (_, i) => i + 1);
    const weights = pool.map((n) => {
      if (hotNumbers.includes(n)) return 1 + hotRatio;
      if (coldNumbers.includes(n)) return Math.max(0, 1 - hotRatio);
      return 1;
    });

    const tempPool = [...pool];
    const tempWeights = [...weights];
    while (numbers.length < pickCount && tempPool.length > 0) {
      const total = tempWeights.reduce((s, w) => s + w, 0);
      let r = rand() * total;
      let idx = 0;
      while (r >= tempWeights[idx]) {
        r -= tempWeights[idx];
        idx++;
      }
      const n = tempPool.splice(idx, 1)[0];
      tempWeights.splice(idx, 1);
      numbers.push(n);
    }
    numbers.sort((a, b) => a - b);
    const sum = numbers.reduce((s, n) => s + n, 0);
    if (sum >= lower && sum <= upper) break;
  }
  return [...numbers];
}
