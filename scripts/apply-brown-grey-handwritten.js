/**
 * Apply handwritten brown + grey family cards
 * (Desktop brown-grey-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "qor-raw-umber-natural": {
    temp_role:
      "Cool-warm natural umber · PBr7 landscape dark · granulating Aquazol backbone",
    ace_note: `Natural earth umber — dark, granulating, landscape backbone.

Same raw umber seat as Schmincke half-pan raw umbers: cool-leaning dirt for trunks, soil, quiet darks without pure black. Natural + granulating = sediment on cold-press; Aquazol = snappy QoR handling vs Horadam cream. ◈ mixer for chromatic greys with blue.

Play lab (granulation): Juicy wash on rough paper — umber flocks into bark and path grit. Don't over-stir. Compare once to Schmincke 679/667: keep one raw umber manners for the tin.

Dual advice: one raw umber across earth + brown families. QoR if you live in Aquazol Earth set; Schmincke if the travel tin is already Horadam.`,
    ace_history: `Raw umber is unroasted iron earth (often manganese-cool). QoR packages it for contemporary landscape kits — workhorse, not mythology.`,
  },
  "sch-hp-668-green-umber": {
    temp_role:
      "Olive-brown earth · Umber + phthalo green · botanical bark / wet soil",
    ace_note: `Olive-brown earth — bark, wet soil, and muted landscape mid-tones.

PG7 is invited: raw-umber coolness pushed olive — wet soil under trees, bark with leaf memory, muted mid-tones that aren't pure burnt sienna roast. Granulates; mixes deep piney darks. Not a second "just brown."

Play lab (granulation): Side-by-side with plain raw umber — green umber's flocks read botanical. With yellow → dull olive ground; with blue → deep forest sludge (useful).

Dual advice: specialty earth-brown seat. If raw umber + a green already mix your olive dirt, optional. Don't stack Green Umber + Undersea Green + three more "moody dirt" pans.`,
    ace_history: `Green umber = cooler sibling of raw umber with a botanical lean — here earth plus phthalo green for Horadam "Umbra grünlich" mood.`,
  },
  "qor-transparent-brown-oxide": {
    temp_role:
      "Warm transparent iron brown · PR101 glaze rust · modern earth without mud",
    ace_note: `Transparent rust-brown glaze — modern earth without the mud.

Same glaze iron job as DS/MG transparent red oxides and Schmincke Transparent Brown: brick glow, wood, dusk, autumn through paper. Staining transparent; Aquazol slip. Less opaque Venetian cover, more stained-glass rust.

Dual advice: one transparent iron-brown/red-oxide seat across earth + brown. QoR vs Schmincke Lasurbraun vs DS TRO — manners contest (Aquazol vs cream vs DS), not three wells.`,
    ace_history: `PR101 calcined iron oxide as modern brick/terracotta blood. QoR Earth set workhorse — glaze brown for people who hate muddy convenience mixes.`,
  },
  "sch-hp-675-transparent-brown": {
    temp_role:
      "Warm glaze brown · Lasurbraun PR101 · wood & dusk layers",
    ace_note: `Glazing brown — transparent iron warmth for wood and dusk.

German Lasurbraun = built for layers, not coverage. Twin seat to QoR Transparent Brown Oxide: wood grain glazes, warm dusk, portrait warmth under cooler shadows. Staining — plan lights.

Dual advice: half-pan twin of QoR tube — one transparent brown. Vs burnt sienna: more pure iron-red-brown glaze, less orange-roast PBr7 story (check your swatches).`,
    ace_history: `Lasurbraun names the job: glaze-brown. PR101 chemistry; Horadam creamy rewet for pocket tins.`,
  },
  "ds-191-hematite-genuine": {
    temp_role:
      "Mineral iron grey · PrimaTek hematite · stone texture / dove-to-iron",
    ace_note: `Silvery iron dust — bold granulation in thick wash, soft dove grey when diluted. Stone texture without drawing stones.

Play lab (granulation): The star of this grey slice. Thick = silvery iron sediment; dilute = soft dove. Cold-press rocks, fortress walls, feathered metal without Payne's blue cast. Distinct from Hematite Violet samples if you own those — this is grey-iron, not violet drama.

Dual advice: effect / mineral grey seat — not a replacement for mixing ultramarine + burnt sienna (livelier chromatic greys). Keep for stone stories; don't let it be your only dark.`,
    ace_history: `Hematite (bloodstone iron oxide) pigmented humans for tens of millennia. PrimaTek keeps the mineral grit modern painters chase — genuine rock manners in a 5ml.`,
  },
  "sch-fp-787-paynes-grey-bluish": {
    temp_role:
      "Cool convenience grey · Bluish Payne's · sky/steel ready-mix",
    ace_note: `Cool ready-made grey — quicker than mixing every shadow from ultramarine + earth.

Classic Payne's convenience: black + phthalo blues for sky-and-steel cool. Faster than mixing every cloud; riskier if it becomes your only dark (paintings go dead-blue-grey). Staining phthalo whisper — dose like salt in florals.

Dual advice: one Payne's seat. Prefer mixing chromatic greys for learning; keep bluish Payne's for speed and storm demos. Vs Neutral Grey: this one has a blue cast on purpose.`,
    ace_history: `Payne's grey is a 19th-century convenience neutral; Schmincke's bluish cut leans sky and steel with modern phthalo components under carbon black.`,
  },
  "sch-hp-782-neutral-grey": {
    temp_role:
      "Straight value grey · Black + white · no Payne's blue cast",
    ace_note: `Straight value grey — when you don't want Payne's blue cast.

PBk6 + PW6 = honest middle value without sky bias. Design, value studies, quiet shadows on warm subjects. Can look chalky or dead if it replaces all chromatic neutrals — use as a tool, not a personality.

Dual advice: value-study seat. Don't stack Neutral + Payne's + Hematite + Van Dyck as four greys in a six-color tin. One convenience grey + mix the rest is enough.`,
    ace_history: `Modern convenience neutral — skip mixing when you need a quiet middle. No romance required; the job is straight value.`,
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

for (const fam of ["brown", "grey"]) {
  const all = p.colors.filter((c) => c.family === fam);
  const dual = all.filter((c) => (c.ace_note || "").includes("Dual advice"));
  console.log(`${fam}: ${dual.length} / ${all.length}`);
}

p.updated = new Date().toISOString().slice(0, 10) + "-brown-grey-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Brown+grey cards applied: ${nUp}`);
