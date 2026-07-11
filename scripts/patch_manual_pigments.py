#!/usr/bin/env python3
"""Apply user-supplied pigment codes for previously blank entries."""
import json
from pathlib import Path

PATH = Path("/Users/a1234/our-art-studio/data/palette.json")

PATCHES = {
    "ds-15ml-christmas-tree-green": {"pigment": "PBr7/PB15"},
    "ds-15ml-candy-cane-red": {"pigment": "PV19"},
    "ds-15ml-hot-mulled-cider-yellow": {"pigment": "PY150"},
    "mb-naples-yellow": {"pigment": "PY53"},
    "wn-tube-winsor-orange-rs": {
        "pigment": "PO73",
        "transparency": 2,
        "staining": True,
    },
    "wn-tube-quin-red": {
        "pigment": "PR209",
        "transparency": 1,
        "staining": False,
    },
    "wn-tube-green-gold": {
        "pigment": "PY129",
        "transparency": 1,
        "staining": False,
    },
    "wn-tube-phthalo-turquoise": {
        "pigment": "PB16",
        "transparency": 1,
        "staining": True,
    },
    "wn-tube-winsor-green-bs": {
        "pigment": "PG7",
        "transparency": 1,
        "staining": True,
    },
    "wn-tube-winsor-blue-gs": {
        "pigment": "PB15:3",
        "transparency": 1,
        "staining": True,
    },
    "wn-tube-winsor-blue-rs": {
        "pigment": "PB15:1",
        "transparency": 1,
        "staining": True,
    },
}


def main():
    palette = json.loads(PATH.read_text(encoding="utf-8"))
    by_id = {c["id"]: c for c in palette["colors"]}
    for cid, fields in PATCHES.items():
        if cid not in by_id:
            raise ValueError(f"Missing color id: {cid}")
        by_id[cid].update(fields)
    palette["updated"] = "2026-07-07-pigments-manual"
    PATH.write_text(json.dumps(palette, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Patched {len(PATCHES)} colors")


if __name__ == "__main__":
    main()