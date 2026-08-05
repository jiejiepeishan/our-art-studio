/**
 * Apply handwritten earth · pan color cards (Desktop earth-pan-draft.md, approved).
 * Scope: full pan / single pan only — not half-pans.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-fp-657-transparent-ochre": {
    temp_role:
      "Warm earth-yellow · Glaze sunlight · transparent ochre (not chalk field)",
    ace_note: `Glazing gold. Transparent ochre that builds sun-glow in layers without going chalky.

This is the ochre that wants light through the wash, not dirt sitting on the paper. PY42 here is milled for Lasur / glaze manners: late façade glow, honey under a blue sky, the warm pass you lay after the cool shadow already exists. Beside ultramarine it can still edge toward soft olive-grey (iron yellow is iron yellow), but it does that with less body than a semi-opaque field ochre — so the paper keeps breathing.

Dual advice: don't treat this as a second Yellow Raw Ochre. If you already keep half-pan Yellow Ochre / full-pan Yellow Raw Ochre for paths and fields, this pan is the glass version — glazes, skin warmth, sun on plaster. Skip it only if you never glaze earths and already own a transparent gold (quin gold, etc.) that does the same job.`,
    ace_history: `Ochre is iron-stained earth — cave-wall old. Modern PY42 is the synthetic iron-yellow echo of that muted sunlight. "Transparent ochre" is a milling promise: same family job as field ochre, aimed at layered glow rather than covering underpaint. Horadam full pan = rewet stockpile for studio sessions that outlast a half-pan dip.`,
  },
  "sch-fp-656-yellow-raw-ochre": {
    temp_role:
      "Warm earth-yellow · Field & underpainting · the big-well twin of half-pan ochre",
    ace_note: `Box twin of your ochre half-pan. Stockpile energy — you will use this forever.

Same sensible sunlight as the half-pan Yellow Ochre: not lemon, not cadmium — "the day is warm." Full pan just means you stop rationing it. With blue it still pushes those soft land greens and distant hills; with phthalo it steadies neon into olive; with rose it makes dusty skin and old plaster. It is the pan you empty first if you paint outdoors often.

Dual advice: kit logic = one ochre seat. Half-pan for travel tin, full pan for desk — not two wells in the same box. If Transparent Ochre is also in the studio, swatch them once: keep Transparent for glaze stories, keep Yellow Raw for body and paths. Most limited kits only need one of the two.`,
    ace_history: `Still iron ochre — PY42/PY43 as the industrial memory of clay gold. Raw ochre names signal "not roasted red," not a different fairy tale from half-pan ochre. Full pan is logistics: the color that earns bulk because landscape and underpainting never retire.`,
  },
  "wn-408": {
    temp_role: "Warm dark earth · Chromatic-black partner · sensible deep brown",
    ace_note: `Reliable burnt umber — every palette needs this sensible adult.

This is the warm dark seat: roasted umber earth that goes toward chocolate and bark, not raw umber's cool espresso-green. With ultramarine it builds the classic quick greys and soft chromatic blacks; with yellows it makes olive dirt and tree cores; alone it is furniture, winter soil, the shadow under a warm roof. It is not burnt sienna's orange-roast brick — umber sits deeper and quieter.

Dual advice: if Schmincke burnt sienna already owns warm mid-earth in the kit, burnt umber is the darker adult, not a duplicate. Don't also stock three umbers (raw + burnt + Van Dyck) in one travel tin unless you paint portraits and forests every week. White Nights full pan = cheap reliable volume; manners may differ from Horadam honey — swatch rewet before you trust it on a commission day.`,
    ace_history: `Burnt umber is umber earth after the kiln — iron (and often manganese memory) swung warmer and darker than raw. Painters have used it for centuries as the brown that can stand in for soft black when mixed with blue. Student-to-pro lines all carry it because the role is non-negotiable, even when brands disagree on grit.`,
  },
  "wn-632": {
    temp_role:
      "Warm mist-earth · Soft granulating brown-grey · earth + white whisper",
    ace_note: `Hermit Mist brings warm earth energy to the tin — worth knowing by temperature, not just by pretty swatch.

Here's the plot twist in the pigment line: PW6 is in the room. This is not pure burnt/raw brown — it's earth cut with white, so it behaves like fog over dirt: stone walls in drizzle, distant path, warm grey that granulates instead of staining pure. Masstone still reads brown; dilute washes go milky-mist and can veil a layer underneath. It refuses to be your only mixing brown — chroma is already half-retired.

Dual advice: don't use Hermit Mist where you wanted burnt umber depth or raw umber cool pine. Keep it for atmosphere, masonry, and soft mid-tones. If you already mix earth + a touch of white/opaque yourself, this pan is convenience character — lovely when the granulation makes you grin, optional if kit space is cruel.`,
    ace_history: `PBr7 is the iron-earth umbrella; PW6 (titanium white) is the modern "mist" lever — opacity and pale lift in one convenience recipe. "Hermit Mist" is White Nights mood-marketing for a granulating warm neutral, not a single cave clay. Think atmosphere pan, not geology textbook.`,
  },
  "rosa-761": {
    temp_role: "Warm golden earth · Honey-bark mid-brown · cheerful PBr7",
    ace_note: `Golden Brown brings warm earth energy to the tin — worth knowing by temperature, not just by pretty swatch.

Read the name literally: this PBr7 leans gold, not espresso. Tree trunks in late light, honeyed soil, the brown that still feels sunny next to ultramarine (friendlier than a cool raw umber). It sits between raw sienna's transparent path-gold and burnt sienna's brick roast — a mid warm brown that can stand in for "general earth" when the kit is tiny. Brand manners (Rosa single pan) may rewet differently from Schmincke half-pans — same family, different handshake.

Dual advice: if you already own raw sienna + burnt sienna, Golden Brown is often a mood twin, not a missing role. Keep it when the swatch is clearly gold-er than your siennas; leave it in the drawer if it only duplicates burnt sienna at lower chroma. One warm mid-earth seat per travel tin is enough.`,
    ace_history: `PBr7 again — iron-rich earth that can read raw gold, burnt red-brown, or umber depending on source and roast. "Golden Brown" is the commercial promise of the warm-honey side of that family. Rosa Gallery's single-pan format is pocket-friendly stock; the chemistry's job is still dirt with a sun bias.`,
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

p.updated = new Date().toISOString().slice(0, 10) + "-earth-pan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Earth pan cards applied: ${nUp}`);
