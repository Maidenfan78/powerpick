import { fetchGames } from "../gamesApi";
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
        { id: "1", name: "Powerball", logo_url: "logo.png", jackpot: "1000" },
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
      },
    ]);
    expect(fromMock).toHaveBeenCalledWith("games");
    expect(selectMock).toHaveBeenCalledWith("id, name, logo_url, jackpot");
  });

  test("throws when Supabase returns an error", async () => {
    const err = new Error("boom");
    const selectMock = jest.fn().mockResolvedValue({ data: null, error: err });
    fromMock.mockReturnValue({ select: selectMock });

    await expect(fetchGames()).rejects.toThrow(err);
  });
});
