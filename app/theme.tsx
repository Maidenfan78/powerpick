// app/_theme.tsx
// -----------------------------------------------------------------------------
// Central theme context (light / dark + Colour‑Vision Deficiency toggle)
// -----------------------------------------------------------------------------
// Usage:
//   import { useTheme } from "../app/_theme";
//   const { tokens, toggleCvd } = useTheme();
//
// * Never import tokens.json directly in components – always go through context
// * The leading underscore keeps Expo Router from treating this as a route file
// -----------------------------------------------------------------------------
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseTokens from "./tokens.json";

/* -------------------------------------------------------------------------- */
/*                              Type definitions                               */
/* -------------------------------------------------------------------------- */

export type ColorScheme = "light" | "dark"; // OS‑reported scheme

export interface ThemePalette {
  tokens: typeof baseTokens;
  scheme: ColorScheme;
  isCvd: boolean; // Colour‑Vision Deficiency flag
}

export interface ThemeContextValue extends ThemePalette {
  toggleCvd: () => void;
}

/* -------------------------------------------------------------------------- */
/*                               Core helpers                                  */
/* -------------------------------------------------------------------------- */

/** Deep‑clone tokens then mutate according to scheme + cvd */
const buildPalette = (scheme: ColorScheme, isCvd: boolean): ThemePalette => {
  // Modern JS environments have structuredClone; fall back to JSON copy
  const t: any =
    typeof structuredClone === "function"
      ? structuredClone(baseTokens)
      : JSON.parse(JSON.stringify(baseTokens));

  if (scheme === "dark") {
    t.color.brand.primary.value = t.color.brand.primary.dark.value;
    t.color.brand.accent.value = t.color.brand.accent.dark.value;
    t.color.neutral["0"].value = t.color.neutral.dark.value; // surface colour
  }
  if (isCvd) {
    t.color.brand.primary.value = t.color.brand.primary.cvd.value;
    t.color.brand.accent.value = t.color.brand.accent.cvd.value;
  }

  return { tokens: t, scheme, isCvd } as ThemePalette;
};

/* -------------------------------------------------------------------------- */
/*                           React context setup                               */
/* -------------------------------------------------------------------------- */

const CVD_KEY = "pp:isCvd"; // AsyncStorage key

const ThemeCtx = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
};

export const useColorTokens = () => useTheme().tokens.color;

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const osScheme = (useColorScheme() as ColorScheme) ?? "light"; // null → light
  const [isCvd, setIsCvd] = useState(false);

  /* Load persisted CVD preference on mount */
  useEffect(() => {
    AsyncStorage.getItem(CVD_KEY).then((v) => setIsCvd(v === "1"));
  }, []);

  /* Toggle + persist CVD flag */
  const toggleCvd = () => {
    setIsCvd((prev) => {
      AsyncStorage.setItem(CVD_KEY, prev ? "0" : "1");
      return !prev;
    });
  };

  const palette = buildPalette(osScheme, isCvd);
  const value: ThemeContextValue = { ...palette, toggleCvd };

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};