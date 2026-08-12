/**
 * Apply handwritten red · tube color cards
 * (Desktop red-tube-draft.md). Quin Red Light already Dual — skipped.
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "mg-176-scarlet-pyrrol": {
    temp_role:
      "Warm scarlet-orange · Pyrrole (PO73) · honey fire · staining · ◈",
    ace_note: `Fire-engine warmth — clean modern punch. Clean oranges with yellow, bold florals, and accents that refuse to go muddy.

PO73 sits on the scarlet–orange border: warmer/oranger than pure PR254 fire-engine, still high chroma and staining. Honey open time. Bold florals and late sun; tiny amounts with cool blue for near-neutrals (easy to dull — dose).

Dual advice: one warm pyrrole scarlet seat with Permanent Red (PR254) and half-pan PR255s — manners and temperature contest, not three wells. Honey if you love bloom.`,
    ace_history: `Pyrrole organics (PO73) — late-20th-century lightfast chroma that outlasted fugitive historical reds. Series 3 honey fire.`,
  },
  "sch-tube-361-permanent-red": {
    temp_role:
      "Warm fire-engine red · Pyrrole PR254 · tube twin of Scarlet Red pan",
    ace_note: `Schmincke Permanent Red — modern lightfast fire-engine red. Check 5ml tube vs any sample twin in your set.

Same PR254 soul as full-pan Scarlet Red and Rosa Bright Red — tube faucet for bigger washes. Cleaner mixes than earth reds; commit with intention if it stains on your paper.

Dual advice: one PR254 across pan/tube/Rosa. Not a second Scarlet Pyrrol unless PO73 vs PR254 swatches fight.`,
    ace_history: `Pyrrole red (PR254) — modern lightfast fire for florals and design. Horadam tube logistics.`,
  },
  "sen-619-bright-red": {
    temp_role:
      "Warm bright red · Toluidine (PR3) · honey punch · semi-opaque lean",
    ace_note: `Rouge Hélios — semi-opaque bright red with honey bloom, punchy florals and accents.

PR3 (toluidine) is a different scarlet lane than pyrrole — often punchy, less "modern lightfast chart hero," still useful for bold florals and accents. Honey bloom. Check lightfastness for heirlooms; joy for weekly work.

Dual advice: accent scarlet seat — don't stack with PR254 + PO73 + PR188 as four fires. One loud warm red + one earth is enough for most tins.`,
    ace_history: `Rouge Hélios (PR3) — Sennelier serie 2 bright red with honey; lively on cold press, French decorative energy.`,
  },
  "sen-612-scarlet-lacquer": {
    temp_role:
      "Warm lacquer scarlet · PR188 · bold decorative red · staining",
    ace_note: `猩红漆 — lacquer-bright scarlet, bold and glossy-minded.

PR188 chases lacquerware heat — decorative scarlet, East-meets-West floral and design energy. Staining; bold. Different code from Hélios and pyrroles.

Dual advice: one decorative scarlet max (Lacquer or Hélios or Permanent Red). Travel tin: pick the swatch that screams least muddy with your yellow.`,
    ace_history: `Scarlet lacquer (PR188) — Chinese lacquerware romance in a honey tube; Laque Écarlate for decorative and floral punch.`,
  },
  "ds-15ml-candy-cane-red": {
    temp_role:
      "Cool-warm holiday red · PV19 festive · subject color · not a serious primary",
    ace_note: `DS holiday Candy Cane Red — festive 15ml, paint something ridiculous and beautiful.

PV19 under candy marketing — cool-leaning quin red for holidays and fun. Same broad cool-red family as Carmine / Quin Red Light / Ruby, but subject/seasonal seat — not a reason to own four PV19 reds.

Dual advice: dessert. Keep for festive work; don't fire Permanent Carmine for this. One holiday red.`,
    ace_history: `Quinacridone PV19 wearing candy-cane clothes — modern lightfast cool red, seasonal DS packaging.`,
  },
  "wn-tube-quin-red": {
    temp_role:
      "Warm-cool transparent red · Quin PR209 · British floral glaze · ◈",
    ace_note: `W&N Professional Quinacridone Red — classic British workhorse in 5ml.

PR209 transparent glow — florals, coral-leaning clean red, lightfast glazing. Same molecule family as half-pan Madder Red Dark — tube vs pan manners. Clean with blue toward violet; softens toward portrait rose without losing lightfastness.

Dual advice: one PR209 seat (W&N tube or Madder Red Dark half-pan). Vs PV19 cool reds: PR209 often warmer/coral; PV19 cooler carmine.`,
    ace_history: `Quinacridone reds (PR209) — transparent organics for luminous florals after fugitive madder. W&N Professional series 3 workhorse.`,
  },
  "sch-tube-366-perylene-maroon": {
    temp_role:
      "Deep wine glaze · PR179 tube twin · botanical shadows",
    ace_note: `Dunkelrot in the tube — deep transparent wine-red for glazing shadows.

Tube twin of half-pan Perylene Maroon / Dark Red — one PR179 seat, bigger faucet. Botanical shadows richer than black; staining commit.

Dual advice: one perylene maroon across half-pans + Sch tube + W&N tube. Swatch brand manners; keep one well.`,
    ace_history: `Perylene maroon (PR179) — modern glazing wine for botanicals. Horadam Dunkelrot tube.`,
  },
  "wn-tube-perylene-maroon": {
    temp_role:
      "Deep cool maroon · PR179 British · wine shadows · ◈ · staining",
    ace_note: `Deep cool maroon for wine shadows and dark florals.

Same PR179 job as Schmincke perylenes — British Professional manners, cool wine depth. Staining glaze; rich not dead.

Dual advice: Sch vs W&N perylene = manners contest. One PR179. Vs Claret blend: pure perylene is cleaner modern glaze; Claret is romantic mix.`,
    ace_history: `W&N Professional Perylene Maroon — studio staple refined across British watercolour generations.`,
  },
  "qor-venetian-red": {
    temp_role:
      "Warm iron brick · PR101 Aquazol · roofs, clay, warm accents",
    ace_note: `Opaque iron-red earth for roofs, clay, and warm accents.

PR101 Venetian/Mars brick — Earth set workhorse, Aquazol snap. Same seat as half-pan/full-pan English Venetian and other brand Venetians.

Dual advice: one Venetian/PR101 brick across QoR / Sennelier / W&N / Schmincke pans. Aquazol if you live in QoR Earth set.`,
    ace_history: `QoR (Golden) Aquazol Venetian red — modern handling, ancient brick job.`,
  },
  "sen-623-venetian-red": {
    temp_role:
      "Warm terracotta · PR101 honey · brick & stucco · not vermilion",
    ace_note: `Rouge Venise — earthy Venetian red, terracotta roofs and warm brick, not vermilion heat.

Classic PR101 brick with honey slip — façades, not scarlet florals. Serie 1 workhorse.

Dual advice: third Venetian auditioner — one well. Heat vs scarlet is the whole dual (original note).`,
    ace_history: `Venetian red = calcined iron oxide named for brick façades — different job from scarlet lacquer or Hélios.`,
  },
  "wn-tube-venetian-red": {
    temp_role:
      "Warm iron red · PR101 British · roofs, clay, permanence workhorse · ◈",
    ace_note: `Classic iron red — roofs, clay, permanence AA energy.

Same PR101 brick seat — British Professional permanence culture. Roofs and clay, not poppy scarlet.

Dual advice: one Venetian. W&N if you already live in Professional earths.`,
    ace_history: `W&N Professional Venetian Red — iron oxide staple across generations of British watercolour.`,
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
  console.error("Missing:", missing.join(", "));
  process.exit(1);
}
if (nUp !== Object.keys(updates).length) {
  console.error("count", nUp);
  process.exit(1);
}

p.updated = new Date().toISOString().slice(0, 10) + "-red-tube-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("Red tube cards applied:", nUp);
