/**
 * Medium-toxicity official-site audit (v156).
 * Pigment + toxicity from maker pages; Dual rewritten only where the recipe was false.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const COBALT =
  "Cobalt pigment — wash hands after painting; keep food and drink away from the palette.";
const NICKEL =
  "Nickel-containing pigment — wash hands after sessions; no eating at the desk.";
const MANGANESE =
  "Manganese pigment — wash hands well after painting.";
const CADMIUM =
  "Cadmium pigment — wash hands thoroughly, don't spray without ventilation, and keep tubes away from food prep areas.";
const CADMIUM_COBALT =
  "Cadmium red grain plus cobalt chromite — wash hands thoroughly; don't spray; keep food and drink off the palette.";

const fields = {
  "rosa-748": {
    pigment: "PR101/PW6",
    toxicity: "low",
    notes:
      "Rosa Gallery 748 Naples Rose. Official PR101/PW6 (iron + titanium white), not PY40/PR101.",
  },
  "rosa-745": {
    pigment: "PY42/PW6",
    toxicity: "low",
    notes:
      "Rosa Gallery 745 Naples Yellow Light. Official PY42/PW6 (ochre + white), not PY40.",
  },
  "mg-019-cobalt-yellow": {
    pigment: "PY184",
    name_en: "Bismuth Yellow",
    name_zh: "铋黄",
    toxicity: "low",
    notes:
      "M. Graham watercolor 019 is Bismuth Yellow PY184 on mgraham.com — not Cobalt Yellow/PY40. Studio id kept.",
  },
  "rs-334": {
    pigment: "PB29/PV19",
    name_en: "Mineral Violet",
    toxicity: "low",
    notes:
      "Roman Szmal Aquarius 334 Mineral Violet. Official PB29/PV19, not PV16/PBk6.",
  },
  "sch-972-starry-purple": {
    pigment: "PB29/PR233",
    name_en: "Galaxy Violet",
    name_zh: "银河紫",
    toxicity: "low",
    notes:
      "Horadam Supergranulating 972 Galaxy Violet. Official PB29/PR233. 2ml was filed as Starry Purple; same SKU as the tube.",
  },
  "sch-tube-972-galaxy-violet": {
    pigment: "PB29/PR233",
    toxicity: "low",
    notes:
      "Horadam Supergranulating 972 Galaxy Violet. Official PB29/PR233 (not PV16/PBk6).",
  },
  "sch-tube-975-galaxy-black": {
    pigment: "PB29/PBk11",
    toxicity: "low",
    notes:
      "Horadam Supergranulating 975 Galaxy Black. Official PB29/PBk11 (not PBk7/PV16).",
  },
  "sch-983-tundra-violet": {
    pigment: "PB29/PBr6",
    granulating: true,
    toxicity: "low",
    notes:
      "Horadam Supergranulating 983 Tundra Violet. Official PB29/PBr6 (not PV16).",
  },
  "sch-931-shire-yellow": {
    pigment: "PY159/PV62",
    toxicity: "low",
    notes:
      "Horadam Supergranulating 931 Shire Yellow. Official PY159 + PV62. PV62 is strontium phosphate (Cobalt Violet Hue), not metal cobalt.",
  },
  "sch-952-deep-sea-indigo": {
    pigment: "PV62/PG18",
    toxicity: "low",
    notes:
      "Horadam Supergranulating 952 Deep Sea Indigo. Official PV62 + PG18. PV62 is strontium-phosphate violet hue; PG18 viridian. Not metal cobalt.",
  },
  "sch-tube-952-deep-sea-indigo": {
    pigment: "PV62/PG18",
    toxicity: "low",
    notes:
      "Horadam Supergranulating 952 Deep Sea Indigo. Official PV62 + PG18. Not metal cobalt.",
  },
  "sch-tube-951-deep-sea-violet": {
    pigment: "PB29/PBr33",
    toxicity: "low",
    notes:
      "Horadam Supergranulating 951 Deep Sea Violet. Official PB29/PBr33 (not PV16/PB29).",
  },
  "sch-923-desert-brown": {
    pigment: "PR108/PBk11/PY159",
    toxicity: "high",
    toxicity_habit: CADMIUM,
    notes:
      "Horadam Supergranulating 923 Desert Brown. Official PR108/PBk11/PY159 (cadmium red + Mars black + zircon yellow), not PY150/PR108/PBk11.",
  },
  "sch-924-desert-green": {
    pigment: "PR108/PG26",
    toxicity: "high",
    toxicity_habit: CADMIUM_COBALT,
    notes:
      "Horadam Supergranulating 924 Desert Green. Official PR108/PG26. Cadmium grain + cobalt chromite — high handling light.",
  },
  "sch-hp-naples-yellow": {
    pigment: "PW6/PY53/PBr24",
    code: "229",
    toxicity: "medium",
    toxicity_habit: NICKEL,
    notes:
      "Horadam 229 Naples Yellow. Official PW6/PY53/PBr24. Catalog PY216/PY40 and code 319 were wrong.",
  },
  "wn-389-scarlet-mist": {
    pigment: "PG19/PR188",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "White Nights 389 Scarlet Mist. Official PG19/PR188 (cobalt green + naphthol scarlet), not PR12/PB28.",
  },
  "wn-571": {
    pigment: "PV16/PB29/PG7",
    toxicity: "medium",
    toxicity_habit: MANGANESE,
    notes:
      "White Nights 571 Blue Mystery (Metamorphoses). Official PV16/PB29/PG7, not PB28/PB29.",
  },
  "wn-531": {
    pigment: "PB28",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "White Nights 531 Cobalt Turquoise. Nevskaya official PB28, not PB36.",
  },
  "ds-152-rose-deep-gold": {
    pigment: "PO48/PY150",
    name_en: "Quinacridone Deep Gold",
    name_zh: "喹吖啶深金",
    toxicity: "medium",
    toxicity_habit: NICKEL,
    notes:
      "DANIEL SMITH Quinacridone Deep Gold SKU 152. Official PO48 + PY150. Studio had Rose Deep Gold / PY150 only.",
  },
  "sch-953-deep-sea-blue": {
    pigment: "PB29/PG50/PV62",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 953 Deep Sea Blue. Official PB29/PG50/PV62 (not PV16).",
  },
  "sch-tube-953-deep-sea-blue": {
    pigment: "PB29/PG50/PV62",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 953 Deep Sea Blue. Official PB29/PG50/PV62.",
  },
  "sch-tube-962-glacier-turquoise": {
    pigment: "PG50/PV62",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 962 Glacier Turquoise. Official PG50/PV62 (not PG50/PV16, not PB16).",
  },
  "sch-tube-955-deep-sea-black": {
    pigment: "PB35/PB74/PBk11",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 955 Deep Sea Black. Official PB35/PB74/PBk11 (not PBk7/PV16).",
  },
  "sch-hp-cobalt-green-dark": {
    code: "533",
    notes:
      "Horadam Cobalt Green Dark / Kobaltgrün dunkel. Official color 533, PG26. Color 509 is Kobalttürkis. Studio tin may still show 509; PG26 is the identity.",
  },
  "ds-027-light-cobalt-green": {
    granulating: true,
    notes:
      "DANIEL SMITH Cobalt Green Pale SKU 027. Official PG19, granulating. Studio label Light Cobalt Green.",
  },
};

const essay = {
  "rosa-748": {
    temp_role: "Warm peach rose · Iron + white · skin & wall corrector",
    ace_note: `Naples rose — peachy warmth for skin and walls.

Official Rosa is PR101 + PW6 (iron oxide + titanium white), not PY40 cobalt yellow. Peach flesh, faded stucco; "rose" only in the romantic name. Portrait corrector next to Naples Yellows — soft, low scream, human. Won't make clean violet with ultramarine the way PV19 does.

Dual advice: soft peach/skin seat with Naples yellows — one well. Don't use when you needed Potter's Pink dust or quin rose petals. Filed in pink because the name and peach read blush; chemically it's warm iron + white.`,
    ace_history: `Naples-style pale warmth from iron red plus titanium white — portrait-studio flesh light wearing a rose nickname. No cobalt in the official recipe.`,
  },
  "rosa-745": {
    temp_role: "Pale creamy Naples · Ochre + white · pocket cream light",
    ace_note: `Naples Yellow Light — pocket cream, not lemon.

Official Rosa is PY42 + PW6 (synthetic ochre + titanium white), not PY40. That's why the handling light is low: iron + white, no cobalt. Pale cream for highlights, lace, distant walls, the softest flesh note. Rosa single pan = travel pocket cream.

Dual advice: still the Naples/cream seat — if Schmincke 229 or MaimeriBlu already owns skin/walls, Rosa Light only stays if the swatch is clearly lighter/creamier. Don't use it when you needed PY3 for clean greens. One soft pale yellow per tin.`,
    ace_history: `Pale Naples-style yellows echo portrait-studio flesh lights — cream without lemon sting. Rosa's Light is ochre plus white, pocket-sized.`,
  },
  "mg-019-cobalt-yellow": {
    temp_role: "Opaque cool lemon-yellow · Bismuth vanadate (PY184) · body, not cream",
    ace_note: `M. Graham Bismuth Yellow — honey base, 2ml sample. Blooms on wet paper if you lean in.

Code 019 is Bismuth Yellow (PY184), not aureolin / cobalt yellow. Opaque-leaning cool lemon: poster sun, cover, heavy lemon body. Won't glaze like Hansa; will sit on the paper. Honey still blooms if you feed water.

Dual advice: one opaque cool-yellow / lemon-body seat. Not the Naples/cream well (that's Rosa Light / Horadam 229). Not a substitute for transparent Azo/Hansa primaries — opposite religion: cover vs glass.`,
    ace_history: `Bismuth vanadate (PY184) is a late-century inorganic yellow — bright, often opaque, used where painters wanted heavy lemon cover. M. Graham 019 is this, not 19th-century aureolin.`,
  },
  "rs-334": {
    temp_role: "Cool mineral violet · Ultramarine + quin · granulating Polish mix",
    ace_note: `Polish mineral violet — ultramarine plus quin, granulating mix.

Official Aquarius 334 is Mineral Violet, PB29 + PV19 — not manganese PV16. Ultra grit + quin stain: dusk florals, cool stone, a convenience violet that still flocks on rough paper. Different soul from Italian single-pigment quin and from Tundra's brown-ultra climate.

Play lab (granulation): wet cold-press. Ultra should settle; quin should keep moving.

Dual advice: one ultra+quin mineral-violet seat. vs Horadam Ultramarine Violet (PV15+PB29): more ultra-mineral, less quin petal. vs Tundra: climate brown-violet, not this mix. Don't also need three granulating violets in a small tin.`,
    ace_history: `Roman Szmal 334 is ultramarine plus quinacridone — a mixed mineral-floral violet, not manganese rock. Regional milling, modern indexes.`,
  },
  "sch-972-starry-purple": {
    temp_role: "Cool nebula violet · Ultramarine + Potter's Pink · Galaxy split",
    ace_note: `Galaxy violet — granulating pink-blue split, constellation freckles.

Official 972 is PB29 + PR233 (ultramarine + Potter's Pink), not manganese + carbon. The pink grit is chrome-tin pink; the blue is ultra. Tube + 2ml = one color (the sample was once filed as Starry).

Play lab (granulation): don't over-stir. Pink dust vs blue flocks.

Dual advice: one Galaxy violet seat. vs Deep Sea Violet: marine brown-ultra vs this cosmic pink-ultra. Don't double-fill.`,
    ace_history: `Horadam Galaxy 972: two granulating minerals, ultramarine and Potter's Pink. Constellation marketing; the split is the paint.`,
  },
  "sch-tube-972-galaxy-violet": {
    temp_role: "Cool nebula violet · Ultramarine + Potter's Pink · Galaxy split",
    ace_note: `Galaxy violet granulation — nebula purples with sediment stars.

Official 972 is PB29 + PR233, not PV16 + PBk6. Same well as the 2ml. Pink-ultra split on texture; respect the pink grit in clean lemon mixes.

Dual advice: one Galaxy violet with the sample. vs Deep Sea Violet: marine vs cosmic costume, not two identical recipes.`,
    ace_history: `Violet galaxie — ultramarine plus Potter's Pink for sedimentary cosmos. Codes over the manganese leftover.`,
  },
  "sch-tube-975-galaxy-black": {
    temp_role: "Near-black cosmos · Ultramarine + Mars black · granulating star-dust dark",
    ace_note: `Galaxy black — granulating abyss dark, not flat carbon.

Official 975 is PB29 + PBk11 (ultramarine + Mars black), not bone black + manganese. Star-dust is ultra flocks in iron black.

Play lab (granulation): night pours; respect the black in lemon mixes.

Dual advice: specialty granulating black with Deep Sea / Glacier blacks — series costume, one role. Not the same recipe as Deep Sea Black (cobalt blues + Mars black).`,
    ace_history: `Horadam Galaxy black: ultramarine plus Mars black. Cosmic name, iron-and-ultra sediment, no manganese leftover.`,
  },
  "sch-983-tundra-violet": {
    temp_role: "Cool muted climate violet · Ultramarine + Mars brown · Tundra heather",
    ace_note: `Arctic violet — muted, botanical, like heather on cold ground.

Official Supergranulating 983 is PB29 + PBr6 (ultramarine + Mars brown), not PV16. Heather and cold-ground botanicals come from brown-ultra split, not manganese. Quiet climate, not a designer scream.

Play lab (granulation): tilt. Blue flocks vs warm brown sediment.

Dual advice: one Tundra / brown-ultra muted violet. vs RS Mineral Violet: ultra+quin mix vs this climate. Specialty landscape, not a primary.`,
    ace_history: `Tundra is Schmincke climate poetry. The frost is ultramarine plus roasted iron, not manganese violet.`,
  },
  "sch-931-shire-yellow": {
    temp_role:
      "Cool pastoral yellow-green · PY159 + strontium-violet hue · Shire climate",
    ace_note: `Shire sunshine — warm pastoral yellow, Hobbit-core meadows.

Not PY53. Official Supergranulating 931 is PY159 (zirconium-praseodymium yellow) + PV62. PV62 is strontium-phosphate violet — Horadam sells it as Cobalt Violet Hue, but it is not metal cobalt. Blue-violet grit in a yellow well is why it granulates and leans green. Handling light is low.

Play lab: tilt, don't over-stir. With phthalo green it still makes spring; the point is the sediment.

Dual advice: specialty granulating yellow — not a lemon/mid primary replacement. Same Shire family as Shire Olive (PY159+PB35).`,
    ace_history: `Every Shire color is built on PY159. Yellow plus a strontium-violet hue is the meadow light — not nickel-titanate Naples, and not cobalt metal.`,
  },
  "sch-952-deep-sea-indigo": {
    temp_role:
      "Cool abyss teal-navy · Strontium-violet hue + viridian · Deep Sea climate",
    ace_note: `Deep diving blue-green — night water and whale shadows.

Catalog PB60/PG7 was the enrich lie (phthalo cannot supergranulate). Official 952 is PV62 + PG18 — strontium-phosphate violet hue plus viridian. Green-black flocks are chromium-hydrate grit, not PG7 stain. Not metal cobalt; handling light is low.

Play lab: rough cold-press, charge into still-wet Deep Sea Blue. Don't stir the abyss into soup.

Dual advice: one Deep Sea Indigo (pan + tube = one well). vs half-pan Indigo (PB60): different molecule. vs Prussian Green: iron-blue + hansa, not viridian weather.`,
    ace_history: `Deep Sea Supergranulating: viridian plus a strontium-violet hue, not indanthrene plus phthalo, and not metal cobalt.`,
  },
  "sch-tube-952-deep-sea-indigo": {
    ace_note: `Schmincke Deep Sea Indigo — Jul 7 batch. Same well as the pan.

Official PV62 + PG18, not PB60/PG7. Strontium-violet hue + viridian. One abyss seat.

Dual advice: pan SKU + tube SKU = one color.`,
    ace_history: `Same 952 Supergranulating story — viridian + strontium-phosphate violet hue.`,
  },
  "sch-tube-951-deep-sea-violet": {
    temp_role:
      "Cool deep marine violet · Ultramarine + chromite brown · Deep Sea trench",
    ace_note: `Schmincke Deep Sea Violet — granulating trench purple.

Official 951 is PB29 + PBr33 (ultramarine + zinc-iron chromite brown), not manganese. Brown-ultra split for coast night water. Tilt; don't scrub the trench flat.

Dual advice: marine mineral seat with Galaxy Violet (pink-ultra) and Ultramarine Violet. One Deep Sea violet faucet.`,
    ace_history: `Deep Sea violet is ultramarine plus a chromite brown — submarine split, not manganese fireworks.`,
  },
  "sch-923-desert-brown": {
    temp_role:
      "Warm Supergranulating sand · Cadmium red + Mars black + zircon yellow · Desert climate",
    ace_note: `Desert Brown — sun-baked Supergranulating sand.

Official 923 is PR108 + PBk11 + PY159 (cadmium red + Mars black + zircon yellow). Catalog PY150/nickel was the wrong gold. Dunes, dry riverbed, adobe — sandier than raw umber, less orange-roast than burnt sienna. The red grit is cadmium: that's the high handling light, not a fire-engine seat.

Play lab: wet wash, don't stir. Warm grit vs dusty brown.

Dual advice: if Raw Sienna + Burnt Sienna already cover warm land, Desert Brown is optional climate character. Keep when the swatch is clearly sandier/dustier than your siennas.`,
    ace_history: `Desert is Horadam climate poetry. The current recipe is cadmium red, Mars black, and zircon yellow — not a single Sahara mine, and not nickel azo.`,
  },
  "sch-924-desert-green": {
    temp_role:
      "Warm-dust olive · Cadmium red + cobalt chromite · Desert climate · not phthalo-earth",
    ace_note: `Dry sage desert green — southwestern dust.

Code 924 is the Desert Supergranulating line. Official PR108 + PG26. That is a granulating red married to cobalt chromite — the same PG26 as your Cobalt Deep half-pan. Not PG7+PBr7. Supergranulating needs two granulating minerals; phthalo cannot play.

Sage, dust, khaki that splits. The red grit is why a "green" can flash warm — and why the handling light is high (cadmium grain). Same climate family as Glacier / Shire / Deep Sea — different marriage.

Play lab: Wet wash, don't stir. If you see warm grit vs muted green, the catalog earth-olive is dead.

Dual advice: one Desert-green / red+PG26 seat. vs 534 olive: smooth orange+phthalo hedge. vs Shire Olive: yellow+cerulean meadow. vs Cobalt Deep: that is the single mutter; this is the mutter plus a red argument. Cadmium grain + cobalt: wash hands thoroughly; don't spray.`,
    ace_history: `Desert is Schmincke climate poetry for scrub and dust. PG26 is the 19th-century cobalt-chromite green we already taught. PR108 is the granulating red half — index, not a fire-engine seat we keep.`,
  },
  "sch-hp-naples-yellow": {
    temp_role:
      "Soft chalky warm yellow · White + nickel titanate + chrome titanate · skin, stucco, haze",
    ace_note: `Soft, chalky warmth — not a screaming yellow. Skin tones, faded walls, that hazy Mediterranean afternoon.

Official Horadam 229 is PW6 + PY53 + PBr24 (titanium white + nickel titanate + chrome-antimony titanate). Catalog PY216/PY40 and code 319 were wrong. Naples is a corrector and atmosphere, not a mixing primary. With blue it dies into soft dirt faster than Hansa — that's the feature for quiet neutrals.

Dual advice: one Naples seat among Schmincke 229 / reddish 230 / MaimeriBlu 104. Standard = classic pale; reddish = peach bias. Don't use Naples when you needed lemon for clean greens.`,
    ace_history: `Historic Naples was lead antimonate on Roman and Renaissance walls. Modern Horadam chases the chalk with white plus nickel titanate plus chrome titanate — no lead, no aureolin. Giallo di Napoli for flesh and soft light.`,
  },
  "wn-389-scarlet-mist": {
    temp_role:
      "Warm scarlet mist · Cobalt green + naphthol scarlet · wet-on-wet florals",
    ace_note: `White Nights Scarlet Mist — full pan from St. Petersburg.

Official PG19 + PR188 (cobalt green + naphthol scarlet). That's the split: scarlet sparks, cooler green mineral trails. Don't over-stir; let florals render themselves. Effect pan, not your only warm red primary.

Dual advice: weather/floral effect seat with Purple Mist / Rose Mist cousins. One scarlet mist. Keep PR254 or PR255 for clean fire without multi-pigment gossip.`,
    ace_history: `Scarlet Mist is White Nights' granulating mist line — cobalt green sediment plus a scarlet organic. Wet-on-wet florals where the split does the rendering.`,
  },
  "wn-571": {
    temp_role:
      "Cool mystery blue · Manganese + ultramarine + phthalo green · triple-pigment night",
    ace_note: `Blue Mystery — limited Metamorphoses granulating blue.

Official PV16 + PB29 + PG7 (manganese violet + ultramarine + phthalo green). Not a cobalt–ultramarine duet. Three bosses: mineral grit, ultra bloom, phthalo stain. Night seas, icy contours, pours that surprise you.

Dual advice: character blend, not your only blue. If Ultramarine + a phthalo already cover sky stories, Mystery is optional romance. Keep when the triple-pigment swatch makes you paint night on purpose.`,
    ace_history: `Nevskaya's Mystery collection is triple-pigment granulation theater. Blue Mystery is manganese, ultramarine, and phthalo green — a trio, not a cobalt duet.`,
  },
  "wn-531": {
    temp_role:
      "Cool milky turquoise · Genuine cobalt (PB28) · gem-tone sky accent",
    ace_note: `Cobalt turquoise — milky gem-tone sky accents.

Official Nevskaya listing is PB28 (cobalt aluminate), not PB36. Still true cobalt, not phthalo: softer, milkier, more enamel / botanical miniature sky than plastic lagoon. Won't mix like PB16.

Dual advice: if you love mineral skies and hate phthalo's grip, this is your blue-green seat — demote Helio/MG. If you paint bold tropical water weekly, cobalt may feel shy; keep phthalo turquoise instead. Don't need both unless swatches break your heart differently.`,
    ace_history: `White Nights 531 is cobalt aluminate sold as turquoise — mineral family, not phthalo lagoon. St. Petersburg full pan = generous milky accent.`,
  },
  "ds-152-rose-deep-gold": {
    temp_role:
      "Warm transparent gold-orange · Quin PO48 + nickel azo PY150 · honey-sunset glaze",
    ace_note: `Quinacridone Deep Gold — sunsets and honey-orange light.

DS SKU 152 is PO48 + PY150 (quin gold orange + nickel azo), not nickel alone. Studio had it as Rose Deep Gold / PY150. Glaze sunsets, tea, skin warmth; the quin half is more burnt-orange than Cider's straight nickel gold.

Dual advice: one quin-deep-gold seat. vs Hot Mulled Cider (PY150 holiday gold): faucet vs costume, not two roles if the swatch is the same gold. vs Indian Yellow / Quin Gold: pick the warm transparent gold you actually reach for.`,
    ace_history: `Quinacridone Deep Gold is DS's ruddy golden-orange — quin PO48 plus nickel azo, a transparent alternative to burnt sienna's dirt. Nickel is why the handling light stays medium.`,
  },
  "sch-953-deep-sea-blue": {
    temp_role:
      "Cool marine mix · Ultramarine + cobalt teal + strontium-violet hue · Deep Sea current",
    ace_note: `Deep Sea Blue brings marine energy to the tin — worth knowing by the split, not just by pretty swatch.

Official 953 is PB29 + PG50 + PV62 (ultramarine + cobalt teal titanate + strontium-violet hue). Not a single-pigment ultra, and not PV16. Sediment reads as current: blue, teal grit, violet hush.

Play lab (granulation): sample twin of the 5ml tube. Wet paper, drop, tip once; don't stir into poster navy. One faucet with the tube.

Dual advice: tube + 2ml = one color. vs DS French: classical sky grit vs Deep Sea submarine mix — one granulating ultramarine-family well is enough for most tins.`,
    ace_history: `Deep Sea Supergranulating dresses ultramarine in a cobalt-teal and violet-hue marriage — church blue in a diving suit, three minerals.`,
  },
  "sch-tube-953-deep-sea-blue": {
    temp_role:
      "Cool marine mix · Ultramarine + cobalt teal + strontium-violet hue · Deep Sea current",
    ace_note: `Schmincke Deep Sea Blue — granulating marine mix.

Official PB29 + PG50 + PV62. Wet the paper, drop for body, leave edges alone; tickle, don't scrub. Granulation reads as current, not flat poster navy.

Dual advice: vs DS French: both lean on ultramarine grit — Deep Sea is the marine mix, French is the classical sky cut. One granulating ultramarine-family well + one abyss indigo is stronger than two mid ultramarines.`,
    ace_history: `Deep Sea 953: ultramarine, cobalt teal titanate, strontium-violet hue. Submarine theater, not PV16 leftover.`,
  },
  "sch-tube-962-glacier-turquoise": {
    temp_role:
      "Cool ice lagoon · Cobalt titanate + strontium-violet hue · Glacier mineral teal",
    ace_note: `Schmincke Glacier Turquoise — ice lagoon, not phthalo dye.

Official 962 is PG50 + PV62 (cobalt titanate green + strontium-violet hue), not PB16 and not PV16. Mineral teal that flocks; the violet is a hue, not metal cobalt.

Play lab (granulation): juicy wash on texture; shoreline with a warm sand if you want shallow-water grit. Don't use it as your only blue for violets — teal will pull green.

Dual advice: same turquoise-hue seat as W&N Phthalo Turquoise (smoother/staining dye vs this mineral). One tropical well.`,
    ace_history: `Glacier turquoise is cobalt titanate plus a strontium-violet hue — ice-name mineral lagoon, not phthalo PB16.`,
  },
  "sch-tube-955-deep-sea-black": {
    temp_role:
      "Near-black abyss · Cerulean + cobalt blue deep + Mars black · Deep Sea sediment",
    ace_note: `Schmincke Deep Sea Black — granulating trench dark.

Official 955 is PB35 + PB74 + PBk11 (cerulean + cobalt blue deep + Mars black). Cobalt blues in the dark, not manganese. Night water under Deep Sea Blue/Indigo. Tilt, don't scrub. One squeeze kills a sky if you're careless.

Dual advice: Deep Sea / Galaxy / Glacier blacks share one specialty granulating black seat with Black Mystery pan. Pick the series mood; don't own three abyss tubes for science.`,
    ace_history: `Deep Sea black is two cobalt blues plus Mars black — submarine dark, not bone black with a manganese whisper.`,
  },
  "sch-tube-965-glacier-black": {
    temp_role:
      "Near-black ice · Mars black + cerulean · granulating cold dark",
    ace_note: `Schmincke Glacier Black — granulating ice-dark.

Official 965 is PBk11 + PB35 (Mars black + cerulean), not bone black. Cold dark with cobalt-blue grit for ice shadows, stone, winter trees. Texture without Galaxy's ultra flocks.

Dual advice: third costume of the specialty-black seat. vs Ivory Black half-pan: Ivory is denser travel black; Glacier is tube grit.`,
    ace_history: `Glacier black is Mars black plus cerulean — ice-name marketing, cobalt grain in the dark.`,
  },
  "mg-109-indian-yellow": {
    ace_note: `M. Graham Indian Yellow — honey base, 2ml sample. Blooms on wet paper if you lean in.

Warm transparent gold for autumn, skin warmth, and glowing underlayers — not the infamous historic cow-mango legend as literal chemistry. PY83 diarylide/modern organic gold-yellow does the transparent warm job. Honey blooms if you feed water. Cousin mood to quin gold / cider / quin deep gold — one warm transparent gold seat is enough for most kits.

Dual advice: vs W&N Quinacridone Gold and Hot Mulled Cider: manners and undertone contest, not three wells. Vs cool Hansa: different job entirely.`,
  },
  "sch-fp-495-ultramarine-violet": {
    ace_note: `Mineral violet with ultramarine grit — florals, dusk, and soft cool shadows.

Play lab (granulation): PV15 + PB29 — purple sibling of ultramarine blue with flock and soft lift. Wet cold-press for mineral dusk; florals that want texture not stain-tyranny. Less staining drama than quin violets.

Dual advice: one granulating ultramarine-violet seat. vs RS Mineral Violet (PB29/PV19): ultra+quin mix vs this PV15 grit. vs Tundra (ultra+Mars brown climate): different job. Vs quin PV19: mineral grit vs organic stain.`,
  },
};

const p = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));
let nField = 0;
let nEssay = 0;
const missing = [];
for (const id of [...Object.keys(fields), ...Object.keys(essay)]) {
  if (!p.colors.some((c) => c.id === id)) missing.push(id);
}
if (missing.length) {
  console.error("Missing:", [...new Set(missing)].join(", "));
  process.exit(1);
}

p.colors = p.colors.map((c) => {
  let next = { ...c };
  if (fields[c.id]) {
    nField++;
    next = { ...next, ...fields[c.id] };
  }
  if (essay[c.id]) {
    nEssay++;
    next = { ...next, ...essay[c.id] };
  }
  if (next.toxicity === "low") {
    delete next.toxicity_habit;
  }
  return next;
});

p.updated = "2026-09-10-medium-tox-audit";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("field updates", nField, "essay patches", nEssay);

const expect = {
  "rosa-748": ["PR101/PW6", "low"],
  "rosa-745": ["PY42/PW6", "low"],
  "mg-019-cobalt-yellow": ["PY184", "low"],
  "rs-334": ["PB29/PV19", "low"],
  "sch-972-starry-purple": ["PB29/PR233", "low"],
  "sch-tube-975-galaxy-black": ["PB29/PBk11", "low"],
  "sch-983-tundra-violet": ["PB29/PBr6", "low"],
  "sch-931-shire-yellow": ["PY159/PV62", "low"],
  "sch-952-deep-sea-indigo": ["PV62/PG18", "low"],
  "sch-tube-951-deep-sea-violet": ["PB29/PBr33", "low"],
  "sch-923-desert-brown": ["PR108/PBk11/PY159", "high"],
  "sch-924-desert-green": ["PR108/PG26", "high"],
  "sch-hp-naples-yellow": ["PW6/PY53/PBr24", "medium"],
  "wn-389-scarlet-mist": ["PG19/PR188", "medium"],
  "wn-571": ["PV16/PB29/PG7", "medium"],
  "wn-531": ["PB28", "medium"],
  "ds-152-rose-deep-gold": ["PO48/PY150", "medium"],
  "sch-953-deep-sea-blue": ["PB29/PG50/PV62", "medium"],
  "sch-tube-962-glacier-turquoise": ["PG50/PV62", "medium"],
  "sch-tube-955-deep-sea-black": ["PB35/PB74/PBk11", "medium"],
  "sch-hp-cobalt-green-dark": ["PG26", "medium"],
};

let bad = 0;
for (const [id, [pig, tox]] of Object.entries(expect)) {
  const c = p.colors.find((x) => x.id === id);
  const ok = c.pigment === pig && c.toxicity === tox;
  if (!ok) {
    bad++;
    console.log("FAIL", id, c.pigment, c.toxicity, "want", pig, tox);
  }
}
const counts = { low: 0, medium: 0, high: 0 };
for (const c of p.colors) counts[c.toxicity || "low"]++;
console.log("toxicity counts", counts);
if (bad) process.exit(1);
console.log("ok");
