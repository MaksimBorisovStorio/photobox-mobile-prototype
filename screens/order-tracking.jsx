// screens/order-tracking.jsx — Figma M-App Foundations 2114:11296 "Order details - order confirmed"
//
// Reached from the order-placed screen's "Track your order" (and home's order-tracking
// banner). Teal hero with back + order number + arrival date → status stepper
// (2150:16853) → "Your order" items, shipping and price accordions → Get help / Reorder.
//
// Deviations from the node, deliberately:
//   - The photo book thumbnail is the customer's own cover (bpBook), drawn as a little
//     book, rather than the node's stock "Holiday 2026" render. The calendar keeps the
//     node's own image (ot-thumb-calendar.png).
//   - Order number, arrival date, name and prices follow the rest of the flow (MOCK,
//     euros) instead of the node's SPB… / 13 June / Emma Carter / £40.98.
//   - The two accordions open; the node only shows them closed, so their contents
//     (address lines, price breakdown) are additions.
//   - ?items=3 mirrors the order-placed screen's three-product demo.

const OT_A = '../shared/assets';
const OT_TEXT = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const OT_DISPLAY = '-apple-system, "SF Pro Display", system-ui, sans-serif';
const OT_TEAL = '#007F70';
const OT_INK = '#333';
const OT_GREY = '#777';
const OT_LINE = '#DDD';
const OT_PALE = '#F4F4F4';

// Stepper — node order. `done` steps are greyed with a check; one step is current.
const OT_STEPS = [
  { label: 'Awaiting payment', state: 'done' },
  { label: 'Order confirmed', sub: "We'll start printing soon", state: 'current' },
  { label: 'Being printed', state: 'next' },
  { label: 'Order dispatched', state: 'next' },
];

function OtChevron({ dir = 'down', color = OT_INK, size = 20 }) {
  const d = { down: 'M5 7.5l5 5 5-5', left: 'M12.5 4.5 7 10l5.5 5.5' }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );
}

function OtDot({ state }) {
  if (state === 'done') {
    return (
      <div style={{ width: 24, height: 24, borderRadius: 12, background: OT_TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
    );
  }
  // current: a 7px teal ring around white; next: a 2px grey ring
  return <div style={{ width: 24, height: 24, borderRadius: 12, boxSizing: 'border-box', background: '#fff',
    border: state === 'current' ? `7px solid ${OT_TEAL}` : '2px solid #CCC' }} />;
}

function OtStepper() {
  return (
    <div style={{ padding: '8px 16px 16px', position: 'relative' }}>
      {OT_STEPS.map((s, i) => {
        const last = i === OT_STEPS.length - 1;
        // The rail below a dot is teal while the step after it has been reached.
        const railTeal = OT_STEPS[i + 1] && OT_STEPS[i + 1].state !== 'next';
        return (
          <div key={s.label} style={{ display: 'flex', gap: 8, position: 'relative', padding: '8px 0', alignItems: s.sub ? 'flex-start' : 'center' }}>
            <div style={{ width: 24, flexShrink: 0, paddingTop: s.sub ? 3 : 0, position: 'relative', zIndex: 1 }}>
              <OtDot state={s.state} />
            </div>
            {!last && (
              <div style={{ position: 'absolute', left: 11, width: 2, top: s.sub ? 35 : 32, bottom: -10,
                background: railTeal ? OT_TEAL : '#CCC' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: OT_TEXT, fontSize: 16, lineHeight: '21px', letterSpacing: '-0.32px',
                fontWeight: s.state === 'current' ? 600 : 400,
                color: s.state === 'current' ? OT_TEAL : s.state === 'done' ? OT_GREY : OT_INK,
              }}>{s.label}</span>
              {s.sub && <span style={{ fontFamily: OT_TEXT, fontSize: 13, lineHeight: '18px', letterSpacing: '-0.08px', color: OT_INK }}>{s.sub}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// The customer's cover as a small closed book, on the node's grey 104×72 tile.
function OtBookThumb({ cover }) {
  return (
    <div style={{ width: 58, height: 63, position: 'relative', borderRadius: '1px 3px 3px 1px', overflow: 'hidden',
      boxShadow: '2px 2px 0 #E2DFD8, 0 4px 8px rgba(0,0,0,.18)' }}>
      <img src={cover} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px 4px 4px', fontFamily: OT_TEXT, fontWeight: 700,
        fontSize: 6, color: '#fff', background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.5))' }}>My photo book</div>
      <div style={{ position: 'absolute', left: 2, top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,.25)' }} />
    </div>
  );
}

function OtPrintThumb({ photo }) {
  return (
    <div style={{ width: 70, height: 54, background: '#1f2424', padding: 3, boxSizing: 'border-box', boxShadow: '0 4px 8px rgba(0,0,0,.18)' }}>
      <div style={{ width: '100%', height: '100%', background: '#fff', padding: 4, boxSizing: 'border-box' }}>
        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}

function OtAccordion({ title, sub, children, pad }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: `${pad}px 0`,
        cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: OT_TEXT, fontSize: 16, fontWeight: 600, lineHeight: '21px', letterSpacing: '-0.32px', color: OT_INK }}>{title}</span>
          <span style={{ fontFamily: OT_TEXT, fontSize: 15, lineHeight: '20px', letterSpacing: '-0.24px', color: OT_INK }}>{sub}</span>
        </div>
        <div style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 220ms ease' }}>
          <OtChevron />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 260ms ease' }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ paddingBottom: 12, fontFamily: OT_TEXT, fontSize: 15, lineHeight: '22px', color: '#555' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function OtPriceRow({ label, value, strong }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: strong ? 600 : 400, color: strong ? OT_INK : '#555' }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

function OtButton({ children, onClick, kind = 'light' }) {
  return (
    <button onClick={onClick} {...press(0.97)} style={pbButton(kind, { flex: 1,
      ...(kind === 'light' ? { background: '#fff', border: `1px solid ${PB_GREEN}`, color: PB_GREEN } : null) })}>{children}</button>
  );
}

function OrderTrackingScreen() {
  const { useMemo } = React;
  const data = useMemo(bpBook, []);
  const at = i => data.photos[i % data.photos.length];
  const M = window.MOCK || {};
  const order = M.order || { number: 'PB-2026-84732' };
  const user = M.user || { name: 'Iria Otero' };
  const multi = new URLSearchParams(location.search).get('items') === '3';
  const eur = n => `€${n.toFixed(2)}`;

  const items = [
    { title: 'Large Portrait Photo Book', thumb: <OtBookThumb cover={at(0)} />, price: 24.99 },
    ...(multi ? [
      { title: 'A3 Photo Calendar', thumb: <img src={`${OT_A}/ot-thumb-calendar.png`} alt="" style={{ width: 52, height: 72, objectFit: 'cover' }} />, price: 19.99 },
      { title: 'Framed Print', thumb: <OtPrintThumb photo={at(2)} />, price: 24.99 },
    ] : []),
  ];
  const subtotal = items.reduce((t, i) => t + i.price, 0);
  const delivery = 4.99;

  return (
    <div style={{ width: '100%', height: '100%', background: PB_PAPER, display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden' }}>
      {/* Hero — 2114:11297 */}
      <div style={{ background: OT_TEAL, flexShrink: 0 }}>
        <IOSStatusBar dark />
        <div style={{ padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <PbBackButton style={{ position: 'relative', left: 0, top: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, color: '#fff' }}>
            <span style={{ fontFamily: OT_TEXT, fontSize: 13, fontWeight: 600, lineHeight: '18px', letterSpacing: '-0.08px', opacity: 0.85 }}>
              Order {order.number}
            </span>
            <span style={{ fontFamily: OT_DISPLAY, fontSize: 22, fontWeight: 700, lineHeight: '28px', letterSpacing: '0.35px' }}>
              Arriving by Wednesday 2 Sep
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollbarWidth: 'none' }}>
        <OtStepper />
        <div style={{ height: 8, background: OT_PALE }} />

        {/* Your order — 2114:11338 */}
        <div style={{ padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', color: OT_INK }}>
            <span style={{ flex: 1, fontFamily: OT_DISPLAY, fontSize: 20, fontWeight: 600, lineHeight: '24px', letterSpacing: '0.38px' }}>Your order</span>
            <span style={{ fontFamily: OT_TEXT, fontSize: 13, lineHeight: '18px', letterSpacing: '-0.08px' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, paddingBottom: 8, overflowX: 'auto', scrollbarWidth: 'none', margin: '0 -16px', padding: '0 8px 8px' }}>
            {items.map(it => (
              <div key={it.title} style={{ width: 120, flexShrink: 0, padding: '0 8px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 104, height: 72, background: OT_PALE, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {it.thumb}
                </div>
                <span style={{ fontFamily: OT_TEXT, fontSize: 13, lineHeight: '18px', letterSpacing: '-0.08px', color: OT_INK }}>{it.title}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: OT_LINE }} />
          <OtAccordion pad={8} title={`Shipping to ${user.name}`} sub="14 Bridgewater Road, Manchester">
            {user.name}<br />14 Bridgewater Road<br />Manchester M1 4BT<br />United Kingdom<br />
            <span style={{ color: OT_GREY }}>Standard delivery · tracked</span>
          </OtAccordion>
          <div style={{ height: 1, background: OT_LINE }} />
          <OtAccordion pad={12} title={`Total ${eur(subtotal + delivery)}`} sub="Price details">
            {items.map(it => <OtPriceRow key={it.title} label={it.title} value={eur(it.price)} />)}
            <OtPriceRow label="Delivery" value={eur(delivery)} />
            <div style={{ height: 1, background: OT_LINE, margin: '8px 0' }} />
            <OtPriceRow strong label="Total" value={eur(subtotal + delivery)} />
          </OtAccordion>
        </div>
      </div>

      {/* Action bar — 2114:12292 */}
      <div style={{ flexShrink: 0, display: 'flex', gap: 12, padding: `16px 16px calc(16px + env(safe-area-inset-bottom, 0px))`,
        borderTop: `1px solid ${OT_LINE}`, background: '#fff' }}>
        <OtButton>Get help</OtButton>
        <OtButton kind="primary" onClick={() => window.navigation.push('product-photobook.html')}>Reorder</OtButton>
      </div>
    </div>
  );
}
