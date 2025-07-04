import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../src/lib/theme";
import GameOptionsScreen from "../../app/game/[id]/options";
import * as generator from "../../src/lib/generator";
import { fetchGames } from "../../src/lib/gamesApi";
import { useGeneratedNumbersStore } from "../../src/stores/useGeneratedNumbersStore";
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

jest.mock("expo-router", () => {
  const push = jest.fn();
  return {
    __esModule: true,
    useRouter: () => ({ back: jest.fn(), push }),
    useLocalSearchParams: () => ({ id: "1" }),
    pushMock: push,
  };
});
import { pushMock } from "expo-router";

jest.mock("../../src/lib/generator");
jest.mock("../../src/lib/gamesApi");

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
        nextDrawTime: null,
        mainMax: 35,
        mainCount: 7,
        suppCount: null,
        suppMax: null,
        powerballMax: 20,
        fromDrawNumber: 100,
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

  test("generates multiple sets when set count changed", () => {
    (generator.generateSet as jest.Mock)
      .mockReturnValueOnce([1, 2, 3, 4, 5, 6, 7])
      .mockReturnValueOnce([8])
      .mockReturnValueOnce([9, 10, 11, 12, 13, 14, 15])
      .mockReturnValueOnce([16]);
    const { getByText, getByLabelText } = render(<GameOptionsScreen />, {
      wrapper: Wrapper,
    });
    const countSlider = getByLabelText("Set count");
    fireEvent(countSlider, "valueChange", 2);
    fireEvent.press(getByText("Generate Numbers"));
    expect(getByText("Set 1")).toBeTruthy();
    expect(getByText("Set 2")).toBeTruthy();
  });

  test("uses configuration from the API", async () => {
    fetchGamesMock.mockResolvedValueOnce([
      {
        id: "1",
        name: "Powerball",
        logoUrl: "",
        jackpot: "$0",
        nextDrawTime: null,
        mainMax: 40,
        mainCount: 8,
        suppCount: 2,
        suppMax: 40,
        powerballMax: 20,
        fromDrawNumber: 100,
      },
    ]);
    const games = await fetchGames();
    useGamesStore.setState({ games });
    const { getByText } = render(<GameOptionsScreen />, { wrapper: Wrapper });
    expect(getByText("Pick 8 main + 2 supp + Powerball")).toBeTruthy();
  });
  test("hot ratio slider is disabled when auto is on", () => {
    const { getByLabelText } = render(<GameOptionsScreen />, {
      wrapper: Wrapper,
    });
    const ratio = getByLabelText("Hot cold ratio");
    expect(ratio.props.disabled).toBe(true);
  });

  test("hot percent slider is disabled when auto is on", () => {
    const { getByLabelText } = render(<GameOptionsScreen />, {
      wrapper: Wrapper,
    });
    const percent = getByLabelText("Hot cold percent");
    expect(percent.props.disabled).toBe(true);
  });

  test("set count slider is rendered", () => {
    const { getByLabelText } = render(<GameOptionsScreen />, {
      wrapper: Wrapper,
    });
    expect(getByLabelText("Set count")).toBeTruthy();
  });

  test("sliders can be adjusted when auto is off", () => {
    const { getByLabelText } = render(<GameOptionsScreen />, {
      wrapper: Wrapper,
    });
    const toggle = getByLabelText("Auto toggle");
    fireEvent(toggle, "valueChange", false);
    const ratio = getByLabelText("Hot cold ratio");
    fireEvent(ratio, "valueChange", 60);
    expect(ratio.props.value).toBe(60);
  });

  test("navigation buttons are rendered", () => {
    const { getByText } = render(<GameOptionsScreen />, { wrapper: Wrapper });
    expect(getByText("Last 10 Draws")).toBeTruthy();
    expect(getByText("Hot & Cold Numbers")).toBeTruthy();
  });

  test("download buttons appear after generating", () => {
    const { getByText, queryByText } = render(<GameOptionsScreen />, {
      wrapper: Wrapper,
    });
    expect(queryByText("Download CSV")).toBeNull();
    fireEvent.press(getByText("Generate Numbers"));
    expect(getByText("Download CSV")).toBeTruthy();
    expect(getByText("Download TXT")).toBeTruthy();
    expect(getByText("Download XLSX")).toBeTruthy();
  });

  test("pressing navigation buttons pushes routes", () => {
    const { getByText } = render(<GameOptionsScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText("Last 10 Draws"));
    fireEvent.press(getByText("Hot & Cold Numbers"));
    expect(pushMock).toHaveBeenCalledWith("/game/1/draws");
    expect(pushMock).toHaveBeenCalledWith("/game/1/hotcold");
  });
});
