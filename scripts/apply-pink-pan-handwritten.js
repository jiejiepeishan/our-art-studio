/**
 * Apply handwritten pink · pan color cards
 * (Desktop pink-pan-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "wn-382": {
    temp_role:
      "Cool misty rose · Quin rose + white · granulating fog / romantic texture",
    ace_note: `Rose mist granulation — soft pink fog, romantic texture.

Play lab (granulation): PW6 milks PV19 into salon fog — wet cold-press, tip the board, let pink dust settle into lace. Soft portrait atmosphere, distant bouquets, "I woke up like this" skies. Less staining punch than pure PV19 half-pans (white retires the tyrant a little); more poetry. Verified-adjacent energy as a ◈ mixer for gentle violets with blue.

Dual advice: still the cool rose seat with MB Rose Lake / Pinax Quin Rose — Mist is the atmosphere cut, not a second primary for clean jewel purples. One pure PV19 + optional Mist if you paint foggy florals weekly.`,
    ace_history: `White Nights granulating "mist" specials — St. Petersburg sedimentary blends with white for veil. PV19 does the rose; PW6 does the dream sequence.`,
  },
  "wn-3002": {
    temp_role:
      "Cool magenta-pink mist · Quin magenta + white · cotton-candy sediment",
    ace_note: `Rose dream — sediment pink cotton-candy clouds.

Play lab (granulation): PR122 cool magenta lean + white = cotton-candy flocks on texture — louder fashion than Potter's Pink, softer archive risk than pure fluorescent Opera. Wet-in-wet clouds of pink sediment; great for fantasy and confection, muddy if you wanted dusty ceramic PR233. Not a skin softener first.

Dual advice: drama/mist seat with Brilliant Opera Rose half-pan — Opera is fresh scream; Dream is milky granulating cloud. One loud magenta-pink story per tin unless you illustrate candy full-time.`,
    ace_history: `PR122 quinacridone magenta as modern cool primary energy, cut with titanium white for Nevskaya Palitra "dream" marketing — cotton candy with a pigment code.`,
  },
  "rosa-709": {
    temp_role:
      "Cool bold quin rose · PV19 pocket primary · staining floral power",
    ace_note: `Ukrainian magenta rose — bold Eastern European floral power.

Straight PV19 confidence in a single pan: bold florals, clean purples with blue, staining petal memory. Pocket rococo — less milky than Mist, less Italian soft-wardrobe than Rose Lake, more "I brought flowers and I meant it."

Dual advice: one PV19 primary among Magenta Rose, Rose Lake, Pinax Quin Rose. Rosa wins if you want saturated travel punch; MB/Pinax if you want softer chart manners.`,
    ace_history: `Quinacridone rose PV19 — transparent twentieth-century star. Rosa Gallery packages Eastern European floral boldness in a single-pan passport.`,
  },
  "rosa-748": {
    temp_role:
      "Warm peach rose · Naples cream + iron whisper · skin & wall corrector",
    ace_note: `Naples rose — peachy warmth for skin and walls.

Not a cool quin pink: PY40 pale cream yellow family + PR101 iron red kiss = peach flesh, faded stucco, "rose" only in the romantic name. Portrait corrector territory next to Naples Yellows — soft, low scream, human. Won't make clean violet with ultramarine the way PV19 does.

Dual advice: soft peach/skin seat with Naples yellows and pale creams — one well. Don't use when you needed Potter's Pink dust or quin rose petals. Filed in pink because the name and peach read blush; chemically it's warm corrector.`,
    ace_history: `Naples-style pale warmth plus a touch of iron red — portrait-studio flesh light wearing a rose nickname. Low drama, high usefulness when lemon would sting and magenta would shout.`,
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

p.updated = new Date().toISOString().slice(0, 10) + "-pink-pan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Pink pan cards applied: ${nUp}`);
