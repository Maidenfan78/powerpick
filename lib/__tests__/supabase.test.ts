// Ensure each test gets a fresh module instance
beforeEach(() => {
  jest.resetModules();
});

test("falls back to env vars when expoConfig is null", () => {
  process.env.EXPO_PUBLIC_SUPABASE_URL = "https://env.supabase";
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = "env-anon-key";

  jest.doMock("expo-constants", () => ({
    __esModule: true,
    default: { expoConfig: null },
  }));

  const createClient = jest.fn(() => ({ from: jest.fn() }));
  jest.doMock("@supabase/supabase-js", () => ({ createClient }));

  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("../supabase");
  });

  expect(createClient).toHaveBeenCalledWith(
    "https://env.supabase",
    "env-anon-key",
  );
});
