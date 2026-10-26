// shared/trip-italy.js — the "Trip to Italy" album, grouped by topic (Figma "Get Ready App"
// 1195:14921). One source for the album page (memory-detail) and for the editor's
// auto-fill, which lays the book out group by group (see editor.jsx → autoFill).
window.PB_TRIP_ITALY = (function () {
  // width / height of every photo in album order (it-01…it-40), so the editor can lay a page
  // out around the photos' own proportions instead of cropping them
  var ratios = [0.667,0.667,1.000,1.500,0.667,0.667,0.667,0.667,1.500,1.500,0.667,0.667,1.500,0.667,1.500,1.500,1.500,0.667,1.500,0.667,0.667,0.667,0.667,1.500,1.500,1.500,1.000,1.500,1.500,0.667,1.500,1.500,1.500,1.500,0.667,1.500,1.500,0.667,0.667,0.667];
  var dir = '../shared/assets/photos/italy/';
  var cover = '../shared/assets/mem-tile-italy.jpg';
  var spec = [
    ['Getting ready', '12 Jul', 2],
    ['On the plane', '12 Jul', 5],
    ['On the road', '12 Jul', 3],
    ['Hotel & pool', '13 Jul', 8],
    ['Beach days', '14 Jul', 5],
    ['Old town', '16 Jul', 7],
    ['Golden hour', '18 Jul', 3],
    ['In the mountains', '20 Jul', 4],
    ['The waterfall', '21 Jul', 3],
  ];
  var n = 0;
  var groups = spec.map(function (g) {
    var photos = [], aspects = [];
    for (var i = 0; i < g[2]; i++) { n++; photos.push(dir + 'it-' + (n < 10 ? '0' : '') + n + '.jpg'); aspects.push(ratios[n - 1]); }
    return { title: g[0], date: g[1], photos: photos, aspects: aspects };
  });
  return { title: 'Trip to Italy', cover: cover, groups: groups };
})();
