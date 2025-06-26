module.exports = {
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
    "prettier"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "plugin:jest/recommended",
    "prettier"
  ],
  settings: {
    react: { version: "detect" }
  },
  ignorePatterns: ['node_modules/', 'vendor/', 'coverage/', 'venv/', '.eslintrc.cjs'],
  rules: {
    // React 17+ JSX transform
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    // Prettier enforcement
    "prettier/prettier": "error",
    // Catch irregular whitespace
    "no-irregular-whitespace": "error",
    // Disallow require() in favor of import
    "@typescript-eslint/no-require-imports": "error",
    // Warn against any types
    "@typescript-eslint/no-explicit-any": ["warn"],
  },
  overrides: [
    {
      files: ["jestSetup.js"],
      rules: { "@typescript-eslint/no-require-imports": "off" }
    }
  ]
};
