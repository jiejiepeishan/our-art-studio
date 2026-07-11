#!/usr/bin/env python3
"""Correct Sennelier red family from tube label photo (Jul 7 batch)."""
import json
from pathlib import Path

PATH = Path("/Users/a1234/our-art-studio/data/palette.json")


def main():
    palette = json.loads(PATH.read_text(encoding="utf-8"))
    colors = palette["colors"]
    by_id = {c["id"]: c for c in colors}

    # 612 Laque Ecarlate — serie 2, PR188 semi-opaque
    c612 = by_id["sen-612-scarlet-lacquer"]
    c612["notes"] = "Serie 2. Jul 7 batch — tube label: Laque Ecarlate."
    c612["transparency"] = 2
    c612["staining"] = True

    # 623 Rouge Venise — NOT vermilion; Venetian Red PR101, serie 1
    c623 = by_id["sen-623-vermilion-red"]
    c623["id"] = "sen-623-venetian-red"
    c623["name_en"] = "Venetian Red"
    c623["name_zh"] = "威尼斯红"
    c623["pigment"] = "PR101"
    c623["hex"] = "#A84B3A"
    c623["family"] = "red"
    c623["notes"] = "Serie 1. Jul 7 batch — tube label: Rouge Venise."
    c623["transparency"] = 2
    c623["staining"] = False
    c623["ace_note"] = "Rouge Venise — earthy Venetian red, terracotta roofs and warm brick, not vermilion heat."
    c623["ace_history"] = (
        "Venetian red is calcined iron oxide (PR101) — the brick-and-stucco red "
        "Venetian façades are named for, quite different from scarlet lacquer or bright helios red."
    )

    # 619 Rouge Hélios — replaces mis-entered 519 Cadmium Red
    c519 = by_id["sen-519-cadmium-red"]
    c519["id"] = "sen-619-bright-red"
    c519["code"] = "619"
    c519["name_en"] = "Bright Red"
    c519["name_zh"] = "亮红"
    c519["pigment"] = "PR3"
    c519["hex"] = "#E63946"
    c519["notes"] = "Serie 2. Jul 7 batch — tube label: Rouge Hélios."
    c519["transparency"] = 2
    c519["staining"] = True
    c519["ace_note"] = "Rouge Hélios — semi-opaque bright red with honey bloom, punchy florals and accents."
    c519["ace_history"] = (
        "Rouge Hélios (PR3 toluidine red) is Sennelier's serie 2 bright red — "
        "a modern organic scarlet, not cadmium; honey binder keeps washes lively on cold press."
    )
    if "toxicity_habit" in c519:
        del c519["toxicity_habit"]
    c519["toxicity"] = "low"

    palette["updated"] = "2026-07-07-sennelier-reds-fix"
    PATH.write_text(json.dumps(palette, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Patched Sennelier 612, 623 Venetian Red, 619 Bright Red")


if __name__ == "__main__":
    main()