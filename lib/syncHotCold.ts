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
  id: string;
  main_max: number;
  supp_max?: number | null;
  powerball_max?: number | null;
}

interface DrawRow {
  winning_numbers: number[];
  supplementary_numbers?: number[] | null;
  powerball?: number | null;
}

export interface HotColdRecord {
  game_id: string;
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
    .from("draws")
    .select<{
      draw_results: { number: number; ball_types: { name: string } | null }[];
    }>("draw_results(number, ball_types(name))")
    .eq("game_id", game.id);

  if (error) throw error;

  const rows = (data ?? []).map((row) => {
    const results = row.draw_results || [];
    const winning_numbers = results
      .filter((r) => r.ball_types?.name === "main")
      .map((r) => r.number);
    const supplementary_numbers = results
      .filter((r) => r.ball_types?.name === "supplementary")
      .map((r) => r.number);
    const powerball =
      results.find((r) => r.ball_types?.name === "powerball")?.number ?? null;
    return {
      winning_numbers,
      supplementary_numbers: supplementary_numbers.length
        ? supplementary_numbers
        : null,
      powerball,
    } as DrawRow;
  });
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
    await updateGameHotCold(g);
  }
}

syncAllHotCold().catch((err) => console.error("FATAL:", err));
