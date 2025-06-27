export interface GeneratorConfig {
  maxNumber: number;
  pickCount: number;
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
  const { maxNumber, pickCount } = config;
  const numbers: number[] = [];
  const mean = (pickCount * (maxNumber + 1)) / 2;
  const totalRange = pickCount * (maxNumber - 1);
  const lower = mean - totalRange * 0.35;
  const upper = mean + totalRange * 0.35;

  for (let attempt = 0; attempt < 100; attempt++) {
    numbers.length = 0;
    while (numbers.length < pickCount) {
      const n = Math.floor(rand() * maxNumber) + 1;
      if (!numbers.includes(n)) numbers.push(n);
    }
    numbers.sort((a, b) => a - b);
    const sum = numbers.reduce((s, n) => s + n, 0);
    if (sum >= lower && sum <= upper) break;
  }
  return [...numbers];
}
