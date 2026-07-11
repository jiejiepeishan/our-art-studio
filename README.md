# Our Art Studio

Personal watercolor palette PWA — portfolio, Mix Lab, brand stories, offline-friendly.

**License:** [MIT](./LICENSE) — free to use, copy, modify, and build your own studio from this code.

## Credits

- **Studio & palette:** LiShen  
- **Code collaboration:** built together with **[Grok](https://x.ai)** (xAI), aka **Ace** — architecture, Mix Lab, UI, palette tooling, and shipping help.

If you fork this project, a nod in your README is appreciated but not required by the MIT license.

## What this is

A **starter personal studio**, not a complete commercial color database. Ship your own tubes, notes, and stories. The included palette is one studio’s collection to learn from and replace.

## Local

```bash
cd our-art-studio
bash scripts/serve.sh
```

Open http://127.0.0.1:8080 — hard refresh: **Cmd+Shift+R**.

Device sync needs `scripts/serve.sh` on your Mac. On a static host, use **Export / Import** under More.

## Deploy

Static files only for the public site (`index.html`, `css/`, `js/`, `data/`, `images/`, `icons/`).

### Netlify Drop

1. Open [app.netlify.com/drop](https://app.netlify.com/drop)  
2. Drag this folder onto the page  
3. Open the `*.netlify.app` URL → Add to Home Screen on iPhone  

### GitHub Pages

Push this repo, then: **Settings → Pages → Deploy from branch `main` / root** (or `/docs` if you prefer).

## Updates

Edit locally → push (or re-drop on Netlify). Bump `CACHE` in `sw.js` and `?v=` query params when changing JS/CSS so phones pick up the new build.
