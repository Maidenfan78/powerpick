import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../src/lib/theme";
import HotColdScreen from "../../app/game/[id]/hotcold";
import { fetchHotColdNumbers, fetchRecentDraws } from "../../src/lib/gamesApi";
import { useGamesStore } from "../../src/stores/useGamesStore";

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        EXPO_PUBLIC_SUPABASE_URL: "https://test.supabase",
        EXPO_PUBLIC_SUPABASE_ANON_KEY: "anon-test-key",
      },
    },
  },
}));

jest.mock("expo-router", () => ({
  __esModule: true,
  useLocalSearchParams: () => ({ id: "1" }),
}));

jest.mock("../../src/lib/gamesApi");

const fetchHotColdMock = fetchHotColdNumbers as jest.Mock;
const fetchDrawsMock = fetchRecentDraws as jest.Mock;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </PaperProvider>
);

describe("HotColdScreen", () => {
  beforeEach(() => {
    fetchHotColdMock.mockResolvedValue({ mainHot: [], mainCold: [] });
    fetchDrawsMock.mockResolvedValue([
      {
        draw_number: 1,
        draw_date: "2024-01-01",
        winning_numbers: [1, 2, 3],
      },
      {
        draw_number: 2,
        draw_date: "2024-01-02",
        winning_numbers: [1, 4, 5],
      },
    ]);
    useGamesStore.setState({
      games: [
        {
          id: "1",
          name: "Test",
          logoUrl: "",
          jackpot: "$0",
          nextDrawTime: null,
          mainMax: 5,
          mainCount: 3,
          suppCount: null,
          suppMax: null,
          powerballMax: null,
          fromDrawNumber: 1,
        },
      ],
    });
  });

  test("falls back to calculating numbers from recent draws", async () => {
    const { getByText } = render(<HotColdScreen />, { wrapper: Wrapper });
    await waitFor(() => expect(getByText("Hot: 1")).toBeTruthy());
    expect(getByText("Cold: 5")).toBeTruthy();
  });
});
