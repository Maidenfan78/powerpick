describe("computeHotCold", () => {
  test("calculates hot and cold numbers from rows", () => {
    process.env.SUPABASE_URL = "http://localhost";
    process.env.SUPABASE_ANON_KEY = "anon";
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const { computeHotCold } = require("../syncHotCold");
    const rows = [
      { winning_numbers: [1, 2, 3], supplementary_numbers: [7], powerball: 9 },
      { winning_numbers: [1, 2, 4], supplementary_numbers: [8], powerball: 10 },
      { winning_numbers: [1, 3, 5], supplementary_numbers: [7], powerball: 9 },
    ];
    const record = computeHotCold(
      rows,
      {
        id: 1,
        table: "t",
        main_max: 5,
        supp_max: 10,
        powerball_max: 10,
        from_draw_number: 1,
      },
      40,
    );
    expect(record.main_hot).toEqual([1, 2]);
    expect(record.main_cold).toEqual([4, 5]);
    expect(record.supp_hot).toEqual([7, 8, 1, 2]);
    expect(record.supp_cold).toEqual([5, 6, 9, 10]);
    expect(record.powerball_hot).toEqual([9, 10, 1, 2]);
    expect(record.powerball_cold).toEqual([5, 6, 7, 8]);
  });
});
