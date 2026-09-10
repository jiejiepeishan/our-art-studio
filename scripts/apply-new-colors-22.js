/**
 * Add 22 new colors + handwritten cards from
 * drafts/new-colors-data-draft.md (all 22 kept).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const HB = ["professional", "artists"];
const SCH = ["professional", "premium"];
const NAT = ["professional", "naturals"];
const AKAD = ["student", "academy"];
const ERDE = ["specialty", "drawing"];

function C(partial) {
  return {
    transparency: 2,
    lightfastness: 1,
    granulating: false,
    staining: false,
    toxicity: "low",
    mix_star: false,
    mix_tips: [],
    ...partial,
  };
}

const colors = [
  C({
    id: "hb-hp-542-bamboo-green",
    brand: "Holbein",
    brand_traits: HB,
    name_en: "Bamboo Green",
    name_zh: "竹绿",
    code: "PN542",
    pigment: "PG36",
    hex: "#1B8A4A",
    format: "half-pan",
    size: "half-pan",
    family: "green",
    staining: true,
    mix_star: true,
    notes: "Holbein HPN PN542 Bamboo Green. Official PG36 (brominated phthalo, yellow shade). Same molecule as Helio 514.",
    temp_role: "Warm-leaning yellow-shade phthalo · PG36 · Japanese Helio twin · staining",
    best_for: "Sunlit bamboo, acid spring leaf, and a yellow-shade engine in Holbein manners.",
    ace_note: `Bamboo in a half-pan — yellow-shade phthalo, not a plant juice.

Holbein PN542 is single-pigment PG36: the same brominated copper phthalocyanine as Schmincke Helio Green 514. Cooler than May, sunnier than PG7 Phthalo. Japanese rewet, no oxgall — it sits still on the paper instead of racing. Still a stain. Still an engine, not a foliage crayon.

Dual advice: one PG36 well. Helio half-pan already owns that seat. This is Holbein manners try-on (creamy, cooperative) vs German sun-green. Keep the rewet you reach for. Not Emerald Green Nova (that's milk + May). Not Bamboo-the-tree: it's a marketing name for yellow-shade phthalo.`,
    ace_history: `PG36 is Helio's molecule — 20th-century phthalo yanked yellow with bromine. Holbein filed it as Bamboo Green. Trust the index, not the grove.`,
  }),
  C({
    id: "hb-hp-544-emerald-green-nova",
    brand: "Holbein",
    brand_traits: HB,
    name_en: "Emerald Green Nova",
    name_zh: "翡翠绿Nova",
    code: "PN544",
    pigment: "PY3/PG7/PW6",
    hex: "#6ECB6A",
    format: "half-pan",
    size: "half-pan",
    family: "green",
    lightfastness: 2,
    notes: "Holbein HPN PN544 Emerald Green Nova. Official PY3 + PG7 + PW6. Lightfastness **. Not viridian PG18.",
    temp_role: "Milky spring leaf · Phthalo + arylide lemon + titanium white · illustration green",
    best_for: "Poster spring, mint candy, and high-key leaves that need body.",
    ace_note: `Nova means new — not emerald, not viridian.

PY3 + PG7 is the May Green marriage (cool lemon + phthalo). Holbein added PW6, so it milks: more cover, more chalk in stacks, less glaze. Official lightfastness is only ** — the lemon + white convenience is the weak joint. Your Sch 513 Emerald is PG18 viridian (quiet, often granulating). This pan is a highlighter lawn.

Dual advice: one milky-May seat. You already have May pans and Mint Dream (PW6+PG7). Nova is the Japanese illustration cut. Don't keep Nova + May + Mint as three springs. Not a second Helio, not a second viridian.`,
    ace_history: `Holbein's "Nova" convenience greens are 20th-century phthalo + arylide + white — a Veronese-emerald name on a student-bright mix. Real emerald green was arsenic. Real viridian is chromium hydrate. This is neither.`,
  }),
  C({
    id: "hb-hp-611-peach-black",
    brand: "Holbein",
    brand_traits: HB,
    name_en: "Peach Black",
    name_zh: "桃黑",
    code: "PN611",
    pigment: "PBk1",
    hex: "#2A2420",
    format: "half-pan",
    size: "half-pan",
    family: "neutral",
    mix_star: true,
    notes: "Holbein HPN PN611 Peach Black. Official PBk1 aniline/nigrosine black. OSI, ****. Not ivory or lamp.",
    temp_role: "Warm-leaning aniline black · PBk1 · peach-stone night · not carbon",
    best_for: "Warm darks, hair, ink that isn't blue-black, and mixing without killing chroma as fast as lamp.",
    ace_note: `Peach is the stone, not the fruit.

PBk1 is aniline / nigrosine — a dye-black, warm, slightly brown, famous in Japanese watercolor for hair and summer shade. Not PBk6 lamp, not PBk9 ivory. Holbein rates it **** and OSI (opaque-ish). It can stain. It will not granulate like lunar blacks.

Dual advice: one PBk1 if you want a warm black; keep ivory/lamp/Payne's as the other darks. vs Payne's: Payne's is already blue-grey convenience. vs Perylene Green: that is a green-black for plants; this is a brown-black for people and ink. Don't own four blacks.`,
    ace_history: `Aniline blacks are 19th-century dye chemistry. Holbein kept Peach Black as a Japanese-studio dark when Europe went carbon. The peach is the pit that charcoal-makers also love — here the name stuck to a different molecule.`,
  }),
  C({
    id: "hb-tube-wg508-melon-orange",
    brand: "Holbein",
    brand_traits: HB,
    name_en: "Melon Orange",
    name_zh: "蜜瓜橙",
    code: "WG508",
    pigment: "confirm tube",
    hex: "#FF8A4A",
    format: "tube",
    size: "5ml",
    family: "orange",
    notes: "Holbein Artists' Water Color HWC WG508 Melon Orange 5ml. Not gouache G508 Brilliant Orange. Pigment line not on English charts — read the tube.",
    temp_role: "Warm melon convenience orange · HWC 5ml · pigment TBD",
    best_for: "Fruit skin, lantern light, and a Japanese orange that isn't cadmium.",
    ace_note: `The tube says watercolor. The number looks like gouache.

WG508 Melon Orange is Holbein HWC 5ml — Japanese "メロン" on the silver tube. Gouache Brilliant Orange is G508, different medium, often PO13 and fugitive. Do not dual them. Until we read the watercolor pigment line, treat this as a convenience warm orange, not a primary.

Dual advice: one fruit-orange seat vs pyrrol/PO73 fire (your reds) and transparent PO48 heat. Sample first. If the tube is a hue soup, don't promote a 15ml.`,
    ace_history: `Asia-market Holbein codes (WG) don't always match the English W078 chart. Trust the words Artists' Water Color on the crimp, then the index on the barrel.`,
  }),
  C({
    id: "sch-337-cochineal-red",
    brand: "Schmincke",
    brand_traits: SCH,
    name_en: "Cochineal Red",
    name_zh: "胭脂虫红",
    code: "337",
    pigment: "NR4:1",
    hex: "#9B1B4A",
    format: "2ml sample",
    size: "2ml",
    family: "red",
    lightfastness: 4,
    notes: "Horadam Retro 337 Cochineal Red. Official NR4:1. LF 2/5. Insect dye. Not a lightfast quin.",
    temp_role: "Cool-warm historic crimson · Cochineal (NR4:1) · fugitive-leaning · sample only",
    best_for: "Historical studies, glowing lakes you accept may fade, not commissions in a sunny window.",
    ace_note: `This is the bug.

NR4:1 is carminic acid from cochineal scale insects — the old European crimson lake. Schmincke revived it for the Horadam Retro line: transparent, deep, lively, and only 2/5 lightfast. It will not behave like PR209 Quin Red or PV19 carmine. It may dull in sun. That's the point of the sample: know the history, don't build a career on it.

Dual advice: not a fourth quin red. Not Madder Red Dark. Keep 337 as a history well. For work that must last, stay on the modern crimsons you already wrote.`,
    ace_history: `Cochineal dyed cardinals' robes and Turner's reds. 2024 Retro brought the insect back with the original weaknesses attached. The 2ml is the honest format.`,
  }),
  C({
    id: "sch-nat-510-dyers-green",
    brand: "Schmincke",
    brand_traits: NAT,
    name_en: "Dyers' Green",
    name_zh: "染料绿",
    code: "510",
    pigment: "NY3/NB1",
    hex: "#3A6B4A",
    format: "2ml sample",
    size: "2ml",
    family: "green",
    lightfastness: 3,
    granulating: true,
    notes: "Horadam Naturals 510 Dyers' Green. Official NY3 + NB1 (turmeric + indigo). Only mixed color in that line. LF ~3/5.",
    temp_role: "Plant-dye olive · Turmeric + indigo · Naturals · not phthalo sap",
    best_for: "Cloth-green fields, historical dye studies, greens that look grown not printed.",
    ace_note: `Someone already mixed the vat.

Naturals 510 is turmeric (NY3, curcuma) + indigofera (NB1) — the old cloth-dye pair, the only convenience mix in that 16-color vegan line. Semi-transparent, a bit matte/gouache in body, more plant than phthalo. It will not stain like PG7. Lightfastness is honest-good, not Horadam-five-star.

Dual advice: not May (PG7+PY3), not QoR Sap (nickel+phthalo), not 534 orange-olive. This is a dye-vat green. One Naturals green. Mix cooler with 470, warmer with curcuma if you ever add 250.`,
    ace_history: `Dyers mixed indigo and turmeric for cloth long before phthalocyanine. Schmincke's 2024 Naturals put that recipe in gum arabic and called it Färbergrün.`,
  }),
  C({
    id: "sch-nat-470-indigofera",
    brand: "Schmincke",
    brand_traits: NAT,
    name_en: "Indigofera",
    name_zh: "费拉靛青",
    code: "470",
    pigment: "NB1",
    hex: "#2A4A6A",
    format: "2ml sample",
    size: "2ml",
    family: "blue",
    lightfastness: 3,
    granulating: true,
    mix_star: true,
    notes: "Horadam Naturals 470 Indigofera. Official NB1 natural indigo. Plant ferment, not PB60 / phthalo indigo.",
    temp_role: "Plant indigo · NB1 · denim to near-black · not synthetic indigo",
    best_for: "Denim, dusk cloth, historical blue that isn't phthalocyanine.",
    ace_note: `Most paints named Indigo are lying.

NB1 is fermented Indigofera leaf — the only natural blue dye that mattered for centuries. Schmincke's Naturals version is denim in masstone, pale workwear in tint, more complex than a PB15+black convenience. Not indanthrene PB60 (DS/Sennelier "indigo"). Not Horadam 485 Indigo (usually a modern mix).

Dual advice: one plant-indigo seat. Your other indigos stay synthetic. Don't stack 470 with a phthalo-indigo as twins. Sample: if you love the cloth, maybe a 15ml; if you wanted mixing power, you already own phthalo blue.`,
    ace_history: `Indigofera tinctoria, vats, empire, jeans. 2024 Horadam Naturals tried the traditional ferment instead of a lab analogue. The 2ml is the try-on.`,
  }),
  C({
    id: "sch-erde-8850-liquid-chalk",
    brand: "Schmincke",
    brand_traits: ERDE,
    name_en: "Liquid Chalk",
    name_zh: "液体白垩",
    code: "18850",
    pigment: "PW18",
    hex: "#E8E4D8",
    format: "tube",
    size: "5ml",
    family: "specialty",
    transparency: 3,
    granulating: true,
    notes: "Schmincke Liquid Earth 18 850. Official liquid chalk, PW18 calcium carbonate. Not Horadam. Gouache-like, drawing/underpaint.",
    temp_role: "Liquid limestone · PW18 · toned ground / highlight · not Chinese white",
    best_for: "Dust-free chalk drawing, light grounds, pastel tooth for dry media on top.",
    ace_note: `This is chalk in a tube, not a watercolor white.

Series 18 Liquid Earth: German limestone (PW18), gum arabic, vegan, gouache-body. Official job is clean drawing and underpainting — smearable when damp, a little tooth when dry, happy under pastel. It will not replace Chinese white / titanium for opaque corrections in a delicate glaze stack.

Dual advice: specialty ground, not a fourth white. vs Buff Titanium / PW6 Icy Yellow: those are watercolor milk. This is drawing chalk.`,
    ace_history: `Schmincke 2024 Liquid Earth/Charcoal: dust-free versions of prehistoric drawing dirt. Chalk is the light.`,
  }),
  C({
    id: "sch-erde-8854-liquid-sanguine",
    brand: "Schmincke",
    brand_traits: ERDE,
    name_en: "Liquid Sanguine",
    name_zh: "液体红赭",
    code: "18854",
    pigment: "PR102",
    hex: "#B85A3A",
    format: "tube",
    size: "5ml",
    family: "earth",
    transparency: 3,
    granulating: true,
    notes: "Schmincke Liquid Earth 18 854. Liquid sanguine, PR102 natural red iron oxide. Drawing/underpaint, not Horadam burnt sienna.",
    temp_role: "Liquid red chalk · PR102 · life-drawing sanguine · not a mixing sienna",
    best_for: "Figure underdrawing, warm grounds, sanguine studies without pastel dust.",
    ace_note: `Sanguine means blood-chalk, the old figure-drawing stick.

PR102 is natural red iron oxide — cousin to burnt sienna / Venetian, thicker, gouache-leaning. Mixes with ultramarine toward warm grey. Don't ask it to glaze like transparent sienna.

Dual advice: one liquid-sanguine drawing well. Your watercolor burnt siennas stay the mixing earths. Don't promote this as a fifth PR101 brick.`,
    ace_history: `Red chalk drew Renaissance bodies. Schmincke liquefied German earth so you can wash a whole page without dust.`,
  }),
  C({
    id: "sch-erde-8852-liquid-umber",
    brand: "Schmincke",
    brand_traits: ERDE,
    name_en: "Liquid Umber",
    name_zh: "液体棕土",
    code: "18852",
    pigment: "PY43",
    hex: "#8B7355",
    format: "tube",
    size: "5ml",
    family: "earth",
    transparency: 3,
    granulating: true,
    notes: "Schmincke Liquid Earth 18 852. Liquid umber. Parka tube read PY43 (yellow ochre earth); confirm barrel. Drawing/underpaint.",
    temp_role: "Liquid brown earth · ochre-umber · ground / drawing · not raw umber mixer",
    best_for: "Toned paper in a tube, large earth washes, skin-mix with sanguine.",
    ace_note: `The name says umber; one published tube read is PY43 (yellow ochre).

Either way it is German-mined earth in gum, gouache-body, for grounds and big dirty-beautiful washes — not a replacement for Horadam 667 raw umber as a mixing cool brown. Confirm the barrel. Mixes with sanguine toward skin.

Dual advice: drawing earth, not a second raw umber. One Liquid Earth brown is enough with the sanguine.`,
    ace_history: `Umber and ochre are the same dirt family, different holes in the ground. Liquid Earth is the wash version of a carré stick.`,
  }),
];

const ICY = [
  {
    id: "sch-akad-907-icy-yellow",
    code: "907",
    name_en: "Icy Yellow",
    name_zh: "冰黄",
    pigment: "PW6/PY74",
    hex: "#F5EE7A",
    family: "yellow",
    extra: "Hansa-ish PY74 in milk — cool lemonade, not a primary engine. Chalks if you glaze.",
  },
  {
    id: "sch-akad-908-icy-orange",
    code: "908",
    name_en: "Icy Orange",
    name_zh: "冰橙",
    pigment: "PW6/PY74/PO43",
    hex: "#F5C44A",
    family: "orange",
    extra: "PO43 perinone (the glow orange) dulled with white and PY74. Sherbet, not cadmium fire.",
  },
  {
    id: "sch-akad-909-icy-red",
    code: "909",
    name_en: "Icy Red",
    name_zh: "冰红",
    pigment: "PW6/PR112",
    hex: "#E88AA8",
    family: "red",
    extra: "PR112 naphthol — a student red that can be only so lightfast. Pastel rose-red, not quin.",
  },
  {
    id: "sch-akad-910-icy-pink",
    code: "910",
    name_en: "Icy Pink",
    name_zh: "冰粉",
    pigment: "PW6/PR122",
    hex: "#D48AD0",
    family: "pink",
    extra: "PR122 quin magenta in milk — the same molecule as your magentas, chalked into macaron.",
  },
  {
    id: "sch-akad-911-icy-violet",
    code: "911",
    name_en: "Icy Violet",
    name_zh: "冰紫",
    pigment: "PW6/PB15:1/PV23",
    hex: "#7A7AC0",
    family: "purple",
    extra: "Phthalo blue + dioxazine in white. Lilac ice. PV23 can stain through the milk.",
  },
  {
    id: "sch-akad-912-icy-blue",
    code: "912",
    name_en: "Icy Blue",
    name_zh: "冰蓝",
    pigment: "PW6/PB15:1/PV23",
    hex: "#4A6AB8",
    family: "blue",
    extra: "Same pair as 911, bluer mix. Your card also marks PV23. If the pan is pure sky, the violet is a pinch.",
  },
  {
    id: "sch-akad-913-icy-turquoise",
    code: "913",
    name_en: "Icy Turquoise",
    name_zh: "冰松石",
    pigment: "PW6/PB15:3",
    hex: "#3A9AD8",
    family: "blue-green",
    staining: true,
    extra: "PB15:3 green-shade phthalo + white. Pool tile. Stains more than it looks.",
  },
  {
    id: "sch-akad-914-icy-blue-green",
    code: "914",
    name_en: "Icy Blue-green",
    name_zh: "冰蓝绿",
    pigment: "PW6/PG7",
    hex: "#3AB8B0",
    family: "green",
    staining: true,
    extra: "PG7 engine in milk — cousin of Mint Dream. Not Glacier (that's minerals). Illustration teal.",
  },
  {
    id: "sch-akad-915-icy-green",
    code: "915",
    name_en: "Icy Green",
    name_zh: "冰绿",
    pigment: "PW6/PG36/PY74",
    hex: "#A8D86A",
    family: "green",
    staining: true,
    extra: "Helio + hansa + white. Spring mint. Same temptation as Emerald Nova — dessert leaf.",
  },
  {
    id: "sch-akad-916-icy-red-brown",
    code: "916",
    name_en: "Icy Red-brown",
    name_zh: "冰红棕",
    pigment: "PW6/PBr25",
    hex: "#C48A5A",
    family: "earth",
    extra: "PBr25 benzimidazolone brown + white. Cafe-au-lait. Id is sch-akad-916 so it never eats Horadam Urban Yellow 916.",
  },
  {
    id: "sch-akad-917-icy-brown",
    code: "917",
    name_en: "Icy Brown",
    name_zh: "冰棕",
    pigment: "PW6/PBr25/PG36",
    hex: "#8A8A5A",
    family: "earth",
    extra: "Brown + a pinch of yellow-phthalo. Khaki ice. Not raw umber.",
  },
  {
    id: "sch-akad-918-icy-grey",
    code: "918",
    name_en: "Icy Grey",
    name_zh: "冰灰",
    pigment: "PW6/PG36/PBr25/PBk7",
    hex: "#6A6A5A",
    family: "grey",
    extra: "Four-pigment convenience grey. Fast shadow for the set. Not Payne's, not a mixing neutral to learn from.",
  },
];

for (const icy of ICY) {
  colors.push(
    C({
      id: icy.id,
      brand: "Schmincke",
      brand_traits: AKAD,
      name_en: icy.name_en,
      name_zh: icy.name_zh,
      code: icy.code,
      pigment: icy.pigment,
      hex: icy.hex,
      format: "academy pan",
      size: "academy",
      family: icy.family,
      lightfastness: 2,
      staining: Boolean(icy.staining),
      notes: `Schmincke Akademie Aquarell Icy / 马卡龙 ${icy.code}. Pigments from studio swatch card. Not Horadam Supergranulating ${icy.code}.`,
      temp_role: `Pastel ${icy.name_en.toLowerCase()} · ${icy.pigment} · academy milk · not an engine`,
      best_for: "Macaron / high-key illustration, ice-cream still life, and student-bright sketches.",
      ace_note: `${icy.name_en} (${icy.code}) — Akademie Icy, not Horadam.

Every color in this set is titanium white (PW6) plus a modern organic. They are macarons: pretty, covering, chalky if stacked, weak as mixers. ${icy.extra}

Dual advice: treat the twelve as one pastel kit, not twelve new primaries. vs Mint Dream / Nova / Holbein lavender: same milk-logic. Don't buy Horadam 15ml of a color you only needed as ice-cream.`,
      ace_history: `Akademie Aquarell is Schmincke's student line. The Icy / 马卡龙 set is 21st-century pastel marketing: white in every well so the dots look like gelato. Codes 907–918 must never be filed as Horadam Supergranulating 9xx.`,
    })
  );
}

const p = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));
const have = new Set(p.colors.map((c) => c.id));
const dup = colors.filter((c) => have.has(c.id));
if (dup.length) {
  console.error("duplicate ids", dup.map((c) => c.id).join(", "));
  process.exit(1);
}
p.colors.push(...colors);
p.color_count = p.colors.length;
p.updated = new Date().toISOString().slice(0, 10) + "-new-colors-22";
p.source = (p.source || "") + " · 2608 new colors haul (Holbein HPN/HWC, Horadam 337/Naturals, Liquid Earth, Akademie Icy)";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("added", colors.length, "palette", p.color_count);
console.log(colors.map((c) => c.id).join("\n"));
