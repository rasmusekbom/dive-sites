// Responsive image pipeline: src/img/*.jpg → .cache/img/<name>-<w>.webp + <name>-<w>.jpg (fallback),
// and src/img-manifest.json with the widths that exist per image. build.js copies .cache/img → dist/img
// and uses the manifest to emit srcset/sizes/width/height. Re-runs only when the source file changed.
const fs = require('fs'), path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, 'src', 'img');
const CACHE = path.join(__dirname, '.cache', 'img');
const MANIFEST = path.join(__dirname, 'src', 'img-manifest.json');
const WIDTHS = [480, 800, 1200, 1800];
const FALLBACK_W = 1200;

async function run() {
  fs.mkdirSync(CACHE, { recursive: true });
  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
  const isPhoto = f => /\.(jpe?g|png)$/i.test(f) && !/^logo/i.test(f);
  const files = fs.readdirSync(SRC).filter(isPhoto);
  let made = 0;
  for (const file of files) {
    const name = file.replace(/\.[^.]+$/, '');
    const stat = fs.statSync(path.join(SRC, file));
    const entry = manifest[file];
    const upToDate = entry && entry.mtime === stat.mtimeMs && entry.widths.every(w => fs.existsSync(path.join(CACHE, `${name}-${w}.webp`)));
    if (upToDate) continue;
    const image = sharp(path.join(SRC, file));
    const meta = await image.metadata();
    const widths = WIDTHS.filter(w => w <= meta.width);
    if (!widths.includes(meta.width) && meta.width < 2000) widths.push(meta.width);
    for (const w of widths) {
      await image.clone().resize({ width: w }).webp({ quality: 74 }).toFile(path.join(CACHE, `${name}-${w}.webp`));
    }
    const fw = Math.min(FALLBACK_W, meta.width);
    await image.clone().resize({ width: fw }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(CACHE, `${name}-${fw}.jpg`));
    manifest[file] = { mtime: stat.mtimeMs, width: meta.width, height: meta.height, widths, fallback: fw };
    made++;
  }
  // logo and other non-photo assets are copied as-is
  for (const file of fs.readdirSync(SRC).filter(f => !isPhoto(f))) fs.copyFileSync(path.join(SRC, file), path.join(CACHE, file));
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
  console.log(`Images: ${files.length} sources, ${made} (re)generated → .cache/img`);
}

run().catch(e => { console.error(e); process.exit(1); });
