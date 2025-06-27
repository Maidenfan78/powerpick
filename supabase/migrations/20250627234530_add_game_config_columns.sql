ALTER TABLE public.games
  ADD COLUMN main_max integer,
  ADD COLUMN main_count integer,
  ADD COLUMN supp_count integer,
  ADD COLUMN supp_max integer,
  ADD COLUMN powerball_max integer;
