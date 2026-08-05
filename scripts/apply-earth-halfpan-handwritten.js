/**
 * Apply handwritten earth · half-pan color cards
 * (Desktop earth-halfpan-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-hp-yellow-ochre": {
    temp_role:
      'Warm earth-yellow · Field & underpainting · the "boring" pan that does everything',
    ace_note: `The earth tone you reach for without thinking. Reliable, humble, mixes into a hundred natural greens.

Ochre is the tin's sensible sunlight: not lemon, not cadmium, just "the day is warm." Where it gets interesting is next to blue — many ochres push a soft green-grey, which is perfect for distant hills and wrong for a clean violet shadow. With phthalo green it steadies neon into olive; with rose it makes dusty skin and old plaster.

Dual advice: if your greys with ultramarine keep going olive when you wanted stone, try Raw Sienna for the warm note instead. Keep ochre when you want body in fields and paths that sit on the paper, not only glow through it.`,
    ace_history: `Ochre is iron-stained clay — among the oldest paints humans ever used (caves, tombs, underpainting). Modern PY42/PY43 is the industrial echo of that dirt: muted gold for land, not jewelry-store yellow. Horadam keeps it creamy so the "humble" pan doesn't fight you on rewet.`,
  },
  "sch-hp-665-raw-sienna": {
    temp_role:
      "Warm earth-gold · Dust, horizon, transparent path · ochre's more orange sister",
    ace_note: `Warm raw sienna — sunlit earth and dusty paths.

This is not "another ochre." Raw sienna usually runs a little more orange and see-through: horizon glow under a blue sky, sandstone, the strip of dirt road that has to stay luminous. With ultramarine it often makes friendlier greys than yellow ochre (less accidental green). With burnt sienna it tells the full roast story — raw gold vs cooked red-brown.

Dual advice: swatch ochre vs raw sienna once with your ultramarine. Keep the one that makes the grey you actually want. Most limited palettes need one earth-yellow role, not both — unless you paint architecture and fields every week.`,
    ace_history: `Raw sienna is iron earth before the kiln. Heat the same family and you climb toward burnt sienna's red-brown. Italian "siena" earth made the name; the lesson is process: raw = golden veil, burnt = warm structure.`,
  },
  "sch-hp-burnt-sienna": {
    temp_role:
      "Warm roasted earth · Bark, brick, classic greys · travel workhorse",
    ace_note: `Schmincke's burnt sienna — a touch more granulation than DS perhaps. Your half-pan workhorse for quick warm browns.

This pan is heat locked into dirt: tree bark, sun-warmed tile, the warm side of a face when rose is already in the cool half. With indigo/ultramarine it builds the textbook storm greys (you already have verified mixes in the card). With May Green it steadies spring into real foliage. It is not raw umber's cool espresso — if a shadow goes muddy-purple when you wanted pine, you grabbed the wrong brown.

Dual advice: one burnt sienna in a kit is enough. DS vs Schmincke vs honey brands are manners (grit, bloom, rewet), not three different roles. Pick the grind you love; don't fill three wells.`,
    ace_history: `Burnt sienna is roasted iron earth — calcining pulls red-orange out of the clay. Landscape and portrait painters have leaned on that roast for centuries as the warm dark that still breathes. Horadam's version is built for pocket tins and polite rewet.`,
  },
  "sch-hp-648-titanium-gold-ochre": {
    temp_role:
      "Warm flesh-stucco gold · Ochre with a red whisper · more body",
    ace_note: `Shimmery warm ochre — earthy but fancy. Sunlit stucco, honey, gilded edges on autumn leaves.

The PR101 kiss is the whole plot: this isn't field-yellow ochre, it's ochre that remembers brick. Use it when plain yellow ochre turns too green beside blue, or when a wall needs "late afternoon plaster" instead of "wheat field." It covers a little more — good for drybrush sun on masonry.

Dual advice: if mixes go dull or peachy when you wanted clean green, this blend's red oxide is gossiping. Reach for single-pigment ochre or raw sienna when you're studying temperature; keep Titanium Gold Ochre for atmosphere and façades.`,
    ace_history: `A modern "gold ochre" convenience: iron yellow plus a touch of iron red (PY42/PR101). Not a cave pigment name — a studio recipe for sunlit stone and warm mid-tones Horadam can rewet without chalk panic.`,
  },
  "sch-hp-647-madder-brown": {
    temp_role:
      "Warm red-brown · Book-spine / late trunk · earth with a pulse",
    ace_note: `Warm brown with a red heartbeat. Old book pages, tree trunks in late light, cozy neutrals.

Where burnt sienna is orange-roast and raw umber is green-cool, madder brown sits in storybook mahogany — furniture, leather, the brown that still feels dyed. The organic red (PR206) keeps it from pure dirt; lovely for interiors and trunks at golden hour, less ideal as your only "mixing earth."

Dual advice: don't let this replace burnt sienna + ultramarine lessons. Keep a plain PBr7 sienna/umber for clean temperature drills; use madder brown when the subject wants romance, not geology class.`,
    ace_history: `True madder (Rubia) once gave warm reds and browns to cloth and lake pigments — fugitive, legendary. Modern "madder brown" blends (here PR206 with earth) borrow the mood without the fade. Name is memory; lightfastness is the upgrade.`,
  },
  "mb-dragons-blood": {
    temp_role:
      "Warm red-brown · Autumn gossip · modern organic earth · granulating",
    ace_note: `Sounds medieval, paints like warm autumn gossip. Granulating, semi-opaque — terracotta shadows, moody foliage, dragon not included.

Here's the twist: this is not cave PBr7. PBr25 (benzimidazolone brown) is a modern organic warm brown — dark reddish, often free-moving when wet, granulating in this pan, with more body than a pure stain. It does terracotta tile shadow, autumn canopy, and moody brick that still separates on cold-press. It will not give you raw umber's cool pine slate; it will not glaze like transparent red oxide's stained glass.

Dual advice: if burnt sienna already lives in the kit, Dragon's Blood is optional character, not a missing role — keep it when the swatch makes you grin. Shopping tip: don't buy it thinking you're getting medieval resin; you're getting a contemporary brown with a legendary nickname.`,
    ace_history: `Historical dragon's blood was tree resin from Asia, used in varnish and manuscript borders — expensive red-brown romance. MaimeriBlu keeps the name and uses PBr25, a modern benzimidazolone brown: lightfast warm brown chemistry wearing a myth.`,
  },
  "sch-hp-679-raw-umber": {
    temp_role: "Cool earth · Espresso / green-brown · quiet darkener",
    ace_note: `Cool earth anchor — tree trunks, shadows, and mixing neutrals without going black.

This is the temperature opposite of burnt sienna: cool, slightly green-brown, the brown that makes winter paths and furniture in the shade. With ultramarine → icy slate greys; with greens → deep pine, not autumn ochre. Tint strength is often polite — you can sneak it into a mix to lower chroma without detonating the hue.

Dual advice: never "swap in" for burnt sienna in a recipe and expect the same painting. If you only keep one umber, ask: do I paint more warm land (sienna) or more cool shade (raw umber)? Portraits usually want sienna first; forests often want raw.`,
    ace_history: `Raw umber is unroasted iron earth; manganese in classic umbers pulls the cool green undertone. Used for shadows since classical drawing culture — the brown that behaves like a soft black with a passport.`,
  },
  "sch-hp-667-raw-umber": {
    temp_role: "Cool earth · Soil-memory umber · granulating bark",
    ace_note: `Quiet dirt-and-bark brown — cool enough to shadow greens, warm enough for tree trunks. Granulates like it remembers soil.

Same cool earth role as 679, different manners: this grind leans sedimentary — bark furrows, dirt paths with grit, mid-darks that texture instead of lying flat. If 679 is the smooth espresso shadow, 667 is the handful of earth.

Dual advice: two raw umbers in one small kit is almost always redundant. Swatch 667 vs 679 side by side; keep the texture you love, leave the other in the studio drawer. Role = one seat.`,
    ace_history: `Still raw umber / PBr7 unroasted earth — cool, manganese-leaning brown. The difference is grind and granulation personality, not a different pigment fairy tale.`,
  },
  "sch-hp-672-van-dyck-brown": {
    temp_role: "Deep brown · Furniture / Old Master dark · earth + black",
    ace_note: `Rich transparent brown — Old Master shadows and tree trunks.

This is not a pure earth — black (PBk7) is in the room. That means gorgeous deep furniture and cloak shadows, and also a talent for killing chroma if it wanders into a sky mix. Use it when you want a single-pan deep brown habit; respect it like a soft black with brown manners.

Dual advice: livelier darks often come from ultramarine + burnt sienna/umber (chromatic black). Keep Van Dyck for speed and furniture; don't let it become your only dark or landscapes go mahogany-dead.`,
    ace_history: `"Van Dyck brown" nods to Anthony van Dyck's deep brown shadow culture. Modern recipes often blend bone/carbon black with earth (PBk7/PBr7) — historical mood, contemporary lightfast convenience, not a single dirt from a Flemish field.`,
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

p.updated = new Date().toISOString().slice(0, 10) + "-earth-halfpan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Earth half-pan cards applied: ${nUp}`);
