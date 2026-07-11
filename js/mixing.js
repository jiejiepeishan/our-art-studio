const Mixing = (() => {
  const HUE_TARGETS = {
    purple: { min: 250, max: 310, label: "purple" },
    violet: { min: 270, max: 300, label: "violet" },
    blue: { min: 200, max: 250, label: "blue" },
    green: { min: 80, max: 160, label: "green" },
    sage: { min: 90, max: 130, label: "sage green" },
    yellow: { min: 40, max: 70, label: "yellow" },
    orange: { min: 15, max: 45, label: "orange" },
    coral: { min: 5, max: 25, label: "coral" },
    red: { min: 340, max: 360, label: "red" },
    crimson: { min: 330, max: 350, label: "crimson" },
    brown: { min: 20, max: 45, label: "brown", maxS: 55 },
    gray: { min: 0, max: 360, label: "gray", maxS: 18 },
    neutral: { min: 0, max: 360, label: "neutral", maxS: 15 },
  };

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  function rgbToHex(r, g, b) {
    const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
    return (
      "#" +
      [clamp(r), clamp(g), clamp(b)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        default:
          h = ((r - g) / d + 4) / 6;
      }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToHueName(h, s, l) {
    if (s < 12) {
      if (l < 25) return "near black";
      if (l > 85) return "near white";
      return "gray";
    }
    const names = [
      "red",
      "orange",
      "yellow",
      "yellow-green",
      "green",
      "teal",
      "cyan",
      "blue",
      "indigo",
      "purple",
      "violet",
      "magenta",
    ];
    const idx = Math.round(h / 30) % 12;
    return names[idx];
  }

  function colorHueDist(c1, c2) {
    const h1 = rgbToHsl(...Object.values(hexToRgb(c1.hex))).h;
    const h2 = rgbToHsl(...Object.values(hexToRgb(c2.hex))).h;
    const diff = Math.abs(h1 - h2);
    return Math.min(diff, 360 - diff);
  }

  function paintLabel(c) {
    return c.name_en || "this color";
  }

  function warningText(segments) {
    return segments
      .map((s) => (s.t != null ? s.t : s.swap?.label || ""))
      .join("");
  }

  function pushWarning(list, segments) {
    list.push({ segments, text: warningText(segments) });
  }

  function pigmentTokens(color) {
    return String(color.pigment || "")
      .split(/[/+,|&\s]+/)
      .map((p) => p.trim().toUpperCase())
      .filter(Boolean);
  }

  function hasPigmentPrefix(colors, prefix) {
    const p = prefix.toUpperCase();
    return colors.some((c) =>
      pigmentTokens(c).some((tok) => {
        // PB29 yes; PBk (black) is not a blue
        if (p === "PB") return /^PB(?!K)/.test(tok);
        return tok.startsWith(p);
      })
    );
  }

  /** Muters / greys / blacks — not valid "rose + blue" route partners */
  function isMostlyNeutralColor(c) {
    const fam = (c.family || "").toLowerCase();
    if (["neutral", "gray", "grey", "black", "white"].includes(fam)) return true;
    const toks = pigmentTokens(c);
    if (toks.some((t) => t.startsWith("PBK") || t.startsWith("PW"))) return true;
    const name = (c.name_en || "").toLowerCase();
    if (/\b(neutral|tint|grey|gray|black|white|ivory)\b/.test(name)) return true;
    try {
      const hsl = hexToHsl(c.hex);
      if (hsl.s < 16) return true;
    } catch (_) {
      /* hexToHsl may be defined later in IIFE — safe after full parse */
    }
    return false;
  }

  function chromaticMixColors(colors) {
    return colors.filter((c) => !isMostlyNeutralColor(c));
  }

  function mixWeight(c) {
    let w = 1;
    if (c.staining) w += 0.55;
    if (c.transparency === 3) w += 0.2;
    return w;
  }

  /**
   * Tips for this exact recipe only (host + partners == selection).
   * Prevents A+B tips from boosting A+B+C triples and crowding out pairs.
   */
  function findMatchingMixTips(colorList, paletteData) {
    const selected = new Set(colorList.map((c) => c.id));
    const byId = new Map((paletteData?.colors || colorList).map((c) => [c.id, c]));
    const matches = [];
    const seen = new Set();

    for (const host of colorList) {
      for (const tip of host.mix_tips || []) {
        const partnerIds = tip.with || [];
        if (!partnerIds.length) continue;
        const recipe = new Set([host.id, ...partnerIds]);
        if (recipe.size !== selected.size) continue;
        if (![...recipe].every((id) => selected.has(id))) continue;
        const key = [...recipe].sort().join("|") + "|" + (tip.result || "");
        if (seen.has(key)) continue;
        seen.add(key);
        matches.push({
          hostId: host.id,
          partnerIds,
          partners: partnerIds.map((id) => byId.get(id)).filter(Boolean),
          result: tip.result || "",
          verified: !!tip.verified,
        });
      }
    }

    matches.sort((a, b) => Number(b.verified) - Number(a.verified));
    return matches;
  }

  function findSubstitutes(color, mixColors, catalog, opts = {}) {
    const inMix = new Set(mixColors.map((c) => c.id));
    const filterPool = (requireFamily) =>
      catalog.filter((c) => {
        if (c.id === color.id || inMix.has(c.id)) return false;
        if (opts.maxTransparency != null && (c.transparency || 2) > opts.maxTransparency) {
          return false;
        }
        if (opts.nonGranulating && c.granulating) return false;
        if (opts.nonStaining && c.staining) return false;
        if (requireFamily && opts.family && c.family !== color.family) return false;
        return true;
      });

    let pool = filterPool(true);
    if (!pool.length && opts.family) pool = filterPool(false);

    pool.sort((a, b) => {
      const hueA = colorHueDist(color, a);
      const hueB = colorHueDist(color, b);
      if (hueA !== hueB) return hueA - hueB;
      return (a.transparency || 2) - (b.transparency || 2);
    });

    return pool.slice(0, opts.limit ?? 2);
  }

  function findComplementSubstitute(a, b, mixColors, catalog) {
    const inMix = new Set(mixColors.map((c) => c.id));
    const distAB = colorHueDist(a, b);
    const pool = catalog.filter(
      (c) => c.id !== a.id && c.id !== b.id && !inMix.has(c.id)
    );
    const ranked = pool
      .map((c) => ({ c, distToB: colorHueDist(c, b) }))
      .filter((x) => x.distToB < distAB * 0.65)
      .sort((x, y) => x.distToB - y.distToB);
    return ranked[0]?.c || null;
  }

  function partnersOf(color, colors) {
    return colors.filter((c) => c.id !== color.id);
  }

  function partnerNames(color, colors) {
    const others = partnersOf(color, colors);
    if (!others.length) return "the other paints";
    if (others.length === 1) return others[0].name_en;
    if (others.length === 2) return `${others[0].name_en} & ${others[1].name_en}`;
    return "the other paints";
  }

  function appendSwapTail(segs, replaceId, subs, lead = "Prefer a different tube? Try ") {
    if (!subs.length) return segs;
    segs.push({ t: ` ${lead}` });
    subs.forEach((sub, i) => {
      if (i > 0) segs.push({ t: i === subs.length - 1 ? " or " : ", " });
      segs.push({ swap: { replaceId, withId: sub.id, label: sub.name_en } });
    });
    segs.push({ t: "." });
    return segs;
  }

  function granulationWarning(g, colors, catalog) {
    const others = partnersOf(g, colors);
    const smooth = others.filter((c) => !c.granulating);
    const subs = catalog.length
      ? findSubstitutes(g, colors, catalog, {
          family: g.family,
          nonGranulating: true,
          limit: 1,
        })
      : [];
    const who = smooth.length === 1 ? smooth[0].name_en : partnerNames(g, colors);
    let lead;
    if (smooth.some((c) => c.transparency === 1)) {
      lead = `${paintLabel(g)} granulates — freckles while ${who} stays clear and silky. Gorgeous texture; uneven if you wanted flat.`;
    } else if (smooth.some((c) => (c.family || "") === "earth")) {
      lead = `${paintLabel(g)} granulates — with earthy ${who}, expect a gritty, sedimentary wash. Bark, path, storm-cloud energy.`;
    } else {
      lead = `${paintLabel(g)} granulates — settles into texture while ${who} lays smoother. Lean in for atmosphere; skip for even coverage.`;
    }
    const segs = [{ t: lead }];
    return appendSwapTail(segs, g.id, subs, "Smoother? Try ");
  }

  function stainingWarning(s, colors, catalog) {
    const others = partnersOf(s, colors);
    const gentle = others.filter((c) => !c.staining);
    const subs = catalog.length
      ? findSubstitutes(s, colors, catalog, { family: s.family, nonStaining: true, limit: 1 })
      : [];
    const who = gentle.length === 1 ? gentle[0].name_en : partnerNames(s, colors);
    let lead;
    if (gentle.some((c) => c.granulating)) {
      lead = `${paintLabel(s)} stains hard — dyes the mix while granulators still freckle underneath. One drop goes far; lift won't save you.`;
    } else if (gentle.some((c) => c.transparency === 1)) {
      lead = `${paintLabel(s)} stains hard — next to ${who}, it hijacks the hue and locks in. Whisper-light to tint; more is a takeover.`;
    } else {
      lead = `${paintLabel(s)} stains hard — bosses ${who} around and won't scrub out. Go whisper-light unless you want it in charge.`;
    }
    const segs = [{ t: lead }];
    return appendSwapTail(segs, s.id, subs, "Gentler? Try ");
  }

  function opaqueWarning(o, colors, catalog) {
    const others = partnersOf(o, colors);
    const lucid = others.filter((c) => (c.transparency || 2) <= 2);
    const subs = catalog.length
      ? findSubstitutes(o, colors, catalog, { family: o.family, maxTransparency: 2, limit: 2 })
      : [];
    const who = lucid.length === 1 ? lucid[0].name_en : partnerNames(o, colors);
    let lead;
    if (lucid.some((c) => c.transparency === 1)) {
      lead = `${paintLabel(o)} is opaque — sits on top of ${who} and mutes that glow. Fine for soft lights; blunt for deep glazes.`;
    } else if (others.every((c) => c.transparency === 3)) {
      lead = `${paintLabel(o)} is opaque — with other body colors, expect a denser, gouache-ish mix. Less light through the paper.`;
    } else {
      lead = `${paintLabel(o)} is opaque — covers more than it glazes. With ${who}, mixes can go chalky instead of jewel-toned.`;
    }
    const segs = [{ t: lead }];
    return appendSwapTail(segs, o.id, subs, "More glow? Try ");
  }

  function cleanMixWarning(colors) {
    const allTrans = colors.every((c) => (c.transparency || 2) === 1);
    const anyStar = colors.some((c) => c.mix_star);
    const allGran = colors.every((c) => c.granulating);
    if (allGran) {
      return "All granulating — texture party. Freckles and blooms, not a smooth skin of color.";
    }
    if (allTrans && anyStar) {
      return "Transparent ◈ mix — should stay luminous. Quick swatch before a big wash.";
    }
    if (allTrans) {
      return "All transparent — light still moves through. Good glaze territory; swatch the ratio.";
    }
    if (anyStar) {
      return "◈ mixers on deck — tends to behave. Give it a test swipe.";
    }
    return "Looks cooperative — quick swatch, then commit.";
  }

  function buildWarnings(colors, paletteData) {
    const catalog = paletteData?.colors || [];
    const w = [];

    const granulating = colors.filter((c) => c.granulating);
    if (granulating.length && granulating.length < colors.length) {
      for (const g of granulating) {
        pushWarning(w, granulationWarning(g, colors, catalog));
      }
    }

    const staining = colors.filter((c) => c.staining);
    if (staining.length && colors.some((c) => !c.staining)) {
      for (const s of staining) {
        pushWarning(w, stainingWarning(s, colors, catalog));
      }
    }

    const opaque = colors.filter((c) => c.transparency === 3);
    for (const o of opaque) {
      pushWarning(w, opaqueWarning(o, colors, catalog));
    }

    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        if (complementRisk(colors[i], colors[j])) {
          const a = colors[i];
          const b = colors[j];
          const subA = catalog.length
            ? findComplementSubstitute(a, b, colors, catalog)
            : null;
          const subB = catalog.length
            ? findComplementSubstitute(b, a, colors, catalog)
            : null;
          const sub = subA || subB;
          const replace = subA ? a : b;
          const bothEarth = a.family === "earth" && b.family === "earth";
          const lead = bothEarth
            ? `${a.name_en} + ${b.name_en} sit far apart — earths already lean neutral, so they dull fast. Great for dirt; meh for pure color.`
            : `${a.name_en} + ${b.name_en} are near-complements — cancel toward brown-gray. Dreamy shadows; muddy if you wanted pure chroma.`;
          if (sub) {
            pushWarning(w, [
              { t: `${lead} Brighter? Try ` },
              { swap: { replaceId: replace.id, withId: sub.id, label: sub.name_en } },
              { t: ` instead of ${paintLabel(replace)}.` },
            ]);
          } else {
            pushWarning(w, [{ t: lead }]);
          }
        }
      }
    }

    if (!w.length) {
      pushWarning(w, [{ t: cleanMixWarning(colors) }]);
    }
    return w;
  }

  function computeMix(colorList) {
    if (!colorList.length) return null;
    let r = 0;
    let g = 0;
    let b = 0;
    let totalW = 0;
    for (const c of colorList) {
      const w = mixWeight(c);
      const rgb = hexToRgb(c.hex);
      r += rgb.r * w;
      g += rgb.g * w;
      b += rgb.b * w;
      totalW += w;
    }
    const hex = rgbToHex(r / totalW, g / totalW, b / totalW);
    const hsl = rgbToHsl(r / totalW, g / totalW, b / totalW);
    return {
      hex,
      hsl,
      hueName: hslToHueName(hsl.h, hsl.s, hsl.l),
    };
  }

  function mixColors(colorList, paletteData) {
    const base = computeMix(colorList);
    if (!base) return null;
    return {
      ...base,
      warnings: buildWarnings(colorList, paletteData),
      tips: findMatchingMixTips(colorList, paletteData),
    };
  }

  function hueDistance(h, target) {
    const t = HUE_TARGETS[target] || parseHueInput(target);
    if (!t) return 180;
    let hNorm = h;
    if (t.min > t.max) {
      const inRange = h >= t.min || h <= t.max;
      return inRange ? 0 : Math.min(Math.abs(h - t.min), Math.abs(h - t.max));
    }
    if (h >= t.min && h <= t.max) return 0;
    return Math.min(Math.abs(h - t.min), Math.abs(h - t.max));
  }

  function parseHueInput(input) {
    const key = String(input || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
    if (HUE_TARGETS[key]) return HUE_TARGETS[key];
    for (const [k, v] of Object.entries(HUE_TARGETS)) {
      if (key.includes(k)) return v;
    }
    return null;
  }

  function complementRisk(c1, c2) {
    const dist = colorHueDist(c1, c2);
    return dist > 150 && dist < 210;
  }

  /**
   * ◈ good-for-mix preference as ranking weights (not random dice).
   * Each star counts ~3× a regular tube → log-weight boost on score (lower is better).
   * Two ◈ in a pair ≈ stronger than one; cleaner than "roll 3× probability."
   */
  function mixStarBoost(colors) {
    let logW = 0;
    let stars = 0;
    for (const c of colors) {
      if (c.mix_star) {
        logW += Math.log(3);
        stars += 1;
      } else {
        logW += Math.log(1);
      }
    }
    let boost = logW * 10;
    if (stars === colors.length && stars > 0) boost += 4;
    return boost;
  }

  function scoreCombo(colors, target) {
    const mix = computeMix(colors);
    if (!mix) return { mix: null, score: 999, note: "", tip: null, hueDist: 180 };
    const t = parseHueInput(target);
    if (!t) return { mix, score: 999, note: "", tip: null, hueDist: 180 };

    let hueDist = hueDistance(mix.hsl.h, target);
    let score = hueDist;

    if (t.maxS !== undefined && mix.hsl.s > t.maxS) score += (mix.hsl.s - t.maxS) * 0.5;
    if (t.maxS !== undefined && mix.hsl.s < t.maxS * 0.3) score += 10;

    let mudPenalty = 0;
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        if (complementRisk(colors[i], colors[j])) mudPenalty += 25;
      }
    }
    score += mudPenalty;

    // Clean chromatic targets: prefer transparent non-earths (bases especially)
    const cleanTarget = t.maxS === undefined;
    if (cleanTarget && colors.length === 2) {
      for (const c of colors) {
        if (c.transparency === 3) score += 8;
        if (c.family === "earth") score += 6;
      }
      const avgT =
        colors.reduce((sum, c) => sum + (c.transparency || 2), 0) / colors.length;
      score += (avgT - 1) * 4;
    }

    // Classic pigment routes — chromatic partners only (skip Neutral Tint / blacks)
    const routeColors = chromaticMixColors(colors);
    const label = (t.label || "").toLowerCase();
    if (label.includes("purple") || label.includes("violet")) {
      if (hasPigmentPrefix(routeColors, "PV") && hasPigmentPrefix(routeColors, "PB")) score -= 12;
      else if (hasPigmentPrefix(routeColors, "PR") && hasPigmentPrefix(routeColors, "PB")) score -= 5;
    } else if (label.includes("green") || label.includes("sage")) {
      if (hasPigmentPrefix(routeColors, "PY") && hasPigmentPrefix(routeColors, "PB")) score -= 10;
      else if (hasPigmentPrefix(routeColors, "PY") && hasPigmentPrefix(routeColors, "PG")) score -= 8;
    } else if (label.includes("orange") || label.includes("coral")) {
      if (hasPigmentPrefix(routeColors, "PY") && hasPigmentPrefix(routeColors, "PR")) score -= 10;
      else if (hasPigmentPrefix(routeColors, "PY") && hasPigmentPrefix(routeColors, "PO")) score -= 8;
    } else if (label.includes("gray") || label.includes("neutral") || label.includes("brown")) {
      if (colors.some((c) => c.family === "earth") && hasPigmentPrefix(colors, "PB")) {
        score -= 8;
      }
    }

    score -= mixStarBoost(colors);

    const tips = findMatchingMixTips(colors, { colors });
    const bestTip = tips[0];
    if (bestTip) {
      score -= bestTip.verified ? 18 : 10;
    }

    // Notes: tips always; short teaching notes only on 2-tube bases (triples: tip-only)
    const notes = [];
    if (bestTip?.result) {
      notes.push(bestTip.result);
    } else if (colors.length === 2 && routeColors.length === 2) {
      if (
        (label.includes("purple") || label.includes("violet")) &&
        hasPigmentPrefix(routeColors, "PV") &&
        hasPigmentPrefix(routeColors, "PB")
      ) {
        notes.push("Classic violet route: rose + blue.");
      }
      if (mudPenalty > 0) notes.push("May skew brown-gray on paper.");
    }

    return {
      mix,
      score,
      note: notes.join(" "),
      tip: bestTip || null,
      hueDist,
      mudPenalty,
    };
  }

  const FORMAT_PRIORITY = {
    "half-pan": 0,
    "full pan": 0,
    "2ml sample": 1,
    tube: 2,
    "tube-box": 3,
  };

  function formatPriority(c) {
    return FORMAT_PRIORITY[c.format] ?? 5;
  }

  /** One entry per paint for mixing — drops box duplicates & same-name/same-hex twins */
  function uniqueMixColors(colors) {
    const seen = new Map();
    for (const c of colors) {
      const key = `${(c.name_en || "").toLowerCase()}|${(c.hex || "").toLowerCase()}`;
      const existing = seen.get(key);
      if (!existing || formatPriority(c) < formatPriority(existing)) {
        seen.set(key, c);
      }
    }
    return [...seen.values()];
  }

  function comboKey(colors) {
    return colors
      .map((c) => c.id)
      .sort()
      .join("|");
  }

  function outcomeOk(scored, target, t) {
    if (!scored?.mix || !t) return false;
    if (t.maxS !== undefined && scored.mix.hsl.s > t.maxS + 8) return false;
    // Primary gate: actually near the hue (score can go very negative from ◈/tips)
    return scored.hueDist <= 42;
  }

  function pickTopDiverse(results, limit, maxPerColor = 3) {
    const out = [];
    const use = new Map();
    for (const r of results) {
      if (out.length >= limit) break;
      const ids = r.colors.map((c) => c.id);
      if (ids.some((id) => (use.get(id) || 0) >= maxPerColor)) continue;
      out.push(r);
      ids.forEach((id) => use.set(id, (use.get(id) || 0) + 1));
    }
    return out;
  }

  /** Third tube that teaches a deliberate move: mute, texture, body, neutral */
  function isIntentionalModifier(third, pairColors) {
    const fam = (third.family || "").toLowerCase();
    if (fam === "earth" || fam === "brown" || fam === "neutral" || fam === "gray") {
      return true;
    }
    const name = third.name_en || "";
    // Muting / atmospheric names — not every "glow" or chromatic convenience color
    if (/tint|neutral|umber|sienna|ochre|sepia|grey|gray|black|white|buff|ivory/i.test(name)) {
      return true;
    }
    if (/\bmist\b/i.test(name) && fam !== "blue" && fam !== "purple" && fam !== "violet") {
      return true;
    }
    const hsl = hexToHsl(third.hex);
    if (hsl.s < 22) return true;
    if (third.transparency === 3) return true;
    // Texture only when pair is fully smooth and third is earthy / low-chroma granulation
    if (third.granulating && pairColors.every((c) => !c.granulating)) {
      if (fam === "earth" || fam === "brown" || fam === "neutral" || hsl.s < 20) {
        return true;
      }
    }
    return false;
  }

  function dedupeByComboKey(list) {
    const map = new Map();
    for (const r of list) {
      const key = comboKey(r.colors);
      const prev = map.get(key);
      if (!prev || r.score < prev.score) map.set(key, r);
    }
    return [...map.values()];
  }

  /** Higher = more inspiring / unusual (for creative triple lane) */
  function creativeIntrigue(colors, scored) {
    let intrigue = 0;
    const fams = new Set(colors.map((c) => c.family || "other"));
    intrigue += fams.size * 6;
    const brands = new Set(colors.map((c) => c.brand || ""));
    intrigue += brands.size * 2;
    const gran = colors.filter((c) => c.granulating).length;
    if (gran === 1 || gran === 2) intrigue += 6;
    const toks = new Set(colors.flatMap((c) => pigmentTokens(c)));
    intrigue += Math.min(toks.size, 6) * 2;
    if (colors.some((c) => c.transparency === 1) && colors.some((c) => c.transparency === 3)) {
      intrigue += 5;
    }
    if (colors.some((c) => c.mix_star) && colors.some((c) => !c.mix_star)) intrigue += 3;
    if (colors.some((c) => c.staining) && colors.some((c) => !c.staining)) intrigue += 3;
    // Prefer hits that still feel chromatic when target allows
    if (scored.mix.hsl.s > 25) intrigue += 4;
    if (scored.mudPenalty > 0) intrigue -= 8;
    return intrigue;
  }

  /**
   * Learning layout for Find a hue:
   *  6 base pairs · 2 intentional 3-tube variations · 2 creative triples
   * Triple notes only when a mix_tip matches exactly.
   */
  function findCombinations(palette, target) {
    const empty = { bases: [], variations: [], creative: [] };
    const t = parseHueInput(target);
    if (!t) return empty;

    const colors = uniqueMixColors(palette.colors || palette);
    const pairs = [];

    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const combo = [colors[i], colors[j]];
        const scored = scoreCombo(combo, target);
        if (!outcomeOk(scored, target, t)) continue;
        pairs.push({
          colors: combo,
          mix: scored.mix,
          score: scored.score,
          note: scored.note,
          tip: scored.tip,
          hueDist: scored.hueDist,
          lane: "base",
        });
      }
    }

    pairs.sort((a, b) => a.score - b.score || a.hueDist - b.hueDist);
    const bases = pickTopDiverse(pairs, 6, 3).map((r) => ({ ...r, lane: "base" }));
    const usedKeys = new Set(bases.map((r) => comboKey(r.colors)));

    // --- Variations: strong base + intentional third ---
    const seedPairs = pairs.slice(0, 14);
    const variationPool = [];
    for (const pair of seedPairs) {
      const pairIds = new Set(pair.colors.map((c) => c.id));
      for (const c of colors) {
        if (pairIds.has(c.id)) continue;
        if (!isIntentionalModifier(c, pair.colors)) continue;
        const combo = [...pair.colors, c];
        const key = comboKey(combo);
        if (usedKeys.has(key)) continue;
        const scored = scoreCombo(combo, target);
        if (!outcomeOk(scored, target, t)) continue;
        // Still near target after modifier (allow a little drift)
        if (scored.hueDist > 48) continue;
        variationPool.push({
          colors: combo,
          mix: scored.mix,
          score: scored.score,
          note: scored.tip ? scored.note : "",
          tip: scored.tip,
          hueDist: scored.hueDist,
          lane: "variation",
          intrigue: creativeIntrigue(combo, scored),
        });
      }
    }
    const variations = pickTopDiverse(
      dedupeByComboKey(variationPool).sort(
        (a, b) => a.score - b.score || b.intrigue - a.intrigue
      ),
      2,
      1
    );
    variations.forEach((r) => usedKeys.add(comboKey(r.colors)));

    // --- Creative triples: hit the hue, maximize intrigue ---
    const creativePool = [];
    const creativeSeeds = pairs.slice(0, 18);
    for (const pair of creativeSeeds) {
      const pairIds = new Set(pair.colors.map((c) => c.id));
      for (const c of colors) {
        if (pairIds.has(c.id)) continue;
        const combo = [...pair.colors, c];
        const key = comboKey(combo);
        if (usedKeys.has(key)) continue;
        const scored = scoreCombo(combo, target);
        if (!outcomeOk(scored, target, t)) continue;
        if (scored.hueDist > 38) continue;
        const intrigue = creativeIntrigue(combo, scored);
        // Skip dull "pair + inert" — need some spark
        if (intrigue < 12) continue;
        // Prefer not pure intentional-mute clones of the variation lane
        const modifierOnly = isIntentionalModifier(c, pair.colors) && intrigue < 20;
        creativePool.push({
          colors: combo,
          mix: scored.mix,
          score: scored.score,
          note: scored.tip ? scored.note : "",
          tip: scored.tip,
          hueDist: scored.hueDist,
          lane: "creative",
          intrigue,
          // Rank: hit quality + creativity (lower better)
          creativeRank: scored.hueDist * 2.2 - intrigue + scored.score * 0.15 + (modifierOnly ? 6 : 0),
        });
      }
    }
    const creative = pickTopDiverse(
      dedupeByComboKey(creativePool).sort(
        (a, b) => a.creativeRank - b.creativeRank || b.intrigue - a.intrigue
      ),
      2,
      1
    );

    return { bases, variations, creative };
  }

  function prioritizeMixStarResults(results, limit) {
    return (results || []).slice(0, limit);
  }

  const TRANSPARENCY_LABELS = ["", "Transparent", "Semi-transparent", "Opaque"];
  const LIGHTFAST_LABELS = ["", "Excellent (I)", "Very good (II)", "Fair (III)", "Poor (IV)"];

  function hexToHsl(hex) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsl(r, g, b);
  }

  /** Sort colors rainbow order: red → orange → yellow → green → blue → purple; neutrals last */
  function sortBySpectrum(colors) {
    return [...colors].sort((a, b) => {
      const ka = spectrumSortKey(a.hex);
      const kb = spectrumSortKey(b.hex);
      if (ka !== kb) return ka - kb;
      return (a.name_en || "").localeCompare(b.name_en || "");
    });
  }

  function spectrumSortKey(hex) {
    const { h, s, l } = hexToHsl(hex);
    if (s < 10) return 2000 + l;
    if (l < 8) return 1900 + h;
    if (l > 92) return 1800 + h;
    return h;
  }

  return {
    mixColors,
    findCombinations,
    findMatchingMixTips,
    prioritizeMixStarResults,
    parseHueInput,
    HUE_TARGETS,
    TRANSPARENCY_LABELS,
    LIGHTFAST_LABELS,
    hslToHueName,
    hexToHsl,
    sortBySpectrum,
  };
})();