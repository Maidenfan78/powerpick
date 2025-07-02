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
import requests

# ──────────── Configuration ────────────
# Supabase connection details. Use service role if available.
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("EXPO_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_ANON_KEY")
    or os.getenv("EXPO_PUBLIC_SUPABASE_ANON_KEY")
)

DECAY_HALF_LIFE = int(os.getenv("DECAY_HALF_LIFE", "120"))  # in draws
GAME_UUID = os.getenv("GAME_UUID") or "11111111-1111-1111-1111-111111111111"
GAME_SLUG = os.getenv("GAME_SLUG") or "saturday_lotto"
OUTPUT_DIR = "assets/weights"  # where to save JSON
os.makedirs(OUTPUT_DIR, exist_ok=True)

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase credentials are missing")

# ──────────── Load Data ────────────
headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
rows = []
batch = 1000
offset = 0
params = {
    "select": "draw_date,draw_results(number,ball_types(name))",
    "game_id": f"eq.{GAME_UUID}",
    "order": "draw_date.desc",
}
while True:
    rng = f"{offset}-{offset + batch - 1}"
    h = {**headers, "Range-Unit": "items", "Range": rng}
    res = requests.get(f"{SUPABASE_URL}/rest/v1/draws", headers=h, params=params)
    res.raise_for_status()
    page = res.json()
    if not page:
        break
    rows.extend(page)
    if len(page) < batch:
        break
    offset += batch

records = []
for r in rows:
    nums = sorted(
        d["number"]
        for d in r.get("draw_results", [])
        if d.get("ball_types", {}).get("name") == "main"
    )
    rec = {"draw_date": r["draw_date"]}
    for i, n in enumerate(nums, start=1):
        rec[f"ball{i}"] = n
    records.append(rec)

df = (
    pd.DataFrame.from_records(records)
    .sort_values("draw_date", ascending=False)
    .reset_index(drop=True)
)

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
# determine the highest ball number
max_ball = int(weights_df["ball_number"].max())

# prepare a zero-filled list for all possible balls (index 0 unused)
weight_list = [0.0] * (max_ball + 1)

# convert the pandas Series to native Python lists of ints and floats
ball_numbers  = weights_df["ball_number"].astype(int).tolist()
decay_weights = weights_df["decay_weight"].tolist()

# fill in our weight_list using the native types
for idx, w in zip(ball_numbers, decay_weights):
    weight_list[idx] = w

# compute the average (excluding index 0) and normalize
avg = np.mean(weight_list[1:])
weight_list = [
    0.0 if i == 0 else w / avg
    for i, w in enumerate(weight_list)
]

# ──────────── Output JSON ────────────
output = {
    "generated_at": datetime.utcnow().isoformat() + "Z",
    "decay_half_life": DECAY_HALF_LIFE,
    "weights": weight_list
}

out_path = f"{OUTPUT_DIR}/{GAME_SLUG}.json"
with open(out_path, "w") as f:
    json.dump(output, f, indent=2)

print(f"✔ Saved weights → {out_path}")
print(f"Sum of weights (excluding index 0): {sum(weight_list[1:]):.2f}")
