#!/usr/bin/env python3
"""
weight_generation.py

Compute decay-adjusted per-ball weights from historical draws
and emit a JSON file for assets/weights/<game>.json.
"""

import pandas as pd
import numpy as np
import json
import os
from datetime import datetime

# ──────────── Configuration ────────────
DRAW_CSV_PATH    = "data/draw_history.csv"  # your draws CSV
DECAY_HALF_LIFE  = 120                     # in draws
GAME_ID          = "saturday_lotto"        # used for output filename
OUTPUT_DIR       = "assets/weights"         # where to save JSON
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ──────────── Load Data ────────────
df = pd.read_csv(DRAW_CSV_PATH, parse_dates=["draw_date"])
df = df.sort_values("draw_date", ascending=False).reset_index(drop=True)

# ──────────── Compute Decay Weights ────────────
df["draw_index"]   = df.index
df["decay_weight"] = 0.5 ** (df["draw_index"] / DECAY_HALF_LIFE)

# ──────────── Aggregate Frequencies ────────────
ball_cols = [c for c in df.columns if c.startswith("ball")]
melted   = df.melt(
    id_vars=["draw_index", "decay_weight"],
    value_vars=ball_cols,
    value_name="ball_number"
).dropna(subset=["ball_number"])

weights_df = (
    melted
    .groupby("ball_number")["decay_weight"]
    .sum()
    .reset_index()
    .sort_values("ball_number")
)

# ──────────── Normalize & Build List ────────────
max_ball = int(weights_df["ball_number"].max())
weight_list = [0.0] * (max_ball + 1)
for _, row in weights_df.iterrows():
    idx = int(row["ball_number"])
    weight_list[idx] = float(row["decay_weight"])

avg = np.mean(weight_list[1:])  # ignore index 0
weight_list = [0.0 if i == 0 else w / avg for i, w in enumerate(weight_list)]

# ──────────── Output JSON ────────────
output = {
    "generated_at": datetime.utcnow().isoformat() + "Z",
    "decay_half_life": DECAY_HALF_LIFE,
    "weights": weight_list
}

out_path = f"{OUTPUT_DIR}/{GAME_ID}.json"
with open(out_path, "w") as f:
    json.dump(output, f, indent=2)

print(f"✔ Saved weights → {out_path}")
print(f"Sum of weights (excluding index 0): {sum(weight_list[1:]):.2f}")
