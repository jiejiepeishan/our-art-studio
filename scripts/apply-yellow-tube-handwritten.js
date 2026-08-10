/**
 * Apply handwritten yellow · tube color cards
 * (Desktop yellow-tube-draft.md, approved — no batch-date stamps in ace_note).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "mg-107-hansa-yellow": {
    temp_role:
      "Cool lemon · Hansa PY3 primary · honey slip · spring-green maker",
    ace_note: `Cool lemon energy with honey slip — the clean yellow for spring greens and sunny glazes. Don't expect it to sit still; it mixes like it has somewhere to be.

Same cool PY3 seat as Schmincke lemon half-pans: electric spring with phthalo blue (tiny blue, lots of yellow), clean orange with scarlet pyrrol. Honey = open time, bloom, rewet hunger. Transparent enough to glaze sun through paper; not cadmium butter.

Dual advice: one cool lemon across MG tube + Schmincke half-pans + W&N Lemon Deep. Swatch honey vs Horadam cream; keep one well in the travel tin.`,
    ace_history: `Hansa/arylide PY3 — early 20th-century bright yellow without chrome poison. M. Graham's chapter is binder: cool primary with honey manners.`,
  },
  "wn-tube-lemon-yellow-deep": {
    temp_role:
      "Warm-leaning lemon · PY3 sunshine · British professional 5ml",
    ace_note: `Warm lemon — opaque-leaning sunshine.

Still PY3 family, but "Deep" and the card's opaque lean mean it may read less ice, more sun than a pure cool Hansa glaze yellow. Good for bold flower centers and designy light; test greens — if they go slightly mustard vs MG Hansa, you found the bias.

Dual advice: lemon seat with MG Hansa / Schmincke lemons. W&N if you already live in Winsor primaries; don't stack three PY3 tubes.`,
    ace_history: `W&N Professional lemon line — generations of British chart yellow. PY3 chemistry, studio staple packaging, "Deep" as the warmer cut of lemon marketing.`,
  },
  "sch-tube-212-chromium-yellow-light": {
    temp_role:
      "Warm-light mid yellow · Arylide PY74 Hue · cadmium-free bright",
    ace_note: `Schmincke Chromium Yellow Hue Light — cadmium-free warm-light mid. Check 5ml tube vs any 2ml sample twin in your set.

Hue + PY74 — not historic toxic chrome. Lighter cut of the arylide mid-yellow pair (vs Deep). Design punch, clean mid light, tube twin of any sample. Cooler/lighter than Deep; warmer than pure PY3 lemon.

Dual advice: Light + Deep = one PY74 seat unless you paint both high-key signs and autumn gold weekly. Cadmium-free set logic: pick Light or Deep + Pure, not all three mid-golds.`,
    ace_history: `Arylide PY74 as workhorse organic mid yellow — Horadam "Chromgelbton" sells vintage chrome temperature with modern safer chemistry.`,
  },
  "sch-tube-213-chromium-yellow-deep": {
    temp_role:
      "Warm golden mid yellow · Arylide PY74 Hue deep · tube twin of half-pan",
    ace_note: `Schmincke Chromium Yellow Hue Deep — warm golden mid. Check 5ml tube vs any 2ml sample twin in your set.

Tube twin of half-pan Chrome Hue Deep already shipped: warm golden mid, autumn path light, gaslight mood without PY34 poison. Same dual advice as the half-pan — one role with Light and Cad/Pure competitors.

Dual advice: half-pan + tube = one color. Vs Cad Yellow Light half-pan: Hue is organic mid; Cad is heavy butter.`,
    ace_history: `Same PY74 Hue story as the half-pan — gilt-frame temperature, modern mill, tube for bigger washes.`,
  },
  "sch-tube-216-pure-yellow": {
    temp_role:
      "Warm-mid transparent primary · PY138 Reingelb · tube twin of half-pan",
    ace_note: `Schmincke Pure Yellow — clean cadmium-free mid primary. Check 5ml tube vs any 2ml sample twin in your set.

Tube twin of half-pan Pure Yellow: cadmium-free mixing primary between lemon ice and deep gold. Florals, general light, greens that aren't mint or mustard.

Dual advice: one Pure Yellow faucet. Vs WN Isoindoline full pan (PY139): both modern mids — swatch, keep one bright primary mid.`,
    ace_history: `PY138 Horadam pure primary — clean mixes without cadmium push. Tube is volume logistics.`,
  },
  "mg-104": {
    temp_role:
      "Warm honey yellow · Home-kit sunshine · primary until label pinned",
    ace_note: `Warm honey yellow from the home tin — primary sunshine until we pin the exact tube name.

Studio reality check on the card: home-kit MG104, notes say superseded in the kit by MaimeriBlu Naples for that slot — so this tube may be backup sunshine, not current tin royalty. Warm transparent honey yellow for general light; don't confuse with cool Hansa (MG107) next to it.

Dual advice: if Hansa already owns cool lemon and Naples owns soft corrector, MG104 is optional warm primary. Confirm official product name when you next photo the tube; Ace can rename the card later without shame.`,
    ace_history: `Honey-bound warm yellow in the M. Graham system — modern PY chemistry, home-kit logistics, the "until we pin the label" honesty is more useful than fake precision.`,
  },
  "ds-15ml-hot-mulled-cider-yellow": {
    temp_role:
      "Warm spiced gold · Nickel azo (PY150) holiday · festive subject yellow",
    ace_note: `DS holiday Hot Mulled Cider Yellow — festive 15ml, paint something ridiculous and beautiful.

PY150 (nickel azo) often reads rich transparent gold-brown-yellow — spiced cider, autumn drinks, cozy illustration. Holiday SKU energy: allowed to be extra. Not your color-wheel lemon; not Naples chalk. With blue → complex olives; alone → mulled warmth.

Dual advice: specialty / seasonal seat. Don't fire Pure Yellow for this. Keep when you paint festivals and food; leave out of a six-color serious primary tin.`,
    ace_history: `Daniel Smith holiday shades are studio fun with serious pigment underneath — PY150 has a real life as modern gold-yellow, wearing cider marketing once a year.`,
  },
  "wn-tube-quinacridone-gold": {
    temp_role:
      "Warm transparent gold · Quin gold (PO49) · glaze autumn / honey light",
    ace_note: `Transparent golden glow — modern alternative to fugitive Indian yellow myths.

Classic quin gold job: whiskey light, autumn leaves, skin warmth, broken neutrals with blue. Staining transparent — permanent glow. Cousin to Schmincke quin gold hue in orange family if you own it — same broad seat, don't double.

Dual advice: one quin-gold / transparent gold-orange seat. Vs Hot Mulled Cider: quin is cleaner modern myth-killer; cider is spiced holiday. Vs Gold Ochre: mineral earth vs organic stain gold.`,
    ace_history: `Quinacridone gold / PO49-type transparent golds replaced romantic fugitive Indian yellow stories with lightfast chemistry. W&N Professional keeps it as a glaze workhorse.`,
  },
  "wn-tube-gold-ochre": {
    temp_role:
      "Warm earth-yellow · Natural gold ochre (PY43) · landscape light",
    ace_note: `Golden earth yellow for warm landscape lights.

PY43 natural iron-yellow ochre family — field sun, stone, underpainting warmth that mixes land greens not neon. Cousin to earth-family ochres and Pinax PY42 half-pan: if those already own sensible sunlight, this is British professional tube manners, not a new planet.

Dual advice: one gold-ochre / transparent iron-yellow seat across earth + yellow families. Vs Quin Gold: dirt vs organic glow.`,
    ace_history: `Gold ochre is iron-stained earth light — W&N Professional refined across British watercolour generations. Landscape staple before holiday ciders existed.`,
  },
  "qor-naples-yellow": {
    temp_role:
      "Soft warm Naples · Titanium white + iron yellow · Aquazol skin/light",
    ace_note: `Soft opaque-leaning warm yellow for lights and skin-adjacent mixes.

QoR (Golden) Aquazol binder — different slip from gum arabic/honey. Pigment line PW6 + PY42: Naples as pale warm via white + iron yellow, not antique lead antimonate. Soft lights, skin-adjacent, Earth set quiet workhorse. Handles modern and snappy; still a corrector, not a lemon primary.

Dual advice: Naples seat with Schmincke/MB/Rosa pans. QoR if you like Aquazol; one soft pale yellow in the tin. Swatch against Horadam reddish/full before promoting two Naples.`,
    ace_history: `QoR = Golden's watercolour line: high chroma, Aquazol, contemporary earth set. Naples here is modern convenience pale warmth — titanium white + iron yellow doing the soft job historic Naples advertised.`,
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

// Sanity: no batch-date stamps left in applied notes
for (const id of Object.keys(updates)) {
  const note = updates[id].ace_note;
  if (/Jul\s+\d+|batch\s+\d{6}|20\d{2}-\d{2}-\d{2}/i.test(note)) {
    console.error("Batch stamp still in", id);
    process.exit(1);
  }
}

p.updated = new Date().toISOString().slice(0, 10) + "-yellow-tube-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Yellow tube cards applied: ${nUp} (no batch dates in ace_note)`);
