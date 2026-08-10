/**
 * Apply handwritten orange + blue haul leftovers
 * (Desktop orange-blue-leftovers-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "ds-152-quin-burnt-orange": {
    temp_role:
      "Warm transparent burnt-orange · Quin/perinone fire · glaze sienna · ◈",
    ace_note: `Sienna energy with quin clarity — glows in thin wash, smokes in mass tone. Classic with French Ultramarine for storm skies.

PO48 territory (same broad family as Transparent Orange): transparent heat that behaves like burnt sienna's glamorous cousin — less dirt, more stained-glass roast. Thin = sunset brick glow; mass = smoky orange-brown. Storm greys with French Ultramarine are textbook; florals and autumn canes love it. Staining — the fire remembers.

Dual advice: one transparent warm-orange/sienna-glow seat with DS Transparent Orange and earth burnt siennas. Keep Quin Burnt Orange when you want clarity in the roast; keep mineral sienna when you want granulating dirt. Don't fill three "warm brown-orange" wells.`,
    ace_history: `Quinacridone / perinone burnt oranges are modern organic fire — transparent answer to opaque earth oranges. DS Extra Fine packaging; the storm-sky recipe is older than the molecule.`,
  },
  "sch-fp-359-saturn-red": {
    temp_role:
      "Warm high-chroma orange-red · Modern organic (PO64) · accent without cadmium",
    ace_note: `Warm modern orange-red — high chroma accent without cadmium drama.

PO64 sits between traffic orange and brick red — poster-bright accent for design, fruit, warning light, fashion. Staining punch; not a quiet earth. Name "Saturn" is planetary marketing for industrial chroma in a Horadam full pan.

Dual advice: accent seat — not your only red, not your burnt sienna. Vs pyrrole/scarlet reds (red family later): different chemistry, similar "loud warm" job — one tyrant accent per tin. Vs Quin Burnt Orange: Saturn is more opaque-chroma orange-red; quin is glaze roast.`,
    ace_history: `Late-century organic orange-reds brought high chroma into the tin without cadmium's opacity politics. Saturnrot is Horadam's named cut of that industrial sunshine.`,
  },
  "qor-indigo": {
    temp_role:
      "Cool near-black indigo · Indanthrene + black · night water / deep shadow",
    ace_note: `Cool near-black blue for night water and deep shadows.

PB60 indanthrene indigo soul plus PBk6 — deeper and more chroma-killing than Schmincke half-pan Indigo alone. QoR Aquazol slip (snappy, modern) vs Horadam cream. Night water, cloak shadows, near-black structures; respect the black in skies. Staining lean — plan lights.

Dual advice: deep cool seat with Schmincke Indigo, Prussian, Deep Sea Indigo, Galaxy Blue. QoR Indigo = indigo + black convenience dark. One near-black blue habit; don't stack with Van Dyck + Galaxy + this as four "just make it dark" wells.`,
    ace_history: `QoR (Golden) Aquazol indigo for contemporary night — PB60 tradition with carbon black for trench depth. Earth-set workhorse energy, not plant-vat folklore.`,
  },
  "sch-479-helio-cerulean": {
    temp_role:
      "Cool phthalo sky · \"Helio cerulean\" (PB15:3) · staining bright · not milky mineral cerulean",
    ace_note: `Clean phthalo-family sky blue — bright, staining, mixes sharp greens. Not granulating milky cerulean; modern 'helio' punch.

Read the warning twice: this is not PB35/PB36 milky cerulean. PB15:3 green-shade phthalo wearing sky marketing — bright, staining, laser greens with yellow, jewel water. Studio owns half-pan + full pan = one color, two faucets. Vs half-pan Cerulean Blue (mineral milk): opposite manners. Vs Glacier Blue / Winsor Blue GS: same cool phthalo kingdom.

Dual advice: one cool phthalo-blue seat. Keep mineral cerulean for soft horizons; keep Helio for modern punch. Don't buy "cerulean" by name alone — check the code.`,
    ace_history: `Horadam "Helio / Heliocöelin" points at 20th-century phthalocyanine sky blues — the loud cousin of soft cobalt and tin-oxide ceruleans. Name says sky; molecule says phthalo.`,
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

for (const fam of ["orange", "blue"]) {
  const all = p.colors.filter((c) => c.family === fam);
  const dual = all.filter((c) => (c.ace_note || "").includes("Dual advice"));
  console.log(`${fam}: ${dual.length} / ${all.length}`);
}

p.updated =
  new Date().toISOString().slice(0, 10) + "-orange-blue-leftovers-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Orange+blue leftover cards applied: ${nUp}`);
