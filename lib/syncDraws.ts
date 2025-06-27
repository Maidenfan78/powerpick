import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase credentials are missing");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface GameConfig {
  id: number;
  table: string;
  hasPowerball?: boolean;
}

const GAMES: GameConfig[] = [
  { id: 5130, table: "oz_lotto_draws" },
  { id: 5132, table: "powerball_draws", hasPowerball: true },
  { id: 5127, table: "saturday_lotto_draws" },
  { id: 5128, table: "set_for_life_draws" },
  { id: 5303, table: "weekday_windfall_draws" },
];

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const record: Record<string, string> = {};
    headers.forEach((h, i) => {
      record[h.trim()] = values[i]?.trim() ?? "";
    });
    return record;
  });
}

export function extractNumbers(
  row: Record<string, string>,
  prefix: string,
): number[] {
  return Object.keys(row)
    .filter((key) => key.toLowerCase().startsWith(prefix.toLowerCase()))
    .map((key) => Number(row[key]))
    .filter((n) => !Number.isNaN(n));
}

async function syncGame(game: GameConfig): Promise<void> {
  const url = `https://api.lotterywest.wa.gov.au/api/v1/games/${game.id}/results-csv`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch CSV for game ${game.id}`);
  }
  const csv = await res.text();
  const rows = parseCsv(csv);

  const records = rows.map((row) => {
    const winning_numbers = extractNumbers(row, "Winning Number");
    const supplementary_numbers = extractNumbers(row, "Supplementary");
    const base = {
      draw_number: Number(row["Draw number"]),
      draw_date: row["Draw date"],
      winning_numbers,
    };

    if (game.hasPowerball) {
      const key = Object.keys(row).find((k) =>
        k.toLowerCase().includes("powerball"),
      );
      return {
        ...base,
        powerball: key ? Number(row[key]) : NaN,
      };
    }
    return {
      ...base,
      supplementary_numbers: supplementary_numbers.length
        ? supplementary_numbers
        : null,
    };
  });

  await supabase
    .from(game.table)
    .upsert(records, { onConflict: "draw_number" });
  console.log(`✅ ${game.table}: ${records.length} draws synced`);
}

export async function syncAllGames(): Promise<void> {
  for (const game of GAMES) {
    await syncGame(game);
  }
}

if (require.main === module) {
  syncAllGames().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
