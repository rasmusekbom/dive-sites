// One-off: download the photos used on nornouspeedboat.com (Wix media ids in src/original/wix-images.json) at full
// resolution into .cache/orig-img, then normalise into src/img (max 2400px, jpg q85) under descriptive names.
// src/original/images.json records Wix id → local file + what the photo shows.
const fs = require('fs'), path = require('path');
const sharp = require('sharp');
const ids = require('./src/original/wix-images.json');
const ORIG = path.join(__dirname, '.cache', 'orig-img'), OUT = path.join(__dirname, 'src', 'img');
fs.mkdirSync(ORIG, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
// id prefix → file name (named after what the photo shows; all are the operator's own GoPro shots, watermarked)
const NAMES = {
  '0daba52d': 'snorkeller-rocky-islet.jpg', '1874af51': 'freediver-over-reef.jpg', '1a182323': 'coral-garden-fish.jpg', '1adb3f73': 'speedboat-guests-on-bow.jpg',
  '1cbd3c8f': 'speedboat-kai-bae-hut-bay.jpg', '1ea29759': 'sea-fan-coral.jpg', '22479d88': 'snorkellers-peace-sign.jpg', '252f2d78': 'anemone-clownfish.jpg',
  '25aab9a6': 'boy-snorkelling-float-ring.jpg', '27bcba4c': 'anemone-purple-tips.jpg', '3912c36c': 'couple-shallow-water-beach.jpg', '4f48f024': 'anemone-orange.jpg',
  '5086c5ca': 'snorkeller-diving-down.jpg', '551a39ff': 'snorkeller-life-jacket-island.jpg', '58d17bc2': 'boy-underwater-peace.jpg', '601d24dd': 'snorkellers-group-underwater.jpg',
  '60f22099': 'snorkellers-rescue-ring.jpg', '63e744ff': 'boy-with-sergeant-fish.jpg', '6cb22206': 'swimmer-above-fish-school.jpg', '8d1f2343': 'speedboat-bow-white-sand-beach.jpg',
  '928cafa0': 'speedboat-guests-jumping.jpg', '9c6fdac6': 'snorkeller-waving.jpg', 'a90fc47f': 'friends-beside-speedboat.jpg', 'a9749840': 'two-friends-beach.jpg',
  'af039114': 'starfish-on-coral.jpg', 'afe65a1d': 'snorkeller-over-coral-reef.jpg', 'd06992d6': 'two-women-shallow-water.jpg', 'd7b806b3': 'speedboat-guests-standing-bow.jpg',
  'dd39ddeb': 'reef-rocks-underwater.jpg', 'ef638f77': 'speedboat-stern-engines.jpg', 'f454aa7a': 'table-coral-reef.jpg', 'ff2aa560': 'snorkeller-couple-underwater.jpg',
};
(async () => {
  const map = {};
  for (const id of ids) {
    const orig = path.join(ORIG, id);
    if (!fs.existsSync(orig)) {
      const r = await fetch('https://static.wixstatic.com/media/' + id, { headers: { 'user-agent': 'Mozilla/5.0' } });
      if (!r.ok) { console.log('FAIL', r.status, id); continue; }
      fs.writeFileSync(orig, Buffer.from(await r.arrayBuffer()));
    }
    const name = NAMES[id.slice(7, 15)] || id.replace(/~mv2/, '');
    const dest = path.join(OUT, name);
    if (!fs.existsSync(dest)) await sharp(orig, { failOn: 'none' }).rotate().resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 85, mozjpeg: true }).toFile(dest);
    const m = await sharp(dest).metadata();
    map[id] = { url: 'https://static.wixstatic.com/media/' + id, file: name, width: m.width, height: m.height };
    console.log(name, '←', id);
  }
  fs.writeFileSync(path.join(__dirname, 'src', 'original', 'images.json'), JSON.stringify(map, null, 1));
  console.log(Object.keys(map).length, 'images');
})();
