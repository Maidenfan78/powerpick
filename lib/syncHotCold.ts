import * as dotenv from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { calculateHotColdNumbers } from "./hotCold.ts";

dotenv.config();

const SUPABASE_URL: string = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY: string = process.env.SUPABASE_ANON_KEY ?? "";
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase credentials are missing");
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface GameConfig {
  id: number;
  table: string;
  main_max: number;
  supp_max?: number | null;
  powerball_max?: number | null;
}

const GAME_TABLES: Record<number, string> = {
  5130: "oz_lotto_draws",
  5132: "powerball_draws",
  5127: "saturday_lotto_draws",
  5237: "set_for_life_draws",
  5303: "weekday_windfall_draws",
};

interface DrawRow {
  winning_numbers: number[];
  supplementary_numbers?: number[] | null;
  powerball?: number | null;
}

export interface HotColdRecord {
  game_id: number;
  main_hot: number[];
  main_cold: number[];
  supp_hot?: number[];
  supp_cold?: number[];
  powerball_hot?: number[];
  powerball_cold?: number[];
}

export function computeHotCold(
  rows: DrawRow[],
  cfg: GameConfig,
  percent = 20,
): HotColdRecord {
  const mainDraws = rows.map((r) => r.winning_numbers);
  const { hot: main_hot, cold: main_cold } = calculateHotColdNumbers(
    mainDraws,
    cfg.main_max,
    percent,
  );

  const record: HotColdRecord = {
    game_id: cfg.id,
    main_hot,
    main_cold,
  };

  if (cfg.supp_max) {
    const suppDraws = rows.flatMap((r) => r.supplementary_numbers ?? []);
    const grouped = suppDraws.map((n) => [n]);
    const { hot, cold } = calculateHotColdNumbers(
      grouped,
      cfg.supp_max,
      percent,
    );
    record.supp_hot = hot;
    record.supp_cold = cold;
  }

  if (cfg.powerball_max) {
    const pbDraws = rows
      .map((r) => r.powerball)
      .filter((n): n is number => typeof n === "number");
    const grouped = pbDraws.map((n) => [n]);
    const { hot, cold } = calculateHotColdNumbers(
      grouped,
      cfg.powerball_max,
      percent,
    );
    record.powerball_hot = hot;
    record.powerball_cold = cold;
  }

  return record;
}

async function updateGameHotCold(game: GameConfig): Promise<void> {
  const { data, error } = await supabase
    .from(game.table)
    .select("winning_numbers, supplementary_numbers, powerball");

  if (error) throw error;

  // force it to your known shape:
  const rows = (data ?? []) as DrawRow[];
  const record = computeHotCold(rows, game);

  const { error: upsertError } = await supabase
    .from("hot_cold_numbers")
    .upsert(record, { onConflict: "game_id" });
  if (upsertError) throw upsertError;
  console.log(`✅ Updated hot/cold for game ${game.id}`);
}

export async function syncAllHotCold(): Promise<void> {
  const { data, error } = await supabase
    .from("games")
    .select("id, main_max, supp_max, powerball_max");
  if (error) throw error;
  const games = (data ?? []) as GameConfig[];
  for (const g of games) {
    const table = GAME_TABLES[g.id];
    if (!table) continue;
    await updateGameHotCold({ ...g, table });
  }
}

const invokedDirectly =
  (typeof require !== "undefined" && require.main === module) ||
  process.argv[1]?.split(/[\\/]/).pop() === "syncHotCold.ts";

if (invokedDirectly) {
  syncAllHotCold().catch((err) => console.error("FATAL:", err));
}
