/**
 * Apply handwritten green · last seven 2ml samples
 * Desktop green-2ml-rest-draft.md — closes green Dual 39/39
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-924-desert-green": {
    pigment: "PR108/PG26",
    granulating: true,
    notes:
      "Horadam Supergranulating 924 Desert Green. Official PR108 + PG26 (not PG7/PBr7).",
    temp_role:
      "Warm-dust olive · Granulating red + cobalt chromite · Desert climate · not phthalo-earth",
    ace_note: `Dry sage desert green — southwestern dust.

Code 924 is the Desert Supergranulating line. Official PR108 + PG26. That is a granulating red married to cobalt chromite — the same PG26 as your Cobalt Deep half-pan. Not PG7+PBr7 (that was the "phthalo stained with dirt" guess). Supergranulating needs two granulating minerals; phthalo cannot play.

Sage, dust, khaki that splits. The red grit is why a "green" can flash warm. Same climate family as Glacier / Shire / Deep Sea — different marriage (desert, not ice or meadow).

Play lab: Wet wash, don't stir. If you see warm grit vs muted green, the catalog earth-olive is dead.

Dual advice: one Desert-green / red+PG26 seat. vs 534 olive: smooth orange+phthalo hedge. vs Shire Olive: yellow+cerulean meadow. vs Cobalt Deep: that is the single mutter; this is the mutter plus a red argument. Cobalt: wash hands.`,
    ace_history: `Desert is Schmincke climate poetry for scrub and dust. PG26 is the 19th-century cobalt-chromite green we already taught. PR108 is the granulating red half — index, not a fire-engine seat we keep. Catalog heard "olive" and typed PG7/PBr7.`,
  },
  "ds-027-light-cobalt-green": {
    pigment: "PG19",
    notes:
      "DANIEL SMITH Cobalt Green Pale SKU 027. Official PG19 (not PG7/PB36). Studio label Light Cobalt Green.",
    temp_role:
      "Soft mineral teal · Cobalt zinc green (PG19 / Cobalt Green Pale) · glaze · not phthalo",
    ace_note: `Soft cobalt green — skies and sea glass without phthalo aggression.

SKU 027 is DS Cobalt Green Pale, pigment PG19 (cobalt-zinc oxide). Studio "Light Cobalt Green" is a fair translation. Catalog PG7/PB36 is phthalo wearing a cobalt name — the same lie we already stuck on Light Cobalt vs Cobalt Deep.

PG19 is weak, often granulating, a bit gummy in some DS batches, liftable. Sea-glass, distant hill, glaze. It will lose to PG7 every time. Toxicity medium — cobalt. Not Amazonite (feldspar teal). Not Mint (milk+phthalo).

Play lab: Beside Cobalt Deep (PG26) and Amazonite. Pale should be softer, more blue-green glass. If it stains like phthalo, the sample isn't PG19.

Dual advice: one PG19 / cobalt-pale seat. vs PG26: deeper mutter vs pale glass. vs PG50 (inside Glacier): teal titanate vs this zinc-cobalt. One quiet cobalt-green in a small tin.`,
    ace_history: `Cobalt greens (Rinmann and later zinc/cobalt oxides) were 18th–19th century "permanent green that isn't arsenic." PG19 is the pale zinc-cobalt cut. Unfashionable after 1935. Still the right well when phthalo would vandalize a sky.`,
  },
  "ds-128-prussian-green": {
    notes:
      "DANIEL SMITH Prussian Green SKU 128. Catalog PG7/PB27; DS story starts PB27 + a yellow. Historical Prussian-green memory.",
    temp_role:
      "Cool teal-night · Prussian blue + yellow · historical convenience · not Helio",
    ace_note: `Deep teal-green — dark foliage and ink-like greens.

This is the 528 story we already told when 514 turned out to be Helio. "Prussian green" is a memory: 1704 iron-blue (PB27) mixed with a yellow until it goes spruce. Catalog wrote PG7/PB27. DS's own line starts PB27 and a yellow (listings disagree which yellow). Either way the idea is iron-blue night, not Helio sun (PG36).

You already have dusk-teal as Sen Deep (two phthalos) and Deep Sea (viridian+ultramarine). This sample is the iron-blue version — more ink, more 18th-century, less climate theatre.

Play lab: Beside Helio 514 and Sen 807. Prussian should go duskier, more blue-black. If it matches Helio, you have the wrong pan in the hole.

Dual advice: one Prussian-green / iron-blue-teal seat. Helio stays the yellow-shade engine. Sen Deep stays dye-teal. Deep Sea stays mineral weather. This is the Berlin convenience.`,
    ace_history: `Diesbach, 1704, Berlin: Prussian blue. Painters stirred in gamboge or ochre and called it Prussian green. Every factory that prints the name is selling that memory. Trust the swatch and PB27, not the word green alone.`,
  },
  "ds-181-rare-earth-green": {
    pigment: "Natural iron oxides",
    notes:
      "DANIEL SMITH Rare Green Earth SKU 181. Natural iron oxides (not PG7/PBr7). Studio label Rare Earth Green.",
    temp_role:
      "Muted distant evergreen · Green earth / iron oxides · atmosphere · not phthalo-earth olive",
    ace_note: `Muted mineral green — subtle, not screaming phthalo.

SKU 181 is DS Rare Green Earth. Official pigment line: natural iron oxides. Grey-green, hint of blue, distant evergreens and atmospheric shadow. Pompeii-to-Rome earth, not PG7+PBr7.

This is the terre verte aisle. You already starred W&N Terre Verte (PG23, maybe boosted). Rare Green Earth is DS's iron-oxide cut — often a little greyer, good for far hills. DS even pitches it with Rhodonite into soft purples — it will go dusty-violet with a pink stone.

Play lab: Beside Terre Verte. If this is greyer/weaker, that's the earth. If it stains like phthalo, the catalog lie won the sample.

Dual advice: one green-earth seat — W&N Terre Verte or this. vs Desert Green: that is PG26+red climate. vs Apatite: phosphate mineral that splits brown/green. This is quiet iron.`,
    ace_history: `Green earths are among the oldest landscape shadows. DS named this one "rare" and milled iron oxides for distance, not for a mixing engine. The PG7 sermon in the old history was copy-paste. Retired.`,
  },
  "ds-194-perylene-green": {
    pigment: "PBk31",
    staining: true,
    notes:
      "DANIEL SMITH Perylene Green SKU 194. Official PBk31 (not PG36). Twin of Schmincke 784.",
    temp_role:
      "Near-black foliage · Perylene black (PBk31) · botanical night · same seat as the pan",
    ace_note: `Dark perylene green — deep transparent foliage shadows.

SKU 194 is PBk31. We already wrote this soul on Schmincke 784. Catalog PG36 was Helio's index glued to a dark green name — the same class of lie as "Carnelian = Mayan." It is a black that looks green. Masstone near-ink; tints dull sap. Not yellow-shade phthalo.

Dual advice: one PBk31. Half-pan/full-pan or this 2ml try-on. Don't buy a 15ml unless the pan runs out. vs Prussian Green: iron-blue teal vs sooty botanical black.`,
    ace_history: `BASF perylene green-black, 1990s watercolor. Chemists filed a black; painters needed a cypress. Helio (PG36) is the sun. This is the night.`,
  },
  "mg-125-olive-green": {
    temp_role:
      "Warm-leaning spring-olive · PG7 + arylide lemon · honey May · not 534",
    ace_note: `M. Graham Olive Green — honey base, 2ml sample. Blooms on wet paper if you lean in.

PG7+PY3 is May / Grass / Sen 817. Graham put "Olive" on a spring-leaf recipe. Honey makes it bloom on wet paper — that's brand, not a new olive theology. Not 534 (orange+phthalo). Not Shire (yellow+blue on paper).

Dual advice: one leaf seat. This sample is honey manners try-on. If you already kept a May pan, don't promote the 15ml.`,
    ace_history: `American "olive green" on a honey tube is often just phthalo + cool yellow. The word olive does a lot of unpaid work.`,
  },
  "mg-130-permanent-green-light": {
    temp_role:
      "Cool bright mixing green · PG7 · honey engine sample · not a new light green",
    ace_note: `M. Graham Permanent Green Light — honey base, 2ml sample. Blooms on wet paper if you lean in.

Single PG7. "Permanent Green Light" is a convenience name for the engine leaning bright. You already have Graham 150 as the 15ml barrel. This 2ml is a second faucet of the same molecule — or a slightly lighter grind/load. Not Helio. Not May.

Dual advice: folds into one PG7. If 150 is already the honey barrel, this sample is spare.`,
    ace_history: `Same 1935 Monastral green, honey slip. "Permanent green" in 20th-century catalogs usually means phthalo, sometimes plus a yellow. Light = they didn't add the yellow.`,
  },
};

const p = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));
let nUp = 0;
const missing = [];
for (const id of Object.keys(updates)) {
  if (!p.colors.some((c) => c.id === id)) missing.push(id);
}
p.colors = p.colors.map((c) => {
  if (updates[c.id]) {
    nUp++;
    return { ...c, ...updates[c.id] };
  }
  return c;
});
if (missing.length) {
  console.error("Missing:", missing.join(", "));
  process.exit(1);
}
if (nUp !== 7) {
  console.error("count", nUp);
  process.exit(1);
}

const greens = p.colors.filter((c) => c.family === "green");
const dual = greens.filter((c) => (c.ace_note || "").includes("Dual advice"));
const left = greens.filter((c) => !(c.ace_note || "").includes("Dual advice"));
console.log(`Green Dual advice: ${dual.length} / ${greens.length}`);
console.log("still open:", left.map((c) => c.id).join(", ") || "none");

p.updated = new Date().toISOString().slice(0, 10) + "-green-2ml-rest-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("Green last 2ml applied:", nUp);
