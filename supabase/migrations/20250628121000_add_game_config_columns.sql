ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS main_max integer,
  ADD COLUMN IF NOT EXISTS main_count integer,
  ADD COLUMN IF NOT EXISTS supp_count integer,
  ADD COLUMN IF NOT EXISTS supp_max integer,
  ADD COLUMN IF NOT EXISTS powerball_max integer;
