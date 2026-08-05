/**
 * Apply handwritten earth · tube color cards
 * (Desktop earth-tube-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "ds-burnt-sienna": {
    temp_role:
      "Warm roasted earth · Bark, brick, classic greys · granulating DS workhorse",
    ace_note: `Your warm-weather sketching workhorse. DS version granulates nicely; lean into it for tree bark and sun-warmed skin tones.

This is the same heat-locked dirt seat as Schmincke half-pan burnt sienna — roast iron earth for bark, tile, warm face, and the textbook greys with ultramarine/indigo. DS's reputation here is sediment personality: on cold-press it often separates into lively warm grit instead of a flat brown film. You've already verified mixes on the card (ultramarine greys, phthalo olives, May Green sunlit leaves) — trust those more than brand myth.

Dual advice: if Schmincke half-pan burnt sienna already lives in the travel tin, this tube is studio volume + granulation preference, not a second well. Swatch DS vs Schmincke vs MG once; keep one manners. Don't buy a fourth "just in case."`,
    ace_history: `Burnt sienna is iron earth roasted until red-orange appears — portrait and landscape staple for centuries. Daniel Smith's PBr7 often leans into visible granulation on wet paper; the legend is the roast + the grind, not a secret pigment code.`,
  },
  "mg-020-burnt-sienna": {
    temp_role: "Warm roasted earth · Honey-binder sienna · bark & breath",
    ace_note: `Honey-earth workhorse — bark, brick, and warm shadows that still breathe. Granulates just enough to feel alive on cold-press.

Same burnt-sienna role, different kitchen: M. Graham's honey/binder manners mean hungry rewet, soft bloom, and a roast that often feels a touch more orange-open than a dry cake pan. Use the 15ml when you're painting passages, not postage stamps. With ultramarine → storm greys; with phthalo green → deep olives — same classical jobs, honey handshake.

Dual advice: honey burnt sienna is not "better chemistry," it's different manners. If you already love DS grit or Schmincke cream, don't fill three wells. Keep MG when you paint big and rewet often; leave it out of a tiny tin if honey makes you fight the palette in wind.`,
    ace_history: `Still calcined iron earth (PBr7). M. Graham's story is the binder tradition — glycerin/honey softness that made their earths famous for rewet — not a different sienna mineral from Florence. Series 1 workhorse economics: the color that empties first earns the big tube.`,
  },
  "sen-211-burnt-sienna": {
    temp_role:
      "Warm roasted earth · Honey French sienna · third manners in the family",
    ace_note: `Third burnt sienna in the family — compare all three on one swatch card.

That's the whole plot of the original note: you already own the role. Sennelier's honey base often blooms soft and French-polite — lovely greys with Ultramarine Deep (verified on card), Provence walls with May Green, warm contrast next to something granulating like Moonglow. It may granulate less loudly than DS; treat that as manners, not failure.

Dual advice: one burnt sienna seat per kit. Swatch DS / MG / Sennelier / Schmincke half-pan on one card under the same ultramarine. Keep the grey and rewet you love; demote the rest to "studio backup tube," not four wells. Shopping tip: you are not missing a pigment — you are sampling binders.`,
    ace_history: `Burnt sienna again — roasted iron earth, the warm dark that still breathes. Sennelier's 19th-century honey watercolor habit is the brand accent: same roast family, softer French rewet culture. Serie 1 means they expect you to empty it.`,
  },
  "sch-tube-653-transparent-sienna": {
    temp_role:
      "Warm roasted earth · Glaze sienna · transparent heat (not brick cover)",
    ace_note: `Schmincke Transparent Sienna — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set.

This is not "another burnt sienna for covering bark." Transparent / Lasur manners want light through the wash: sun on a cheek, warm stone glaze, the roast glow you layer after structure exists. Same PBr7 family temperature as burnt sienna, less body — closer in job to Transparent Ochre than to an opaque brick pan. If a 2ml sample twin exists, treat tube + sample as one color in kit logic.

Dual advice: don't put Transparent Sienna and Burnt Sienna in the same tiny tin unless you deliberately want cover vs glaze. For learning temperature, one roast earth is enough; add transparent only when you glaze portraits/architecture weekly.`,
    ace_history: `PBr7 iron earth can be milled for veil or for body. "Transparent sienna" is a milling promise — roasted warmth that stains and glazes rather than sitting like tile. Horadam 5ml is studio faucet for that glassier roast.`,
  },
  "sen-919-caput-mortuum": {
    temp_role:
      "Deep iron red-brown · Renaissance shadow / Venetian dark · PR101 drama",
    ace_note: `Mortuary purple-brown — Renaissance drama in a 10ml tube.

Caput mortuum is not burnt sienna with a spooky nickname. PR101 (Mars/Venetian iron oxide) goes deep maroon-brown — cloak shadows, old brick in shade, portrait underpainting that leans violet-brown instead of orange-roast. Mix with blue for smoky purples and dead-serious neutrals; alone it is furniture and "Old Master corner." It will not give you raw umber's cool pine or sienna's sunlit brick.

Dual advice: if Van Dyck Brown (earth + black) already owns deep furniture darks, ask whether Caput is a second deep seat or a redder dark you actually use. Keep it for drama and portrait; don't let it replace chromatic blacks (ultramarine + sienna) or every landscape goes wine-cellar.`,
    ace_history: `"Caput mortuum" (death's head) is an old colourman's name for a deep violet-brown iron oxide — alchemy-era branding that stuck. Modern PR101 is calcined iron oxide: lightfast brick-to-maroon chemistry wearing a Renaissance mask. Sennelier Serie 1 keeps the myth in a honey tube.`,
  },
  "sch-tube-964-glacier-brown": {
    temp_role:
      "Warm mist-earth · Soft granulating brown-grey · earth + white (tube)",
    ace_note: `Schmincke Glacier Brown — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set.

Same plot as White Nights Hermit Mist: PW6 is in the room. Earth cut with white → fog over dirt, stone in drizzle, distant path, granulating warm grey that can veil a layer. Masstone still brown; dilute washes go milky-mist. It refuses to be your only mixing brown — chroma is already half-retired. Tube vs 2ml sample = one color, two faucets.

Dual advice: don't use Glacier Brown where you wanted burnt sienna depth or raw umber pine. Kit logic: one mist-earth seat (Glacier tube or Hermit Mist pan or 2ml) — not all three wells. Keep the grind whose granulation makes you grin.`,
    ace_history: `PBr7 + PW6 is a modern atmosphere recipe: iron earth plus titanium white for lift and opacity. "Glacier" is Horadam mood-marketing for cold-mist neutrals, not a polar mineral. Think weather pan, not geology textbook.`,
  },
  "sch-tube-974-galaxy-brown": {
    temp_role:
      "Deep granulating brown · Cosmic sediment dark · earth + black whisper",
    ace_note: `Granulating brown — cosmic earth tones with sediment texture.

Black (PBk6) is invited: this is darker and more chroma-killing than plain burnt sienna, with granulation that reads as star-dust sediment on textured paper. Good for night soil, deep bark clusters, and moody underpainting; dangerous in a sky mix if it wanders. Cousin mood to Van Dyck Brown (earth + black) — different brand poetry, similar "respect the black" warning. Check any 2ml Starry Brown twin as the same seat.

Dual advice: if Van Dyck or a chromatic black (ultramarine + umber) already covers deep darks, Galaxy is optional texture character. Don't stack Galaxy + Van Dyck + Caput as three "mystery darks" in one tin — pick one deep habit and one warm mid-earth.`,
    ace_history: `PBr7 earth plus carbon black (PBk6) is a convenience deep brown with granulating theater. "Galaxy / brun galaxie" is Schmincke's night-sky marketing for sediment texture — contemporary special-effect earth, not a meteorite pigment. Lightfast dirt with a sparkle story.`,
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

p.updated = new Date().toISOString().slice(0, 10) + "-earth-tube-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Earth tube cards applied: ${nUp}`);
