#!/usr/bin/env python3
"""Download Brands Story demo images for offline use."""
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BRANDS_PATH = ROOT / "data" / "brands.json"
OUT_DIR = ROOT / "images" / "brands"


def slug_from_url(url: str) -> str:
    name = url.rsplit("/", 1)[-1]
    name = re.sub(r"^330px-", "", name)
    name = re.sub(r"\.(jpg|jpeg|png|webp)$", "", name, flags=re.I)
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", name).strip("-").lower()
    return slug[:80] or "demo"


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "OurArtStudio/1.0 (offline cache)"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                dest.write_bytes(resp.read())
            return
        except urllib.error.HTTPError as err:
            if err.code == 429 and attempt < 4:
                wait = 8 * (attempt + 1)
                print(f"  Rate limited — waiting {wait}s…")
                time.sleep(wait)
                continue
            raise
        time.sleep(2)


def main() -> int:
    data = json.loads(BRANDS_PATH.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    url_to_local: dict[str, str] = {}
    downloaded = 0
    skipped = 0

    for brand in data.get("brands", []):
        for artist in brand.get("artists", []):
            for work in artist.get("works", []):
                url = work.get("image")
                if not url or not url.startswith("http"):
                    continue
                if url not in url_to_local:
                    slug = slug_from_url(url)
                    ext = ".jpg"
                    if ".png" in url.lower():
                        ext = ".png"
                    filename = f"{slug}{ext}"
                    dest = OUT_DIR / filename
                    if not dest.is_file():
                        print(f"Downloading {filename}…")
                        download(url, dest)
                        downloaded += 1
                        time.sleep(3)
                    else:
                        print(f"Exists {filename}")
                        skipped += 1
                    url_to_local[url] = f"images/brands/{filename}"
                work["image_local"] = url_to_local[url]

    BRANDS_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Done — {downloaded} downloaded, {skipped} already cached, {len(url_to_local)} unique images.")
    return 0


if __name__ == "__main__":
    sys.exit(main())