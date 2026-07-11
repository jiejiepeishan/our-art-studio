#!/usr/bin/env python3
"""Follow-up Schmincke fixes from user clarifications (Jul 8 2026)."""
import json
from pathlib import Path

PATH = Path("/Users/a1234/our-art-studio/data/palette.json")

HALF_PAN_6_CATALOG = {
    "sch-hp-365-vermilion": "365 Zinnoberrot / vermilion (PR255)",
    "sch-hp-english-red": "649 Engl.-Venez. Rot / English Venetian red (PR101)",
    "sch-hp-yellow-ochre": "656 Lichter Ocker / yellow ochre",
    "sch-hp-665-raw-sienna": "665 Siena natur / raw sienna",
    "sch-hp-burnt-sienna": "663 Siena gebrannt / burnt sienna",
    "sch-hp-672-van-dyck-brown": "672 Van Dyck Braun / Van Dyck brown",
    "sch-hp-679-raw-umber": "679 Umbra natur / raw umber",
}

FORMAT_BOTH_952 = "pan, 5ml tube"
FORMAT_BOTH_963 = "pan, 5ml tube"


def main():
    palette = json.loads(PATH.read_text(encoding="utf-8"))
    by_id = {c["id"]: c for c in palette["colors"]}

    # Dunkelrot = 366 (Perylene Maroon)
    pm_hp = by_id["sch-hp-perylene-maroon"]
    pm_hp["code"] = "366"
    pm_hp["notes"] = (
        "Dunkelrot / Perylenmaroon. Color-check Jul 8 2026 — half-pan 5 photo. Catalog 366."
    )

    tube = by_id.pop("sch-tube-366-permanent-maroon")
    tube["id"] = "sch-tube-366-perylene-maroon"
    tube["name_en"] = "Perylene Maroon"
    tube["name_zh"] = "苝系栗红"
    tube["notes"] = "Dunkelrot. Color-check Jul 8 2026 — tube 8 photo. Catalog 366."
    tube["ace_note"] = (
        "Dunkelrot in the tube — deep transparent wine-red for glazing shadows."
    )
    by_id[tube["id"]] = tube

    # Half-pan 6 tin — catalogue codes (labels had no printed codes)
    for cid, catalog in HALF_PAN_6_CATALOG.items():
        if cid in by_id:
            by_id[cid]["notes"] = (
                f"{catalog}. Half-pan 6 tin — label only, code from catalog."
            )

    # 952 / 963 — list both studio formats after primary format
    by_id["sch-952-deep-sea-indigo"]["format"] = FORMAT_BOTH_952
    by_id["sch-tube-952-deep-sea-indigo"]["format"] = FORMAT_BOTH_952
    by_id["sch-963-glacier-green"]["format"] = FORMAT_BOTH_963
    by_id["sch-tube-963-glacier-green"]["format"] = FORMAT_BOTH_963

    for eid, label in (
        ("sch-952-deep-sea-indigo", "Deep Sea Indigo"),
        ("sch-tube-952-deep-sea-indigo", "Deep Sea Indigo"),
        ("sch-963-glacier-green", "Glacier Green"),
        ("sch-tube-963-glacier-green", "Glacier Green"),
    ):
        n = by_id[eid].get("notes", "")
        suffix = " Studio formats: pan, 5ml tube."
        if suffix.strip() not in n:
            by_id[eid]["notes"] = (n + suffix).strip()

    palette["colors"] = list(by_id.values())
    palette["updated"] = "2026-07-08-schmincke-followup"
    PATH.write_text(json.dumps(palette, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Patched: Dunkelrot→366, half-pan 6 catalog, 952/963 dual format")


if __name__ == "__main__":
    main()