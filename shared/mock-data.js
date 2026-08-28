// shared/mock-data.js
(function () {
  const p = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

  window.MOCK = {
    // Name and email are the Figma account node's own copy (451:14042/14044).
    // `firstName` is what the welcome headline shows — it is a 38px display line and
    // the node sets it `nowrap`, so a full name would overflow the 350 column.
    user: {
      name: 'Iria Otero',
      firstName: 'Iria',
      email: 'iria.otero@albelli.com',
      avatar: p('portrait42', 80, 80),
      memberSince: '2024',
    },

    categories: [
      { id: 'photobooks', label: 'Photo Books', icon: '📖', from: '€14.99' },
      { id: 'prints',     label: 'Prints',      icon: '🖼️', from: '€0.99' },
      { id: 'walldecor', label: 'Wall Decor',   icon: '🏠', from: '€19.99' },
      { id: 'calendars', label: 'Calendars',    icon: '📅', from: '€12.99' },
      { id: 'mugs',      label: 'Mugs',         icon: '☕', from: '€9.99'  },
      { id: 'cards',     label: 'Cards',        icon: '💌', from: '€1.99'  },
    ],

    featuredProjects: [
      { id: 'pb1', title: 'Canada Trip', subtitle: '32 pages · Softcover', thumb: p('canada1', 400, 300), type: 'photobook' },
      { id: 'pb2', title: 'Italy 2025',  subtitle: '24 pages · Hardcover', thumb: p('italy2',  400, 300), type: 'photobook' },
    ],

    memories: [
      { id: 'm1', title: 'Canada',  thumb: p('canada2', 300, 400), count: 47 },
      { id: 'm2', title: 'Italy',   thumb: p('italy3',  300, 400), count: 83 },
      { id: 'm3', title: 'London',  thumb: p('london1', 300, 400), count: 31 },
      { id: 'm4', title: 'Skiing',  thumb: p('snow1',   300, 400), count: 62 },
    ],

    photobook: {
      coverTypes: [
        { id: 'softcover', label: 'Softcover',     price: '€14.99', thumb: p('book-soft', 200, 260), popular: false },
        { id: 'hardcover', label: 'Hardcover',     price: '€19.99', thumb: p('book-hard', 200, 260), popular: true  },
        { id: 'layflat',   label: 'Lay-flat',      price: '€24.99', thumb: p('book-lay',  200, 260), popular: false },
        { id: 'premium',   label: 'Premium Linen', price: '€29.99', thumb: p('book-prem', 200, 260), popular: false },
      ],
      formats: [
        { id: 'square-sm',  label: 'Square S',   size: '15×15 cm', thumb: p('fmt-sq-s', 140, 140) },
        { id: 'square-lg',  label: 'Square L',   size: '20×20 cm', thumb: p('fmt-sq-l', 140, 140) },
        { id: 'portrait',   label: 'Portrait',   size: '15×20 cm', thumb: p('fmt-port', 140, 140) },
        { id: 'landscape',  label: 'Landscape',  size: '20×15 cm', thumb: p('fmt-land', 140, 140) },
        { id: 'a4',         label: 'A4',         size: '21×29 cm', thumb: p('fmt-a4',   140, 140) },
        { id: 'a3',         label: 'A3',         size: '30×42 cm', thumb: p('fmt-a3',   140, 140) },
      ],
      pageOptions: [
        { id: '24', label: '24 pages', priceAdd: '+€0.00' },
        { id: '36', label: '36 pages', priceAdd: '+€3.99' },
        { id: '48', label: '48 pages', priceAdd: '+€6.99' },
        { id: '60', label: '60 pages', priceAdd: '+€9.99' },
      ],
      paperOptions: [
        { id: 'gloss',  label: 'Gloss',  desc: 'Vibrant, shiny finish' },
        { id: 'matte',  label: 'Matte',  desc: 'Soft, non-reflective' },
        { id: 'lustre', label: 'Lustre', desc: 'Best of both worlds', recommended: true },
      ],
    },

    basket: {
      items: [
        {
          id: 'item1',
          type: 'Hardcover Photo Book',
          spec: 'Square L · 24 pages · Lustre paper',
          thumb: p('book-result', 80, 80),
          qty: 1,
          price: 24.99,
        },
      ],
      subtotal: 24.99,
      delivery: 4.99,
      total: 29.98,
    },

    order: {
      number: 'PB-2026-84732',
      estimatedDelivery: '29 Aug – 2 Sep 2026',
      items: 1,
      total: 29.98,
    },

    account: {
      // The stats strip on the account screen — Figma 451:14045. `w` is the node's
      // own per-column width; the strip is centred, so the three are not equal.
      stats: [
        { value: '18',    label: 'Books made',    w: 70 },
        { value: '1,255', label: 'Photos stored', w: 84 },
        { value: '2 yrs', label: 'Together',      w: 70 },
      ],
      // Kept for a future orders screen: the redesigned account page replaced its
      // inline order list with a "My orders" row, which has no destination yet.
      orders: [
        { id: 'ord1', title: 'Canada Photo Book', date: '12 Jul 2026', status: 'Delivered', thumb: p('order1', 60, 60) },
        { id: 'ord2', title: 'Italy Prints ×6',   date: '03 Jun 2026', status: 'Delivered', thumb: p('order2', 60, 60) },
      ],
    },
  };
})();
