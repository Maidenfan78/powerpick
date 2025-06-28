import * as dotenv from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fetch from "cross-fetch";

// 1) Load environment variables
dotenv.config();

// 2) Read and validate env vars
const SUPABASE_URL: string = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY: string = process.env.SUPABASE_ANON_KEY ?? "";
const SUPABASE_SERVICE_ROLE_KEY: string =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const supabaseKey: string = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !supabaseKey) {
  throw new Error("Supabase credentials are missing");
}

// 3) Debug credentials (show which key is used)
console.log("DEBUG: SUPABASE_URL  =", SUPABASE_URL);
if (SUPABASE_SERVICE_ROLE_KEY) {
  console.log(
    "DEBUG: Using service role key",
    SUPABASE_SERVICE_ROLE_KEY.slice(0, 4) + "...",
  );
} else {
  console.log("DEBUG: Using anon key", SUPABASE_ANON_KEY.slice(0, 4) + "...");
}

// 4) Initialize Supabase client
const supabase: SupabaseClient = createClient(SUPABASE_URL, supabaseKey);

// 5) Define game configuration interface and array
interface Game {
  apiId: number;
  gameId: string;
  mainTypeId: number;
  suppTypeId?: number;
  powerballTypeId?: number;
}

const GAMES: Game[] = [
  {
    apiId: 5130,
    gameId: "22222222-2222-2222-2222-222222222222",
    mainTypeId: 3,
    suppTypeId: 4,
  },
  {
    apiId: 5132,
    gameId: "33333333-3333-3333-3333-333333333333",
    mainTypeId: 5,
    powerballTypeId: 6,
  },
  {
    apiId: 5127,
    gameId: "11111111-1111-1111-1111-111111111111",
    mainTypeId: 1,
    suppTypeId: 2,
  },
  {
    apiId: 5237,
    gameId: "55555555-5555-5555-5555-555555555555",
    mainTypeId: 9,
    suppTypeId: 10,
  },
  {
    apiId: 5303,
    gameId: "44444444-4444-4444-4444-444444444444",
    mainTypeId: 7,
    suppTypeId: 8,
  },
];

// 6) CSV parsing helpers
import { csvParse as parseCsv, CsvRow } from "./csvParser.ts";

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

// 8) Sync a single game
async function syncGame(game: Game): Promise<void> {
  console.log(`\n🔄 Syncing game ${game.apiId}`);
  let processed = 0;
  try {
    const url = `https://api.lotterywest.wa.gov.au/api/v1/games/${game.apiId}/results-csv`;
    console.log("FETCH:", url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const csv = await res.text();
    const rows = parseCsv(csv);
    console.log(`DEBUG: Parsed rows = ${rows.length}`);
    if (rows[0]) console.log("DEBUG: First row =", rows[0]);

    const drawRecords: {
      game_id: string;
      draw_number: number;
      draw_date: string;
    }[] = [];
    const resultsMap = new Map<
      number,
      { winning: number[]; supp: number[]; powerball: number | null }
    >();

    for (const row of rows) {
      const draw_number = Number(row["Draw number"]);
      const draw_date = formatDateDMY(row["Draw date"]);
      const winning_numbers = extractNumbers(row, "Winning Number");
      const supplementary_numbers = extractNumbers(row, "Supplementary Number");
      const powerball = game.powerballTypeId
        ? Number(row["Powerball Number"]) || null
        : null;

      drawRecords.push({ game_id: game.gameId, draw_number, draw_date });
      resultsMap.set(draw_number, {
        winning: winning_numbers,
        supp: supplementary_numbers,
        powerball,
      });
    }

    const { data: inserted, error: upsertErr } = await supabase
      .from("draws")
      .upsert(drawRecords, { onConflict: "game_id,draw_number" })
      .select();

    if (upsertErr) {
      console.error("UPSERT DRAW ERROR:", upsertErr);
      return;
    }

    const drawIds = inserted?.map((d) => d.id as number) || [];
    await supabase.from("draw_results").delete().in("draw_id", drawIds);

    const resultRows = [] as {
      draw_id: number;
      ball_type_id: number;
      number: number;
    }[];
    for (const draw of inserted || []) {
      const info = resultsMap.get(draw.draw_number)!;
      resultRows.push(
        ...info.winning.map((n) => ({
          draw_id: draw.id as number,
          ball_type_id: game.mainTypeId,
          number: n,
        })),
      );
      if (game.suppTypeId) {
        resultRows.push(
          ...info.supp.map((n) => ({
            draw_id: draw.id as number,
            ball_type_id: game.suppTypeId!,
            number: n,
          })),
        );
      }
      if (game.powerballTypeId && info.powerball) {
        resultRows.push({
          draw_id: draw.id as number,
          ball_type_id: game.powerballTypeId,
          number: info.powerball,
        });
      }
    }

    const { error: resultErr } = await supabase
      .from("draw_results")
      .insert(resultRows);
    if (resultErr) console.error("INSERT RESULTS ERROR:", resultErr);
    else {
      processed = drawRecords.length;
      console.log(
        `✅ Upserted ${processed} draws (${resultRows.length} results)`,
      );
    }
  } catch (err) {
    console.error("SYNC ERROR:", game.apiId, err);
  } finally {
    console.log(`Finished game ${game.apiId}: processed ${processed} draws`);
  }
}

// 9) Run sync for all games
export async function syncAllGames(concurrency = 2): Promise<void> {
  const queue = [...GAMES];
  const workers = Array.from(
    { length: Math.min(concurrency, queue.length) },
    async () => {
      while (queue.length) {
        const game = queue.shift();
        if (!game) break;
        await syncGame(game);
      }
    },
  );
  await Promise.all(workers);
}

export { parseCsv, extractNumbers };

// 10) If run directly, invoke sync
const isDirectRun = typeof require !== "undefined" && require.main === module;
if (isDirectRun) {
  syncAllGames().catch((err) => console.error("FATAL:", err));
}
