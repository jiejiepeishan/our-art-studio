/**
 * Apply handwritten green · 2ml granulating + mixing samples (5)
 * Desktop green-2ml-gran-mix-draft.md
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-932-shire-olive": {
    pigment: "PY159/PB35",
    notes:
      "Horadam Supergranulating 932 Shire Olive. Official PY159 + PB35 (not PG7/PY3). Yellow + cerulean-family blue mix on the paper.",
    temp_role:
      "Neutral meadow olive · Zirconium-Pr yellow + cerulean-family blue · supergranulating · not May",
    ace_note: `Olive drab with a story — rolling hills and quiet landscapes.

Catalog says PG7+PY3 — that is May Green, first-leaf, no granulation. Supergranulating Horadam cannot be that. Official 932 Shire Olive is PY159 (praseodymium / zirconium yellow — a ceramic stain yellow) + PB35 (cerulean-family, cobalt-tin blue). The layer shows yellow particles and blue particles, but the color is unambiguously green. Blue plus yellow on the paper, not premixed slime.

That is why it's a mixer with a star: you can lean the wash wetter and watch the marriage happen. It is not a third May. It is not 534 (orange+phthalo hedge). It is the Shire — meadow as climate line (with Shire Yellow, Green, Blue, Grey).

Play lab: Wet cold-press. Don't stir. If you see yellow grit and blue grit making olive, the catalog PG7/PY3 is dead. If it stays smooth sap, the sample may be shy — still don't promote it as May.

Dual advice: one Shire-olive / yellow+blue-on-paper seat. vs May/Grass: those are married phthalo+lemon, spring, no split. vs 534: factory hedge. vs Cascade: earth+phthalo blue (pine theatre). vs Glacier: ice-rose minerals. This is the pastoral splitter.`,
    ace_history: `Shire is Schmincke's English-countryside climate set. PY159 and PB35 are both inorganic, both granulating — that's the Supergranulating rule we already used on Glacier and Deep Sea. Catalog guessed "olive = phthalo + yellow." The paper does the mixing instead.`,
  },
  "ds-139-green-gold": {
    pigment: "PY150/PY3/PG36",
    lightfastness: 2,
    notes:
      "DANIEL SMITH Green Gold SKU 139. Official PY150 + PY3 + PG36 (not PY150/PG7). Not W&N PY129. LF often II.",
    temp_role:
      "Bright gold-leaf mixer · Nickel azo + hansa lemon + yellow-shade phthalo · not PY129",
    ace_note: `Green gold — instant natural olives and sunlit leaves.

You already starred W&N Green Gold = PY129 (a yellow that reads moss). This 2ml is DS's other Green Gold — SKU 139. Official: PY150 + PY3 + PG36. Nickel-azo glow + cool lemon + Helio's phthalo. Brighter, more "sunlit leaf," less brown than PY129. Lightfastness often II (the PY3), not the usual I.

Catalog dropped PY3 and wrote PG7 instead of PG36. Close family, wrong shade — and it hides the lemon.

So: two "green golds" in the tin are not twins.
- PY129 = single-pigment moss-yellow engine (WN tube).
- This = convenience juice (gold + lemon + yellow-phthalo). Closer to QoR Sap's idea (nickel + phthalo) plus a shot of May's lemon.

Play lab: Beside WN Green Gold, same water. DS should go brighter/lime-gold; WN should go olive-moss. If they match, you still only need one name — keep the PY129 as the mixer soul.

Dual advice: one convenience green-gold among this sample, QoR Sap, and any "rich green gold" you don't own (PY129 is already the other seat). Nickel: wash hands. vs May: May has no nickel gold. vs Shire Olive: mineral split vs organic glow.`,
    ace_history: `DS sold two golds on purpose: older Green Gold (this mix, SKU 139) and later Rich Green Gold (PY129, SKU 099). Painters who say "green gold" may mean either. Trust the index. Nickel azo is why toxicity is medium.`,
  },
  "ds-163-amazonite": {
    pigment: "Genuine Amazonite",
    staining: false,
    notes:
      "PrimaTek Amazonite Genuine SKU 163. Genuine amazonite feldspar (not PG7/PW6). DS: transparent, non-staining, lifts.",
    temp_role:
      "Cool teal mineral · Amazonite feldspar · gemstone mixer · not milky phthalo",
    ace_note: `PrimaTek amazonite — milky green-blue granulation, gemstone skies.

SKU 163 is Genuine Amazonite — a potassium feldspar (the blue-green stone people call Amazon stone). Catalog PG7/PW6 is the Glacier-milk guess again. DS: strong pure teal, transparent, non-staining, lifts. Some reviewers say it barely granulates; our flag says it does. Trust the swatch. The "milky" in the old note may be the stone's opacity in masstone, not titanium white.

DS's own mixing pitch: gorgeous with reds into violets. That's a mixer even without a star — a teal that can swing toward jewel purple instead of leaf. Not an engine. Not Mint Dream (PW6+PG7 candy).

Play lab: Dilute teal wash + a touch of a cool red you own (quin rose / ruby). If it goes violet without mud, that's why they sell the rock. Granulation: believe the paper.

Dual advice: one amazonite / teal-stone seat. vs Jadeite: different rock, darker jade vs teal. vs Mint / Glacier: not the same. vs Light Cobalt Green sample (later, tagged PG7/PB36): phthalo wearing cobalt — not this.`,
    ace_history: `PrimaTek: DS grinding a Brazilian amazonite cache. Feldspar, not phthalocyanine. The old history paragraph was the generic PG7 sermon. Retired.`,
  },
  "ds-195-jadeite": {
    pigment: "Genuine Jadeite",
    staining: false,
    notes:
      "PrimaTek Jadeite Genuine SKU 195. Genuine jadeite (not PG7/PW6). Semi-transparent, non-staining.",
    temp_role:
      "Cool dark jade mineral · Jadeite · pale-to-ink jade · not milky phthalo",
    ace_note: `PrimaTek jadeite — cool jade granulation, landscape poetry.

SKU 195 is the jade mineral (jadeite, not nephrite — DS says the stronger-colored of the two jades). Deep dark-green masstone to palest jade wash. Official: semi-transparent, non-staining. Catalog PG7/PW6 and staining=true were enrich leftovers. This is jewelry dirt, not the engine plus milk.

PrimaTek greens lineup: Serpentine (yellower) → Green Apatite (middle) → Jadeite (cooler/darker). Three rocks, three temperatures. Don't keep all three unless the swatches clearly disagree.

Play lab: Masstone vs a long dilute. If it goes from near-ink jade to watery celadon, that's the stone. Beside Amazonite: teal vs forest-jade.

Dual advice: one jade-stone seat. vs Perylene Green (PBk31 pan): that is a black that looks green; this is a mineral that looks jade. vs Apatite: Apatite is the brown-settling olive; Jadeite is cooler, less sedimentary-brown.`,
    ace_history: `Jadeite is the pyroxene jade of imperial carving. PrimaTek mills it so a wash can keep a little of the rock. Catalog put PG7/PW6 on every "pale cool green." Lazy.`,
  },
  "ds-197-green-apatite": {
    pigment: "Genuine Green Apatite",
    notes:
      "PrimaTek Green Apatite Genuine SKU 197. Genuine green apatite (not PG7/PB15). Sedimentary: brown settles, green stays.",
    temp_role:
      "Warm-cool olive mineral · Green apatite · brown settles, green floats · sedimentary mixer",
    ace_note: `PrimaTek green apatite — mineral green forests with geology.

SKU 197. Apatite is a phosphate mineral (the same family as the blue apatite you already corrected in another family). DS: masstone almost brown-olive; in a wash the brown settles and a vivid natural green stays up. Fresh yellow-green to deep olive from one tube — that's why this is the PrimaTek mixer, even without a star in our flag.

Catalog PG7/PB15 is Cascade's recipe (phthalo green + phthalo blue). Wrong marriage. Apatite is geology, not two phthalos.

Play lab: Fat wet wash. Name the brown grit vs the green stain. If nothing settles, the sample is shy — still don't treat it as Cascade (that's earth+phthalo blue).

Dual advice: one apatite-olive mineral. vs Cascade/Christmas: those are dye+earth pine. vs Shire Olive: ceramic yellow+cerulean on paper. vs Jadeite/Amazonite: same PrimaTek aisle, different jobs (jade, teal, olive-sediment). Keep one rock unless you paint minerals on purpose.`,
    ace_history: `Apatite is a phosphate; green specimens get the landscape job. PrimaTek's pitch is the sedimentary split — brown out, green up — the same verb as Undersea, different actors. Catalog heard "green + granulating" and typed PG7/PB15.`,
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
if (nUp !== 5) {
  console.error("count", nUp);
  process.exit(1);
}

const greens = p.colors.filter((c) => c.family === "green");
const dual = greens.filter((c) => (c.ace_note || "").includes("Dual advice"));
const left = greens.filter((c) => !(c.ace_note || "").includes("Dual advice"));
console.log(`Green Dual advice: ${dual.length} / ${greens.length}`);
console.log("still open:", left.map((c) => c.id).join(", "));

p.updated = new Date().toISOString().slice(0, 10) + "-green-2ml-gran-mix-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("Green 2ml gran/mix applied:", nUp);
