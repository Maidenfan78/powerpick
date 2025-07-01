import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGeneratedNumbersStore } from "../../stores/useGeneratedNumbersStore";

beforeEach(() => {
  useGeneratedNumbersStore.setState({ sets: {} });
  (AsyncStorage.setItem as jest.Mock).mockClear();
});

test("saveNumbers stores sets per game", async () => {
  useGeneratedNumbersStore.getState().saveNumbers("1", [1, 2, 3]);
  await new Promise((r) => setTimeout(r, 0));
  expect(useGeneratedNumbersStore.getState().sets["1"]).toEqual([[1, 2, 3]]);
});
