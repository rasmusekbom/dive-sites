// One-off: download every upload referenced by the original site (src/original/used-imgs-base.json)
// at full resolution into .cache/orig-img, then normalise into src/img (max 2400px, jpg q85; png kept).
// src/original/images.json records original URL → local file name + alt text from the media library.
const fs = require('fs'), path = require('path');
const sharp = require('sharp');
const used = require('./src/original/used-imgs-base.json');
const media = require('./src/original/media.json');
const ORIG = path.join(__dirname, '.cache', 'orig-img'), OUT = path.join(__dirname, 'src', 'img');
fs.mkdirSync(ORIG, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
const MAP_FILE = path.join(__dirname, 'src', 'original', 'images.json');
const map = fs.existsSync(MAP_FILE) ? require(MAP_FILE) : {};
const slug = s => s.toLowerCase().replace(/\.[a-z]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

(async () => {
  const urls = Object.keys(used).filter(u => /\.(jpe?g|png|webp)$/i.test(u));
  for (const u of urls) {
    const m = media.find(x => x.url === u || x.url.replace(/-scaled(\.[a-z]+)$/i, '$1') === u);
    const src = m ? m.url : u;
    const orig = path.join(ORIG, path.basename(src));
    if (!fs.existsSync(orig)) {
      const r = await fetch(src, { headers: { 'user-agent': 'Mozilla/5.0' } });
      if (!r.ok) { console.log('FAIL', r.status, src); continue; }
      fs.writeFileSync(orig, Buffer.from(await r.arrayBuffer()));
    }
    const base = m && m.alt ? slug(m.alt) : slug(path.basename(u));
    const isPng = /\.png$/i.test(u);
    let name = (base || 'img') + (isPng ? '.png' : '.jpg');
    // keep names unique
    let n = 2; while (Object.entries(map).some(([k, v]) => v.file === name && k !== u)) name = base + '-' + n++ + (isPng ? '.png' : '.jpg');
    const dest = path.join(OUT, name);
    if (!fs.existsSync(dest)) {
      const img = sharp(orig, { failOn: 'none' }).rotate();
      const meta = await img.metadata();
      const w = Math.min(meta.width, 2400);
      if (isPng) await img.resize({ width: w, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(dest);
      else await img.resize({ width: w, withoutEnlargement: true }).jpeg({ quality: 85, mozjpeg: true }).toFile(dest);
    }
    map[u] = { url: u, file: name, alt: m ? m.alt : '', title: m ? m.title : '', pages: used[u], width: (await sharp(dest).metadata()).width };
    console.log(name, '←', path.basename(src));
  }
  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 1));
  console.log(Object.keys(map).length, 'images');
})();
