// lib/gamesApi.ts
import { supabase } from "./supabase";

const STORAGE_BUCKET = "powerpick";

export interface Game {
  id: string;
  name: string;
  logoUrl: string; // full public URL to the PNG logo
  jackpot: string; // formatted string like "$5,000,000"
  mainMax: number | null;
  mainCount: number | null;
  suppCount: number | null;
  suppMax: number | null;
  powerballMax: number | null;
}

export interface GameRow {
  id: string | number;
  name: string;
  logo_url: string;
  jackpot: string;
  main_max: number | null;
  main_count: number | null;
  supp_count: number | null;
  supp_max: number | null;
  powerball_max: number | null;
}

/** Collapse any “//” in the pathname (preserving “https://”) */
function normalizeUrl(url: string): string {
  return url.replace(/([^:]\/)\/+/g, "$1");
}

export async function fetchGames(): Promise<Game[]> {
  const { data: rows, error } = await supabase
    .from("games")
    .select<GameRow>(
      "id, name, logo_url, jackpot, main_max, main_count, supp_count, supp_max, powerball_max",
    );

  if (error) {
    console.error("Error fetching games:", error);
    throw error;
  }

  return (rows ?? []).map((row: GameRow) => {
    const raw = (row.logo_url ?? "").trim();
    let url: string;

    if (raw.startsWith("http")) {
      url = normalizeUrl(raw);
    } else {
      const key = raw.replace(/^\/+|\/+$/g, "");
      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(key);
      url = normalizeUrl(publicUrl);
    }

    console.log(`[GamesAPI] "${row.id}" → ${url}`);
    return {
      id: String(row.id),
      name: row.name,
      logoUrl: url,
      jackpot: `$${Number(row.jackpot).toLocaleString()}`,
      mainMax: row.main_max ?? null,
      mainCount: row.main_count ?? null,
      suppCount: row.supp_count ?? null,
      suppMax: row.supp_max ?? null,
      powerballMax: row.powerball_max ?? null,
    };
  });
}

export interface HotColdNumbers {
  mainHot: number[];
  mainCold: number[];
  suppHot?: number[];
  suppCold?: number[];
  powerballHot?: number[];
  powerballCold?: number[];
}

export async function fetchHotColdNumbers(
  gameId: string,
): Promise<HotColdNumbers> {
  const { data, error } = await supabase
    .from("hot_cold_numbers")
    .select("*")
    .eq("game_id", gameId)
    .maybeSingle();
  if (error) {
    console.error("Error fetching hot/cold:", error);
    throw error;
  }
  return {
    mainHot: data?.main_hot ?? [],
    mainCold: data?.main_cold ?? [],
    suppHot: data?.supp_hot ?? [],
    suppCold: data?.supp_cold ?? [],
    powerballHot: data?.powerball_hot ?? [],
    powerballCold: data?.powerball_cold ?? [],
  } as HotColdNumbers;
}

export interface DrawResult {
  draw_number: number;
  draw_date: string;
  winning_numbers: number[];
  supplementary_numbers?: number[] | null;
  powerball?: number | null;
}

interface DrawRow {
  draw_number: number;
  draw_date: string;
  draw_results: {
    number: number;
    ball_types: { name: string } | null;
  }[];
}

export async function fetchRecentDraws(gameId: string): Promise<DrawResult[]> {
  const { data, error } = await supabase
    .from("draws")
    .select<DrawRow>(
      "draw_number, draw_date, draw_results(number, ball_types(name))",
    )
    .eq("game_id", gameId)
    .order("draw_number", { ascending: false })
    .limit(10);
  if (error) {
    console.error("Error fetching draws:", error);
    throw error;
  }

  return (data ?? []).map((row) => {
    const results = row.draw_results || [];
    const winning_numbers = results
      .filter((r) => r.ball_types?.name === "main")
      .map((r) => r.number)
      .sort((a, b) => a - b);
    const supplementary_numbers = results
      .filter((r) => r.ball_types?.name === "supplementary")
      .map((r) => r.number)
      .sort((a, b) => a - b);
    const powerball =
      results.find((r) => r.ball_types?.name === "powerball")?.number ?? null;

    return {
      draw_number: row.draw_number,
      draw_date: row.draw_date,
      winning_numbers,
      supplementary_numbers: supplementary_numbers.length
        ? supplementary_numbers
        : null,
      powerball,
    } as DrawResult;
  });
}
