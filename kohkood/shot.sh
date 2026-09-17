#!/bin/bash
# Headless-Chrome screenshot of a built page: ./shot.sh <name> <path> [width] [height]
cd "$(dirname "$0")"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --user-data-dir=/tmp/kk-chrome --no-first-run --disable-gpu --hide-scrollbars --window-size=${3:-1280},${4:-2400} --virtual-time-budget=8000 --screenshot="$PWD/shots/$1.png" "http://127.0.0.1:8765$2" >/dev/null 2>&1
ls -la "shots/$1.png"
