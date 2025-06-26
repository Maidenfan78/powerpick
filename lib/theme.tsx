// lib/theme.tsx
// -----------------------------------------------------------------------------
// Central theme context (light / dark + Colour‑Vision Deficiency toggle)
// -----------------------------------------------------------------------------
// Usage:
//   import { useTheme } from "../lib/theme";
//   const { tokens, toggleCvd } = useTheme();
//
// * Never import tokens.json directly in components – always go through context
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
import baseTokens from "../app/tokens.json";

/* -------------------------------------------------------------------------- */
/*                              Type definitions                               */
/* -------------------------------------------------------------------------- */

export type ColorScheme = "light" | "dark"; // OS-reported scheme

export interface ThemePalette {
  tokens: typeof baseTokens;
  scheme: ColorScheme;
  isCvd: boolean; // Colour‑Vision Deficiency flag
}

export interface ThemeContextValue extends ThemePalette {
  toggleCvd: () => void;
  toggleScheme: () => void;
}

/* -------------------------------------------------------------------------- */
/*                               Core helpers                                  */
/* -------------------------------------------------------------------------- */

/** Deep‑clone tokens then mutate according to scheme + cvd */
const buildPalette = (scheme: ColorScheme, isCvd: boolean): ThemePalette => {
  // Modern JS environments have structuredClone; fall back to JSON copy
  const t: typeof baseTokens =
    typeof globalThis.structuredClone === "function"
      ? globalThis.structuredClone(baseTokens)
      : (JSON.parse(JSON.stringify(baseTokens)) as typeof baseTokens);

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
const SCHEME_KEY = "pp:scheme";

const ThemeCtx = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
};

export const useColorTokens = () => useTheme().tokens.color;

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const osScheme = (useColorScheme() as ColorScheme) ?? "light"; // null → light
  const [scheme, setScheme] = useState<ColorScheme>(osScheme);
  const [isCvd, setIsCvd] = useState(false);

  /* Load persisted preferences on mount */
  useEffect(() => {
    AsyncStorage.multiGet([CVD_KEY, SCHEME_KEY]).then(
      (entries: readonly [string, string | null][]) => {
        entries.forEach(([key, value]: readonly [string, string | null]) => {
          if (key === CVD_KEY && value !== null) setIsCvd(value === "1");
          if (key === SCHEME_KEY && value) setScheme(value as ColorScheme);
        });
      },
    );
  }, []);

  /* Toggle + persist CVD flag */
  const toggleCvd = () => {
    setIsCvd((prev: boolean) => {
      AsyncStorage.setItem(CVD_KEY, prev ? "0" : "1");
      return !prev;
    });
  };

  /* Toggle + persist colour scheme */
  const toggleScheme = () => {
    setScheme((prev: ColorScheme) => {
      const next = prev === "light" ? "dark" : "light";
      AsyncStorage.setItem(SCHEME_KEY, next);
      return next;
    });
  };

  const palette = buildPalette(scheme, isCvd);
  const value: ThemeContextValue = { ...palette, toggleCvd, toggleScheme };

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};
