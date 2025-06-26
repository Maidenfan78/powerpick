// jest.config.cjs
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jestSetup.cjs'],
  setupFiles: ['./jestSetupMocks.cjs'],
  setupFilesAfterEnv: ['./jestSetupAfterEnv.cjs'],
  setupFilesAfterEnv: ['@testing-library/react-native/extend-expect'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    // allow Expo, React Native, Supabase, and related ESM modules to be transformed
    'node_modules/(?!(expo|@expo|expo-modules-core|expo-status-bar|expo-constants|' +
    'react-native-url-polyfill|@supabase|@react-native-async-storage|react-native|' +
    '@react-native|@react-navigation|isows)/)'
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
};
