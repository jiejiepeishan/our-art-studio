/**
 * Apply handwritten purple · pan color cards
 * (Desktop purple-pan-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "wn-609": {
    temp_role:
      "Cool quin lilac · PV19 full-pan primary · floral / clean purple",
    ace_note: `Quinacridone Lilac brings cool rose energy to the tin — worth knowing by temperature, not just by pretty swatch.

Read past the generic line: PV19 lilac-violet full pan — cool floral primary, clean purples with blue, less "scream" than PR122 brilliants. Same broad seat as half-pan Quin Violet and pink PV19 roses: one molecule, different costume (lilac vs rose vs Italian violet). Full pan = stop rationing dusk washes.

Dual advice: one PV19 well across pink + purple formats if the tin is tiny. Keep Lilac when the swatch is clearly more purple-lilac than Rose Lake; demote twins to drawer.`,
    ace_history: `Quinacridone rose/violet (PV19) — twentieth-century transparent star for florals and clean purples. St. Petersburg full pan is volume logistics on a modern classic.`,
  },
  "sch-fp-371-perylene-violet": {
    temp_role:
      "Cool deep violet · Perylene (PV29) · transparent shadow glaze",
    ace_note: `Deep transparent violet — glaze shadows and moody florals without going muddy.

PV29 is the quiet power purple: deep, transparent, staining glaze for botanical shadows and dusk underpainting — less electric than dioxazine legends, less magenta than PR122. Layers stay clear if you respect water. Not a high-key floral solo; it's the shadow that makes florals serious.

Dual advice: specialist glaze seat — not a second PV19. Keep when you paint moody botanicals; skip if ultramarine + rose already make your shadows. One deep transparent violet.`,
    ace_history: `Perylene violet (PV29) is modern transparent purple for glazing — botanicals reach for it when dioxazine feels too electric. Perylenviolett; Horadam cream rewet.`,
  },
  "sch-fp-495-ultramarine-violet": {
    temp_role:
      "Cool mineral violet · Ultramarine violet grit · florals, dusk, soft cool shadows · ◈",
    ace_note: `Mineral violet with ultramarine grit — florals, dusk, and soft cool shadows.

Play lab (granulation): PV15 + PB29 — purple sibling of ultramarine blue with flock and soft lift. Wet cold-press for mineral dusk; with burnt sienna → soft cool greys; florals that want texture not stain-tyranny. Less staining drama than quin violets.

Dual advice: mineral violet seat with RS Mineral Purple and Tundra (PV16). One granulating mineral purple in a small tin. Vs quin PV19: mineral grit vs organic stain.`,
    ace_history: `Ultramarine violet = synthetic ultramarine chemistry tuned redward — purple brother of church blue. Horadam full pan for dusk and cool shadows.`,
  },
  "rs-334": {
    temp_role:
      "Cool mineral purple · Manganese violet + black whisper · granulating Polish soul",
    ace_note: `Polish mineral purple — granulating violet with different soul from Maimeri 479.

Play lab (granulation): PV16 manganese violet with PBk6 hush — darker, more "mineral dusk" than pure bright violet. Flocks on rough paper; different soul from Italian quin manners (the original note is right). Landscape heather, cool stone shadows.

Dual advice: mineral seat with Ultramarine Violet and Tundra — swatch grit and value; one manganese/mineral purple. Black whisper means respect chroma-kill in clean florals.`,
    ace_history: `Roman Szmal Central European mineral traditions — regional lines for painters who want rock manners, not only organic punch. PV16 + carbon for granulating depth.`,
  },
  "sch-983-tundra-violet": {
    temp_role:
      "Cool muted mineral violet · PV16 heather / Arctic botanical · low scream",
    ace_note: `Arctic violet — muted, botanical, like heather on cold ground.

Straight PV16 landscape fantasy cut — muted cool purple for heather moors and cold-ground botanicals. Not Brilliant Purple's designer scream; not Perylene's deep glaze hole. Quiet mineral.

Dual advice: same manganese family as Mineral Purple — Tundra is often cleaner/muted without black. One PV16 seat. Specialty landscape, not a primary.`,
    ace_history: `Tundra violet in Schmincke's landscape fantasy range — muted cool purple for near-Arctic botanicals. PV16 chemistry; marketing does the frost.`,
  },
  "wn-398-purple-mist": {
    temp_role:
      "Cool burgundy-grey mist · Cobalt green + quin · granulating floral weather · ◈",
    ace_note: `Burgundy-grey with a wandering quin pink — cobalt green granules settle like grey-green trails in wet florals.

Play lab (granulation): Two bosses — PG50 granulates grey-green trails while PV19 rides the water pink-violet. Wet florals, layered with Rose Mist (verified-adjacent mood), storm greys with ultramarine (verified on card). Not a clean primary purple — an atmosphere pan. Don't over-stir or you lose the split personality.

Dual advice: effect seat only. If you already own Rose Mist + a green, optional. One multi-pigment purple weather pan max with Sunset Mist.`,
    ace_history: `White Nights specialty: cobalt titanate green + quin violet so green granulates out while pink quin travels — very Russian sedimentary theater.`,
  },
  "wn-635": {
    temp_role:
      "Warm-cool sunset purple · Ultramarine + orange · granulating purple hour · ◈",
    ace_note: `Muted purple with an orange-pink halo — wet washes look like purple hour skies splitting into blue and warm glow.

Play lab (granulation): PB29 flocks cool while PO73 (pyrrole orange family) throws warm halo — purple-hour skies that literally split. Pair with Rose Mist for full sunset bouquet mood; with Urban Yellow for city golden hour; push blue side with WN Ultramarine (verified tips). Effect pan, not violet primary.

Dual advice: weather / sunset seat with Purple Mist — different split (blue+orange vs green+quin). One or two mists if you paint skies; zero if you only need primaries.`,
    ace_history: `Ultramarine + modern warm orange for sedimentary sunset romance — St. Petersburg "mist" culture. Lapis-blue history meets contemporary orange in one well.`,
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

p.updated = new Date().toISOString().slice(0, 10) + "-purple-pan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Purple pan cards applied: ${nUp}`);
