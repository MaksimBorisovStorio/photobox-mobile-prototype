// Photo data — self-hosted mock photographs.
// Generated programmatically so we have a wide date range to test the
// super-scroll scrubber against. ~480 photos across ~50 dates from
// late October 2024 through early July 2025.
//
// ⚠️ These used to be picsum.photos URLs. picsum went down and took every photo in
// the prototype with it — which also meant the "offline-capable PWA" was never true
// for photos. The set is now local, so it cannot break again and works offline.
//
// The pool is the design's own photographs, pulled from the Figma file's image fills
// (mock-01..25, in shared/assets/photos/) plus six of the collection-cover photos the
// repo already carries. Paths are relative and resolve identically from /image-picker/
// and from /screens/ — which matters, because the picker hands these strings to the
// editor through sessionStorage.pb_photos.
const MOCK_PHOTOS = [];
for (let i = 1; i <= 25; i++) {
  MOCK_PHOTOS.push(`../shared/assets/photos/mock-${String(i).padStart(2, '0')}.webp`);
}
[
  'pb-src-canada.jpg', 'pb-src-cappadocia.jpg', 'pb-src-etna.jpg',
  'pb-src-guadalupe.jpg', 'pb-src-italy.jpg', 'ob-album-photo.jpg',
].forEach(f => MOCK_PHOTOS.push(`../shared/assets/${f}`));

// Walk the pool by a stride coprime to its length: every photo is used once before
// any repeats, and consecutive slots are far apart in the list, so a screenful of the
// grid never shows the same picture twice.
const PHOTO_STRIDE = 7;
function photoFor(n) { return MOCK_PHOTOS[(n * PHOTO_STRIDE) % MOCK_PHOTOS.length]; }

// ⚠️ Only the third element (the aspect) is still read: it used to size the picsum
// request as well. The picker's tiles are always 1:1 and its aspect toggle switches
// between cover and contain, so `ar` is metadata only — nothing lays out from it.
const ASPECTS = [
  [ 600,  800, 3/4],  // portrait
  [ 800,  800, 1],    // square
  [ 800,  600, 4/3],  // landscape
  [ 600,  900, 2/3],  // tall portrait
  [1200,  600, 2],    // wide
  [1200,  800, 1.5],  // photo wide
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function fmt(y, m, d) {
  return `${String(d).padStart(2,'0')} ${MONTHS[m]} ${y}`;
}

// Mulberry32-ish deterministic PRNG so URLs don't change between reloads.
function rng(seed) {
  let x = seed | 0;
  return () => {
    x = (x + 0x6D2B79F5) | 0;
    let t = Math.imul(x ^ (x >>> 15), 1 | x);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

const KINDS = ['photo','photo','photo','photo','photo','photo','photo','photo','screenshot','duplicate','lowquality'];

// [year, month-0-indexed, day, count]
const DATE_PLAN = [
  [2024, 9, 24, 7], [2024, 9, 27, 11], [2024, 9, 30, 6],
  [2024, 10, 3, 9], [2024, 10, 9, 12], [2024, 10, 14, 7], [2024, 10, 19, 14], [2024, 10, 24, 8], [2024, 10, 28, 11],
  [2024, 11, 4, 10], [2024, 11, 9, 7], [2024, 11, 14, 13], [2024, 11, 18, 9], [2024, 11, 22, 6], [2024, 11, 28, 11],
  [2025, 0, 2, 8], [2025, 0, 8, 12], [2025, 0, 12, 9], [2025, 0, 17, 14], [2025, 0, 23, 6],
  [2025, 1, 3, 10], [2025, 1, 8, 13], [2025, 1, 15, 8], [2025, 1, 19, 14], [2025, 1, 26, 7],
  [2025, 2, 3, 10], [2025, 2, 8, 13], [2025, 2, 15, 8], [2025, 2, 19, 14], [2025, 2, 26, 7],
  // The Barcelona trip — densest stretch
  [2025, 3, 2, 8], [2025, 3, 3, 18], [2025, 3, 4, 14], [2025, 3, 5, 12], [2025, 3, 6, 10],
  [2025, 3, 12, 9], [2025, 3, 19, 11], [2025, 3, 25, 6],
  [2025, 4, 2, 13], [2025, 4, 9, 8], [2025, 4, 14, 11], [2025, 4, 21, 7], [2025, 4, 28, 9],
  [2025, 5, 4, 10], [2025, 5, 11, 6], [2025, 5, 18, 12], [2025, 5, 25, 8],
  [2025, 6, 1, 7], [2025, 6, 9, 10],
];

const PHOTOS = [];
let counter = 0;
DATE_PLAN.forEach(([y, m, d, count]) => {
  const dateStr = fmt(y, m, d);
  const r = rng(y * 10000 + m * 100 + d);
  for (let i = 0; i < count; i++) {
    counter++;
    const a = ASPECTS[Math.floor(r() * ASPECTS.length)];
    const k = KINDS[Math.floor(r() * KINDS.length)];
    PHOTOS.push({
      id: `p${counter}`,
      src: photoFor(counter),
      ar: a[2],
      date: dateStr,
      kind: k,
    });
  }
});

window.PHOTOS = PHOTOS;
