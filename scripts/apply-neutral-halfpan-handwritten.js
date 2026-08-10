/**
 * Apply handwritten neutral · half-pan color cards
 * (Desktop neutral-halfpan-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-hp-ivory-black": {
    temp_role:
      "Warm-lean bone black · PBk9 value dark · gentler than lamp soot",
    ace_note: `Not pure evil black — slightly warm, slightly gentle. Mixes into neutrals better than lamp black ever did.

PBk9 (bone/ivory black tradition): warmer, softer soot story than pure lamp PBk6. Good for ink-adjacent lines, soft charcoal mood, mixing quiet darks. Still deadens skies if it replaces all chromatic blacks — use with manners. Staining lean — sketch structure lightly first.

Dual advice: one black well max in a small tin (Ivory or Neutral Tint or rely on mixed darks). Vs Sepia: black is neutral-warm; sepia is brown-vintage. Vs Payne's Grey: Payne's is blue-cool convenience.`,
    ace_history: `Ivory black was charred bone before modern substitutes; warm PBk9 still echoes Old Master "never pure lamp black in the sky." Elfenbeinschwarz keeps the name and the gentler temperature.`,
  },
  "sch-hp-588-neutral-tint": {
    temp_role:
      "Cool-lean convenience dark · Black + quin whisper · quick value without mud",
    ace_note: `Pre-mixed neutral — quick value shifts without muddy tri-color mixing.

PBk6 + PV19: carbon dark with a violet-rose whisper so it doesn't always go dead-green in mixes. Transparent enough for glazing value down; staining — the shadow remembers. Fast tool for lowering chroma and shifting value when you're tired of remixing three pans.

Dual advice: convenience dark seat with Ivory Black and Payne's. Neutral Tint is the glaze-down habit; Ivory is denser black; Payne's is blue-steel. One convenience dark + chromatic mixing is enough.`,
    ace_history: `Carbon blacks are soot-descended and strong; adding a touch of quin keeps the neutral from killing every mix. Horadam Neutraltinte is speed for serious painters who still know how to mix.`,
  },
  "sch-hp-sepia": {
    temp_role:
      "Warm vintage dark · Sepia (black + iron) · ink line & aged atmosphere",
    ace_note: `Instant vintage. Warm sepia lines and aged atmospheres. Stains, so sketch lightly first.

Not a pure earth brown — black + iron red convenience for album sketches, old maps, monochrome studies, warm ink energy. Staining: commit or lift early. Gorgeous for "found in a Victorian drawer"; deadly if every landscape goes tea-stain brown.

Dual advice: monochrome / line seat — not a substitute for burnt umber structure or transparent brown glaze. One sepia. Vs Ivory Black: sepia is brown-story; ivory is neutral-dark.`,
    ace_history: `Sepia once meant cuttlefish ink; modern chemistry clones the warm brown with iron and carbon. Victorian albums and atmospheric sketches ran on this mood — Sepiabraun keeps the romance and the stain.`,
  },
  "rs-415": {
    temp_role:
      "Cool mist grey · Black + white · granulating dawn fog",
    ace_note: `Morning mist — granulating dawn fog over Polish fields.

Play lab (granulation): PW6 lifts carbon into fog — wet cold-press, tip, let grey dust settle into dawn over fields. Soft atmosphere, distant trees, breath on glass. Not a mixing black; not Hematite's iron sparkle (different grit story). Closer to Hermit Mist / Glacier mist logic from earth, but cooler soot-white.

Dual advice: atmosphere grey seat with grey-family Neutrals and Mists. One fog pan. Don't use when you needed Ivory Black structure.`,
    ace_history: `Carbon plus titanium white for sedimentary mist — Roman Szmal's field-fog poetry over Polish landscape marketing. Granulation is the point; pure black is not.`,
  },
  "sch-hp-102-titanium-opaque-white": {
    temp_role:
      "Opaque body white · Titanium (PW6) · highlights, corrections, gouache passages",
    ace_note: `Opaque body white — highlights, corrections, and gouache-style passages.

PW6 covers: whiskers, catchlights, rescued edges, mixed pastel tints, gouache-adjacent body color. Watercolor purists use sparingly; illustrators live here. Not a glaze white (use paper); not Silver sparkle (specialty). Rewet politely — opaque whites can chalk if abused.

Dual advice: one body white. Don't confuse with mist pans that contain white (Morning Mist, Hermit Mist) — those are grey/earth atmospheres, not highlight tools. Last-layer highlights after darks dry.`,
    ace_history: `Titanium white is the modern opaque light — strong coverage where zinc was gentler and lead was toxic history. Titan-Deckweiß is body color honesty in a half-pan.`,
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

p.updated =
  new Date().toISOString().slice(0, 10) + "-neutral-halfpan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Neutral half-pan cards applied: ${nUp}`);
