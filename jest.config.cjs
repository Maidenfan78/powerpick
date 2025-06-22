// jest.config.cjs
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jestSetup.js'],
  setupFilesAfterEnv: ['@testing-library/react-native/extend-expect'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(expo|@expo|expo-modules-core|expo-status-bar|expo-constants|react-native-url-polyfill|@supabase|@react-native-async-storage|react-native|@react-native|@react-navigation)/)',
  ],
};
