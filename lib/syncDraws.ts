import * as dotenv from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// 1) Load environment variables
dotenv.config();

// 2) Read and validate env vars
const SUPABASE_URL: string = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY: string = process.env.SUPABASE_ANON_KEY ?? "";
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase credentials are missing");
}

// 3) Debug credentials (only log partial anon key)
console.log("DEBUG: SUPABASE_URL      =", SUPABASE_URL);
console.log(
  "DEBUG: SUPABASE_ANON_KEY =",
  SUPABASE_ANON_KEY.slice(0, 4) + "...",
);

// 4) Initialize Supabase client
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 5) Define game configuration interface and array
interface Game {
  id: number;
  table: string;
  hasCounts?: boolean;
  hasPowerball?: boolean;
}

const GAMES: Game[] = [
  { id: 5130, table: "oz_lotto_draws", hasCounts: true },
  { id: 5132, table: "powerball_draws", hasPowerball: true },
  { id: 5127, table: "saturday_lotto_draws" },
  { id: 5237, table: "set_for_life_draws" },
  { id: 5303, table: "weekday_windfall_draws" },
];

// 6) CSV parsing helpers
import { csvParse as parseCsv, CsvRow } from "./csvParser";

function extractNumbers(row: CsvRow, prefix: string): number[] {
  return Object.keys(row)
    .filter((key) => key.toLowerCase().startsWith(prefix.toLowerCase()))
    .map((key) => Number(row[key]))
    .filter((n) => n > 0);
}

function formatDateDMY(dmy: string): string {
  const [d, m, y] = dmy.split("/").map((p) => p.padStart(2, "0"));
  return `${y}-${m}-${d}`;
}

// 7) Interface for upsert record
interface DrawRecord {
  draw_number: number;
  draw_date: string;
  winning_numbers: number[];
  supplementary_numbers?: number[];
  number_of_main?: number;
  number_of_supps?: number;
  powerball?: number | null;
}

// 8) Sync a single game
async function syncGame(game: Game): Promise<void> {
  console.log(`\n🔄 Syncing ${game.table}`);
  try {
    const url = `https://api.lotterywest.wa.gov.au/api/v1/games/${game.id}/results-csv`;
    console.log("FETCH:", url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const csv = await res.text();
    const rows = parseCsv(csv);
    console.log(`DEBUG: Parsed rows = ${rows.length}`);

    const records: DrawRecord[] = rows.map((row) => {
      const draw_number = Number(row["Draw number"]);
      const draw_date = formatDateDMY(row["Draw date"]);
      const winning_numbers = extractNumbers(row, "Winning Number");

      if (game.hasPowerball) {
        const powerball = Number(row["Powerball Number"]) || null;
        return { draw_number, draw_date, winning_numbers, powerball };
      }

      const supplementary_numbers = extractNumbers(row, "Supplementary Number");
      if (game.hasCounts) {
        return {
          draw_number,
          draw_date,
          winning_numbers,
          supplementary_numbers,
          number_of_main: winning_numbers.length,
          number_of_supps: supplementary_numbers.length,
        };
      }

      return { draw_number, draw_date, winning_numbers, supplementary_numbers };
    });

    // Remove <T> generic from .from and specify generic on upsert instead
    const { data, error } = await supabase
      .from(game.table)
      .upsert<DrawRecord>(records, { onConflict: "draw_number" });

    if (error) console.error("UPSERT ERROR:", game.table, error);
    else
      console.log(
        `✅ ${game.table}: ${Array.isArray(data) ? data.length : 0} rows`,
      );
  } catch (err) {
    console.error("SYNC ERROR:", game.table, err);
  }
}

// 9) Run sync for all games
export async function syncAllGames(): Promise<void> {
  for (const game of GAMES) {
    // Sequential to avoid rate limits
    await syncGame(game);
  }
}

export { parseCsv, extractNumbers };

// 10) If run directly, invoke sync
if (require.main === module) {
  syncAllGames().catch((err) => console.error("FATAL:", err));
}
