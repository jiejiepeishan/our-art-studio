# New colors — data draft (not applied, no teaching cards yet)

**Source:** `our-art-studio/new colors/` four photos (Holbein pans, Holbein+ERDE tubes, Schmincke 2ml listings, Akademie Icy swatch card).

**Rule:** this file is **catalog only** — ids, pigment, format, family, traps. Ace notes after you approve the roster.

Palette today: **248**. If we add all **22**, → **270**. You can cut the Icy twelve, the ERDE three, or both.

---

## What the four photos actually are

| Photo | What I see | Count |
|-------|------------|-------|
| `3 holbein half pan.jpg` | Holbein **HPN** half-pans | 3 |
| `1 holbein 3 schmincke.jpg` | Holbein **HWC 5ml** + Schmincke **Liquid Earth 5ml ×3** | 4 |
| `3 schmincke 2ml samples.jpg` | Shopping listing: Horadam **337** + Naturals **510** + Naturals **470** | 3 |
| `Schmincke icy series academy grade.jpg` | Your swatch card: **Akademie Aquarell Icy / 马卡龙** 907–918 | 12 |

---

## Traps (read these first)

1. **Icy 9xx ≠ Horadam Supergranulating 9xx.** Studio already has Horadam **916 Urban Yellow** (PY154). Akademie **916 Icy Red-brown** must use a different id (`sch-akad-916-…`).
2. **337 is Horadam Retro Cochineal Red (NR4:1)** — insect dye, lightfastness **2/5**. Teaching later: pretty, not heirloom.
3. **510 / 470 are Horadam Naturals** (2024 plant dyes: turmeric + indigo), not the usual Horadam PG/PB chart.
4. **ERDE 8850 / 8852 / 8854 are not Horadam watercolor.** Official: Schmincke **Liquid Earth** (series 18) — gum arabic, gouache-like, for drawing / underpainting. Parka’s tube read: chalk **PW18**, sanguine **PR102**, umber **PY43**.
5. **Holbein WG508 Melon Orange** is labeled **HWC watercolor 5ml**. Do **not** confuse with Holbein **gouache G508 Brilliant Orange**. English charts don’t list “Melon Orange”; pigment = **confirm from the tube**.
6. **Emerald Green Nova** is **PY3/PG7/PW6** (milky spring) — not viridian PG18 (your Sch 513).
7. **Peach Black is PBk1** (aniline black), not ivory/lamp. Holbein half-pan chart: OSI, ****.

---

## Proposed roster

### A. Holbein Artists’ Water Color

| id | name_en · zh | code | pigment | format | family | lf | notes |
|----|----------------|------|---------|--------|--------|----|-------|
| `hb-hp-542-bamboo-green` | Bamboo Green · 竹绿 | PN542 | **PG36** | half-pan | green | 1 | Same molecule as Helio. Single-pigment yellow-shade phthalo. |
| `hb-hp-544-emerald-green-nova` | Emerald Green Nova · 翡翠绿Nova | PN544 | **PY3/PG7/PW6** | half-pan | green | 2 | Holbein ** two stars. Milk + May recipe. Not PG18. |
| `hb-hp-611-peach-black` | Peach Black · 桃黑 | PN611 | **PBk1** | half-pan | neutral | 1 | Aniline black. Unique vs ivory/lamp. |
| `hb-tube-wg508-melon-orange` | Melon Orange · 蜜瓜橙 | WG508 | **confirm tube** | 5ml tube | orange | ? | HWC, not gouache G508. |

`brand_traits`: professional / artists (same as existing `hb-lavender`).

### B. Schmincke Horadam — 2ml samples

| id | name_en · zh | code | pigment | format | family | lf | notes |
|----|----------------|------|---------|--------|--------|----|-------|
| `sch-337-cochineal-red` | Cochineal Red · 胭脂虫红 | 337 | **NR4:1** | 2ml sample | red | 4 | Retro line. Transparent, non-granulating, semi-staining. **Fugitive-leaning.** |
| `sch-nat-510-dyers-green` | Dyers' Green · 染料绿 | 510 | **NY3/NB1** | 2ml sample | green | 3 | Naturals. Turmeric + indigo. Only mix in that line. |
| `sch-nat-470-indigofera` | Indigofera · 费拉靛青 | 470 | **NB1** | 2ml sample | blue | 3 | Naturals. Fermented indigo plant. Denim, not PB60 indigo. |

Lightfastness numbers follow our scale (1 = best). German ★★☆☆☆ → **4** for 337; Naturals ★★★ → **3**.

### C. Schmincke Liquid Earth (series 18) — 5ml

Not a watercolor “primary.” `family: earth` or **`specialty`**. Format: `tube` / `5ml`. `brand_traits`: specialty / drawing.

| id | name_en · zh | code | pigment | family |
|----|----------------|------|---------|--------|
| `sch-erde-8850-liquid-chalk` | Liquid Chalk · 液体白垩 | 18850 | **PW18** | specialty |
| `sch-erde-8854-liquid-sanguine` | Liquid Sanguine · 液体红赭 | 18854 | **PR102** | earth |
| `sch-erde-8852-liquid-umber` | Liquid Umber · 液体棕土 | 18852 | **PY43** *(Parka tube; confirm)* | earth |

Official Schmincke: vegan, German-mined earths, gum arabic, gouache-like, smearable when damp. Dual later vs burnt sienna / ochre / white — different *job* (ground / drawing), not a fourth sienna.

### D. Schmincke Akademie Aquarell — Icy / 马卡龙 (your card)

All **PW6 +** (pastel / milk). Student/academy, not Horadam. Ids prefix `sch-akad-` so they never collide with Horadam 9xx.

Pigments **from your handwritten card** (not guessed):

| id | # | name_en · zh | pigment | family |
|----|---|--------------|---------|--------|
| `sch-akad-907-icy-yellow` | 907 | Icy Yellow · 冰黄 | PW6/PY74 | yellow |
| `sch-akad-908-icy-orange` | 908 | Icy Orange · 冰橙 | PW6/PY74/PO43 | orange |
| `sch-akad-909-icy-red` | 909 | Icy Red · 冰红 | PW6/PR112 | red |
| `sch-akad-910-icy-pink` | 910 | Icy Pink · 冰粉 | PW6/PR122 | pink |
| `sch-akad-911-icy-violet` | 911 | Icy Violet · 冰紫 | PW6/PB15:1/PV23 | purple |
| `sch-akad-912-icy-blue` | 912 | Icy Blue · 冰蓝 | PW6/PB15:1/PV23 | blue |
| `sch-akad-913-icy-turquoise` | 913 | Icy Turquoise · 冰松石 | PW6/PB15:3 | blue-green |
| `sch-akad-914-icy-blue-green` | 914 | Icy Blue-green · 冰蓝绿 | PW6/PG7 | green |
| `sch-akad-915-icy-green` | 915 | Icy Green · 冰绿 | PW6/PG36/PY74 | green |
| `sch-akad-916-icy-red-brown` | 916 | Icy Red-brown · 冰红棕 | PW6/PBr25 | earth |
| `sch-akad-917-icy-brown` | 917 | Icy Brown · 冰棕 | PW6/PBr25/PG36 | earth |
| `sch-akad-918-icy-grey` | 918 | Icy Grey · 冰灰 | PW6/PG36/PBr25/PBk7 | grey |

Card 912 also has a small **PV23** next to PB15:1 — same pair as 911; 912 may be the bluer mix. Flag if your pan disagrees.

`granulating`: false (white + organics). `staining`: phthalo halves true for 913–915. `toxicity`: low. `mix_star`: false (pastel set, not engines).

---

## Kit-logic preview (not Dual essays)

| Seat already in studio | New cousin | Keep how many |
|------------------------|------------|----------------|
| Helio PG36 | Bamboo Green PG36 | **one** yellow-shade phthalo |
| May PG7+PY3 | Emerald Green Nova (+white) | dessert / illustration, not a fourth May |
| Ivory / lamp / Payne’s | Peach Black PBk1 | **optional** unique black |
| Pyrrol / PO73 oranges | Melon Orange | after pigment confirm |
| Quin / madder reds | Cochineal NR4 | sample / history, not a lightfast seat |
| PB60 / phthalo indigo | Indigofera NB1 | plant indigo — different soul |
| Phthalo+yellow sap | Dyers' Green NY3+NB1 | plant mix — later Dual vs May/Sap |
| Burnt sienna / ochre | Liquid Earth trio | drawing/underpaint, not extra landscape wells |
| Mint / milky PG7 | whole Icy set | **one pastel set** or skip if you don’t paint macaron |

---

## What I want from you

- **Add all 22** / **skip Icy 12** / **skip ERDE 3** / **only Holbein + Naturals + 337**
- Melon Orange: photo of the pigment line on the tube if you have it
- 337: you did buy the 2ml (listing ×2) — yes/no
- Icy 912: blue-only or also violet grit like 911?

When the roster is locked → I write teaching cards in slices (Holbein / Naturals+337 / ERDE / Icy), not 22 in one night.

No palette.json changes until you say **apply new colors data**.
