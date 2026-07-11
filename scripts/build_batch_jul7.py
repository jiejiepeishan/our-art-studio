#!/usr/bin/env python3
"""Merge Jul 7, 2026 paint batch into palette.json."""
import json
from pathlib import Path

PATH = Path("/Users/a1234/our-art-studio/data/palette.json")


def entry(**kw):
    defaults = {
        "transparency": 2,
        "lightfastness": 1,
        "granulating": False,
        "staining": False,
        "pigment": "",
        "notes": "",
    }
    defaults.update(kw)
    return defaults


def main():
    palette = json.loads(PATH.read_text(encoding="utf-8"))
    existing_ids = {c["id"] for c in palette["colors"]}

    # Fix Burnt Sienna half-pan code per user
    for c in palette["colors"]:
        if c.get("id") == "sch-hp-burnt-sienna":
            c["code"] = "663"
            c["notes"] = (c.get("notes") or "") + " Code corrected to 663 (653 is Transparent Sienna tube).".strip()

    new_colors = []

    sennelier = [
        ("sen-326-phthalo-blue-green", "326", "Phthalo Blue Green (primary)", "酞菁蓝绿", "#007A8B", "blue", 1, "PB15:3"),
        ("sen-905-red-violet", "905", "Red Violet", "红紫", "#8B3A6B", "purple", 3, "PV19"),
        ("sen-315-ultramarine-deep", "315", "Ultramarine Deep", "深群青", "#1A3A6B", "blue", 2, "PB29"),
        ("sen-211-burnt-sienna", "211", "Burnt Sienna", "烧赭", "#8B4A2F", "earth", 1, "PBr7"),
        ("sen-919-caput-mortuum", "919", "Caput Mortuum", "死者之首", "#4A2A2A", "earth", 1, "PR101"),
        ("sen-612-scarlet-lacquer", "612", "Scarlet Lacquer", "猩红漆", "#C41E3A", "red", 1, "PR188"),
        ("sen-623-venetian-red", "623", "Venetian Red", "威尼斯红", "#A84B3A", "red", 1, "PR101"),
        ("sen-619-bright-red", "619", "Bright Red", "亮红", "#E63946", "red", 2, "PR3"),
        ("sen-707-emerald-green", "707", "Emerald Green", "翠绿", "#2A8B5A", "green", 1, "PG7"),
        ("sen-817-sennelier-green", "817", "Sennelier Green", "申内利尔绿", "#4A9A3A", "green", 1, "PG7/PY3"),
        ("sen-645-chinese-orange", "645", "Chinese Orange", "中国橙", "#E86A2A", "orange", 3, "PY150/PR209/PBr23"),
    ]
    for row in sennelier:
        new_colors.append(
            entry(
                id=row[0],
                brand="Sennelier",
                code=row[1],
                name_en=row[2],
                name_zh=row[3],
                hex=row[4],
                family=row[5],
                format="10ml tube",
                size="10ml",
                pigment=row[7],
                brand_traits=["professional", "sennelier"],
                notes=f"Serie {row[6]}. Jul 7 batch.",
                ace_note=_ace_sennelier(row[2]),
            )
        )

    sch_cadmium_free = [
        ("sch-tube-216-pure-yellow", "216", "Pure Yellow", "纯黄", "#F5E050", "yellow", "PY138"),
        ("sch-tube-212-chromium-yellow-light", "212", "Chromium Yellow Hue Light", "合成铬黄浅", "#F0E040", "yellow", "PY74"),
        ("sch-tube-213-chromium-yellow-deep", "213", "Chromium Yellow Hue Deep", "合成铬黄深", "#E8C020", "yellow", "PY74"),
        ("sch-tube-214-chromium-orange", "214", "Chromium Orange Hue", "合成铬橙", "#E88A30", "orange", "PO62"),
        ("sch-tube-361-permanent-red", "361", "Permanent Red", "永固红", "#C41E3A", "red", "PR254"),
        ("sch-tube-366-permanent-maroon", "366", "Permanent Maroon", "深栗红", "#6B1A2A", "red", "PR179"),
    ]
    for row in sch_cadmium_free:
        new_colors.append(
            entry(
                id=row[0],
                brand="Schmincke",
                code=row[1],
                name_en=row[2],
                name_zh=row[3],
                hex=row[4],
                family=row[5],
                format="5ml tube",
                size="5ml",
                pigment=row[6],
                brand_traits=["professional", "horadam", "cadmium-free"],
                notes="Cadmium-free Horadam set. Jul 7 batch.",
                ace_note=_ace_schmincke(row[2]),
            )
        )

    sch_extra = [
        ("sch-tube-343-quin-red-light", "343", "Quinacridone Red Light", "喹吖啶酮浅红", "#C43A5A", "red", "PV19", True),
        ("sch-tube-494-ultramarine", "494", "Ultramarine", "群青", "#1E3A8A", "blue", "PB29", False),
        ("sch-tube-519-phthalo-green", "519", "Phthalo Green", "酞菁绿", "#007A5E", "green", "PG7", True),
        ("sch-tube-653-transparent-sienna", "653", "Transparent Sienna", "透明赭石", "#9A6A4A", "earth", "PBr7", False, 1),
    ]
    for row in sch_extra:
        staining = row[7] if len(row) > 7 else False
        transparency = row[8] if len(row) > 8 else 2
        new_colors.append(
            entry(
                id=row[0],
                brand="Schmincke",
                code=row[1],
                name_en=row[2],
                name_zh=row[3],
                hex=row[4],
                family=row[5],
                format="5ml tube",
                size="5ml",
                pigment=row[6],
                staining=staining,
                transparency=transparency,
                brand_traits=["professional", "horadam"],
                notes="Jul 7 batch.",
                ace_note=_ace_schmincke(row[2]),
            )
        )

    deep_sea = [
        ("sch-tube-951-deep-sea-violet", "951", "Deep Sea Violet", "深海紫", "#3A2A5A", "purple", "PV16/PB29"),
        ("sch-tube-952-deep-sea-indigo", "952", "Deep Sea Indigo", "深海靛青", "#1E3D5C", "blue", "PB60/PG7"),
        ("sch-tube-953-deep-sea-blue", "953", "Deep Sea Blue", "深海蓝", "#1A4A6B", "blue", "PB29"),
        ("sch-tube-954-deep-sea-green", "954", "Deep Sea Green", "深海绿", "#1A5A4A", "green", "PG7/PB29"),
        ("sch-tube-955-deep-sea-black", "955", "Deep Sea Black", "深海黑", "#1A1A2A", "neutral", "PBk7/PV16"),
    ]
    for row in deep_sea:
        new_colors.append(
            entry(
                id=row[0],
                brand="Schmincke",
                code=row[1],
                name_en=row[2],
                name_zh=row[3],
                hex=row[4],
                family=row[5],
                format="5ml tube",
                size="5ml",
                pigment=row[6],
                granulating=True,
                brand_traits=["professional", "horadam"],
                notes="Deep Sea series 5ml tube. Jul 7 batch.",
                ace_note=_ace_schmincke(row[2]),
            )
        )

    glacier = [
        ("sch-tube-961-glacier-blue", "961", "Glacier Blue", "冰川蓝", "#7AB8D8", "blue", "PB15"),
        ("sch-tube-962-glacier-turquoise", "962", "Glacier Turquoise", "冰川绿松石", "#5AC8C8", "blue", "PB16"),
        ("sch-tube-963-glacier-green", "963", "Glacier Green", "冰川绿", "#8FB8B0", "green", "PG7/PW6"),
        ("sch-tube-964-glacier-brown", "964", "Glacier Brown", "冰川棕", "#A89888", "earth", "PBr7/PW6"),
        ("sch-tube-965-glacier-black", "965", "Glacier Black", "冰川黑", "#3A3A3A", "neutral", "PBk7"),
    ]
    for row in glacier:
        new_colors.append(
            entry(
                id=row[0],
                brand="Schmincke",
                code=row[1],
                name_en=row[2],
                name_zh=row[3],
                hex=row[4],
                family=row[5],
                format="5ml tube",
                size="5ml",
                pigment=row[6],
                granulating=True,
                brand_traits=["professional", "horadam"],
                notes="Glacier series 5ml tube. Jul 7 batch.",
                ace_note=_ace_schmincke(row[2]),
            )
        )

    mg = [
        ("mg-109-indian-yellow", "109", "Indian Yellow", "印度黄", "#E8A82A", "yellow", 3, "PY83"),
        ("mg-190-ultramarine-blue", "190", "Ultramarine Blue", "群青蓝", "#1E3A8A", "blue", 3, "PB29"),
        ("mg-019-cobalt-yellow", "019", "Cobalt Yellow", "钴黄", "#F0D050", "yellow", 2, "PY40"),
        ("mg-125-olive-green", "125", "Olive Green", "橄榄绿", "#5A6B3C", "green", 2, "PG7/PY3"),
        ("mg-130-permanent-green-light", "130", "Permanent Green Light", "永固亮绿", "#4A9A4A", "green", 2, "PG7"),
        ("mg-030-burnt-umber", "030", "Burnt Umber", "熟褐", "#5A3A2A", "earth", 2, "PBr7", 1),
    ]
    for row in mg:
        transparency = row[8] if len(row) > 8 else 2
        new_colors.append(
            entry(
                id=row[0],
                brand="M. Graham",
                code=row[1],
                name_en=row[2],
                name_zh=row[3],
                hex=row[4],
                family=row[5],
                format="2ml sample",
                size="2ml",
                pigment=row[7],
                transparency=transparency,
                brand_traits=["professional", "honey-based"],
                notes=f"Series {row[6]}. Moisturizing box sample. Jul 7 batch.",
                ace_note=_ace_mg(row[2]),
            )
        )

    wn_pans = [
        ("wn-776-mint-dream", "776", "Mint Dream", "薄荷之梦", "#A8E8D8", "green", "PW6/PG7"),
        ("wn-389-scarlet-mist", "389", "Scarlet Mist", "猩红薄雾", "#C45A6A", "red", "PR12/PB28"),
        ("wn-398-purple-mist", "398", "Purple Mist", "紫雾薄雾", "#6E4A58", "purple", "PG50/PV19"),
        ("wn-635-sunset-mist", "635", "Sunset Mist", "日落薄雾", "#8A6278", "purple", "PB29/PO73"),
    ]
    for row in wn_pans:
        new_colors.append(
            entry(
                id=row[0],
                brand="White Nights",
                code=row[1],
                name_en=row[2],
                name_zh=row[3],
                hex=row[4],
                family=row[5],
                format="full pan",
                granulating=True,
                pigment=row[6],
                brand_traits=["professional", "st-petersburg", "white-nights", "russian"],
                notes="Granulating color. 3K full pan. Jul 7 batch.",
                ace_note=_ace_wn(row[2]),
            )
        )

    ds_holiday = [
        ("ds-15ml-christmas-tree-green", "Christmas Tree Green", "圣诞树绿", "#1A6B3A", "green"),
        ("ds-15ml-hot-mulled-cider-yellow", "Hot Mulled Cider Yellow", "热苹果酒黄", "#E8B83A", "yellow"),
        ("ds-15ml-candy-cane-red", "Candy Cane Red", "糖果杖红", "#C41E3A", "red"),
    ]
    for i, row in enumerate(ds_holiday):
        new_colors.append(
            entry(
                id=row[0],
                brand="Daniel Smith",
                name_en=row[1],
                name_zh=row[2],
                hex=row[3],
                family=row[4],
                format="tube",
                size="15ml",
                brand_traits=["professional", "premium"],
                notes="Holiday / special colour 15ml tube. Jul 7 batch.",
                ace_note=_ace_ds_holiday(row[1]),
            )
        )

    wn_tubes = [
        ("wn-tube-winsor-orange-rs", "Winsor Orange (Red Shade)", "温莎橙(红调)", "#E86A2A", "orange", 1, False),
        ("wn-tube-winsor-green-bs", "Winsor Green (Blue Shade)", "温莎绿(蓝调)", "#007A5E", "green", 1, False),
        ("wn-tube-quin-red", "Quinacridone Red", "喹吖啶酮红", "#C41E3A", "red", 3, True),
        ("wn-tube-green-gold", "Green Gold", "金绿", "#8A9A3A", "green", 2, False),
        ("wn-tube-phthalo-turquoise", "Phthalo Turquoise", "酞菁绿松石", "#00A8A8", "blue", 2, False),
        ("wn-tube-winsor-blue-rs", "Winsor Blue (Red Shade)", "温莎蓝(红调)", "#1A4A8B", "blue", 1, False),
        ("wn-tube-winsor-blue-gs", "Winsor Blue (Green Shade)", "温莎蓝(绿调)", "#005A8B", "blue", 1, False),
    ]
    for row in wn_tubes:
        new_colors.append(
            entry(
                id=row[0],
                brand="Winsor & Newton",
                name_en=row[1],
                name_zh=row[2],
                hex=row[3],
                family=row[4],
                format="5ml tube",
                size="5ml",
                staining=row[6],
                brand_traits=["professional", "winsor-newton"],
                notes=f"Professional Water Colour series {row[5]}. Jul 7 batch.",
                ace_note=_ace_wn_pro(row[1]),
            )
        )

    added = 0
    for c in new_colors:
        if c["id"] in existing_ids:
            print(f"SKIP duplicate id: {c['id']}")
            continue
        palette["colors"].append(c)
        existing_ids.add(c["id"])
        added += 1

    palette["color_count"] = len(palette["colors"])
    palette["updated"] = "2026-07-07-v1"
    palette["source"] = "Our Art Studio — Jul 7 batch merged"

    PATH.write_text(json.dumps(palette, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} colors. Total: {palette['color_count']}")


def _ace_sennelier(name):
    notes = {
        "Phthalo Blue Green (primary)": "Sennelier's phthalo primary — tropical and clean, a French cousin to your Schmincke tubes.",
        "Red Violet": "Velvet violet-red — florals and wine shadows with Parisian flair.",
        "Ultramarine Deep": "Deeper than polite ultramarine — night skies with gravitas.",
        "Burnt Sienna": "Third burnt sienna in the family — compare all three on one swatch card.",
        "Caput Mortuum": "Mortuary purple-brown — Renaissance drama in a 10ml tube.",
        "Scarlet Lacquer": "猩红漆 — lacquer-bright scarlet, bold and glossy-minded.",
        "Vermilion Red": "Classic vermilion heat — icons, coral, old masters.",
        "Cadmium Red": "Sennelier cadmium — opaque and confident, not your Schmincke tube.",
        "Emerald Green": "Bottle emerald — lush, straightforward foliage green.",
        "Sennelier Green": "House green — proprietary blend, try it against May Green.",
        "Chinese Orange": "Gradient orange from deep burnt to bright gold — sunset in one pigment.",
    }
    return notes.get(name, f"Sennelier {name} — Jul 7 studio addition.")


def _ace_schmincke(name):
    return f"Schmincke {name} — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set."


def _ace_mg(name):
    return f"M. Graham {name} — honey base, 2ml sample. Blooms on wet paper if you lean in."


def _ace_wn(name):
    notes = {
        "Mint Dream": "Cool mint haze — granulating pastel green for soft foliage and sea-glass washes.",
        "Scarlet Mist": "Scarlet fog with granulating bite — bold florals that bloom on wet paper.",
        "Purple Mist": "Burgundy-grey with a wandering quin pink — cobalt green granules settle like grey-green trails in wet florals.",
        "Sunset Mist": "Muted purple with an orange-pink halo — wet washes look like purple hour skies splitting into blue and warm glow.",
    }
    return notes.get(name, f"White Nights {name} — full pan from St. Petersburg, Jul 7.")


def _ace_ds_holiday(name):
    return f"DS holiday {name} — festive 15ml, paint something ridiculous and beautiful."


def _ace_wn_pro(name):
    return f"W&N Professional {name} — classic British workhorse in 5ml."


if __name__ == "__main__":
    main()