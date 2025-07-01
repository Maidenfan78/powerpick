import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../src/lib/theme";
import DrawsScreen from "../../app/game/[id]/draws";
import { fetchRecentDraws } from "../../src/lib/gamesApi";
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

const fetchRecentDrawsMock = fetchRecentDraws as jest.Mock;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </PaperProvider>
);

describe("DrawsScreen", () => {
  beforeEach(() => {
    fetchRecentDrawsMock.mockResolvedValue([
      {
        draw_number: 1,
        draw_date: "2024-01-01",
        winning_numbers: [1, 2, 3],
        supplementary_numbers: [4],
        powerball: 5,
      },
    ]);
    useGamesStore.setState({
      games: [
        {
          id: "1",
          name: "Powerball",
          logoUrl: "",
          jackpot: "$0",
          nextDrawTime: null,
          mainMax: 35,
          mainCount: 7,
          suppCount: 1,
          suppMax: 40,
          powerballMax: 20,
          fromDrawNumber: 1,
        },
      ],
    });
  });

  test("displays supplementary numbers and powerball", async () => {
    const { getByText } = render(<DrawsScreen />, { wrapper: Wrapper });
    await waitFor(() =>
      expect(
        getByText("#1 - 2024-01-01 - 1 - 2 - 3 - Supp: 4 - Powerball: 5"),
      ).toBeTruthy(),
    );
  });
});
