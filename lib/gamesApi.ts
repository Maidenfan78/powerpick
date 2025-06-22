// lib/gamesApi.ts
import { supabase } from "./supabase";

export interface Game {
  id: string;
  name: string;
  logoUrl: string;
  jackpot: string; // formatted string like "$5 m"
}

/**
 * Fetch all games from Supabase and map to our Game type
 */
export async function fetchGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games") // no generic here—follows your IndexScreen pattern
    .select("id, name, logo_url, jackpot");

  if (error) {
    console.error("Error fetching games:", error);
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    jackpot: `$${(row.jackpot as number).toLocaleString()}`,
  }));
}
