/**
 * Apply handwritten purple · tube color cards
 * (Desktop purple-tube-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "ds-moonglow": {
    temp_role:
      "Cool multi-pigment violet · Moonglow party · magic-hour sky / snow shadow · ◈",
    ace_note: `The drama queen. Three pigments having a party on wet paper — violet, blue-green halos, granulation everywhere. Skies, snow shadows, anything that needs magic hour.

Play lab (granulation): Don't fight the party — wet paper, drop, walk away. Anthraquinoid red + ultramarine + viridian separate into violet cores and blue-green halos. With burnt sienna → warm-violet storm (verified); with WN ultramarine → cooler galaxies (verified); with Undersea Green → kelpy twilight (verified). Over-stir = muddy divorce. Not a primary; a weather spell.

Dual advice: one Moonglow-class effect well. Don't also need Purple Mist + Sunset Mist + Moonglow unless you only paint magic hour. Never use as "my only purple."`,
    ace_history: `Modern DS hero — deliberate three-pigment dance for granulation on the paper, not a single historic tube. Named for the hour, engineered for cold-press.`,
  },
  "ds-203-amethyst-genuine": {
    temp_role:
      "Cool gem violet · PrimaTek amethyst · near-black mass / soft lilac wash",
    ace_note: `Rich purple that granulates like crushed gem — almost black in mass tone, soft lilac in wash. Primatek sparkle if the light hits right.

Play lab (granulation): Rock, not quin — heavy particles settle, lighter float. Thick = almost black jewel; dilute = soft lilac veil. Sparkle in raking light. Patience; scrubbing kills the gem story.

Dual advice: PrimaTek specialty — not PV19 primary. Keep for gem/mineral demos; don't replace Ultramarine Violet or Quin Lilac. Series cost = treat like saffron.`,
    ace_history: `Amethyst ground since antiquity for ornament; DS PrimaTek returns the stone to the pan. Heavier settle, lighter float — geology as watercolor.`,
  },
  "mg-194-ultramarine-violet-deep": {
    temp_role:
      "Cool deep mineral violet · PV15 deep · honey dusk / moody florals · ◈",
    ace_note: `Night-sky violet with mineral freckles — deeper than plain ultramarine violet. Perfect for dusk shadows and moody florals that granulate.

Play lab (granulation): Honey + PV15 freckles — deeper than half-pan/pan Ultramarine Violet cuts. Dusk shadows, mineral florals; gradient with Ultramarine Pink (card tip energy). Shared grit with ultramarine blue washes.

Dual advice: mineral violet seat with Schmincke Ultramarine Violet pan and Deep Sea Violet — one deep PV15. Honey volume for big washes; half-pan for travel.`,
    ace_history: `Ultramarine violet (PV15) — sulfur-complex silicate in the ultramarine family; granulating when flat organics feel plastic. Series 3 deep cut; honey rewet.`,
  },
  "sch-tube-951-deep-sea-violet": {
    temp_role:
      "Cool deep marine violet · Manganese + ultramarine · Deep Sea trench purple",
    ace_note: `Schmincke Deep Sea Violet — granulating trench purple. Check 5ml tube vs any 2ml sample twin in your set.

Play lab (granulation): Deep Sea line — PV16 + PB29 for abyssal violet sediment. Layer with Deep Sea Blue/Indigo; coast night water. Tilt; don't scrub the trench flat.

Dual advice: marine mineral seat with Galaxy Violet and Ultramarine Violet. One Deep Sea violet faucet (tube + sample = one color).`,
    ace_history: `Manganese violet + ultramarine for Horadam submarine fantasy — quieter than quin fireworks, built for depth demos.`,
  },
  "sch-tube-972-galaxy-violet": {
    temp_role:
      "Cool nebula violet · Manganese + black · granulating star-dust purple",
    ace_note: `Galaxy violet granulation — nebula purples with sediment stars.

Play lab (granulation): PV16 + PBk6 — darker, chroma-killing cousin of mineral purple (same black whisper as RS Mineral Purple / Galaxy Rose logic). Nebula pours, night florals; respect the black in clean skin or lemon mixes.

Dual advice: effect/mineral dark with Deep Sea Violet — Deep Sea is marine blue-violet; Galaxy is blacker cosmic. One specialty dark violet.`,
    ace_history: `Violet galaxie — manganese violet plus carbon for sedimentary cosmos. Marketing optional; codes required.`,
  },
  "hb-lavender": {
    temp_role:
      "Cool soft lavender · White + mineral violet + blue · convenience periwinkle · ◈",
    ace_note: `Soft periwinkle convenience — florals and denim cools without mixing three tubes every time.

Play lab (granulation): PW6 milks mineral violet/blue into soft periwinkle with gentle grit — florals, denim, quiet sky cools. Not a staining primary; a pastel convenience. Overuse can chalk; underuse and you'll mix it from three pans anyway (the point of the tube).

Dual advice: convenience light-violet seat — one lavender/periwinkle. Vs pure PV15 deep: this is high-key milky; deep is night. One well.`,
    ace_history: `Holbein Japanese buttery rewet and clear labeling — modern pastel mineral mix (white + ultramarine violet + blue), not Victorian garden dirt.`,
  },
  "sen-905-red-violet": {
    temp_role:
      "Cool-warm red-violet · PV19 honey · florals / wine shadows",
    ace_note: `Velvet violet-red — florals and wine shadows with Parisian flair.

PV19 again — honey French manners, velvet wine-red violet for florals and shadows. Same cool-quin seat as Lilac / Quin Violet / pink roses; Sennelier flair and 10ml volume. Not PR122 brilliant; not PV55 electric.

Dual advice: one PV19 across brands. Honey if you love bloom; keep one well.`,
    ace_history: `Quinacridone PV19 with l'Aquarelle honey — Parisian floral primary. Serie 3; modern molecule, old-city romance.`,
  },
  "wn-tube-tyrian-purple": {
    temp_role:
      "Cool deep royal purple · Modern \"Tyrian\" blend · botanical dusk · ◈ · staining",
    ace_note: `Royal, botanical purple — deep red-violet for florals and dusk without mixing a muddy pile. Stains with purpose.

PV37/PR202 modern homage to legendary murex dye — deep red-violet, royal botanical, staining with purpose. Permanence often only "good/B" on charts — gorgeous for work, check if heirs need lightfast A. Not a mixed muddy pile when you dose right.

Dual advice: specialist deep purple — vs Perylene (glaze shadow) and PV19 (cleaner cool). One royal deep. Don't buy for the snail story alone; buy for the swatch.`,
    ace_history: `Named for antiquity's murex purple — modern synthetic homage without the snails. W&N Professional; historic depth, contemporary codes.`,
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

p.updated = new Date().toISOString().slice(0, 10) + "-purple-tube-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Purple tube cards applied: ${nUp}`);
