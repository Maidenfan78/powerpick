import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Image, ActivityIndicator } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../lib/theme";
import GameCard from "../../components/GameCard";

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
    mainMax: null,
    mainCount: null,
    suppCount: null,
    suppMax: null,
    powerballMax: null,
  };

  test("renders jackpot and handles press", () => {
    const onPress = jest.fn();
    const { getByText, getByRole } = render(
      <GameCard game={baseGame} onPress={onPress} />,
      { wrapper: Wrapper },
    );

    expect(getByText("$1,000")).toBeTruthy();
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
