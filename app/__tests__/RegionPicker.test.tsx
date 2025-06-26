import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../lib/theme";
import RegionPicker from "../../components/RegionPicker";
import { useRegionStore } from "../../stores/useRegionStore";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </PaperProvider>
);

describe("RegionPicker", () => {
  beforeEach(() => {
    useRegionStore.setState({ region: "AU" });
  });

  test("changes region when option selected", async () => {
    const { getByText, queryByText } = render(<RegionPicker />, {
      wrapper: Wrapper,
    });
    fireEvent.press(getByText("Australia"));

    const option = getByText("USA");
    fireEvent.press(option);

    await waitFor(() => expect(useRegionStore.getState().region).toBe("US"));
    expect(queryByText("Australia")).toBeNull();
    expect(getByText("USA")).toBeTruthy();
  });
});
