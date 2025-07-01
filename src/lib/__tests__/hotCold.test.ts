import { calculateHotColdNumbers } from "../hotCold";

test("calculateHotColdNumbers returns top and bottom numbers", () => {
  const draws = [
    [1, 2, 3],
    [1, 2, 4],
    [1, 3, 5],
  ];
  const { hot, cold } = calculateHotColdNumbers(draws, 5, 40);
  expect(hot).toEqual([1, 2]);
  expect(cold).toEqual([4, 5]);
});
