/**
 * Apply handwritten blue · 2ml sample color cards
 * (Desktop blue-2ml-draft.md, approved).
 * Completes blue family handwritten pass (36/36).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "ds-138-lapis-lazuli-genuine": {
    temp_role:
      "Quiet gem blue-grey · Genuine lapis (PrimaTek) · history you can see settle",
    ace_note: `Not ultramarine's loud cousin — a quiet gem blue-grey that granulates like history. Use sparingly; it earns every millimetre.

Play lab (granulation): This is rock, not PB29 cosplay. Irregular particles + light-reflective flecks want cold-press, patient water, minimal scrubbing. Wet the paper, drop a dilute veil, let it find valleys — you'll get a soft blue-grey field with glittery hush, not French Ultramarine's warm sky punch. Overwork it and you grind jewelry into mud. Educational fun: swatch lapis next to DS French on the same strip; same "blue family" in the brain, completely different paper behavior.

Series 5 / tiny sample = treat like saffron. Beautiful in skies that should feel old, illuminated edges, quiet cloth — not your daily chromatic grey engine.

Dual advice: does not replace ultramarine in the kit. Own lapis for soul and demos; keep PB29 for violets and sienna storms. If the 2ml ever empties, mourn once, then ask if you paint enough "museum blue" to refill Series 5.`,
    ace_history: `Lapis lazuli was the medieval luxury blue (ground rock, often from Afghanistan) before 1820s synthetic ultramarine democratized the sky. DS PrimaTek puts the gem back in the pan — irregular, reflective, patient. The loud cousin won history; the quiet rock kept the legend.`,
  },
  "ds-183-lunar-blue": {
    temp_role:
      "Night-sky granulator · Phthalo + ultramarine duet · lunar sediment",
    ace_note: `Lunar blue — floats, granulates, night sky in a sample pan.

Play lab (granulation): Two bosses in the well — PB15 (cool stain power) + PB29 (mineral flock). On wet cold-press it can float and separate: cooler veils, warmer flecks, that DS "Lunar" family drama. Verified with Moonglow → night sky violet granulation conversation; with burnt sienna → weathered slate. Try a clean water bloom into a still-wet lunar wash for crater-edge softens. Warning: staining lean means the moon remembers where it sat.

Dual advice: effect / night seat — not a second primary ultramarine and not a pure phthalo. If Galaxy Blue tube or Dark Blue Shadows already do twilight, Lunar is the DS specialty encore. Sample size is perfect: learn the separation, then decide on a bigger tube.`,
    ace_history: `Lunar line = DS granulation theater using modern pigment pairs. Phthalo + ultramarine is a contemporary night-sky recipe, not a moon rock — the romance is in the settle.`,
  },
  "ds-196-blue-apatite": {
    temp_role:
      "Cool cloudy gem blue · PrimaTek-named apatite mood · phthalo+green granulation",
    ace_note: `PrimaTek blue apatite — granulating cloudy gemstone skies.

Play lab (granulation): Label romance says gemstone; pigment line is PB15/PG7 — cool stain + green pull, encouraged to cloud and grit. Expect stormy teal-blue flocks, not pure ultramarine violet honesty. Wet-in-wet on rough paper → "apatite sky" with mineral gossip; mix a whisper into yellow for strange sea greens. Staining: plan lights first.

Dual advice: read it as a textured cool marine, cousin to Glacier Blue / turquoise seats — not true single-mineral jewelry pure enough to replace lapis storytelling. Keep when the cloudy granulation makes you grin; skip if you already own three granulating cools (Lunar, Glacier, Deep Sea).`,
    ace_history: `Apatite is a real phosphate mineral family; PrimaTek branding sells gemstone mood. This SKU's listed pigments are phthalo blue + phthalo green — modern chemistry wearing a rock name. Trust the code for mixes; enjoy the name for poetry.`,
  },
  "sch-953-deep-sea-blue": {
    temp_role:
      "Warm-deep marine ultramarine · Deep Sea sample twin · granulating water",
    ace_note: `Deep Sea Blue brings warm blue energy to the tin — worth knowing by temperature, not just by pretty swatch.

Play lab (granulation): Sample twin of the 5ml Deep Sea Blue tube — same PB29 marine cut, try-before-you-commit. Wet paper → drop sample → charge Deep Sea Indigo into darks for trench layering (verified on cards). Shoreline greys with burnt sienna also verified. One faucet with the tube: don't fill two wells.

Dual advice: tube + 2ml = one color. Vs DS French: classical sky grit vs Deep Sea submarine marketing — one granulating ultramarine is enough for most tins.`,
    ace_history: `Same Deep Sea / PB29 story as the tube — church blue in a diving suit. Sample format is Horadam's honest "see the sediment first."`,
  },
  "sch-904-ice-blue": {
    temp_role:
      "Pale cool blue · Ethereal winter veil · dilute phthalo ice",
    ace_note: `Mist limited ice — ethereal winter light.

Pale, high-key, winter window blue — more breath than ocean. PB15 family means a little can still cool a wash; the limited Mist presentation aims ethereal, not navy. Not a granulation playground (data doesn't flag grit) — educational fun is value control: can you keep it ice without going baby-boy poster?

Dual advice: atmosphere / high-key seat. Won't replace ultramarine, cerulean milk, or deep phthalo. If Aquamarine Mist or Glacier Blue already cover cool pale water, Ice Blue is optional climate dessert. Limited = enjoy, don't base a whole primary system on it.`,
    ace_history: `Mist limited specials are Horadam mood colors — often light, atmospheric cuts of familiar chemistries. Ice Blue rides phthalo's cool gene at whisper value for winter sketches and frosty glass.`,
  },
  "mg-190-ultramarine-blue": {
    temp_role:
      "Warm ultramarine · Honey-binder sample · sky/mix primary try-on",
    ace_note: `M. Graham Ultramarine Blue — honey base, 2ml sample. Blooms on wet paper if you lean in.

Same classical PB29 seat as every other ultramarine in the studio — honey slip, open blooms, soft edges if you feed it water. Card invites comparing greys: MG umber vs DS sienna granulation in the same blue (verified tip energy). Data doesn't flag strong granulation on this SKU; the fun is binder manners, not flock theater.

Dual advice: one ultramarine honey sample to decide if MG joins DS French / Schmincke Finest. Don't promote every brand's PB29 into the travel tin — pick the grey and rewet you love.`,
    ace_history: `Ultramarine's lapis-to-synthetic arc, M. Graham chapter: honey/glycerin culture for rewet and bloom. Series sample box logic — empty the 2ml before you marry the 15ml.`,
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

const blueMissing = p.colors
  .filter((c) => c.family === "blue" && !(c.ace_note || "").includes("Dual advice"))
  .map((c) => c.id);
if (blueMissing.length) {
  console.warn("Blue still without Dual advice:", blueMissing.join(", "));
}

p.updated = new Date().toISOString().slice(0, 10) + "-blue-2ml-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Blue 2ml cards applied: ${nUp}`);
console.log(
  `Blue with Dual advice: ${
    p.colors.filter((c) => c.family === "blue" && (c.ace_note || "").includes("Dual advice")).length
  } / ${p.colors.filter((c) => c.family === "blue").length}`
);
