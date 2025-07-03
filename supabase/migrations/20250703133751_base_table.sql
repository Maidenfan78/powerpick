-- ===================================================================
-- Migration: create_generic_lotto_schema (multi‑day timetable upgrade)
-- This file creates the core schema, row‑level security, and adds
-- a draw_timetable table so each game can have multiple weekly draw
-- days.  It also seeds next_draw_time and installs a trigger that
-- recalculates the earliest future draw every time a result row is
-- inserted into `public.draws`.
-- ===================================================================

-- 1) Drop any old tables so this can be re‑run cleanly
DROP TABLE IF EXISTS
  public.draw_timetable,
  public.hot_cold_numbers,
  public.draw_results,
  public.draws,
  public.ball_types,
  public.games
CASCADE;

-- ===================================================================
-- 2) Master games table + RLS + seed data (single row per game)
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
  from_draw_number  integer       NOT NULL,
  csv_url           text,
  draw_day          text,         -- kept for legacy UI, not used by trigger
  draw_time         time without time zone,
  next_draw_time    timestamptz,
  time_zone         text
);
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read games"
  ON public.games FOR SELECT TO public USING (true);

INSERT INTO public.games (
  id, name, region, logo_url, jackpot, created_at,
  main_max, main_count, supp_count, supp_max, powerball_max,
  from_draw_number, csv_url, draw_day, draw_time, next_draw_time, time_zone
) VALUES
  ('11111111-1111-1111-1111-111111111111','Saturday Lotto','AU',
   'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/tattslotto256.png', 
   5000000, now(), 45,6,2,45,NULL,513,
   'https://api.lotterywest.wa.gov.au/api/v1/games/5127/results-csv',
   'Saturday','19:30',now(),'Australia/Melbourne'),
  ('22222222-2222-2222-2222-222222222222','Oz Lotto','AU',
   'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/oz_lotto256.png',
   5000000, now(), 47,7,3,47,NULL,1474,
   'https://api.lotterywest.wa.gov.au/api/v1/games/5130/results-csv',
   'Tuesday','20:30',now(),'Australia/Melbourne'),
  ('33333333-3333-3333-3333-333333333333','Powerball','AU',
   'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/powerball256.png',
   5000000, now(), 35,7,0,0,20,1144,
   'https://api.lotterywest.wa.gov.au/api/v1/games/5132/results-csv',
   'Thursday','20:30',now(),'Australia/Melbourne'),
  ('44444444-4444-4444-4444-444444444444','Weekday Windfall','AU',
   'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/weekday_windfall_grey256.png',
   5000000, now(), 45,6,2,45,NULL,4392,
   'https://api.lotterywest.wa.gov.au/api/v1/games/5303/results-csv',
   'Monday,Wednesday,Friday','20:30',now(),'Australia/Melbourne'),
  ('55555555-5555-5555-5555-555555555555','Set for Life','AU',
   'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/set_for_life256.png',
   5000000, now(), 44,7,2,44,NULL,1691,
   'https://api.lotterywest.wa.gov.au/api/v1/games/5237/results-csv',
   'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday','21:00',now(),
   'Australia/Melbourne')
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

GRANT INSERT, UPDATE, DELETE ON public.games TO authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON
  public.ball_types,
  public.draws,
  public.draw_results TO service_role;

-- ===================================================================
-- 8) Helper: map day‑name ➜ 0‑6
-- ===================================================================
CREATE OR REPLACE FUNCTION public.dow_from_dayname(p_day text)
RETURNS int
LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE lower(trim(p_day))
    WHEN 'sunday'    THEN 0
    WHEN 'monday'    THEN 1
    WHEN 'tuesday'   THEN 2
    WHEN 'wednesday' THEN 3
    WHEN 'thursday'  THEN 4
    WHEN 'friday'    THEN 5
    WHEN 'saturday'  THEN 6
  END;
$$;

-- ===================================================================
-- 9) NEW: multi‑day draw timetable
-- ===================================================================
CREATE TABLE public.draw_timetable (
  game_id    uuid  NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  draw_dow   int   NOT NULL CHECK (draw_dow BETWEEN 0 AND 6),
  local_time time  NOT NULL,
  time_zone  text  NOT NULL,
  PRIMARY KEY (game_id, draw_dow)
);

-- 9a) migrate existing draw_day strings into timetable (idempotent)
INSERT INTO public.draw_timetable (game_id, draw_dow, local_time, time_zone)
SELECT
  g.id,
  public.dow_from_dayname(trim(day_name)),
  g.draw_time,
  g.time_zone
FROM public.games g,
     unnest(string_to_array(g.draw_day, ',')) AS day_name
ON CONFLICT DO NOTHING;

-- ===================================================================
-- 10) Seed next_draw_time using timetable (closest future draw)
-- ===================================================================
UPDATE public.games g
SET next_draw_time = sub.min_ts
FROM (
  SELECT dt.game_id,
         MIN(
           (
             date_trunc('day', NOW() AT TIME ZONE dt.time_zone)
             + dt.local_time
             + ((dt.draw_dow - EXTRACT(DOW FROM (NOW() AT TIME ZONE dt.time_zone)) + 7) % 7)
               * INTERVAL '1 day'
           ) AT TIME ZONE dt.time_zone
         ) AS min_ts
  FROM public.draw_timetable dt
  GROUP BY dt.game_id
) sub
WHERE g.id = sub.game_id
  AND (g.next_draw_time IS NULL OR g.next_draw_time < NOW());

-- ===================================================================
-- 11) Trigger: recalc next draw on result insert (multi‑day aware)
-- ===================================================================
CREATE OR REPLACE FUNCTION public.update_next_draw()
RETURNS trigger
LANGUAGE plpgsql SECURITY definer AS $$
DECLARE
  next_ts timestamptz;
BEGIN
  /* find the earliest scheduled timestamp strictly AFTER the new draw */
  SELECT MIN(candidate_ts)
  INTO   next_ts
  FROM (
    SELECT
      (
        date_trunc('day', NEW.draw_date::timestamptz AT TIME ZONE dt.time_zone)
        + dt.local_time
        + ((dt.draw_dow - EXTRACT(DOW FROM (NEW.draw_date::timestamptz AT TIME ZONE dt.time_zone)) + 7) % 7)
          * INTERVAL '1 day'
      ) AT TIME ZONE dt.time_zone AS candidate_ts
    FROM public.draw_timetable dt
    WHERE dt.game_id = NEW.game_id
  ) t
  WHERE candidate_ts > NEW.draw_date::timestamptz;

  UPDATE public.games
     SET next_draw_time = next_ts
   WHERE id = NEW.game_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_next_draw ON public.draws;
CREATE TRIGGER trg_update_next_draw
AFTER INSERT ON public.draws
FOR EACH ROW EXECUTE FUNCTION public.update_next_draw();

-- ===================================================================
-- 12) OPTIONAL: daily safety‑net cron job (no‑op placeholder)
-- ===================================================================
SELECT cron.schedule(
  'sync_next_draw_times',
  '0 4 * * *',
  $$ SELECT 1 $$
);
