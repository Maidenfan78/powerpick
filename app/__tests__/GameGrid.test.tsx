import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../lib/theme";
import GameGrid from "../../components/GameGrid";

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
      mainMax: null,
      mainCount: null,
      suppCount: null,
      suppMax: null,
      powerballMax: null,
      fromDrawNumber: 2,
    },
  ];

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
