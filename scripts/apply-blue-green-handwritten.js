/**
 * Apply handwritten blue-green family color cards
 * (Desktop blue-green-draft.md, approved — full family, 5 colors).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-hp-helio-turquoise": {
    temp_role:
      "Cool turquoise · Clean phthalo turquoise (PB16) · tropical without full phthalo rage",
    ace_note: `Clean tropical water without the phthalo aggression. Bright but behaves — tropical seas, ceramic glazes, fresh spring foliage highlights.

PB16 is the dedicated turquoise molecule — not "mix blue + green on the fly," not milky cobalt. Clean lagoon, tile glaze, jewelry shadow, that one stroke of Caribbean in an otherwise serious landscape. "Without phthalo aggression" is relative: still modern chroma, still dose with manners, but it often feels more finished turquoise than screaming pure PB15. Pairs with warm sand/earth at the shoreline; with rose it can go strange (test — turquoise + pink is fashion or bruise).

Dual advice: same pure-PB16 seat as MG Turquoise sample and cousin to W&N Phthalo Turquoise in blue family. One well. Vs Cobalt Turquoise: Helio is cleaner/poster-modern; cobalt is milkier gem. Vs Turquoise Blue / Azure Green blends: those have PG7 gossip and may lean greener/stainier.`,
    ace_history: `Helio / Heliotürkis is Schmincke's phthalocyanine turquoise (PB16) — twentieth-century tropical clarity for posters and watercolour without grinding turquoise gemstone. Verified PB16 on the sleeve; the "helio" name is sunshine marketing for a modern dye-ish pigment family.`,
  },
  "wn-531": {
    temp_role:
      "Cool milky turquoise · Genuine cobalt turquoise (PB36) · gem-tone sky accent",
    ace_note: `Cobalt turquoise — milky gem-tone sky accents.

This is the other religion: true cobalt turquoise (PB36), not phthalo. Softer, milkier, more "enamel / botanical miniature sky" than plastic lagoon. Less likely to stain your soul; more likely to sit as a polite gem accent. Won't mix like PB16 — expect gentler chroma and that cobalt opacity whisper.

Dual advice: if you love mineral skies and hate phthalo's grip, this is your blue-green seat — demote Helio/MG. If you paint bold tropical water weekly, cobalt may feel shy; keep phthalo turquoise instead. Don't need both unless swatches break your heart differently.`,
    ace_history: `PB36 is a genuine cobalt chromite / cobalt turquoise compound — softer mineral family than phthalos, long used for gem-like teal in fine art and ceramics culture. St. Petersburg full pan = generous milky accent, not a Series-5 rare earth flex.`,
  },
  "wn-507": {
    temp_role:
      "Cool tropical blend · Phthalo blue GS + phthalo green · bright convenience water",
    ace_note: `Turquoise blue — bright clean tropical water.

Two phthalos in a trench coat: PB15:3 + PG7. Instant tropical without squeezing two tubes — and instant stain + green pull if you treat it like innocent sky blue. Bright, clean, commercial "pool water." Violets will suffer; greens with yellow will go loud. Great for holidays and designy flats; less great as your only "learning blue."

Dual advice: same convenience teal seat as Rosa Azure Green (PG7/PB15, order flipped). One blend well. Vs pure PB16 Helio: blend may lean greener/more aggressive; swatch. Vs Cobalt Turquoise: totally different manners (stain vs milk).`,
    ace_history: `Mid-century commercial art replaced ground turquoise with phthalo recipes. "Turquoise Blue" is honest convenience naming: blue + green phthalos married for tropical posters and student full pans.`,
  },
  "rosa-767": {
    temp_role:
      "Cool teal-green · Phthalo green + blue · sky-meets-sea gem",
    ace_note: `Azure green — teal-green gem, sky meets sea. You corrected me right!

That last sentence stays — studio history, not marketing. Chemically a PG7-forward phthalo teal with PB15: more "green meeting sky" than pure Caribbean PB16. Saturated Ukrainian single-pan confidence for design, illustration, bold water. Respect PG7 ratios or it eats yellows alive (same lesson as any phthalo green).

Dual advice: Azure Green vs WN Turquoise Blue = one convenience teal seat (Rosa pocket vs WN full pan). Vs Helio PB16: keep Helio for cleaner turquoise primary; keep Azure when you want greener teal punch. Your correction is canon — temperature is cool blue-green, not "just green."`,
    ace_history: `Phthalo green (PG7) + phthalo blue is the twentieth-century teal engine. Rosa's single-pan Azure Green packages that sky-and-sea meeting for travel tins; the chemistry is global even when the pan is local.`,
  },
  "mg-189-turquoise": {
    temp_role:
      "Cool turquoise · Honey PB16 sample · tropical try-on",
    ace_note: `Turquoise brings cool turquoise energy to the tin — worth knowing by temperature, not just by pretty swatch.

Same pure PB16 seat as Helio — honey binder for slip, bloom, and that MG rewet hunger. 2ml is the honest format: compare to Helio half-pan and W&N Phthalo Turquoise (blue family) before promoting a second lagoon. Soft edges if you feed water; still modern chroma underneath the honey.

Dual advice: Helio vs MG = manners contest (Horadam cream vs honey), one role. Sample first; don't also buy a 15ml until the 2ml has taught you something.`,
    ace_history: `PB16 again — phthalo turquoise as tropical primary. M. Graham's chapter is binder culture: same molecule, longer open time, sample-box courtship before marriage.`,
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

const bg = p.colors.filter((c) => c.family === "blue-green");
const bgDual = bg.filter((c) => (c.ace_note || "").includes("Dual advice"));
console.log(`Blue-green Dual advice: ${bgDual.length} / ${bg.length}`);

p.updated = new Date().toISOString().slice(0, 10) + "-blue-green-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Blue-green cards applied: ${nUp}`);
