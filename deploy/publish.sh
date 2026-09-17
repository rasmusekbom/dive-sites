#!/bin/bash
# Build every project as a noindex demo and push the result to the gh-pages branch (GitHub Pages, branch source).
# Usage: ./deploy/publish.sh            (from the repo root; needs a clean checkout of main)
# Once the gh token has the `workflow` scope (`gh auth refresh -s workflow`), move deploy/pages.yml to
# .github/workflows/ and this script becomes unnecessary.
set -euo pipefail
cd "$(dirname "$0")/.."
export MSYS_NO_PATHCONV=1
OUT=$(mktemp -d)
for p in */; do
  p=${p%/}
  [ -f "$p/build.js" ] || continue
  echo "== $p"
  (cd "$p" && npm install --no-audit --no-fund --silent && BASE="/dive-sites/$p" DEMO=1 npm run build)
  mkdir -p "$OUT/$p" && cp -r "$p/dist/." "$OUT/$p/"
done
{ printf '<!doctype html><meta charset="utf-8"><title>dive-sites demos</title><ul>'; for d in "$OUT"/*/; do d=$(basename "$d"); printf '<li><a href="%s/">%s</a></li>' "$d" "$d"; done; printf '</ul>'; } > "$OUT/index.html"
touch "$OUT/.nojekyll"
cd "$OUT" && git init -q -b gh-pages && git add -A && git -c user.name="deploy" -c user.email="deploy@local" commit -q -m "Publish demos $(date -u +%Y-%m-%dT%H:%MZ)"
git push -f "$(cd - >/dev/null && git remote get-url origin)" gh-pages:gh-pages
echo "published → https://rasmusekbom.github.io/dive-sites/"
