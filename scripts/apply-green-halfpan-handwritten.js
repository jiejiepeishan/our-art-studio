/**
 * Apply handwritten green · half-pan cards
 * (Desktop green-halfpan-draft.md).
 *
 * - 5 cards (Phthalo, May, Cobalt Deep, Perylene, Helio)
 * - 514 display → Helio Green / 日光绿, pigment PG36
 * - Delete ghost olive sch-hp-permanent-green-olive (old 575)
 * - Merge half-pan into sch-fp-534 (PO62/PG7, half-pan · full pan)
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");
const DELETE_ID = "sch-hp-permanent-green-olive";
const OLIVE_KEEP = "sch-fp-534-permanent-green-olive";

const updates = {
  "sch-hp-phthalo-green": {
    temp_role:
      "Cool staining mixing green · Chlorinated copper phthalocyanine (PG7) · engine, not foliage · ◈",
    ace_note: `A tiny squeeze goes a mile. Staining, transparent, powerful — respect the ratio or it will eat your whole painting.

This is the engine, not the tree. PG7 is blue-shade phthalo: 1930s industrial dye (copper phthalocyanine fully chlorinated — cousin of phthalo blue PB15, twin of yellow-shade PG36 Helio). Transparent, ferociously staining, almost no granulation. One touch into a cool yellow = vivid leaf. One blob unattended = alien slime that will not lift.

Why it exists: viridian (PG18) was the old transparent green — gentler, granulating, Sargent's parasol. Phthalo replaced it because it is darker, louder, cheaper to mix with. It does not behave like viridian. You already own Emerald Green full pan (PG18) for that historical job. Don't make this pan pretend to be that.

It is also the green half of the complementary pair with pyrrol/scarlet: high-chroma opposite, not a foliage crayon.

Play lab (staining): One rice-grain on a wet mid wash. Don't stir the puddle — charge the edge. Watch how far the stain walks. Lights first; this will not lift like cobalt.

Dual advice: one PG7 well. Tube twins: Schmincke 519, M. Graham Phthalo Green, W&N Winsor Green (Blue Shade), Sennelier Emerald (PG7 — the name lies). Sennelier Phthalo Green Deep (PG7+PB15:3) is a teal relative, not a second engine. Travel: this half-pan or one tube. Helio is the yellow-shade twin, not a duplicate.`,
    ace_history: `Phthalo green was first sold as a pigment in 1935 (Monastral family). Chemists chlorinated copper phthalocyanine blue and got a staining green the dye industry wanted for inks and car paint. Artists inherited a mixing monster. "Viridian hue" on student tubes is often this, not real PG18. Horadam 518/519 is the same soul in pan vs tube.`,
  },
  "sch-hp-may-green": {
    temp_role:
      "Warm-leaning spring leaf · Phthalo + arylide lemon (PG7/PY3) · convenience sap · ◈",
    ace_note: `Spring in a tube. Softer than raw phthalo — think new leaves, not alien slime. Lovely with your yellows for natural greens.

This is the mix-trap solver — and it is optional homework already done. Someone mixed icy PG7 with PY3 (Hansa/arylide lemon, the cool yellow). You get May, new beech, lawn after rain. Not olive. Not pine night. Not teal.

Once you can make this from Phthalo + a cool yellow, May is a travel / speed well, not a third personality. Helio (PG36) already leans yellow. Phthalo + Helio + May = three phthalos wearing different hats. Learn the engine; pack May when you don't want to mix in a field.

Temperature: yellower and friendlier than raw PG7; cooler/springier than an olive (olives have brown or orange in them). It is a green with a lemon inside.

Behavior: marked non-staining (the yellow dilutes phthalo's vice). Still don't flood a white blossom. Semi-transparent; stacks less inky than pure PG7.

Play lab (the lemon inside): Masstone vs a long dilute. If the wash goes lime/chartreuse, PY3 is speaking. That's this convenience showing its recipe.

Dual advice: one PG7+cool-yellow leaf seat. Already auditioning: White Nights May Green (also PY3/PG7), Rosa Grass Green, Sennelier Green, M. Graham Olive Green sample, Shire Olive 2ml. Half-pan + WN + Rosa = three faucets of one spring. Keep the one you reach for. Not a substitute for Cobalt Deep or Perylene. Not a substitute for 534 olive (that's phthalo + orange, a hedge, not May).`,
    ace_history: `"May green / Maigrün" is a European convenience name for first-leaves, not a mineral. PY3 is 20th-century arylide yellow (cool Hansa); married to PG7 it fakes the sap-green job with modern lightfastness. Old sap greens were often fugitive lakes + Prussian. This is the honest modern shortcut — shortcut, not a second primary.`,
  },
  "sch-hp-cobalt-green-dark": {
    temp_role:
      "Muted mineral green · Cobalt chromite (PG26) · receding landscape · not a mixer",
    ace_note: `Deep cobalt green — dignified and muted. Forest shadows that recede instead of shout. Pairs well with your ochres for tired summer foliage.

Not a substitute for Phthalo. Not a substitute for May. PG26 is a spinel (cobalt–chromium oxide): 19th-century mineral chemistry, a little dull, a little body, low staining. Landscape painters used this family when they wanted a green that sat back in the hills. Phthalo shouts; cobalt mutters. Tinting strength is too polite to do PG7's complementary-black trick.

Horadam Cobalt Green Dark is often listed as granulating; if your wash flocks, believe the paper.

Toxicity: cobalt. Wash hands; no tea on the palette.

vs Terre Verte (W&N tube, PG23, green earth): both quiet historical landscape greens. Terre verte is clay-green, often weaker, greyer. PG26 is the manufactured mineral cousin. One quiet green in a small tin.

Dual advice: one muted mineral seat. Don't stack Light Cobalt Green 2ml as this — that sample is PG7+PB36 (phthalo wearing a cobalt name). Tin may say 509 here and 533 on some charts; PG26 is the identity.`,
    ace_history: `Cobalt greens (Rinmann's green and later chromite spinels) were 18th–19th century answers to "a permanent green that isn't arsenic." Scheele's and emerald green (copper acetoarsenite) had been beautiful and poisonous. PG26 survived: dignified, expensive, unfashionable after 1935, still the right green when phthalo would vandalize a distance.`,
  },
  "sch-hp-784-perylene-green": {
    temp_role:
      "Near-black foliage · Perylene black (PBk31) · botanical night · staining glaze",
    ace_note: `Transparent dark green — forest depths and botanical shadows.

It is not a green. The index is Pigment Black 31 — a perylene sooty green-black. Masstone can look almost black; tints go dull sap / Hooker / distant cypress. Botanical painters use it so shadows stay in the plant instead of going indigo-blue or carbon-dead.

Behavior: transparent-to-semi, staining, no granulation. Glaze it; don't ask it for spring. Some find the tints a bit dusty (it's a combustion black). Faster and flatter than a mixed dark; that can be a feature.

Dual advice: one near-black green seat. Half-pan + full pan = one color, two faucets. DS 2ml labeled Perylene Green is still tagged PG36 in our catalog — not this well until that slice is corrected (and PG36 is already Helio). If you already mix fine darks from Phthalo + earth, this is optional speed, not a missing primary.`,
    ace_history: `Perylene dyes start in 1912; the green-black (PBk31) is a late-century BASF industrial pigment (car paint, plastics) that entered watercolor in the 1990s. Chemists filed it as a black. Painters needed a cypress.`,
  },
  "sch-hp-514-prussian-green": {
    name_en: "Helio Green",
    name_zh: "日光绿",
    pigment: "PG36",
    notes:
      "Horadam 514 Heliogrün (Helio Green). Studio had mislabeled this Prussian Green; 528 is Prussian. Pigment PG36.",
    temp_role:
      "Warm-leaning yellow-shade phthalo · Brominated copper phthalocyanine (PG36) · sunnier engine · staining",
    ace_note: `Deep teal-leaning green — forest night and cold water.

That note was the Prussian story. Tin confirmed: 514 Helio Green, not 528 Prussian Green. Helio is PG36 — same phthalocyanine family as Phthalo Green, but some chlorines replaced with bromine, which yanks the hue toward yellow. Brighter, more acid/spring than teal-night. Trust 514.

This is the yellow-shade twin of Phthalo Green, not a foliage crayon and not a Prussian. Painters who keep both PG7 and PG36 treat them like two phthalo blues (green-shade / red-shade): one cooler/teal, one sunnier/leaf. You do not also need May as a third phthalo hat — May is PG7+lemon already.

vs Prussian Green 528 (not this pan): that name is a memory of Prussian blue + yellow. DS's Prussian Green sample is yet another recipe (PG7+PB27). Different romance.

Play lab (shade): Same dilution, Helio beside Phthalo PG7. Helio should read yellower / more "sun on grass." If they look identical, you don't need both engines.

Dual advice: one PG36 well. Don't keep Helio + May + Phthalo as three "I might need a green" wells: engine pair or engine + May, not all three. DS 2ml tagged PG36 (the mislabeled Perylene Green) is a later cleanup, not a second Helio.`,
    ace_history: `Helio / Helios names point at the sun: 20th-century phthalo biased yellow. PG36 is the brominated cousin of PG7, born for industry the same way, inherited by landscape painters who wanted the mixing monster a little closer to sap. Prussian green is an 18th-century mix-memory (Diesbach's iron-blue, 1704, plus a yellow). This pan is the sun, not Berlin.`,
  },
};

const p = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));

const before = p.colors.length;
p.colors = p.colors.filter((c) => c.id !== DELETE_ID);
const removed = before - p.colors.length;
if (removed !== 1) {
  console.error("expected to remove 1 olive ghost, removed", removed);
  process.exit(1);
}

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
if (nUp !== Object.keys(updates).length) {
  console.error("count", nUp);
  process.exit(1);
}

const olive = p.colors.find((c) => c.id === OLIVE_KEEP);
if (!olive) {
  console.error("missing", OLIVE_KEEP);
  process.exit(1);
}
olive.format = "half-pan · full pan";
olive.notes =
  "Horadam 534 Permanent Green Olive (Permanentgrün Oliv) PO62/PG7. Full pan + half-pan merged (deleted ghost id sch-hp-permanent-green-olive / old 575).";

for (const c of p.colors) {
  if (!Array.isArray(c.mix_tips)) continue;
  c.mix_tips = c.mix_tips
    .map((t) => {
      if (!t || !Array.isArray(t.with)) return t;
      const with2 = t.with.map((id) => (id === DELETE_ID ? OLIVE_KEEP : id));
      const seen = new Set();
      const deduped = with2.filter((id) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      return { ...t, with: deduped };
    })
    .filter((t) => t && t.with && t.with.length);
}

const greens = p.colors.filter((c) => c.family === "green");
const dual = greens.filter((c) => (c.ace_note || "").includes("Dual advice"));
console.log(`Green Dual advice: ${dual.length} / ${greens.length}`);
console.log("Helio:", p.colors.find((c) => c.id === "sch-hp-514-prussian-green").name_en);
console.log("534 format:", olive.format);

p.color_count = p.colors.length;
p.updated = new Date().toISOString().slice(0, 10) + "-green-halfpan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("Green half-pan cards applied:", nUp);
console.log("removed olive ghost:", removed, "palette size:", p.colors.length);
