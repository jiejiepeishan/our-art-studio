/**
 * Apply handwritten neutral · pan color cards
 * (Desktop neutral-pan-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "wn-466": {
    temp_role:
      "Cool mist grey · Carbon + white · granulating mountain fog / atmosphere",
    ace_note: `Mountain mist — cloudy granulating gray-blue atmosphere.

Play lab (granulation): Same fog job as Morning Mist half-pan: PW6 lifts soot into cloud. Full pan = big atmospheric passages — ridges dissolving, breath over water, soft value without Payne's blue-steel punch. Wet cold-press, tip once, leave the flocks. Cloudy gray-blue read comes from dilute carbon + paper, not from a named phthalo.

Dual advice: one mist-grey seat (Mountain Mist or Morning Mist or grey-family mists). Full pan vs half-pan = faucet. Don't use as structural black.`,
    ace_history: `St. Petersburg granulating mist specials — carbon and white for sedimentary weather. Landscape atmosphere in a full pan, not a moral dark.`,
  },
  "wn-467": {
    temp_role:
      "Near-black carbon · Granulating lamp black · textured abyss · not flat ink",
    ace_note: `Black mystery — granulating dark with secrets.

Play lab (granulation): Pure PBk6 that refuses to be a flat poster black — sediment secrets on rough paper, night water with grit, charcoal that still breathes. Thick washes sparkle-dark; dilute goes soft charcoal grey. Still deadens if it replaces every chromatic shadow — mystery isn't a free pass to kill color.

Dual advice: granulating black seat vs Ivory Black (warmer, less grit theater) vs Deep Sea/Galaxy/Glacier blacks (tubes later). One textured black for the tin if you love demos; otherwise mix darks.`,
    ace_history: `Carbon/lamp black with Nevskaya "mystery" marketing for granulating specialty darks — strong, often cool, easy to overuse in skies. The secret is texture, not cruelty.`,
  },
  "rosa-747": {
    temp_role:
      "Warm near-black · Carbon + iron · grape-skin / sepia-adjacent pocket dark",
    ace_note: `Black Grape brings near-neutral dark energy to the tin — worth knowing by temperature, not just by pretty swatch.

Read past the generic line: PR101 kisses carbon toward warm grape-skin / dried blood-brown black — closer to Sepia than to cool Payne's. Pocket monochrome, vintage album, warm ink line without naming sepia. Not a pure value black; not Ivory's bone warmth exactly — iron-sweetened soot.

Dual advice: warm convenience dark with Sepia half-pan — one vintage/warm black story. Vs Black Mystery: Mystery is cooler granulating carbon; Grape is warmer iron-black. Travel tin: pick one.`,
    ace_history: `Carbon black plus iron oxide is an old recipe for warm darks (sepia cousins). Rosa's "Black Grape" sells the fruit; the paper shows iron and soot.`,
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

p.updated = new Date().toISOString().slice(0, 10) + "-neutral-pan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Neutral pan cards applied: ${nUp}`);
