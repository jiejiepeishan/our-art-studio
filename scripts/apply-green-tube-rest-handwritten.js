/**
 * Apply handwritten green · remaining tubes (7)
 * Desktop green-tube-rest-draft.md (user-edited)
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "mg-150-phthalo-green": {
    temp_role:
      "Cool staining mixing green · PG7 · honey studio barrel · same engine as Sch 519",
    ace_note: `Boss green — one molecule of this dyes the whole party. Whisper-light for jewel glazes; heavy-handed and it owns the mix. Honey keeps it friendly on the palette.

You already have the engine (Sch 519 + the half-pan). This is the open jar. Honey + 15ml means it stays scoopable on the palette for a long session. That is a studio habit, not a new green. If you paint large and hate rewetting a half-pan, this is the rational PG7. If you don't, it is a monument.

It will still do the pyrrol chromatic-black trick. It will still eat a mix. Honey does not tame the stain — it only keeps the puddle from turning to stone overnight.

Play lab: Leave a pea on the palette overnight. Mist it. If it reopens like jam, that's why people buy Graham. Then forget the brand and dose it like 519.

Dual advice: one PG7. This or Sch tube or the pan in the daily tin. Don't keep Graham and Sennelier 707 "because both are honey."`,
    ace_history: `Same 1935 Monastral green. M. Graham's contribution is walnut-honey binder — West-coast handling of an industrial dye. The 15ml is the American studio size.`,
  },
  "wn-tube-winsor-green-bs": {
    temp_role:
      "Cool staining mixing green · PG7 · British workhorse · blue-shade = not Helio",
    ace_note: `W&N Professional Winsor Green (Blue Shade) — classic British workhorse in 5ml.

The useful word on the tube is Blue Shade. W&N split phthalo green the honest way: BS = PG7, YS = PG36. You already own YS as Helio 514. This 5ml is the British engine — often a little more staining/transparent-feeling than honey, famous for dyeing the rinse water. "Winsor" is a house crown, not a pigment.

Dual advice: folds into one PG7. Keep this 5ml only if you like British rewet better than Horadam or honey. Pair with Helio if you want both shades; don't buy a second BS.`,
    ace_history: `W&N stamped industrial phthalos with the Winsor name (Green, Blue, Violet…). Blue Shade vs Yellow Shade is the only distinction that survived the marketing.`,
  },
  "sen-707-emerald-green": {
    temp_role:
      "Cool staining mixing green · PG7 wearing émeraude · not viridian",
    ace_note: `Bottle emerald — lush, straightforward foliage green.

French Vert émeraude 707 is not the emerald you already wrote (Sch 513, PG18 viridian). It is phthalo in honey, looking lush in the well because honey makes jewelry of everything. The name is the same trap as student "viridian hue."

Dual advice: not a twin of 513. Is a twin of 519 / Graham / WN BS. One engine. If you keep a Sennelier green tube, prefer 807 Deep (actually a different recipe) over this fake emerald.`,
    ace_history: `Émeraude on a série 1 tube is a 19th-century word glued to a 1935 dye. Real emerald green was arsenic. Real viridian is chromium hydrate. This is neither.`,
  },
  "sen-807-phthalo-green-deep": {
    temp_role:
      "Cool teal-deep mixing green · PG7 + phthalo blue · Vert Anglais Foncé · cousin, not a fifth engine",
    ace_note: `Deep teal-leaning boss green — English green by name, phthalo by personality. One drop dyes foliage forever; honey keeps it creamy on the palette.

This is the one Sennelier green that earns a card. Extra PB15:3 (phthalo blue, green-shade) yanks PG7 toward ink-teal / bottle green. Cooler and duskier than 519. Still a dye. Still not viridian, not Deep Sea (minerals), not Cascade (earth+blue).

"Vert Anglais Foncé" is a French memory of British bottle greens — shop windows, railings, the Channel — rebuilt with two phthalos. Verdigris energy without copper acetate.

Play lab: Same dilution beside Sch 519. Deep should read bluer, more spruce-night. If they match, you don't need the cousin.

Dual advice: one teal-phthalo. vs Deep Sea 954: dye teal vs viridian+ultramarine weather. vs Helio: opposite bias (blue-deep vs yellow-sun).`,
    ace_history: `Sennelier stacked two Monastral cousins (green + blue) and called it English green deep. Modern stand-in for historical copper greens, minus the poison.`,
  },
  "sen-817-sennelier-green": {
    temp_role:
      "Warm-leaning spring leaf · PG7 + arylide lemon · honey May · same seat as the pans",
    ace_note: `House green — proprietary blend, try it against May Green.

There is no house secret. PG7+PY3 is Sch May, WN May, Rosa Grass. This is the honey-tube faucet of April leaf. It is a green with a lemon inside.

If you can mix it from Phthalo + cool yellow, or you already kept a May pan, this tube is dessert.

Dual advice: one leaf seat. Not sap (gold/nickel). Not 534 (orange olive).`,
    ace_history: `Every European catalog bottled "our green" as phthalo + cool yellow once PG7 existed. Sennelier put their name on the marriage.`,
  },
  "ds-15ml-christmas-tree-green": {
    temp_role:
      "Cool pine-earth green · Iron earth + phthalo blue · holiday 15ml · same pine as Cascade",
    ace_note: `DS holiday Christmas Tree Green — festive 15ml, paint something ridiculous and beautiful.

Same marriage as Cascade and Taiga: no green pigment — dirt + phthalo blue. The 15ml and the Santa name are how DS sells extra milliliters of a seat you already starred. Fun. Not a fourth pine.

Catalog granulating flag is suspicious. Earth + PB15 usually sediments. If your wash flocks, trust the paper. This tube is not a burnt-sienna lesson.

Play lab: Beside Cascade, same water. If Christmas is quieter/smoother, it's the party dress of the same recipe. If it splits the same, one pine well.

Dual advice: one earth+blue pine. Keep the 15ml only if Cascade's 5ml actually runs out.`,
    ace_history: `Limited-edition greens are often remixes. Christmas Tree is PBr7+PB15 in a festive dress. The Cascades and the taiga were here first.`,
  },
  "sch-tube-954-deep-sea-green": {
    pigment: "PG18/PB29",
    notes:
      "Horadam Supergranulating 954 Deep Sea Green. Official PG18 + PB29 (not PG7/PB29). Viridian + French ultramarine.",
    temp_role:
      "Cool teal weather · Viridian + French ultramarine · Deep Sea climate · not phthalo",
    ace_note: `Schmincke Deep Sea Green — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set.

Phthalo cannot supergranulate. Catalog PG7/PB29 is the same kind of enrich lie as Glacier's old PG7/PW6. Official 954 is PG18 (viridian) + PB29 (ultramarine) — a granulating turquoise. You already own both halves: Emerald 513 and ultramarine. This tube is the marriage as weather: chromium-green grit one way, soda-fired blue flocks the other.

Reviewers sometimes say the Deep Sea set's "green" is barely green — more teal-blue. Believe the split, not the word Green.

vs Sen 807: two dyes, smooth ink. vs Glacier: cobalt teal + Potter's Pink (ice-rose). vs Undersea: gold floats, ultramarine sinks (kelp). vs Cascade: earth + phthalo blue (pine). Four splitters, four marriages. This one is the nineteenth-century pair in a twenty-first-century climate bottle.

Play lab: Wet cold-press, tilt, walk away. Name the green grit vs the blue flocks. Stir it and you paid Supergranulating prices for teal soup.

Dual advice: one viridian+ultramarine weather seat. Emerald 513 stays the quiet single. Don't also stack a later "Hooker's" that's secretly the same two pigments.`,
    ace_history: `Deep Sea is Schmincke climate poetry (with Glacier, Galaxy…). Viridian = mid-19th-c. hydrated chromium oxide, the safe answer to arsenic emerald. Ultramarine = 1820s French synthetic lapis. Neither is phthalo. The catalog guessed PG7 because the wash looks teal. Supergranulation requires two granulating pigments. Trust 954.`,
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
const tubesLeft = greens.filter((c) => {
  const f = (c.format || "").toLowerCase();
  const sz = (c.size || "").toLowerCase();
  const tube = f.includes("tube") || sz.includes("tube");
  return tube && !(c.ace_note || "").includes("Dual advice");
});
const ds = p.colors.find((c) => c.id === "sch-tube-954-deep-sea-green");
console.log(`Green Dual advice: ${dual.length} / ${greens.length}`);
console.log("tubes still without Dual:", tubesLeft.map((c) => c.id).join(", ") || "none");
console.log("Deep Sea", ds.pigment);

p.updated = new Date().toISOString().slice(0, 10) + "-green-tube-rest-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("Green remaining tubes applied:", nUp);
