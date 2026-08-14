/**
 * Apply handwritten green · mixing tubes (6)
 * Desktop green-tube-mix-draft.md
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-tube-519-phthalo-green": {
    temp_role:
      "Cool staining mixing green · Chlorinated copper phthalocyanine · engine · ◈",
    ace_note: `Schmincke Phthalo Green — Jul 7 batch. Check 5ml tube vs any 2ml sample twin in your set.

This is not foliage. It is a ratio problem in a tube. PG7 is so strong that "a green" is the wrong mental model — think stain. A grain of it in Hansa or Azo is spring. A blob of it in the same puddle is aquarium slime that will not lift. The half-pan already taught the stain-walk; the 5ml is the same soul when you need a squeeze. 518 pan / 519 tube. Not a second personality.

Pyrrol / Scarlet + this = chromatic black. That only works because both are high-chroma opposites. Quin Rose will not do the same trick — you'll get strange olives and mauves. That's why the fire red and this engine belong on the same tin.

It will not replace viridian (Emerald 513): viridian granulates, lifts, and whispers. Phthalo dyes. Painters who say "I hate phthalo" usually mean they treated it like sap.

M. Graham 150, W&N Winsor Green BS, and Sennelier 707 are this molecule in honey / British gum / French "emerald" clothing. Sennelier Deep 807 is this molecule plus phthalo blue — a teal cousin, not a second engine.

Play lab (the complementary): One rice-grain of this into a puddle of any pyrrol you already trust. If it goes velvety near-black, you felt the pair. If it goes brown mud, one of them won — stir less, dose less.

Dual advice: one PG7 well. Half-pan or this tube in the daily tin. MG 15ml is the studio barrel if you paint large and like honey; it is not a different green. Sen 707's name is a lie (not PG18). Helio (PG36) is the yellow-shade twin — keep as a pair if you want two engines, not as a third "I need green."`,
    ace_history: `1935, Monastral: chemists chlorinated copper phthalocyanine blue and got a staining green the dye industry wanted for inks and cars. Artists inherited a mixing monster. "Viridian hue" on student tubes is often this. Horadam 519 is the German gum-arabic cut of that industrial fact.`,
  },
  "qor-sap-green": {
    toxicity_habit:
      "Nickel azo (PY150) — wash hands after painting; keep food and drink off the palette.",
    temp_role:
      "Warm gold-leaf sap · Nickel azo + phthalo · the Q1 convenience · not May lemon",
    ace_note: `Foliage convenience green — lively mid leaves.

Your Q1 was: Phthalo + turquoise = icy trap; sap is the ready warm leaf so you don't remix every time. This tube is that answer. May Green is not that answer — May is first-leaf, lemon, April. Sap is tree-juice: warmer, a little dirtier, mid-summer hedge.

The yellow inside is the whole lesson. May uses PY3 (cool arylide lemon) → lime/spring. This sap uses PY150 (nickel azo) → quin-gold glow, olive, moss. Same "phthalo + yellow" shape, opposite seasons. That is the Hansa/Azo lesson applied to greens: same role family, not substitutes.

Read the tube. Catalog says PG7/PY150. Golden's QoR page now lists PY150 + PG36 (yellow-shade phthalo — Helio's family). If you see PG36, this sap already leans sun-leaf; if PG7, it leans the engine. Either way the gold is nickel. Wash hands. Same metal family as Undersea's yellow half.

Aquazol (QoR) is not gum: high chroma, can dry a bit hard-edged. Brand mouthfeel, not a new pigment.

Play lab (May vs Sap): Same water, this beside any May pan. Sap should go gold-moss; May should go lime. If they match, you don't need both convenience greens — and your Q1 is already solved by the one that looks like your trees.

Dual advice: one gold-sap seat. Not a fourth May (Sch / WN / Rosa / Sen 817). vs 534 olive: factory hedge is orange + phthalo; sap is gold + phthalo. vs Undersea: Sap should stay married; Undersea is supposed to divorce.`,
    ace_history: `Medieval sap green was buckthorn-berry lake — the juice of the plant, gorgeous and fugitive. Every "permanent sap" since the mid-20th century is a confession: we cannot sell you that lake, so we fake the warmth with phthalo and a modern gold-yellow. Nickel azo (PY150) is that gold. QoR is Golden putting it in Aquazol instead of gum arabic.`,
  },
  "ds-undersea-green": {
    pigment: "PB29/PO48/PY150",
    temp_role:
      "Warm kelp that splits · Ultramarine + quin gold + nickel azo · theatre mixer · ◈",
    notes:
      "DANIEL SMITH Undersea Green. Official PB29 + PO48 + PY150 (catalog had dropped PO48). Nickel in PY150.",
    ace_note: `Kelpy, moody, and a little theatrical — ultramarine sinks while gold floats. Gorgeous for shadows that feel alive, not muddy. Pairs dangerously well with Moonglow.

This is not a green you mix toward. It is a green that unmixes for you. Inorganic PB29 (French ultramarine) is heavy, sedimentary, blue-violet grit. Organic golds (PY150 nickel azo, and DS also lists PO48 quinacridone gold) are light and wander. In a wet wash the sea floor appears: kelp-dark in the puddle, golden halo at the edge. That's why botanists and marine painters hoard it — shadows stay in the plant instead of going carbon-dead or indigo-flat.

Catalog dropped PO48. DS's own color story still says French Ultramarine + Quin Gold, and the index line is PB29, PO48, PY150. Three actors. The extra quin gold is why the halo can feel warmer than Aquarius (PY150/PBr25/PB29 — Polish cousin, more brown ballast, less DS theatre).

Moonglow in the original note is the same idea: a convenience that granulates into a mood. They color-coordinate because both are DS "let the pigments argue" paints — not because you must buy the pair.

Play lab: One fat bead, lots of water, cold-press, do not stir. Name what sinks and what floats. Then a stingy mix on hot-press — if the magic dies, you learned that this mixer needs paper tooth and water, not a drybrush scribble.

Dual advice: one undersea seat. Aquarius pan or this 5ml. vs Deep Sea 954 (later): that is viridian+ultramarine (cool mineral teal). vs Cascade: Cascade is phthalo blue + earth (pine/turquoise); this is ultramarine + gold (kelp). Same "split" verb, different marriage.`,
    ace_history: `DS invented a sea floor in a tube: 1820s French ultramarine, 20th-century quin gold, nickel azo for the glow. Not a historical green. Nickel is why toxicity is medium. The romance ("quin gold") and the index (PY150 + PO48) are both true — two golds, one blue, one argument.`,
  },
  "ds-142-cascade-green": {
    temp_role:
      "Cool pine that splits · Phthalo blue + iron earth · hillside mixer · granulating",
    ace_note: `Moss-to-turquoise separation wet-on-wet — one tube that paints a whole Pacific Northwest hillside.

There is no green pigment in this tube. PB15 (phthalo blue — the engine's cousin) + PBr7 (iron earth, the same class as your siennas and umbers). Green is what happens when staining blue meets dirt. That's why it can flash turquoise in the wet and dry moss where the brown settles. Enough water and a blue appears. Not a mixing-green crayon. A hillside kit.

Same recipe idea as Taiga Mist (fog, quieter) and Christmas Tree (15ml, Santa hat). Cascade is the one that performs. Named for the mountains that split wet Washington from dry inland — the tube is the wet side of that ridge.

It mixes outward if you must: more earth → khaki moss; more blue → storm spruce. But the teaching is the split you already paid for. Stir it into a smooth sap and you threw the Cascades away.

Play lab: Flooded cold-press. Watch three zones if you're lucky — moss sediment, mid green, turquoise melt. Christmas Tree and Taiga beside it if you want to see which pine is theatre and which is weather.

Dual advice: one earth+blue pine seat. Cascade or Taiga or Christmas Tree. vs Undersea: different blue (phthalo vs ultramarine), different yellow/gold (none vs two golds). vs Phthalo Green: that is a dye; this is a landscape sentence.`,
    ace_history: `Late-20th-century landscape hack: stain earth with phthalo blue so the forest paints its own shadows. DS put the local mountains on the label. Peasant chemistry, rain branding.`,
  },
  "wn-tube-green-gold": {
    temp_role:
      "Green-reading yellow · Copper azomethine (PY129) · moss mixer · not a foliage crayon",
    ace_note: `W&N Professional Green Gold — classic British workhorse in 5ml.

The family tag says green. The index says yellow. PY129 (copper azomethine / Irgazin) is a metal-complex yellow that shifts: masstone can look olive-gold, tints go toward yellow, and in mixes it behaves like a muted transparent yellow — the one that makes blues into lichen, pine, and hunter without the highlighter scream of Hansa.

It sits with the metal yellows (next to nickel azo PY150). Both are unsaturated, slightly brownish/greenish, strong masstone-to-tint shift. They are teammates, not twins: PY150 is glowing gold (inside Sap and Undersea); PY129 is greener, more "sun through late leaves."

This is why it's a mixer worth a star. You do not paint a lawn with it. You make the greens you don't want to bottle. Ultramarine + this → textured saps. Indanthrone + this → muted pine that can fake a perylene-green mood. Phthalo blue + this → cleaner, louder leaf. Earth + this → tired August.

Check the tube is single PY129, not a "green gold hue" soup.

Play lab: Masstone vs long dilute — watch it go from moss to gold. Then one mix with a blue you already own (ult or phthalo). The range you get is this tube's job. If you wanted a ready tree, open Sap or Cascade instead.

Dual advice: one PY129 seat. Nothing else in the green family replaces it. Don't stack it with QoR Sap as two "warm greens" — one is a yellow engine, one is a convenience leaf. vs nickel azo alone: keep both only if you hear gold vs moss in mixes.`,
    ace_history: `Late-20th-century copper-azomethine pigment. W&N called it Green Gold; DS's single-pigment twin is Rich Green Gold (they also had an older, brighter "Green Gold" — different story). Turner-era green-gold lakes were fugitive. This is the lightfast stand-in. Sennelier sometimes files the same index as a brown-green. Trust the code.`,
  },
  "wn-tube-terre-verte": {
    temp_role:
      "Muted clay-green · Green earth (celadonite / glauconite) · verdaccio mixer · weak on purpose",
    ace_note: `Soft mineral green — underpainting and quiet foliage.

This is the opposite of Phthalo. PG23 is green earth — celadonite and glauconite, iron in a clay silicate, dug since Rome (Verona, Cyprus). It barely tints. That is not a defect. Renaissance workshops (Cennini) laid a green-earth veil under faces — verdaccio — so warm flesh glazed on top would look like blood under skin, not a pink cutout. Medieval red lakes faded; the green earth stayed; that's why some old faces look seasick now.

W&N still sell it as "perfect for mixing flesh tones." In watercolor that means: a whisper under a cheek, a cool in a shadow that should not go blue, an olive drab that will not fight ochre. It will lose every fight with PG7. Don't ask it to.

Check the tube. Pure PG23 is so weak modern W&N often boosts with PG18 + PB28 (viridian + cobalt). If you see three indices, you have a polite mix, not peasant clay. Catalog single PG23 may be optimistic.

vs Cobalt Deep (PG26): manufactured mutter, more body. vs Viridian (513): cooler, stronger, chromium glass. Terre verte is the dirt that was already green.

Play lab: A wash that looks like nothing. Glaze a warm flesh, ochre, or Potter's Pink over it. If the passage goes dusty-alive, you understood verdaccio. If you wanted a leaf, you opened Phthalo's opposite by mistake.

Dual advice: one green-earth seat. Not a foliage mixer. Not sap. If a later genuine single PG23 looks dirtier/weaker than this W&N, that is the historical one — then this tube is the boosted cousin.`,
    ace_history: `Among the oldest greens still sold. Fresco-safe, lime-safe, Pompeii-to-Giotto. Cennini wanted the green to show a little under the pink. The "sickly medieval complexion" is often just the lakes gone and the earth remaining. Weakness is the point.`,
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
if (nUp !== 6) {
  console.error("count", nUp);
  process.exit(1);
}

const greens = p.colors.filter((c) => c.family === "green");
const dual = greens.filter((c) => (c.ace_note || "").includes("Dual advice"));
const u = p.colors.find((c) => c.id === "ds-undersea-green");
console.log(`Green Dual advice: ${dual.length} / ${greens.length}`);
console.log("Undersea", u.pigment);

p.updated = new Date().toISOString().slice(0, 10) + "-green-tube-mix-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("Green mixing tubes applied:", nUp);
