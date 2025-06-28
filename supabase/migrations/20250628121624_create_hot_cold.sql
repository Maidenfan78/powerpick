-- 1) Create (or replace) the table
DROP TABLE IF EXISTS public.hot_cold_numbers;
CREATE TABLE public.hot_cold_numbers (
  game_id        uuid           PRIMARY KEY REFERENCES public.games(id) ON DELETE CASCADE,
  main_hot       integer[]      NOT NULL,
  main_cold      integer[]      NOT NULL,
  supp_hot       integer[],
  supp_cold      integer[],
  powerball_hot  integer[],
  powerball_cold integer[],
  updated_at     timestamptz    NOT NULL DEFAULT now()
);

-- 2) RLS setup
ALTER TABLE public.hot_cold_numbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_hot_cold_rw
  ON public.hot_cold_numbers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3) Grants (optional if using service_role key)
GRANT SELECT ON public.hot_cold_numbers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hot_cold_numbers TO service_role;
