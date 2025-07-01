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

// Avoid requiring the real expo-router module in tests
jest.mock("expo-router", () => ({ useRouter: () => ({ push: jest.fn() }) }));

// Simplify native modules that rely on browser APIs
jest.mock("expo-status-bar", () => ({ StatusBar: () => null }));

// Mock PNG logo import used in components
jest.mock("../../assets/logo.png", () => 1);
jest.mock("../../assets/coming_soon_usa.png", () => 2);
jest.mock("../../assets/coming_soon_eur.png", () => 3);

import React from "react";
import { render } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../src/lib/theme"; // ← correct import name
import IndexScreen from "../../app/index";
import { useRegionStore } from "../../src/stores/useRegionStore";

test("renders default region label", () => {
  const tree = render(
    <PaperProvider>
      <ThemeProvider>
        <IndexScreen />
      </ThemeProvider>
    </PaperProvider>,
  );
  // Assert on visible UI text rather than accessibility label
  expect(tree.getByText("Australia")).toBeTruthy();
});

test("shows coming soon screen for US region", () => {
  useRegionStore.setState({
    region: "US",
    setRegion: (r) => useRegionStore.setState({ region: r }),
  });
  const tree = render(
    <PaperProvider>
      <ThemeProvider>
        <IndexScreen />
      </ThemeProvider>
    </PaperProvider>,
  );
  expect(tree.getByLabelText("USA coming soon")).toBeTruthy();
});
