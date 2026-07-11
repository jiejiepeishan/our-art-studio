#!/usr/bin/env python3
"""Add best_for, mix_star, mix_tips, ace_history to palette colors (batch 1)."""
import json
from pathlib import Path

PATH = Path("/Users/a1234/our-art-studio/data/palette.json")

# mix_tips.with = palette color ids; verified=True when standard pigment theory / manufacturer docs
ENRICHMENTS = {
    "ds-moonglow": {
        "mix_star": True,
        "best_for": "Night skies, snow shadows, magical granulating washes, and moody backgrounds where one pigment does the choreography.",
        "ace_history": "Moonglow is a modern Daniel Smith hero — a deliberate three-pigment dance (anthraquinoid red, ultramarine, viridian) built for granulation on the paper, not for copying a single historic tube.",
        "mix_tips": [
            {"with": ["ds-burnt-sienna"], "result": "Warm-violet storm clouds with earthy granulation — classic moody sky recipe.", "verified": True},
            {"with": ["wn-511"], "result": "Deep blue-violet galaxies; ultramarine pushes the shadow side cooler.", "verified": True},
            {"with": ["ds-undersea-green"], "result": "Kelpy twilight water — green and violet separate beautifully wet-on-wet.", "verified": True},
        ],
    },
    "ds-burnt-sienna": {
        "mix_star": True,
        "best_for": "Tree bark, warm skin undertones, earthy shadows, and granulating mid-tones in plein-air sketches.",
        "ace_history": "Burnt sienna is calcined natural iron oxide — a portrait and landscape staple since the 18th century, when earth pigments anchored the warm side of every palette.",
        "mix_tips": [
            {"with": ["wn-511"], "result": "Granulating greys and soft storm skies — the textbook earth + ultramarine neutral.", "verified": True},
            {"with": ["sch-tube-phthalo-green"], "result": "Deep olive-greens for foliage shadows without going muddy black.", "verified": True},
            {"with": ["sch-tube-may-green"], "result": "Sunlit leaves and mossy mid-tones — warm earth anchors bright greens.", "verified": True},
        ],
    },
    "ds-undersea-green": {
        "mix_star": True,
        "best_for": "Underwater greens, kelp forests, cool shadow foliage, and teal-leaning atmospheric passages.",
        "ace_history": "Undersea Green pairs ultramarine with quinacridone gold — a contemporary DS blend aimed at marine and botanical depth rather than a single historical pigment name.",
        "mix_tips": [
            {"with": ["ds-moonglow"], "result": "Bioluminescent dusk water — violet and teal granulate in layers.", "verified": True},
            {"with": ["sch-952-deep-sea-indigo"], "result": "Abyssal blue-green; both granulate for textured deep water.", "verified": True},
            {"with": ["ds-183-lunar-blue"], "result": "Cool moonlit surf with floating blue halos.", "verified": False},
        ],
    },
    "ds-183-lunar-blue": {
        "mix_star": True,
        "best_for": "Moonlit water, nocturnal skies, and granulating blue washes that bloom without going flat.",
        "ace_history": "Lunar Blue is Daniel Smith's moody PB15 granulating blue — a modern specialty built for night scenes, not a classical Lapis replacement.",
        "mix_tips": [
            {"with": ["ds-moonglow"], "result": "Night sky with violet granulation — two DS granulators in conversation.", "verified": True},
            {"with": ["ds-burnt-sienna"], "result": "Weathered slate greys for rooftops and rocks.", "verified": True},
            {"with": ["wn-466"], "result": "Hazy moonlit mist over cool landscapes.", "verified": False},
        ],
    },
    "ds-139-green-gold": {
        "mix_star": True,
        "best_for": "Autumn foliage, sunlit grass, olive-gold glazes, and natural landscape greens without phthalo harshness.",
        "ace_history": "Green gold pigments echo medieval manuscript greens and modern PY129/PO49 blends — DS's version targets landscape painters who want warmth in foliage.",
        "mix_tips": [
            {"with": ["ds-burnt-sienna"], "result": "Autumn leaf browns and sun-bleached meadow tones.", "verified": True},
            {"with": ["sch-tube-phthalo-green"], "result": "Bright spring green with a golden sunlit top note.", "verified": True},
            {"with": ["sch-932-shire-olive"], "result": "Rolling hillside greens — pastoral and muted.", "verified": False},
        ],
    },
    "sch-hp-burnt-sienna": {
        "mix_star": True,
        "best_for": "Quick warm browns in half-pan sketching, skin undertones, and granulating earth shadows.",
        "ace_history": "Horadam burnt sienna (PBr7) sits in Schmincke's line as a transparent earth — the same family artists have used since Renaissance panel underpainting.",
        "mix_tips": [
            {"with": ["sch-hp-indigo"], "result": "Classic granulating grey-violet neutrals for stormy skies.", "verified": True},
            {"with": ["sch-tube-may-green"], "result": "Natural foliage — warm earth steadies bright yellow-green.", "verified": True},
            {"with": ["sch-tube-494-ultramarine"], "result": "Schmincke's textbook grey mix — earth + ultramarine.", "verified": True},
        ],
    },
    "sch-hp-indigo": {
        "mix_star": True,
        "best_for": "Night skies, denim blues, deep shadows, and granulating cool darks.",
        "ace_history": "Indigo in watercolor is traditionally a mixed or synthetic substitute for plant indigo — Schmincke's granulating version chases that stormy, textile-blue romance.",
        "mix_tips": [
            {"with": ["sch-hp-burnt-sienna"], "result": "Moody blue-grey clouds with visible granulation.", "verified": True},
            {"with": ["sch-916-urban-yellow"], "result": "Muted olive-greens for urban parks and distant trees.", "verified": False},
            {"with": ["wn-382"], "result": "Soft twilight mauves for florals and skies.", "verified": False},
        ],
    },
    "sch-tube-phthalo-green": {
        "mix_star": True,
        "best_for": "Mixing clean greens, deep foliage shadows, and turquoise-leaning accents — a staining powerhouse.",
        "ace_history": "Phthalocyanine green (PG7) arrived in the 20th century and revolutionized mixing — one tiny touch shifts any yellow into vivid natural green.",
        "mix_tips": [
            {"with": ["sch-931-shire-yellow"], "result": "Bright spring meadow greens — clean and legible.", "verified": True},
            {"with": ["ds-burnt-sienna"], "result": "Deep forest shadow greens without black.", "verified": True},
            {"with": ["sch-tube-lemon-yellow"], "result": "Chartreuse and acid spring leaves — use sparingly.", "verified": True},
        ],
    },
    "sch-tube-may-green": {
        "mix_star": True,
        "best_for": "Spring leaves, mixed greens straight from the tube, and cheerful landscape passages.",
        "ace_history": "May green is a classic convenience mixture (often yellow + phthalo) named for spring foliage — a staple on European plein-air palettes.",
        "mix_tips": [
            {"with": ["sch-hp-burnt-sienna"], "result": "Natural tree-canopy greens with warm trunks nearby.", "verified": True},
            {"with": ["sch-932-shire-olive"], "result": "Pastoral olive-greens for hills and hedgerows.", "verified": False},
            {"with": ["mb-potters-pink"], "result": "Soft greyed greens for distant tree lines.", "verified": False},
        ],
    },
    "sch-931-shire-yellow": {
        "mix_star": True,
        "best_for": "Sunlit fields, warm highlights, and mixing clean landscape greens.",
        "ace_history": "Shire Yellow is Schmincke's granulating PY53 specialty — part of their fantasy landscape series inspired by storybook countryside light.",
        "mix_tips": [
            {"with": ["sch-tube-phthalo-green"], "result": "Vivid spring greens with granulating texture.", "verified": True},
            {"with": ["sch-932-shire-olive"], "result": "Cohesive Hobbit-core landscape — same Shire family harmony.", "verified": True},
            {"with": ["sch-923-desert-brown"], "result": "Sun-baked grasslands and dusty path edges.", "verified": False},
        ],
    },
    "sch-932-shire-olive": {
        "mix_star": True,
        "best_for": "Rolling hills, olive drab foliage, quiet landscapes, and muted natural greens.",
        "ace_history": "Shire Olive Green pairs yellow and phthalo in an earthy, narrative granulating mix — Schmincke's answer to 'film still' countryside greens.",
        "mix_tips": [
            {"with": ["sch-931-shire-yellow"], "result": "Sunlit vs shadow foliage in one scene — same Shire story.", "verified": True},
            {"with": ["sch-923-desert-brown"], "result": "Dry Mediterranean scrub and path-side weeds.", "verified": False},
            {"with": ["ds-burnt-sienna"], "result": "Deep woodland understory and tree bases.", "verified": True},
        ],
    },
    "sch-916-urban-yellow": {
        "mix_star": True,
        "best_for": "City sunset glow, warm granulating highlights, and mixing muted urban greens.",
        "ace_history": "Urban Yellow is a modern Schmincke granulating specialty — less about a historic pigment name than about contemporary warm light on concrete and glass.",
        "mix_tips": [
            {"with": ["sch-hp-indigo"], "result": "Smoggy blue-greens and city-park distant trees.", "verified": False},
            {"with": ["sch-tube-phthalo-green"], "result": "Traffic-light spring greens along boulevards.", "verified": True},
            {"with": ["wn-635"], "result": "Sunset haze over rooftops — warm granulation meets violet mist.", "verified": False},
        ],
    },
    "sch-952-deep-sea-indigo": {
        "mix_star": True,
        "best_for": "Deep ocean, night water, whale-shadow blues, and granulating marine darks.",
        "ace_history": "Schmincke's Deep Sea series (2020s) uses heavy granulating pigment blends to mimic abyssal light — indigo here is PB60/PG7 territory, not classical indigo dye.",
        "mix_tips": [
            {"with": ["sch-953-deep-sea-blue"], "result": "Layered abyss — indigo depth over blue body.", "verified": True},
            {"with": ["ds-undersea-green"], "result": "Kelpy cold water with shared marine mood.", "verified": True},
            {"with": ["wn-595"], "result": "Stormy granulating seascapes — two misty blues.", "verified": False},
        ],
    },
    "sch-953-deep-sea-blue": {
        "mix_star": True,
        "best_for": "Deep water bodies, cool shadows, and marine horizons — not sky cerulean.",
        "ace_history": "Deep Sea Blue is PB29-forward in Schmincke's granulating marine line — built for depth rather than the airy cerulean skies of Turner.",
        "mix_tips": [
            {"with": ["sch-952-deep-sea-indigo"], "result": "Trench-dark water with indigo settling below.", "verified": True},
            {"with": ["sch-963-glacier-green"], "result": "Cold polar shallows meeting deep blue.", "verified": False},
            {"with": ["ds-burnt-sienna"], "result": "Weathered dock wood and rocky shoreline greys.", "verified": True},
        ],
    },
    "sch-tube-952-deep-sea-indigo": {
        "mix_star": True,
        "best_for": "5ml tube deep water — same abyss mood as the pan, bolder washes.",
        "ace_history": "The Deep Sea line extends Schmincke's granulating specialty range into tube format for large marine works.",
        "mix_tips": [
            {"with": ["sch-tube-953-deep-sea-blue"], "result": "Full marine depth in one painting session.", "verified": True},
            {"with": ["ds-moonglow"], "result": "Bioluminescent fantasy seas.", "verified": False},
            {"with": ["sch-tube-494-ultramarine"], "result": "Cool granulating neutrals for rocky coast shadows.", "verified": True},
        ],
    },
    "mb-potters-pink": {
        "mix_star": True,
        "best_for": "Soft skin blush, dusty skies, faded florals, and gentle greys when mixed.",
        "ace_history": "Potter's Pink (PR233) is named for ceramics glazing — a muted, lightfast rose that became a portrait painter's secret for softening everything it touches.",
        "mix_tips": [
            {"with": ["wn-511"], "result": "Classic muted sky grey with a blush warmth — Turner-adjacent skies.", "verified": True},
            {"with": ["mb-rose-lake"], "result": "Layered florals — soft base under brighter rose.", "verified": True},
            {"with": ["sch-tube-may-green"], "result": "Greyed distant foliage — recession in landscapes.", "verified": True},
        ],
    },
    "mb-rose-lake": {
        "mix_star": True,
        "best_for": "Florals, lips, warm pinks, and layering over Potter's Pink for depth.",
        "ace_history": "Rose lake pigments descend from madder lakes — synthetic PV19 quin rose is the modern workhorse replacing fugitive natural lakes in professional lines.",
        "mix_tips": [
            {"with": ["mb-potters-pink"], "result": "Portrait cheeks and petal gradients without chalky opacity.", "verified": True},
            {"with": ["wn-511"], "result": "Lilac-grey clouds at sunset.", "verified": True},
            {"with": ["ds-moonglow"], "result": "Romantic granulating florals and twilight backgrounds.", "verified": False},
        ],
    },
    "wn-511": {
        "mix_star": True,
        "best_for": "Skies, shadows, mixing greys, and the cool backbone of nearly every landscape.",
        "ace_history": "Ultramarine (PB29) was once literally worth more than gold — ground lapis from Afghanistan — until synthetic chemistry made it every watercolorist's first blue.",
        "mix_tips": [
            {"with": ["ds-burnt-sienna"], "result": "The universal granulating grey — skies, stones, neutrals.", "verified": True},
            {"with": ["mb-potters-pink"], "result": "Turner-style soft skies with rose warmth.", "verified": True},
            {"with": ["wn-745"], "result": "Natural spring greens — blue shifts yellow-green cooler and deeper.", "verified": True},
        ],
    },
    "wn-382": {
        "mix_star": True,
        "best_for": "Romantic florals, soft backgrounds, granulating pink fog, and gentle skin tones.",
        "ace_history": "White Nights' granulating mist colors come from St. Petersburg's Nevskaya Palitra — a Soviet-era factory tradition now famous for sedimentary specialty blends.",
        "mix_tips": [
            {"with": ["wn-511"], "result": "Lilac storm clouds with granulating separation.", "verified": True},
            {"with": ["wn-635"], "result": "Sunset florals — pink mist meets violet hour.", "verified": False},
            {"with": ["wn-466"], "result": "Mountain mist at dawn — soft atmospheric perspective.", "verified": True},
        ],
    },
    "wn-635": {
        "mix_star": True,
        "best_for": "Sunset skies, purple hour cityscapes, granulating florals, and moody backgrounds.",
        "ace_history": "Sunset Mist blends ultramarine with pyrrol orange — a 2020s White Nights granulating color designed for one-pigment sunset drama on cold-press paper.",
        "mix_tips": [
            {"with": ["wn-382"], "result": "Full sunset bouquet — warm violet and rose mist together.", "verified": False},
            {"with": ["sch-916-urban-yellow"], "result": "City golden hour with violet clouds.", "verified": False},
            {"with": ["wn-511"], "result": "Push the blue shadow side of a sunset wash.", "verified": True},
        ],
    },
    "wn-398-purple-mist": {
        "mix_star": True,
        "best_for": "Florals, abstract backgrounds, urban sketch shadows, and granulating burgundy-grey fills.",
        "ace_history": "Purple Mist pairs cobalt titanate green with quin violet — White Nights lets the green granulate out while pink quin rides the water, a very Russian specialty effect.",
        "mix_tips": [
            {"with": ["wn-382"], "result": "Layered misty florals — burgundy depth under rose.", "verified": False},
            {"with": ["wn-511"], "result": "Cool purple-grey storm clouds.", "verified": True},
            {"with": ["wn-389-scarlet-mist"], "result": "Warm-cool floral contrast in one bouquet.", "verified": False},
        ],
    },
    "wn-389-scarlet-mist": {
        "mix_star": True,
        "best_for": "Bold florals, granulating red washes, and warm accent passages that bloom on wet paper.",
        "ace_history": "Scarlet Mist is part of White Nights' granulating mist line — built for wet-on-wet florals where pigment separation does the rendering.",
        "mix_tips": [
            {"with": ["wn-398-purple-mist"], "result": "Bouquet depth — scarlet sparks on burgundy mist.", "verified": False},
            {"with": ["mb-potters-pink"], "result": "Soften scarlet into portrait-friendly blush.", "verified": True},
            {"with": ["ds-burnt-sienna"], "result": "Warm granulating earth behind bright florals.", "verified": True},
        ],
    },
    "wn-776-mint-dream": {
        "mix_star": False,
        "best_for": "Soft pastel greens, sea-glass accents, minty florals, and cool calm backgrounds.",
        "ace_history": "Mint Dream sits in White Nights' pastel-leaning granulating range — a contemporary convenience shade for illustrators and botanical artists who want cool freshness.",
        "mix_tips": [
            {"with": ["wn-511"], "result": "Cool sea-glass turquoise when pushed with ultramarine.", "verified": False},
            {"with": ["wn-382"], "result": "Spring garden freshness — mint against rose mist.", "verified": False},
        ],
    },
    "sen-211-burnt-sienna": {
        "mix_star": True,
        "best_for": "Warm earth lines, Sennelier's soft honey-bloom washes, and tertiary landscape mixes.",
        "ace_history": "Sennelier formulates with honey — burnt sienna here carries the same PBr7 earth lineage French painters used beside raw umber on the banks of the Seine.",
        "mix_tips": [
            {"with": ["sen-315-ultramarine-deep"], "result": "Rich French greys with honey-soft bloom.", "verified": True},
            {"with": ["sch-tube-may-green"], "result": "Provence olive trees and sun-baked walls.", "verified": False},
            {"with": ["ds-moonglow"], "result": "Warm granulating contrast in shadow passages.", "verified": False},
        ],
    },
    "sch-tube-494-ultramarine": {
        "mix_star": True,
        "best_for": "Tube ultramarine for large washes, mixing greys, and cool shadow bases.",
        "ace_history": "Synthetic ultramarine (1828) ended the lapis trade monopoly — Horadam's version is among the reference blues European ateliers test everything else against.",
        "mix_tips": [
            {"with": ["sch-hp-burnt-sienna"], "result": "Schmincke's bread-and-butter storm grey.", "verified": True},
            {"with": ["sch-tube-519-phthalo-green"], "result": "Deep transparent forest greens.", "verified": True},
            {"with": ["sch-tube-343-quin-red-light"], "result": "Bright violets for florals without mud.", "verified": True},
        ],
    },
    "sch-tube-519-phthalo-green": {
        "mix_star": True,
        "best_for": "Tube phthalo for bold mixing — same staining power as the half-pan line.",
        "ace_history": "Phthalo green in tube form is the mixing engine of the modern palette — a few millimeters shift entire landscapes.",
        "mix_tips": [
            {"with": ["sch-931-shire-yellow"], "result": "Granulating vs staining green study — texture contrast.", "verified": True},
            {"with": ["sch-tube-494-ultramarine"], "result": "Deep blue-green teal for water and shadow.", "verified": True},
            {"with": ["ds-burnt-sienna"], "result": "Olive shadow mix for trunks and eaves.", "verified": True},
        ],
    },
    "mg-190-ultramarine-blue": {
        "mix_star": True,
        "best_for": "Honey-bloom ultramarine skies, soft-edged washes, and classic grey mixes.",
        "ace_history": "M. Graham revives honey as a binder — ultramarine in honey rewets softly and blooms on cold press the way 19th-century recipes described.",
        "mix_tips": [
            {"with": ["mg-030-burnt-umber"], "result": "Warm honey-rich neutrals — Graham's signature earth+blue.", "verified": True},
            {"with": ["ds-burnt-sienna"], "result": "Compare DS vs MG granulation in the same grey mix.", "verified": True},
            {"with": ["mg-125-olive-green"], "result": "Natural landscape greens with soft edges.", "verified": False},
        ],
    },
    "wn-tube-green-gold": {
        "mix_star": True,
        "best_for": "W&N landscape greens, autumn gold accents, and warm natural mixing.",
        "ace_history": "Green gold in professional lines echoes Turner-era yellow-green lakes — W&N's version targets the British landscape tradition.",
        "mix_tips": [
            {"with": ["wn-tube-quin-red"], "result": "Muted autumn ochres and burnt orange foliage.", "verified": True},
            {"with": ["wn-511"], "result": "Cool distant hills over warm foreground grass.", "verified": True},
            {"with": ["ds-burnt-sienna"], "result": "Harvest field tones and straw.", "verified": True},
        ],
    },
    "wn-tube-quin-red": {
        "mix_star": True,
        "best_for": "Florals, bold reds, mixing bright violets and oranges — a staining primary red.",
        "ace_history": "Quinacridone pigments (1950s) gave watercolor permanent, transparent reds — W&N Professional Quin Red is heir to the British floral school.",
        "mix_tips": [
            {"with": ["wn-511"], "result": "Permanent violet for florals — clean quin + ultramarine.", "verified": True},
            {"with": ["wn-tube-green-gold"], "result": "Autumn leaf oranges and burnt siennas.", "verified": True},
            {"with": ["mb-potters-pink"], "result": "Soften to portrait rose without losing lightfastness.", "verified": True},
        ],
    },
    "ds-164-hematite-violet": {
        "mix_star": False,
        "best_for": "Moody granulating violets, geological texture, and dramatic shadow accents.",
        "ace_history": "Hematite is iron oxide — Daniel Smith's PrimaTek line grinds real mineral pigments for granulation patterns no synthetic can fake.",
        "mix_tips": [
            {"with": ["ds-burnt-sienna"], "result": "Iron-rich earth shadows — mineral meets mineral.", "verified": True},
            {"with": ["ds-moonglow"], "result": "Double granulation galaxy skies.", "verified": False},
        ],
    },
    "sch-972-starry-purple": {
        "mix_star": False,
        "best_for": "Galaxy washes, constellation textures, and granulating night-sky accents.",
        "ace_history": "Schmincke's Galaxy/Starry series uses heavy pigment sediment — Starry Purple chases the look of cosmic dust on wet paper.",
        "mix_tips": [
            {"with": ["sch-974-starry-brown"], "result": "Warm-cool star fields — brown settles, purple floats.", "verified": True},
            {"with": ["ds-183-lunar-blue"], "result": "Deep space granulation study.", "verified": False},
        ],
    },
    "sch-963-glacier-green": {
        "mix_star": False,
        "best_for": "Icy shallows, winter sea foam, and pale granulating cool greens.",
        "ace_history": "Glacier Green in Schmincke's line evokes polar meltwater — PG7 with white sediment for icy separation.",
        "mix_tips": [
            {"with": ["sch-953-deep-sea-blue"], "result": "Arctic water — pale green ice over deep blue.", "verified": False},
            {"with": ["wn-776-mint-dream"], "result": "Cool pastel polar mist.", "verified": False},
        ],
    },
    "rs-334": {
        "mix_star": False,
        "best_for": "Polish landscape greens, muted natural tones, and regional palette character.",
        "ace_history": "Roman Szmal and Polish pigment traditions reflect Central European landscape painting — regional lines preserve colors local artists actually squeeze.",
        "mix_tips": [],
    },
}


def main():
    palette = json.loads(PATH.read_text(encoding="utf-8"))
    ids = {c["id"] for c in palette["colors"]}
    applied = 0
    skipped = []
    for c in palette["colors"]:
        data = ENRICHMENTS.get(c["id"])
        if not data:
            continue
        for tip in data.get("mix_tips", []):
            for pid in tip.get("with", []):
                if pid not in ids:
                    raise ValueError(f"Unknown mix partner {pid} for {c['id']}")
        c["mix_star"] = data.get("mix_star", False)
        if data.get("best_for"):
            c["best_for"] = data["best_for"]
        if data.get("ace_history"):
            c["ace_history"] = data["ace_history"]
        if data.get("mix_tips"):
            c["mix_tips"] = data["mix_tips"]
        applied += 1
    for eid in ENRICHMENTS:
        if eid not in ids:
            skipped.append(eid)
    palette["updated"] = "2026-07-07-stories-v1"
    PATH.write_text(json.dumps(palette, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Enriched {applied} colors")
    if skipped:
        print("Skipped missing ids:", skipped)


if __name__ == "__main__":
    main()