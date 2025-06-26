// lib/testUtils.tsx
import React from "react";
import {
  render as rtlRender,
  RenderOptions,
} from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";

function render(ui: React.ReactElement, options?: RenderOptions) {
  return rtlRender(<PaperProvider>{ui}</PaperProvider>, options);
}

export * from "@testing-library/react-native";
export { render };
