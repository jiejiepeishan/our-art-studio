/**
 * Apply handwritten pink · half-pan color cards
 * (Desktop pink-halfpan-draft.md, approved — rococo mood).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "mb-potters-pink": {
    temp_role:
      "Dusty ceramic rose · Mineral PR233 · softener / skin / quiet rococo · ◈",
    ace_note: `The quiet fixer-upper of your palette. Dusty rose that softens loud mixes and makes skin feel human instead of plastic. I would marry this color if it were legal.

(Marriage clause stands — this is the salon pink that fixes everything without raising its voice.)

PR233 is not a screaming primary: it's porcelain dust and powdered cheek. Drop it into a loud red or yellow to humanize skin; with ultramarine (verified with WN) → Turner-adjacent blush skies; under Rose Lake → petal gradients; with May Green → greyed distant foliage. Transparent enough to glaze; polite enough for portraits that shouldn't look like vinyl.

Dual advice: one Potter's Pink among MB, Roman Szmal, and Pinax Deep. MB is the soft classic; Deep is granulating shadow sister; RS is manners science. Travel tin gets one dusty rose, not a ceramics factory.`,
    ace_history: `Potter's Pink is named for ceramic glaze tradition — muted lightfast rose that portrait painters adopted as the secret softener. Mineral calm in a rococo world of loud lakes.`,
  },
  "rs-359": {
    temp_role:
      "Dusty ceramic rose · PR233 manners twin · compare-for-science",
    ace_note: `RS Potter's pink — compare with Maimeri 479 side by side for science.

Same PR233 seat as MaimeriBlu: dusty ceramic rose, different grind/binder handshake. The original note is the whole assignment — swatch RS vs MB under the same skin mix and the same ultramarine sky. Rococo lesson: nuance is the luxury.

Dual advice: not a second well. Winner stays; loser lives in the studio drawer for "what if."`,
    ace_history: `Still mineral PR233 potter's pink culture — European handmade lines competing on softness and rewet, not on inventing a new pink planet.`,
  },
  "pinax-pr233-potters-pink-deep": {
    temp_role:
      "Deep dusty rose · Granulating PR233 · botanical shadow / faded brick pink",
    ace_note: `Dusty ceramic rose — granulating, quiet, botanical shadows and faded brick pink.

Play lab (granulation): Deeper, cooler, sediment in the salon curtains. On cold-press it flocks into botanical shadow pink and old masonry blush — less "cheek powder," more "rose that remembers dust." Tilt a juicy wash; don't scrub the porcelain grit away. Still PR233 family: softener logic, not opera scream.

Dual advice: if MB Potter's Pink already softens skin, Deep is the shadow twin — optional second only for botanical/architecture kits. One deep dusty rose max with RS/MB.`,
    ace_history: `Mineral red-violet PR233 pushed deeper and granulating for architectural and floral mute — Pinax Extra's G-mark is the texture promise.`,
  },
  "mb-rose-lake": {
    temp_role:
      "Cool quin rose · PV19 floral / blush primary · staining glaze · ◈",
    ace_note: `PV19 with a softer wardrobe than screaming quin rose. Florals, blushes, and those 'almost red' moments. Pairs beautifully with Potter's Pink for gentle portraits.

Cool transparent quin rose: the mixer that makes blues into lilacs and violets without mud (when you dose). Staining — the petal remembers. Verified with Potter's Pink for cheeks/petals; with ultramarine for lilac-grey sunset clouds. Rococo florals without carnival fluorescent (save that for Opera).

Dual advice: same PV19 cool rose seat as Pinax Quinacridone Rose. One primary cool rose. Pair with one Potter's Pink for soft→bright gradients; don't also need three magentas.`,
    ace_history: `Rose lakes once meant madder romance and fugitive heartbreak; PV19 quinacridone is the modern workhorse that keeps the blush and dumps the fade. Italian soft wardrobe on a 20th-century molecule.`,
  },
  "pinax-pv19-quinacridone-rose": {
    temp_role:
      "Cool quin rose · PV19 storyteller · staining primary pink-violet",
    ace_note: `Hot pink with manners — the mixer that turns every blue into a story.

Same cool PV19 job as Rose Lake, often a touch more "hot pink with manners" in the well. Primary for clean purples, floral glazes, portrait blush that still stains true. Series B transparent Pinax energy.

Dual advice: Rose Lake vs Pinax Quin Rose = manners contest. Swatch with the same ultramarine and the same Potter's Pink; keep one PV19.`,
    ace_history: `Quinacridone rose/violet (PV19) — transparent star of modern mixing charts for florals and clean purples. Pinax single-pigment honesty: the code is the plot.`,
  },
  "sch-hp-941-brilliant-opera-rose": {
    temp_role:
      "Loud opera pink · Magenta-lean (PR122) + white whisper · fugitive-ish drama",
    ace_note: `Loud, fluorescent-leaning rose. Gorgeous fresh; may shift over time — paint the moment, not the archive.

This is the box seat, not the powder room: high-key, brilliant, slightly fluorescent romance. PR122 (quin magenta family) plus PW6 milks the scream into "brilliant opera." Perfect for fresh florals and fashion sketches; risky for heirlooms — light may dim the aria. Not a substitute for lightfast Potter's Pink or careful PV19 when permanence matters.

Dual advice: optional drama seat. Don't let Opera replace your lightfast cool rose primary. If you paint only for the week's joy, keep it; if you sell archives, swatch fade or leave it in the toy drawer.`,
    ace_history: `Opera / brilliant rose marketing rides quin magenta energy and modern brighteners — salon spectacle, not ceramic mineral. Horadam creamy rewet; the caution about shift is the adult in the room.`,
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

p.updated = new Date().toISOString().slice(0, 10) + "-pink-halfpan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Pink half-pan cards applied: ${nUp}`);
