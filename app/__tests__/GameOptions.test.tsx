import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../lib/theme";
import GameOptionsScreen from "../../app/game/[id]/options";
import * as generator from "../../lib/generator";
import { fetchGames } from "../../lib/gamesApi";
import { useGeneratedNumbersStore } from "../../stores/useGeneratedNumbersStore";
import { useGamesStore } from "../../stores/useGamesStore";

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        SUPABASE_URL: "https://test.supabase",
        SUPABASE_ANON_KEY: "anon-test-key",
      },
    },
  },
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn() }),
  useLocalSearchParams: () => ({ id: "1" }),
}));

jest.mock("../../lib/generator");
jest.mock("../../lib/gamesApi");

const fetchGamesMock = fetchGames as jest.Mock;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </PaperProvider>
);

describe("GameOptionsScreen", () => {
  beforeEach(async () => {
    (generator.generateSet as jest.Mock).mockReset();
    (generator.generateSet as jest.Mock)
      .mockReturnValueOnce([1, 2, 3, 4, 5, 6, 7])
      .mockReturnValueOnce([8]);
    useGeneratedNumbersStore.setState({ sets: {} });
    fetchGamesMock.mockResolvedValue([
      {
        id: "1",
        name: "Powerball",
        logoUrl: "",
        jackpot: "$0",
        mainMax: 35,
        mainCount: 7,
        suppCount: null,
        suppMax: null,
        powerballMax: 20,
      },
    ]);
    const games = await fetchGames();
    useGamesStore.setState({ games });
  });

  test("generates and displays numbers", () => {
    const { getByText } = render(<GameOptionsScreen />, { wrapper: Wrapper });
    expect(getByText("Pick 7 main + Powerball")).toBeTruthy();
    fireEvent.press(getByText("Generate Numbers"));
    expect(getByText("Main: 1 - 2 - 3 - 4 - 5 - 6 - 7")).toBeTruthy();
    expect(getByText("Powerball: 8")).toBeTruthy();
  });

  test("uses configuration from the API", async () => {
    fetchGamesMock.mockResolvedValueOnce([
      {
        id: "1",
        name: "Powerball",
        logoUrl: "",
        jackpot: "$0",
        mainMax: 40,
        mainCount: 8,
        suppCount: 2,
        suppMax: 40,
        powerballMax: 20,
      },
    ]);
    const games = await fetchGames();
    useGamesStore.setState({ games });
    const { getByText } = render(<GameOptionsScreen />, { wrapper: Wrapper });
    expect(getByText("Pick 8 main + 2 supp + Powerball")).toBeTruthy();
  });
});
