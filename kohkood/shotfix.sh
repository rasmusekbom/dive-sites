#!/bin/bash
# Like shot.sh but caps vh-based heroes to a realistic viewport (900px desktop / 760px mobile) for full-page captures.
cd "$(dirname "$0")"
vh=${5:-900}
sed "s|</head>|<style>.hero{min-height:${vh}px!important}.page-hero{min-height:$((vh*62/100))px!important}.page-hero.short{min-height:$((vh*48/100))px!important}</style></head>|" "dist$2index.html" > "dist/_shot.html"
sed -i 's|href="/assets|href="/assets|g' dist/_shot.html
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --user-data-dir=/tmp/kk-chrome --no-first-run --disable-gpu --hide-scrollbars ${DSF:+--force-device-scale-factor=$DSF} --window-size=${3:-1280},${4:-2400} --virtual-time-budget=8000 --screenshot="$PWD/shots/$1.png" "http://127.0.0.1:8765/_shot.html" >/dev/null 2>&1
rm -f dist/_shot.html
ls -la "shots/$1.png"
