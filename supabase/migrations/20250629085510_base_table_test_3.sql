-- ===================================================================
-- Migration: create_generic_lotto_schema + hot_cold_numbers + added csv_url, draw_day, draw_time, next_draw_time, time_zone
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
  from_draw_number  integer       NOT NULL,
  csv_url           text,
  draw_day          text,
  draw_time         time without time zone,
  next_draw_time    timestamptz,
  time_zone         text
);
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read games"
  ON public.games FOR SELECT TO public USING (true);

INSERT INTO public.games (
  id,
  name,
  region,
  logo_url,
  jackpot,
  created_at,
  main_max,
  main_count,
  supp_count,
  supp_max,
  powerball_max,
  from_draw_number,
  csv_url,
  draw_day,
  draw_time,
  next_draw_time,
  time_zone
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Saturday Lotto', 'AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/tattslotto.png',
    5000000, '2025-06-22 11:19:16.610769+00',
    45, 6, 2, 45, NULL,
    513,
    'https://api.lotterywest.wa.gov.au/api/v1/games/5127/results-csv',
    'Saturday',
    '19:30',
    '2025-06-22 11:19:16.610769+00',
    'AEST'
  ),(
    '22222222-2222-2222-2222-222222222222',
    'Oz Lotto', 'AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/Oz_Lotto.png',
    5000000, '2025-06-22 11:19:16.610769+00',
    47, 7, 3, 47, NULL,
    1474,
    'https://api.lotterywest.wa.gov.au/api/v1/games/5130/results-csv',
    'Tuesday',
    '20:30',
    '2025-06-22 11:19:16.610769+00',
    'AEST'
  ),(
    '33333333-3333-3333-3333-333333333333',
    'Powerball', 'AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/powerball.png',
    5000000, '2025-06-22 11:19:16.610769+00',
    35, 7, 0, 0, 20,
    1144,
    'https://api.lotterywest.wa.gov.au/api/v1/games/5132/results-csv',
    'Thursday',
    '20:30',
    '2025-06-22 11:19:16.610769+00',
    'AEST'
  ),(
    '44444444-4444-4444-4444-444444444444',
    'Weekday Windfall', 'AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/weekday_windfall.png',
    5000000, '2025-06-22 11:19:16.610769+00',
    45, 6, 2, 45, NULL,
    4392,
    'https://api.lotterywest.wa.gov.au/api/v1/games/5303/results-csv',
    'Monday,Wednesday,Friday',
    '20:30',
    '2025-06-22 11:19:16.610769+00',
    'AEST'
  ),(
    '55555555-5555-5555-5555-555555555555',
    'Set for Life', 'AU',
    'https://damfzsmplbsbraqcmagv.supabase.co/storage/v1/object/public/powerpick/set_for_life.png',
    5000000, '2025-06-22 11:19:16.610769+00',
    44, 7, 2, 44, NULL,
    1691,
    'https://api.lotterywest.wa.gov.au/api/v1/games/5237/results-csv',
    'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
    '21:00',
    '2025-06-22 11:19:16.610769+00',
    'AEST'
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

-- 8) Helper: map day-name ➜ 0-6
create or replace function public.dow_from_dayname(p_day text)
returns int
language sql immutable as $$
  select case lower(trim(p_day))
    when 'sunday'    then 0
    when 'monday'    then 1
    when 'tuesday'   then 2
    when 'wednesday' then 3
    when 'thursday'  then 4
    when 'friday'    then 5
    when 'saturday'  then 6
  end;
$$;

-- 9) One-time seed for next_draw_time
update public.games g
set next_draw_time =
  (
    date_trunc('day', now() at time zone g.time_zone)
    + g.draw_time
    + (
        ( public.dow_from_dayname(g.draw_day) 
          - extract(dow from (now() at time zone g.time_zone))
          + 7
        ) % 7
      ) * interval '1 day'
  ) at time zone g.time_zone
where next_draw_time is null;

-- 10) Trigger function: recalc next draw after every result insert
create or replace function public.update_next_draw()
returns trigger
language plpgsql security definer as $$
declare
  target_dow int;
  tz         text;
  lt         time;
  draw_ts    timestamptz;
  next_ts    timestamptz;
begin
  /* fetch schedule from `games` */
  select public.dow_from_dayname(draw_day), time_zone, draw_time
    into target_dow, tz, lt
  from public.games where id = new.game_id;

  /* timestamp of the draw we just inserted */
  draw_ts := (new.draw_date::timestamptz + lt) at time zone tz;

  /* start with this week’s scheduled time */
  next_ts := (date_trunc('day', draw_ts) + lt);

  /* roll forward until it’s strictly after draw_ts */
  while next_ts <= draw_ts loop
    next_ts := next_ts + interval '1 week';
  end loop;

  /* update source-of-truth column */
  update public.games
     set next_draw_time = next_ts
   where id = new.game_id;

  return new;
end;
$$;

-- 11) Attach trigger
drop trigger if exists trg_update_next_draw on public.draws;
create trigger trg_update_next_draw
after insert on public.draws
for each row execute function public.update_next_draw();

-- 12) OPTIONAL: daily “safety net” job stub (comment out if not needed)
select cron.schedule(
  'sync_next_draw_times',
  '0 4 * * *',  -- 04:00 every day
  $$ select 1 $$  -- replace with net.http_post(...) when your Edge Function is ready
);
