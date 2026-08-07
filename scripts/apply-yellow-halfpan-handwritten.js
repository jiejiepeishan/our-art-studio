/**
 * Apply handwritten yellow · half-pan color cards
 * (Desktop yellow-halfpan-draft.md, approved).
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");

const updates = {
  "sch-211-chromium-yellow-lemon": {
    temp_role:
      "Cool lemon · Hansa/arylide primary · spring-green maker · ◈",
    ace_note: `Zingy cool lemon — the bright edge of a citrus slice. Cooler than 212 Light, cleaner than warm Naples for spring greens.

Hue means cadmium/chrome theater without the old poison plot — chemistry is PY3, the classic cool mixer. Push into ultramarine/phthalo for spring greens that stay sharp; with rose it goes peach-coral, not brick. High chroma, modern organic — dose if it stains your ego (less stain drama than some golds, still vivid).

Dual advice: same cool PY3 seat as Lemon Yellow half-pan below. Swatch 211 vs Zitronengelb once; keep one. Cadmium Light is the opaque opposite religion.`,
    ace_history: `Arylide/Hansa yellow (PY3) replaced toxic chrome lemons in 20th-century charts — transparent-leaning high chroma for clean greens. "Chromium Yellow Hue" is Horadam temperature marketing; trust PY3 on the sleeve.`,
  },
  "sch-hp-lemon-yellow": {
    temp_role:
      "Cool lemon · Transparent mixing primary · clean greens with blue",
    ace_note: `Cool, transparent, lemon-bright — your mixing primary for clean greens. Cadmium who? This one plays nice with blues.

Sister soul to 211: cool PY3, transparent manners for glazes and spring. Slightly different hex/grind personality possible — still one role. Plays nice with blues; cadmium can choke a delicate green mix with opacity.

Dual advice: one lemon. If 211 already has ◈ in the kit card logic, this is twin manners. Don't also stock a third cool yellow "just in case."`,
    ace_history: `Hansa lemon (PY3) — azo-family cool primary that retired harsh chrome yellows from thoughtful mixing charts. Zitronengelb is the German for "stop buying a fourth lemon."`,
  },
  "sch-hp-216-pure-yellow": {
    temp_role:
      "Warm-mid transparent yellow · Cadmium-free mixing primary · clean light",
    ace_note: `Clean transparent yellow half-pan — mixing primary without cadmium weight.

Sits between cool lemon and deep gold: PY138 (quinophthalone family territory) as Horadam's "Reingelb" — modern transparent primary for general light, florals, and greens that aren't ice-mint or mustard. Less citrus-edge than PY3; less honey-earth than PY42.

Dual advice: if you only keep two yellows, many kits do cool lemon + this mid (or golden). Vs Cad Light: Pure is glaze-friendly; Cad covers. Vs Golden Yellow PY183: different modern gold manners — swatch.`,
    ace_history: `Pure Yellow / PY138 is Schmincke's contemporary cadmium-free primary yellow — engineered for clean mixes, not historical chrome nostalgia.`,
  },
  "sch-hp-213-chromium-yellow-deep": {
    temp_role:
      "Warm golden mid-yellow · Arylide \"chrome hue\" deep · autumn light",
    ace_note: `Warm golden yellow with a vintage temperament. Less harsh than cadmium, lovely in autumn light.

Important label honesty: sleeve is Hue and pigment PY74 (arylide/Hansa warm mid) — not historic lead chromate PY34. You get warm golden body and "gaslight" mood without that Victorian toxicity story as literal chemistry. Good for sunlit paths mixed small into earths; can go mustard if overcooked with blue.

Dual advice: warm mid seat contested by Pure Yellow, Golden Yellow, Cad Light. Keep Deep when you want opaque-leaning warm gold without cadmium. Don't keep Deep + Cad + Golden as three "just yellows."`,
    ace_history: `True chrome yellow (PY34) painted the 19th century; modern "Chromgelbton" hues usually swap in safer organics (here PY74). Temperature of gilt frames, chemistry of now.`,
  },
  "sch-hp-cadmium-yellow-light": {
    temp_role:
      "Warm opaque yellow · Cadmium butter · cover & sunlit path",
    ace_note: `Buttery and opaque — covers, pushes, asserts. Mix small amounts into earths for sunlit paths.

Cadmium is the heavy sunlight: high chroma, covering, Salon shock in a half-pan. Rescues washed-out fields; muddies delicate glazes if you treat it like Hansa. Mix small into earths for path light; with blue, greens go solid and a bit chalky compared to transparent lemons.

Dual advice: one opaque warm yellow max. If Pure/Golden already mix clean light, Cad is optional muscle. Toxicity/habit: normal studio respect, not panic — still not a juice box.`,
    ace_history: `Cadmium yellow (PY35 lineage) from the mid-19th century — Monet-to-Matisse opaque light. Heavy metal legend, buttery handling; watercolorists still argue cover vs transparency religions over it.`,
  },
  "mb-golden-yellow": {
    temp_role:
      "Warm transparent gold · Staining benzimidazolone · Italian sunshine",
    ace_note: `Italian sunshine without cadmium baggage. Transparent, staining — rewets like it remembers everything. Mixes clean greens with your blues.

PY183 gold that glazes and stains — educational fun is permanent sunbeams: lovely until you wanted a lift. Clean greens with blues; warm florals; honey light through paper. Italian grade manners, transparent box on the label.

Dual advice: staining gold vs Cad cover vs Pure mid — pick by whether you need memory on the paper (stain) or butter cover (cad) or polite primary (Pure). One warm transparent gold seat.`,
    ace_history: `Benzimidazolone yellow (PY183) is modern transparent gold favored where cadmium opacity would choke a wash — MaimeriBlu's Italian sunshine chapter.`,
  },
  "sch-hp-naples-yellow": {
    temp_role:
      "Soft chalky warm yellow · Naples family · skin, stucco, haze",
    ace_note: `Soft, chalky warmth — not a screaming yellow. Skin tones, faded walls, that hazy Mediterranean afternoon.

Naples is a corrector and atmosphere, not a mixing primary. Low scream, high usefulness for flesh, marble shadow warmth, dusty plaster. With blue it dies into soft dirt faster than Hansa — that's the feature for quiet neutrals, the bug for neon spring.

Dual advice: one Naples seat among Schmincke standard / reddish / MaimeriBlu. Standard = classic pale; reddish = peach bias. Don't use Naples when you needed lemon for clean greens.`,
    ace_history: `Historic Naples was lead antimonate on Roman and Renaissance walls; modern PY216 (and related) blends chase chalky warmth without the poison. Giallo di Napoli for flesh and soft light.`,
  },
  "sch-hp-320-naples-yellow-reddish": {
    temp_role:
      "Soft peach Naples · Reddish chalky warm · skin & faded peach walls",
    ace_note: `Warmer Naples in travel half-pan — skin tones and faded peach walls.

Same Naples role, swung toward peach/salmon chalk. Portrait and Mediterranean wall specialty; even less "primary yellow" than standard Naples. Travel half-pan convenience for skin kits.

Dual advice: reddish vs standard Naples = one well. Swatch on a face study; keep the bias you actually paint. Vs Coral Reef (coral family): coral is quin+orange chroma; Naples is chalky soft — different jobs.`,
    ace_history: `Modern Naples reddish (PY216 cuts) push the historic soft yellow toward flesh-peach without lead antimonate. Horadam travel form for portrait tins.`,
  },
  "mb-naples-yellow": {
    temp_role:
      "Soft warm white-yellow · Naples corrector · skin, walls, afternoon",
    ace_note: `Soft warm white-yellow — skin, walls, afternoon light. A gentle corrector, not a mixing primary.

Italian Naples with PY53 (nickel titanate yellow family — pale, opaque-leaning, modern "nickel titanium" pale gold). Same soft job as Horadam Naples, different pigment passport. Clearance sample energy: still a real seat if it wins the swatch.

Dual advice: third Naples auditioner — one Naples wins. PY53 vs PY216 is manners/opacity poetry; pick by skin test, not by collecting Italy.`,
    ace_history: `Naples as portrait pale warmth survives in modern nickel/titanium and complex yellows; Italian workshops kept the name giallo di Napoli for flesh and marble hush.`,
  },
  "pinax-py42-iron-oxide-transparent-yellow": {
    temp_role:
      "Warm earth-yellow · Transparent iron yellow · granulating ochre energy",
    ace_note: `Honey-gold earth yellow that granulates — transparent ochre energy without the mud.

Play lab (granulation): PY42 iron yellow on cold-press can sediment into land light — fields, underpainting sun, greens that look like hills not neon. Tilt a juicy wash; don't over-stir. Cousin to earth-family ochres/Transparent Ochre: if those already own "sensible sunlight," this is brand manners + grit, not a new planet.

Mixes: with blue → soft land greens; with rose → dusty skin/plaster. ◈ mixer energy without cadmium weight.

Dual advice: check earth half-pans/pans before promoting two ochre-yellows. One transparent iron-yellow/ochre seat for land. Vs Urban Yellow: earth mineral vs contemporary specialty gold.`,
    ace_history: `Iron yellow (PY42) continues ochre's ancient job — muted sunlight, underpainting, honest land greens. Pinax Extra marks the G for granulating; the dirt is modern synthetic iron oxide remembering caves.`,
  },
  "sch-916-urban-yellow": {
    temp_role:
      "Warm contemporary gold · Granulating city yellow · specialty light",
    ace_note: `Modern Schmincke yellow with city energy — warm and contemporary.

Play lab (granulation): Built for concrete sun and boulevard spring — granulates into warm grit. Verified-ish energy with phthalo green → traffic-light spring greens; with indigo → smoggy distant trees. Not your quiet lemon primary; it's the yellow that knows streetlights.

Wet-in-wet on cold-press for haze over rooftops; pair with violet mists if you like sunset pollution romance.

Dual advice: specialty / contemporary seat. Don't fire Lemon + Pure to "make room" unless you only paint cities. One granulating warm gold (Urban vs Pinax earth-yellow) unless swatches disagree hard.`,
    ace_history: `Urban Yellow is Horadam modern naming more than a single ancient pigment myth — warm light on glass and pavement, granulating specialty for contemporary sketchbooks. PY154 benzimidazolone-type warm yellow in city clothes.`,
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
  new Date().toISOString().slice(0, 10) + "-yellow-halfpan-handwritten";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log(`Yellow half-pan cards applied: ${nUp}`);
