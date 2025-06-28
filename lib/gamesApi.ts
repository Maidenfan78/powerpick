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
    .single();
  if (error) {
    console.error("Error fetching hot/cold:", error);
    throw error;
  }
  return {
    mainHot: data.main_hot ?? [],
    mainCold: data.main_cold ?? [],
    suppHot: data.supp_hot ?? [],
    suppCold: data.supp_cold ?? [],
    powerballHot: data.powerball_hot ?? [],
    powerballCold: data.powerball_cold ?? [],
  } as HotColdNumbers;
}
