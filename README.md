# Powerpick

**Predict smarter. Play responsibly.**

> A cross‑platform (iOS · Android · Web) Expo/React Native app that delivers draw history, hot/cold analytics, and statistically‑weighted number suggestions for the world’s biggest lotteries—starting in **Australia** and expanding to the **USA** and **Europe**.
> _Powerpick does **not** sell tickets or guarantee winnings – it simply visualises probability so players can make informed, responsible choices._

![CI](https://github.com/<org>/powerpick/actions/workflows/ci.yml/badge.svg)

---

## 📋 Table of Contents

1. [Product Vision](#-product-vision)
2. [Core Features (v1)](#-core-features-v1)
3. [Roadmap](#-roadmap)
4. [Tech Stack](#-tech-stack)
5. [Implemented Screens & Features](#-implemented-screens--features)
6. [Visual Language & Accessibility](#-visual-language--accessibility)
7. [Getting Started (Development)](#-getting-started-development)
8. [Workflow & Contributing](#-workflow--contributing)
9. [Deployment & Scheduling](#-deployment--scheduling)
10. [Repository Structure](#-repository-structure)
11. [Personas & Documentation](#-personas--documentation)
12. [License](#-license)
13. [Acknowledgements](#-acknowledgements)

---

## 🎯 Product Vision

Powerpick is an **insight companion** for casual lotto players aged **25 – 55** who enjoy analysing trends before buying a ticket. It sits between the extremes of _pure luck_ and _snake‑oil predictions_ – surfacing real statistics in a clean, lightning‑fast UI.

- **Audience mindset:** data‑curious, mobile‑first, prefers visuals over spreadsheets.
- **Design language:** dark foundation (`#141414`) with black bars (`#000000`), purple highlights (`#7B1FA2`), and AA+ contrast throughout.
- **Value proposition:** one‑tap draw lookup, digestible analytics, and fun yet transparent number suggestions – all wrapped in a freemium model that respects attention (banner ads only on the free tier).

---

## ✨ Core Features (v1)

| Category                         | Feature                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| **Draw History**                 | Latest 20 draws for Saturday Lotto, Powerball, Oz Lotto, Weekday Windfall, Set for Life       |
| **Analytics**                    | Hot/Cold, Overdue, Pair frequency, Gap charts                                                 |
| **Predictions**                  | Generate number sets using **bell‑curve sum balancing using combination of hot/cold numbers** |
| + hot/cold sliders; save & share |
| **Accounts**                     | Optional sign‑in (Supabase Auth) to sync saved predictions                                    |
| **Notifications**                | Push alerts for new draw results (Expo Notifications)                                         |
| **Monetisation**                 | One‑time **Pro** unlock: unlimited predictions, advanced stats, remove ads (Stripe IAP)       |

### 🎲 Bell‑Curve Sum Balancing (Why It Matters)

Winning combinations tend to cluster around the statistical mean of the game’s total number space. Powerpick keeps suggestions inside the busiest 70 % of that bell curve while still respecting user‑defined hot/cold weightings.

---

## 🗺️ Roadmap

Road‑mapping is broken into **phases** – each two weeks long and tracked in the GitHub project board.

| Phase | Weeks  | Theme (lead)                          | Exit Criteria                                                                |
| ----- | ------ | ------------------------------------- | ---------------------------------------------------------------------------- |
| **0** |  1‑2   | Foundations (TPM)                     | CI pipeline green, design tokens merged, skeleton app boots on all platforms |
| **1** |  3‑4   | Discovery (Research)                  | Updated research doc signed‑off                                              |
| **2** |  5‑6   | Concept & Visual Design (UI/UX + Art) | Approved high‑fi mock‑ups                                                    |
| **3** |  7‑8   | Tech Scaffold (FE + BE)               | Header & Region Selector render live data                                    |
| **4** |  9‑14  | Implementation Sprints 1‑3            | Users can select region → generate & save numbers                            |
| **6** |  15‑18 | Improve predictions code with ML      | When approved                                                                |
| **7** |  15‑18 | Pre‑Launch Hardening                  | Zero P1 bugs; store listings approved                                        |
| **8** |  19‑∞  | Launch & Growth                       | Continuous ASO, feature expansion                                            |

_Current phase: **4 – Implementation**_

For deeper detail see [`Docs/Phase_0.md`](Docs/Phase_0.md) and [`Docs/WORKFLOW.md`](Docs/WORKFLOW.md).

---

## 🏗️ Tech Stack

| Layer          | Choice                               | Why                                     |
| -------------- | ------------------------------------ | --------------------------------------- |
| **Frontend**   | Expo SDK (React Native + TypeScript) | Single code‑base across iOS/Android/Web |
| **Navigation** | Expo Router                          | File‑based routing & deep‑linking       |
| **State**      | React Context + Zustand              | Lightweight & persistent                |
| **Backend**    | Supabase (PostgreSQL, RLS)           | Real‑time SQL without servers           |
| **Auth**       | Supabase Auth (email/OAuth)          | Secure & fast setup                     |
| **Hosting**    | Vercel (Web) · EAS Builds (mobile)   | CI/CD & OTA updates                     |
| **Scripting**  | Python (pandas etc.)                 | Robust data ingestion                   |

---

## ✅ Implemented Screens & Features

- Home screen with live game grid
- Region selector in the header
- Bottom navigation bar linking Home and Settings
- Game options screen with hot/cold sliders and CSV/TXT/XLSX export
- Draw history and hot/cold number screens
- Light/dark mode toggle in Settings

---

## 🎨 Visual Language & Accessibility

- **Screen background**: `#141414`
- **App bar & bottom nav backgrounds**: `#000000`
- **Card & dropdown background**: `#1d1d1d`
- **Primary accent**: `#7B1FA2`
- **Text primary**: `#FFFFFF`
- **Text secondary & icons**: `#9a9a9a`
- **Spacing & corner radii**: margins/gutters 8 dp; corner radius 8 dp (cards & dropdown), 16 dp (tab control)

---

## ⚡ Getting Started (Development)

1. **Clone & Install**

   ```bash
   git clone git@github.com:<org>/powerpick.git
   cd powerpick
   yarn install --offline  # installs from /vendor without network
   yarn test               # runs Jest smoke suite
   ```

2. **Environment** – duplicate `.env.example` as `.env` (the file is gitignored) and add your Supabase keys (`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`).
   The older names `SUPABASE_URL` and `SUPABASE_ANON_KEY` are still read if the new ones are missing.
3. **Database** – run `supabase db reset` then `supabase start` to apply the
   migrations in `supabase/migrations/`.
4. **Create Indexes** – `node lib/createIndexes.ts` prints SQL. Execute it via
   the Supabase SQL editor.
5. **Sync Draw History** – schedule `yarn sync-draws` with
   [Vercel Cron](https://vercel.com/docs/cron-jobs) or a GitHub Actions
   workflow. The script requires `SUPABASE_SERVICE_ROLE_KEY` so it can write to
   the database. Run `yarn sync-draws [gameId]` manually to backfill or debug a
   specific game.
6. **Update Hot & Cold Numbers** – invoke `yarn sync-hotcold` on the same
   schedule after draws have synced. Database triggers also update these fields
   whenever new results arrive.
7. **Run the App**
   \| Platform | Command | Notes |
   \| -------- | ---------------------- | ----- |
   \| Mobile | `yarn start` | Scan QR in **Expo Go** |
   \| Web | `yarn web` | Opens `http://localhost:19006` |

> **Tip:** Use `yarn lint` & `yarn format` before every commit to keep CI green.

---

## 🛠️ Workflow & Contributing

See [Docs/WORKFLOW.md](Docs/WORKFLOW.md) for the full guide. Key points:

- Name branches with `feat/`, `fix/` or `chore/` prefixes.
- Run `yarn lint`, `yarn format`, and `yarn test` before pushing.
- Open PRs early and keep commits focused.

---

## 🚀 Deployment & Scheduling

Powerpick runs across several platforms:

| Concern                              | Best surface                                        | Why                                                                |
| ------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------ |
| Web build, CDN, edge/serverless APIs | **Vercel**                                          | Auto‑pulls from GitHub, zero‑config CDN, built‑in Cron and secrets |
| iOS/Android binaries & OTA updates   | **Expo EAS Build + EAS Update**                     | Cloud Mac/Linux workers, store submit, one‑click OTA patches       |
| Database-local jobs                  | **Supabase Edge Function** scheduled via `pg_cron`  | 0 ms latency to Postgres; secrets stored in Vault                  |
| Long/heavy workflows                 | **GitHub Actions**                                  | Up to 72 h on hosted runners, 5‑min cron granularity               |
| Optional extra cron capacity         | Cloudflare Workers, Railway, Render, Upstash QStash | Use if you need per‑minute triggers or already pay those vendors   |

Schedule the Node sync scripts (`yarn sync-draws` and `yarn sync-hotcold`) on Vercel Cron or GitHub Actions with the `SUPABASE_SERVICE_ROLE_KEY` secret. Database-first jobs can use `pg_net.http_post` to call a Supabase Edge Function.

**Checklist**

- Add `vercel.json` with build and cron config.
- Connect Expo EAS to your repo and store credentials in GitHub secrets.
- Define Supabase cron SQL for any DB-local tasks.
- Use GitHub Actions for mobile builds and heavy workflows.

---

## 🗂️ Repository Structure

```
powerpick
├── .env.example
├── eslint.config.js
├── .gitignore
├── .prettierignore
├── .yarnrc
├── AGENTS.md
├── LICENSE
├── app.config.ts
├── app.json
├── index.js
├── assets.d.ts
├── babel.config.cjs
├── jest.config.cjs
├── jestSetup.cjs
├── jestSetupAfterEnv.cjs
├── jestSetupMocks.cjs
├── metro.config.cjs
├── package.json
├── README.md
├── requirements.txt
├── tsconfig.json
├── tsconfig.node.json
├── yarn.lock
├── app
│   ├── **tests**
│   ├── game
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── settings.tsx
│   └── tokens.json
├── assets
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   ├── logo.png
│   ├── logo.svg
│   ├── placeholder.png
│   ├── powerball.png
│   ├── tattslotto.png
│   ├── splash-icon.png
│   └── weekday_windfall.png
├── coverage
├── design
│   ├── mockups
│   └── wireframes
├── Docs
│   ├── IconSizes.md
│   ├── Phase_0.md
│   ├── Phase_4.md
│   ├── WORKFLOW.md
│   └── Research
│       └── competitive-colours.md
├── src
│   ├── components
│   │   ├── Auth.tsx
│   │   ├── BottomNav.tsx
│   │   ├── ComingSoon.tsx
│   │   ├── GameCard.tsx
│   │   ├── GameGrid.tsx
│   │   ├── Header.tsx
│   │   ├── HomeTopBar.tsx
│   │   └── RegionPicker.tsx
│   ├── lib
│   │   ├── **tests**
│   │   ├── constants.ts
│   │   ├── createIndexes.ts
│   │   ├── csvParser.ts
│   │   ├── database.types.ts
│   │   ├── gameColors.ts
│   │   ├── gameConfigs.ts
│   │   ├── gamesApi.ts
│   │   ├── generator.ts
│   │   ├── hotCold.ts
│   │   ├── logger.ts
│   │   ├── regionConfig.ts
│   │   ├── supabase.ts
│   │   ├── syncDraws.ts
│   │   ├── syncHotCold.ts
│   │   ├── testUtils.tsx
│   │   └── theme.tsx
│   └── stores
│       ├── useGamesStore.ts
│       ├── useGeneratedNumbersStore.ts
│       └── useRegionStore.ts
├── personas
│   └── The Team.md
├── supabase
│   ├── .temp
│   └── migrations
├── vendor
└── folder_tree.md

```

_(Full tree in [`folder_tree.md`](folder_tree.md))_

---

## Vendored Dependencies

All runtime and development packages live in the `vendor/` folder. A `.yarnrc` file points Yarn to this offline mirror.
To install or update them, run:

```bash
yarn install --offline
```

---

## 👥 Personas & Documentation

All role personas live in `/personas/` and are _the_ reference for tone, deliverables, and hand‑offs. Start there if you’re unsure how to communicate or what’s expected.

Additional research & design artefacts:

- `Docs/Research/` – user interviews, demographic data.
- `Docs/supabase-access.md` – how to run sync scripts with service keys.
- `app/tokens.json` – source of truth for colour and spacing tokens.

The Supabase schema typings in `lib/database.types.ts` now include draw
schedule fields (`csv_url`, `draw_day`, `draw_time`, `next_draw_time`,
`time_zone`).

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 🙏 Acknowledgements

- Australian, US, and EU lottery operators – for making draw data publicly available.
- The Expo & Supabase communities for stellar open‑source tooling.
- Everyone contributing code, design, testing, or feedback – you rock!
