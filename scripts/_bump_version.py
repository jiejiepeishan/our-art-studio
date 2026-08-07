"""One-shot version bump helper. Usage: python scripts/_bump_version.py 108 109"""
from pathlib import Path
import sys

old, new = sys.argv[1], sys.argv[2]
root = Path(__file__).resolve().parent.parent

# app.js
app = root / "js" / "app.js"
t = app.read_text(encoding="utf-8")
needle = f'const APP_VERSION = "{old}"'
repl = f'const APP_VERSION = "{new}"'
if needle not in t:
    raise SystemExit(f"APP_VERSION {old} not found")
app.write_text(t.replace(needle, repl, 1), encoding="utf-8", newline="\n")
print("ok app.js")

pairs_by_file = {
    "sw.js": [(f"our-art-studio-v{old}", f"our-art-studio-v{new}")],
    "index.html": [
        (f"oas-disable-sw-v{old}", f"oas-disable-sw-v{new}"),
        (f"?v={old}", f"?v={new}"),
        (f">v{old}</button>", f">v{new}</button>"),
    ],
    "reset.html": [
        (f"oas-disable-sw-v{old}", f"oas-disable-sw-v{new}"),
        (f"?v={old}", f"?v={new}"),
    ],
}

for rel, pairs in pairs_by_file.items():
    p = root / rel
    text = p.read_text(encoding="utf-8")
    for a, b in pairs:
        n = text.count(a)
        if n == 0:
            print(f"WARN missing {rel}: {a}")
        text = text.replace(a, b)
    p.write_text(text, encoding="utf-8", newline="\n")
    print("ok", rel)

print(f"bumped {old} -> {new}")
