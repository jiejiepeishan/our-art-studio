/**
 * Apply handwritten red · pan color cards (Desktop red-pan-draft.md).
 * No cadmium kit language.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-fp-363-scarlet-red": {
    temp_role:
      "Warm high-chroma scarlet · Pyrrole (PR254) · full-pan fire · staining",
    ace_note: `Modern screaming scarlet (PR254). High impact florals, signage, anything that needs to be noticed from across the room.

PR254 is modern lightfast fire-engine red — cleaner than many earth reds, staining enough to commit. Full pan = stop rationing poppies. Same molecule family as Rosa Bright Red — one seat.

Dual advice: one PR254 with Rosa Bright Red. Vs half-pan PR255 Pyrrol/Vermilion: close warm scarlets — swatch, don't stack three fire engines.`,
    ace_history: `Pyrrole red (PR254) — late-century lightfast fire for florals and design. Horadam full pan; creamy rewet.`,
  },
  "rosa-740": {
    temp_role: "Warm screaming scarlet · PR254 pocket · poppies & courage",
    ace_note: `Screaming bright red — poppies and courage.

Same PR254 job as Scarlet Red full pan — Ukrainian single-pan pocket fire. Staining poppies; courage in a small well.

Dual advice: Scarlet Red full pan or Bright Red single pan — one PR254. Travel vs desk faucet.`,
    ace_history: `Pyrrole red (PR254) modern lightfast fire-engine — cleaner mixes than many earth reds; staining intention.`,
  },
  "sch-fp-649-english-venetian-red": {
    temp_role:
      "Warm earth brick red · PR101 full-pan twin · terracotta structure",
    ace_note: `Full-pan Venetian red — earthy brick warmth in the large format you actually paint from.

Same English Venetian / PR101 seat as half-pan English Red — brick, terracotta, structure, not vermilion heat. Full pan = architecture sessions without scraping the half-pan bare. One color, two faucets.

Dual advice: half-pan + full pan = one well. Not a second scarlet.`,
    ace_history: `Mars/Venetian reds (PR101) — calcined iron oxide for brick, terracotta, and portrait underpainting. Horadam full-pan stockpile.`,
  },
  "wn-325": {
    temp_role:
      "Cool-warm wine red · Claret blend · velvet shadows / Bordeaux mood",
    ace_note: `Bordeaux claret — wine-stain red for velvet shadows.

Convenience wine red (PR83 + PR170 family listing) — Bordeaux velvet shadows and Eastern European still-life mood. Not clean pyrrole scarlet; not pure perylene glaze. Can be less lightfast than modern quins depending on PR83 content — lovely for work; check if archives need A-rated wine (perylene/PR209).

Dual advice: wine-shadow seat with Perylene Maroon/Dark and Madder Red Dark. One deep wine. Claret is the romantic blend; perylene is the modern glaze workhorse.`,
    ace_history: `Claret echoes Bordeaux wine stains — Nevskaya Palitra convenience for velvet shadows and still-life tradition.`,
  },
  "wn-389-scarlet-mist": {
    temp_role:
      "Warm scarlet mist · Multi-pigment granulating · wet-on-wet florals",
    ace_note: `White Nights Scarlet Mist — full pan from St. Petersburg.

Play lab (granulation): Mist-line separation — scarlet sparks and cooler mineral trails on wet paper. Don't over-stir; let florals render themselves. Effect pan, not your only warm red primary.

Dual advice: weather/floral effect seat with Purple Mist / Rose Mist cousins. One scarlet mist. Keep PR254 or PR255 for clean fire without multi-pigment gossip.`,
    ace_history: `Scarlet Mist is White Nights' granulating mist line — wet-on-wet florals where pigment separation does the rendering. Multi-pigment convenience, Russian sedimentary theater.`,
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
  console.error("count mismatch", nUp);
  process.exit(1);
}

p.updated = new Date().toISOString().slice(0, 10) + "-red-pan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("Red pan cards applied:", nUp);
