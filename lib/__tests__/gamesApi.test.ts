import {
  fetchGames,
  fetchHotColdNumbers,
  fetchRecentDraws,
  _clearCaches,
} from "../gamesApi";
import { supabase } from "../supabase";

jest.mock("../supabase", () => ({
  supabase: {
    from: jest.fn(),
    storage: { from: jest.fn() },
  },
}));

const fromMock = supabase.from as jest.Mock;
const storageFromMock = supabase.storage.from as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  _clearCaches();
});

describe("fetchGames", () => {
  test("returns formatted games on success", async () => {
    const selectMock = jest.fn().mockResolvedValue({
      data: [
        {
          id: "1",
          name: "Powerball",
          logo_url: "logo.png",
          jackpot: "1000",
          main_max: 35,
          main_count: 7,
          supp_count: null,
          supp_max: null,
          powerball_max: 20,
          from_draw_number: 100,
        },
      ],
      error: null,
    });
    fromMock.mockReturnValue({ select: selectMock });
    storageFromMock.mockReturnValue({
      getPublicUrl: jest.fn().mockReturnValue({
        data: { publicUrl: "https://cdn.example.com/logo.png" },
      }),
    });

    const games = await fetchGames();

    expect(games).toEqual([
      {
        id: "1",
        name: "Powerball",
        logoUrl: "https://cdn.example.com/logo.png",
        jackpot: "$1,000",
        mainMax: 35,
        mainCount: 7,
        suppCount: null,
        suppMax: null,
        powerballMax: 20,
        fromDrawNumber: 100,
      },
    ]);
    expect(fromMock).toHaveBeenCalledWith("games");
    expect(selectMock).toHaveBeenCalledWith(
      "id, name, logo_url, jackpot, main_max, main_count, supp_count, supp_max, powerball_max, from_draw_number",
    );
  });

  test("converts numeric ids to strings", async () => {
    const selectMock = jest.fn().mockResolvedValue({
      data: [
        {
          id: 2,
          name: "Oz Lotto",
          logo_url: "oz.png",
          jackpot: "2000",
          main_max: 47,
          main_count: 7,
          supp_count: 2,
          supp_max: 47,
          powerball_max: 3,
          from_draw_number: 200,
        },
      ],
      error: null,
    });
    fromMock.mockReturnValue({ select: selectMock });
    storageFromMock.mockReturnValue({
      getPublicUrl: jest.fn().mockReturnValue({
        data: { publicUrl: "https://cdn.example.com/oz.png" },
      }),
    });

    const games = await fetchGames();
    expect(games[0].id).toBe("2");
  });

  test("throws when Supabase returns an error", async () => {
    const err = new Error("boom");
    const selectMock = jest.fn().mockResolvedValue({ data: null, error: err });
    fromMock.mockReturnValue({ select: selectMock });

    await expect(fetchGames()).rejects.toThrow(err);
  });

  test("caches results between calls", async () => {
    const selectMock = jest.fn().mockResolvedValue({
      data: [
        {
          id: "3",
          name: "Lotto",
          logo_url: "lotto.png",
          jackpot: "3000",
          main_max: 40,
          main_count: 6,
          supp_count: 2,
          supp_max: 40,
          powerball_max: null,
          from_draw_number: 300,
        },
      ],
      error: null,
    });
    const getPublicUrl = jest.fn().mockReturnValue({
      data: { publicUrl: "https://cdn.example.com/lotto.png" },
    });
    fromMock.mockReturnValue({ select: selectMock });
    storageFromMock.mockReturnValue({ getPublicUrl });

    await fetchGames();
    await fetchGames();
    expect(selectMock).toHaveBeenCalledTimes(1);
    expect(getPublicUrl).toHaveBeenCalledTimes(1);
  });
});

describe("fetchHotColdNumbers", () => {
  test("returns hot and cold arrays", async () => {
    const response = {
      data: {
        main_hot: [1, 2],
        main_cold: [9, 10],
        supp_hot: [3],
        supp_cold: [8],
      },
      error: null,
    };
    const selectMock = jest.fn().mockReturnThis();
    const eqMock = jest.fn().mockReturnThis();
    const maybeSingleMock = jest.fn().mockResolvedValue(response);
    fromMock.mockReturnValue({
      select: selectMock,
      eq: eqMock,
      maybeSingle: maybeSingleMock,
    });

    const result = await fetchHotColdNumbers("1");
    expect(result.mainHot).toEqual([1, 2]);
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(eqMock).toHaveBeenCalledWith("game_id", "1");
    expect(maybeSingleMock).toHaveBeenCalled();
  });

  test("handles missing row gracefully", async () => {
    const selectMock = jest.fn().mockReturnThis();
    const eqMock = jest.fn().mockReturnThis();
    const maybeSingleMock = jest
      .fn()
      .mockResolvedValue({ data: null, error: null });
    fromMock.mockReturnValue({
      select: selectMock,
      eq: eqMock,
      maybeSingle: maybeSingleMock,
    });

    const result = await fetchHotColdNumbers("1");
    expect(result.mainHot).toEqual([]);
    expect(result.mainCold).toEqual([]);
  });

  test("caches hot/cold requests", async () => {
    const response = {
      data: { main_hot: [1], main_cold: [2] },
      error: null,
    };
    const selectMock = jest.fn().mockReturnThis();
    const eqMock = jest.fn().mockReturnThis();
    const maybeSingleMock = jest.fn().mockResolvedValue(response);
    fromMock.mockReturnValue({
      select: selectMock,
      eq: eqMock,
      maybeSingle: maybeSingleMock,
    });

    await fetchHotColdNumbers("2");
    await fetchHotColdNumbers("2");
    expect(maybeSingleMock).toHaveBeenCalledTimes(1);
  });
});

describe("fetchRecentDraws", () => {
  test("requests latest draws", async () => {
    const selectMock = jest.fn().mockReturnThis();
    const orderMock = jest.fn().mockReturnThis();
    const eqMock = jest.fn().mockReturnThis();
    const limitMock = jest.fn().mockResolvedValue({
      data: [
        {
          draw_number: 1,
          draw_date: "2020-01-01",
          draw_results: [
            { number: 1, ball_types: { name: "main" } },
            { number: 2, ball_types: { name: "main" } },
            { number: 3, ball_types: { name: "powerball" } },
          ],
        },
      ],
      error: null,
    });
    fromMock.mockReturnValue({
      select: selectMock,
      eq: eqMock,
      order: orderMock,
      limit: limitMock,
    });

    const result = await fetchRecentDraws("game1");
    expect(fromMock).toHaveBeenCalledWith("draws");
    expect(eqMock).toHaveBeenCalledWith("game_id", "game1");
    expect(orderMock).toHaveBeenCalledWith("draw_number", { ascending: false });
    expect(limitMock).toHaveBeenCalledWith(10);
    expect(result[0].winning_numbers).toEqual([1, 2]);
    expect(result[0].powerball).toBe(3);
  });

  test("caches draw requests", async () => {
    const selectMock = jest.fn().mockReturnThis();
    const orderMock = jest.fn().mockReturnThis();
    const eqMock = jest.fn().mockReturnThis();
    const limitMock = jest.fn().mockResolvedValue({ data: [], error: null });
    fromMock.mockReturnValue({
      select: selectMock,
      eq: eqMock,
      order: orderMock,
      limit: limitMock,
    });

    await fetchRecentDraws("game2");
    await fetchRecentDraws("game2");
    expect(limitMock).toHaveBeenCalledTimes(1);
  });
});
