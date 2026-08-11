/**
 * Apply handwritten purple · half-pan color cards
 * (Desktop purple-halfpan-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "mb-quin-violet": {
    temp_role:
      "Cool quin violet · PV19 dusk / floral purple · staining glaze · transparent",
    ace_note: `Italian violet with manners — cleaner than screaming quin purple, loves a wet-on-wet sky at dusk.

Same PV19 family as pink's cool roses, swung more violet than rose: lilac with blue, dusk sky wet-on-wet, botanical shadow that still stains true. "Manners" vs brilliant PR122 means less carnival fluorescent, more clean modern purple. Dose — staining remembers petals and clouds.

Dual advice: one PV19 primary across pink + purple if space is cruel (Rose Lake or this violet, not both plus three more). Keep both only when you deliberately want rose cut vs violet cut. Vs Brilliant Purple (PR122): different molecule, different temperature politics.`,
    ace_history: `Quinacridone violet (PV19) replaced fugitive aniline violets — the cool floral purple botanical artists finally trusted in full sun. Italian soft-wardrobe milling; twentieth-century molecule.`,
  },
  "sch-hp-367-purple-magenta": {
    temp_role:
      "Cool magenta-violet · PR122 floral primary · staining pink-purple",
    ace_note: `Cool magenta-violet — florals and shadows when basic magenta feels too warm.

PR122 cool primary energy: pink-violet for florals, clean purples with blues, shadows that lean magenta not brown. Cooler/more violet than a pure warm red-magenta; still louder than dusty Potter's Pink. Staining — sketch lights first.

Dual advice: one PR122 seat with Brilliant Purple half-pan (and Opera/Rose Dream in pink). Purple Magenta vs Brilliant Purple = chart cut / chroma costume — swatch, keep one. Don't stack three magentas.`,
    ace_history: `Quinacridone magenta (PR122) is a cool primary on modern mixing charts — pink-violet for florals and clean purples with blue. Purpur Magenta is Horadam's named cut; creamy rewet, industrial romance.`,
  },
  "sch-hp-922-brilliant-purple": {
    temp_role:
      "Cool high-chroma purple · PR122 brilliant cut · design / floral rebellion",
    ace_note: `Bright purple with opinion. Mix with cool yellow for muted violets, or let it solo for floral rebellion.

Same PR122 soul as Purple Magenta, marketing toward high-chroma designer violet. Solo for bold florals and graphic purple; with cool yellow → muted grey-violets (educational mud or useful shadow — your call). Staining opinionated.

Dual advice: manners contest with Purple Magenta — one well. Vs PV19 Quin Violet: PR122 is more magenta-pink; PV19 often cleaner violet-lilac. Vs PV55 Brilliant Red Violet: different code, redder electric seat.`,
    ace_history: `Brilliant purple (PR122) in Schmincke's high-chroma line targets designers who want cool violet punch — child of 20th-century organics, not Tyrian shellfish.`,
  },
  "sch-hp-940-brilliant-red-violet": {
    temp_role:
      "Cool electric red-violet · PV55 modern punch · ◈ floral / neon dusk",
    ace_note: `Electric cool violet-red — opera's quieter cousin. Stains with manners; florals and neon dusk love it.

PV55 is its own modern high-chroma red-violet lane — not PV19, not PR122 by another name. Electric florals, neon dusk, ◈ mixer energy for shadows and jewelry purples. "Quieter cousin" to Opera Rose: still loud, slightly more violet-serious. Catalog may note fluorescent lean — paint joy, test fade for archives.

Dual advice: specialist seat — keep if the electric red-violet swatch earns a well. Don't fire PV19 and PR122 and PV55 in a six-color tin; pick two max (e.g. one cool primary + one brilliant).`,
    ace_history: `Brilliant Red Violet sits in Horadam's modern high-chroma violet range — PV55 territory for painters who want punch without remixing primaries every time. Semi-transparent; contemporary, not medieval.`,
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
  new Date().toISOString().slice(0, 10) + "-purple-halfpan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Purple half-pan cards applied: ${nUp}`);
