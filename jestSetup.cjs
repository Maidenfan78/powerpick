// jest.setup.cjs

// 1. Mock AsyncStorage for React Native
jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// 2. Mock Supabase so no real HTTP requests happen
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      from: () => ({
        select: () => ({
          maybeSingle: async () => ({ data: [], error: null })
        }),
      }),
    }),
  };
});

// 3. Load React Native Testing Library matchers
require('@testing-library/jest-native/extend-expect');

// 4. Silence all console.error calls (prevents “Cannot log after tests are done”)
console.error = jest.fn();
