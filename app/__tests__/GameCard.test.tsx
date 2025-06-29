import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Image, ActivityIndicator } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../lib/theme";
import GameCard from "../../components/GameCard";
import { fetchRecentDraws } from "../../lib/gamesApi";

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

jest.mock("../../lib/gamesApi");

const fetchRecentDrawsMock = fetchRecentDraws as jest.Mock;

jest.mock("../../assets/placeholder.png", () => 1);

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </PaperProvider>
);

describe("GameCard", () => {
  const baseGame = {
    id: "1",
    name: "Powerball",
    logoUrl: "http://example.com/logo.png",
    jackpot: "$1,000",
    nextDrawTime: "2025-07-01T10:00:00Z",
    mainMax: null,
    mainCount: null,
    suppCount: null,
    suppMax: null,
    powerballMax: null,
    fromDrawNumber: 1,
  };

  beforeEach(() => {
    fetchRecentDrawsMock.mockResolvedValue([
      {
        draw_number: 1,
        draw_date: "2024-01-01",
        winning_numbers: [1, 2, 3],
      },
    ]);
  });

  test("renders jackpot and handles press", async () => {
    const onPress = jest.fn();
    const { getByText, getByRole } = render(
      <GameCard game={baseGame} onPress={onPress} />,
      { wrapper: Wrapper },
    );

    expect(getByText("$1,000")).toBeTruthy();
    expect(getByText(/Next:/)).toBeTruthy();
    await waitFor(() => expect(getByText(/Last #1/)).toBeTruthy());
    fireEvent.press(getByRole("button"));
    expect(onPress).toHaveBeenCalled();
  });

  test("shows placeholder when no logo url", () => {
    const { UNSAFE_getByType } = render(
      <GameCard game={{ ...baseGame, logoUrl: "" }} onPress={() => {}} />,
      { wrapper: Wrapper },
    );

    expect(UNSAFE_getByType(Image).props.source).toBe(1);
  });

  test("does not render ActivityIndicator when logo url empty", () => {
    const { UNSAFE_queryByType } = render(
      <GameCard game={{ ...baseGame, logoUrl: "" }} onPress={() => {}} />,
      { wrapper: Wrapper },
    );

    expect(UNSAFE_queryByType(ActivityIndicator)).toBeNull();
  });
});
