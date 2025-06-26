// jestSetupAfterEnv.cjs
// Add custom matchers (needs expect) and silence stray errors
require('@testing-library/jest-native/extend-expect');
const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
afterAll(() => { errorSpy.mockRestore(); });
