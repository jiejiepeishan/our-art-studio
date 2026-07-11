#!/usr/bin/env python3
"""Reconcile Schmincke palette against Jul 8 2026 color-check photos.

Rules:
- Never modify 2ml sample entries
- Keep separate entries when same code exists as sample AND tube/pan
- Photo source: ~/Documents/Our Art Studio/color check/
"""
import json
import re
from copy import deepcopy
from pathlib import Path

PATH = Path("/Users/a1234/our-art-studio/data/palette.json")

# Old id → new id (half-pans mislabeled as tubes, box sleeves mislabeled)
RENAMES = {
    "sch-tube-cerulean-blue": "sch-hp-cerulean-blue",
    "sch-tube-helio-turquoise": "sch-hp-helio-turquoise",
    "sch-tube-phthalo-green": "sch-hp-phthalo-green",
    "sch-tube-may-green": "sch-hp-may-green",
    "sch-tube-lemon-yellow": "sch-hp-lemon-yellow",
    "sch-tube-cadmium-yellow-light": "sch-hp-cadmium-yellow-light",
    "sch-tube-chromium-yellow-deep": "sch-hp-213-chromium-yellow-deep",
    "sch-tube-cadmium-orange": "sch-hp-214-chromium-orange",
    "sch-tube-cadmium-red-light": "sch-hp-cadmium-red-light",
    "sch-tube-perylene-maroon": "sch-hp-perylene-maroon",
    "sch-tube-cobalt-green-dark": "sch-hp-cobalt-green-dark",
    "sch-box-scarlet-red": "sch-fp-363-scarlet-red",
    "sch-box-emerald-green": "sch-fp-513-emerald-green",
    "sch-box-naples-yellow-reddish": "sch-fp-320-naples-yellow-reddish",
    "sch-box-yellow-ochre": "sch-fp-656-yellow-raw-ochre",
    "sch-box-transparent-ochre": "sch-fp-657-transparent-ochre",
    "sch-box-brilliant-opera-rose": "sch-hp-941-brilliant-opera-rose",
    "sch-box-madder-brown": "sch-hp-647-madder-brown",
    "sch-box-titanium-gold-ochre": "sch-hp-648-titanium-gold-ochre",
    "sch-box-silver": "sch-hp-800-silver",
    "sch-box-brilliant-purple": "sch-hp-922-brilliant-purple",
}

# Remove duplicates — redirect references to canonical id
DELETE_REDIRECT = {
    "sch-tube-permanent-carmine": "sch-hp-permanent-carmine",
    "sch-tube-permanent-green-olive": "sch-hp-permanent-green-olive",
    "sch-box-naples-yellow": "sch-hp-naples-yellow",
}

HORADAM = ["professional", "horadam"]


def replace_ids(obj, mapping):
    """Recursively replace color id strings in mix_tips and similar."""
    if isinstance(obj, dict):
        return {k: replace_ids(v, mapping) for k, v in obj.items()}
    if isinstance(obj, list):
        out = []
        for item in obj:
            if isinstance(item, str) and item in mapping:
                out.append(mapping[item])
            else:
                out.append(replace_ids(item, mapping))
        return out
    if isinstance(obj, str) and obj in mapping:
        return mapping[obj]
    return obj


def base_entry(**kwargs):
    e = {
        "brand_traits": list(HORADAM),
        "transparency": 2,
        "lightfastness": 1,
        "granulating": False,
        "staining": False,
        "brand": "Schmincke",
        "toxicity": "low",
    }
    e.update(kwargs)
    return e


def main():
    palette = json.loads(PATH.read_text(encoding="utf-8"))
    colors = palette["colors"]
    by_id = {c["id"]: c for c in colors}

    full_mapping = dict(RENAMES)
    full_mapping.update(DELETE_REDIRECT)

    # --- Renames ---
    for old_id, new_id in RENAMES.items():
        if old_id not in by_id:
            print(f"WARN: rename source missing: {old_id}")
            continue
        entry = by_id[old_id]
        entry["id"] = new_id
        by_id[new_id] = entry
        del by_id[old_id]

    # --- Deletes ---
    for old_id, redirect in DELETE_REDIRECT.items():
        if old_id in by_id:
            del by_id[old_id]
            print(f"Removed duplicate: {old_id} → {redirect}")

    # Rebuild colors list preserving order where possible
    seen = set()
    new_colors = []
    for c in colors:
        cid = c["id"]
        if cid in DELETE_REDIRECT or cid in RENAMES:
            continue
        if cid in seen:
            continue
        seen.add(cid)
        new_colors.append(c)
    # Append renamed entries that were skipped
    for old_id, new_id in RENAMES.items():
        if new_id in by_id and new_id not in seen:
            new_colors.append(by_id[new_id])
            seen.add(new_id)
    colors = new_colors
    by_id = {c["id"]: c for c in colors}

    # --- Format fixes for renamed entries ---
    half_pan_ids = [
        "sch-hp-cerulean-blue",
        "sch-hp-helio-turquoise",
        "sch-hp-phthalo-green",
        "sch-hp-may-green",
        "sch-hp-lemon-yellow",
        "sch-hp-cadmium-yellow-light",
        "sch-hp-213-chromium-yellow-deep",
        "sch-hp-214-chromium-orange",
        "sch-hp-cadmium-red-light",
        "sch-hp-perylene-maroon",
        "sch-hp-cobalt-green-dark",
        "sch-hp-941-brilliant-opera-rose",
        "sch-hp-647-madder-brown",
        "sch-hp-648-titanium-gold-ochre",
        "sch-hp-800-silver",
        "sch-hp-922-brilliant-purple",
    ]
    for cid in half_pan_ids:
        if cid in by_id:
            by_id[cid]["format"] = "half-pan"
            by_id[cid]["notes"] = (
                by_id[cid].get("notes", "")
                + " Color-check Jul 8 2026 — half-pan photo."
            ).strip()

    full_pan_ids = [
        "sch-fp-363-scarlet-red",
        "sch-fp-513-emerald-green",
        "sch-fp-320-naples-yellow-reddish",
        "sch-fp-656-yellow-raw-ochre",
        "sch-fp-657-transparent-ochre",
    ]
    for cid in full_pan_ids:
        if cid in by_id:
            by_id[cid]["format"] = "full pan"
            by_id[cid]["notes"] = (
                by_id[cid].get("notes", "")
                + " Color-check Jul 8 2026 — full-pan sleeve photo."
            ).strip()

    # --- Code / name corrections ---
    if "sch-hp-213-chromium-yellow-deep" in by_id:
        c = by_id["sch-hp-213-chromium-yellow-deep"]
        c["code"] = "213"
        c["name_en"] = "Chromium Yellow Hue Deep"
        c["name_zh"] = "合成铬黄深"
        c["pigment"] = "PY74"
        c["hex"] = "#E8C020"
        traits = c.get("brand_traits", [])
        c["brand_traits"] = [t for t in traits if t != "cadmium"] + ["cadmium-free"]

    if "sch-hp-214-chromium-orange" in by_id:
        c = by_id["sch-hp-214-chromium-orange"]
        c["code"] = "214"
        c["name_en"] = "Chromium Orange Hue"
        c["name_zh"] = "合成铬橙"
        c["pigment"] = "PO62"
        c["hex"] = "#E88A30"
        c["family"] = "orange"
        traits = c.get("brand_traits", [])
        c["brand_traits"] = [t for t in traits if t != "cadmium"]
        if "toxicity_habit" in c:
            del c["toxicity_habit"]
        c["toxicity"] = "low"

    if "sch-hp-sepia" in by_id:
        by_id["sch-hp-sepia"]["code"] = "677"
        by_id["sch-hp-sepia"]["notes"] = "Sepiabraun. Color-check Jul 8 2026 — half-pan 3 photo (was 663)."

    if "sch-hp-magenta" in by_id:
        by_id["sch-hp-magenta"]["code"] = "921"
        by_id["sch-hp-magenta"]["notes"] = "Magenta. Color-check Jul 8 2026 — half-pan 5 photo."

    if "sch-tube-494-ultramarine" in by_id:
        by_id["sch-tube-494-ultramarine"]["name_en"] = "Ultramarine Finest"
        by_id["sch-tube-494-ultramarine"]["name_zh"] = "超细群青"
        by_id["sch-tube-494-ultramarine"]["notes"] = (
            "Ultramarin feinst. Color-check Jul 8 2026 — tube 4 photo."
        )

    if "sch-fp-656-yellow-raw-ochre" in by_id:
        by_id["sch-fp-656-yellow-raw-ochre"]["name_en"] = "Yellow Raw Ochre"
        by_id["sch-fp-656-yellow-raw-ochre"]["name_zh"] = "天然浅赭"

    # --- New entries ---
    new_entries = [
        base_entry(
            id="sch-fp-649-english-venetian-red",
            code="649",
            name_en="English Venetian Red",
            name_zh="英式威尼斯红",
            pigment="PR101",
            hex="#A84B3A",
            format="full pan",
            family="red",
            transparency=2,
            notes="Engl.-Venez. Rot. Color-check Jul 8 2026 — full pan photo.",
            ace_note="Full-pan Venetian red — earthy brick warmth in the large format you actually paint from.",
            ace_history="English Venetian red (PR101) is calcined iron oxide — the terracotta red of Venetian façades, distinct from scarlet heat.",
        ),
        base_entry(
            id="sch-fp-371-perylene-violet",
            code="371",
            name_en="Perylene Violet",
            name_zh="苝系紫",
            pigment="PV29",
            hex="#5A2A5A",
            format="full pan",
            family="purple",
            transparency=1,
            staining=True,
            notes="Perylenviolett PV29. Color-check Jul 8 2026 — full pan photo.",
            ace_note="Deep transparent violet — glaze shadows and moody florals without going muddy.",
            ace_history="Perylene violet (PV29) is a modern transparent purple built for glazing — botanical illustrators reach for it when dioxazine feels too electric.",
        ),
        base_entry(
            id="sch-hp-320-naples-yellow-reddish",
            code="320",
            name_en="Naples Yellow Reddish",
            name_zh="偏红那不勒斯黄",
            pigment="PY216",
            hex="#F0D4A8",
            format="half-pan",
            family="yellow",
            transparency=3,
            notes="Neapelgelb rötlich. Color-check Jul 8 2026 — half pan.jpg (plastic case).",
            ace_note="Warmer Naples in travel half-pan — skin tones and faded peach walls.",
            ace_history="Warmer Naples variants lean toward skin and stucco — Pompeian fresco restorers still match this hue family.",
        ),
        base_entry(
            id="sch-hp-354-madder-red-dark",
            code="354",
            name_en="Madder Red Dark",
            name_zh="深茜红",
            pigment="PR209",
            hex="#8B2A3A",
            format="half-pan",
            family="red",
            transparency=1,
            staining=True,
            notes="Krapprot tief. Color-check Jul 8 2026 — half pan.jpg.",
            ace_note="Deep madder rose — wine-stain florals and old-master shadows.",
            ace_history="Dark madder carries the Rubia root tradition into modern PR209 — the wine-red of Dutch still lifes, now lightfast.",
        ),
        base_entry(
            id="sch-hp-679-raw-umber",
            code="679",
            name_en="Raw Umber",
            name_zh="生赭褐",
            pigment="PBr7",
            hex="#6B5344",
            format="half-pan",
            family="earth",
            notes="Umbra natur. Color-check Jul 8 2026 — half pan.jpg + half pan 6 tin.",
            ace_note="Cool earth anchor — tree trunks, shadows, and mixing neutrals without going black.",
            ace_history="Raw umber (PBr7) is among the oldest palette earths — Roman sepia drawings and every landscape painter's shadow mixer.",
        ),
        base_entry(
            id="sch-hp-494-ultramarine-finest",
            code="494",
            name_en="Ultramarine Finest",
            name_zh="超细群青",
            pigment="PB29",
            hex="#1E3A8A",
            format="half-pan",
            family="blue",
            granulating=True,
            notes="Ultramarin feinst. Color-check Jul 8 2026 — half-pan 3 photo.",
            ace_note="Schmincke's finest-ground ultramarine in half-pan — granulating sky blue with dignity.",
            ace_history="Ultramarine finest is PB29 with extra milling — the same lapis tradition Impressionists bankrupted themselves for, in travel format.",
        ),
        base_entry(
            id="sch-hp-784-perylene-green",
            code="784",
            name_en="Perylene Green",
            name_zh="苝系绿",
            pigment="PBk31",
            hex="#1A4A3A",
            format="half-pan",
            family="green",
            transparency=1,
            staining=True,
            notes="Perylengrün. Color-check Jul 8 2026 — half-pan 4 photo.",
            ace_note="Transparent dark green — forest depths and botanical shadows.",
            ace_history="Perylene green is a modern transparent dark green — the shadow color botanical painters wanted when indigo felt too blue.",
        ),
        base_entry(
            id="sch-hp-588-neutral-tint",
            code="588",
            name_en="Neutral Tint",
            name_zh="中性灰",
            pigment="PBk6/PV19",
            hex="#4A4A4A",
            format="half-pan",
            family="neutral",
            transparency=1,
            staining=True,
            notes="Neutraltinte. Color-check Jul 8 2026 — half-pan 4 photo.",
            ace_note="Pre-mixed neutral — quick value shifts without muddy tri-color mixing.",
            ace_history="Neutral tint is the Victorian convenience grey — Payne's gray's German cousin for rapid value studies.",
        ),
        base_entry(
            id="sch-hp-350-geranium-red",
            code="350",
            name_en="Geranium Red",
            name_zh="天竺葵红",
            pigment="PR253",
            hex="#E03A4A",
            format="half-pan",
            family="red",
            staining=True,
            notes="Geranienrot. Color-check Jul 8 2026 — half-pan 4 photo.",
            ace_note="Bright geranium red — garden flowers and bold accents.",
            ace_history="Geranium red (PR253) is a modern pyrrole red — clean floral scarlet for illustrators who want permanent pop.",
        ),
        base_entry(
            id="sch-hp-336-french-ultramarine",
            code="336",
            name_en="French Ultramarine",
            name_zh="法式群青",
            pigment="PB29",
            hex="#2A4A9A",
            format="half-pan",
            family="blue",
            granulating=True,
            notes="Franz.Ultramarin. Color-check Jul 8 2026 — half-pan 4 photo.",
            ace_note="Classic granulating ultramarine — skies that bloom on cold press.",
            ace_history="French ultramarine is synthetic PB29 — the democratic replacement for lapis that changed 19th-century watercolor forever.",
        ),
        base_entry(
            id="sch-hp-210-quin-gold-hue",
            code="210",
            name_en="Quinacridone Gold Hue",
            name_zh="喹啉金色调",
            pigment="PO49",
            hex="#C9862A",
            format="half-pan",
            family="orange",
            transparency=1,
            notes="Chinacridongoldton. Color-check Jul 8 2026 — half-pan 4 photo.",
            ace_note="Warm quin gold — autumn leaves and honey light in one stroke.",
            ace_history="Quinacridone gold hue (PO49) brings the quin family into warm territory — Turner sunset glazes without cadmium.",
        ),
        base_entry(
            id="sch-hp-216-pure-yellow",
            code="216",
            name_en="Pure Yellow",
            name_zh="纯黄",
            pigment="PY138",
            hex="#F5E050",
            format="half-pan",
            family="yellow",
            brand_traits=HORADAM + ["cadmium-free"],
            notes="Reingelb. Color-check Jul 8 2026 — half-pan 4 photo.",
            ace_note="Clean transparent yellow half-pan — mixing primary without cadmium weight.",
            ace_history="Pure yellow (PY138) is Schmincke's modern transparent primary — cadmium-free mixing yellow.",
        ),
        base_entry(
            id="sch-hp-924-purple-magenta",
            code="924",
            name_en="Purple Magenta",
            name_zh="紫品红",
            pigment="PV19",
            hex="#9A2A7A",
            format="half-pan",
            family="purple",
            staining=True,
            notes="Purpur Magenta. Color-check Jul 8 2026 — half-pan 4 photo.",
            ace_note="Cool magenta-violet — florals and shadows when basic magenta feels too warm.",
            ace_history="Purple magenta bridges quin red and violet — a secondary mixing hub on modern European palettes.",
        ),
        base_entry(
            id="sch-hp-102-titanium-opaque-white",
            code="102",
            name_en="Titanium Opaque White",
            name_zh="钛白覆盖",
            pigment="PW6",
            hex="#F5F0E8",
            format="half-pan",
            family="neutral",
            transparency=4,
            notes="Titan-Deckweiß. Color-check Jul 8 2026 — half-pan 4 photo.",
            ace_note="Opaque body white — highlights, corrections, and gouache-style passages.",
            ace_history="Titanium opaque white (PW6) is the modern correction tool — highlights and body color where transparent watercolor needs rescue.",
        ),
        base_entry(
            id="sch-hp-374-perylene-dark-red",
            code="374",
            name_en="Perylene Dark Red",
            name_zh="苝系深红",
            pigment="PR179",
            hex="#6B1A2A",
            format="half-pan",
            family="red",
            transparency=1,
            staining=True,
            notes="Perylenrot tief. Color-check Jul 8 2026 — half-pan 4 photo.",
            ace_note="Deep perylene wine-red — glazing shadows richer than black.",
            ace_history="Perylene dark red (PR179) is built for botanical depth — transparent wine shadows that stay permanent.",
        ),
        base_entry(
            id="sch-hp-353-vermilion",
            code="353",
            name_en="Vermilion",
            name_zh="朱砂",
            pigment="PR255",
            hex="#E34234",
            format="half-pan",
            family="red",
            transparency=3,
            notes="Zinnoberrot. Color-check Jul 8 2026 — half-pan 6 tin (label only, code not visible).",
            ace_note="Classic warm vermilion half-pan — Chinese lacquer and coral warmth.",
            ace_history="Vermilion (PR255 pyrrole) carries the name of mercury cinnabar into modern lightfast chemistry.",
        ),
        base_entry(
            id="sch-hp-665-raw-sienna",
            code="665",
            name_en="Raw Sienna",
            name_zh="生赭黄",
            pigment="PBr7",
            hex="#B8956A",
            format="half-pan",
            family="earth",
            notes="Siena natur. Color-check Jul 8 2026 — half-pan 6 tin (label only).",
            ace_note="Warm raw sienna — sunlit earth and dusty paths.",
            ace_history="Raw sienna is PBr7 iron oxide — the plein-air painter's warm earth since Renaissance Italy.",
        ),
        base_entry(
            id="sch-hp-672-van-dyck-brown",
            code="672",
            name_en="Van Dyck Brown",
            name_zh="凡戴克棕",
            pigment="PBk7/PBr7",
            hex="#4A3528",
            format="half-pan",
            family="earth",
            notes="Van Dyck Braun. Color-check Jul 8 2026 — half-pan 6 tin (label only).",
            ace_note="Rich transparent brown — Old Master shadows and tree trunks.",
            ace_history="Van Dyck brown is named for the Flemish master — a transparent sepia-brown for 17th-century shadow passages.",
        ),
        # Galaxy 5ml tubes (tube 2 photo)
        base_entry(
            id="sch-tube-971-galaxy-rose",
            code="971",
            name_en="Galaxy Rose",
            name_zh="银河玫瑰",
            pigment="PR122/PBk6",
            hex="#6B3A4A",
            format="5ml tube",
            size="5ml",
            family="pink",
            granulating=True,
            notes="rose galaxie. Color-check Jul 8 2026 — tube 2 photo.",
            ace_note="Granulating galaxy rose — cosmic sediment on wet paper.",
            ace_history="Schmincke's Galaxy line (2020s) uses heavy granulating blends for star-field textures in wet washes.",
        ),
        base_entry(
            id="sch-tube-972-galaxy-violet",
            code="972",
            name_en="Galaxy Violet",
            name_zh="银河紫",
            pigment="PV16/PBk6",
            hex="#4A3A6B",
            format="5ml tube",
            size="5ml",
            family="purple",
            granulating=True,
            notes="violet galaxie. Color-check Jul 8 2026 — tube 2 photo.",
            ace_note="Galaxy violet granulation — nebula purples with sediment stars.",
            ace_history="Galaxy violet shares DNA with Schmincke's sediment specialties — violet that breaks into constellation freckles.",
        ),
        base_entry(
            id="sch-tube-973-galaxy-blue",
            code="973",
            name_en="Galaxy Blue",
            name_zh="银河蓝",
            pigment="PB29/PBk6",
            hex="#2A4A7A",
            format="5ml tube",
            size="5ml",
            family="blue",
            granulating=True,
            notes="bleu galaxie. Color-check Jul 8 2026 — tube 2 photo.",
            ace_note="Deep granulating blue — night sky and cosmic washes.",
            ace_history="Galaxy blue granulates PB29 with carbon — night-sky watercolor without flat pigment.",
        ),
        base_entry(
            id="sch-tube-974-galaxy-brown",
            code="974",
            name_en="Galaxy Brown",
            name_zh="银河棕",
            pigment="PBr7/PBk6",
            hex="#5A4A3A",
            format="5ml tube",
            size="5ml",
            family="earth",
            granulating=True,
            notes="brun galaxie. Color-check Jul 8 2026 — tube 2 photo.",
            ace_note="Granulating brown — cosmic earth tones with sediment texture.",
            ace_history="Galaxy brown stacks earth with carbon sediment — moorland and meteor-dust browns.",
        ),
        base_entry(
            id="sch-tube-975-galaxy-black",
            code="975",
            name_en="Galaxy Black",
            name_zh="银河黑",
            pigment="PBk7/PV16",
            hex="#2A2A3A",
            format="5ml tube",
            size="5ml",
            family="neutral",
            granulating=True,
            notes="noir galaxie. Color-check Jul 8 2026 — tube 2 photo.",
            ace_note="Galaxy black — granulating abyss dark, not flat carbon.",
            ace_history="Galaxy black layers violet with carbon for cool granulating darks — contemporary night-sky watercolor.",
        ),
    ]

    existing_ids = {c["id"] for c in colors}
    for entry in new_entries:
        if entry["id"] not in existing_ids:
            colors.append(entry)
            print(f"Added: {entry['id']}")
        else:
            print(f"SKIP (exists): {entry['id']}")

    palette["colors"] = colors
    palette = replace_ids(palette, full_mapping)
    palette["updated"] = "2026-07-08-schmincke-color-check"

    PATH.write_text(json.dumps(palette, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nPatched palette — {len(palette['colors'])} colors total")
    print("Renamed:", len(RENAMES))
    print("Removed duplicates:", len(DELETE_REDIRECT))
    print("New entries:", len(new_entries))


if __name__ == "__main__":
    main()