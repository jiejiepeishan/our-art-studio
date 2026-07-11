#!/usr/bin/env python3
"""Assign toxicity level + studio habit from pigment codes (conservative blend = highest)."""
import json
import re
from pathlib import Path

PATH = Path("/Users/a1234/our-art-studio/data/palette.json")

LEVEL_RANK = {"low": 0, "medium": 1, "high": 2}

# Pigment index → level (watercolor handling, not medical advice)
PIGMENT_LEVEL = {
    # High — cadmium
    "PY35": "high",
    "PO20": "high",
    "PR108": "high",
    # Medium — cobalt, nickel, manganese, legacy chromium
    "PB28": "medium",
    "PB36": "medium",
    "PG26": "medium",
    "PG50": "medium",
    "PY40": "medium",
    "PY34": "medium",
    "PY150": "medium",
    "PY53": "medium",
    "PV16": "medium",
}

HABITS = {
    "high": "Cadmium pigment — wash hands thoroughly, don't spray without ventilation, and keep tubes away from food prep areas.",
    "medium_cobalt": "Cobalt pigment — wash hands after painting; keep food and drink away from the palette.",
    "medium_nickel": "Nickel-containing pigment — wash hands after sessions; no eating at the desk.",
    "medium_manganese": "Manganese pigment — wash hands well after painting.",
    "medium_chromium": "Chromium pigment — wash hands after use; avoid inhaling dry pigment dust.",
    "medium": "Wash hands after painting — keep food and drink away from the palette.",
}

COBALT = {"PB28", "PB36", "PG26", "PG50", "PY40"}
NICKEL = {"PY150", "PY53"}
MANGANESE = {"PV16"}
CHROMIUM = {"PY34"}

def parse_pigments(pigment: str) -> list[str]:
    if not pigment or not pigment.strip():
        return []
    tokens = []
    for part in re.split(r"[/,]", pigment):
        part = part.strip().upper()
        if part:
            tokens.append(part.split(":")[0] if ":" in part else part)
            # keep PB15:3 as full token too
            if ":" in part:
                tokens.append(part.upper())
    # dedupe preserving order
    seen = set()
    out = []
    for t in tokens:
        if t not in seen:
            seen.add(t)
            out.append(t)
    return out


def level_for_tokens(tokens: list[str]) -> str:
    best = "low"
    for t in tokens:
        # try exact match first (PB15:3), then base (PB15)
        lv = PIGMENT_LEVEL.get(t)
        if not lv and ":" in t:
            lv = PIGMENT_LEVEL.get(t.split(":")[0])
        if not lv:
            lv = PIGMENT_LEVEL.get(t)
        if lv and LEVEL_RANK[lv] > LEVEL_RANK[best]:
            best = lv
    return best


def habit_for(level, tokens):
    if level == "low":
        return None
    if level == "high":
        return HABITS["high"]
    if tokens and any(t in COBALT or t.split(":")[0] in COBALT for t in tokens):
        return HABITS["medium_cobalt"]
    if tokens and any(t in NICKEL for t in tokens):
        return HABITS["medium_nickel"]
    if tokens and any(t in MANGANESE for t in tokens):
        return HABITS["medium_manganese"]
    if tokens and any(t in CHROMIUM for t in tokens):
        return HABITS["medium_chromium"]
    return HABITS["medium"]


def main():
    palette = json.loads(PATH.read_text(encoding="utf-8"))
    counts = {"low": 0, "medium": 0, "high": 0}
    no_pigment = []
    for c in palette["colors"]:
        tokens = parse_pigments(c.get("pigment") or "")
        if not tokens:
            no_pigment.append(c["id"])
            level, habit = "low", None
        else:
            level = level_for_tokens(tokens)
            habit = habit_for(level, tokens)
        c["toxicity"] = level
        if habit:
            c["toxicity_habit"] = habit
        elif "toxicity_habit" in c:
            del c["toxicity_habit"]
        counts[level] += 1
    if no_pigment:
        print("No pigment (defaulted low):", no_pigment)
    palette["updated"] = "2026-07-07-toxicity-v2"
    PATH.write_text(json.dumps(palette, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Toxicity counts:", counts)


if __name__ == "__main__":
    main()