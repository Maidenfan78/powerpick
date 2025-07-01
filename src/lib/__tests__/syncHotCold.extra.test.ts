import { jest } from "@jest/globals";

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

test("computeHotCold handles missing optional fields", () => {
  process.env.SUPABASE_URL = "http://localhost";
  process.env.SUPABASE_ANON_KEY = "anon";
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { computeHotCold } = require("../syncHotCold");
  const rows = [
    { winning_numbers: [1, 2], supplementary_numbers: null, powerball: null },
    { winning_numbers: [2, 3], supplementary_numbers: null, powerball: null },
  ];
  const record = computeHotCold(
    rows,
    { id: "g1", main_max: 5, from_draw_number: 1 },
    40,
  );
  expect(record).toEqual({
    game_id: "g1",
    main_hot: [2, 1],
    main_cold: [4, 5],
  });
});

test("syncAllHotCold reads games and updates records", async () => {
  process.env.SUPABASE_URL = "http://localhost";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service";

  const gameData = [
    {
      id: "g1",
      main_max: 5,
      from_draw_number: 1,
      supp_max: null,
      powerball_max: null,
    },
  ];
  const drawData = [
    { draw_results: [{ number: 1, ball_types: { name: "main" } }] },
  ];

  const selectGames = jest.fn(() =>
    Promise.resolve({ data: gameData, error: null }),
  );
  const rangeMock = jest.fn(() =>
    Promise.resolve({ data: drawData, error: null }),
  );
  const selectDraws = jest.fn(() => ({
    eq: () => ({
      gte: () => ({ range: rangeMock }),
    }),
  }));
  const upsertHotCold = jest.fn(() => Promise.resolve({ error: null }));
  const fromMock = jest.fn((table: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (table === "games") return { select: selectGames } as any;
    if (table === "draws")
      return {
        select: selectDraws,
      } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (table === "hot_cold_numbers") return { upsert: upsertHotCold } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {} as any;
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createClientMock = jest.fn(() => ({ from: fromMock }) as any);
  jest.doMock("@supabase/supabase-js", () => ({
    createClient: createClientMock,
  }));

  await jest.isolateModulesAsync(async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("../syncHotCold");
    await mod.syncAllHotCold();
  });

  expect(selectGames).toHaveBeenCalled();
  expect(selectDraws).toHaveBeenCalled();
  expect(upsertHotCold).toHaveBeenCalled();
});
