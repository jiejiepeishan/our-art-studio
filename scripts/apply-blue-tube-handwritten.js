/**
 * Apply handwritten blue · tube color cards
 * (Desktop blue-tube-draft.md, approved — incl. Deep Sea Indigo granulation refresh).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "ds-034-french-ultramarine": {
    temp_role:
      "Warm blue · French granulating ultramarine · sky/shadow ◈ · tube workhorse",
    ace_note: `The classic granulating sky-and-shadow blue — warmer than straight ultramarine, perfect with burnt sienna for instant storm greys.

Play lab (granulation): This is the poster child. Load a juicy wash on cold-press, tip the board a few degrees, leave it alone — blue flocks into the tooth like weather deciding where to rain. Pair with burnt sienna (you already know the romance): don't over-stir the grey on the palette or you smooth out the storm. Soft spray at the edge = cloud bloom. On hot-press you'll wonder why influencers lied; switch paper, not brand.

Same PB29 warm seat as half-pan French / Finest / Pinax and WN full pan — DS 15ml is volume + famous grit. DS lists a staining lean: beautiful violets with rose madder, but lifting pure white may need planning.

Dual advice: one French/warm ultramarine tube or pan in active use. If Schmincke Ultramarine Finest tube also lives here, swatch granulation side by side — keep the bloom you love. Don't own four PB29 faucets "for science."`,
    ace_history: `French ultramarine = trade name for warmer PB29 after synthetic ultramarine freed painters from lapis prices (1820s). Daniel Smith's reputation is letting the mineral show on textured paper — church blue with a Pacific Northwest weather hobby.`,
  },
  "sch-tube-494-ultramarine": {
    temp_role:
      "Warm blue · Fine-milled ultramarine tube · mixing reference · less grit drama",
    ace_note: `Schmincke Ultramarine — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set.

Tube twin of half-pan Ultramarine Finest: deep, dignified PB29 for violets (quin red light verified), forest greens with phthalo green, storm greys with burnt sienna (verified). "Finest" often means smoother particle story — more suit, less gravel — so if DS French is a rock concert, this can be chamber music. Still ultramarine warmth; still not phthalo's teal tyranny.

Dual advice: Finest tube + DS French = manners contest inside one seat. Keep both only if you deliberately want smooth mix blue and granulating sky blue. Otherwise one well.`,
    ace_history: `Synthetic ultramarine as European atelier reference blue — Horadam's feinst grade is what many mix charts quietly assume. Lapis romance, modern mill.`,
  },
  "sen-315-ultramarine-deep": {
    temp_role:
      "Warm deep ultramarine · Night-leaning PB29 · honey French manners",
    ace_note: `Deeper than polite ultramarine — night skies with gravitas.

Masstone reads deeper/navy than sky-pastel ultramarines — good for evening cloth, deep water under a warm light, gravitas without reaching for black. Honey binder: soft rewet, hungry blooms. May granulate less than DS French; don't buy it only for sediment theater.

Dual advice: still the ultramarine seat, deeper costume. Vs Indigo/Prussian/Deep Sea: those are cooler or greener darks. One deep ultramarine is enough beside one sky ultramarine only if you paint night and day constantly — most kits need one PB29.`,
    ace_history: `PB29 again — "Deep" is the colourman's darker cut. Sennelier honey continues 19th-century French rewet culture around a modern synthetic classic.`,
  },
  "sch-tube-953-deep-sea-blue": {
    temp_role:
      "Warm-deep marine ultramarine · Deep Sea granulating sky-water · PB29 special",
    ace_note: `Schmincke Deep Sea Blue — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set.

Play lab (granulation): Deep Sea line is built for abyss demos — pigment encouraged to settle like depth markers on cold-press. Try a two-stage sea: wet the paper, drop Deep Sea Blue for body, then touch Deep Sea Indigo into the still-wet darks (verified layering mood on indigo's card). Don't brush the life out of it; tickle edges. Granulation reads as current and particulate water, not flat poster navy.

Still ultramarine-family soul (PB29) — warmer marine than phthalo ocean. Twin any 2ml sample as one color.

Dual advice: vs DS French: both granulating PB29 — Deep Sea is the marine marketing cut, French is the classical sky cut. One granulating ultramarine + one abyss indigo is a stronger pair than two mid ultramarines.`,
    ace_history: `Deep Sea series (2020s Horadam) dresses classical ultramarine in submarine theater — same PB29 lineage as church blue, new sediment choreography for contemporary seascape workshops.`,
  },
  "sch-tube-973-galaxy-blue": {
    temp_role:
      "Deep granulating blue · Ultramarine + black · cosmic night wash",
    ace_note: `Deep granulating blue — night sky and cosmic washes.

Play lab (granulation): Black (PBk6) is invited to the ultramarine party — particles drop like cheap planetariums on rough paper. Wet-in-wet with a clean water bloom in the center can leave a "nebula" of lighter blue around darker flocks. Fun until it hits a clean portrait sky: chroma dies, mood goes sci-fi. Tilt once; resist the urge to scrub (you'll get grey soup).

Cousin to WN Dark Blue Shadows (also PB29+black) and Galaxy Brown logic: respect the black.

Dual advice: effect / night seat — not your violet primary. If Dark Blue Shadows pan already owns twilight, Galaxy tube is optional double. Don't mix Galaxy + Van Dyck + pure black as three "make it darker" habits.`,
    ace_history: `"Bleu galaxie" = ultramarine plus carbon black with sedimentary marketing. Modern special-effect blue; the cosmos is optional, the pigment codes are not.`,
  },
  "sch-tube-961-glacier-blue": {
    temp_role:
      "Cool phthalo blue · Glacier-series granulating cool · icy water with grit",
    ace_note: `Schmincke Glacier Blue — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set.

Play lab (granulation): Plot twist — phthalo (PB15) that granulates in this series. Most phthalos are smooth tyrants; Glacier wants ice with texture. On cold-press, cool blue can flocculate into glacial milk-streaks, especially with mist. Still dose carefully: phthalo tinting strength doesn't retire just because it's pretty. Mix a micro-dot into yellow for ice-mint greens; overdo it and the glacier owns July.

Vs half-pan cerulean: greener/modern stain lineage vs milky mineral. Vs MG/Sennelier/W&N phthalo tubes: those may be smoother — Glacier is the textured cool.

Dual advice: one cool phthalo-blue seat (Glacier or Winsor GS or MG or Sennelier). Keep Glacier when you specifically want cool + granulation; keep a smooth phthalo when you want glassy washes.`,
    ace_history: `PB15 phthalocyanine — mid-century power blue. Glacier line applies Horadam's sedimentary specials thinking to cool blues: ice-name marketing, modern molecule, optional grit.`,
  },
  "sch-tube-962-glacier-turquoise": {
    temp_role:
      "Cool turquoise · Phthalo turquoise (PB16) · granulating tropical ice",
    ace_note: `Schmincke Glacier Turquoise — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set.

Play lab (granulation): PB16 is already a blue-green jewel; Glacier adds settle-and-sparkle on texture. Try salt or light mist on a juicy turquoise wash for lagoon freckles — educational chaos. With a warm sand (raw sienna / desert brown) at the shoreline, granulation sells "shallow water over grit." Avoid using it as your only "blue" for violets — it'll pull green and break hearts.

Dual advice: same turquoise seat as W&N Phthalo Turquoise (usually smoother/staining). One tropical well. Not a second Glacier Blue unless you paint nothing but reefs.`,
    ace_history: `Phthalo turquoise (PB16) = clean tropical blue-green without gemstone grinding. Glacier branding = cold clarity + Horadam texture hobby.`,
  },
  "mg-140-phthalo-blue": {
    temp_role:
      "Cool phthalo blue (GS) · Staining sky-thief · honey rewet · transparent",
    ace_note: `The staining sky-thief — one drop cools a whole wash. Honey makes it rewet nicely; your ego still needs a tiny brush.

Green-shade PB15:3: turquoise lean when diluted, emerald crimes with yellow, violet fights with rose (test ratios — both may stain). Not a granulation toy — smooth power. Honey open time is lovely; the stain is the lesson.

Dual advice: one GS phthalo among MG / Sennelier / Winsor GS / Glacier Blue. Glacier if you want grit; MG if you want honey volume. Never three green-shade phthalos in one tin.`,
    ace_history: `Copper phthalocyanine blue — 20th-century chroma engine. PB15:3 green shade is the icy mixer behind countless teals; series 2 economics for a color that outlives its tube.`,
  },
  "sen-326-phthalo-blue": {
    temp_role:
      "Cool phthalo blue (GS) · Honey French primary cool · staining tool",
    ace_note: `Primary cool blue with honey slip — staining as a bad habit and useful as a tool. Tiny touch for turquoise seas and jewel shadows; overdo it and it owns the wash.

Same GS phthalo seat as MG — honey French accent, excellent lightfastness, série 1 workhorse. Whisper with phthalo green deep for blue-greens (both stain). Educational fun here is control, not sediment: practice a graded wash with a rice-grain of paint.

Dual advice: MG vs Sennelier vs Winsor GS = binder/brand manners, one role. Pick your honey vs gum arabic politics; leave the duplicates.`,
    ace_history: `"Bleu de Phtalo Vert / primaire" — French primary cool in l'Aquarelle honey. Modern primary systems replaced weaker historical cool blues with this molecule.`,
  },
  "wn-tube-winsor-blue-gs": {
    temp_role:
      "Cool phthalo blue (GS) · British primary cool · staining transparent",
    ace_note: `W&N Professional Winsor Blue (Green Shade) — classic British workhorse in 5ml.

The UK chart's cool primary: GS phthalo for seas, icy skies, and greens that go laser with cool yellow. Smooth professional pan/tube culture — granulation is not the product promise. Dose like gossip: a little goes everywhere.

Dual advice: GS seat shared with MG/Sennelier/Glacier. Winsor if you already live in W&N reds/quin for clean systems; Glacier if you want cool and grit.`,
    ace_history: `Winsor "primary" branding over PB15:3 — British colourman tradition, modern phthalocyanine. Series 1 because they expect you to empty it.`,
  },
  "wn-tube-winsor-blue-rs": {
    temp_role:
      "Cool-warm phthalo blue (RS) · Violet-friendly cool · staining transparent",
    ace_note: `W&N Professional Winsor Blue (Red Shade) — classic British workhorse in 5ml.

Red shade (PB15:1) is the plot: still phthalo power, but biased toward cleaner violets with quin/cool reds — less automatic turquoise than GS. Educational pair: paint two swatches GS vs RS + the same magenta; watch which violet stays royal and which goes bruised teal.

Dual advice: if you only buy one Winsor Blue, choose by subject — water/teal → GS, florals/violets → RS. Owning both is legitimate for serious cool-blue nerds; still not a third brand's GS.`,
    ace_history: `Phthalo blue red-shade is the warm-leaning twin in the Winsor primary pair — engineered for mixing clean purples beside British quin reds, not for granulating demos.`,
  },
  "wn-tube-phthalo-turquoise": {
    temp_role:
      "Cool turquoise · Phthalo turquoise · staining tropical transparent",
    ace_note: `W&N Professional Phthalo Turquoise — classic British workhorse in 5ml.

Clean tropical PB16 — poster lagoon, glass wave, jewelry shadow. Staining transparent; usually smooth, not Glacier's grit story. One touch in a warm grey cools it toward sea glass.

Dual advice: one turquoise seat vs Glacier Turquoise. Smooth W&N vs granulating Horadam — pick by whether you want ice freckles or pure stain clarity.`,
    ace_history: `PB16 phthalo turquoise — tropical clarity without gemstone mining. W&N series 2 professional staple for designers and seascape painters who like control.`,
  },
  "sch-952-deep-sea-indigo": {
    temp_role:
      "Cool deep blue-green · Abyssal indigo (indanthrene + phthalo green) · granulating marine",
    ace_note: `Deep diving blue-green — night water and whale shadows.

Not classical plant indigo and not half-pan "Indigo" alone: PB60 + PG7 pushes abyss teal-navy. Granulating Deep Sea series manners — layer with Deep Sea Blue, rhyme with Undersea Green, storm with Sea Blue. This is structural night water, not a violet primary.

Play lab (granulation): Abyss particles love rough cold-press. Lay a mid Deep Sea Blue body, then charge Indigo into the still-glistening dark — let a bead of water cut a "current." Salt optional for kelp freckles; too much brushwork = muddy harbor. PG7 in the blend means granulation can read slightly green-black in flocks — that's whale, not ultramarine sky.

Dual advice: vs half-pan Indigo (PB60): deeper/greener here because PG7 is invited. Vs Prussian: different stain/teal personality — don't stack three deep cools in one tin. One abyss seat.`,
    ace_history: `Schmincke's Deep Sea line (2020s) builds granulating marine blends for abyssal light demos. Indigo here is indanthrene + green chemistry, not vat dye — trust the pigment codes.`,
  },
  "sch-tube-952-deep-sea-indigo": {
    temp_role:
      "Cool deep blue-green · Same abyss soul as pan SKU · tube for bigger washes",
    ace_note: `Schmincke Deep Sea Indigo — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set.

Same whale-shadow seat as sch-952-deep-sea-indigo — different faucet in the database. Use tube logic when night water needs a passage; keep pan for tin. Mix tips already point at Deep Sea Blue, Moonglow fantasy, ultramarine coast greys.

Play lab (granulation): Abyss particles love rough cold-press. Lay a mid Deep Sea Blue body, then charge Indigo into the still-glistening dark — let a bead of water cut a "current." Salt optional for kelp freckles; too much brushwork = muddy harbor. PG7 in the blend means granulation can read slightly green-black in flocks — that's whale, not ultramarine sky.

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

p.updated = new Date().toISOString().slice(0, 10) + "-blue-tube-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Blue tube cards applied: ${nUp}`);
const granPlay = p.colors.filter(
  (c) => updates[c.id] && (c.ace_note || "").includes("Play lab (granulation)")
).length;
console.log(`With granulation Play lab: ${granPlay}`);
