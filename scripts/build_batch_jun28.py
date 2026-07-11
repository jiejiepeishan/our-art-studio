#!/usr/bin/env python3
import json

path = "/Users/a1234/our-art-studio/data/palette.json"

with open(path, encoding="utf-8") as f:
    palette = json.load(f)


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


new_colors = []

new_colors += [
    entry(id="mb-quin-violet", brand="MaimeriBlu", name_en="Quinacridone Violet", name_zh="紫色",
          code="466", hex="#6B3FA0", family="purple", format="half-pan",
          brand_traits=["professional", "maimeri"], pigment="PV19", transparency=1, staining=True,
          notes="Jun 28 batch. Grade 2 half-pan.",
          ace_note="Italian violet with manners — cleaner than screaming quin purple, loves a wet-on-wet sky at dusk."),
    entry(id="mb-naples-yellow", brand="MaimeriBlu", name_en="Naples Yellow", name_zh="那坡里黄",
          code="104", hex="#F5E6C8", family="yellow", format="half-pan",
          brand_traits=["professional", "maimeri"], transparency=3,
          notes="Clearance sample pan. Jun 28 batch.",
          ace_note="Soft warm white-yellow — skin, walls, afternoon light. A gentle corrector, not a mixing primary."),
]

sch_entries = [
    ("sch-482-delft", "Delft Blue", "代夫特蓝", "482", "#3A6B9A", "blue", "half-pan", "Dutch canal blue — calm, slightly muted, built for ceramic skies.", "PB30"),
    ("sch-916-urban-yellow", "Urban Yellow", "都市黄", "916", "#D4A82A", "yellow", "half-pan", "Modern Schmincke yellow with city energy — warm and contemporary.", "PY154", {"granulating": True}),
    ("sch-983-tundra-violet", "Tundra Violet", "苔原紫", "983", "#6B5B7A", "purple", "pan", "Arctic violet — muted, botanical, like heather on cold ground.", "PV16"),
    ("sch-952-deep-sea-indigo", "Deep Sea Indigo", "深海靛青", "952", "#1E3D5C", "blue", "pan", "Deep diving blue-green — night water and whale shadows.", "PB60/PG7", {"granulating": True}),
    ("sch-963-glacier-green", "Glacier Green", "冰川绿", "963", "#8FB8B0", "green", "pan", "Pale icy green — glaciers, sea foam in winter.", "PG7/PW6", {"granulating": True}),
    ("sch-904-ice-blue", "Ice Blue", "冰蓝", "904", "#A8D4E8", "blue", "2ml sample", "Mist limited ice — ethereal winter light.", "PB15", {"transparency": 1, "notes": "Mist limited. 2ml sample."}),
    ("sch-924-desert-green", "Desert Green", "荒漠绿", "924", "#6B7A4A", "green", "2ml sample", "Dry sage desert green — southwestern dust.", "PG7/PBr7", {"notes": "2ml sample."}),
    ("sch-931-shire-yellow", "Shire Yellow", "夏尔黄", "931", "#E8C84A", "yellow", "2ml sample", "Shire sunshine — warm pastoral yellow, Hobbit-core meadows.", "PY53", {"granulating": True, "notes": "2ml sample. Granulating."}),
    ("sch-923-desert-brown", "Desert Brown", "沙漠棕", "923", "#9A7A5A", "earth", "2ml sample", "Sandy desert brown — sun-baked earth.", "PBr7", {"notes": "2ml sample."}),
    ("sch-932-shire-olive", "Shire Olive Green", "夏尔橄榄绿", "932", "#5A6B3C", "green", "2ml sample", "Olive drab with a story — rolling hills and quiet landscapes.", "PG7/PY3", {"granulating": True, "notes": "2ml sample. Granulating."}),
    ("sch-974-starry-brown", "Starry Brown", "星空棕", "974", "#5A4A3A", "earth", "2ml sample", "Brown with cosmic depth — sediment stars in the wash.", "PBr7/PBk6", {"granulating": True, "notes": "Sediment specialty. 2ml sample."}),
    ("sch-972-starry-purple", "Starry Purple", "星空紫", "972", "#4A3A6B", "purple", "2ml sample", "Galaxy purple — granulating sediment, constellation freckles.", "PV16/PBk6", {"granulating": True, "notes": "2ml sample."}),
    ("sch-953-deep-sea-blue", "Deep Sea Blue", "深海蓝", "953", "#1A4A6B", "blue", "2ml sample", "Abyss blue — deep water, not sky blue.", "PB29", {"granulating": True, "notes": "2ml sample. Granulating."}),
    ("sch-964-glacier-brown", "Glacier Brown", "冰川棕", "964", "#A89888", "earth", "2ml sample", "Cool taupe brown — glacial moraine stone.", "PBr7/PW6", {"granulating": True, "notes": "2ml sample. Granulating."}),
    ("sch-15811-green-gold", "Green Gold", "青金", "15811", "#8A9A4A", "specialty", "metallic powder 2ml",
     "Metallic alchemist — mix into ultramarine and chase that vintage lapis lazuli glow.",
     "PW20/PY3", {"transparency": 3, "brand_traits": ["professional", "horadam", "specialty", "metallic"],
                   "notes": "Metallic powder. Mix into ultramarine for vintage lapis lazuli effect."}),
    ("sch-15813-red-gold", "Red Gold", "红金", "15813", "#9A6A3A", "specialty", "metallic powder 2ml",
     "Warm metallic whisper — lapis experiment partner to Green Gold, but sunset gold flecks.",
     "PW20/PR101", {"transparency": 3, "brand_traits": ["professional", "horadam", "specialty", "metallic"],
                    "notes": "Metallic powder. Mix into ultramarine for vintage lapis lazuli effect."}),
]
for row in sch_entries:
    extra = row[9] if len(row) > 9 else {}
    new_colors.append(entry(
        id=row[0], brand="Schmincke", name_en=row[1], name_zh=row[2], code=row[3],
        hex=row[4], family=row[5], format=row[6], ace_note=row[7], pigment=row[8],
        brand_traits=extra.pop("brand_traits", ["professional", "horadam"]),
        **extra,
    ))

ds_rows = [
    ("ds-027-light-cobalt-green", "Light Cobalt Green", "淡钴绿", "027", "#6BA88A", "green", "PG7/PB36", False, False),
    ("ds-091-rose-red", "Rose Red", "玫瑰红", "091", "#C41E50", "red", "PR209", True, False),
    ("ds-094-rose-violet", "Rose Violet", "玫瑰紫", "094", "#8B4A8B", "purple", "PV19", True, False),
    ("ds-101-ultramarine-rose", "Ultramarine Rose", "群青玫瑰", "101", "#7A5A8B", "purple", "PB29/PV19", False, False),
    ("ds-117-herculaneum", "Herculaneum Earth", "赫库兰尼姆土色", "117", "#9A6A4A", "earth", "PBr7", False, False),
    ("ds-128-prussian-green", "Prussian Green", "普鲁士绿", "128", "#1A5A4A", "green", "PG7/PB27", False, False),
    ("ds-130-transparent-red-oxide", "Transparent Red Oxide", "透明氧化红", "130", "#8B4A3A", "earth", "PR101", False, False),
    ("ds-132-rose-peach", "Rose Peach", "玫瑰桃红", "132", "#E88A9A", "pink", "PR209/PV19", False, False),
    ("ds-139-green-gold", "Green Gold", "金绿", "139", "#8A9A3A", "green", "PY150/PG7", False, False),
    ("ds-143-minnesota-pipestone", "Minnesota Pipestone", "纯明尼苏达州矿土", "143", "#B87A6A", "earth", "PR101", False, True),
    ("ds-152-rose-deep-gold", "Rose Deep Gold", "玫瑰深金", "152", "#C9A227", "yellow", "PY150", False, False),
    ("ds-162-tigers-eye", "Tiger's Eye Brown", "纯虎睛石深棕", "162", "#6B4A2A", "earth", "PBr7", False, True),
    ("ds-163-amazonite", "Amazonite", "纯天河绿", "163", "#4A9A8A", "green", "PG7/PW6", True, True),
    ("ds-164-hematite-violet", "Hematite Violet", "纯鳞铁锰矿紫", "164", "#5A4A6B", "purple", "PBk11/PV19", True, True),
    ("ds-167-rhodonite", "Rhodonite", "纯玫瑰石红", "167", "#B86A7A", "pink", "PR101", False, True),
    ("ds-174-royal-purple", "Royal Purple", "皇家紫", "174", "#5A3A7A", "purple", "PV23", True, False),
    ("ds-181-rare-earth-green", "Rare Earth Green", "稀有土绿", "181", "#5A7A5A", "green", "PG7/PBr7", False, False),
    ("ds-183-lunar-blue", "Lunar Blue", "月色蓝", "183", "#4A6A8B", "blue", "PB15/PB29", True, False),
    ("ds-187-transparent-orange", "Transparent Orange", "透明橙色", "187", "#E87A3A", "orange", "PO48", False, False),
    ("ds-189-chromium-red-mica", "Chromium Red Mica", "纯铬红云母", "189", "#9A4A4A", "red", "PR101/PW20", False, True),
    ("ds-194-perylene-green", "Perylene Green", "苝绿", "194", "#1A4A3A", "green", "PG36", False, False),
    ("ds-195-jadeite", "Jadeite Genuine", "纯翡翠", "195", "#4A8A7A", "green", "PG7/PW6", True, True),
    ("ds-196-blue-apatite", "Blue Apatite", "纯鳞灰石蓝", "196", "#4A7A9A", "blue", "PB15/PG7", True, True),
    ("ds-197-green-apatite", "Green Apatite", "纯鳞灰石绿", "197", "#4A8A6A", "green", "PG7/PB15", True, True),
    ("ds-205-almandite", "Almandite Garnet", "纯石榴石深红", "205", "#6B2A2A", "red", "PR101", False, True),
    ("ds-217-carnelian", "Carnelian", "玛瑙红", "217", "#B84A3A", "red", "PR188", False, False),
    ("ds-237-rose-madder", "Rose Madder Permanent", "玫瑰茜草", "237", "#C45A6A", "pink", "PR209/PV19", True, False),
    ("ds-255-coral-reef", "Coral Reef", "珊瑚礁", "255", "#E87A6A", "coral", "PR209/PO48", False, False),
    ("ds-257-bright-yellow", "Bright Yellow No.2", "亮黄色 NO.2", "257", "#F5D020", "yellow", "PY154", False, False),
]
ds_ace = {
    "ds-027-light-cobalt-green": "Soft cobalt green — skies and sea glass without phthalo aggression.",
    "ds-091-rose-red": "Staining rose-red — bold florals, one brushload goes far.",
    "ds-094-rose-violet": "Cool violet rose — purple when red feels too warm.",
    "ds-101-ultramarine-rose": "Ultramarine met a rose — moody violet-grays for poetic shadows.",
    "ds-117-herculaneum": "Volcanic earth — warm, archaeological, buried-city vibes.",
    "ds-128-prussian-green": "Deep teal-green — dark foliage and ink-like greens.",
    "ds-130-transparent-red-oxide": "Transparent warm oxide — glazes like autumn light.",
    "ds-132-rose-peach": "Peachy rose — delicate skin, petals, sunrise.",
    "ds-139-green-gold": "Green gold — instant natural olives and sunlit leaves.",
    "ds-143-minnesota-pipestone": "PrimaTek pipestone — earthy pink-brown, sacred stone on paper.",
    "ds-152-rose-deep-gold": "Warm golden rose — sunsets and honey light.",
    "ds-162-tigers-eye": "PrimaTek tiger's eye — golden brown granulation, treasure in 2ml.",
    "ds-163-amazonite": "PrimaTek amazonite — milky green-blue granulation, gemstone skies.",
    "ds-164-hematite-violet": "PrimaTek hematite violet — moody granulating purple-gray drama.",
    "ds-167-rhodonite": "PrimaTek rhodonite — dusty rose mineral, tender and geological.",
    "ds-174-royal-purple": "Regal staining purple — wears a crown in florals.",
    "ds-181-rare-earth-green": "Muted mineral green — subtle, not screaming phthalo.",
    "ds-183-lunar-blue": "Lunar blue — floats, granulates, night sky in a sample pan.",
    "ds-187-transparent-orange": "Transparent orange heat — sunsets without opacity.",
    "ds-189-chromium-red-mica": "PrimaTek mica red — shimmer meets earth.",
    "ds-194-perylene-green": "Dark perylene green — deep transparent foliage shadows.",
    "ds-195-jadeite": "PrimaTek jadeite — cool jade granulation, landscape poetry.",
    "ds-196-blue-apatite": "PrimaTek blue apatite — granulating cloudy gemstone skies.",
    "ds-197-green-apatite": "PrimaTek green apatite — mineral green forests with geology.",
    "ds-205-almandite": "PrimaTek garnet — deep jewel-tone passages.",
    "ds-217-carnelian": "Warm carnelian — semiprecious boldness.",
    "ds-237-rose-madder": "Permanent rose madder — classic cool pink.",
    "ds-255-coral-reef": "Living coral — tropical warmth on paper.",
    "ds-257-bright-yellow": "Bright yellow no.2 — clean sunshine without cadmium.",
}
ds_granulating = {
    "ds-162-tigers-eye", "ds-163-amazonite", "ds-164-hematite-violet",
    "ds-183-lunar-blue", "ds-195-jadeite", "ds-196-blue-apatite", "ds-197-green-apatite",
}
for row in ds_rows:
    primatek = row[8]
    traits = ["professional", "premium", "2ml-sample"]
    if primatek:
        traits.append("primatek")
    new_colors.append(entry(
        id=row[0], brand="Daniel Smith", name_en=row[1], name_zh=row[2], code=row[3],
        hex=row[4], family=row[5], format="2ml sample", size="2ml",
        pigment=row[6], staining=row[7], granulating=row[0] in ds_granulating,
        brand_traits=traits,
        notes="PrimaTek mineral color. 2ml sample." if primatek else "2ml sample. Jun 28 batch.",
        ace_note=ds_ace[row[0]],
    ))

wn_rows = [
    ("wn-273", "Isoindoline Yellow", "异吲哚黄", "273", "#E8B020", "yellow", "PY139", False),
    ("wn-325", "Claret", "波尔多酒红", "325", "#6B2A3A", "red", "PR83/PR170", False),
    ("wn-382", "Rose Mist", "薄雾玫瑰", "382", "#B88A9A", "pink", "PV19/PW6", True),
    ("wn-408", "Burnt Umber", "熟褐", "408", "#5A3A2A", "earth", "PBr7", False),
    ("wn-466", "Mountain Mist", "山岚星云", "466", "#8A9AA8", "neutral", "PBk6/PW6", True),
    ("wn-467", "Black Mystery", "神秘黑", "467", "#2A2A2A", "neutral", "PBk6", True),
    ("wn-507", "Turquoise Blue", "绿松石蓝", "507", "#3AB8A8", "blue-green", "PB15:3/PG7", False),
    ("wn-511", "Ultramarine Blue", "群青蓝", "511", "#2A4A8B", "blue", "PB29", False),
    ("wn-531", "Cobalt Turquoise", "钴绿松石", "531", "#4AB8B8", "blue-green", "PB36", False),
    ("wn-555", "Dark Blue Shadows", "阴影深蓝", "555", "#2A3A5A", "blue", "PB29/PBk6", True),
    ("wn-559", "Aquamarine Mist", "薄雾海水蓝", "559", "#7AB8C8", "blue", "PB15/PW6", True),
    ("wn-561", "Misty Turquoise Rose", "迷雾松石玫瑰", "561", "#7A9AA8", "blue", "PB29/PG7/PW6", True),
    ("wn-570", "Blue Dream", "蓝色之梦", "570", "#4A7AB8", "blue", "PB15", False),
    ("wn-571", "Blue Mystery", "神秘蓝", "571", "#3A5A8B", "blue", "PB28/PB29", True),
    ("wn-595", "Sea Blue", "迷雾海蓝", "595", "#3A6A8B", "blue", "PB15/PG7/PBk9", True),
    ("wn-609", "Quinacridone Lilac", "丁香紫", "609", "#8B4A7A", "purple", "PV19", False),
    ("wn-632", "Hermit Mist", "薄雾赤铁棕", "632", "#8A6A5A", "earth", "PBr7/PW6", True),
    ("wn-635", "Sunset Mist", "日落薄雾", "635", "#8A6278", "purple", "PB29/PO73", True),
    ("wn-745", "May Green", "五月绿", "745", "#6AB84A", "green", "PY3/PG7", False),
    ("wn-760", "Green Shadows", "阴影绿", "760", "#3A5A3A", "green", "PW6/PG7/PBk9", True),
    ("wn-761", "Taiga Mist", "薄雾泰加针叶林绿", "761", "#4A6A4A", "green", "PBr7/PB15", True),
    ("wn-3002", "Rose Dream", "蔷薇之梦", "3002", "#C87A8A", "pink", "PR122/PW6", True),
]
wn_ace = {
    "wn-273": "Clean isoindoline yellow — bright without cadmium.",
    "wn-325": "Bordeaux claret — wine-stain red for velvet shadows.",
    "wn-382": "Rose mist granulation — soft pink fog, romantic texture.",
    "wn-408": "Reliable burnt umber — every palette needs this sensible adult.",
    "wn-466": "Mountain mist — cloudy granulating gray-blue atmosphere.",
    "wn-467": "Black mystery — granulating dark with secrets.",
    "wn-507": "Turquoise blue — bright clean tropical water.",
    "wn-511": "Classic ultramarine — bread-and-butter blue.",
    "wn-531": "Cobalt turquoise — milky gem-tone sky accents.",
    "wn-555": "Dark blue shadows — granulating twilight corners.",
    "wn-559": "Aquamarine mist — hazy summer sea.",
    "wn-561": "Misty turquoise rose — weird beautiful granulation.",
    "wn-570": "Blue dream — cheerful straightforward blue.",
    "wn-571": "Blue mystery — galaxies in a wash.",
    "wn-595": "Sea blue — storm clouds over water.",
    "wn-609": "Quin lilac — cool purple without mud.",
    "wn-632": "Hermit mist — cozy granulating brown.",
    "wn-635": "Muted purple with an orange-pink halo — wet washes look like purple hour skies splitting into blue and warm glow.",
    "wn-745": "May green — spring leaves, mixing green.",
    "wn-760": "Green shadows — deep forest shade.",
    "wn-761": "Taiga mist — Siberian pines in morning fog.",
    "wn-3002": "Rose dream — sediment pink cotton-candy clouds.",
}
for row in wn_rows:
    new_colors.append(entry(
        id=row[0], brand="White Nights", name_en=row[1], name_zh=row[2], code=row[3],
        hex=row[4], family=row[5], format="full pan", pigment=row[6], granulating=row[7],
        brand_traits=["professional", "white-nights", "russian"],
        notes="Granulating color. Full pan." if row[7] else "Full pan. Jun 28 batch.",
        ace_note=wn_ace[row[0]],
    ))

rosa_rows = [
    ("rosa-709", "Magenta Rose", "玫瑰红", "709", "#C41E6A", "pink", "PV19", True),
    ("rosa-740", "Bright Red", "鲜红色", "740", "#E02030", "red", "PR254", True),
    ("rosa-745", "Naples Yellow Light", "那不勒斯灯黄", "745", "#F5E8C8", "yellow", "PY40", False),
    ("rosa-747", "Black Grape", "褐黑色", "747", "#3A2A3A", "neutral", "PBk6/PR101", False),
    ("rosa-748", "Naples Rose", "那不勒斯玫瑰", "748", "#F0C8A8", "pink", "PY40/PR101", False),
    ("rosa-755", "Grass Green", "草绿", "755", "#6AB82A", "green", "PG7/PY3", False),
    ("rosa-761", "Golden Brown", "歌剧棕色", "761", "#9A6A3A", "earth", "PBr7", False),
    ("rosa-767", "Azure Green", "天青色", "767", "#4AB8A8", "blue-green", "PG7/PB15", False),
    ("rosa-782", "Royal Blue", "皇家蓝", "782", "#2A4AB8", "blue", "PB15", False),
]
rosa_ace = {
    "rosa-709": "Ukrainian magenta rose — bold Eastern European floral power.",
    "rosa-740": "Screaming bright red — poppies and courage.",
    "rosa-745": "Light Naples — creamy pale yellow.",
    "rosa-747": "Black grape — wine stains and shadows.",
    "rosa-748": "Naples rose — peachy warmth for skin and walls.",
    "rosa-755": "Grass green — spring meadows.",
    "rosa-761": "Golden brown — opera house elegance.",
    "rosa-767": "Azure green — teal-green gem, sky meets sea. You corrected me right!",
    "rosa-782": "Royal blue — rich saturated Ukrainian blue.",
}
for row in rosa_rows:
    new_colors.append(entry(
        id=row[0], brand="Rosa Gallery", name_en=row[1], name_zh=row[2], code=row[3],
        hex=row[4], family=row[5], format="single pan", pigment=row[6], staining=row[7],
        brand_traits=["professional", "rosa", "ukrainian"],
        notes="Rosa Gallery single pan. Jun 28 batch.",
        ace_note=rosa_ace[row[0]],
    ))

rs_rows = [
    ("rs-334", "Mineral Purple", "矿物紫", "334", "#6B4A8B", "purple", "full pan", "PV16/PBk6", True),
    ("rs-346", "Aquarius Green", "宝瓶绿", "346", "#6A8A5A", "green", "full pan", "PG7/PBr7", False),
    ("rs-359", "Potter's Pink", "波特粉", "359", "#E8B4B8", "pink", "half-pan", "PR233", False),
    ("rs-415", "Morning Mist", "多雾清晨", "415", "#8A9AA8", "neutral", "half-pan", "PBk6/PW6", True),
]
rs_ace = {
    "rs-334": "Polish mineral purple — granulating violet with different soul from Maimeri 479.",
    "rs-346": "Aquarius green — muted olive, Polish landscape mist.",
    "rs-359": "RS Potter's pink — compare with Maimeri 479 side by side for science.",
    "rs-415": "Morning mist — granulating dawn fog over Polish fields.",
}
for row in rs_rows:
    new_colors.append(entry(
        id=row[0], brand="Roman Szmal", name_en=row[1], name_zh=row[2], code=row[3],
        hex=row[4], family=row[5], format=row[6], pigment=row[7], granulating=row[8],
        brand_traits=["professional", "roman-szmal", "polish"],
        notes="Granulating color." if row[8] else "Jun 28 batch.",
        ace_note=rs_ace[row[0]],
    ))

mg_rows = [
    ("mg-128-paynes-gray", "Payne's Gray", "佩恩灰", "128", "#4A5A6B", "neutral", "PBk6/PB29", False),
    ("mg-156-quin-rose", "Quinacridone Rose", "喹吖啶酮玫瑰", "156", "#C2185B", "pink", "PV19", True),
    ("mg-187-transparent-red", "Transparent Red Iron Oxide", "透明红", "187", "#8B3A2A", "earth", "PR101", False),
    ("mg-189-turquoise", "Turquoise", "绿松石", "189", "#3AB8B8", "blue-green", "PB16", False),
    ("mg-193-ultramarine-violet", "Ultramarine Violet", "群青紫", "193", "#5A4A8B", "purple", "PB29/PV15", False),
]
mg_ace = {
    "mg-128-paynes-gray": "Honey-based Payne's gray — soft neutral, stays juicy on paper.",
    "mg-156-quin-rose": "THE quin rose — honey base makes it bloom on wet paper.",
    "mg-187-transparent-red": "Transparent red oxide — warm glazes with extended working time.",
    "mg-189-turquoise": "Bright turquoise — tropical accent.",
    "mg-193-ultramarine-violet": "Ultramarine violet — moody blue-purple shadows.",
}
for row in mg_rows:
    new_colors.append(entry(
        id=row[0], brand="M. Graham", name_en=row[1], name_zh=row[2], code=row[3],
        hex=row[4], family=row[5], format="2ml sample", size="2ml",
        pigment=row[6], staining=row[7],
        brand_traits=["professional", "m-graham", "honey-based", "2ml-sample"],
        notes="2ml sample. Jun 28 batch.",
        ace_note=mg_ace[row[0]],
    ))

existing_ids = {x["id"] for x in palette["colors"]}
added = 0
for col in new_colors:
    if col["id"] not in existing_ids:
        palette["colors"].append(col)
        existing_ids.add(col["id"])
        added += 1

palette["color_count"] = len(palette["colors"])
palette["updated"] = "2026-06-28-v5"
palette["source"] = "Our Art Studio photos — Jun 28 shopping screenshot batch merged"

with open(path, "w", encoding="utf-8") as f:
    json.dump(palette, f, ensure_ascii=False, indent=2)

print(f"Added {added} new colors. Total: {palette['color_count']}")