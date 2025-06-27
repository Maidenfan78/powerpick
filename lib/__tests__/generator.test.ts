import { generateSet } from "../generator";
import { getGameConfig } from "../gameConfigs";

test("generateSet returns numbers within range", () => {
  const seq = [0.24, 0.34, 0.44, 0.54, 0.64, 0.74];
  let i = 0;
  const rand = () => seq[i++ % seq.length];
  const nums = generateSet({ maxNumber: 10, pickCount: 3 }, rand);
  expect(nums).toEqual([3, 4, 5]);
  expect(nums.every((n) => n >= 1 && n <= 10)).toBe(true);
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
