-- ===================================================================
-- Migration: create_generic_lotto_schema + hot_cold_numbers
-- ===================================================================

-- 1) Drop any old tables so this can be re-run cleanly
DROP TABLE IF EXISTS
  public.hot_cold_numbers,
  public.draw_results,
  public.draws,
  public.ball_types,
  public.games
CASCADE;

-- ===================================================================
-- 2) Master games table + RLS + seed data
-- ===================================================================
CREATE TABLE public.games (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text          NOT NULL,
  region            text          NOT NULL,
  logo_url          text,
  jackpot           numeric,
  created_at        timestamptz   NOT NULL DEFAULT now(),
  main_max          integer,
  main_count        integer,
  supp_count        integer,
  supp_max          integer,
  powerball_max     integer,
  from_draw_number  integer       NOT NULL    -- new column
);
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read games"
  ON public.games FOR SELECT TO public USING (true);

INSERT INTO public.games (
  id, name, region, logo_url, jackpot, created_at,
  main_max, main_count, supp_count, supp_max, powerball_max,
  from_draw_number
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Saturday Lotto','AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/tattslotto.png',
    5000000,'2025-06-22 11:19:16.610769+00',
    45,6,2,45,NULL,
    513
  ),(
    '22222222-2222-2222-2222-222222222222',
    'Oz Lotto','AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/Oz_Lotto.png',
    5000000,'2025-06-22 11:19:16.610769+00',
    47,7,3,47,NULL,
    1474
  ),(
    '33333333-3333-3333-3333-333333333333',
    'Powerball','AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/powerball.png',
    5000000,'2025-06-22 11:19:16.610769+00',
    35,7,0,0,20,
    1144
  ),(
    '44444444-4444-4444-4444-444444444444',
    'Weekday Windfall','AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/weekday_windfall.png',
    5000000,'2025-06-22 11:19:16.610769+00',
    45,6,2,45,NULL,
    4392
  ),(
    '55555555-5555-5555-5555-555555555555',
    'Set for Life','AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/set_for_life.png',
    5000000,'2025-06-22 11:19:16.610769+00',
    44,7,2,44,NULL,
    1691
  )
ON CONFLICT (id) DO NOTHING;


-- ===================================================================
-- 3) Ball types table + RLS + seed data
-- ===================================================================
CREATE TABLE public.ball_types (
  id         serial      PRIMARY KEY,
  game_id    uuid        NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  name       text        NOT NULL,
  sort_order integer     NOT NULL DEFAULT 1,
  UNIQUE(game_id, name)
);
ALTER TABLE public.ball_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ball_types"
  ON public.ball_types FOR SELECT TO public USING (true);

INSERT INTO public.ball_types (game_id, name, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111','main',1),
  ('11111111-1111-1111-1111-111111111111','supplementary',2),
  ('22222222-2222-2222-2222-222222222222','main',1),
  ('22222222-2222-2222-2222-222222222222','supplementary',2),
  ('33333333-3333-3333-3333-333333333333','main',1),
  ('33333333-3333-3333-3333-333333333333','powerball',2),
  ('44444444-4444-4444-4444-444444444444','main',1),
  ('44444444-4444-4444-4444-444444444444','supplementary',2),
  ('55555555-5555-5555-5555-555555555555','main',1),
  ('55555555-5555-5555-5555-555555555555','supplementary',2)
ON CONFLICT (game_id, name) DO NOTHING;

-- ===================================================================
-- 4) Draws table + RLS + index
-- ===================================================================
CREATE TABLE public.draws (
  id           serial       PRIMARY KEY,
  game_id      uuid         NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  draw_number  integer      NOT NULL,
  draw_date    date         NOT NULL,
  created_at   timestamptz  NOT NULL DEFAULT now(),
  UNIQUE(game_id, draw_number)
);
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read draws"
  ON public.draws FOR SELECT TO public USING (true);
CREATE INDEX IF NOT EXISTS idx_draws_game_id
  ON public.draws USING btree (game_id);

-- ===================================================================
-- 5) Draw results table + RLS + index
-- ===================================================================
CREATE TABLE public.draw_results (
  id           serial       PRIMARY KEY,
  draw_id      integer      NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  ball_type_id integer      NOT NULL REFERENCES public.ball_types(id) ON DELETE CASCADE,
  number       integer      NOT NULL
);
ALTER TABLE public.draw_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read draw_results"
  ON public.draw_results FOR SELECT TO public USING (true);
CREATE INDEX IF NOT EXISTS idx_draw_results_draw_id
  ON public.draw_results USING btree (draw_id);

-- ===================================================================
-- 6) Hot/cold numbers table + RLS + grants
-- ===================================================================
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
ALTER TABLE public.hot_cold_numbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_hot_cold_rw
  ON public.hot_cold_numbers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
GRANT SELECT ON public.hot_cold_numbers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hot_cold_numbers TO service_role;

-- ===================================================================
-- 7) Global grants for other tables
-- ===================================================================
GRANT SELECT ON
  public.games,
  public.ball_types,
  public.draws,
  public.draw_results
  TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON
  public.games TO authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON
  public.ball_types,
  public.draws,
  public.draw_results TO service_role;
