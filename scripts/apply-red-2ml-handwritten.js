/**
 * Apply handwritten red · 2ml sample color cards
 * (Desktop red-2ml-draft.md). Completes red family 31/31.
 *
 * Names stay (Rose Red / Chromium Red Mica / Almandite / Carnelian).
 * Catalog flags follow confirmed DS SKU last-3-digit mapping:
 *   217 Carnelian = Mayan Red PR287, LF II, granulating
 *   189 / 205 granulating (official Fuchsite / Garnet)
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "ds-091-rose-red": {
    temp_role:
      "Warm-cool transparent quin red · PR209 · DS sample twin of Quin Red / Madder Red Dark · staining",
    ace_note: `Staining rose-red — bold florals, one brushload goes far.

Studio label 玫瑰红 / Rose Red; DS SKU 091 is Quinacridone Red — same PR209 as W&N Quinacridone Red tube and Schmincke Madder Red Dark half-pan. Transparent modern glow, staining enough to commit: florals, coral-leaning clean red, glazing that stays luminous. Cooler than fire-engine pyrroles; warmer/coral than the PV19 carmine/ruby corner. One brushload does go far — dose it.

Dual advice: one PR209 seat. This 2ml is DS manners try-on next to the British tube and the Horadam "madder" pan — not a fourth quin red. Vs Rose Madder Permanent (PR209+PV19, pink family): that one is madder-mood blend; this is the single-pigment workhorse. Vs Candy Cane (PV19 dessert): different molecule, don't fire a primary for a holiday.`,
    ace_history: `Quinacridone reds (PR209) are the late-century answer to fugitive rose madders: transparent, lightfast, built for glow. Chinese sample cards often say 玫瑰红; the factory name is Quinacridone Red. Trust the code.`,
  },
  "ds-189-chromium-red-mica": {
    granulating: true,
    temp_role:
      "Cool-warm dusty rose · Red Fuchsite / chrome mica · sparkle + sediment · not a mixing red",
    ace_note: `PrimaTek mica red — shimmer meets earth.

Correction, not a Venetian: DS SKU 189 is Red Fuchsite Genuine. Fuchsite is chromium muscovite — chrome mica — so 纯铬红云母 is a decent rock-hound name, not a chrome-oxide paint. Catalog PR101/PW20 is an enrich guess (iron + mica). Official line is genuine red fuchsite: dusty rose, transparent, non-staining, granulating, a little sparkle when the wash dries. Soft reddish stone, not brick cover, not fire-engine.

If the swatch sparkles and flocks, believe the mineral. If it just sits there like cheap iron red, the sample may have been shy — still don't promote it to "my Venetian."

Dual advice: specialty mica-rose seat — one. Vs Minnesota Pipestone (earth family): pink stone story without the chrome-mica flash. Vs English Venetian / QoR-Sen-WN PR101: those are brick jobs; this is jewelry dust. Vs Scarlet Mist: both can granulate, different romance. Sample is the honest format. Don't buy a 15ml unless the sparkle makes you stupid-happy.`,
    ace_history: `Red fuchsite comes from chromium-bearing mica (Brazil in DS's telling) — a gemstone cousin of green fuchsite, ground for PrimaTek. The old card history called it Mars/Venetian PR101. That was the catalog talking. Mica plates catch light; iron earth does not.`,
  },
  "ds-205-almandite": {
    granulating: true,
    temp_role:
      "Warm mineral red-orange · Garnet Genuine · jewel grit · not Venetian brick",
    ace_note: `PrimaTek garnet — deep jewel-tone passages.

Studio Almandite (almandine is the iron-aluminum garnet); DS SKU 205 is Garnet Genuine. Official mood is warm reddish-orange/brown — January-birthstone warmth, kin to quin burnt-scarlet hue but with mineral texture. Catalog PR101 is convenience chemistry; the point of the well is genuine garnet grit, not another Mars red. If your swatch sediments, trust the paper over the old flag.

Deep jewel passages, bark that isn't burnt sienna, warm shadows that refuse to go dead-black. Weak as a primary mixing red. Strong as a place.

Dual advice: character mineral — not a third Venetian, not a perylene wine. Vs English Venetian / tube PR101s: brick vs jewel. Vs Perylene Maroon: clean modern glaze vs gritty birthstone. Vs Fuchsite: dusty mica-rose vs warmer orange-garnet. One PrimaTek red-stone well is plenty unless both swatches clearly do different jobs.`,
    ace_history: `Almandine garnet is iron-rich silicate, historically a jewelry stone, not a kiln-roast earth. PrimaTek mills the mineral so the wash can keep a little of the rock. "Almandite" on the sample card and "Garnet Genuine" on the tube are the same seat.`,
  },
  "ds-217-carnelian": {
    pigment: "PR287",
    lightfastness: 2,
    granulating: true,
    temp_role:
      "Warm dusty-rose red · Mayan Red (PR287) · granulating · LF II · not a gemstone",
    ace_note: `Carnelian brings warm red family energy to the tin — worth knowing by temperature, not just by pretty swatch.

The name is the trap. Studio 玛瑙红 / Carnelian; DS SKU 217 is Mayan Red. 玛雅 vs 玛瑙 — easy mix-up on a Chinese card. Not banded chalcedony, not Roman signet-ring poetry (that was the old history talking). Official: PR287, transparent, low staining, granulating, lightfastness II (very good) — not the usual I.

Mayan Red runs a wide temperature: strong natural red in masstone, clean rose, then dusty pinks. Jane's dot-card read was "a bit like Indian Red with a dusty rose undertone and fascinating granulation." Eco-process, metal-free, DS's "ancient mural that survived the humidity" story. Treat LF II honestly for heirlooms; joy for weekly work.

Catalog PR188 was an enrich guess. Do not dual this as Sennelier Scarlet Lacquer unless your own swatch is clearly naphthol-lacquer, not dusty Mayan rose.

Dual advice: one dusty-rose granulating red seat. Not a gemstone carnelian, not a PR188 decorative fire, not a Venetian. Vs Indian Red / English Venetian: similar "old wall" mood, different code and granulation gossip. Vs Rose Red / PR209: this is sedimentary character; that is clean quin glow. Sample first. Promote only if the dusty split is a color you keep reaching for.`,
    ace_history: `Mayan red (PR287) is a modern revival of a pre-Columbian organic red — murals and sculpture, then an eco-process in a Seattle tube. The sample card said Carnelian. Trust SKU 217 and the swatch; leave the agate in the jewelry box.`,
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

const reds = p.colors.filter((c) => c.family === "red");
const dual = reds.filter((c) => (c.ace_note || "").includes("Dual advice"));
console.log(`Red Dual advice: ${dual.length} / ${reds.length}`);

p.updated = new Date().toISOString().slice(0, 10) + "-red-2ml-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("Red 2ml cards applied:", nUp);
