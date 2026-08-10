/**
 * Apply handwritten yellow · pan color cards
 * (Desktop yellow-pan-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "wn-273": {
    temp_role:
      "Warm modern yellow · Isoindoline (PY139) · cadmium-free bright mid · full-pan stockpile",
    ace_note: `Clean isoindoline yellow — bright without cadmium.

PY139 is a contemporary organic yellow with serious chroma and usually good lightfast manners in student-to-pro ranges — bright mid-warm light without cadmium's butter cover. Full pan means you stop rationing sun for big washes and classroom demos. Mixes: with cool blue → lively greens (less ice than pure PY3 lemon, less dirt than ochre); with rose → warm peach/coral; alone → clean flower and signage yellow. Not chalky Naples; not staining Italian gold drama unless your grind surprises you — treat it as a mixing primary, not a corrector.

Dual advice: mid/warm transparent-leaning primary seat contested by half-pan Pure Yellow (PY138), Golden Yellow (PY183), Chrome Hue Deep, etc. One well for "bright modern yellow." If Pure already lives in the travel tin, this full pan is desk volume — not a second role. Cad Light remains the opaque religion if you need cover.`,
    ace_history: `Isoindoline yellow (PY139) is late-20th-century clean color for artists who want punch without cadmium weight. White Nights full pans made it a St. Petersburg workhorse: bright, practical, unromantic name, honest job.`,
  },
  "sch-fp-320-naples-yellow-reddish": {
    temp_role:
      "Soft peach Naples · Reddish chalky warm · skin & stucco · full-pan twin",
    ace_note: `Warmer, pinker Naples — skin tones and faded peach walls. Softer than regular Naples for portraits.

Same Naples role as the half-pan reddish you already shipped: peach-chalk flesh, Mediterranean plaster, quiet portrait light — not a screaming primary. Full pan = portrait sessions without scraping the half-pan bare. Still dies into soft dirt with blue faster than Hansa lemon — feature for skin neutrals, bug for neon spring greens.

Dual advice: half-pan + full pan reddish = one color, two faucets. Also still competing with standard Schmincke Naples and MaimeriBlu Naples for the single soft seat. Kit logic: one Naples bias (standard or reddish), one format in the active tin.`,
    ace_history: `Warmer Naples cuts lean skin and stucco — the hue family Pompeian and portrait workshops still match with modern PY216 blends, without historic lead antimonate. Full-pan sleeve is stockpile logistics for the same soft story.`,
  },
  "rosa-745": {
    temp_role:
      "Pale creamy Naples · Soft corrector · pocket cream light",
    ace_note: `Naples Yellow Light brings warm orange energy to the tin — worth knowing by temperature, not just by pretty swatch.

Read past the generic first line: Light promises the palest cream end of Naples — white-yellow hush for highlights, lace, distant walls, the softest flesh note. PY40 sits in soft-corrector country, not lemon-primary country. Rosa single pan = travel pocket cream. Low drama, high usefulness when lemon would sting.

Dual advice: still the Naples/cream seat — if Schmincke reddish or standard already owns skin/walls, Rosa Light only stays if the swatch is clearly lighter/creamier than what you have. Don't use it when you needed PY3 for clean greens. One soft pale yellow per tin.`,
    ace_history: `Pale Naples-style yellows echo portrait-studio flesh lights — cream without lemon sting. Rosa's single-pan Light keeps that low-drama job pocket-sized; the name is the promise, the paper is the test.`,
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

p.updated = new Date().toISOString().slice(0, 10) + "-yellow-pan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Yellow pan cards applied: ${nUp}`);
