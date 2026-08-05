/**
 * Apply handwritten earth · 2ml sample color cards
 * (Desktop earth-2ml-draft.md, approved).
 * Completes earth family handwritten pass (30/30).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-923-desert-brown": {
    temp_role: "Warm mid earth · Sand, path, dry hill · polite PBr7",
    ace_note: `Desert Brown brings warm earth energy to the tin — worth knowing by temperature, not just by pretty swatch.

Read it as sun-baked mid-brown: dunes, dry riverbed, adobe in afternoon — warmer and sandier than raw umber, less orange-roast than burnt sienna. Good for arid landscapes and soft neutrals with blue; less ideal as your only "mixing earth" if you already own sienna + umber. 2ml is a try-before-you-commit well.

Dual advice: if Raw Sienna + Burnt Sienna already cover warm land, Desert Brown is optional climate character. Keep it when the swatch is clearly sandier/dustier than your siennas; don't promote every pretty brown sample into the travel tin.`,
    ace_history: `PBr7 iron earth again — source and roast shift sand-gold to brick to espresso. "Desert" is Horadam climate poetry for a warm mid brown, not a single Sahara mine. Sample size is the honest format: learn the temperature, then decide on a pan.`,
  },
  "sch-964-glacier-brown": {
    temp_role:
      "Warm mist-earth · Soft granulating taupe · earth + white (sample)",
    ace_note: `Cool taupe brown — glacial moraine stone.

Same chemistry story as the 5ml Glacier Brown tube and cousin to Hermit Mist: PW6 is in the room. Fog over dirt, wet stone, distant path, granulating warm grey that can veil a layer. Masstone still brown; dilute washes go milky-mist. Chroma is half-retired on purpose.

Dual advice: tube + 2ml + Hermit Mist = one mist seat, not three wells. Swatch sample against tube if you own both; keep one faucet. Don't use where you wanted burnt sienna depth or raw umber pine.`,
    ace_history: `PBr7 + titanium white (PW6) = modern atmosphere recipe. "Glacier" sells cold-mist neutrals; the pigment job is lift and soft opacity, not polar romance. Sample is the low-risk way to see if you love the sediment.`,
  },
  "sch-974-starry-brown": {
    temp_role:
      "Deep granulating brown · Sediment night-earth · earth + black (sample)",
    ace_note: `Brown with cosmic depth — sediment stars in the wash.

Twin seat to Galaxy Brown tube: black (PBk6) invited, granulation that settles like grit constellations. Night soil, deep bark clusters, moody underpainting — and a talent for killing chroma if it wanders into a sky. Cousin warning to Van Dyck (earth + black).

Dual advice: Galaxy tube / Starry sample / Van Dyck half-pan — pick one black-kissed dark habit. Sample is perfect for "do I love the sediment?" before you commit kit space.`,
    ace_history: `Schmincke's sedimentary Galaxy/Starry line: earth plus carbon black with particles that settle for wet-on-wet night-sky demos. Marketing is cosmic; chemistry is PBr7/PBk6 convenience deep brown with theater.`,
  },
  "ds-117-herculaneum": {
    temp_role:
      "Warm archaeological earth · Buried-city brown · classical study tone",
    ace_note: `Volcanic earth — warm, archaeological, buried-city vibes.

This PBr7 wants storybook ruin, not pure field dirt: fresco reconstruction, warm stone, the brown you reach for when the subject is "time passed." Temperature sits in the warm mid-earth band near transparent sienna / desert — less cool than raw umber, less brick-orange than loud burnt sienna (varies by batch). Lovely for classical studies; easy to over-collect if you already have three warm browns.

Dual advice: treat as character PBr7, not a mandatory kit seat. If Transparent Sienna or Desert Brown already does warm mid, keep Herculaneum only when the name and swatch make you paint ruins on purpose.`,
    ace_history: `Named for the Roman city buried by Vesuvius — DS markets an archaeological warm earth for classical mood. Still iron-earth chemistry (PBr7), not ash from the Bay of Naples in your 2ml. The legend is the place-name; the job is warm study brown.`,
  },
  "ds-130-transparent-red-oxide": {
    temp_role:
      "Warm iron red · Glaze brick / autumn light · transparent PR101",
    ace_note: `Transparent warm oxide — glazes like autumn light.

This is the glass side of iron red: layered brick glow, autumn canopy, portrait warmth that still shows paper. Not Caput Mortuum's mortuary deep, not opaque Venetian cover. With blue it makes smoky violets and soft brick greys; alone it is sun through terracotta. Staining/body vary by grind — DS's TRO is famous for clean warm glazes in landscape kits.

Dual advice: same role as MG Transparent Red Iron Oxide — manners contest (DS vs honey), not two wells. Also distinct from burnt sienna (PBr7 roast) and Caput (deep maroon). One transparent iron-red glaze seat is enough for most tins.`,
    ace_history: `PR101 calcined iron oxide — industrial Mars/Venetian family that replaced many fugitive earth reds. "Transparent" red oxide is the glaze milling of that brick chemistry: modern landscape staple for warm light without cadmium.`,
  },
  "ds-143-minnesota-pipestone": {
    temp_role:
      "Warm stone pink-brown · PrimaTek pipestone · sacred-earth accent",
    ace_note: `PrimaTek pipestone — earthy pink-brown, sacred stone on paper.

Not a generic Venetian red: lighter, pinker, more stone skin than brick roast. Use for rock faces, prairie dust, soft earth blush, and mineral texture that synthetic PR101 convenience reds sometimes smooth away. It is accent and place, not your primary mixing red-brown.

Dual advice: don't buy PrimaTek thinking it replaces Transparent Red Oxide or burnt sienna. Keep Pipestone when the swatch is clearly pink-stone and you paint rocks/figures that want that story; skip if it's just "another warm brown" next to TRO.`,
    ace_history: `Pipestone (Catlinite) is the red stone of Minnesota quarries, culturally significant to many Indigenous nations of the region. Daniel Smith's PrimaTek line grinds natural mineral for watercolor — place-based pigment with a responsibility to treat the name as more than marketing. Chemistry still reads as iron-rich red earth (PR101 family).`,
  },
  "ds-162-tigers-eye": {
    temp_role:
      "Warm golden-dark earth · PrimaTek chatoyant brown · granulating treasure",
    ace_note: `PrimaTek tiger's eye — golden brown granulation, treasure in 2ml.

Golden-dark PBr7 with mineral grit theater: wet-in-wet bands and sediment that feel like polished stone more than dirt cake. Good for treasure-box still life, striped rock, rich bark — optional luxury, not a missing primary earth. Granulation is the reason to keep it.

Dual advice: if Burnt Sienna + a granulating dark already excite you, Tiger's Eye is dessert. Sample first (you did); promote only if you use the sparkle. Don't let it steal the burnt-sienna seat in a six-color kit.`,
    ace_history: `Tiger's eye is quartz with iron-oxide chatoyancy in the gem world; PrimaTek watercolor aims at that golden-brown mineral drama on paper. Label pigment PBr7 places it in the iron-earth family even when the romance is gemstone. DS sells the dazzle; you decide if the dazzle earns a well.`,
  },
  "mg-187-transparent-red": {
    temp_role:
      "Warm iron red · Honey glaze oxide · transparent PR101",
    ace_note: `Transparent red oxide — warm glazes with extended working time.

Same glaze iron-red seat as DS Transparent Red Oxide: autumn light, brick glow, portrait warmth. Honey binder adds slip, open time, and that MG rewet hunger — lovely for wet-in-wet blooms, slightly different edges than DS. Compare on one card under the same blue.

Dual advice: one transparent PR101. Swatch MG vs DS; keep the binder manners you love. Don't also need Caput unless you want a deep iron dark, or burnt sienna unless you want PBr7 roast instead of PR101 red.`,
    ace_history: `PR101 again — calcined iron oxide as modern brick/terracotta blood. M. Graham's honey base is the brand accent: same oxide job, longer open time and distinctive slip. Sample size is ideal before a 15ml commitment.`,
  },
  "mg-030-burnt-umber": {
    temp_role:
      "Warm dark earth · Honey burnt umber · chromatic-black partner (sample)",
    ace_note: `M. Graham Burnt Umber — honey base, 2ml sample. Blooms on wet paper if you lean in.

Same warm dark role as White Nights full-pan Burnt Umber: chocolate/bark dark, greys with ultramarine, the adult brown deeper than burnt sienna. Honey means soft bloom and rewet drama — lean in for wet edges, respect it when you need a hard dry shape. Sample is the try-on for whether honey umber becomes your dark habit.

Dual advice: one burnt umber seat (WN pan or MG or another brand). Don't stack umber + Van Dyck + Galaxy as three "just dark" wells. If burnt sienna already owns mid-warm, umber is the deeper adult — worth having; not worth triplicating.`,
    ace_history: `Burnt umber = roasted umber earth, warmer/darker than raw, classic half of the ultramarine chromatic black. Honey binder is MG's handshake, not a different mineral. Series sample boxes exist so you empty the 2ml before you marry the tube.`,
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

// Sanity: all earth should now have Dual advice
const earthMissing = p.colors
  .filter((c) => c.family === "earth" && !(c.ace_note || "").includes("Dual advice"))
  .map((c) => c.id);
if (earthMissing.length) {
  console.warn("Earth still without Dual advice:", earthMissing.join(", "));
}

p.updated = new Date().toISOString().slice(0, 10) + "-earth-2ml-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Earth 2ml cards applied: ${nUp}`);
console.log(
  `Earth with Dual advice: ${
    p.colors.filter((c) => c.family === "earth" && (c.ace_note || "").includes("Dual advice")).length
  } / ${p.colors.filter((c) => c.family === "earth").length}`
);
