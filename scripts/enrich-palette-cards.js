/**
 * Enrich palette.json color cards:
 * - temp_role: short temperature + mixing/painting role line
 * - ace_note: layered behavior + personality (expand thin notes; polish all)
 * - ace_history: pigment/process stories (fill gaps; deepen thin ones)
 *
 * Run: node scripts/enrich-palette-cards.js
 * Writes data/palette.json (pretty, stable key order where possible).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PALETTE_PATH = path.join(ROOT, "data", "palette.json");

function hexToHsl(hex) {
  const h = String(hex || "#888").replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h.padEnd(6, "0").slice(0, 6);
  let r = parseInt(full.slice(0, 2), 16) / 255;
  let g = parseInt(full.slice(2, 4), 16) / 255;
  let b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        hue = ((b - r) / d + 2) / 6;
        break;
      default:
        hue = ((r - g) / d + 4) / 6;
    }
  }
  return { h: hue * 360, s: s * 100, l: l * 100 };
}

/** Pigment knowledge (research-backed, short) */
const PIGMENT_LORE = {
  PY3: {
    role: "Cool lemon primary yellow",
    history:
      "Arylide Hansa yellow (PY3) is a 20th-century organic that replaced toxic chrome lemons — transparent, high-chroma, the classic cool mixer for spring greens.",
  },
  PY97: {
    role: "Neutral-to-cool mid yellow primary",
    history:
      "Hansa Yellow Medium (PY97) is prized as a near-neutral bright yellow — strong tinting, good lightfastness, a modern stand-in for cadmium mid without the heavy metal.",
  },
  PY151: {
    role: "Clean primary yellow (often slightly cool)",
    history:
      "Benzimidazolone Azo yellows (PY151) are modern transparent primaries — often a hair cooler than Hansa Medium, beloved for glazing stacks that stay clean.",
  },
  PY150: {
    role: "Warm transparent gold-yellow",
    history:
      "Nickel Azo Yellow (PY150) is a transparent warm yellow that underpins many quinacridone-gold blends — luminous glazes, not chalky coverage.",
  },
  PY42: {
    role: "Earth yellow / ochre family",
    history:
      "Synthetic or natural iron yellow (PY42) continues ochre's ancient job — muted sunlight, underpainting warmth, and greens that look like land instead of neon.",
  },
  PY216: {
    role: "Soft chalky warm yellow (Naples family)",
    history:
      "Modern Naples yellows (often PY216 blends) chase the soft chalky warmth of historic lead antimonate without the poison — skin, stucco, hazy walls.",
  },
  PY40: {
    role: "Pale creamy yellow",
    history:
      "Pale Naples-style yellows echo portrait-studio flesh lights — low drama, high usefulness when you need cream without lemon sting.",
  },
  PY74: {
    role: "Bright mid yellow",
    history:
      "Arylide mid yellows (PY74) are workhorse organics — strong chroma for design and illustration palettes that need punch without cadmium.",
  },
  PY35: {
    role: "Opaque warm cadmium yellow",
    history:
      "Cadmium yellow (PY35) shocked 19th-century painting with opaque buttery light — permanent sunshine with body; mix sparingly into transparent passages.",
  },
  PY34: {
    role: "Warm chrome/chromium yellow character",
    history:
      "Chrome-family warm yellows powered Victorian and commercial color — denser and more assertive than modern organic lemons.",
  },
  PO20: {
    role: "Opaque warm orange",
    history:
      "Cadmium orange (PO20) sits between yellow and red on the palette of modern color — bold fruit, posters, and accents that cover.",
  },
  PO73: {
    role: "Warm transparent fire orange-red (pyrrol)",
    history:
      "Pyrrole orange (PO73) is a late-20th-century high-chroma organic — lightfast fire for clean oranges and florals without cadmium's opacity.",
  },
  PR254: {
    role: "Warm modern organic red (pyrrol)",
    history:
      "Pyrrole red (PR254) is a modern lightfast fire-engine red — cleaner mixes than many earth reds, staining enough to commit with intention.",
  },
  PR108: {
    role: "Warm opaque cadmium red",
    history:
      "Cadmium red (PR108) replaced fugitive vermilion in commercial and fine art — opaque warmth for florals, flesh accents, and corrections.",
  },
  PR209: {
    role: "Warm quinacridone coral-red",
    history:
      "Quinacridone reds/corals (PR209) are transparent organics built for glow — modern glazing reds that keep florals luminous.",
  },
  PR122: {
    role: "Cool magenta / quin violet-red",
    history:
      "Quinacridone magenta (PR122) is a cool primary for modern mixing charts — pink-violet energy for florals and clean purples with blues.",
  },
  PR179: {
    role: "Deep transparent wine red",
    history:
      "Perylene maroon (PR179) is a modern glazing red-brown — botanical shadows and deep florals where old madder would fade.",
  },
  PR101: {
    role: "Iron oxide red / Venetian earth red",
    history:
      "Mars/Venetian reds (PR101) are calcined iron oxides — brick, terracotta, and portrait underpainting since industrial iron pigments matured.",
  },
  PR233: {
    role: "Deep mineral red-violet",
    history:
      "Mineral red-violets expand the cool-dark red range — architectural shadows and muted florals beyond pure magenta.",
  },
  PV19: {
    role: "Cool quinacridone rose / violet-red",
    history:
      "Quinacridone rose/violet (PV19) is a 20th-century transparent star — cool primary red for florals, glazes, and purples that stay clean.",
  },
  PV16: {
    role: "Manganese / mineral violet",
    history:
      "Manganese violet (PV16) is a mineral purple with body and often gentle granulation — quieter than quin fireworks, useful for shadows and florals.",
  },
  PB29: {
    role: "Warm granulating ultramarine blue",
    history:
      "Ultramarine (PB29) was the precious lapis blue of churches before 1828 synthesis — still the granulating, warm-leaning blue of skies and classical mixes.",
  },
  PB15: {
    role: "Cool staining phthalo blue",
    history:
      "Phthalocyanine blue (PB15) arrived mid-20th century — transparent, staining, powerful; a whisper mixes oceans and deep greens.",
  },
  "PB15:3": {
    role: "Cool phthalo blue (green shade)",
    history:
      "Phthalo blue green-shade (PB15:3) is the icy mixer behind countless teals — tiny doses; it will own the painting if you shout.",
  },
  PB16: {
    role: "Phthalo turquoise / blue-green",
    history:
      "Phthalo turquoise (PB16) is a clean tropical blue-green of the phthalocyanine family — poster clarity without grinding gemstones.",
  },
  PB35: {
    role: "Milky semi-opaque cerulean",
    history:
      "Cerulean (PB35/cobalt stannate family) was synthesized in the 1860s for safer sky blues — milky, often gentle, Impressionist horizon friend.",
  },
  PB60: {
    role: "Deep indanthrene blue",
    history:
      "Indanthrene/anthraquinone blues (PB60) are deep, staining darks — night water and structural shadows without pure black.",
  },
  PG7: {
    role: "Cool staining phthalo green",
    history:
      "Phthalo green (PG7) revolutionized mixing in the 20th century — one touch turns yellows into vivid leaf; respect the ratio or it eats the sketch.",
  },
  PG36: {
    role: "Yellow-leaning phthalo green",
    history:
      "Phthalo green yellow-shade (PG36) is warmer than blue-shade PG7 — still staining and strong, friendlier for spring mixes.",
  },
  PG26: {
    role: "Muted mineral cobalt green",
    history:
      "Cobalt green (PG26) is 19th-century mineral quiet — forest recession and tired summer foliage before phthalo took the mixing bench.",
  },
  PBr7: {
    role: "Natural/synthetic iron earth brown",
    history:
      "PBr7 covers raw and burnt earths — iron-rich clays, sometimes with manganese in umbers. Roasting (calcining) swings the same family from cool espresso to warm red-brown.",
  },
  PBk6: {
    role: "Carbon / lamp black family",
    history:
      "Carbon blacks (PBk6) are soot-descended darks — strong, often cool; in watercolor they can deaden mixes, so many painters prefer mixed chromatic blacks.",
  },
  PBk7: {
    role: "Ivory / bone black character",
    history:
      "Bone/ivory blacks (PBk7) are warmer historical darks from charred bone — still useful, still easy to muddy a sky if overused.",
  },
  PW6: {
    role: "Titanium white / opaque light",
    history:
      "Titanium white (PW6) is the modern opaque light — strong coverage for gouache-like passages; watercolor purists use it sparingly for body color.",
  },
  PW20: {
    role: "Mica / interference specialty",
    history:
      "Mica and pearlescent whites (PW20 family) are modern effect pigments — sparkle and shift more than traditional covering white.",
  },
};

function primaryPigment(pigment) {
  if (!pigment) return "";
  const first = String(pigment).split(/[+/,&]/)[0].trim();
  return first.replace(/\s/g, "");
}

function tempBandFromHue(h, s, l, family, name, pigment) {
  const n = (name || "").toLowerCase();
  const fam = (family || "").toLowerCase();
  const pig = (pigment || "").toUpperCase();
  // Pigment overrides (more reliable than hex for primaries)
  if (/PY3\b/.test(pig) || /lemon|hansa yellow light/i.test(n))
    return { temp: "Cool yellow", lean: "lemon / green-leaning primary" };
  if (/PY97\b|PY151\b/.test(pig) || /hansa yellow medium|azo yellow/i.test(n))
    return { temp: "Mid yellow", lean: "neutral-to-cool primary" };
  if (/PY150\b|nickel azo/i.test(n + pig))
    return { temp: "Warm yellow", lean: "gold / glaze yellow" };
  if (/PO73\b|PR254\b|pyrrol|pyrrole/i.test(n + pig))
    return { temp: "Warm red-orange", lean: "fire primary" };
  if (/PV19\b|quinacridone rose|permanent rose/i.test(n + pig))
    return { temp: "Cool rose", lean: "magenta-violet primary" };
  if (/PB29\b|ultramarine/i.test(n + pig))
    return { temp: "Warm blue", lean: "red-shade granulating" };
  if (/PB15|phthalo blue/i.test(n + pig))
    return { temp: "Cool blue", lean: "green-shade staining" };
  if (/PG7\b|phthalo green/i.test(n + pig) && !/may|sap|hooker/i.test(n))
    return { temp: "Cool green", lean: "blue-shade staining" };

  if (s < 12 || fam === "neutral" || /grey|gray|black|white|neutral|payne/i.test(n)) {
    if (l < 25) return { temp: "Near-neutral dark", lean: "low chroma" };
    if (l > 85) return { temp: "Near-neutral light", lean: "low chroma" };
    return { temp: "Neutral / low-chroma", lean: "grey family" };
  }
  if (fam === "earth" || /umber|sienna|ochre|sepia|brown|earth/i.test(n)) {
    if (/raw umber|green umber|cool/i.test(n) || (h >= 40 && h < 100 && l < 45)) {
      return { temp: "Cool earth", lean: "green-brown undertone" };
    }
    if (/burnt|sienna|venetian|english red|mars/i.test(n) || h < 40 || h >= 345) {
      return { temp: "Warm earth", lean: "red-orange roast" };
    }
    return { temp: "Earth mid", lean: "muted iron" };
  }
  if (h < 20 || h >= 345) return { temp: "Warm red family", lean: "orange-leaning or mid red" };
  if (h < 45) return { temp: "Warm orange", lean: "yellow-red bridge" };
  if (h < 70) {
    if (h < 55 && s > 40) return { temp: "Warm yellow", lean: "gold/orange edge" };
    return { temp: "Cool-to-mid yellow", lean: "lemon or neutral primary" };
  }
  if (h < 100) return { temp: "Yellow-green", lean: "chartreuse bridge" };
  if (h < 165) {
    if (h < 140) return { temp: "Warm-leaning green", lean: "olive/leaf" };
    return { temp: "Cool green", lean: "blue-green / phthalo ice" };
  }
  if (h < 200) return { temp: "Cool turquoise", lean: "blue-green water" };
  if (h < 255) {
    if (h < 230) return { temp: "Cool blue", lean: "green-shade / phthalo" };
    return { temp: "Warm-leaning blue", lean: "ultramarine / red-shade" };
  }
  if (h < 290) return { temp: "Cool violet-blue", lean: "indigo/violet bridge" };
  if (h < 330) return { temp: "Cool purple / magenta", lean: "rose-violet" };
  return { temp: "Cool rose / pink", lean: "quin-leaning" };
}

function roleLine(c, tempInfo, lore) {
  const fam = (c.family || "").toLowerCase();
  const n = (c.name_en || "").toLowerCase();
  let role =
    lore?.role ||
    (fam === "yellow"
      ? "Yellow for mixing and light"
      : fam === "red"
        ? "Red / warm accent"
        : fam === "pink"
          ? "Cool rose / floral primary"
          : fam === "blue"
            ? "Blue for sky, water, and mixes"
            : fam === "green"
              ? "Green — convenience or mixer"
              : fam === "earth"
                ? "Earth for land, bark, and neutrals"
                : fam === "purple"
                  ? "Violet for shadow and florals"
                  : fam === "orange"
                    ? "Orange accent / bridge color"
                    : fam === "neutral"
                      ? "Neutral / value tool"
                      : "Studio accent");

  if (/sap green|may green|hooker/i.test(n)) role = "Warm convenience foliage green";
  if (/pyrrol|scarlet pyrrol|pyrrole/i.test(n)) role = "Warm fire red/orange primary";
  if (/quin.*rose|permanent rose|opera/i.test(n)) role = "Cool rose primary";
  if (/PY3\b/i.test(c.pigment || "") || /lemon|hansa yellow light/i.test(n))
    role = "Cool lemon primary yellow";
  else if (/PY97\b|PY151\b/i.test(c.pigment || "") || /hansa yellow|azo yellow/i.test(n))
    role = "Mid primary yellow (Hansa/Azo family)";
  if (/burnt sienna/i.test(n)) role = "Warm roasted red-brown earth";
  if (/raw umber/i.test(n)) role = "Cool green-brown earth dark";
  if (/burnt umber/i.test(n)) role = "Warm dark earth for chromatic blacks";
  if (/ultramarine/i.test(n)) role = "Warm granulating sky/mixing blue";
  if (/phthalo blue|helio blue|windsor blue/i.test(n)) role = "Cool staining blue powerhouse";
  if (/phthalo green|helio green/i.test(n) && !/may|sap|hooker/i.test(n))
    role = "Cool staining green powerhouse";

  const traits = [];
  if (c.mix_star) traits.push("◈ mixer");
  if (c.granulating) traits.push("granulating");
  if (c.staining) traits.push("staining");
  if (c.transparency === 1) traits.push("transparent");
  if (c.transparency === 3) traits.push("more opaque");

  return [tempInfo.temp, role, ...traits].filter(Boolean).join(" · ");
}

function behaviorClause(c) {
  const parts = [];
  if (c.transparency === 1) parts.push("transparent in washes");
  else if (c.transparency === 3) parts.push("more body/coverage than a pure stain");
  else parts.push("semi-transparent — glazes with a little presence");
  if (c.granulating) parts.push("happy to freckle and separate on wet paper");
  if (c.staining) parts.push("stains — commit lightly first");
  if (c.mix_star) parts.push("earns a ◈ as a cooperative mixer");
  return parts.join("; ");
}

function enrichAceNote(c, tempInfo, lore) {
  // Always start from original seed fields if present (script is one-shot; don't stack)
  const existing = (c.ace_note || "").trim();
  const name = c.name_en || "This pan";
  const brand = c.brand || "";
  const n = name.toLowerCase();

  // Strip previous enricher tails if re-run
  let personality = existing
    .replace(/\s*On paper:[\s\S]*$/i, "")
    .replace(/\s*Temperature read:[\s\S]*$/i, "")
    .replace(/\s*With Ultramarine[\s\S]*$/i, "")
    .replace(/\s*Dual advice:[\s\S]*$/i, "")
    .replace(/\s*Pair with a warm red[\s\S]*$/i, "")
    .replace(/\s*Hansa\/Azo-type yellows[\s\S]*$/i, "")
    .replace(/\s*Lean into texture[\s\S]*$/i, "")
    .trim();

  if (personality.length < 55) {
    // Expand thin notes with more voice
    if (/burnt sienna/i.test(n)) {
      personality =
        "Warm roasted iron — a muted orange-brown more than a boring 'brown.' The sketching workhorse for bark, sun-warmed skin, and land that still glows.";
    } else if (/raw umber/i.test(n)) {
      personality =
        "Cool espresso earth with a greenish undertone — not sunset brown. Quiet darkener for trunks, winter paths, and greys that stay civilized.";
    } else if (/hansa/i.test(n) || /azo yellow/i.test(n)) {
      personality =
        "Modern primary yellow energy — clean, non-cadmium light for greens and high-key florals. The pan you reach for when the mix must stay bright.";
    } else if (/pyrrol|pyrrole|scarlet pyrrol/i.test(n)) {
      personality =
        "Fire without cadmium drama — warm, clean, a little bossy on the paper. Florals, fruit, and sunsets that refuse to go brick.";
    } else if (/quin.*rose|permanent rose/i.test(n)) {
      personality =
        "Cool rose magic — pink-violet, transparent, floral. Beautiful glazes; not a substitute for a warm fire red when you need heat.";
    } else if (/phthalo green/i.test(n)) {
      personality =
        "Synthetic ice in green form — tiny squeeze, mile of tint. Respect the ratio or it will colonize every mix.";
    } else if (/ultramarine/i.test(n)) {
      personality =
        "Warm-leaning blue with old-soul granulation — skies, cloth, and neutrals when it meets a warm earth.";
    } else if (personality.length < 40) {
      personality = `${name} brings ${tempInfo.temp.toLowerCase()} energy to the tin — worth knowing by temperature, not just by pretty swatch.`;
    }
  }

  // Avoid duplicating if already very long and rich
  const hasTempWord = /warm|cool|neutral|earth|granulat|stain|transparent|opaque|lemon|orange-lean/i.test(
    personality
  );
  const behavior = behaviorClause(c);
  let dual = "";
  if (/burnt sienna/i.test(n)) {
    dual =
      " With Ultramarine it builds classic greys; it will not do Raw Umber's cool slate job — keep both roles if you can.";
  } else if (/raw umber/i.test(n)) {
    dual =
      " With Ultramarine it goes icy slate, not sienna's balanced grey — lovely for mood, risky for sunlit skin.";
  } else if (/quin.*rose|permanent rose/i.test(n)) {
    dual = " Pair with a warm red/orange when you need heat; rose alone stays on the cool side of the wheel.";
  } else if (/hansa|azo yellow|lemon/i.test(n)) {
    dual =
      " Hansa/Azo-type yellows often share one job — you rarely need two near-identical primaries unless you crave a micro temperature split.";
  } else if (/phthalo blue|helio turquoise|turquoise/i.test(n) && c.staining) {
    dual = " Dual advice: whisper in mixes; scream only when the subject is electric water or glass.";
  } else if (c.mix_star && c.staining) {
    dual = " Dual advice: fantastic mixer — still dose staining power like hot sauce.";
  } else if (c.granulating) {
    dual = " Lean into texture for atmosphere; reach for a smoother neighbor when you need flat design color.";
  }

  let note = personality.trim();
  if (!hasTempWord) {
    note += ` Temperature read: ${tempInfo.temp.toLowerCase()} (${tempInfo.lean}).`;
  }
  if (note.length < 140 && behavior) {
    note += ` On paper: ${behavior}.`;
  }
  if (dual && !note.includes("Dual advice") && !/Ultramarine it/i.test(note)) {
    note += dual;
  }
  // Cap runaway length
  if (note.length > 420) note = note.slice(0, 417).replace(/\s+\S*$/, "") + "…";
  return note;
}

function enrichHistory(c, lore) {
  const existing = (c.ace_history || "").trim();
  const pig = primaryPigment(c.pigment);
  const n = (c.name_en || "").toLowerCase();
  const brand = c.brand || "this brand";

  // Named specials always win (process stories you loved in the QA)
  if (/burnt sienna/i.test(n)) {
    return "Burnt sienna is iron earth roasted (calcined) until warm red-orange appears — a portrait and landscape staple. Same broad iron family as some umbers, opposite kitchen temperature from raw cool earths. DS often leans into granulation on wet paper.";
  }
  if (/raw umber/i.test(n)) {
    return "Raw umber is unroasted iron earth, often with manganese that pulls a cool green-brown undertone — ancient shadow tool from classical drawings to landscape sketchbooks. Teammate to burnt sienna, not a twin.";
  }
  if (/burnt umber/i.test(n)) {
    return "Burnt umber is roasted umber earth — warmer and often darker than raw. Classic with ultramarine for quick chromatic blacks and soft greys.";
  }

  if (existing.length >= 150) return existing;

  let core = lore?.history || existing;
  if (!core || core.length < 40) {
    if (c.pigment && c.pigment.includes("/")) {
      core = `${c.name_en} is a multi-pigment mix (${c.pigment}) — modern convenience color built for effect on paper rather than a single historic mineral name.`;
    } else if (pig) {
      core = `${c.name_en} is grounded in ${pig} — part of the modern catalog that let watercolorists chase light without grinding every rock by hand.`;
    } else {
      core = `${c.name_en} sits in ${brand}'s line as a studio color with its own mixing job — learn it by temperature and transparency, not only by the label.`;
    }
  }

  if (brand.includes("Daniel Smith") && core.length < 220 && c.granulating && !/DS often/i.test(core)) {
    core += " DS often leans into granulation and drama on wet paper.";
  } else if (/Schmincke/i.test(brand) && core.length < 220 && !/Horadam/i.test(core)) {
    core += " Horadam milling aims for creamy rewet and control.";
  } else if (/M\.?\s*Graham/i.test(brand) && core.length < 220 && !/Honey binder/i.test(core)) {
    core += " Honey binder gives a distinctive slip and rewet.";
  }

  if (core.length > 380) core = core.slice(0, 377).replace(/\s+\S*$/, "") + "…";
  return core;
}

function enrichColor(c) {
  const { h, s, l } = hexToHsl(c.hex);
  const pig = primaryPigment(c.pigment);
  const lore = PIGMENT_LORE[pig] || null;
  const tempInfo = tempBandFromHue(h, s, l, c.family, c.name_en, c.pigment);
  const temp_role = roleLine(c, tempInfo, lore);
  const ace_note = enrichAceNote(c, tempInfo, lore);
  const ace_history = enrichHistory(c, lore);

  return {
    ...c,
    temp_role,
    ace_note,
    ace_history,
  };
}

function main() {
  const raw = JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));
  const colors = raw.colors.map(enrichColor);
  const out = {
    ...raw,
    updated: new Date().toISOString().slice(0, 10) + "-temp-role-enrich",
    color_count: colors.length,
    colors,
  };
  fs.writeFileSync(PALETTE_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`Enriched ${colors.length} colors → ${PALETTE_PATH}`);
  // Show a few samples
  for (const id of ["ds-burnt-sienna", "sch-hp-679-raw-umber", "mg-107-hansa-yellow", "mg-176-scarlet-pyrrol", "mg-156-quin-rose"]) {
    const c = colors.find((x) => x.id === id);
    if (!c) continue;
    console.log("\n===", c.name_en, "===");
    console.log("temp_role:", c.temp_role);
    console.log("ace_note:", c.ace_note);
    console.log("ace_history:", c.ace_history);
  }
}

main();
