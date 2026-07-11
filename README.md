# Our Art Studio

Personal watercolor palette PWA — portfolio, Mix Lab, brand stories, offline-friendly.

## Local

```bash
cd our-art-studio
bash scripts/serve.sh
```

Open http://127.0.0.1:8080 — hard refresh: **Cmd+Shift+R**.

Sync between devices needs `scripts/serve.sh` on your Mac (passphrase API).  
On a static public host, use **Export / Import** under More.

## Deploy (static)

This app is mostly static files (`index.html`, `css/`, `js/`, `data/`, `images/`, `icons/`).

### Fastest: Netlify Drop

1. Open [app.netlify.com/drop](https://app.netlify.com/drop) (free account if asked).
2. Drag the whole `our-art-studio` folder onto the page.
3. Copy the `*.netlify.app` URL → open on iPhone → Share → **Add to Home Screen**.

### GitHub Pages

```bash
git init
git add .
git commit -m "Our Art Studio live"
# create a repo on GitHub, then:
git remote add origin https://github.com/YOU/our-art-studio.git
git branch -M main
git push -u origin main
```

Then: repo **Settings → Pages → Deploy from branch `main` / root**.

## License & assets

- **Code** may be shared for learning.
- **Palette data, brand stories, demo images** are for this personal studio.  
  Do not scrape or redistribute artist work. Living painters’ images are not included; demos use public-domain cousins where labeled.

## Updates after live

Edit files locally → redeploy (Netlify: drag again or connect git; GitHub: push).  
Bump `CACHE` in `sw.js` and `?v=` on assets when you change JS/CSS so phones pick up the new build.
