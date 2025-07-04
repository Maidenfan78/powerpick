import { jest } from "@jest/globals";

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

test("syncAllGames processes draws using mocked fetch and supabase", async () => {
  process.env.SUPABASE_URL = "http://localhost";
  process.env.SUPABASE_ANON_KEY = "anon";

  const csv = "Draw number,Draw date,Winning Number 1\n1,1/1/2024,5";
  const fetchMock = jest.fn(() =>
    Promise.resolve({ ok: true, text: () => Promise.resolve(csv) }),
  );
  jest.doMock("cross-fetch", () => ({ __esModule: true, default: fetchMock }));

  const upsertMock = jest.fn(() => ({
    select: () =>
      Promise.resolve({ data: [{ id: 1, draw_number: 1 }], error: null }),
  }));
  const deleteMock = jest.fn(() => ({ in: () => Promise.resolve() }));
  const insertMock = jest.fn(() => Promise.resolve({ error: null }));
  const fromMock = jest.fn((table: string) => {
    if (table === "draws")
      return { upsert: upsertMock } as { upsert: jest.Mock };
    if (table === "draw_results")
      return {
        delete: deleteMock,
        in: jest.fn(async () => undefined) as unknown as jest.Mock,
        insert: insertMock,
      } as {
        delete: jest.Mock;
        in: jest.Mock;
        insert: jest.Mock;
      };
    if (table === "games")
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn(async () => ({
          data: { csv_url: "http://example.com" },
          error: null,
        })) as unknown as jest.Mock,
      } as {
        select: jest.Mock;
        eq: jest.Mock;
        maybeSingle: jest.Mock;
      };
    return {} as Record<string, never>;
  });
  const createClientMock = jest.fn(
    () => ({ from: fromMock }) as { from: typeof fromMock },
  );
  jest.doMock("@supabase/supabase-js", () => ({
    createClient: createClientMock,
  }));

  await jest.isolateModulesAsync(async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("../syncDraws");
    await mod.syncAllGames(1);
  });

  expect(fetchMock).toHaveBeenCalled();
  expect(upsertMock).toHaveBeenCalled();
  expect(insertMock).toHaveBeenCalled();
});
