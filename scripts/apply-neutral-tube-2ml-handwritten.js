/**
 * Apply handwritten neutral · tubes + 2ml
 * (Desktop neutral-tube-2ml-draft.md, approved).
 * Completes neutral family handwritten pass.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-tube-955-deep-sea-black": {
    temp_role:
      "Near-black abyss · Bone black + manganese violet whisper · Deep Sea sediment",
    ace_note: `Schmincke Deep Sea Black — granulating trench dark. Check 5ml tube vs any 2ml sample twin in your set.

Play lab (granulation): Deep Sea line wants abyss with texture — PBk7 bone/ivory character plus PV16 manganese violet hush so the black isn't dead flat carbon. Night water under Deep Sea Blue/Indigo, rocky coast shadows. Tilt, don't scrub. Still: one squeeze kills a sky if you're careless.

Dual advice: Deep Sea / Galaxy / Glacier blacks share one specialty granulating black seat with Black Mystery pan. Pick the series mood you paint (marine / cosmic / ice); don't own three abyss tubes "for science."`,
    ace_history: `Bone/ivory blacks (PBk7) are warmer historical darks; Deep Sea dresses them for submarine demos with a violet mineral whisper. Not plant ink — modern trench theater.`,
  },
  "sch-tube-975-galaxy-black": {
    temp_role:
      "Near-black cosmos · Bone black + violet · granulating star-dust dark",
    ace_note: `Galaxy black — granulating abyss dark, not flat carbon.

Play lab (granulation): Same PBk7/PV16 neighborhood as Deep Sea Black — noir galaxie marketing for star-dust sediment. Night florals under Galaxy Rose, abstract pours, anything that wants black with a constellation habit. Cousin to Galaxy Blue/Brown/Rose: respect the drama.

Dual advice: twin chemistry to Deep Sea Black — series costume, one role. Swatch side by side; keep the grit you love.`,
    ace_history: `Horadam Galaxy line: sedimentary specials with cosmic names. Bone black + manganese violet energy for textured darks, not pure lamp cruelty.`,
  },
  "sch-tube-965-glacier-black": {
    temp_role:
      "Near-black ice · Straight bone black · granulating cold dark",
    ace_note: `Schmincke Glacier Black — granulating ice-dark. Check 5ml tube vs any 2ml sample twin in your set.

Play lab (granulation): Cleaner PBk7 story (no PV16 in the line) — cold charcoal sediment for ice shadows, stone, winter trees. Glacier series manners: texture without the violet hush of Deep Sea/Galaxy. Still not a free black for every mix.

Dual advice: third costume of the same specialty-black seat. Vs Ivory Black half-pan: Ivory is denser travel black; Glacier is tube grit for demos. One bone-black habit.`,
    ace_history: `Bone/ivory black in Glacier specialty milling — ice-name marketing, warm-historical black chemistry, granulating hobby.`,
  },
  "wn-tube-paynes-gray": {
    temp_role:
      "Cool convenience grey · Phthalo + black + quin · polite shadow · ◈",
    ace_note: `The polite dark — cool grey-blue for shadows without killing the wash. One squeeze replaces three muddy mixes.

Classic Payne's job with a modern British blend: phthalo cool, carbon body, violet whisper. Polite compared to pure black; still staining — dose. Storm shadows, mountain cools, quick value. Home-kit workhorse energy.

Dual advice: one Payne's across W&N tube, MG sample, Schmincke Bluish pan. W&N if you already live in Professional tubes; don't stack three Payne's. Prefer chromatic greys when learning temperature.`,
    ace_history: `Named for William Payne's shadow habit; modern tubes use blue/black/violet conveniences. W&N Professional keeps the polite dark on the British chart.`,
  },
  "mg-128-paynes-gray": {
    temp_role:
      "Cool-warm convenience grey · Ultramarine + black · honey Payne's sample",
    ace_note: `Honey-based Payne's gray — soft neutral, stays juicy on paper.

PBk6 + PB29: more ultramarine cool-warm than phthalo-steel W&N — softer, honey bloom, sample-size try-on. Juicy shadows; less laser-teal risk than heavy phthalo Payne's. Still convenience grey — can dull a painting if it's the only dark.

Dual advice: Payne's manners contest with W&N and Schmincke Bluish. MG if honey + ultramarine bias wins the swatch. One well.`,
    ace_history: `Payne's grey ~1800 British watercolour convenience; M. Graham's honey keeps the mix open and rewettable. Ultramarine in the blend is a classical blue-black path.`,
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
  console.error("Missing ids:", missing.join(", "));
  process.exit(1);
}
if (nUp !== Object.keys(updates).length) {
  console.error(`Expected ${Object.keys(updates).length} updates, got ${nUp}`);
  process.exit(1);
}

const neu = p.colors.filter((c) => c.family === "neutral");
const dual = neu.filter((c) => (c.ace_note || "").includes("Dual advice"));
console.log(`Neutral Dual advice: ${dual.length} / ${neu.length}`);

p.updated =
  new Date().toISOString().slice(0, 10) + "-neutral-tube-2ml-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Neutral tube+2ml cards applied: ${nUp}`);
