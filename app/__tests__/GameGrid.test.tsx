import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../src/lib/theme";
import GameGrid from "../../src/components/GameGrid";
import { fetchRecentDraws } from "../../src/lib/gamesApi";

jest.mock("../../src/lib/gamesApi");

const fetchRecentDrawsMock = fetchRecentDraws as jest.Mock;

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

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </PaperProvider>
);

describe("GameGrid", () => {
  const games = [
    {
      id: "1",
      name: "Game 1",
      logoUrl: "url1",
      jackpot: "$1",
      nextDrawTime: null,
      mainMax: null,
      mainCount: null,
      suppCount: null,
      suppMax: null,
      powerballMax: null,
      fromDrawNumber: 1,
    },
    {
      id: "2",
      name: "Game 2",
      logoUrl: "url2",
      jackpot: "$2",
      nextDrawTime: null,
      mainMax: null,
      mainCount: null,
      suppCount: null,
      suppMax: null,
      powerballMax: null,
      fromDrawNumber: 2,
    },
  ];

  beforeEach(() => {
    fetchRecentDrawsMock.mockResolvedValue([]);
  });

  test("renders games and triggers selection", () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      <GameGrid games={games} onSelectGame={onSelect} />,
      { wrapper: Wrapper },
    );

    fireEvent.press(getByLabelText("Open Game 2 options"));
    expect(onSelect).toHaveBeenCalledWith(games[1]);
  });
});
