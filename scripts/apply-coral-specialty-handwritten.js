/**
 * Apply handwritten coral (1) + specialty (3) color cards
 * (Desktop coral-draft.md + specialty-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "ds-255-coral-reef": {
    temp_role:
      "Warm coral · Quin red + perinone orange · tropical reef accent · travel sample",
    ace_note: `Living coral — tropical warmth on paper.

Not a single historic "coral" rock and not pure cadmium sunset. The line is a duet: PR209 (quinacridone red — clean, modern, often a bit pink-leaning warmth) + PO48 (perinone transparent orange — the same heat family as DS Transparent Orange). Together they read reef flesh: peach-to-salmon in dilute washes, livelier orange-red in masstone — fish, flowers, swimsuits, the warm edge of a cheek when pure rose feels too cool and pure orange feels too traffic-cone.

Because it's a blend, mixes have two bosses. With blue you may get soft mauves or slightly dirtied peach depending on which pigment wins the water; with yellow it goes tropical fruit fast. It will not replace a primary red or a dedicated transparent orange for color-wheel drills — it's a subject color that already decided to be pretty.

Dual advice: one coral/salmon convenience seat is enough. If you already keep Transparent Orange (PO48) + a quin red/rose, you can mix reef — this 2ml is speed and mood for travel journals. Don't promote it to "my only warm red." Sample size is perfect: use it up on one vacation sketchbook, then decide if the reef earns a bigger tube.`,
    ace_history: `"Coral reef" is contemporary convenience naming — warm quin reds married to modern transparent orange for tropical sketches, not a mineral pulled from a barrier reef. PR209 + PO48 is lightfast twentieth-century chemistry wearing snorkeling marketing. The legend is the holiday; the job is clean warm flesh-of-the-sea on paper.`,
  },
  "sch-hp-800-silver": {
    temp_role:
      "Neutral sparkle · Mica silver (PW20) · last-layer jewelry · not a mixer grey",
    ace_note: `Not here to mix — here to sparkle. Treat it like jewelry on the paper: last layer, light touch, no apologies.

Mica silver sits on the painting, not inside the color logic. Dry-brush on dark washes for sword edges, fish scales, winter branches with frost; soft scumble for moon-glint. Stir with other pigments and you often get muddy glitter soup — the sparkle dies, the grey gets weird. Rewet politely; metallic pans can feel chalky if you dig like it's ultramarine.

Dual advice: one metallic silver seat is enough (you don't need three brands of "moon"). Never promote Silver into the neutral/primary row of a limited palette lesson. If a study needs honest grey, mix chromatic neutrals; save Silver for the moment you want the paper to catch light like metal.`,
    ace_history: `PW20 mica / pearlescent silver is decorative watercolour tradition — Victorian scrap albums, illuminated accents, modern galaxy and fantasy painters faking metal light. Not historic lead silver point; modern effect pigment milled for Horadam sparkle.`,
  },
  "sch-15811-green-gold": {
    temp_role:
      "Cool metallic gold-green · Mica + Hansa-ish yellow · manuscript / lapis experiment powder",
    ace_note: `Metallic alchemist — mix into ultramarine and chase that vintage lapis lazuli glow.

Powder format = you control the dose. Tiny pinch into a wet ultramarine wash can throw old-manuscript green-gold flecks (your studio note is canon). Alone: cool chartreuse metal for beetle wings, icon halos with a green bias, fantasy map edges. PY3 brings cool lemon energy under the mica — it will not behave like a pure transparent Hansa primary once sparkle is invited.

Play lab (powder): Load binder/water first, then whisper powder — or dust dry onto a still-tacky wash and lock with a clear glaze if your practice allows. Overload = sandpaper glitter. Educational fun: two swatches of French Ultramarine, one with a micro Green Gold charge — "church blue" vs "reliquary blue."

Dual advice: effect seat with Red Gold as warm twin — you don't need both in every tin; pick by whether your metallic story leans icon green-gold or sunset copper-gold. Never use Green Gold powder as your only yellow in a mixing curriculum.`,
    ace_history: `Green-gold mica riffs on medieval manuscript accents (gold next to green-blue pages) without leaf gilding. PW20 + cool yellow (PY3) is modern effect chemistry; Schmincke's powder line is for alchemists who like control.`,
  },
  "sch-15813-red-gold": {
    temp_role:
      "Warm metallic gold · Mica + iron red · sunset flecks / lapis partner",
    ace_note: `Warm metallic whisper — lapis experiment partner to Green Gold, but sunset gold flecks.

Same powder manners as Green Gold, warmer blood: PR101 iron red under mica = copper-sunset, Byzantine warmth, autumn armor. Into ultramarine → different vintage than green-gold (more bronze dusk than reliquary chartreuse). Alone on dark earths: ember edges, warm manuscript corners.

Play lab (powder): Side-by-side with Green Gold in the same ultramarine puddle — cool flecks vs warm flecks. That's the whole specialty education in two fingerprints. Dust sparingly; metallic powder is a seasoning.

Dual advice: pair with Green Gold only if you tell metallic stories often. Otherwise one gold powder + Silver covers "special." Don't confuse Red Gold with transparent iron oxide or coral — this is sparkle with warm bias, not a mixing red.`,
    ace_history: `Mica (PW20) plus iron oxide red (PR101) = warm pearlescent gold effect for contemporary decorative watercolour. Sister to Green Gold in the Schmincke metallic powder experiments; the "lapis mix" note is studio folklore worth keeping as a recipe, not a pigment definition.`,
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

for (const fam of ["coral", "specialty"]) {
  const all = p.colors.filter((c) => c.family === fam);
  const dual = all.filter((c) => (c.ace_note || "").includes("Dual advice"));
  console.log(`${fam}: ${dual.length} / ${all.length}`);
}

p.updated =
  new Date().toISOString().slice(0, 10) + "-coral-specialty-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Coral + specialty cards applied: ${nUp}`);
