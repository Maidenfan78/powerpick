import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../../src/lib/theme";
import RegionPicker from "../../src/components/RegionPicker";
import { useRegionStore } from "../../src/stores/useRegionStore";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </PaperProvider>
);

describe("RegionPicker", () => {
  beforeEach(() => {
    useRegionStore.setState({
      region: "AU",
      setRegion: (r) => useRegionStore.setState({ region: r }),
    });
  });

  test("changes region when option selected", async () => {
    const { getByText, queryByText } = render(<RegionPicker />, {
      wrapper: Wrapper,
    });
    fireEvent.press(getByText("Australia"));

    const option = getByText("USA");
    fireEvent.press(option, { stopPropagation: jest.fn() });

    await waitFor(() => expect(useRegionStore.getState().region).toBe("US"));
    expect(queryByText("Australia")).toBeNull();
    expect(getByText("USA")).toBeTruthy();
  });

  test("selecting option only sets region once", async () => {
    const setRegionMock = jest.fn((r) =>
      useRegionStore.setState({ region: r }),
    );
    useRegionStore.setState({ setRegion: setRegionMock });

    const { getByText } = render(<RegionPicker />, { wrapper: Wrapper });

    fireEvent.press(getByText("Australia"));
    fireEvent.press(getByText("USA"), { stopPropagation: jest.fn() });

    await waitFor(() => expect(useRegionStore.getState().region).toBe("US"));
    expect(setRegionMock).toHaveBeenCalledTimes(1);
  });
});
