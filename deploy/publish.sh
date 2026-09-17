#!/bin/bash
# Build every project as a noindex demo and push the result to the gh-pages branch (GitHub Pages, branch source).
# Usage: ./deploy/publish.sh            (from the repo root; needs a clean checkout of main)
# Once the gh token has the `workflow` scope (`gh auth refresh -s workflow`), move deploy/pages.yml to
# .github/workflows/ and this script becomes unnecessary.
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"
export MSYS_NO_PATHCONV=1
OUT=$PWD/.publish; rm -rf "$OUT"; mkdir -p "$OUT"
for p in */; do
  [ "$p" = ".publish/" ] && continue
  p=${p%/}
  [ -f "$p/build.js" ] || continue
  echo "== $p"
  # build straight into the publish dir – dist/ (what `npm run serve` shows) is left untouched
  (cd "$p" && npm install --no-audit --no-fund --silent && DIST="$OUT/$p" BASE="/dive-sites/$p" DEMO=1 npm run build)
done
{ printf '<!doctype html><meta charset="utf-8"><title>dive-sites demos</title><ul>'; for d in "$OUT"/*/; do d=$(basename "$d"); printf '<li><a href="%s/">%s</a></li>' "$d" "$d"; done; printf '</ul>'; } > "$OUT/index.html"
touch "$OUT/.nojekyll"
ROOT=$PWD
(cd "$OUT" && git init -q -b gh-pages && git -c core.autocrlf=false add -A && git -c user.name="deploy" -c user.email="deploy@local" commit -q -m "Publish demos $(date -u +%Y-%m-%dT%H:%MZ)")
# push with the main checkout's credentials (repo-local credential helper)
git fetch -q "$(cygpath -m "$OUT" 2>/dev/null || echo "$OUT")" gh-pages && git push -f origin FETCH_HEAD:refs/heads/gh-pages
rm -rf "$OUT"
echo "published → https://rasmusekbom.github.io/dive-sites/"
