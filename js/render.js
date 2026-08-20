/**
 * Palette + kit switcher DOM. Wired from app.js (openDetail, kit membership).
 * Does not own live state — receives data / hooks.
 */
const StudioRender = (() => {
  const $ = (sel) => document.querySelector(sel);

  let hooks = {
    onOpen: () => {},
    isInKit: () => false,
    brandLine: (c) => c.brand || "",
    swatchMarks: () => "",
    escapeHtml: (str) => {
      const d = document.createElement("div");
      d.textContent = str == null ? "" : String(str);
      return d.innerHTML;
    },
  };

  function configure(next) {
    hooks = { ...hooks, ...next };
  }

  function esc(str) {
    return hooks.escapeHtml(str);
  }

  function buildColorCard(group, { showListMarkers = true } = {}) {
    const c = group.primary || group;
    const variants = group.variants || [c];
    const wrap = document.createElement("div");
    wrap.className = "color-card-wrap";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-card";
    btn.dataset.colorId = c.id;
    const swatchMarks = hooks.swatchMarks(c);
    const inKit = variants.some((v) => hooks.isInKit(v.id));
    const markerHtml =
      showListMarkers && inKit ? `<p class="brand-tag card-marker">★ kit</p>` : "";
    btn.innerHTML = `
    <div class="swatch" style="background:${c.hex}">${swatchMarks}</div>
    <div class="color-card-meta">
      <p class="name-en">${esc(c.name_en)}</p>
      <p class="name-zh">${esc(c.name_zh || "")}</p>
      <p class="brand-tag">${esc(hooks.brandLine(c, variants))}</p>
      ${markerHtml}
    </div>
  `;
    btn.addEventListener("click", () => hooks.onOpen(c));
    wrap.appendChild(btn);
    return wrap;
  }

  function colorGrid(container, groups, options = {}) {
    if (!container) return;
    container.innerHTML = "";
    if (!groups.length) {
      container.innerHTML = `<p class="empty-state">${esc(options.emptyMessage || "No colors yet.")}</p>`;
      return;
    }
    groups.forEach((group) => {
      container.appendChild(
        buildColorCard(group, {
          showListMarkers: options.showListMarkers,
        })
      );
    });
  }

  function kitSwitcherButton(kit, filledCount) {
    const btn = $("#kit-switcher-btn");
    if (!btn) return;
    if (!kit) {
      btn.textContent = "Select kit";
      return;
    }
    const n = filledCount;
    btn.textContent = `${kit.name} · ${n} pan${n === 1 ? "" : "s"}`;
  }

  function kitSwitcherPanel({ kits, activeKitId, filledCount, onSelect }) {
    const panel = $("#kit-switcher-panel");
    if (!panel) return;
    panel.innerHTML = "";
    if (!kits.length) {
      panel.innerHTML = `<p class="empty-state" style="margin:8px;padding:4px">No kits yet.</p>`;
      return;
    }
    kits.forEach((kit) => {
      const n = filledCount(kit);
      const active = kit.id === activeKitId;
      const opt = document.createElement("button");
      opt.type = "button";
      opt.setAttribute("role", "option");
      opt.setAttribute("aria-selected", String(active));
      opt.className = "kit-switcher-option" + (active ? " is-active" : "");
      opt.innerHTML = `
      <span class="kit-switcher-option-name">${esc(kit.name)}</span>
      <span class="kit-switcher-option-meta">${n} pan${n === 1 ? "" : "s"}</span>
      ${active ? `<span class="kit-switcher-check" aria-hidden="true">✓</span>` : ""}`;
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelect(kit.id);
      });
      panel.appendChild(opt);
    });
  }

  function kitWorkspace(hasKit) {
    const workspace = $("#kit-workspace");
    const empty = $("#kit-empty-state");
    if (!workspace || !empty) return;
    if (!hasKit) {
      workspace.hidden = true;
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    workspace.hidden = false;
  }

  return {
    configure,
    buildColorCard,
    colorGrid,
    kitSwitcherButton,
    kitSwitcherPanel,
    kitWorkspace,
  };
})();
