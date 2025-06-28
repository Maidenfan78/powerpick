-- supabase/migrations/20250628091444_create_generic_lotto_schema.sql

-- 1) Drop any old tables so this can be re-run cleanly
DROP TABLE IF EXISTS
  public.draw_results,
  public.draws,
  public.ball_types,
  public.games
CASCADE;

-- 2) Create the master games table
CREATE TABLE public.games (
  id             uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text          NOT NULL,
  region         text          NOT NULL,
  logo_url       text,
  jackpot        numeric,
  created_at     timestamptz   NOT NULL DEFAULT now(),
  main_max       integer,
  main_count     integer,
  supp_count     integer,
  supp_max       integer,
  powerball_max  integer
);

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read games"
  ON public.games FOR SELECT TO public USING (true);

-- 3) Seed initial games
INSERT INTO public.games (
  id, name, region, logo_url, jackpot, created_at,
  main_max, main_count, supp_count, supp_max, powerball_max
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Saturday Lotto',
    'AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/tattslotto.png',
    5000000,
    '2025-06-22 11:19:16.610769+00',
    45, 6, 2, 45, NULL
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Oz Lotto',
    'AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/Oz_Lotto.png',
    5000000,
    '2025-06-22 11:19:16.610769+00',
    47, 7, 3, 47, NULL
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Powerball',
    'AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/powerball.png',
    5000000,
    '2025-06-22 11:19:16.610769+00',
    35, 7, 0, 0, 20
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Weekday Windfall',
    'AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/weekday_windfall.png',
    5000000,
    '2025-06-22 11:19:16.610769+00',
    45, 6, 2, 45, NULL
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Set for Life',
    'AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/set_for_life.png',
    5000000,
    '2025-06-22 11:19:16.610769+00',
    44, 7, 2, 44, NULL
  )
ON CONFLICT (id) DO NOTHING;

-- 4) Define ball types per game
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

-- 5) Seed ball types for each game
INSERT INTO public.ball_types (game_id, name, sort_order) VALUES
  -- Saturday Lotto: main + supplementary
  ('11111111-1111-1111-1111-111111111111', 'main',          1),
  ('11111111-1111-1111-1111-111111111111', 'supplementary', 2),
  -- Oz Lotto
  ('22222222-2222-2222-2222-222222222222', 'main',          1),
  ('22222222-2222-2222-2222-222222222222', 'supplementary', 2),
  -- Powerball: main + powerball
  ('33333333-3333-3333-3333-333333333333', 'main',          1),
  ('33333333-3333-3333-3333-333333333333', 'powerball',     2),
  -- Weekday Windfall
  ('44444444-4444-4444-4444-444444444444', 'main',          1),
  ('44444444-4444-4444-4444-444444444444', 'supplementary', 2),
  -- Set for Life
  ('55555555-5555-5555-5555-555555555555', 'main',          1),
  ('55555555-5555-5555-5555-555555555555', 'supplementary', 2)
ON CONFLICT (game_id, name) DO NOTHING;

-- 6) Create a unified draws table
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

-- 7) Store each drawn ball as a separate row
CREATE TABLE public.draw_results (
  id           serial       PRIMARY KEY,
  draw_id      integer      NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  ball_type_id integer      NOT NULL REFERENCES public.ball_types(id) ON DELETE CASCADE,
  number       integer      NOT NULL
);
ALTER TABLE public.draw_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read draw_results"
  ON public.draw_results FOR SELECT TO public USING (true);

-- 8) Grants: allow reads broadly, writes via service_role/authenticated
GRANT SELECT ON
  public.games, public.ball_types, public.draws, public.draw_results
  TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON
  public.games TO authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON
  public.ball_types, public.draws, public.draw_results TO service_role;
