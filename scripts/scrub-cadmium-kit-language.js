/**
 * Remove kit-ownership / dual-advice language about Cadmium Red/Yellow
 * (sold — no longer in palette). Keep pure pigment history only where
 * it isn't "Cad Light is your seat."
 */
const fs = require("fs");
const path = require("path");

const PALETTE_PATH = path.join(__dirname, "..", "data", "palette.json");
const p = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));

function scrub(text) {
  if (!text || typeof text !== "string") return text;
  let t = text;

  // Dual-advice / kit lines naming Cad Light as a seat
  t = t.replace(
    /\s*Cadmium Light is the opaque opposite religion\.?/gi,
    ""
  );
  t = t.replace(
    /\s*Cad Light remains the opaque religion if you need cover\.?/gi,
    ""
  );
  t = t.replace(
    /\s*Vs Cad Light:[^.]*\./gi,
    ""
  );
  t = t.replace(
    /,\s*Cad Light\.?/g,
    ""
  );
  t = t.replace(
    /Pure Yellow, Golden Yellow, Cad Light/g,
    "Pure Yellow, Golden Yellow"
  );
  t = t.replace(
    /Don't keep Deep \+ Cad \+ Golden as three "just yellows\."/gi,
    "Don't stack Deep + Golden as two mid-golds without a reason."
  );
  t = t.replace(
    /you may not need a separate cadmium orange\.?/gi,
    "you may not need a third warm orange."
  );
  t = t.replace(
    /without the cadmium weight\.?/gi,
    "with transparent manners."
  );
  t = t.replace(/without cadmium weight\.?/gi, "with clean transparent manners.");
  t = t.replace(/without cadmium baggage\.?/gi, "— transparent and staining.");
  t = t.replace(/without cadmium drama\.?/gi, "— clean modern punch.");
  t = t.replace(/without cadmium\.?/gi, ".");
  t = t.replace(/bright without cadmium\.?/gi, "bright and modern.");
  t = t.replace(/clean sunshine without cadmium\.?/gi, "clean sunshine.");
  t = t.replace(/mixing primary without cadmium weight\.?/gi, "mixing primary with transparent manners.");
  t = t.replace(/clean cadmium-free mid primary/gi, "clean mid primary");
  t = t.replace(/cadmium-free mixing primary/gi, "mixing primary");
  t = t.replace(/cadmium-free warm-light mid/gi, "warm-light mid");
  t = t.replace(/Cadmium-free set logic: /gi, "Kit logic: ");
  t = t.replace(/ · cadmium-free bright mid/gi, " · bright mid");
  t = t.replace(/ · cadmium-free bright/gi, " · bright");
  t = t.replace(/ · Cadmium-free mixing primary/gi, " · Mixing primary");
  t = t.replace(/ · accent without cadmium/gi, " · high-chroma accent");
  t = t.replace(/cadmium alternative\.?/gi, "high-chroma alternative to opaque organics.");
  t = t.replace(/not pure cadmium sunset/gi, "not pure opaque sunset");
  t = t.replace(/not lemon, not cadmium/gi, "not lemon, not opaque poster yellow");
  t = t.replace(/not lemon, not cadmium —/gi, "not lemon, not opaque poster yellow —");
  t = t.replace(/Cadmium who\? This one plays nice with blues\./gi, "This one plays nice with blues.");
  t = t.replace(
    /cadmium can choke a delicate green mix with opacity\.?/gi,
    "heavy opaque yellows can choke a delicate green mix."
  );
  t = t.replace(
    /Hue means cadmium\/chrome theater without the old poison plot/gi,
    "Hue means chrome-temperature theater without the old poison plot"
  );
  t = t.replace(/Less harsh than cadmium, lovely/gi, "Warm golden mid, lovely");
  t = t.replace(
    /that cadmium's opacity can't do/gi,
    "that heavy opaque oranges can't do"
  );
  t = t.replace(
    /without cadmium's opacity politics/gi,
    "with cleaner modern chroma"
  );
  t = t.replace(
    /without the same opacity politics/gi,
    "with transparent-leaning fire"
  );
  t = t.replace(
    /a cadmium-like punch without the same opacity politics/gi,
    "high-chroma punch with more transparency"
  );
  t = t.replace(/, not cadmium;/gi, ";");
  t = t.replace(/not cadmium; /gi, "");
  t = t.replace(/without cadmium push\.?/gi, "with clean mixes.");
  t = t.replace(/contemporary cadmium-free primary yellow/gi, "contemporary primary yellow");
  t = t.replace(/for clean sunshine without cadmium weight/gi, "for clean sunshine");
  t = t.replace(/without cadmium weight\.?/gi, ".");
  t = t.replace(/punch without cadmium weight/gi, "punch with clean mixes");
  t = t.replace(
    /warm light without cadmium\.?/gi,
    "warm light without heavy opaque cover."
  );
  t = t.replace(/  +/g, " ");
  t = t.replace(/\n{3,}/g, "\n\n");
  t = t.replace(/ \./g, ".");
  t = t.replace(/\.\./g, ".");
  return t.trim();
}

let n = 0;
for (const c of p.colors) {
  for (const field of ["ace_note", "ace_history", "temp_role", "notes"]) {
    const before = c[field];
    if (!before || typeof before !== "string") continue;
    if (!/cadmium|Cad Light|Cad Red/i.test(before)) continue;
    const after = scrub(before);
    if (after !== before) {
      c[field] = after;
      n++;
      console.log("scrubbed", c.id, field);
    }
  }
}

// Report leftovers
for (const c of p.colors) {
  const blob = [c.ace_note, c.ace_history, c.temp_role, c.notes]
    .filter(Boolean)
    .join("\n");
  if (/cadmium|Cad Light|Cad Red/i.test(blob)) {
    console.log("REMAIN", c.id);
  }
}

p.updated =
  new Date().toISOString().slice(0, 10) + "-red-pan+scrub-cadmium-lang";
fs.writeFileSync(PALETTE_PATH, JSON.stringify(p, null, 2) + "\n", "utf8");
console.log("fields scrubbed:", n);
