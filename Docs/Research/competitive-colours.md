# Competitive Colour Analysis Board – Powerpick

> **Objective** — Benchmark the colour systems of leading lottery and fintech apps to validate— or challenge —our current deep‑blue + gold palette. Findings feed directly into `design/tokens.json` and inform upcoming hallway tests.

---

## Method

* **Scope:** Top‑ranked apps in App Store/Google Play within *lottery* and *finance (consumer investing)* categories.
* **Capture:** Home/landing screen on iPhone 13 @ 100 % brightness, dark‑mode OFF.
* **Annotations:** Key UI regions called‑out with numbered tags that map to colour swatches + WCAG AA scores.
* **Accessibility Pass:** Tested each primary/secondary combination in Stark → passed ≥ AA for body text.

---

|  #  | Competitor           | Segment  | Screenshot                                                    | Primary   | Accent    | Neutral BG       | WCAG AA Pass? | Notes                                                                                                   |
| :-: | -------------------- | -------- | ------------------------------------------------------------- | --------- | --------- | ---------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
|   1 | **The Lott** (AU)    | Lottery  | ![The Lott](../../design/competitive/the-lott-home.png)       | `#003298` | `#FFD200` | `#FFFFFF`        | ✅ 7.8∶1       | Leans corporate/royal blue → high trust; yellow CTAs pop; low neutral diversity (white only).           |
|   2 | **Lotterywest** (AU) | Lottery  | ![Lotterywest](../../design/competitive/lotterywest-home.png) | `#0070B9` | `#FFB100` | `#F7F9FA`        | ✅ 6.2∶1       | Similar blue/yellow schema; softer grey BG helps card separation; accents used sparingly.               |
|   3 | **Jackpocket** (US)  | Lottery  | ![Jackpocket](../../design/competitive/jackpocket-home.png)   | `#0046F5` | `#27C9FF` | `#FFFFFF`        | ✅ 8.5∶1       | Modern flat look; electric‑cyan accent for buttons; strong white/blue contrast; minimal secondary hues. |
|   4 | **Lottoland** (EU)   | Lottery  | ![Lottoland](../../design/competitive/lottoland-home.png)     | `#6FC22C` | `#B5E04A` | `#FFFFFF`        | ✅ 4.9∶1       | Green signals *winning* & eco; pastel variant for hover; brand‑unique but risks colour‑blind confusion. |
|   5 | **Robinhood** (US)   | Fin‑tech | ![Robinhood](../../design/competitive/robinhood-home.png)     | `#00C805` | `#0DAB76` | `#1E1E1E` (dark) | ✅ 4.6∶1\*     | All‑green identity; dark BG emphasises charts; passes AA at largest sizes only (\*).                    |

---

### Key Take‑aways

1. **Blue + warm accent is the dominant pattern** in AU/US lottery apps – reinforces trust & excitement. Our `#0C244B` / `#F5A623` pairing fits this mental model but skews deeper/richer, helping differentiate.
2. **Single‑hue brands** (Jackpocket, Robinhood) rely on layout & typography to create hierarchy. Risk: users with colour vision deficiency (CVD) may lose visual cues ➜ highlights the need for *shape* & *weight* cues.
3. **Contrast compliance is table‑stakes**: every competitor meets AA for primary text, but only The Lott & Jackpocket hit AAA on headers. We should continue aiming for AAA where feasible.
4. **Accent usage is restrained**—typically limited to CTAs and jackpots. Over‑use dilutes "click me" affordance.

---

## CVD‑Safe Simulation

* Ran all five palettes through Coblis (Deuteranopia/Protanopia). Blue‑yellow variants retained distinction. Green‑centric brands (Lottoland, Robinhood) lost clarity → underline or icon pairing recommended.
* **Action:** add `.cvd` suffix tokens (`brand.primary.cvd`, `accent.cvd`, etc.) in `design/tokens.json` mapping to **shape** or **pattern** overlays, not just alt‑colours.

---

## Implications for Powerpick

| Decision                          | Rationale                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| Keep deep‑blue foundation         | Aligns with trust orthodoxy; unique depth differentiates from lighter blues.           |
| Maintain gold/orange accent       | Contrasts blue, meets AA (4.6∶1), evokes "winning" & excitement.                       |
| Introduce **neutral‑dark** set    | Needed for dark‑mode and secondary surfaces; competitors rely on pure white/grey only. |
| Create **CVD variants** in tokens | 8 % male users colour‑blind; ensures action buttons stay discoverable.                 |

---

## Next Steps

1. 💾 **Export** new token pairs (`brand.primary.dark`, `accent.dark`, `neutral.dark`, plus `*.cvd`) to `design/tokens.json`.
2. 🎨 Apply palette in upcoming high‑fi mock‑ups (Sprint 3).
3. 🧑‍🤝‍🧑 **Hallway Test #research‑03** – validate first‑impression of colour scheme with 12 users *(2 colour‑blind)* on 30 June 2025. Record verbatims & emotional tags.
4. 📈 Roll findings into Phase 2 design review.

---

*Document owner: **Product & User Researcher***
*Created: 22 Jun 2025*
*Last updated: 22 Jun 2025*
