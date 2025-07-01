# Phase 4 – Implementation

This phase covers **Implementation Sprints 1‑3**, where the core user flows come to life. Key objectives:

1. **Region Selection** – load real draw data and allow players to choose their preferred lottery.
2. **Number Generation** – produce statistically‑weighted suggestions based on the selected game.
3. **Saving Predictions** – store generated numbers to the user's account with local persistence.
4. **Better Predictions** – improve prdiction code using combination of hot/cold numbers using the bell curve including ML.
5. **Exit Criteria** – users can select region → generate & save numbers.

Further adjustments may expand on these goals as the project progresses.

**Current status (July 2025):** the app now includes a basic sign‑in screen using Supabase Auth. The region picker and number generator are fully functional, and generated numbers persist locally via Zustand. Sync scripts continue to pull draw data and update hot/cold analytics in Supabase.