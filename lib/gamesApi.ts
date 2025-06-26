// lib/gamesApi.ts
import { supabase } from "./supabase";

const STORAGE_BUCKET = "powerpick";

export interface Game {
  id: string;
  name: string;
  logoUrl: string; // full public URL to the PNG logo
  jackpot: string; // formatted string like "$5,000,000"
}

/** Collapse any “//” in the pathname (preserving “https://”) */
function normalizeUrl(url: string): string {
  return url.replace(/([^:]\/)\/+/g, "$1");
}

export async function fetchGames(): Promise<Game[]> {
  const { data: rows, error } = await supabase
    .from("games")
    .select<"id, name, logo_url, jackpot">("id, name, logo_url, jackpot");

  if (error) {
    console.error("Error fetching games:", error);
    throw error;
  }

  return (rows ?? []).map((row) => {
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
      id: row.id,
      name: row.name,
      logoUrl: url,
      jackpot: `$${Number(row.jackpot).toLocaleString()}`,
    };
  });
}
