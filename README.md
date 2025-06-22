# Powerpick

**Predict smarter. Play responsibly.**

> A cross‑platform (iOS · Android · Web) Expo/React Native app that delivers draw history, hot/cold analytics, and statistically‑weighted number suggestions for the world’s biggest lotteries—starting in **Australia** and expanding to the **USA** and **Europe**.
> *Powerpick does **not** sell tickets or guarantee winnings – it simply visualises probability so players can make informed, responsible choices.*

![CI](https://github.com/<org>/powerpick/actions/workflows/ci.yml/badge.svg)

---

## 📋 Table of Contents

1. [Product Vision](#-product-vision)
2. [Core Features (v1)](#-core-features-v1)
3. [Roadmap](#-roadmap)
4. [Tech Stack](#-tech-stack)
5. [Getting Started (Development)](#-getting-started-development)
6. [Workflow & Contributing](#-workflow--contributing)
7. [Repository Structure](#-repository-structure)
8. [Personas & Documentation](#-personas--documentation)
9. [License](#-license)
10. [Acknowledgements](#-acknowledgements)

---

## 🎯 Product Vision

Powerpick is an **insight companion** for casual lotto players aged **25 – 55** who enjoy analysing trends before buying a ticket. It sits between the extremes of *pure luck* and *snake‑oil predictions* – surfacing real statistics in a clean, lightning‑fast UI. fileciteturn5file15

* **Audience mindset:** data‑curious, mobile‑first, prefers visuals over spreadsheets.
* **Design language:** deep‑blue foundation (`#0C244B`) for trust, gold/orange accents (`#F5A623`) for excitement, AA+ contrast throughout.
* **Value proposition:** one‑tap draw lookup, digestible analytics, and fun yet transparent number suggestions – all wrapped in a freemium model that respects attention (banner ads only on the free tier).

---

## ✨ Core Features (v1)

| Category          | Feature                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------- |
| **Draw History**  | Latest 20 draws for Saturday Lotto, Powerball, Oz Lotto, Weekday Windfall, Set for Life  |
| **Analytics**     | Hot/Cold, Overdue, Pair frequency, Gap charts                                            |
| **Predictions**   | Generate number sets using **bell‑curve sum balancing** + hot/cold sliders; save & share |
| **Accounts**      | Optional sign‑in (Supabase Auth) to sync saved predictions                               |
| **Notifications** | Push alerts for new draw results (Expo Notifications)                                    |
| **Monetisation**  | One‑time **Pro** unlock: unlimited predictions, advanced stats, remove ads (Stripe IAP)  |

### 🎲 Bell‑Curve Sum Balancing (Why It Matters)

Winning combinations tend to cluster around the statistical mean of the game’s total number space. Powerpick keeps suggestions inside the busiest 70 % of that bell curve while still respecting user‑defined hot/cold weightings. fileciteturn5file15

---

## 🗺️ Roadmap

Road‑mapping is broken into **phases** – each two weeks long and tracked in the GitHub project board.

| Phase | Weeks  | Theme (lead)                          | Exit Criteria                                                                                       |
| ----- | ------ | ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **0** |  1‑2   | Foundations (TPM)                     | CI pipeline green, design tokens merged, skeleton app boots on all platforms fileciteturn5file11 |
| **1** |  3‑4   | Discovery (Research)                  | Updated research doc signed‑off                                                                     |
| **2** |  5‑6   | Concept & Visual Design (UI/UX + Art) | Approved high‑fi mock‑ups                                                                           |
| **3** |  7‑8   | Tech Scaffold (FE + BE)               | Header & Region Selector render live data                                                           |
| **4** |  9‑14  | Implementation Sprints 1‑3            | Users can select region → generate & save numbers                                                   |
| **5** |  15‑18 | Pre‑Launch Hardening                  | Zero P1 bugs; store listings approved                                                               |
| **6** |  19‑∞  | Launch & Growth                       | Continuous ASO, feature expansion                                                                   |

For deeper detail see [`docs/Phase_0.md`](docs/Phase_0.md) and [`docs/WORKFLOW.md`](docs/WORKFLOW.md).

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

## 🎨 Visual Language & Accessibility
* **Primary (`#0C244B`)** – trust, stability, legibility on light & dark backgrounds (9.3:1 on white).  
* **Accent (`#F5A623`)** – energy, call-to-action, 4.6:1 on brand-primary.  
* Dark-mode variants (`#081935`, `#FFC04D`) defined in `app/tokens.json`.  
* All colour pairs pass WCAG 2.1 AA; primary text meets AAA.  
* See `design/tokens.json` and Figma **Powerpick Design System** for full ramp.

---

## ⚡ Getting Started (Development)

1. **Clone & Install**

   ```bash
   git clone git@github.com:<org>/powerpick.git
   cd powerpick
   npm ci            # installs exact locked dependencies
   npm test          # runs Jest smoke suite
   ```
2. **Environment** – copy `.env.example` → `.env` and fill in Supabase keys + Slack webhooks.
3. **Database** – run `/supabase/init.sql` or `supabase db reset` then `supabase start`.
4. **Back‑fill Draw Data**

   ```bash
   pip install -r scripts/requirements.txt
   python scripts/download_all.py
   ```
5. **Run the App**
   \| Platform | Command                | Notes |
   \| -------- | ---------------------- | ----- |
   \| Mobile   | `npm run start`        | Scan QR in **Expo Go** |
   \| Web      | `npm run web`          | Opens `http://localhost:19006` |

> **Tip:** Use `npm run lint` & `npm run format` before every commit to keep CI green.

---

## 🗂️ Repository Structure

```
📦powerpick
┣ 📜.env
┣ 📜.gitignore
┣ 📜app.config.ts
┣ 📜app.json
┣ 📜package-lock.json
┣ 📜package.json
┣ 📜README.md
┣ 📜tsconfig.json
┣ 📂app
┃ ┣ 📜index.tsx
┃ ┣ 📜tokens.json
┃ ┗ 📜_layout.tsx
┣ 📂assets
┃ ┣ 📜adaptive-icon.png
┃ ┣ 📜favicon.png
┃ ┣ 📜icon.png
┃ ┣ 📜placeholder.png
┃ ┗ 📜splash-icon.png
┣ 📂components
┃ ┣ 📜Auth.tsx
┃ ┣ 📜GameCard.tsx
┃ ┣ 📜GameGrid.tsx
┃ ┣ 📜Header.tsx
┃ ┣ 📜SettingsRow.tsx
┃ ┗ 📜RegionPicker.tsx
┣ 📂design
┃ ┣ 📂mockups
┃ ┃ ┣ 📜game screen mockup.png
┃ ┃ ┣ 📜home screen mockup.png
┃ ┃ ┗ 📜web page mockup.png
┃ ┗ 📂wireframes
┃ ┃ ┣ 📜home screen concepts.txt
┃ ┃ ┣ 📜Home Screen Example.png
┃ ┃ ┗ 📜Low-fi wireframes.txt
┣ 📂lib
┃ ┣ 📜database.types.ts
┃ ┣ 📜gamesApi.ts
┃ ┣ 📜supabase.ts
┃ ┗ 📜theme.tsx
┣ 📂stores
┃ ┗ 📜useRegionStore.ts
┣ 📂Docs
  ┗ 📂Research
    ┗ 📜competitive-colours.md


```

*(Full tree in [`folder_tree.md`](folder_tree.md))* fileciteturn5file14

---
## Vendored Dependencies

All runtime and development packages live in the `vendor/` folder.  
To install or update them, run:

```bash
npm install --prefix vendor
---


## 👥 Personas & Documentation

All role personas live in `/personas/` and are *the* reference for tone, deliverables, and hand‑offs. Start there if you’re unsure how to communicate or what’s expected. fileciteturn5file0turn5file2turn5file3turn5file4turn5file5turn5file6turn5file7

Additional research & design artefacts:

* `docs/research/` – user interviews, demographic data.
* `design/tokens.json` – source of truth for colour/spacing typography.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 🙏 Acknowledgements

* Australian, US, and EU lottery operators – for making draw data publicly available.
* The Expo & Supabase communities for stellar open‑source tooling.
* Everyone contributing code, design, testing, or feedback – you rock!
