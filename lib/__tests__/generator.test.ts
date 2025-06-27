import { generateSet } from "../generator";

test("generateSet returns numbers within range", () => {
  const seq = [0.24, 0.34, 0.44, 0.54, 0.64, 0.74];
  let i = 0;
  const rand = () => seq[i++ % seq.length];
  const nums = generateSet({ maxNumber: 10, pickCount: 3 }, rand);
  expect(nums).toEqual([3, 4, 5]);
  expect(nums.every((n) => n >= 1 && n <= 10)).toBe(true);
});
