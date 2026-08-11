/**
 * Remove Mix With restatements from purple Play lab / ace notes.
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
};

// Clean draft text for 2ml not yet applied — prep if present in palette short notes
// Hematite / Rose of Ultramarine not Dual yet — fix when applying 2ml

const p = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));
let n = 0;
for (const c of p.colors) {
  if (updates[c.id]) {
    c.ace_note = updates[c.id];
    n++;
    console.log("cleaned", c.id);
  }
}

// Scan all Dual-advice colors for Play lab lines that list "with X →" verified patterns
// Manual fix list was enough for purple; also fix other families that do verified dumps in play lab
const reVerifiedMix =
  /with [^\n]+→[^\n]+\(verified[^\n]*\)/gi;

let extra = 0;
for (const c of p.colors) {
  const note = c.ace_note || "";
  if (!note.includes("Play lab")) continue;
  if (!/verified/i.test(note) && !/Mix With/i.test(note) && !/card tip/i.test(note))
    continue;
  if (updates[c.id]) continue; // already replaced

  // Flag for report
  const hasMixEcho =
    /\(verified/i.test(note) ||
    /verified on card/i.test(note) ||
    /card tip/i.test(note) ||
    /Mix With/i.test(note) ||
    /verified tips/i.test(note);
  if (hasMixEcho) {
    console.log("still_has_mix_echo?", c.id, c.name_en);
  }
}

p.updated =
  new Date().toISOString().slice(0, 10) + "-purple-playlab-dedupe-mix";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("updated", n);
