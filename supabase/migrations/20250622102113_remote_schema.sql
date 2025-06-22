create sequence "public"."powerball_draws_id_seq";

create sequence "public"."saturday_lotto_draws_id_seq";

create sequence "public"."set_for_life_draws_id_seq";

create sequence "public"."weekday_windfall_draws_id_seq";

DROP TABLE IF EXISTS public.games;

CREATE TABLE public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NOT NULL,
  jackpot numeric NOT NULL
);


alter table "public"."games" enable row level security;

create table "public"."oz_lotto_draws" (
    "draw_number" integer not null,
    "draw_date" date not null,
    "winning_numbers" integer[] not null,
    "supplementary_numbers" integer[] not null,
    "number_of_main" integer not null,
    "number_of_supps" integer not null
);


create table "public"."powerball_draws" (
    "id" integer not null default nextval('powerball_draws_id_seq'::regclass),
    "draw_number" integer not null,
    "draw_date" date not null,
    "winning_numbers" integer[] not null,
    "powerball" integer not null,
    "created_at" timestamp without time zone default now()
);


create table "public"."saturday_lotto_draws" (
    "id" integer not null default nextval('saturday_lotto_draws_id_seq'::regclass),
    "draw_number" integer not null,
    "draw_date" date not null,
    "winning_numbers" integer[] not null,
    "supplementary_numbers" integer[],
    "created_at" timestamp without time zone default now()
);


create table "public"."set_for_life_draws" (
    "id" integer not null default nextval('set_for_life_draws_id_seq'::regclass),
    "draw_number" integer not null,
    "draw_date" date not null,
    "winning_numbers" integer[] not null,
    "supplementary_numbers" integer[],
    "created_at" timestamp without time zone default now()
);


create table "public"."weekday_windfall_draws" (
    "id" integer not null default nextval('weekday_windfall_draws_id_seq'::regclass),
    "draw_number" integer not null,
    "draw_date" date not null,
    "winning_numbers" integer[] not null,
    "supplementary_numbers" integer[],
    "created_at" timestamp without time zone default now()
);


alter sequence "public"."powerball_draws_id_seq" owned by "public"."powerball_draws"."id";

alter sequence "public"."saturday_lotto_draws_id_seq" owned by "public"."saturday_lotto_draws"."id";

alter sequence "public"."set_for_life_draws_id_seq" owned by "public"."set_for_life_draws"."id";

alter sequence "public"."weekday_windfall_draws_id_seq" owned by "public"."weekday_windfall_draws"."id";

CREATE UNIQUE INDEX games_pkey ON public.games USING btree (id);

CREATE UNIQUE INDEX oz_lotto_draws_pkey ON public.oz_lotto_draws USING btree (draw_number);

CREATE UNIQUE INDEX powerball_draws_draw_number_key ON public.powerball_draws USING btree (draw_number);

CREATE UNIQUE INDEX powerball_draws_pkey ON public.powerball_draws USING btree (id);

CREATE UNIQUE INDEX saturday_lotto_draws_draw_number_key ON public.saturday_lotto_draws USING btree (draw_number);

CREATE UNIQUE INDEX saturday_lotto_draws_pkey ON public.saturday_lotto_draws USING btree (id);

CREATE UNIQUE INDEX set_for_life_draws_draw_number_key ON public.set_for_life_draws USING btree (draw_number);

CREATE UNIQUE INDEX set_for_life_draws_pkey ON public.set_for_life_draws USING btree (id);

CREATE UNIQUE INDEX weekday_windfall_draws_draw_number_key ON public.weekday_windfall_draws USING btree (draw_number);

CREATE UNIQUE INDEX weekday_windfall_draws_pkey ON public.weekday_windfall_draws USING btree (id);

alter table "public"."games" add constraint "games_pkey" PRIMARY KEY using index "games_pkey";

alter table "public"."oz_lotto_draws" add constraint "oz_lotto_draws_pkey" PRIMARY KEY using index "oz_lotto_draws_pkey";

alter table "public"."powerball_draws" add constraint "powerball_draws_pkey" PRIMARY KEY using index "powerball_draws_pkey";

alter table "public"."saturday_lotto_draws" add constraint "saturday_lotto_draws_pkey" PRIMARY KEY using index "saturday_lotto_draws_pkey";

alter table "public"."set_for_life_draws" add constraint "set_for_life_draws_pkey" PRIMARY KEY using index "set_for_life_draws_pkey";

alter table "public"."weekday_windfall_draws" add constraint "weekday_windfall_draws_pkey" PRIMARY KEY using index "weekday_windfall_draws_pkey";

alter table "public"."powerball_draws" add constraint "powerball_draws_draw_number_key" UNIQUE using index "powerball_draws_draw_number_key";

alter table "public"."saturday_lotto_draws" add constraint "saturday_lotto_draws_draw_number_key" UNIQUE using index "saturday_lotto_draws_draw_number_key";

alter table "public"."set_for_life_draws" add constraint "set_for_life_draws_draw_number_key" UNIQUE using index "set_for_life_draws_draw_number_key";

alter table "public"."weekday_windfall_draws" add constraint "weekday_windfall_draws_draw_number_key" UNIQUE using index "weekday_windfall_draws_draw_number_key";

grant delete on table "public"."games" to "anon";

grant insert on table "public"."games" to "anon";

grant references on table "public"."games" to "anon";

grant select on table "public"."games" to "anon";

grant trigger on table "public"."games" to "anon";

grant truncate on table "public"."games" to "anon";

grant update on table "public"."games" to "anon";

grant delete on table "public"."games" to "authenticated";

grant insert on table "public"."games" to "authenticated";

grant references on table "public"."games" to "authenticated";

grant select on table "public"."games" to "authenticated";

grant trigger on table "public"."games" to "authenticated";

grant truncate on table "public"."games" to "authenticated";

grant update on table "public"."games" to "authenticated";

grant delete on table "public"."games" to "service_role";

grant insert on table "public"."games" to "service_role";

grant references on table "public"."games" to "service_role";

grant select on table "public"."games" to "service_role";

grant trigger on table "public"."games" to "service_role";

grant truncate on table "public"."games" to "service_role";

grant update on table "public"."games" to "service_role";

grant delete on table "public"."oz_lotto_draws" to "anon";

grant insert on table "public"."oz_lotto_draws" to "anon";

grant references on table "public"."oz_lotto_draws" to "anon";

grant select on table "public"."oz_lotto_draws" to "anon";

grant trigger on table "public"."oz_lotto_draws" to "anon";

grant truncate on table "public"."oz_lotto_draws" to "anon";

grant update on table "public"."oz_lotto_draws" to "anon";

grant delete on table "public"."oz_lotto_draws" to "authenticated";

grant insert on table "public"."oz_lotto_draws" to "authenticated";

grant references on table "public"."oz_lotto_draws" to "authenticated";

grant select on table "public"."oz_lotto_draws" to "authenticated";

grant trigger on table "public"."oz_lotto_draws" to "authenticated";

grant truncate on table "public"."oz_lotto_draws" to "authenticated";

grant update on table "public"."oz_lotto_draws" to "authenticated";

grant delete on table "public"."oz_lotto_draws" to "service_role";

grant insert on table "public"."oz_lotto_draws" to "service_role";

grant references on table "public"."oz_lotto_draws" to "service_role";

grant select on table "public"."oz_lotto_draws" to "service_role";

grant trigger on table "public"."oz_lotto_draws" to "service_role";

grant truncate on table "public"."oz_lotto_draws" to "service_role";

grant update on table "public"."oz_lotto_draws" to "service_role";

grant delete on table "public"."powerball_draws" to "anon";

grant insert on table "public"."powerball_draws" to "anon";

grant references on table "public"."powerball_draws" to "anon";

grant select on table "public"."powerball_draws" to "anon";

grant trigger on table "public"."powerball_draws" to "anon";

grant truncate on table "public"."powerball_draws" to "anon";

grant update on table "public"."powerball_draws" to "anon";

grant delete on table "public"."powerball_draws" to "authenticated";

grant insert on table "public"."powerball_draws" to "authenticated";

grant references on table "public"."powerball_draws" to "authenticated";

grant select on table "public"."powerball_draws" to "authenticated";

grant trigger on table "public"."powerball_draws" to "authenticated";

grant truncate on table "public"."powerball_draws" to "authenticated";

grant update on table "public"."powerball_draws" to "authenticated";

grant delete on table "public"."powerball_draws" to "service_role";

grant insert on table "public"."powerball_draws" to "service_role";

grant references on table "public"."powerball_draws" to "service_role";

grant select on table "public"."powerball_draws" to "service_role";

grant trigger on table "public"."powerball_draws" to "service_role";

grant truncate on table "public"."powerball_draws" to "service_role";

grant update on table "public"."powerball_draws" to "service_role";

grant delete on table "public"."saturday_lotto_draws" to "anon";

grant insert on table "public"."saturday_lotto_draws" to "anon";

grant references on table "public"."saturday_lotto_draws" to "anon";

grant select on table "public"."saturday_lotto_draws" to "anon";

grant trigger on table "public"."saturday_lotto_draws" to "anon";

grant truncate on table "public"."saturday_lotto_draws" to "anon";

grant update on table "public"."saturday_lotto_draws" to "anon";

grant delete on table "public"."saturday_lotto_draws" to "authenticated";

grant insert on table "public"."saturday_lotto_draws" to "authenticated";

grant references on table "public"."saturday_lotto_draws" to "authenticated";

grant select on table "public"."saturday_lotto_draws" to "authenticated";

grant trigger on table "public"."saturday_lotto_draws" to "authenticated";

grant truncate on table "public"."saturday_lotto_draws" to "authenticated";

grant update on table "public"."saturday_lotto_draws" to "authenticated";

grant delete on table "public"."saturday_lotto_draws" to "service_role";

grant insert on table "public"."saturday_lotto_draws" to "service_role";

grant references on table "public"."saturday_lotto_draws" to "service_role";

grant select on table "public"."saturday_lotto_draws" to "service_role";

grant trigger on table "public"."saturday_lotto_draws" to "service_role";

grant truncate on table "public"."saturday_lotto_draws" to "service_role";

grant update on table "public"."saturday_lotto_draws" to "service_role";

grant delete on table "public"."set_for_life_draws" to "anon";

grant insert on table "public"."set_for_life_draws" to "anon";

grant references on table "public"."set_for_life_draws" to "anon";

grant select on table "public"."set_for_life_draws" to "anon";

grant trigger on table "public"."set_for_life_draws" to "anon";

grant truncate on table "public"."set_for_life_draws" to "anon";

grant update on table "public"."set_for_life_draws" to "anon";

grant delete on table "public"."set_for_life_draws" to "authenticated";

grant insert on table "public"."set_for_life_draws" to "authenticated";

grant references on table "public"."set_for_life_draws" to "authenticated";

grant select on table "public"."set_for_life_draws" to "authenticated";

grant trigger on table "public"."set_for_life_draws" to "authenticated";

grant truncate on table "public"."set_for_life_draws" to "authenticated";

grant update on table "public"."set_for_life_draws" to "authenticated";

grant delete on table "public"."set_for_life_draws" to "service_role";

grant insert on table "public"."set_for_life_draws" to "service_role";

grant references on table "public"."set_for_life_draws" to "service_role";

grant select on table "public"."set_for_life_draws" to "service_role";

grant trigger on table "public"."set_for_life_draws" to "service_role";

grant truncate on table "public"."set_for_life_draws" to "service_role";

grant update on table "public"."set_for_life_draws" to "service_role";

grant delete on table "public"."weekday_windfall_draws" to "anon";

grant insert on table "public"."weekday_windfall_draws" to "anon";

grant references on table "public"."weekday_windfall_draws" to "anon";

grant select on table "public"."weekday_windfall_draws" to "anon";

grant trigger on table "public"."weekday_windfall_draws" to "anon";

grant truncate on table "public"."weekday_windfall_draws" to "anon";

grant update on table "public"."weekday_windfall_draws" to "anon";

grant delete on table "public"."weekday_windfall_draws" to "authenticated";

grant insert on table "public"."weekday_windfall_draws" to "authenticated";

grant references on table "public"."weekday_windfall_draws" to "authenticated";

grant select on table "public"."weekday_windfall_draws" to "authenticated";

grant trigger on table "public"."weekday_windfall_draws" to "authenticated";

grant truncate on table "public"."weekday_windfall_draws" to "authenticated";

grant update on table "public"."weekday_windfall_draws" to "authenticated";

grant delete on table "public"."weekday_windfall_draws" to "service_role";

grant insert on table "public"."weekday_windfall_draws" to "service_role";

grant references on table "public"."weekday_windfall_draws" to "service_role";

grant select on table "public"."weekday_windfall_draws" to "service_role";

grant trigger on table "public"."weekday_windfall_draws" to "service_role";

grant truncate on table "public"."weekday_windfall_draws" to "service_role";

grant update on table "public"."weekday_windfall_draws" to "service_role";

create policy "Users can read games"
on "public"."games"
as permissive
for select
to public
using (true);



