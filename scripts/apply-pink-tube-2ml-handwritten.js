/**
 * Apply handwritten pink · tubes + 2ml samples
 * (Desktop pink-tube-2ml-draft.md, approved).
 * Completes pink family handwritten pass.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "mg-156-quin-rose": {
    temp_role:
      "Cool quin rose · PV19 primary · honey bloom · staining floral workhorse",
    ace_note: `THE quin rose — honey base makes it bloom on wet paper.

Same cool PV19 seat as Rose Lake, Pinax Quin Rose, Magenta Rose — honey open time and 15ml volume for people who live in florals. Staining petal memory; clean purples with blue; portrait blush that means it. "THE" is deserved only until you swatch and pick one PV19 for the tin.

Dual advice: one PV19 across all formats. MG if honey is your religion; half-pan/pan if travel wins. Don't stock MG + Rosa + MB as three primaries.`,
    ace_history: `Quinacridone rose PV19 with honey binder — Graham's Oregon revival of honey watercolour manners on a modern molecule. Floral pink with rewet romance.`,
  },
  "mg-192-ultramarine-pink": {
    temp_role:
      "Dusty mineral pink · Ultramarine pink (PV15) · granulating softener · ◈",
    ace_note: `Dusty rose with mineral freckles — not a screaming pink, a thoughtful one. Gorgeous for florals that need texture and soft skies with a blush.

Play lab (granulation): PV15 is a sulfur-silicate cousin of ultramarine blue — mineral freckles, soft lift, not flat stain. Wet cold-press for dusty rose sediment; with ultramarine blue → soft granulating lavenders; with ultramarine violet deep → layered mineral violets. Closer in mood to Potter's Pink (thoughtful dust) than to Opera (scream), but chemistry is its own family.

Dual advice: unique seat — not a PV19 substitute. Keep if you love mineral texture; skip if PR233 Potter's Pink already does soft dust and you need space. One ultramarine pink is enough.`,
    ace_history: `Ultramarine pink (PV15) — modern mineral pink that granulates instead of staining flat. Honey slip; the freckles are the point.`,
  },
  "sch-tube-971-galaxy-rose": {
    temp_role:
      "Deep granulating rose · Magenta + black · cosmic night pink",
    ace_note: `Granulating galaxy rose — cosmic sediment on wet paper.

Play lab (granulation): PBk6 is invited — darker, chroma-killing, star-dust rose for night florals and moody underpainting. Wet-in-wet planetarium pink; dangerous in a clean skin mix. Cousin to Galaxy Blue / Galaxy Brown logic: respect the black. Louder dark than Potter's Pink Deep; less pure than PV19.

Dual advice: effect / night seat with Rose Dream (milky PR122) and Opera (bright PR122). Galaxy = dark + grit. One black-kissed rose max.`,
    ace_history: `"Rose galaxie" — PR122 magenta plus carbon black with sedimentary marketing. Cosmic optional; pigment codes required.`,
  },
  "ds-237-rose-madder": {
    temp_role:
      "Cool-warm rose blend · \"Permanent madder\" convenience · staining glaze",
    ace_note: `Permanent rose madder — classic cool pink.

Name says madder; chemistry is modern blend (PR209 + PV19) — permanent stand-in for fugitive rose madder legends. Cool-to-warm pink for florals and classical glaze stacks. Staining lean possible; sample to learn the bias vs pure PV19.

Dual advice: convenience rose seat near PV19 primaries — if you already own THE quin rose, this is optional "madder mood." Don't collect three permanent madders.`,
    ace_history: `Historic rose madder was beautiful and heartbreaking (fugitive). "Permanent" modern recipes use quin/organic blends so the romance survives light. DS sample: test the glow, trust the codes.`,
  },
  "ds-132-rose-peach": {
    temp_role:
      "Soft peach-rose · Quin blend · skin, petals, sunrise",
    ace_note: `Peachy rose — delicate skin, petals, sunrise.

Same broad PR209/PV19 neighborhood as Rose Madder Permanent, swung peachier and higher-key — sunrise skin, soft petals, less "classical cool pink." Portrait convenience; not Potter's Pink mineral dust, not Naples Rose iron-cream (different pigments).

Dual advice: peach-rose seat with Naples Rose pan — swatch which peach you mean (quin glow vs Naples chalk). One soft peach-pink in a small tin.`,
    ace_history: `Modern quin reds with violet for portrait/botanical convenience — sunrise naming, not a single historic mineral.`,
  },
  "ds-167-rhodonite": {
    temp_role:
      "Dusty mineral rose · PrimaTek rhodonite mood · geological blush",
    ace_note: `PrimaTek rhodonite — dusty rose mineral, tender and geological.

Label romance is gemstone; listed chemistry PR101 iron oxide — brick/terracotta family swung pink-dusty. Tender geological blush for rocks, muted florals, "stone rose" not candy. Not PV19 clean violet-maker; not Opera.

Dual advice: mineral dusty seat near Potter's Pink PR233 — different codes, similar soft mission. Keep Rhodonite when the swatch is clearly earthier/iron; keep PR233 when ceramic glaze softness wins. PrimaTek dessert, not a second primary pink.`,
    ace_history: `Rhodonite is a real manganese-pink mineral; PrimaTek sells place-mood. This SKU's PR101 listing means trust iron-oxide behavior for mixes — poetry on the label, oxide on the paper.`,
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

const pink = p.colors.filter((c) => c.family === "pink");
const dual = pink.filter((c) => (c.ace_note || "").includes("Dual advice"));
console.log(`Pink Dual advice: ${dual.length} / ${pink.length}`);

p.updated = new Date().toISOString().slice(0, 10) + "-pink-tube-2ml-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Pink tube+2ml cards applied: ${nUp}`);
