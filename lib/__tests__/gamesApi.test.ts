import { fetchGames, fetchHotColdNumbers, fetchRecentDraws } from "../gamesApi";
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
      },
    ]);
    expect(fromMock).toHaveBeenCalledWith("games");
    expect(selectMock).toHaveBeenCalledWith(
      "id, name, logo_url, jackpot, main_max, main_count, supp_count, supp_max, powerball_max",
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
});

describe("fetchRecentDraws", () => {
  test("requests latest draws", async () => {
    const selectMock = jest.fn().mockReturnThis();
    const orderMock = jest.fn().mockReturnThis();
    const limitMock = jest.fn().mockResolvedValue({
      data: [
        { draw_number: 1, draw_date: "2020-01-01", winning_numbers: [1, 2, 3] },
      ],
      error: null,
    });
    fromMock.mockReturnValue({
      select: selectMock,
      order: orderMock,
      limit: limitMock,
    });

    const result = await fetchRecentDraws("Powerball");
    expect(fromMock).toHaveBeenCalledWith("powerball_draws");
    expect(orderMock).toHaveBeenCalledWith("draw_number", { ascending: false });
    expect(limitMock).toHaveBeenCalledWith(10);
    expect(result[0].draw_number).toBe(1);
  });
});
