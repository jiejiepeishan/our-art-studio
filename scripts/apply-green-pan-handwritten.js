/**
 * Apply handwritten green · non-granulating pans
 * (Desktop green-pan-draft.md).
 *
 * - Emerald (PG18), WN May, Rosa Grass, Aquarius, 534 Permanent Olive
 * - Aquarius pigment PG7/PBr7 → PY150/PBr25/PB29; granulating true
 * - Emerald granulating true (viridian manners)
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-fp-513-emerald-green": {
    granulating: true,
    temp_role:
      "Cool historical green · Hydrated chromium oxide (PG18 / viridian) · quiet foliage · not phthalo",
    notes:
      "Smaragdgrün / Viridian. PG18 single pigment, code 513. Modern hydrated chromium oxide — not Victorian arsenic emerald.",
    ace_note: `Classic emerald — cooler than phthalo, calmer than viridian. Foliage with good manners.

That line mixed "emerald" and "viridian" as if they differed. On this pan they are the same soul: German Smaragdgrün, English often Viridian or Emerald Green, pigment PG18.

Not the Victorian poison. Old "emerald green" meant copper arsenite (Scheele / Paris green) — beautiful and deadly. Modern PG18 is hydrated chromium oxide, invented mid-19th century as a safer transparent cool green. Chromium compound still: wash hands; not a snack. Not Scheele.

Why it exists next to Phthalo: PG7 is a 1935 mixing monster — staining, smooth, eats the sketch. PG18 is the older landscape manners: weaker tinting strength, often granulating, non-staining / liftable, blue-green and polite. Sargent's parasol green lived here, not in phthalocyanine.

Behavior: can need a little more pre-wet than organics when the pan is bone dry. Rewards patience. Will not replace Phthalo as an engine; will not stain a white blossom the same way.

Play lab (lift / sediment): Wet wash, let it sit, try a clean damp lift. If it lifts cleaner than Phthalo, that's why botanical painters kept viridian. If it granulates, that is the pigment talking.

Dual advice: one PG18 well. Not a second Phthalo. Not Helio. Cobalt Deep (PG26) is a different quiet — mineral spinel mutter vs chromium glass-green. Travel: Phthalo or Viridian for cool green, not both unless you paint both "mix loud" and "atmosphere soft."`,
    ace_history: `Viridian (PG18) is 19th-century hydrated chromium oxide — the answer to "we need a permanent transparent green that isn't arsenic." The name Emerald / Smaragdgrün is poetry stolen from a poison. Phthalo (1935) later stole the job for mixing power; viridian kept the job for texture and lift. Horadam 513 is the real single-pigment seat, not a "viridian hue" (often secret PG7).`,
  },
  "wn-745": {
    temp_role:
      "Warm-leaning spring leaf · Arylide lemon + phthalo (PY3/PG7) · convenience sap · same seat as Sch May",
    ace_note: `May green — spring leaves, mixing green.

Same homework as Schmincke May Green half-pan. Cool yellow (PY3) already married to PG7. First-leaf, lawn, beech in May — not olive, not pine night, not teal. It is a green with a lemon inside.

You already own this seat in German. White Nights is the Russian faucet — often a bit more "pan paint" body, sometimes a touch yellower or softer depending on the batch. Not a new primary. Same role as Sch May; small behavior differences (body, rewet, how loud the phthalo is).

Behavior: convenience; gentler than pure PG7. Don't flood white petals. Will not do 534's orange-olive hedge.

Dual advice: one PG7+cool-yellow leaf seat among Sch May HP · this WN pan · Rosa Grass · Sennelier Green · Shire Olive 2ml. Three pans of May is a museum of spring, not a palette. Keep the one whose rewet you like.`,
    ace_history: `"May green" is European convenience naming for first-leaves, not a mineral. PY3 is 20th-century arylide lemon; PG7 is the 1935 engine. St. Petersburg bottles the same modern shortcut under a plein-air romance.`,
  },
  "rosa-755": {
    temp_role:
      "Warm-leaning grass leaf · Phthalo + arylide lemon (PG7/PY3) · Ukrainian spring convenience · same leaf seat",
    ace_note: `Grass Green brings cool yellow energy to the tin — worth knowing by temperature, not just by pretty swatch.

Same molecules, different passport. Rosa's grass is the leaf seat again — PG7 + PY3, often a bit more yellow-chartreuse in the well than "May" marketing. The "cool yellow energy" is the lemon talking; the family is still green.

If Sch May + WN May + Rosa Grass all stay, you have three answers to "I need spring." That is the opposite of ruthless. Swatch them in a row: the one that matches the grass outside your window wins; the others are spares or trade bait.

Behavior: single-pan Rosa — check rewet vs Horadam. Same dual logic as White Nights May.

Dual advice: folds into the one leaf seat (Sch May · WN May · Rosa Grass). Not a substitute for Emerald (historical quiet). Not a substitute for 534 (orange-olive). Not Aquarius (undersea separation).`,
    ace_history: `Rosa Gallery is Kyiv's student-to-pro line; Grass Green is the local name for the same 20th-century leaf convenience every European catalog reinvented. Phthalo + cool yellow, sold as lawn.`,
  },
  "rs-346": {
    pigment: "PY150/PBr25/PB29",
    granulating: true,
    temp_role:
      "Warm-cool separated landscape green · Nickel azo + permanent brown + ultramarine · undersea/kelp cousin · granulating split",
    notes:
      "Roman Szmal Aquarius Green 346. Official PY150/PBr25/PB29 (Undersea family) — not catalog PG7/PBr7. Cousin of DS Undersea Green.",
    ace_note: `Aquarius green — muted olive, Polish landscape mist.

Catalog lie (big one): this is not PG7 + PBr7 earth-olive. Charts list Aquarius Green 346 as PY150 (nickel azo yellow) + PBr25 (benzimidazolone brown) + PB29 (ultramarine). That is the Undersea Green family — yellow + blue + a brown ballast — not phthalo green stained with iron earth.

You already own Daniel Smith Undersea Green (PB29/PY150, tube, granulating). Aquarius is the Polish cousin: often a touch darker/earthier (the PBr25), famous for separation — ultramarine flocks, yellow-brown halo.

Why the old note said olive: muted landscape green looks olive in the well. Chemistry is undersea/kelp/wet field, not Desert Green's PG7+PBr7.

Behavior: honey-bound Aquarius pans stay a bit soft. Staining organics + granulating ultramarine = don't scrub whites. Not a May leaf. Not a 534 hedge.

Play lab (separation): Wet cold-press, drop, don't stir. Look for blue grit vs warm green-gold. If nothing splits, still paint with it — but then it's a quieter convenience, not DS-undersea theatre.

Dual advice: one undersea/separated-green seat. Aquarius or DS Undersea — manners contest. Do not dual it with Desert Green / Rare Earth (true PG7+PBr7) as if they were twins; different recipes. vs 534: orange+phthalo olive vs nickel-azo+ultramarine undersea.`,
    ace_history: `Roman Szmal (Kraków) builds Aquarius for European landscape painters who want granulating convenience without Seattle prices. Undersea-type greens are late-20th-century "we mixed quin-gold / nickel azo with ultramarine so the sea floor paints itself." The name Aquarius is zodiac theatre; the pigments are the lesson. Catalog PG7/PBr7 was an enrich guess — retired.`,
  },
  "sch-fp-534-permanent-green-olive": {
    temp_role:
      "Warm muted olive · Benzimidazolone orange + phthalo (PO62/PG7) · lightfast hedge · landscape middle · ◈",
    ace_note: `Olive foliage mixer — warmer than pure phthalo green, ready for trees.

The permanent sermon. Official Horadam 534 is PO62 (benzimidazolone orange — modern lightfast orange) + PG7. Schmincke's pitch: lightfast alternative to old fugitive Olive Green (515). Not dirt-olive (PG7+PBr7). Not undersea. Phthalo stained with orange so the leaf goes hedge, khaki, military, late summer — warmer than May's first-leaf.

Half-pan + full pan already merged. One well, two faucets.

Behavior: staining (phthalo half). Convenience mixer — star for a reason. Will not granulate like viridian. Will not separate like Aquarius.

Play lab (temperature vs May): Same dilution, 534 beside Sch or WN May. Olive should read browner/warmer/hedge; May should read spring/lime. If they look identical on your paper, you don't need both convenience greens.

Dual advice: one orange-olive seat — this is it. Desert Green / Rare Earth (PG7+PBr7) are earth-olive, different theology; keep at most one of those in samples. vs Aquarius: not the same. vs May/Grass: spring vs hedge — teammates only if both swatches earn a job.`,
    ace_history: `"Olive green" on 19th-century palettes was often a soup and sometimes a weak one. "Permanent" on a Horadam label means we rebuilt the olive with lightfast organics. PO62 is late-century benzimidazolone orange; married to PG7 it fakes the hedgerow without fugitive lakes. Two theologies of olive: stain phthalo with earth (painter's old trick) or with orange (factory permanent). This pan is the factory.`,
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
if (nUp !== Object.keys(updates).length) {
  console.error("count", nUp);
  process.exit(1);
}

const greens = p.colors.filter((c) => c.family === "green");
const dual = greens.filter((c) => (c.ace_note || "").includes("Dual advice"));
const panNeed = greens.filter((c) => {
  const f = (c.format || "").toLowerCase();
  const pan = f.includes("pan") || f.includes("single");
  return pan && !(c.ace_note || "").includes("Dual advice");
});
console.log(`Green Dual advice: ${dual.length} / ${greens.length}`);
console.log("pan-ish still without Dual:", panNeed.map((c) => c.id).join(", ") || "none");
const aq = p.colors.find((c) => c.id === "rs-346");
console.log("Aquarius", aq.pigment, "gran=" + aq.granulating);

p.updated = new Date().toISOString().slice(0, 10) + "-green-pan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("Green pans applied:", nUp);
