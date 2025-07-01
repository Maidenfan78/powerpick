import { generateSet } from "../generator";
import { getGameConfig } from "../gameConfigs";

test("generateSet returns numbers within range", () => {
  const seq = [0.24, 0.34, 0.44, 0.54, 0.64, 0.74];
  let i = 0;
  const rand = () => seq[i++ % seq.length];
  const nums = generateSet({ maxNumber: 10, pickCount: 3 }, rand);
  expect(nums).toEqual([3, 5, 6]);
  expect(nums.every((n) => n >= 1 && n <= 10)).toBe(true);
});

test("generateSet favors hot numbers when ratio is 1", () => {
  const rand = () => 0.5;
  const nums = generateSet(
    { maxNumber: 10, pickCount: 3, hotNumbers: [1, 2, 3], hotRatio: 1 },
    rand,
  );
  const hotCount = nums.filter((n) => [1, 2, 3].includes(n)).length;
  expect(hotCount).toBeGreaterThanOrEqual(1);
});

test("generateSet throws when pickCount exceeds maxNumber", () => {
  expect(() => generateSet({ maxNumber: 3, pickCount: 5 })).toThrow(
    "pickCount cannot exceed maxNumber",
  );
});

test("getGameConfig handles mixed-case names and aliases", () => {
  const canonical = getGameConfig("Powerball");
  expect(getGameConfig("powerball")).toEqual(canonical);
  expect(getGameConfig("PoWeRbAlL")).toEqual(canonical);
  expect(getGameConfig("sat lotto")).toEqual(getGameConfig("Saturday Lotto"));
});

test("generateSet respects windowPct parameter", () => {
  const rand = () => 0.5;
  const cfg = { maxNumber: 20, pickCount: 5 };

  const mean = (cfg.pickCount * (cfg.maxNumber + 1)) / 2;
  const totalRange = cfg.pickCount * (cfg.maxNumber - 1);
  const check = (sum: number, pct: number) => {
    const hw = pct / 2;
    const lower = mean - totalRange * hw;
    const upper = mean + totalRange * hw;
    expect(sum).toBeGreaterThanOrEqual(lower);
    expect(sum).toBeLessThanOrEqual(upper);
  };

  const s70 = generateSet({ ...cfg }, rand).reduce((a, b) => a + b, 0);
  check(s70, 0.7);
  const s50 = generateSet({ ...cfg, windowPct: 0.5 }, rand).reduce(
    (a, b) => a + b,
    0,
  );
  check(s50, 0.5);
  const s90 = generateSet({ ...cfg, windowPct: 0.9 }, rand).reduce(
    (a, b) => a + b,
    0,
  );
  check(s90, 0.9);
});
