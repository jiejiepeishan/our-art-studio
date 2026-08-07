/**
 * Apply handwritten blue · half-pan color cards
 * (Desktop blue-halfpan-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "pinax-pb29-ultramarine-blue": {
    temp_role:
      "Warm blue · Granulating sky / mixing primary · ◈ workhorse · transparent",
    ace_note: `The classic mineral blue — granulates, lifts, and makes every violet honest.

This is the warm blue seat of classical watercolor: skies that separate on cold-press, violets that stay violet with rose/quin, and the textbook greys with burnt sienna (you already live in that mix language from earth cards). Transparent enough to glaze; granulating enough to feel mineral. Pinax Extra is a budget-friendly PB29 with series-A manners — same job as Horadam French/Finest, different handshake.

Dual advice: one ultramarine well per travel tin. Swatch Pinax vs Schmincke French vs Finest under the same rose and the same burnt sienna; keep the granulation and violet you love. Don't fill three PB29 wells for ego — spend the second blue slot on cerulean or a cool deep (indigo/Prussian), not a twin ultramarine.`,
    ace_history: `Ultramarine (PB29) was lapis lazuli blue for sacred art until French synthetic ultramarine (1820s) made the sky affordable. Still the warm-leaning, granulating blue of classical mixes — churches first, sketchbooks forever. Pinax carries that mineral plot in a half-pan price.`,
  },
  "sch-hp-336-french-ultramarine": {
    temp_role:
      "Warm blue · French-style granulating ultramarine · sky bloom on cold-press",
    ace_note: `Classic granulating ultramarine — skies that bloom on cold press.

"French" in the name is colourman poetry for a warmer, often redder-leaning ultramarine grind — the one landscape demos mean when they say "let it granulate into the cloud." Same PB29 family as Pinax and Finest: violets with magenta, storm greys with sienna, soft lifts if you don't stain the paper first. Horadam rewet is the cream you already trust in the earth half-pans.

Dual advice: if Pinax already owns ultramarine in the kit, this is a manners upgrade, not a new role. Keep French when the bloom and warmth beat your other PB29; demote duplicates to studio drawer. Pair with one cool blue (cerulean for milk sky, or indigo for night) — not three warm blues.`,
    ace_history: `Synthetic ultramarine (PB29) replaced powdered lapis after 1828; "French ultramarine" became the trade nickname for the warmer studio grade painters preferred for skies. Horadam mills it for pocket tins and polite rewet — mineral romance, modern chemistry.`,
  },
  "sch-hp-494-ultramarine-finest": {
    temp_role:
      "Warm blue · Finer-ground ultramarine · smoother sky, still mineral",
    ace_note: `Schmincke's finest-ground ultramarine in half-pan — granulating sky blue with dignity.

"Finest" promises a finer particle story: often slightly smoother washes and a deeper masstone (#1E3A8A reads more night-navy in the well) while still belonging to the granulating PB29 club. Use it when you want ultramarine dignity without as much gritty drama as a coarse French; still not a staining phthalo.

Dual advice: Finest vs French is texture preference inside one seat. Swatch side by side wet-in-wet; keep one. If you paint tiny botanical washes and hate heavy sediment, Finest may win; if you paint rocky skies, French or Pinax grit may win.`,
    ace_history: `Still PB29 ultramarine — the lapis-to-synthetic arc doesn't change with grind marketing. "Ultramarin feinst" is Horadam's fine-milled grade for controlled skies and mixing, not a different pigment fairy tale.`,
  },
  "sch-hp-cerulean-blue": {
    temp_role:
      "Cool sky blue · Milky semi-opaque cerulean · horizon / rescue cover",
    ace_note: `Milky, soft, a little stubborn — won't mix into screaming brights, but skies love it. Semi-opaque means it can rescue washed-out washes.

Cerulean is the opposite job from ultramarine: cool, chalky-sky, good for distant air and that soft horizontal band under a warm cloud. It will not give you clean electric violets (opacity + temperature kill the jewel). It will sit on top of a failed cool wash and whisper "horizon." Mixes go muted — that's the feature.

Dual advice: if ultramarine already does your sky and your violets, cerulean is the second sky seat for milk and distance — worth it for landscape, optional for pure floral kits. Don't expect it to replace PB29 in chromatic greys with sienna.`,
    ace_history: `Cerulean (PB35, cobalt tin oxide type) arrived mid-19th century as a stable milky sky blue — the horizon colour Impressionists and sky specialists chased when pure cobalt felt too raw. Non-staining, a little lazy in mixes: built for air, not neon.`,
  },
  "sch-482-delft": {
    temp_role: "Cool cobalt blue · Canal / ceramic calm · muted sky mixer",
    ace_note: `Dutch canal blue — calm, slightly muted, built for ceramic skies.

Delft sits in cobalt country (PB30): cooler and more "tile glaze" than warm ultramarine bloom, less milky-cover than cerulean. Think canal reflection, porcelain shadow, polite architectural blue. Mixes stay civilized; granulation is not the headline (unlike PB29). If a wash needs drama sediment, you grabbed the wrong pan.

Dual advice: Delft vs cerulean vs ultramarine = three different seats. In a small tin, ultramarine + one cool is enough; pick Delft when you want cobalt calm, cerulean when you want milk cover. Don't keep Delft and a strong cobalt tube unless the swatches clearly disagree.`,
    ace_history: `"Delft blue" borrows the fame of Dutch tin-glazed pottery — cultural colour as much as chemistry. PB30 is a cobalt blue family pigment; Horadam's name sells canal-and-ceramic mood while you paint modern lightfast cobalt manners.`,
  },
  "sch-hp-indigo": {
    temp_role:
      "Cool deep blue · Indanthrene night / denim · ◈ dark mixer · granulating",
    ace_note: `Moody, granulating, nocturnal. Night skies, denim, deep water — lets the paper texture sing.

Ignore the plant-dye daydream for a second: the label chemistry is PB60 indanthrene — a modern deep blue that reads indigo in the well. It's your nocturnal cool dark: denim, deep water, storm bases. Verified with burnt sienna → moody blue-greys; also leans olive with urban yellow, soft mauve with pinks. Granulation gives the paper a voice; it's not Prussian's staining teal-push.

Dual advice: indigo/PB60 is not a second ultramarine and not Prussian. Keep it as the deep cool when night and denim matter; if Prussian already stains your kit green-teal, you may only need one deep cool. Don't mix recipes swapping indigo↔ultramarine and expect the same violet.`,
    ace_history: `Historical indigo was fermented plant dye — fugitive, legendary, textile-first. Many "Indigo" watercolours today use PB60 (indanthrene blue) or blends to chase that stormy denim without the fade. Schmincke's granulating indigo is modern deep-blue romance wearing an old trade name — trust the pigment code more than the farm story.`,
  },
  "sch-hp-prussian-blue": {
    temp_role:
      "Cool staining blue · Historic teal-pusher · strong mixer · more body",
    ace_note: `Intense, staining, slightly historic drama. Strong in mixes — a little pushes the whole wash toward teal or deep green.

Prussian is the aggressive cool: high tinting, stains the paper, and yanks yellows into deep greens/teals before you notice. Great for Hokusai-wave energy, iron-ish night, and decisive darks; terrible when you wanted a polite violet or a liftable sky. Semi-opaque body means it can also sit heavier than a pure stain ultramarine.

Dual advice: dose like salt. If you already own phthalo blue/green in other formats, Prussian may duplicate the "strong cool stain" job — keep one tyrant. Never "just swap" for ultramarine in a skin or floral mix. Lift tests before commissions.`,
    ace_history: `Prussian blue (PB27) was born in Berlin around 1704 — often called the first modern synthetic pigment. Hokusai's waves and Romantic storms made it famous; watercolorists still respect its stain and its talent for turning a mix teal. Historic drama, industrial iron-cyanide family chemistry (modern paints are the art-safe lineage of that discovery story).`,
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

p.updated = new Date().toISOString().slice(0, 10) + "-blue-halfpan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Blue half-pan cards applied: ${nUp}`);
