#!/usr/bin/env python3
"""Add ace_history to palette colors missing it (batch 2)."""
import json
from pathlib import Path

PATH = Path("/Users/a1234/our-art-studio/data/palette.json")

# 1–2 sentences; pigment / history / famous use; skip ids with nothing useful (none here)
HISTORIES = {
    "sch-tube-cerulean-blue": "Cerulean blue (PB35) was synthesized in the 1860s as a safer stand-in for cobalt sky blues — Turner and the Impressionists chased this milky, non-staining hue for distant horizons.",
    "sch-tube-helio-turquoise": "Helio turquoise is Schmincke's phthalocyanine turquoise (PB16) — a 20th-century pigment that gave poster designers and watercolorists a clean tropical blue-green without grinding gemstones.",
    "sch-tube-cobalt-green-dark": "Cobalt green (PG26) dates to 19th-century mineral chemistry — muted and dignified, it was the landscape painter's quiet shadow green before phthalo took over the mixing bench.",
    "sch-tube-permanent-green-olive": "Olive convenience greens marry phthalo with earth — a modern tube answer to the drab greens soldiers and plein-air painters actually saw in the field, not in a color wheel.",
    "sch-tube-lemon-yellow": "Hansa lemon (PY3) is a clean, cool yellow from the azo family — the transparent primary that replaced harsh chrome yellows in 20th-century mixing charts.",
    "sch-tube-cadmium-yellow-light": "Cadmium yellow (PY35) arrived in the 1840s and shocked the Salon with opaque, buttery light — Monet, Matisse, and every sun-drenched still life owe debt to this heavy metal.",
    "sch-tube-chromium-yellow-deep": "Chromium yellow (PY34) is the Victorian warm yellow — less toxic than lead chrome, still opaque, still the color of gaslight and gilt frames in 19th-century watercolors.",
    "sch-tube-cadmium-orange": "Cadmium orange (PO20) sits between yellow and red on the periodic table and on the palette — a mid-century modern favorite for bold posters and ripe-fruit still lifes.",
    "sch-tube-cadmium-red-light": "Cadmium red light (PR108) is the warm opaque red of commercial illustration and classical florals — permanent where vermilion once faded and cracked.",
    "sch-tube-perylene-maroon": "Perylene maroon (PR179) is a modern transparent wine-red — built for glazing shadows in botanical art where old madder lakes would have gone fugitive.",
    "sch-tube-permanent-carmine": "Permanent carmine (PR176) carries the name of cochineal and kermes lakes into the synthetic era — cool, staining, and far more lightfast than the carmine tubes of the 18th century.",
    "sch-hp-permanent-green-olive": "The same olive mixture in a half-pan — Horadam's travel format preserves a color European sketchers have used since tube greens replaced grinding malachite.",
    "sch-hp-naples-yellow": "Naples yellow began as lead antimonate on Roman walls and Renaissance panels — today's PY216 blends chase that soft, chalky warmth without the poison.",
    "sch-hp-yellow-ochre": "Yellow ochre is among humanity's oldest paints — cave walls, Egyptian tombs, and every Renaissance underpainting leaned on this humble iron earth.",
    "sch-hp-english-red": "English Venetian red (PR101) is calcined iron oxide — the brick-and-terracotta tone British watercolourists used beside raw sienna on muddy Thames sketches.",
    "sch-hp-sepia": "Sepia ink came from cuttlefish sacs before chemists cloned it with iron and carbon — Victorian album sketches and Turner atmospherics ran on this warm brown.",
    "sch-hp-ivory-black": "Ivory black was literally charred bone until substitutes arrived — slightly warm PBk9 still echoes the Old Master tradition of never using pure lamp black in skies.",
    "sch-hp-permanent-carmine": "Half-pan carmine is the plein-air florist's shortcut — the same PR176 chemistry Sargent-era painters wished had existed when madder faded in sunlight.",
    "sch-hp-magenta": "Quinacridone magenta (PR122) is a cool primary born in the 20th century — color theory charts, process printing, and clean violets all start here.",
    "sch-hp-prussian-blue": "Prussian blue (PB27) was discovered by accident in Berlin in 1704 — the first modern synthetic pigment, beloved by Hokusai's waves and Romantic storm clouds.",
    "sch-box-brilliant-purple": "Brilliant purple (PR122) in Schmincke's box line targets designers who want a cool, high-chroma violet — a child of 20th-century organic chemistry, not Tyrian shellfish.",
    "sch-box-silver": "PW20 mica silver is a decorative watercolor tradition — Victorian scrapbooks and modern galaxy painters use it where pigment alone cannot fake metal light.",
    "sch-box-titanium-gold-ochre": "Metallic ochre blends marry earth pigments with mica — a contemporary specialty for sunlit architecture studies that want shimmer without gold leaf.",
    "sch-box-naples-yellow-reddish": "Warmer Naples variants lean toward skin and stucco — the same historic hue family that Pompeian fresco restorers still match with modern PY216 blends.",
    "sch-box-transparent-ochre": "Transparent ochre is built for glazing — Turner piled warm yellow-brown washes to fake sunlight; this tube does the same in fewer layers.",
    "sch-box-emerald-green": "Emerald green (PG18) echoes the toxic Victorian copper arsenite name — modern versions give safe, cool emerald passages for botanical illustrators.",
    "sch-box-scarlet-red": "PR254 pyrrol scarlet is a 21st-century red — cleaner and more permanent than the vermilion and cadmium scarlets on 19th-century porcelain palettes.",
    "sch-box-madder-brown": "Madder brown nods to Rubia tinctorum roots — when madder was fermented and heated it gave warm browns; modern blends keep the romance without the fugitive dye.",
    "sch-box-naples-yellow": "A backup Naples in the studio box — the same historic pale yellow Impressionist portraitists softened edges with, now in spare-pan form.",
    "sch-box-yellow-ochre": "Box ochre is stockpile insurance — a pigment family used continuously from Lascaux to contemporary landscape journals.",
    "sch-box-brilliant-opera-rose": "Opera rose pushes PR122 toward fluorescent florals — a modern staining pink for illustrators who want Matisse cut-out energy on paper.",
    "mb-dragons-blood": "Dragon's blood resin tinted medieval varnishes and manuscript borders — PBr25 today gives that legendary name as a granulating warm earth, not actual dragon.",
    "mb-golden-yellow": "PY183 benzimidazolone yellow is a modern transparent gold — Italian lines like MaimeriBlu favor it where cadmium opacity would choke a delicate wash.",
    "mb-quin-violet": "Quinacridone violet (PV19) replaced fugitive aniline violets — the cool floral purple that 20th-century botanical artists finally trusted in full sun.",
    "mb-naples-yellow": "Italian Naples is the portraitist's pale warmth — the same hue family Old Master workshops called giallo di Napoli for flesh and marble shadows.",
    "sch-482-delft": "Delft blue echoes Dutch tin-glazed pottery (PB30 cobalt) — a cultural color as much as a pigment, built for calm ceramic skies and canal reflections.",
    "sch-983-tundra-violet": "Tundra violet (PV16) sits in Schmincke's landscape fantasy range — muted cool purple for heather moors and botanical illustrators painting near the Arctic circle.",
    "sch-904-ice-blue": "Ice blue is a specialty PB15 wash — part of Schmincke's atmospheric series chasing polar light and winter fog without mixing five tubes.",
    "sch-924-desert-green": "Desert green mixes phthalo with earth — a contemporary convenience shade for sage scrub and sun-bleached Southwest plein air, not a historic single pigment.",
    "sch-923-desert-brown": "Desert brown is PBr7 earth tuned for arid landscapes — the same iron-oxide family that cave painters used, now aimed at dusty trails and adobe.",
    "sch-974-starry-brown": "Starry brown belongs to Schmincke's sedimentary Galaxy line — pigment particles settle like constellations, a modern effect inspired by wet-on-wet night-sky demos.",
    "sch-964-glacier-brown": "Glacier brown pairs earth with white sediment — Schmincke's polar palette suggests moraine stone and meltwater silt in one granulating pass.",
    "sch-15811-green-gold": "Green gold with mica riffs on medieval manuscript gold-green — Schmincke's metallic line lets you chase illuminated manuscript accents without leaf gilding.",
    "sch-15813-red-gold": "Red gold mica warms earth and metal together — a studio experiment color rooted in alchemy illustrations and modern metallic watercolor fashion.",
    "ds-027-light-cobalt-green": "Light cobalt green blends phthalo with cobalt — a Daniel Smith specialty for soft sea glass and sky greens without the bite of pure PG7.",
    "ds-091-rose-red": "Rose red (PR209) is a modern transparent red — part of the quin family that gave 20th-century florals permanent punch where alizarin once faded.",
    "ds-094-rose-violet": "Rose violet (PV19) bridges red and purple on the quinacridone tree — a cool floral hue that botanical painters adopted once madder violet proved unreliable.",
    "ds-101-ultramarine-rose": "Ultramarine rose mixes the king of blues with quin rose — a Daniel Smith blend for moody violet-grays that echo Pre-Raphaelite twilight skies.",
    "ds-117-herculaneum": "Named for the buried Roman city — Herculaneum earth is warm PBr7 volcanic tone, the kind of archaeological brown used in reconstruction sketches and classical studies.",
    "ds-128-prussian-green": "Prussian green marries PB27 with PG7 — a deep teal rooted in 18th-century chemistry, when Berlin blue met emerging copper greens in the same palette.",
    "ds-130-transparent-red-oxide": "Transparent red oxide is calcined iron with glazing in mind — the warmth of rust and autumn leaves without the opacity of traditional red ochre.",
    "ds-132-rose-peach": "Rose peach blends modern quin reds with violet — a portrait and botanical convenience shade for sunrise skin and soft petals, not a single historic mineral.",
    "ds-143-minnesota-pipestone": "Pipestone is sacred Catlinite from Minnesota quarries — Daniel Smith's PrimaTek line grinds real stone for earthy pink-brown granulation no synthetic can copy.",
    "ds-152-rose-deep-gold": "PY150 nickel azo gold is a transparent warm yellow — a 20th-century pigment Turner would have hoarded for sunset glazes and honey light.",
    "ds-162-tigers-eye": "Tiger's eye is banded quartz — PrimaTek grinds the actual mineral so iron-rich golden browns granulate like geological strata on cold press.",
    "ds-163-amazonite": "Amazonite feldspar gives milky blue-green granulation — a gemstone pigment for misty tropical rivers and mineral-collection still lifes.",
    "ds-167-rhodonite": "Rhodonite is manganese silicate — dusty rose mineral pink that PrimaTek turns into tender, geological florals unlike any quin on the market.",
    "ds-174-royal-purple": "Royal purple (PV23) echoes Tyrian dye mythology — synthetic dioxazine gives staining, regal violets that ancient Phoenician traders would have sold their sandals for.",
    "ds-181-rare-earth-green": "Rare earth green is a muted mineral blend — Daniel Smith's answer to naturalistic foliage when phthalo feels too electric for quiet landscapes.",
    "ds-187-transparent-orange": "Transparent orange (PO48) brings quinacridone heat without opacity — modern sunset painters glaze with it where cadmium would flatten the wash.",
    "ds-189-chromium-red-mica": "Chromium red mica layers iron oxide with sparkle — PrimaTek meets decorative tradition for gem-like accents in illustration and abstract work.",
    "ds-194-perylene-green": "Perylene green (PG36) is a dark, transparent green — a late-20th-century pigment for deep forest shade and botanical shadows that need to stay clean.",
    "ds-195-jadeite": "Jadeite genuine is ground jade — cool granulating green prized in Chinese carving traditions, now sedimenting on watercolor paper like landscape jade.",
    "ds-196-blue-apatite": "Blue apatite is a real phosphate mineral — PrimaTek's cloudy granulating blue for gemstone skies and geological illustration.",
    "ds-197-green-apatite": "Green apatite pairs mineral green with blue undertones — a PrimaTek specialty for cool botanical depth and mineralogical accuracy.",
    "ds-205-almandite": "Almandite garnet is iron aluminum silicate — deep jewel red-brown granulation from actual crushed garnet, not a laboratory formula.",
    "ds-217-carnelian": "Carnelian is banded chalcedony — the semiprecious orange-red that Roman signet rings were carved from, now staining boldly on paper.",
    "ds-237-rose-madder": "Rose madder permanent revives the madder name with modern quin chemistry — the cool pink of British floral watercolors, finally lightfast.",
    "ds-255-coral-reef": "Coral reef blends warm quin reds with orange — a contemporary tropical convenience color for reef sketches and travel journals, not a historic pigment name.",
    "ds-257-bright-yellow": "PY154 benzimidazolone yellow is a clean, transparent sunshine — a cadmium alternative born from 20th-century organic pigment research.",
    "wn-273": "Isoindoline yellow (PY139) is a bright, transparent modern yellow — White Nights uses it where artists want clean color without cadmium weight.",
    "wn-325": "Claret echoes Bordeaux wine stains — a mixed red-violet convenience shade from Nevskaya Palitra for velvet shadows and Eastern European still-life tradition.",
    "wn-408": "Burnt umber (PBr7) is raw umber roasted — the universal darkener Rembrandt and every landscape sketcher since has used for trees, hair, and quick shadows.",
    "wn-466": "Mountain mist is White Nights granulating atmosphere — Russian factory specialty for plein-air painters who want fog without mixing five neutrals.",
    "wn-467": "Black mystery granulates like coal smoke — part of Nevskaya Palitra's sedimentary range for urban night sketches and brooding backgrounds.",
    "wn-507": "Turquoise blue pairs phthalo blue with green — the clean tropical mix that replaced ground turquoise gemstone in commercial art by the mid-20th century.",
    "wn-531": "Cobalt turquoise (PB36) is a genuine cobalt compound — softer and milkier than phthalo, beloved for gem-tone skies in botanical miniatures.",
    "wn-555": "Dark blue shadows blend ultramarine with black — a convenience dark for twilight corners that echoes how 19th-century painters premixed storm-cloud neutrals.",
    "wn-559": "Aquamarine mist granulates pale blue over white — White Nights chases beryl gemstone light and hazy Baltic summer seas in one tube.",
    "wn-561": "Misty turquoise rose is a three-pigment granulating blend — very Russian, very wet-on-wet: let the paper sort pink, blue, and green.",
    "wn-570": "Blue dream is a straightforward PB15 phthalo wash — the workhorse cool blue that replaced Prussian blue in most 20th-century student palettes.",
    "wn-571": "Blue mystery pairs cobalt and ultramarine — granulating galaxy blues from St. Petersburg for night skies and abstract pours.",
    "wn-595": "Sea blue stacks phthalo, green, and black — White Nights' storm-sea specialty for granulating maritime sketches on cold press.",
    "wn-609": "Quinacridone lilac (PV19) is the cool floral violet — a permanent replacement for the aniline lilacs that faded on Victorian herbarium sheets.",
    "wn-632": "Hermit mist granulates warm brown over white — cozy atmospheric brown from the Russian mist line for cabin scenes and autumn fog.",
    "wn-745": "May green (PY3/PG7) is the European spring foliage mixture — named for May leaves, standard on French and Russian plein-air palettes since tube greens proliferated.",
    "wn-760": "Green shadows is a deep convenience mix — White Nights targets forest-floor darkness where pure phthalo would scream on the paper.",
    "wn-761": "Taiga mist granulates earth and blue — Siberian pine fog in pigment form, from the factory that supplied Soviet-era art schools.",
    "wn-3002": "Rose dream sediments pink like cotton-candy clouds — a granulating floral specialty for illustrators who want pigment separation to paint the petals.",
    "rosa-709": "Rosa Gallery's magenta rose (PV19) comes from Ukrainian pigment tradition — bold Eastern European florals with quin chemistry and regional character.",
    "rosa-740": "PR254 bright red is a modern pyrrol scarlet — Rosa's saturated red for poppies and folk-art boldness on the Dnieper school palette.",
    "rosa-747": "Black grape mixes carbon with iron red — a convenience neutral for wine stains, shadows, and the dark accents of Slavic still-life painting.",
    "rosa-748": "Naples rose blends pale yellow with iron pink — Rosa's warm peach for skin and stucco, cousin to the giallo di Napoli family.",
    "rosa-755": "Grass green is phthalo plus hansa — a straightforward meadow mixture for Ukrainian landscape painters who want spring without mixing tubes on site.",
    "rosa-761": "Golden brown is warm PBr7 earth — the operatic umber tone Central European painters use for architecture, costume, and autumn leaves.",
    "rosa-767": "Azure green pairs phthalo with phthalo blue — a teal gem tone for sky-meets-sea passages in Rosa's professional line.",
    "rosa-782": "Royal blue (PB15) is saturated phthalo blue — the rich 'Ukrainian blue' character Rosa is known for beside softer Western ultramarines.",
    "rosa-745": "Light Naples (PY40) is the pale creamy yellow of portrait workshops — same historic hue as Old Master flesh highlights, in a full pan.",
    "rs-346": "Aquarius green is Roman Szmal's muted olive — Polish landscape tradition favors quiet greens that match Central European fields, not Mediterranean lime.",
    "rs-359": "Potter's pink (PR233) in Roman Szmal's line is the same ceramics glaze pigment — compare with Maimeri to see how regional binders shift the blush.",
    "rs-415": "Morning mist granulates dawn fog — Roman Szmal sedimentary neutral for Polish plein-air painters who love soft, granulating atmosphere.",
    "mg-128-paynes-gray": "Payne's gray was named for British watercolorist William Payne (circa 1800) — blue-black convenience mix for shadows; M. Graham's honey keeps it juicy.",
    "mg-156-quin-rose": "Quinacridone rose in honey binder rewets like 19th-century recipes — the floral pink Graham & Co. aimed at when they revived honey watercolors in Oregon.",
    "mg-187-transparent-red": "Transparent red iron oxide glazes like autumn sunlight through leaves — PR101 with extended working time thanks to honey's slow drying.",
    "mg-189-turquoise": "PB16 phthalo turquoise in honey — bright tropical accent with the rewetting softness Graham markets against gum-only professional lines.",
    "mg-193-ultramarine-violet": "Ultramarine violet mixes PB29 with dioxazine — moody blue-purple for Pacific Northwest twilight, Graham's regional answer to stormy coastal skies.",
    "sen-326-phthalo-blue-green": "Sennelier's phthalo blue green shade (PB15:3) is a primary cool blue — French color theory and honey binder give it the soft bloom of Parisian plein air.",
    "sen-905-red-violet": "Red violet (PV19) is quin chemistry with velvet character — Sennelier's floral purple for still lifes beside the Seine, honey-soft at the edge.",
    "sen-315-ultramarine-deep": "Deep ultramarine is PB29 with extra punch — the night-sky blue French painters demanded when standard ultramarine felt too airy for Atlantic storms.",
    "sen-919-caput-mortuum": "Caput mortuum means 'dead head' in Latin — the morbid purple-brown Renaissance painters used for drapery shadows and memento mori still lifes.",
    "sen-612-scarlet-lacquer": "Scarlet lacquer (PR188) chases Chinese lacquerware red — Sennelier's bold warm scarlet for decorative painting and East-meets-West floral work.",
    "sen-623-venetian-red": "Venetian red is calcined iron oxide (PR101) — the brick-and-stucco red Venetian façades are named for, quite different from scarlet lacquer or bright helios red.",
    "sen-619-bright-red": "Rouge Hélios (PR3 toluidine red) is Sennelier's serie 2 bright red — a modern organic scarlet with honey binder, not cadmium.",
    "sen-707-emerald-green": "Emerald green (PG7) in Sennelier is straightforward phthalo — bottle-green foliage for painters trained on French primary mixing charts.",
    "sen-817-sennelier-green": "Sennelier Green is the house convenience blend — proprietary like every historic manufacturer's 'green No. 2' that local artists swore by.",
    "sen-645-chinese-orange": "Chinese orange gradients warm earth through gold to scarlet — Sennelier's specialty for sunset skies inspired by Asian lacquer and silk painting.",
    "sch-tube-216-pure-yellow": "Pure yellow (PY138) is Schmincke's modern transparent primary — a clean mixing yellow for Horadam lines without cadmium's opaque push.",
    "sch-tube-212-chromium-yellow-light": "Chromium yellow hue (PY74) mimics historic chrome warmth without equal toxicity — a bridge between Victorian palettes and contemporary studios.",
    "sch-tube-213-chromium-yellow-deep": "Deep chromium hue leans golden — the warm yellow of gaslit interiors and 19th-century landscape studies, reformulated for modern lightfastness.",
    "sch-tube-214-chromium-orange": "Chromium orange hue (PO62) replaces forbidden lead oranges — warm sunset accent with old-master temperature and new chemistry.",
    "sch-tube-361-permanent-red": "Permanent red (PR254) is modern pyrrol scarlet — the clean primary red Horadam uses where cadmium would overpower transparent mixing.",
    "sch-tube-366-permanent-maroon": "Permanent maroon (PR179) is perylene wine-red in tube form — glazing depth for botanical illustrators who study 18th-century wine-dark shadows.",
    "sch-tube-343-quin-red-light": "Quin red light (PV19) is a cool transparent primary — the floral red that replaced alizarin on professional European palettes in the late 20th century.",
    "sch-tube-653-transparent-sienna": "Transparent sienna is PBr7 earth tuned for glaze — the warmth of Italian raw sienna studies without chalky opacity.",
    "sch-tube-951-deep-sea-violet": "Deep Sea violet granulates violet over ultramarine — Schmincke's 2020s marine line for abyssal florals and moody wet-on-wet backgrounds.",
    "sch-tube-953-deep-sea-blue": "Deep Sea blue is PB29-forward granulating marine blue — tube format for large seascapes in Schmincke's contemporary specialty range.",
    "sch-tube-954-deep-sea-green": "Deep Sea green marries phthalo with ultramarine — kelp forests and deep water in one sedimentary Schmincke blend.",
    "sch-tube-955-deep-sea-black": "Deep Sea black stacks carbon with violet — granulating abyss dark for nautical night scenes, not classical lamp black.",
    "sch-tube-961-glacier-blue": "Glacier blue is pale PB15 with sediment — Schmincke's polar palette for ice caves and winter atmosphere.",
    "sch-tube-962-glacier-turquoise": "Glacier turquoise (PB16) is icy phthalo turquoise — cold polar shallows rather than tropical reef brightness.",
    "sch-tube-963-glacier-green": "Glacier green pairs PG7 with white sediment — polar meltwater green that granulates like ice floes on rough paper.",
    "sch-tube-964-glacier-brown": "Glacier brown is cool taupe earth with sediment — moraine stone and glacial till in Schmincke's Arctic fantasy range.",
    "sch-tube-965-glacier-black": "Glacier black is Schmincke's cool sedimentary dark — polar night and ink-like shadows with granulation, not flat carbon.",
    "mg-109-indian-yellow": "Indian yellow legend says it came from mango-fed cows — the transparent warm yellow of 18th-century Company School painting, now synthetic PY83 in honey.",
    "mg-019-cobalt-yellow": "Cobalt yellow (PY40) is a genuine inorganic yellow — softer than cadmium, prized in miniatures and M. Graham's honey-bloom sample line.",
    "mg-125-olive-green": "Olive green mixes phthalo with yellow — Graham's honey sample of the muted green Mediterranean painters used beside raw umber.",
    "mg-130-permanent-green-light": "Permanent green light is straight PG7 — the phthalo green that revolutionized 20th-century mixing, here in honey for soft rewetting.",
    "mg-030-burnt-umber": "Burnt umber in honey binder — the same PBr7 dark earth Velázquez and Rembrandt reached for, with Graham's slow-drying rewet character.",
    "ds-15ml-christmas-tree-green": "Daniel Smith's holiday green is a festive limited-run specialty — modern seasonal pigments for cards and ornaments, not a historic mineral name.",
    "ds-15ml-hot-mulled-cider-yellow": "Hot mulled cider yellow is a Daniel Smith holiday shade — warm spiced yellow for seasonal illustration, a studio fun tube rather than a classical pigment.",
    "ds-15ml-candy-cane-red": "Candy cane red is Daniel Smith's Christmas limited red — bold decorative scarlet for holiday work where permanence matters less than cheer.",
    "wn-tube-winsor-orange-rs": "Winsor orange (red shade) is W&N's primary orange — the British colourman's answer to clean secondary mixing on the professional line since the 1830s firm.",
    "wn-tube-winsor-green-bs": "Winsor green (blue shade) is phthalo green on the W&N chart — the cool green Turner never had, now standard in UK landscape education.",
    "wn-tube-phthalo-turquoise": "Phthalo turquoise is W&N's tropical accent — PB16 family blue-green that poster artists and marine painters adopted mid-century.",
    "wn-tube-winsor-blue-rs": "Winsor blue (red shade) is phthalo blue biased warm — W&N's primary for mixing clean violets beside British quin reds.",
    "wn-tube-winsor-blue-gs": "Winsor blue (green shade) is phthalo blue biased cool — the turquoise-leaning primary for clean greens on the professional W&N system.",
}


def main():
    palette = json.loads(PATH.read_text(encoding="utf-8"))
    ids = {c["id"] for c in palette["colors"]}
    applied = 0
    already = 0
    missing_ids = []
    for c in palette["colors"]:
        if c.get("ace_history"):
            already += 1
            continue
        hist = HISTORIES.get(c["id"])
        if not hist:
            missing_ids.append(c["id"])
            continue
        c["ace_history"] = hist
        applied += 1
    for eid in HISTORIES:
        if eid not in ids:
            raise ValueError(f"Unknown id in HISTORIES: {eid}")
    if missing_ids:
        raise ValueError(f"Colors still without history ({len(missing_ids)}): {missing_ids[:10]}...")
    palette["updated"] = "2026-07-07-stories-v2"
    PATH.write_text(json.dumps(palette, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Already had history: {already}")
    print(f"Added ace_history: {applied}")
    print(f"Total with history: {already + applied}")


if __name__ == "__main__":
    main()