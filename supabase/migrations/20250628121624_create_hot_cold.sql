-- Creates table for storing hot and cold numbers per game
CREATE TABLE public.hot_cold_numbers (
  game_id uuid PRIMARY KEY REFERENCES public.games(id) ON DELETE CASCADE,
  main_hot integer[] NOT NULL,
  main_cold integer[] NOT NULL,
  supp_hot integer[],
  supp_cold integer[],
  powerball_hot integer[],
  powerball_cold integer[],
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hot_cold_numbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read hot_cold_numbers"
  ON public.hot_cold_numbers FOR SELECT TO public USING (true);

GRANT SELECT ON public.hot_cold_numbers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hot_cold_numbers TO service_role;