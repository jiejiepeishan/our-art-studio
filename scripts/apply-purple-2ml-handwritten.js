/**
 * Apply handwritten purple · 2ml samples
 * (Desktop purple-2ml-draft.md — lean Play labs, no Mix With restatements).
 * Completes purple family 27/27.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "ds-101-rose-of-ultramarine": {
    temp_role:
      "Cool dimensional purple · Ultramarine + quin rose · wet-on-wet drama · ◈",
    ace_note: `Blue settles, rose floats — dimensional purple that paints its own shadows. The wet-on-wet drama queen of the violet corner.

Play lab (granulation): Two-layer party in one scoop — PB29 flocks down, PV19 stains/floats up. Drop on wet cold-press; don't stir the divorce. Skies and florals that refuse flat purple.

Dual advice: effect / dimensional purple — not a second primary. Vs pure PV19 or pure ultramarine: this is the convenience marriage. One drama well with Moonglow max.`,
    ace_history: `Modern convenience: ultramarine mineral grit meeting quin rose stain — built for skies and florals that refuse flat purple. Series 1 Extra Fine; name corrected to Rose of Ultramarine (not "Ultramarine Rose" folklore).`,
  },
  "ds-164-hematite-violet": {
    temp_role:
      "Cool moody purple-grey · Iron black + quin · mineral shadow drama",
    ace_note: `PrimaTek hematite violet — moody granulating purple-gray drama.

Play lab (granulation): PBk11 iron black + PV19 — purple-grey sediment, iron-rich shadows. Thick vs dilute for drama control; leave grit alone. Not Hematite Genuine grey (different card); this is violet-leaning iron drama.

Dual advice: mineral shadow seat — vs plain Hematite grey and vs clean PV19. Specialty; one iron-violet. Staining + grit = plan lights.`,
    ace_history: `Hematite iron oxide + quin for PrimaTek-style drama DS loves on wet paper — mineral patterns synthetics can't fully fake.`,
  },
  "ds-232-lavender": {
    temp_role:
      "Cool soft lavender · White + UV + ultramarine · periwinkle denim · ◈",
    ace_note: `Periwinkle denim mood — white + ultramarine violet + ultramarine blue separating gently wet-on-wet. Florals and quiet jeans-blue skies.

Play lab (granulation): Same convenience family as Holbein Lavender tube — milky periwinkle with gentle mineral split. Low staining, lifts; good for florals and denim cools. Sample try-on before another 5ml.

Dual advice: one lavender/periwinkle seat (DS sample or Holbein tube). Not a night violet primary.`,
    ace_history: `DS Extra Fine convenience pastel: titanium white + ultramarine violet + blue — denim and spring haze chemistry, series 2.`,
  },
  "sch-972-starry-purple": {
    temp_role:
      "Cool starry violet · Manganese + black · sample twin of Galaxy Violet",
    ace_note: `Galaxy purple — granulating sediment, constellation freckles.

Play lab (granulation): Sample twin of Galaxy Violet tube — PV16 + black star-dust. Tube + 2ml = one color.

Dual advice: one Galaxy/Starry violet seat. Don't double-fill.`,
    ace_history: `Horadam Galaxy/Starry sedimentary line — manganese violet plus carbon for constellation freckles. Sample = low-risk cosmos.`,
  },
  "ds-094-rose-violet": {
    temp_role:
      "Cool violet-rose · PV19 bridge · floral purple when red is too warm",
    ace_note: `Cool violet rose — purple when red feels too warm.

Straight PV19 bridge between rose and violet — cool floral when red is too warm. Same primary seat as Lilac / Quin Violet / Sennelier Red Violet / pink roses. Sample for DS manners.

Dual advice: one PV19. Vs Wisteria (also PV19): Rose Violet often deeper/stainier; Wisteria softer pale lilac.`,
    ace_history: `Rose violet on the quin tree — cool floral after madder violets proved unreliable. Modern lightfast bridge hue.`,
  },
  "ds-231-wisteria": {
    temp_role:
      "Cool soft lilac · PV19 high-key · spring haze / gentle florals · ◈",
    ace_note: `Soft red-leaning lilac — florals, spring haze, and gentle cools without mineral grit.

High-key PV19 — delicate red-leaning lavender, transparent, non-staining, non-granulating. Spring wisteria clusters and soft cools; different handling from Ultramarine Red cousins. Gentle vs Royal Purple's crown.

Dual advice: pale PV19 seat — one soft lilac (Wisteria or milky Lavender mixes). Not for deep wine shadows (use Red Violet / Tyrian / Perylene).`,
    ace_history: `Quinacridone PV19 milled delicate — series 2 Extra Fine for spring florals without grit theater.`,
  },
  "ds-174-royal-purple": {
    temp_role:
      "Cool regal violet · Dioxazine (PV23) · staining floral crown",
    ace_note: `Regal staining purple — wears a crown in florals.

PV23 dioxazine-family regal violet — staining, high chroma, crown in florals and deep shadows. Electric vs mineral grit; can dominate mixes (dose like phthalo). Different from Tyrian's PV37/PR202 blend and from PV19 manners.

Dual advice: one dioxazine/royal deep violet. Powerful; not a beginner's only purple. Vs Tyrian: different codes, similar "royal deep" ambition — swatch, keep one.`,
    ace_history: `Royal purple (PV23) echoes Tyrian myth with synthetic dioxazine punch — staining violets Phoenician traders would have sold sandals for, without the snails.`,
  },
  "mg-193-ultramarine-violet": {
    temp_role:
      "Cool mineral violet · Ultramarine violet sample · honey try-on",
    ace_note: `Warm-leaning blue with old-soul granulation — skies, cloth, and neutrals when it meets a warm earth.

Re-read the drift: this sample is honey ultramarine violet (PV15/PB29 neighborhood), not plain ultramarine blue. Dusk and moody florals; compare to Ultramarine Violet Deep 15ml and Schmincke pan. Sample first; promote if freckles win.

Dual advice: one PV15 mineral violet faucet (sample / deep tube / pan). Honey manners contest with Horadam cream.`,
    ace_history: `Ultramarine violet mineral family with honey slip — sample-box courtship before series 3 marriage. Lapis-blue relative tuned purple.`,
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

const pur = p.colors.filter((c) => c.family === "purple");
const dual = pur.filter((c) => (c.ace_note || "").includes("Dual advice"));
console.log(`Purple Dual advice: ${dual.length} / ${pur.length}`);

p.updated = new Date().toISOString().slice(0, 10) + "-purple-2ml-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Purple 2ml cards applied: ${nUp}`);
