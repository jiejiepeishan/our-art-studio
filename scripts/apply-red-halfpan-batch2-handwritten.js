/**
 * Apply red half-pan batch 2 (cool quin / magenta / perylene).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-hp-magenta": {
    temp_role:
      "Cool magenta primary · PR122 · clean violets with blue · staining floral shadow",
    ace_note: `Cool magenta primary. Your clean violet route starts here + any blue. Also makes shockingly good shadows in florals.

PR122 is the cool pink-violet primary of modern charts — not warm scarlet, not brick. Violets with ultramarine stay jewel; floral shadows stay cool. Same broad seat as purple Purple Magenta / Brilliant Purple and pink Opera energy — one PR122 story in a small tin. Half-pan + full pan in studio = one color, two faucets.

Dual advice: one PR122 across red/pink/purple marketing names. Keep Magenta when it's your labeled primary cool; demote brilliant twins.`,
    ace_history: `Quinacridone magenta (PR122) — cool primary for florals and clean purples with blue. Twentieth-century mixing chart staple; Horadam cream rewet.`,
  },
  "sch-hp-permanent-carmine": {
    temp_role:
      "Cool carmine · PV19 · staining floral travel red · small brushloads",
    ace_note: `Half-pan carmine for quick florals on the go. Same staining personality — small brushloads!

Cool transparent PV19 carmine energy — the plein-air florist's shortcut. Stains hard; a rice-grain is enough. Same molecule family as Quin Red Light and Ruby Red — different cuts of cool quin red, not three roles.

Dual advice: one PV19 cool red among Carmine / Quin Red Light / Ruby. Carmine when you want classic "permanent carmine" travel label; don't also fill two more PV19 reds.`,
    ace_history: `Permanent carmine is the lightfast answer to fugitive madder carmines — here catalog PV19 quinacridone (not old PR176 folklore). Plein-air florist shortcut; Horadam half-pan.`,
  },
  "sch-tube-343-quin-red-light": {
    temp_role:
      "Cool transparent red · PV19 light cut · floral primary · staining",
    ace_note: `Schmincke Quinacridone Red Light — cool transparent primary floral red. Check tube vs half-pan twin in your set.

Lighter/brighter PV19 cut than Ruby's deep jewel — the floral red that replaced alizarin on many European charts. Staining, transparent, clean with blues toward violet. Tube + half-pan = one faucet.

Dual advice: same PV19 seat as Carmine and Ruby. Light vs deep is costume; keep one.`,
    ace_history: `Quin red light (PV19) — cool transparent primary; late-20th-century replacement for fugitive alizarin on professional European palettes.`,
  },
  "sch-hp-351-ruby-red": {
    temp_role:
      "Cool bluish red · PV19 ruby cut · florals & wine shadows · ◈",
    ace_note: `Cool bluish red that deepens in mass tone — quin violet-red energy for florals and wine shadows.

Deeper/cooler PV19 jewel than Quin Red Light — mass tone goes wine; dilute stays floral. Distinct from Permanent Carmine 353 in the tin notes — still one role unless the swatch gap is huge.

Dual advice: third PV19 auditioner — pick the cut you empty first. Vs Magenta PR122: ruby is redder; magenta is pink-violet primary.`,
    ace_history: `Ruby red in Horadam is modern organic cool red — jewel-box cousin of fugitive madder lakes, PV19 permanence.`,
  },
  "sch-hp-374-perylene-dark-red": {
    temp_role:
      "Deep wine-red glaze · Perylene (PR179) · shadows richer than black",
    ace_note: `Deep perylene wine-red — glazing shadows richer than black.

PR179 transparent deep wine — botanical shadows and deep florals where black would deaden. Staining glaze; commit. Twin ambition with Perylene Maroon — one deep perylene seat.

Dual advice: one PR179 (Dark Red or Maroon). Vs Madder Red Dark PR209: perylene is often deeper/browner wine; madder more rose-glow. Vs Ivory Black: chromatic dark vs soot.`,
    ace_history: `Perylene maroon family (PR179) — modern glazing red-brown for botanicals where old madder would fade. Perylenrot tief; Horadam cream.`,
  },
  "sch-hp-perylene-maroon": {
    temp_role:
      "Deep transparent wine-red · Perylene maroon · intentional stain shadows",
    ace_note: `Deep, transparent wine-red. Glaze it for shadows that feel rich instead of dead. Stains — commit with intention.

Same PR179 soul as Perylene Dark Red — wine glaze for botanicals and dusk. Slightly different hex/cut; still one kit seat. Staining: intention, not accidents.

Dual advice: Dark Red vs Maroon = swatch twins. Keep one. Don't stack with three other "deep reds" (ruby, madder dark, perylene).`,
    ace_history: `Perylene maroon (PR179) — transparent wine-red for glazing shadows in botanical art after madder lakes proved fugitive.`,
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

p.updated =
  new Date().toISOString().slice(0, 10) + "-red-halfpan-batch2-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Red half-pan batch 2 applied: ${nUp}`);
