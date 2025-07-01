import React from "react";
import { render } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../src/lib/theme";
import LoginScreen from "../../app/login";

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
  useRouter: () => ({ back: jest.fn() }),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </PaperProvider>
);

test("renders sign in screen", () => {
  const { getAllByText } = render(<LoginScreen />, { wrapper: Wrapper });
  expect(getAllByText("Sign In").length).toBeGreaterThan(0);
  expect(getAllByText("Sign Up").length).toBeGreaterThan(0);
});
