// lib/supabase.ts
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const { SUPABASE_URL, SUPABASE_ANON_KEY } = Constants.expoConfig!.extra as {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL or anon key not provided");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
