/**
 * Catalog audit v145: official-site pigment / toxicity / notes
 * for leftover Supergranulating, PrimaTek, and check-the-tube colors.
 * Dual essays rewritten only where they stated a false recipe.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const COBALT =
  "Contains cobalt — wash hands after painting; keep food and drink off the palette.";
const NICKEL =
  "Contains nickel (azo/titanate) — wash hands after painting; keep food and drink off the palette.";
const COBALT_CD =
  "Contains cobalt (and a cadmium red grain in the Supergranulating mix) — wash hands; keep food and drink off the palette.";

const fields = {
  "qor-sap-green": {
    pigment: "PR101/PY150/PG36",
    toxicity: "medium",
    toxicity_habit: NICKEL,
    notes:
      "QoR Sap Green. Golden official: PR101 + PY150 + PG36 (not catalog PG7/PY150). Nickel in PY150.",
  },
  "wn-tube-terre-verte": {
    pigment: "PG23/PB28",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "W&N Professional Terre Verte 637. Official pigment code PB28 + PG23. WN states PG18 will be removed; older tubes may still list PG18.",
  },
  "ds-128-prussian-green": {
    pigment: "PB27/PY97",
    notes:
      "DANIEL SMITH Prussian Green SKU 128. Official color story PB27 + PY97 (Hansa). Not PG7.",
  },
  "sch-931-shire-yellow": {
    pigment: "PY159/PV62",
    granulating: true,
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 931 Shire Yellow. Official PY159 + PV62 (not PY53).",
  },
  "sch-923-desert-brown": {
    pigment: "PY150/PR108/PBk11",
    granulating: true,
    toxicity: "medium",
    toxicity_habit: NICKEL,
    notes:
      "Horadam Supergranulating 923 Desert Brown. Official PY150 + PR108 + PBk11 (not PBr7).",
  },
  "sch-924-desert-green": {
    toxicity: "medium",
    toxicity_habit: COBALT_CD,
  },
  "sch-932-shire-olive": {
    toxicity: "medium",
    toxicity_habit: COBALT,
  },
  "sch-952-deep-sea-indigo": {
    pigment: "PV62/PG18",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 952 Deep Sea Indigo. Official PV62 + PG18 (not PB60/PG7). Pan + tube records.",
  },
  "sch-tube-952-deep-sea-indigo": {
    pigment: "PV62/PG18",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 952 Deep Sea Indigo. Official PV62 + PG18 (not PB60/PG7).",
  },
  "sch-953-deep-sea-blue": {
    pigment: "PB29/PG50/PV16",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 953 Deep Sea Blue. Official-style listing PB29 + PG50 + PV16 (not PB29 alone).",
  },
  "sch-tube-953-deep-sea-blue": {
    pigment: "PB29/PG50/PV16",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 953 Deep Sea Blue. PB29 + PG50 + PV16.",
  },
  "sch-tube-954-deep-sea-green": {
    toxicity: "low",
    notes:
      "Horadam Supergranulating 954 Deep Sea Green. Official PG18 + PB29. Chromium hydrate + ultramarine.",
  },
  "sch-964-glacier-brown": {
    pigment: "PBr6/PG26",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 964 Glacier Brown. Official PBr6 + PG26 (not PBr7/PW6).",
  },
  "sch-tube-964-glacier-brown": {
    pigment: "PBr6/PG26",
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 964 Glacier Brown. Official PBr6 + PG26 (not PBr7/PW6).",
  },
  "sch-tube-961-glacier-blue": {
    pigment: "PB29/PG50",
    granulating: true,
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 961 Glacier Blue. Official PB29 + PG50 (not PB15).",
  },
  "sch-tube-962-glacier-turquoise": {
    pigment: "PG50/PV16",
    granulating: true,
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 962 Glacier Turquoise. Official PG50 + PV16 (not PB16).",
  },
  "sch-tube-965-glacier-black": {
    pigment: "PBk11/PB35",
    granulating: true,
    toxicity: "medium",
    toxicity_habit: COBALT,
    notes:
      "Horadam Supergranulating 965 Glacier Black. Official PBk11 + PB35 (not PBk7).",
  },
  "ds-143-minnesota-pipestone": {
    pigment: "Genuine Minnesota Pipestone",
    notes:
      "PrimaTek Minnesota Pipestone Genuine. Official: genuine pipestone (not a Mars-red PR101 seat).",
  },
  "ds-162-tigers-eye": {
    pigment: "Genuine Tiger's Eye",
    notes:
      "PrimaTek Tiger's Eye Genuine SKU 162. Official: genuine tiger's-eye mineral (not PBr7 earth).",
  },
  "ds-167-rhodonite": {
    pigment: "Genuine Rhodonite",
    notes:
      "PrimaTek Rhodonite Genuine SKU 167. Official: genuine rhodonite (not PR101).",
  },
  "ds-189-chromium-red-mica": {
    pigment: "Genuine Red Fuchsite",
    notes:
      "PrimaTek Red Fuchsite Genuine SKU 189 (studio Chromium Red Mica). Official genuine chrome mica, not PR101/PW20.",
  },
  "ds-205-almandite": {
    pigment: "Genuine Garnet",
    notes:
      "PrimaTek Garnet Genuine SKU 205 (studio Almandite). Official genuine garnet, not PR101.",
  },
  "ds-164-hematite-violet": {
    pigment: "Genuine Hematite",
    notes:
      "PrimaTek Hematite Violet Genuine SKU 164. Official: milled hematite (not PBk11/PV19 soup).",
  },
  "ds-196-blue-apatite": {
    pigment: "Genuine Blue Apatite",
    notes:
      "PrimaTek Blue Apatite Genuine SKU 196. Official genuine apatite (catalog PB15/PG7 was an enrich guess).",
  },
};

const essay = {
  "qor-sap-green": {
    temp_role:
      "Warm gold-leaf sap · Nickel azo + yellow-shade phthalo + iron oxide · not May lemon",
    ace_note: `Foliage convenience green — lively mid leaves.

Your Q1 was: Phthalo + turquoise = icy trap; sap is the ready warm leaf so you don't remix every time. This tube is that answer. May Green is not that answer — May is first-leaf, lemon, April. Sap is tree-juice: warmer, a little dirtier, mid-summer hedge.

Golden's official QoR listing is PR101 + PY150 + PG36 (iron oxide + nickel azo + yellow-shade phthalo). Catalog PG7/PY150 was incomplete. The gold is nickel — wash hands. Aquazol is not gum: high chroma, can dry a bit hard-edged.

Play lab (May vs Sap): Same water, this beside any May pan. Sap should go gold-moss; May should go lime. If they match, you don't need both convenience greens.

Dual advice: one gold-sap seat. Not a fourth May. vs 534 olive: factory hedge is orange + phthalo; sap is gold + phthalo + a little iron. vs Undersea: Sap should stay married; Undersea is supposed to divorce.`,
    ace_history: `Medieval sap green was buckthorn-berry lake — gorgeous and fugitive. QoR's modern sap is Golden's Aquazol cut: nickel azo gold, yellow-shade phthalo, and a red iron oxide. Not a single historic juice.`,
  },
  "wn-tube-terre-verte": {
    temp_role:
      "Muted clay-green · Green earth + cobalt (PG23/PB28) · verdaccio mixer · weak on purpose",
    ace_note: `Soft mineral green — underpainting and quiet foliage.

This is the opposite of Phthalo. W&N official code is PG23 + PB28 (green earth + cobalt blue). They state PG18 (viridian) will be removed; older tubes may still list it. So this is a boosted earth, not peasant clay alone. Still weak on purpose. Renaissance verdaccio: a green veil under flesh. It will lose every fight with PG7.

Play lab: A wash that looks like nothing. Glaze a warm flesh, ochre, or Potter's Pink over it. If the passage goes dusty-alive, you understood verdaccio.

Dual advice: one green-earth seat. Not a foliage mixer. Not sap. Cobalt in PB28: wash hands. Rare Green Earth (DS 181) is the iron-oxide cousin.`,
    ace_history: `Among the oldest greens still sold. W&N's current Professional tube is green earth plus cobalt (and, for now, maybe a last of viridian). Weakness is still the point.`,
  },
  "ds-128-prussian-green": {
    temp_role:
      "Cool teal-night · Prussian blue + Hansa (PB27/PY97) · historical convenience · not Helio",
    ace_note: `Deep teal-green — dark foliage and ink-like greens.

DS official color story: PB27 + PY97 (Prussian blue + Hansa yellow medium). Catalog PG7/PB27 was the enrich guess. Historical Prussian green is iron-blue plus a yellow until it goes spruce — not Helio sun (PG36).

You already have dusk-teal as Sen Deep (two phthalos) and Deep Sea (viridian+ultramarine). This sample is the iron-blue version.

Play lab: Beside Helio 514 and Sen 807. Prussian should go duskier, more blue-black.

Dual advice: one Prussian-green / iron-blue-teal seat. Helio stays the yellow-shade engine. Sen Deep stays dye-teal. Deep Sea stays mineral weather.`,
    ace_history: `Diesbach, 1704, Berlin: Prussian blue. Painters stirred in a yellow and called it Prussian green. DS's current yellow is Hansa PY97.`,
  },
  "sch-964-glacier-brown": {
    temp_role:
      "Warm mineral brown · Mars brown + cobalt chromite · Glacier climate · not milky earth",
    ace_note: `Cool taupe brown — glacial moraine stone.

Correction: this is not PBr7 + titanium white. Supergranulating 964 is PBr6 (Mars brown) + PG26 (cobalt chromite) — two granulating minerals. Catalog PBr7/PW6 was the "Glacier = dirt + milk" guess we already killed on Glacier Green. No white in the official line. The mist is sediment, not PW6.

Dual advice: tube + 2ml = one Glacier-brown seat. vs Hermit Mist (if that one is actually white+earth): different recipe. vs burnt sienna / raw umber: those are mixing browns; this is climate weather. Cobalt: wash hands.`,
    ace_history: `Schmincke Glacier line: two granulating Horadam pigments. Brown is roasted iron (PBr6) plus the same PG26 as Cobalt Deep. Not milk.`,
  },
  "sch-tube-964-glacier-brown": {
    temp_role:
      "Warm mineral brown · Mars brown + cobalt chromite · Glacier climate · not milky earth",
    ace_note: `Schmincke Glacier Brown — Jul 7 batch. Same well as the 2ml.

Not PW6. Official PBr6 + PG26. Fog is mineral split, not titanium milk. One seat with the sample.

Dual advice: one mist-mineral brown. Don't use it where you wanted burnt sienna depth or raw umber pine.`,
    ace_history: `Same Glacier Brown sermon as the sample: Mars brown + cobalt chromite, Supergranulating 964.`,
  },
  "sch-952-deep-sea-indigo": {
    temp_role:
      "Cool abyss teal-navy · Cobalt violet hue + viridian · Deep Sea climate · not phthalo",
    ace_note: `Deep diving blue-green — night water and whale shadows.

Catalog PB60/PG7 was the enrich lie (phthalo cannot supergranulate). Official 952 is PV62 + PG18 — cobalt-violet hue plus viridian. Green-black flocks are chromium grit, not PG7 stain.

Play lab: rough cold-press, charge into still-wet Deep Sea Blue. Don't stir the abyss into soup.

Dual advice: one Deep Sea Indigo (pan + tube = one well). vs half-pan Indigo (PB60): different molecule. vs Prussian Green: iron-blue + hansa, not viridian weather.`,
    ace_history: `Deep Sea Supergranulating: viridian + a cobalt-violet hue, not indanthrene + phthalo. Jane and artist-pigment charts agree PV62/PG18.`,
  },
  "sch-tube-952-deep-sea-indigo": {
    ace_note: `Schmincke Deep Sea Indigo — Jul 7 batch. Same well as the pan.

Official PV62 + PG18, not PB60/PG7. One abyss seat.

Dual advice: pan SKU + tube SKU = one color.`,
    ace_history: `Same 952 Supergranulating story — viridian + cobalt-violet hue.`,
  },
  "sch-931-shire-yellow": {
    temp_role:
      "Cool pastoral yellow-green · PY159 + cobalt-violet hue · Shire climate · not nickel titanate",
    ace_note: `Shire sunshine — warm pastoral yellow, Hobbit-core meadows.

Not PY53. Official Supergranulating 931 is PY159 (zirconium-praseodymium yellow) + PV62. Tube readers and Jackson's Shire notes agree. Blue-violet grit in a yellow well — that's why it granulates and leans green.

Play lab: tilt, don't over-stir. With phthalo green it still makes spring; the point is the sediment.

Dual advice: specialty granulating yellow — not a lemon/mid primary replacement. Same Shire family as Shire Olive (PY159+PB35).`,
    ace_history: `Every Shire color is built on PY159. Yellow + a cobalt-violet hue is the meadow light, not nickel-titanate Naples.`,
  },
};

const p = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));
let nField = 0;
let nEssay = 0;
const missing = [];
for (const id of [...Object.keys(fields), ...Object.keys(essay)]) {
  if (!p.colors.some((c) => c.id === id)) missing.push(id);
}
p.colors = p.colors.map((c) => {
  let next = c;
  if (fields[c.id]) {
    nField++;
    next = { ...next, ...fields[c.id] };
  }
  if (essay[c.id]) {
    nEssay++;
    next = { ...next, ...essay[c.id] };
  }
  return next;
});
if (missing.length) {
  console.error("Missing:", [...new Set(missing)].join(", "));
  process.exit(1);
}

p.updated = new Date().toISOString().slice(0, 10) + "-catalog-audit";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("field updates", nField, "essay patches", nEssay);

const check = [
  "qor-sap-green",
  "wn-tube-terre-verte",
  "ds-128-prussian-green",
  "sch-964-glacier-brown",
  "sch-952-deep-sea-indigo",
  "sch-931-shire-yellow",
  "sch-924-desert-green",
  "ds-189-chromium-red-mica",
];
for (const id of check) {
  const c = p.colors.find((x) => x.id === id);
  console.log(id, c.pigment, "tox=" + c.toxicity);
}
