import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../lib/theme";
import GameOptionsScreen from "../../app/game/[id]/options";
import * as generator from "../../lib/generator";
import { useGeneratedNumbersStore } from "../../stores/useGeneratedNumbersStore";
import { useGamesStore } from "../../stores/useGamesStore";

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn() }),
  useLocalSearchParams: () => ({ id: "1" }),
}));

jest.mock("../../lib/generator");

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </PaperProvider>
);

describe("GameOptionsScreen", () => {
  beforeEach(() => {
    (generator.generateSet as jest.Mock).mockReset();
    (generator.generateSet as jest.Mock)
      .mockReturnValueOnce([1, 2, 3, 4, 5, 6, 7])
      .mockReturnValueOnce([8]);
    useGeneratedNumbersStore.setState({ sets: {} });
    useGamesStore.setState({
      games: [{ id: "1", name: "Powerball", logoUrl: "", jackpot: "$0" }],
    });
  });

  test("generates and displays numbers", () => {
    const { getByText } = render(<GameOptionsScreen />, { wrapper: Wrapper });
    expect(getByText("Pick 7 main + Powerball")).toBeTruthy();
    fireEvent.press(getByText("Generate Numbers"));
    expect(getByText("1 - 2 - 3 - 4 - 5 - 6 - 7 - 8")).toBeTruthy();
  });
});
