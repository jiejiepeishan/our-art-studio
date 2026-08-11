/**
 * Apply red half-pan batch 1 (warm scarlets / earth / madder).
 * Cadmium Red Light intentionally omitted — pan sold; removed separately.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "pinax-pr255-pyrrol-scarlet": {
    temp_role:
      "Warm clean scarlet · Pyrrol (PR255) · fire-engine primary · staining · ◈",
    ace_note: `Fire-engine clean scarlet — modern pyrrol punch without muddy undertones.

PR255 is late-century organic fire: high chroma, clean warm scarlet, stains with purpose. Florals, warning accents, design punch without earth dirt. Same molecule family as Schmincke Vermilion half-pan — manners contest, one seat.

Dual advice: one PR255 scarlet (Pinax or Vermilion). Vs Geranium (PR253): both modern scarlets — swatch, don't stack three fires. Opaque cover reds are a different religion if you keep any.`,
    ace_history: `Pyrrol reds (PR255 family) are late-century organics prized for lightfast fire — the modern answer to mercury vermilion romance without the poison.`,
  },
  "sch-hp-365-vermilion": {
    temp_role:
      "Warm bright scarlet · PR255 \"vermilion\" · travel-tin heat · more body",
    ace_note: `PR255 vermilion half-pan — bright warm scarlet, distinct from earthy English Venetian red beside it in the travel tin.

Name says vermilion; chemistry is modern PR255, not cinnabar. Bright warm scarlet that sits next to English Red as heat vs brick — the original note's travel-tin lesson is the whole dual. More body than a pure stain wash.

Dual advice: same PR255 seat as Pinax Pyrrol Scarlet. Keep one. English Red is the earth opposite, not a twin.`,
    ace_history: `Vermilion once meant mercury sulfide; Horadam keeps the name on lightfast pyrrole chemistry. Creamy rewet for pocket tins.`,
  },
  "sch-hp-350-geranium-red": {
    temp_role:
      "Warm floral scarlet · Pyrrole geranium (PR253) · garden accent · staining",
    ace_note: `Bright geranium red — garden flowers and bold accents.

PR253 pyrrole scarlet aimed at garden florals and illustration pop — permanent clean red with a slight pink lean vs pure fire-engine PR255. Staining; great petals, loud in shadows if overdone.

Dual advice: modern warm scarlet seat with PR255 — one high-chroma warm red max in a tiny tin unless you paint only flowers.`,
    ace_history: `Geranium red (PR253) is modern pyrrole floral scarlet — permanent pop for illustrators. Horadam creamy rewet.`,
  },
  "sch-hp-english-red": {
    temp_role:
      "Warm earth red · Iron oxide (PR101) · terracotta / brick · not vermilion",
    ace_note: `Earthy PR101 Venetian red — terracotta brick warmth, not vermilion heat. Opaque and color-intense.

Iron oxide brick: architecture, tile, quiet warm structure. Won't give clean scarlet florals; will give walls and earth that feel solid. Cousin to transparent iron oxides in earth/brown families — here the opaque English/Venetian cut.

Dual advice: earth-red seat — not a second pyrrol scarlet. One brick red. Vs Madder Red Dark: earth opaque vs transparent wine-rose.`,
    ace_history: `English Venetian red (PR101) is calcined iron oxide — brick-and-terracotta tone British watercolourists used beside raw sienna on muddy Thames sketches.`,
  },
  "sch-hp-354-madder-red-dark": {
    temp_role:
      "Cool-warm deep rose-red · Quin (PR209) · wine-stain glaze · transparent",
    ace_note: `Deep madder rose — wine-stain florals and old-master shadows.

PR209 transparent quin red-rose — deep wine stain for florals and glaze shadows, not brick cover. "Madder" is mood; permanence is modern organic. Bridges toward cool carmine/ruby in batch 2 without being PV19.

Dual advice: transparent deep rose-red seat. Vs English Red: glow vs brick. Vs batch 2 Permanent Carmine / Ruby (PV19): different codes — swatch if you only keep one dark rose-red.`,
    ace_history: `Quinacridone reds (PR209) are transparent organics built for glow — modern glazing reds that keep florals luminous after true madder's fade.`,
  },
};

const REMOVE_IDS = new Set([
  "sch-hp-cadmium-red-light",
  "sch-hp-cadmium-yellow-light",
]);

const p = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));
const before = p.colors.length;

p.colors = p.colors.filter((c) => !REMOVE_IDS.has(c.id));
const removed = before - p.colors.length;
console.log("removed cadmium colors:", removed);

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

// Drop mix_tips that only point at deleted cadmiums (optional cleanup of refs)
for (const c of p.colors) {
  if (!Array.isArray(c.mix_tips)) continue;
  c.mix_tips = c.mix_tips
    .map((t) => {
      if (!t || !Array.isArray(t.with)) return t;
      const with2 = t.with.filter((id) => !REMOVE_IDS.has(id));
      if (with2.length === 0) return null;
      return { ...t, with: with2 };
    })
    .filter(Boolean);
}

if (typeof p.color_count === "number") p.color_count = p.colors.length;
p.updated =
  new Date().toISOString().slice(0, 10) +
  "-red-hp-b1-no-cadmium";

fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Red half-pan batch 1 applied: ${nUp}`);
console.log(`palette size: ${p.colors.length}`);
