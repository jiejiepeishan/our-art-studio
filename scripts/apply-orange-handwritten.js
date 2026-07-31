/**
 * Apply handwritten orange-family color cards (Desktop draft, approved by Liz).
 * Also strips robotic "On paper:..." tails from other families until their batch is rewritten.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-hp-214-chromium-orange": {
    temp_role: "Warm orange · Sunset / heat accent · more body than a pure stain",
    ace_note: `Sunset bait. Opaque and confident — one touch warms an entire landscape edge.

Think of it as heat you can aim: roofs at six o'clock, terracotta pots, the warm side of a cheek when the cool rose is already in the shadow. Mixed with a cool blue it dirties fast into olive-mud — that's not a failure, it's a warning that this pan wants warm company (yellow, sienna, a soft red) more than it wants ultramarine arguments.

Dual advice: if you already own a transparent orange (like DS Transparent Orange), keep this one for covering and solid sun; use the transparent cousin for glow through paper. You rarely need two opaque fire pans — you often need one that covers and one that glazes.`,
    ace_history: `Chromium / benzimidazolone oranges (PO62) stand in for the old lead-chrome "chrome orange" of industrial color — the forbidden bright that posters and sign painters loved. Horadam's "Hue" keeps the temperature of that tradition with modern lightfast organics, milled for Schmincke's creamy rewet rather than chalky house-paint drama.`,
  },
  "sch-tube-214-chromium-orange": {
    temp_role: "Warm orange · Same soul as the half-pan · tube for bigger washes",
    ace_note: `Schmincke Chromium Orange Hue — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set.

Same fire, different faucet: the tube is for when sunset needs a passage, not a postage stamp. If half-pan and tube both live in the studio, treat them as one color in kit logic (don't fill two wells for ego). Use the tube when you're painting sky bands; keep the pan for travel tins.

Dual advice: one well of PO62 is enough. Spend the second orange slot on a transparent heat (quin gold / transparent orange) if you want glaze stories.`,
    ace_history: `Same PO62 chromium-orange-hue story as the half-pan — modern stand-in for historic chrome orange temperature. Tube format is for volume and studio sessions; the chemistry's job doesn't change with the plastic.`,
  },
  "ds-187-transparent-orange": {
    temp_role: "Warm orange · Glaze heat · transparent sunset",
    ace_note: `Transparent orange heat — sunsets without opacity.

This is the opposite of brick on top of the paper. PO48 (perinone family) wants light through the wash: late sky, silk scarves, fruit skin that still looks juicy. Drop it into a wet blue and you get soft bruised violets and storm edges; drop it into yellow and the sun gets louder without turning into poster paint.

Dual advice: if Chromium Orange Hue is already your opaque hammer, this is the glass. Don't buy a third warm orange just in case — learn when you need cover vs when you need glow. Cadmium orange fans: this is how you get heat without the heavy blanket.`,
    ace_history: `Transparent Orange (PO48) is a modern perinone pigment — built for clean, luminous orange that cadmium's opacity can't do. Contemporary landscape and floral painters glaze with it where old opaque oranges would sit like shutters on the paper. DS markets that glow hard; the legend is chemistry, not a medieval name.`,
  },
  "sen-645-chinese-orange": {
    temp_role: "Warm orange-brown · Convenience sunset blend · honey binder",
    ace_note: `Gradient orange from deep burnt to bright gold — sunset in one pigment.

Because it's a blend (nickel azo yellow + quin red + brown), it already behaves like a tiny recipe: gold at the dilute end, burnt fruit in masstone. Lovely when you want hour of the day without mixing three pans on a windy street. The tradeoff: you can't always untangle which pigment is bossing a mix — if a green goes dead, it may be the brown note whispering.

Dual advice: great travel convenience; for learning orange, also keep a single-pigment warm (PO62 or PO73) so you know what pure orange does when the blend misbehaves. Honey binder will rewet hungry — give it a moment.`,
    ace_history: `"Chinese Orange" is a commercial name for a modern multi-pigment convenience orange (here PY150 + PR209 + PBr23), not a single historical Chinese lacquer pigment. Sennelier's honey base continues their 19th-century habit of soft, rewettable color — sunset marketing with a French accent.`,
  },
  "wn-tube-winsor-orange-rs": {
    temp_role: "Warm red-orange · Pyrrole fire · staining primary orange",
    ace_note: `W&N Professional Winsor Orange (Red Shade) — classic British workhorse in 5ml.

PO73 is pyrrole territory: cleaner and more modern than earth oranges, with enough stain that a bold mark means it. Mix with a cool yellow for traffic-cone brightness; with a cool blue for near-neutrals that still feel designed, not muddy brown. Red shade means it leans toward coral-scarlet — excellent for poppies and signal lights, less pumpkin pie than a yellow-shade orange.

Dual advice: if you already keep Scarlet Pyrrol / other pyrroles for red, this orange is the bridge into yellow — you may not need a separate cadmium orange. Dose carefully; staining oranges forgive less than ochres.`,
    ace_history: `Pyrrole orange (PO73) is a late-20th-century high-chroma organic — lightfast fire that finally gave watercolor a cadmium-like punch without the same opacity politics. Winsor & Newton's "Winsor" line brands it as a professional primary secondary: British colourman tradition, modern molecule.`,
  },
  "sch-hp-210-quin-gold-hue": {
    temp_role: "Warm gold-orange · Glaze autumn · transparent quin heat",
    ace_note: `Warm quin gold — autumn leaves and honey light in one stroke.

Less traffic cone, more late sun in a glass of whiskey. Dilute for skin warmth and backlit foliage; masstone for amber windows. With ultramarine or indigo it makes gorgeous broken neutrals and stormy greens-browns; with pinks it goes apricot skin. This is a mixer's orange-gold, not a pure secondary orange for the color wheel exam.

Dual advice: if Transparent Orange is pure sunset heat, quin gold is autumn atmosphere. You can own both; you don't need a third gold ochre unless you want mineral grit. Horadam will feel polite — lean on wet-in-wet to let it bloom.`,
    ace_history: `Quinacridone gold / PO49-type hues pull the quinacridone family into warm territory — modern transparent golds used where painters once reached for gamboge or dirty yellow ochre. "Hue" means Schmincke is matching a beloved gold effect with lightfast organics, not promising a single historic resin.`,
  },
  "pinax-pr101-iron-oxide-light": {
    temp_role: "Warm iron orange-red · Brick / roof cover · opaque earth",
    ace_note: `Warm brick light — earth that covers. Good for opaque accents and autumn roofs.

PR101 here is lighter and more orange than deep Venetian reds: think sunlit clay tile, desert road, the warm side of a plaster wall. Because it covers, it can rescue a wash that went too cool — one careful drybrush roof and the village wakes up. Mix with ultramarine for dirt greys (depending on grind); don't expect quin-style glow.

Dual advice: this is not a substitute for Transparent Orange or pyrrole fire. It's mineral cover. Use it when the painting needs weight; use the organics when it needs light through the paper.`,
    ace_history: `Iron oxide reds (PR101) are calcined iron — the brick and terracotta backbone of industrial and fine-art earths. "Light" variants aim at the orange side of Mars colors: roofs, pottery, and warm underpainting without going into deep maroon.`,
  },
};

function stripRobot(note) {
  if (!note) return note;
  return note
    .replace(/\s*On paper:[\s\S]*$/i, "")
    .replace(/\s*Temperature read:[\s\S]*$/i, "")
    .replace(/\s*Dual advice: fantastic mixer[\s\S]*$/i, "")
    .replace(/\s*Lean into texture for atmosphere[\s\S]*$/i, "")
    .replace(/\s*Hansa\/Azo-type yellows often share one job[\s\S]*$/i, "")
    .replace(/\s*With Ultramarine it builds classic greys[\s\S]*$/i, "")
    .replace(/\s*With Ultramarine it goes icy slate[\s\S]*$/i, "")
    .replace(/\s*Pair with a warm red\/orange when you need heat[\s\S]*$/i, "")
    .trim();
}

const p = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));
let nUp = 0;
let nStrip = 0;

p.colors = p.colors.map((c) => {
  if (updates[c.id]) {
    nUp++;
    return { ...c, ...updates[c.id] };
  }
  const stripped = stripRobot(c.ace_note);
  if (stripped !== c.ace_note) {
    nStrip++;
    return { ...c, ace_note: stripped };
  }
  return c;
});

p.updated = new Date().toISOString().slice(0, 10) + "-orange-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Orange cards applied: ${nUp}`);
console.log(`Robot tails stripped elsewhere: ${nStrip}`);
