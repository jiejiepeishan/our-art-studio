/**
 * Strip Mix With restatements from ace_note Play labs / body text.
 * Keep process advice; leave pairings to mix_tips UI.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "ds-moonglow": `The drama queen. Three pigments having a party on wet paper — violet, blue-green halos, granulation everywhere. Skies, snow shadows, anything that needs magic hour.

Play lab (granulation): Don't fight the party — wet paper, drop, walk away. Anthraquinoid red + ultramarine + viridian separate into violet cores and blue-green halos on their own. Over-stir = muddy divorce. Not a primary; a weather spell.

Dual advice: one Moonglow-class effect well. Don't also need Purple Mist + Sunset Mist + Moonglow unless you only paint magic hour. Never use as "my only purple."`,

  "wn-635": `Muted purple with an orange-pink halo — wet washes look like purple hour skies splitting into blue and warm glow.

Play lab (granulation): PB29 flocks cool while PO73 (pyrrole orange family) throws a warm halo — purple-hour skies that literally split if you leave them alone. Effect pan, not violet primary.

Dual advice: weather / sunset seat with Purple Mist — different split (blue+orange vs green+quin). One or two mists if you paint skies; zero if you only need primaries.`,

  "wn-398-purple-mist": `Burgundy-grey with a wandering quin pink — cobalt green granules settle like grey-green trails in wet florals.

Play lab (granulation): Two bosses — PG50 granulates grey-green trails while PV19 rides the water pink-violet. Don't over-stir or you lose the split personality. Atmosphere pan, not a clean primary purple.

Dual advice: effect seat only. If you already own Rose Mist + a green, optional. One multi-pigment purple weather pan max with Sunset Mist.`,

  "mg-194-ultramarine-violet-deep": `Night-sky violet with mineral freckles — deeper than plain ultramarine violet. Perfect for dusk shadows and moody florals that granulate.

Play lab (granulation): Honey + PV15 freckles — deeper and grittier than lighter ultramarine-violet cuts. Wet cold-press, tip once, leave the mineral. Big-tube volume for dusk passages.

Dual advice: mineral violet seat with Schmincke Ultramarine Violet pan and Deep Sea Violet — one deep PV15. Honey volume for big washes; half-pan for travel.`,

  "sch-fp-495-ultramarine-violet": `Mineral violet with ultramarine grit — florals, dusk, and soft cool shadows.

Play lab (granulation): PV15 + PB29 — purple sibling of ultramarine blue with flock and soft lift. Wet cold-press for mineral dusk; florals that want texture not stain-tyranny. Less staining drama than quin violets.

Dual advice: mineral violet seat with RS Mineral Purple and Tundra (PV16). One granulating mineral purple in a small tin. Vs quin PV19: mineral grit vs organic stain.`,

  "sch-953-deep-sea-blue": `Deep Sea Blue brings warm blue energy to the tin — worth knowing by temperature, not just by pretty swatch.

Play lab (granulation): Sample twin of the 5ml Deep Sea Blue tube — same PB29 marine cut, try-before-you-commit. Wet paper, drop, tip once; let sediment read as current, not flat poster navy. One faucet with the tube: don't fill two wells.

Dual advice: tube + 2ml = one color. Vs DS French: classical sky grit vs Deep Sea submarine marketing — one granulating ultramarine is enough for most tins.`,

  "sch-tube-953-deep-sea-blue": `Schmincke Deep Sea Blue — granulating marine ultramarine. Check 5ml tube vs any 2ml sample twin in your set.

Play lab (granulation): Deep Sea line wants abyss demos — pigment settling like depth markers on cold-press. Wet the paper, drop for body, leave edges alone; tickle, don't scrub. Granulation reads as current and particulate water, not flat poster navy.

Dual advice: vs DS French: both granulating PB29 — Deep Sea is the marine marketing cut, French is the classical sky cut. One granulating ultramarine + one abyss indigo is a stronger pair than two mid ultramarines.`,

  "mb-potters-pink": `The quiet fixer-upper of your palette. Dusty rose that softens loud mixes and makes skin feel human instead of plastic. I would marry this color if it were legal.

(Marriage clause stands — this is the salon pink that fixes everything without raising its voice.)

PR233 is not a screaming primary: it's porcelain dust and powdered cheek. Drop it into a loud red or yellow to humanize skin. Transparent enough to glaze; polite enough for portraits that shouldn't look like vinyl.

Dual advice: one Potter's Pink among MB, Roman Szmal, and Pinax Deep. MB is the soft classic; Deep is granulating shadow sister; RS is manners science. Travel tin gets one dusty rose, not a ceramics factory.`,

  "wn-511": `Warm-leaning blue with old-soul granulation — skies, cloth, and neutrals when it meets a warm earth.

Same classical ultramarine seat as your Schmincke/Pinax half-pans: the warm blue job for skies, cloth, and chromatic greys. Full pan = stop rationing the sky. White Nights may granulate less loudly than some Horadam grinds — manners, not a different fairy tale.

Dual advice: one PB29 well across the whole studio kit story. If French/Finest/Pinax half-pan already lives in the travel tin, this full pan is desk stockpile — not a second role. Don't also promote every WN "mystery blue" as another primary.`,

  "sen-211-burnt-sienna": `Third burnt sienna in the family — compare all three on one swatch card.

That's the whole plot of the original note: you already own the role. Sennelier's honey base often blooms soft and French-polite. It may granulate less loudly than DS; treat that as manners, not failure.

Dual advice: one burnt sienna seat per kit. Swatch DS / MG / Sennelier / Schmincke half-pan on one card under the same ultramarine. Keep the grey and rewet you love; demote the rest to "studio backup tube," not four wells. Shopping tip: you are not missing a pigment — you are sampling binders.`,

  "sch-tube-494-ultramarine": `Schmincke Ultramarine — fine-milled PB29 tube. Check 5ml tube vs any 2ml sample twin in your set.

Tube twin of half-pan Ultramarine Finest: deep, dignified PB29. "Finest" often means smoother particle story — more suit, less gravel — so if DS French is a rock concert, this can be chamber music. Still ultramarine warmth; still not phthalo's teal tyranny.

Dual advice: Finest tube + DS French = manners contest inside one seat. Keep both only if you deliberately want smooth mix blue and granulating sky blue. Otherwise one well.`,

  "mg-190-ultramarine-blue": `M. Graham Ultramarine Blue — honey base, 2ml sample. Blooms on wet paper if you lean in.

Same classical PB29 seat as every other ultramarine in the studio — honey slip, open blooms, soft edges if you feed it water. Data doesn't flag strong granulation on this SKU; the fun is binder manners, not flock theater.

Dual advice: one ultramarine honey sample to decide if MG joins DS French / Schmincke Finest. Don't promote every brand's PB29 into the travel tin — pick the grey and rewet you love.`,
};

const p = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));
let n = 0;
for (const c of p.colors) {
  if (updates[c.id]) {
    c.ace_note = updates[c.id];
    n++;
    console.log("ok", c.id);
  }
}
p.updated =
  new Date().toISOString().slice(0, 10) + "-dedupe-mix-from-ace-notes";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("updated", n);
