#!/usr/bin/env python3
"""Static file server + studio sync API for cross-device palette data."""
import json
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SYNC_DIR = ROOT / "data" / "sync"
KEY_RE = re.compile(r"^[a-f0-9]{64}$")


class StudioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        if args and str(args[0]).startswith("GET /api/"):
            return
        super().log_message(fmt, *args)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        path = self.path.split("?", 1)[0]
        if path in ("/", "/index.html", "/sw.js"):
            self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/studio-sync/health":
            self._json_response(200, {"ok": True, "sync": True})
            return
        if self.path.startswith("/api/studio-sync?"):
            key = self._query_key()
            if not key:
                self._json_response(400, {"error": "invalid key"})
                return
            path = SYNC_DIR / f"{key}.json"
            if not path.is_file():
                self._json_response(404, {"error": "not found"})
                return
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                self._json_response(500, {"error": "read failed"})
                return
            self._json_response(200, data)
            return
        super().do_GET()

    def do_POST(self):
        if self.path != "/api/studio-sync":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", 0))
        if length <= 0 or length > 2_000_000:
            self._json_response(400, {"error": "bad body"})
            return
        try:
            body = json.loads(self.rfile.read(length).decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self._json_response(400, {"error": "invalid json"})
            return
        key = body.get("key", "")
        bundle = body.get("bundle")
        if not KEY_RE.match(key) or not isinstance(bundle, dict):
            self._json_response(400, {"error": "invalid payload"})
            return
        SYNC_DIR.mkdir(parents=True, exist_ok=True)
        path = SYNC_DIR / f"{key}.json"
        try:
            path.write_text(json.dumps(bundle, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        except OSError:
            self._json_response(500, {"error": "write failed"})
            return
        self._json_response(200, {"ok": True, "updatedAt": bundle.get("updatedAt")})

    def _query_key(self):
        if "?" not in self.path:
            return None
        query = self.path.split("?", 1)[1]
        for part in query.split("&"):
            if part.startswith("key="):
                return part[4:][:64]
        return None

    def _json_response(self, code, obj):
        payload = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    SYNC_DIR.mkdir(parents=True, exist_ok=True)
    server = ThreadingHTTPServer(("0.0.0.0", port), StudioHandler)
    print(f"Serving Our Art Studio at http://127.0.0.1:{port}")
    print(f"Sync API: /api/studio-sync (passphrase-based)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()