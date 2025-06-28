CREATE TABLE public.hot_cold_numbers (
  game_id uuid PRIMARY KEY REFERENCES public.games(id),
  main_hot integer[] NOT NULL,
  main_cold integer[] NOT NULL,
  supp_hot integer[],
  supp_cold integer[],
  powerball_hot integer[],
  powerball_cold integer[]
);

ALTER TABLE public.hot_cold_numbers ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON TABLE public.hot_cold_numbers TO authenticated;
GRANT UPDATE ON TABLE public.hot_cold_numbers TO authenticated;

