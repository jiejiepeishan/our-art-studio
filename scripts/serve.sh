#!/bin/bash
# Start Our Art Studio local server (restart if port 8080 is stuck)
cd "$(dirname "$0")/.." || exit 1
PORT=8080
kill "$(lsof -t -i :$PORT)" 2>/dev/null
sleep 1
echo "Serving Our Art Studio at http://127.0.0.1:$PORT"
echo "iPhone (same Wi-Fi): http://$(ipconfig getifaddr en0 2>/dev/null || echo 'YOUR_MAC_IP'):$PORT"
python3 "$(dirname "$0")/serve_with_sync.py" "$PORT"