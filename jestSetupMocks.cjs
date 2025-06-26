// jestSetupMocks.cjs
// Mock AsyncStorage before the test environment loads
jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
