/**
 * Apply handwritten green · granulating pans
 * (Desktop green-pan-granulating-draft.md).
 *
 * - 4 cards: Glacier, Green Shadows, Taiga Mist, Mint Dream
 * - Merge twin 963: keep sch-963-glacier-green, delete sch-tube-963
 * - Glacier pigment PG7/PW6 → PG50/PR233; toxicity medium (cobalt)
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");
const DELETE_ID = "sch-tube-963-glacier-green";
const GLACIER_KEEP = "sch-963-glacier-green";

const updates = {
  "sch-963-glacier-green": {
    pigment: "PG50/PR233",
    format: "pan · 5ml tube",
    toxicity: "medium",
    toxicity_habit:
      "Cobalt pigment (PG50) — wash hands after painting; keep food and drink away from the palette.",
    notes:
      "Horadam Supergranulating 963 Gletschergrün. Official PG50 + PR233 (not PG7/PW6). Pan + 5ml tube merged; deleted twin id sch-tube-963-glacier-green.",
    temp_role:
      "Cool icy mineral green · Cobalt turquoise + Potter's Pink · supergranulating climate · not milky phthalo",
    ace_note: `Pale icy green — glaciers, sea foam in winter.

This is not PG7 + titanium white. Supergranulating Horadam needs two granulating pigments. Official 963 is PG50 (cobalt turquoise / cobalt titanate — mineral teal) + PR233 (Potter's Pink — chrome-tin pink, the dusty rose you already know from MaimeriBlu). Ice-blue-green flocks one way; rose dust the other. That's why it looks like winter water and not like a highlighter.

Catalog PG7/PW6 was the "Glacier = phthalo + milk" guess. White does not supergranulate. Trust the split.

Behavior: non-staining, lightfast, the drama is in the dry. Don't stir. Thick vs dilute changes how loud the pink/teal divorce is. This will not mix clean spring greens like Phthalo — the pink is already in the marriage.

You already own Potter's Pink. Glacier is that pink invited into cobalt teal, bottled as weather.

Play lab (supergranulation): Wet cold-press. Drop, tilt once, walk away. If you stir, you paid Supergranulating prices for a grey-green soup.

Dual advice: one Glacier-green seat. Pan + 5ml tube = one well. vs Mint Dream: same "pale cool" glance, different soul — mineral split vs PW6+PG7 milk. vs Amazonite / Jadeite 2ml (also tagged PG7/PW6): gemstone marketing, later slice; don't promote three milky-green samples next to this. vs Glacier Brown / Blue: same climate line, different seats.`,
    ace_history: `Schmincke's Supergranulating sets (Glacier, Tundra, Galaxy, Deep Sea…) are 21st-century climate poetry: at least two granulating Horadam pigments, sold as landscape weather. Glacier Green is cobalt teal plus the 19th-century ceramic stain Potter's Pink (PR233) — tin glaze chemistry wearing a mountain label. Not a 1935 phthalo. Not milk.`,
  },
  "wn-760": {
    temp_role:
      "Cool shadowed green · Phthalo + white + Mars black · ready dusk foliage · granulating",
    ace_note: `Green Shadows brings cool green energy to the tin — worth knowing by temperature, not just by pretty swatch.

Nevskaya Palitra's granulating line: pigments of different size and weight that laminate as they dry. This one is the dusk well — phthalo green stained down with PBk9 (Mars/ivory-adjacent black; Nevskaya talks Mars black granulation) and lifted/veiled with PW6. Masstone can go velvety dark green; water pulls bluish and grey-green flocks.

Not Perylene. Perylene (PBk31) is a staining near-black with no white — botanical ink. This is a misty dark: black + green + milk. Faster than mixing Phthalo + black + a whisper of white; lazier if it becomes your only foliage shadow (paintings go one-note dusk).

Behavior: granulating, not a staining monster like pure PG7. The white makes tints a little chalky if you pile it. Paper tooth matters — Fin/Torchon shows off; hot-press will disappoint you.

Play lab: One fat bead, lots of water, don't touch. Look for the black grit vs the green stain. That's the recipe showing.

Dual advice: one ready-made shadowed-green seat. vs Perylene: ink vs mist. vs mixing Phthalo + earth/black yourself: this is speed; homework is livelier. vs Taiga Mist: Shadows is green+black dusk; Taiga is earth+blue pine. Two climates.`,
    ace_history: `White Nights' granulating series (Metamorphoses / "mist" and "shadow" names) is St. Petersburg selling particle physics as landscape: two–three pigments, different specific gravity, they un-mix on purpose. Green Shadows is the forest-at-evening convenience, not a single historic mineral.`,
  },
  "wn-761": {
    temp_role:
      "Cool pine-earth green · Iron earth + phthalo blue · taiga fog · not a PG7 leaf",
    ace_note: `Taiga mist — Siberian pines in morning fog.

Read the recipe. There is no green pigment in this pan. PBr7 (iron earth — raw/burnt family, the same class as your siennas and umbers) + PB15 (phthalo blue). Green is what happens when dirt meets staining blue. That's why it feels grounded, organic, a little khaki-pine, and why it granulates (earth grit vs dye).

Same idea as studio Christmas Tree Green (also PBr7/PB15, holiday tube) and cousin to Cascade Green (PB15/PBr7, DS, granulating). Three labels, one pine-from-earth-and-blue seat.

Behavior: granulating, low stain compared with a PG7 engine. Fog in dilute; forest floor in masstone. Will not give May's first-leaf. Will not give Glacier's ice-rose.

Play lab: Wet wash. Let the brown sediment and the blue wander. If they stay married, you used too little water.

Dual advice: one earth+phthalo-blue pine seat. Taiga Mist or Christmas Tree or Cascade — manners contest, not three wells. Holiday tube is dessert naming; Taiga is the climate name; Cascade is DS's granulating cut. vs Green Shadows: no black, no white — this is dirt+blue, not dusk-milk. vs 534 olive (PO62+PG7): that's phthalo green + orange. Hedge vs taiga.`,
    ace_history: `The taiga is the boreal pine belt across Russia. Nevskaya didn't grind Siberian needles; they married iron earth to phthalocyanine blue (1930s dye, again) and let the particles reenact fog in a forest. Christmas-tree marketing is the same chemistry in a Santa hat.`,
  },
  "wn-776-mint-dream": {
    temp_role:
      "Cool pastel mint · Titanium white + phthalo green · sea-glass / menthol · granulating milk",
    ace_note: `White Nights Mint Dream — full pan from St. Petersburg, Jul 7.

PW6 is in the room. Titanium white + PG7 = menthol, sea-glass, illustration mint. Granulation is the phthalo staining away from the white body — a gentler divorce than Glacier's two minerals. Nevskaya pitches cool mint that, with water, can flash emerald/turquoise notes.

This is a subject / pastel well, not an engine. It will chalk if you glaze like a transparent. It will look cute on hot-press and more mineral on rough.

You already have the PG7 engine. Mint is what happens when someone is afraid of that engine and adds milk. Valid for glass, sweets, mint leaves, calm backgrounds. Not valid as a third phthalo hat next to Helio + May + this.

Play lab: Dilute until it almost disappears. If a green halo walks away from a milky puddle, that's PG7 leaving PW6. Don't stir them back together if you wanted the dream.

Dual advice: one milky-phthalo-green seat. vs Glacier: not the same — Glacier is PG50+PR233 ice-rose; Mint is candy milk. Keep Glacier for weather, Mint for illustration, or pick one pale-cool. vs Amazonite/Jadeite 2ml: later, same "white+green" suspicion. Don't own four sea-glasses.`,
    ace_history: `Mint Dream sits in White Nights' newer granulating / Metamorphoses storytelling — menthol as a mood, not a plant. Titanium white (20th-century opaque light) plus the 1935 mixing monster, domesticated into a pastel. The "dream" is the milk.`,
  },
};

const p = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));

const before = p.colors.length;
p.colors = p.colors.filter((c) => c.id !== DELETE_ID);
const removed = before - p.colors.length;
if (removed !== 1) {
  console.error("expected to remove 1 glacier twin, removed", removed);
  process.exit(1);
}

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

for (const c of p.colors) {
  if (!Array.isArray(c.mix_tips)) continue;
  c.mix_tips = c.mix_tips
    .map((t) => {
      if (!t || !Array.isArray(t.with)) return t;
      const with2 = t.with.map((id) => (id === DELETE_ID ? GLACIER_KEEP : id));
      const seen = new Set();
      const deduped = with2.filter((id) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      return { ...t, with: deduped };
    })
    .filter((t) => t && t.with && t.with.length);
}

const g = p.colors.find((c) => c.id === GLACIER_KEEP);
console.log("Glacier", g.pigment, g.format, g.toxicity);
console.log("cards", nUp, "removed twin", removed, "size", p.colors.length);

p.color_count = p.colors.length;
p.updated =
  new Date().toISOString().slice(0, 10) + "-green-pan-granulating-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("Green granulating pans applied:", nUp);
