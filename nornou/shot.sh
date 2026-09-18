#!/bin/bash
# Headless-Chrome screenshot of a built page: ./shot.sh <name> <path> [width] [height]   (server: npm run serve → :8767)
cd "$(dirname "$0")"
mkdir -p shots
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --user-data-dir=/tmp/nn-chrome --no-first-run --disable-gpu --hide-scrollbars --window-size=${3:-1280},${4:-2400} --virtual-time-budget=8000 --screenshot="$PWD/shots/$1.png" "http://127.0.0.1:8767$2" >/dev/null 2>&1
ls -la "shots/$1.png"
