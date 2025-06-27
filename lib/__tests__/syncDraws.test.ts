process.env.SUPABASE_URL = "http://localhost";
process.env.SUPABASE_ANON_KEY = "anon";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parseCsv, extractNumbers } = require("../syncDraws");

describe("draw parsing helpers", () => {
  test("parseCsv splits rows into records", () => {
    const csv = "A,B\n1,2\n3,4";
    const rows = parseCsv(csv);
    expect(rows).toEqual([
      { A: "1", B: "2" },
      { A: "3", B: "4" },
    ]);
  });

  test("parseCsv handles quoted fields with commas", () => {
    const csv = 'A,B\n"1,1","2,2"';
    const rows = parseCsv(csv);
    expect(rows).toEqual([{ A: "1,1", B: "2,2" }]);
  });

  test("extractNumbers picks numeric columns by prefix", () => {
    const row = {
      "Winning Number 1": "5",
      "Winning Number 2": "10",
      Foo: "bar",
    };
    expect(extractNumbers(row, "Winning Number")).toEqual([5, 10]);
  });
});
