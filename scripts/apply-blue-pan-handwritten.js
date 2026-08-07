/**
 * Apply handwritten blue · pan color cards
 * (Desktop blue-pan-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-fp-486-cobalt-blue-hue": {
    temp_role:
      "Cool-leaning sky blue · Cobalt *hue* (zinc + ultramarine) · milky polite mixer",
    ace_note: `Cobalt manners without the cobalt bill — milky sky blue that stays polite in mixes. Zinc keeps it soft; ultramarine keeps it honest.

Read the label twice: Hue, not PB28 cobalt aluminate. PW4 zinc white milks the mass tone; PB29 ultramarine supplies the blue soul and a little granulation. You get powdery sky and soft distance without the cobalt price — and without true cobalt's exact chemical behavior. Mixes stay civilized; screaming phthalos are a different kingdom.

Dual advice: don't stock this and half-pan cerulean and a true cobalt tube as three "sky milks" unless swatches prove three jobs. Vs half-pan ultramarine: this is softer/sky-costume, not your violet-honest primary. One milky sky seat is usually enough.`,
    ace_history: `True cobalt blue was a 19th-century luxury sky; "cobalt hue" recipes (here zinc + ultramarine) are the honest modern shortcut Horadam labels clearly. Metal-free cobalt alternative on the sleeve — marketing of manners, not a fake mineral claim if you read "Hue."`,
  },
  "wn-511": {
    temp_role:
      "Warm blue · Granulating sky / mixing primary · full-pan workhorse",
    ace_note: `Warm-leaning blue with old-soul granulation — skies, cloth, and neutrals when it meets a warm earth.

Same classical ultramarine seat as your Schmincke/Pinax half-pans: violets with rose, greys with burnt sienna (verified with DS sienna on the card), cooler greens with yellow. Full pan = stop rationing the sky. White Nights may granulate less loudly than some Horadam grinds — manners, not a different fairy tale. You've already verified soft skies with Potter's Pink and spring greens with WN yellow.

Dual advice: one PB29 well across the whole studio kit story. If French/Finest/Pinax half-pan already lives in the travel tin, this full pan is desk stockpile — not a second role. Don't also promote every WN "mystery blue" as another primary.`,
    ace_history: `PB29 ultramarine: lapis legend → 1820s synthesis → every watercolorist's first serious blue. St. Petersburg full pans made it cheap and generous; the job is still warm mineral sky and honest violets.`,
  },
  "wn-555": {
    temp_role:
      "Deep warm-blue dark · Ultramarine + black · twilight convenience",
    ace_note: `Dark blue shadows — granulating twilight corners.

Black (PBk6) is in the room: this is not pure ultramarine. You get instant twilight corners, cloak shadows, and storm bases — plus a talent for killing chroma if it wanders into a clean sky mix. Granulation keeps it from looking like poster navy. Cousin logic to half-pan ideas like "respect the black" (Van Dyck / Galaxy browns, but blue).

Dual advice: if you already mix ultramarine + a touch of neutral tint/black, or own a deep indigo/Prussian, this pan is speed, not a missing primary. Don't let it replace chromatic greys (ultramarine + burnt sienna) or landscapes go dead-navy.`,
    ace_history: `Convenience dark: ultramarine plus carbon black — the 19th-century habit of premixing storm-cloud neutrals, sold ready-made. St. Petersburg granulating specials love this mood; chemistry is honest about the black.`,
  },
  "wn-571": {
    temp_role:
      "Warm-cool bridge blue · Cobalt + ultramarine blend · granulating night sky",
    ace_note: `Blue Mystery brings warm blue energy to the tin — worth knowing by temperature, not just by pretty swatch.

The pigment line is the plot: true cobalt (PB28) + ultramarine (PB29) — a bridge between milky-cobalt calm and ultramarine bloom. Granulating "galaxy" manners for night skies and abstract pours. Harder to predict in mixes than a single-pigment blue (two bosses in the well).

Dual advice: character blend, not your only blue. If Cobalt Hue + Ultramarine already cover sky stories, Mystery is optional romance. Keep when the granulation and dual-pigment swatch make you paint night on purpose.`,
    ace_history: `Pairing cobalt aluminate with ultramarine is a modern convenience for complex sky neutrals — St. Petersburg specials lean into the pour-and-granulate demo culture. Name is dreamy; label is a duet.`,
  },
  "wn-561": {
    temp_role:
      "Muted blue-grey mist · Ultramarine + phthalo green + white · atmospheric blend",
    ace_note: `Misty turquoise rose — weird beautiful granulation.

Three-pigment weather: ultramarine warmth, PG7 green pull (turquoise lean), PW6 mist. Not a mixing primary — an atmosphere pan for foggy harbors, distant hills with a green cast, and "I want that weird beautiful granulation" moments. Will not behave like pure PB29 in violet recipes (green + white gossip).

Dual advice: dessert / effect seat. Don't use it where you wanted clean ultramarine or clean phthalo. If Aquamarine Mist or Sea Blue already give marine fog, pick the one swatch you actually reach for.`,
    ace_history: `Multi-pigment "mist" specials are a White Nights signature: granulation theater with white for veil. The name stacks three moods; the paper tells you which pigment won today.`,
  },
  "wn-559": {
    temp_role:
      "Cool aqua mist · Phthalo blue + white · soft marine veil",
    ace_note: `Aquamarine Mist brings cool blue energy to the tin — worth knowing by temperature, not just by pretty swatch.

PB15 (phthalo) supplies the cool ocean gene; PW6 milks it into mist. Think shallow tropical water in fog, not deep staining phthalo punch in masstone — the white retires some tyranny. Still phthalo-family: mixes can skew turquoise/green; not a warm violet-maker with rose.

Dual advice: same broad cool phthalo seat as Blue Dream / Royal / Sea Blue cousins — different costumes. Swatch and keep one "marine cool" unless you paint water every week. Vs half-pan cerulean: this is greener/more modern stain lineage; cerulean is milkier mineral sky.`,
    ace_history: `Phthalo blue (PB15) is mid-20th-century power blue; cut with titanium white it becomes a convenience aqua-mist for sketchbooks and demos. Industrial cool, romantic name.`,
  },
  "wn-570": {
    temp_role:
      "Cool phthalo blue · Straightforward staining ocean · cheerful primary cool",
    ace_note: `Blue dream — cheerful straightforward blue.

Closer to a straight PB15 story than the mist blends: saturated cool blue for water, bright skies that aren't ultramarine-warm, and greens that go emerald fast with yellow. High tinting potential even when the card doesn't scream "staining" in every field — dose like salt. Cheerful until it steals the mix.

Dual advice: one pure-ish phthalo blue across brands (WN Dream, Rosa Royal, tubes later). If Prussian half-pan already tyrannizes teal-greens, you may not need Dream in the same tiny tin. Ultramarine + yellow still makes gentler greens when you're learning.`,
    ace_history: `PB15 phthalocyanine blue — transparent, powerful, modern. The backbone of "ocean in a pan" student and pro ranges alike. White Nights keeps the dreamy name; the molecule does the work.`,
  },
  "wn-595": {
    temp_role:
      "Cool deep marine · Phthalo + green + black · stormy seascape blend",
    ace_note: `Sea Blue brings cool blue energy to the tin — worth knowing by temperature, not just by pretty swatch.

Marine convenience: phthalo cool, PG7 depth, PBk9 (bone/ivory black family) for storm weight. Granulating seascape special — great for moody water in one scoop, muddy if you wanted clean primary blue. Verified-adjacent mood with Deep Sea Indigo in mix tips on other cards.

Dual advice: effect / seascape seat, not your only blue. If Deep Sea Indigo or pure phthalo + a green already cover "abyss," Sea Blue is optional cousin. Don't premix storm when you're trying to learn temperature with single pigments.`,
    ace_history: `Blend culture for holiday seascapes: phthalo systems plus black for instant depth. St. Petersburg granulating lines sell the weather; you supply the shoreline.`,
  },
  "rosa-782": {
    temp_role:
      "Cool phthalo blue · Saturated \"royal\" cool · single-pan pocket tyrant",
    ace_note: `Royal blue — rich saturated Ukrainian blue.

PB15 in a pocket single pan: rich, cool, confident — flags, deep water, bold designy blues. Same cool phthalo job as Blue Dream with Rosa manners and rewet. "Royal" is chroma bragging, not a pigment class.

Dual advice: Dream vs Royal = one seat. Keep the pan whose rewet and saturation you trust; leave the twin home. Pair with ultramarine if you need warm/cool blue dialogue — not with three more PB15 blends.`,
    ace_history: `Phthalo blue again — twentieth-century cool power. Rosa Gallery's single-pan format is travel-friendly saturated color from a Ukrainian maker; the chemistry is global PB15.`,
  },
  "sch-952-deep-sea-indigo": {
    temp_role:
      "Cool deep blue-green · Abyssal indigo (indanthrene + phthalo green) · granulating marine",
    ace_note: `Deep diving blue-green — night water and whale shadows.

Not classical plant indigo and not half-pan "Indigo" alone: PB60 + PG7 pushes abyss teal-navy. Granulating Deep Sea series manners — layer with Deep Sea Blue, rhyme with Undersea Green, storm with Sea Blue. This is structural night water, not a violet primary.

Dual advice: vs half-pan Indigo (PB60): deeper/greener here because PG7 is invited. Vs Prussian: different stain/teal personality — don't stack three deep cools in one tin. One abyss seat.`,
    ace_history: `Schmincke's Deep Sea line (2020s) builds granulating marine blends for abyssal light demos. Indigo here is indanthrene + green chemistry, not vat dye — trust the pigment codes.`,
  },
  "sch-tube-952-deep-sea-indigo": {
    temp_role:
      "Cool deep blue-green · Same abyss soul as pan SKU · tube for bigger washes",
    ace_note: `Schmincke Deep Sea Indigo — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set.

Same whale-shadow seat as sch-952-deep-sea-indigo — different faucet in the database. Use tube logic when night water needs a passage; keep pan for tin. Mix tips already point at Deep Sea Blue, Moonglow fantasy, ultramarine coast greys.

Dual advice: one well of Deep Sea Indigo in kit logic. Pan SKU + tube SKU + any 2ml twin = one color. Don't double-fill because the id string says "tube."`,
    ace_history: `Same PB60/PG7 Deep Sea story — format is logistics. Horadam creamy rewet still applies; the abyss doesn't change when the plastic does.`,
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

p.updated = new Date().toISOString().slice(0, 10) + "-blue-pan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Blue pan cards applied: ${nUp}`);
