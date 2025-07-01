import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.config({
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      project: "./tsconfig.json",
      ecmaFeatures: { jsx: true },
    },
    env: {
      browser: true,
      node: true,
      jest: true,
      "react-native/react-native": true,
    },
    plugins: [
      "@typescript-eslint",
      "react",
      "react-native",
      "jest",
      "prettier",
    ],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-native/all",
      "plugin:jest/recommended",
      "prettier",
    ],
    settings: {
      react: { version: "detect" },
    },
    ignorePatterns: [
      "node_modules/",
      "vendor/",
      "coverage/",
      "venv/",
      ".eslintrc.cjs",
      "**/*.cjs",
    ],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "prettier/prettier": "error",
      "no-irregular-whitespace": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-explicit-any": ["warn"],
    },
    overrides: [
      {
        files: ["jestSetup.js"],
        rules: { "@typescript-eslint/no-require-imports": "off" },
      },
    ],
  }),
];
