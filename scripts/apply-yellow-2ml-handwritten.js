/**
 * Apply handwritten yellow · 2ml sample color cards
 * (Desktop yellow-2ml-draft.md, approved — no batch-date stamps).
 * Completes yellow family handwritten pass.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "mg-018-azo-yellow": {
    temp_role:
      "Mid primary yellow · Benzimidazolone azo (PY151) · clean mixer · staining glaze",
    ace_note: `Clean primary sunshine — mixes oranges and greens without the cadmium weight. Honey keeps it juicy on the palette.

PY151 mid primary: often a hair different from cool Hansa PY3 (MG107 tube) — many charts treat Azo as the "middle sun" for clean oranges and greens. Transparent, staining — permanent sunshine; lift carefully. Honey slip and rewet. Catalog code 018 (not 108) — numbering isn't sequential next to Hansa 107 / Indian 109.

Dual advice: mid primary seat with Pure Yellow / Isoindoline / Chrome Hues. Vs Hansa tube: cool lemon vs mid azo — you can own both; travel tin usually wants one cool + one mid max. Sample first before a 15ml.`,
    ace_history: `Benzimidazolone azo yellows (PY151) are modern transparent primaries for glazing stacks that stay clean. Honey-bound M. Graham is the juicy chapter.`,
  },
  "mg-109-indian-yellow": {
    temp_role:
      "Warm transparent gold-yellow · Modern \"Indian yellow\" (PY83) · honey glaze",
    ace_note: `M. Graham Indian Yellow — honey base, 2ml sample. Blooms on wet paper if you lean in.

Warm transparent gold for autumn, skin warmth, and glowing underlayers — not the infamous historic cow-mango legend as literal chemistry. PY83 diarylide/modern organic gold-yellow does the transparent warm job. Honey blooms if you feed water. Cousin mood to quin gold / cider / rose deep gold — one warm transparent gold seat is enough for most kits.

Dual advice: vs W&N Quinacridone Gold and Hot Mulled Cider: manners and undertone contest, not three wells. Vs cool Hansa: different job entirely.`,
    ace_history: `Indian yellow's legend (Company School, mango-fed cows) is half horror-story, half romance; modern tubes use lightfast organics like PY83. Keep the glow; leave the livestock myth in the museum label.`,
  },
  "mg-019-cobalt-yellow": {
    temp_role:
      "Pale creamy yellow · Aureolin/cobalt yellow family (PY40) · soft corrector",
    ace_note: `M. Graham Cobalt Yellow — honey base, 2ml sample. Blooms on wet paper if you lean in.

PY40 is the classical aureolin / cobalt yellow family — pale, often delicate lightfastness reputation in some historical forms; modern honey sample still reads cream sun, not lemon primary. Soft corrector energy near Naples: flesh lights, quiet walls. Don't expect it to boss a neon green mix.

Dual advice: Naples / pale cream seat with QoR Naples, Rosa Light, Schmincke Naples. One soft pale yellow. Not a substitute for Azo/Hansa primaries.`,
    ace_history: `Cobalt yellow / aureolin (PY40) was the 19th-century transparent yellow hope; lightfastness drama made modern painters cautious. Honey sample = try the temperature; trust your own fade tests for heirlooms.`,
  },
  "ds-257-bright-yellow": {
    temp_role:
      "Warm clean sunshine · Benzimidazolone (PY154) · cadmium-free bright",
    ace_note: `Bright yellow no.2 — clean sunshine without cadmium.

PY154 clean bright mid-warm — design sun, flower punch, cadmium alternative. Sample size for "do I need another mid yellow?" Urban Yellow half-pan is also PY154-ish family energy with granulation; this sample is smoother sunshine try-on.

Dual advice: mid bright seat with Azo, Pure, Isoindoline. One winner. Vs Cad Light: transparent-leaning organic vs butter cover.`,
    ace_history: `PY154 benzimidazolone yellow — 20th-century organic research for clean sunshine without cadmium weight. DS sample culture: test, then commit.`,
  },
  "ds-152-rose-deep-gold": {
    temp_role:
      "Warm transparent gold · Nickel azo (PY150) · honey-sunset glaze",
    ace_note: `Warm golden rose — sunsets and honey light.

PY150 again (same broad chemistry as Hot Mulled Cider tube): transparent warm gold, rose-honey bias in the name. Glaze sunsets, tea, skin warmth. Not chalk ochre; not cool lemon.

Dual advice: one PY150 gold seat with Cider holiday tube — sample vs 15ml is faucet, not two roles. Vs Indian Yellow / Quin Gold: pick the warm transparent gold you actually reach for.`,
    ace_history: `Nickel azo yellow (PY150) underpins many luminous golds and "quin gold" neighboring recipes — transparent glazes, not chalk. Rose Deep Gold is DS's romantic naming for that glow.`,
  },
  "sch-931-shire-yellow": {
    temp_role:
      "Warm pastoral yellow · Granulating PY53 · storybook meadow light",
    ace_note: `Shire sunshine — warm pastoral yellow, Hobbit-core meadows.

Play lab (granulation): Built for storybook countryside — granulates into meadow grit on cold-press. Verified with phthalo green → vivid spring greens with texture; with Shire Olive → cohesive Hobbit-core harmony; with Desert Brown → dusty path edges. Tilt, don't over-stir. Not your color-wheel primary; it's landscape poetry with a useful mixer badge.

Dual advice: specialty granulating yellow — keep if you paint fields and fantasy maps. Don't replace lemon/mid primary with Shire alone. PY53 also appears in pale Naples territory (nickel titanate vibes) — here the granulating Shire cut is the point.`,
    ace_history: `Shire Yellow is Horadam fantasy-landscape marketing over PY53 specialty milling — countryside light with sediment, not a Tolkien mineral. Creamy rewet, storybook job.`,
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

for (const id of Object.keys(updates)) {
  if (/Jul\s+\d+|batch\s+\d{6}/i.test(updates[id].ace_note)) {
    console.error("Batch stamp in", id);
    process.exit(1);
  }
}

const yel = p.colors.filter((c) => c.family === "yellow");
const yelDual = yel.filter((c) => (c.ace_note || "").includes("Dual advice"));
console.log(`Yellow Dual advice: ${yelDual.length} / ${yel.length}`);

p.updated = new Date().toISOString().slice(0, 10) + "-yellow-2ml-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Yellow 2ml cards applied: ${nUp}`);
