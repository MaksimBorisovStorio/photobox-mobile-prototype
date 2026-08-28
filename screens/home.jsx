// screens/home.jsx

function HomeScreen() {
  const [activeTab, setActiveTab] = React.useState('home');

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', background:'#F1F6F6' }}>
      {/* Scrollable content — passes under the floating tab bar */}
      <div style={{
        position: 'absolute',
        // inset 0, not stopped above the tab bar: the iOS-26 pill floats over the
        // content, and letting the page pass under it is what gives its glass
        // something to refract. The spacer at the end of the content keeps the last
        // section clear of it.
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        // Explicit stacking context: lets the wash sit at z-index -1 *inside* the
        // scroller, above its own background but below every in-flow section.
        isolation: 'isolate',
      }}>
        {/* Brand wash — Figma node 451:13863: 390×429 at the top, same stop list
            as splash/onboarding but centred on the top-left corner (6, 0), so the
            deep teal sits in the corner and fades away across and down the header.
            It lives INSIDE the scroller: as a child of the screen root it stayed
            pinned to the viewport and read as sticky. Absolute children of a
            scroll container scroll with its content (unlike position:fixed). */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: 429,
          background: 'radial-gradient(702.33% 98.14% at 1.54% 0%, var(--pb-wash-stops))',
          pointerEvents: 'none', zIndex: -1,
        }} />

        {/* Header — Figma node 451:13865. Container 451:13864 pads pt56/px20 and
            carries a backdrop-blur; the blur is skipped here because the only
            thing behind it is the smooth wash, where it is a no-op that would
            cost a stacking context. */}
        <div style={{
          position: 'relative',
          padding: '0 20px',
          paddingTop: 'max(56px, calc(env(safe-area-inset-top, 44px) + 12px))',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <PhotoboxLogo scale={2 / 3} />
          <GlassIconButton label="Notifications">
            <img src="../shared/assets/icon-notification.svg" alt=""
                 width={24} height={24} style={{ display: 'block' }} />
          </GlassIconButton>
        </div>

        {/* Promo banners — Figma node 451:13875 */}
        <BannerRow />

        {/* Order tracking + continue editing — Figma node 509:20175 */}
        <StatusBanners />

        {/* Create — Figma node 367:6068 */}
        <CreateSection />

        {/* Memories — Figma node 509:19080 */}
        <MemoriesSection />

        {/* Collections — Figma node 509:19224 */}
        <CollectionsSection />

        {/* Ideas — Figma node 509:20176 */}
        <IdeasSection />

        {/* Ask AI — Figma node 509:20290 */}
        <AskAISection />

        {/* Room for the floating tab bar, which the content scrolls under. */}
        <div style={{ height: `calc(8px + ${TAB_BAR_HEIGHT})` }} />
      </div>

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Promo banners — Figma node 451:13875 ("Frame 18")
// ─────────────────────────────────────────────────────────────
// Two 283×152 cards, gap 8, inside the page's 20px gutters — 574 wide against a
// 350 content width, so the row scrolls horizontally by design (the node's own
// frame is 350 wide with both children overflowing it).
//
// Card chrome is the recipe the empty placeholders already carried and is
// unchanged: r24, a 1px white rim, `0 4px 16px -1px rgba(0,77,74,0.1)` and the
// node's white radial fill at 90% opacity. Only the size grew (267×136 → 283×152)
// and the content arrived.
//
// ⚠️ The offsets below are the node's dev-mode values, which are measured from the
// padding box — inside the 1px rim — which is exactly what CSS absolute
// positioning uses on a bordered `position:relative` box. So `left:139` lands at
// 140 in frame coords and `left:-1 / bottom:-1` puts the strip flush with the
// card's outer edge. Do not "correct" these to the `get_metadata` numbers, which
// are measured from the frame's outer box and are each 1px larger.
const BANNER_FONT = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const BANNER_TEAL = 'var(--colour-foreground-fg-secondary, #007377)';

// Figma fills at 90% opacity; folded into the stops so the hairline border stays
// fully opaque.
const BANNER_FILL =
  'radial-gradient(92.88% 65.46% at 47.94% -27.94%,' +
  ' rgba(255,255,255,0.432) 0%, rgba(255,255,255,0.9) 100%)';

// The node's headline face is SF Pro Text **Heavy** — 800, not the 700 the rest of
// the page uses. (900 would be Black.)
const BANNER_HEAD = {
  margin: 0, fontFamily: BANNER_FONT, fontWeight: 800, fontSize: 17,
  lineHeight: '22px', letterSpacing: '-0.41px', color: BANNER_TEAL,
};
const BANNER_SUB = {
  margin: 0, fontFamily: BANNER_FONT, fontWeight: 400, fontSize: 13,
  lineHeight: '18px', letterSpacing: '-0.08px', color: BANNER_TEAL,
};

function BannerRow() {
  return (
    <div style={{
      position: 'relative',
      display: 'flex', gap: 8, alignItems: 'center',
      // overflow-x:auto forces overflow-y to compute to auto/hidden — it cannot
      // be visible — so the cards' shadow needs room *inside* the padding box
      // or it gets clipped at the bottom edge. 20px covers the shadow's reach
      // (offset 4 + blur 16 - spread 1); marginBottom drops to 4 to keep the
      // 24px gap to the Create section.
      padding: '24px 20px 20px', marginBottom: 4,
      overflowX: 'auto', overflowY: 'hidden',
      scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
    }}>
      {/* "Collect them all" — node 508:18140 */}
      <BannerCard>
        {/* Travel covers strip — node 508:18141. Flush with the card's bottom and
            both side edges, so the card's own r24 clips its corners. The artwork
            is cropped out of the fill's 1080×1080 source (band y 279→615) rather
            than taken from a node export: Figma flattens exports against the
            canvas, which baked an opaque grey background into the strip's
            transparent upper half. */}
        <div style={{ position: 'absolute', left: -1, bottom: -1, width: 283, height: 88 }}>
          <img
            src="../shared/assets/banner-collections.png"
            alt=""
            style={{
              display: 'block', width: '100%', height: '100%',
              // The node's `0 4px 4px rgba(0,0,0,0.25)` is a Figma drop shadow, so
              // it follows the artwork's alpha and shades under each book. A CSS
              // box-shadow would instead paint a dark band across the strip's
              // transparent upper half, so this has to be a filter.
              filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.25))',
              pointerEvents: 'none',
            }}
          />
        </div>
        {/* Copy — node 508:18142: 185 wide, centred in the card, and the two lines
            sit flush (the node has no gap between them). */}
        <div style={{
          position: 'absolute', top: 15, left: '50%', transform: 'translateX(-50%)',
          width: 185, display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
        }}>
          <p style={BANNER_HEAD}>Collect them all</p>
          <p style={BANNER_SUB}>Try photo book trip collections</p>
        </div>
      </BannerCard>

      {/* "Golden days, bound to last" — node 509:18239 */}
      <BannerCard>
        {/* Copy — node 509:18240: 150 wide at 19/31, gap 8. The headline wraps to
            two lines at that width; the subhead's break is the node's own. */}
        <div style={{
          position: 'absolute', top: 31, left: 19, width: 150,
          display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start',
        }}>
          <p style={BANNER_HEAD}>Golden days, bound to last</p>
          <p style={BANNER_SUB}>50% off<br />photo books</p>
        </div>
        {/* Product shot — node 509:18243: a 143×134 window at 139/17, flush with the
            card's right and bottom edges. The photo is drawn 112.54% tall and
            nudged up 0.3%, which crops the wrists off at the card's bottom edge. */}
        <div style={{
          position: 'absolute', top: 17, left: 139, width: 143, height: 134,
          overflow: 'hidden', pointerEvents: 'none',
        }}>
          <img
            src="../shared/assets/banner-photobook.png"
            alt=""
            style={{
              position: 'absolute', left: 0, top: '-0.3%',
              width: '100%', height: '112.54%', display: 'block',
            }}
          />
        </div>
      </BannerCard>
    </div>
  );
}

// Card shell — shared by nodes 508:18140 and 509:18239.
//
// The destination is an addition: neither node carries a link, but both banners
// promote photo books, so both open the product page. Easy to redirect per card if
// they should land somewhere else.
function BannerCard({ children }) {
  return (
    <button
      onClick={() => window.navigation.push('product-photobook.html')}
      {...press(0.97)}
      style={{
        flex: '0 0 auto', display: 'block', position: 'relative',
        width: 283, height: 152, borderRadius: 24, overflow: 'hidden',
        border: '1px solid #FFFFFF', padding: 0,
        boxShadow: '0px 4px 16px -1px rgba(0,77,74,0.1)',
        background: BANNER_FILL,
        cursor: 'pointer', transition: 'transform 140ms ease',
        WebkitTapHighlightColor: 'transparent', textAlign: 'left',
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Status banners — Figma node 509:20175 ("Frame 2414")
// ─────────────────────────────────────────────────────────────
// Two full-width rows stacked with an 8px gap: an order-tracking card (92 tall)
// and a continue-editing card (84 tall). Both are white/r20 with a 1px white rim
// and the page's card shadow, `padding: 12px 16px`, `flex` row with `gap: 20`.
// These replace the old hand-written "Your projects" list, which the new design
// drops.
//
// ⚠️ Every text line in the node is a **16px-tall box holding an 18 or 20px line**,
// vertically centred — that is what makes the blocks 34 and 36 tall rather than the
// 40 and 42 natural leading would give, and it is what lands the cards on the
// node's 92 and 84. `StatusLine` reproduces that box; do not simplify it to a bare
// <p> or both cards grow.
//
// ⚠️ The book thumbnails are **cropped to the mockup's own box**. Figma composites
// node exports against everything behind them, so the raw exports came back opaque
// white (fine — the card is white) but also caught the card's own r20 bottom-left
// corner as a faint teal arc. Cropping to the book box drops the artifact together
// with the baked shadow, which `filter: drop-shadow` puts back.
const HB_TEXT = 'var(--colour-foreground-fg-black, #333)';

// The mockups' boxes inside their 60×60 slots, straight from the node: the portrait
// book is centred and full-bleed vertically, the landscape one overhangs the slot on
// both sides (the node does not clip it, and neither does this).
const STATUS_CARDS = [
  {
    id: 'tracking',
    img: 'hb-track-book.jpg',
    book: { left: 7, top: 0, width: 46.765, height: 59.827 },
    line1: 'Photo book “Our travel”',
    line2: 'Arriving Thursday 13 June',
    // Not in the node — the order list on the account screen is the nearest thing
    // this prototype has to an order-tracking destination.
    href: 'account.html',
    steps: true,
  },
  {
    id: 'editing',
    img: 'hb-edit-book.jpg',
    book: { left: -3, top: 4, width: 67, height: 52 },
    line1: 'Continue editing',
    line2: 'Photo book “Wedding”',
    href: 'editor.html',
    trailingIcon: 'hb-icon-edit.svg',
  },
];

// Progress rail — node 509:20031. Four 16px step icons joined by three 2px rails.
// The icons carry their own state colour from Figma (teal for the three reached
// steps, #CCC for Home), and the last rail is the node's own half-done gradient.
const HB_STEPS = ['hb-step-select.svg', 'hb-step-book.svg', 'hb-step-delivery.svg', 'hb-step-home.svg'];
const HB_RAILS = [
  'var(--colour-foreground-fg-secondary, #007377)',
  'var(--colour-foreground-fg-secondary, #007377)',
  'linear-gradient(to right,' +
  ' var(--colour-foreground-fg-secondary, #007377) 0%,' +
  ' var(--colour-foreground-fg-grey, #CCC) 49.772%)',
];

function StatusBanners() {
  return (
    <div style={{
      // 24px to the Create section, matching the node's 480 → 504.
      padding: '0 20px', marginBottom: 24,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {STATUS_CARDS.map(c => (
        <button
          key={c.id}
          onClick={() => window.navigation.push(c.href)}
          {...press(0.97)}
          style={{
            display: 'flex', alignItems: 'center', gap: 20,
            width: '100%', padding: '12px 16px',
            background: 'var(--colour-foreground-fg-white, #FFFFFF)',
            borderRadius: 20, overflow: 'hidden', border: 'none',
            // The node's 1px white rim is an *inset* shadow, not a border: with
            // `padding: 12px 16px` a real border would add 2px to the auto height
            // and the cards would come out 94/86 instead of the node's 92/84.
            boxShadow: '0px 4px 16px -1px rgba(0,77,74,0.1),' +
                       ' inset 0 0 0 1px var(--colour-foreground-fg-white, #FFFFFF)',
            cursor: 'pointer', transition: 'transform 140ms ease',
            WebkitTapHighlightColor: 'transparent', textAlign: 'left',
          }}
        >
          {/* Book mockup — 60×60 slot, node 509:20018 / 509:19921 */}
          <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
            <img
              src={`../shared/assets/${c.img}`}
              alt=""
              style={{
                position: 'absolute', ...c.book, display: 'block',
                filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.18))',
              }}
            />
          </div>

          {/* Copy — nodes 509:20027 / 509:19930. `minWidth: 0` so the flex child can
              shrink below its content width instead of pushing the card wide. */}
          <div style={{
            flex: '1 0 0', minWidth: 0, position: 'relative',
            display: 'flex', flexDirection: 'column', gap: c.steps ? 10 : 4,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StatusLine size={13} weight={400} tracking="-0.08px" leading="18px">{c.line1}</StatusLine>
              <StatusLine size={15} weight={600} tracking="-0.24px" leading="20px">{c.line2}</StatusLine>
            </div>

            {c.steps && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 4, padding: '4px 0', width: '100%',
              }}>
                {HB_STEPS.map((s, i) => (
                  <React.Fragment key={s}>
                    {i > 0 && (
                      <div style={{
                        flex: '1 0 0', minWidth: 0, height: 2, borderRadius: 1,
                        background: HB_RAILS[i - 1],
                      }} />
                    )}
                    <img src={`../shared/assets/${s}`} alt=""
                         width={16} height={16}
                         style={{ display: 'block', flexShrink: 0 }} />
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {c.trailingIcon && (
            <img src={`../shared/assets/${c.trailingIcon}`} alt=""
                 width={24} height={24}
                 style={{ display: 'block', flexShrink: 0 }} />
          )}
        </button>
      ))}
    </div>
  );
}

// One line of card copy. The fixed 16px box with a taller line centred inside it is
// the node's own metric — see the note above.
function StatusLine({ size, weight, tracking, leading, children }) {
  return (
    <div style={{ height: 16, display: 'flex', alignItems: 'center' }}>
      <p style={{
        margin: 0, fontFamily: BANNER_FONT, fontSize: size, fontWeight: weight,
        lineHeight: leading, letterSpacing: tracking, color: HB_TEXT,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{children}</p>
    </div>
  );
}

// Create section — Figma node 367:6068 (title 378:6773 + grid 367:6472).
// Section: 350 wide inside the page's 20px gutters, py 16, 16px gap to the grid.
// Grid: 2 equal columns, 12px gaps → cards are (350-12)/2 = 169 wide at 390.
const CREATE_CARDS = [
  { id: 'photobooks', title: 'Photo books', from: '\u20AC 14,99', img: 'create-photo-books.png' },
  { id: 'walldecor',  title: 'Wall decor',  from: '\u20AC 14,99', img: 'create-wall-decor.png' },
  { id: 'calendars',  title: 'Calendars',   from: '\u20AC 14,99', img: 'create-calendars.png', inset: true },
  { id: 'prints',     title: 'Prints',      from: '\u20AC 14,99', img: 'create-prints.png' },
  { id: 'mugs',       title: 'Mugs',        from: '\u20AC 14,99', img: 'create-mugs.png' },
  // Figma reuses the calendars artwork for Gifts (both point at the same fill).
  { id: 'gifts',      title: 'Gifts',       from: '\u20AC 14,99', img: 'create-calendars.png', inset: true },
];

function CreateSection() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 16,
      // 24px to Memories, matching the node's 1297.21 → 1321.21. Every section from
      // the status banners down carries the same 24.
      padding: '16px 20px', marginBottom: 24, boxSizing: 'border-box',
    }}>
      <p style={{
        margin: 0, width: '100%',
        fontFamily: PB_DISPLAY, fontWeight: 700, fontSize: 24,
        lineHeight: '40px', letterSpacing: '-0.24px',
        color: 'var(--colour-foreground-fg-black, #333)',
      }}>
        Create
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 12,
      }}>
        {CREATE_CARDS.map(c => <CreateCard key={c.id} {...c} />)}
      </div>
    </div>
  );
}

// Card — Figma component 367:6422: white, r16, clipped; image box is a 171:165
// aspect strip, then a fixed 64px caption block padded 16 at the sides and bottom.
function CreateCard({ id, title, from, img, inset }) {
  // Only photo books has a destination in the prototype so far.
  const onOpen = () => {
    if (id === 'photobooks') window.navigation.push('product-photobook.html');
  };
  return (
    <button
      onClick={onOpen}
      onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      style={{
        background: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
        // Not in the Figma card component (367:6422) — its gaps render as flat
        // #F1F6F6 with no falloff at any edge. This is the same card shadow the
        // design uses on the top banners (404:6794) and the Ideas cards (367:6246).
        boxShadow: '0px 4px 16px -1px rgba(0,77,74,0.1)',
        border: 'none', padding: 0, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        transition: 'transform 140ms ease', textAlign: 'center',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* image — node 367:6386 */}
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '171 / 165',
        overflow: 'hidden', flexShrink: 0,
      }}>
        <img
          src={`../shared/assets/${img}`}
          alt=""
          style={inset
            // Figma places this fill at a sub-rect rather than filling the box.
            ? { position: 'absolute', left: '14.04%', top: '12.58%',
                width: '71.93%', height: '74.84%', display: 'block' }
            : { position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* caption — node 367:6408 */}
      <div style={{
        width: '100%', height: 64, boxSizing: 'border-box', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 16px 16px',
      }}>
        <p style={{
          margin: 0, width: '100%',
          fontFamily: PB_DISPLAY, fontWeight: 600, fontSize: 16,
          lineHeight: '20px', letterSpacing: '-0.16px',
          color: 'var(--colour-foreground-fg-black, #333)',
        }}>{title}</p>
        <p style={{
          margin: 0, width: '100%',
          fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
          fontSize: 13, lineHeight: '28px',
          color: 'var(--colour-foreground-fg-secondary, #007377)',
        }}>
          <span style={{ fontWeight: 510 }}>from </span>
          <span style={{ fontWeight: 700 }}>{from}</span>
        </p>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Section header — Figma nodes 509:20182 (Memories) / 509:20185 (Collections)
// ─────────────────────────────────────────────────────────────
// 40 tall, `gap: 16` between the title group and "See all". The title group is
// `gap: 4` so an optional 24px icon sits tight against the text. Title metrics are
// the page's existing section heading (Google Sans Flex Bold 24/40 −0.24, #333);
// "See all" is Medium 16/40 −0.16 in the brand teal.
function SectionHeader({ icon, title, seeAll }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        flex: '1 0 0', minWidth: 0,
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {icon && <img src={`../shared/assets/${icon}`} alt=""
                      width={24} height={24}
                      style={{ display: 'block', flexShrink: 0 }} />}
        <p style={{
          margin: 0, flex: '1 0 0', minWidth: 0,
          fontFamily: PB_DISPLAY, fontWeight: 700, fontSize: 24,
          lineHeight: '40px', letterSpacing: '-0.24px',
          color: 'var(--colour-foreground-fg-black, #333)',
        }}>{title}</p>
      </div>
      {seeAll && (
        <button
          onClick={() => window.navigation.push(seeAll)}
          {...press(0.97)}
          style={{
            border: 'none', background: 'none', padding: 0, flexShrink: 0,
            fontFamily: PB_DISPLAY, fontWeight: 500, fontSize: 16,
            lineHeight: '40px', letterSpacing: '-0.16px',
            color: 'var(--colour-foreground-fg-secondary, #007377)',
            whiteSpace: 'nowrap', cursor: 'pointer',
            transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
          }}
        >See all</button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Memories — Figma node 509:19080 (header 509:20182 + row 509:19082)
// ─────────────────────────────────────────────────────────────
// The row is the same eight "Smart Stories" covers the photo-sources screen shows,
// so it renders `CollectionCard` from shared/collections.jsx rather than a second
// copy. The old picsum carousel this replaces is gone.
//
// ⚠️ Deviation: the home node widens its first two covers to 229.58 while the rest
// stay 205.58. The shared card is 205.58 for all eight — one implementation beats
// two, and the row scrolls either way.
function MemoriesSection() {
  const open = () => window.navigation.push('photo-sources.html');
  return (
    <div style={{ padding: '0 20px', marginBottom: 24 }}>
      <SectionHeader icon="hb-icon-memories.svg" title="Memories" seeAll="photo-sources.html" />
      {/* 16px under the header, then the row bleeds to both screen edges so the
          covers run off-screen as they do in the node. */}
      <div style={{
        margin: '16px -20px 0', padding: '0 20px',
        display: 'flex', gap: 8, alignItems: 'center',
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {COLLECTIONS.map(c => <CollectionCard key={c.id} c={c} onOpen={open} />)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Collections — Figma node 509:19224 (header 509:20185 + row 509:19226)
// ─────────────────────────────────────────────────────────────
// Two 267×270 white cards, r24, gap 8 — 542 wide, so the row scrolls.
//
// ⚠️ "Trip books" reuses the same 1080² cover-template source as the promo banner,
// cropped by Figma to a two-row band. Here the node export was usable as-is (unlike
// the banner's): the card is solid white, so the background Figma bakes in matches
// exactly, and the r24 corner it also bakes lines up with the card's own clip. Only
// the 1px the artwork overhangs the card's bottom edge was trimmed off.
const HB_COLLECTIONS = [
  {
    id: 'trip',
    title: 'Trip books',
    titleTop: 26.93,
    // Full-bleed band pinned to the card's bottom edge — node 509:20321.
    band: { img: 'hb-trip-books.jpg', height: 194 },
  },
  {
    id: 'year',
    title: 'Year books',
    titleTop: 37,
    // A 227×222 window at 19/95 whose photo is drawn 116.34% tall and pulled up
    // 16.28%, so the book's foot is cropped by the card — node 509:20380.
    window: { img: 'hb-year-books.png', left: 19, top: 95, width: 227, height: 222,
              imgHeight: '116.34%', imgTop: '-16.28%' },
  },
];

function CollectionsSection() {
  return (
    <div style={{ padding: '0 20px', marginBottom: 24 }}>
      <SectionHeader title="Collections" seeAll="product-photobook.html" />
      <div style={{
        // 20px of bottom padding carries the card shadow's reach (offset 4 + blur
        // 16 − spread 1), which overflow-x would otherwise slice off; the negative
        // bottom margin takes it back out of the flow.
        margin: '16px -20px -20px', padding: '0 20px 20px',
        display: 'flex', gap: 8, alignItems: 'center',
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {HB_COLLECTIONS.map(c => (
          <button
            key={c.id}
            onClick={() => window.navigation.push('product-photobook.html')}
            {...press(0.97)}
            style={{
              flex: '0 0 auto', position: 'relative', display: 'block',
              width: 267, height: 270, borderRadius: 24, overflow: 'hidden',
              background: '#FFFFFF', border: 'none', padding: 0,
              // Not in the node — 509:19227/509:20378 are flat. This is the same
              // card shadow the design uses on the promo banners and Ideas cards;
              // without it these two read as holes in the page.
              boxShadow: '0px 4px 16px -1px rgba(0,77,74,0.1),' +
                         ' inset 0 0 0 1px #FFFFFF',
              cursor: 'pointer', transition: 'transform 140ms ease',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {c.band && (
              <img src={`../shared/assets/${c.band.img}`} alt=""
                   style={{
                     position: 'absolute', left: 0, bottom: 0,
                     width: '100%', height: c.band.height, display: 'block',
                     pointerEvents: 'none',
                   }} />
            )}
            {c.window && (
              <div style={{
                position: 'absolute',
                left: c.window.left, top: c.window.top,
                width: c.window.width, height: c.window.height,
                overflow: 'hidden', pointerEvents: 'none',
              }}>
                <img src={`../shared/assets/${c.window.img}`} alt=""
                     style={{
                       position: 'absolute', left: 0, top: c.window.imgTop,
                       width: '100%', height: c.window.imgHeight, display: 'block',
                     }} />
              </div>
            )}
            {/* Title — SF Pro Display Bold 28/34 +0.36, centred on a 185 box. */}
            <p style={{
              position: 'absolute', top: c.titleTop, left: '50%',
              transform: 'translateX(-50%)', width: 185, margin: 0,
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28,
              lineHeight: '34px', letterSpacing: '0.36px', textAlign: 'center',
              color: 'var(--colour-foreground-fg-secondary, #007377)',
            }}>{c.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// The brand teal wash, as Figma's own paint
// ─────────────────────────────────────────────────────────────
// The Ideas chip and the Ask-AI card share one 8-stop radial gradient whose ellipse
// is heavily elongated *and rotated* (the Ask-AI matrix works out to 192% × 673% at
// 65°). CSS radial-gradient cannot rotate, and sampling the node's render showed the
// un-rotated approximation puts the dark ridge on the wrong diagonal — so both use
// the inline SVG Figma itself emits, which carries the matrix verbatim.
//
// The last stop is transparent, so whatever is behind shows through at the edges.
// That is deliberate: on the node the page colour reads through the card's corners.
const PB_WASH_STOPS_SVG =
  "<stop stop-color='rgba(0,115,119,1)' offset='0'/>" +
  "<stop stop-color='rgba(0,142,147,0.89)' offset='0.12042'/>" +
  "<stop stop-color='rgba(18,150,155,0.833)' offset='0.15686'/>" +
  "<stop stop-color='rgba(36,158,162,0.77599)' offset='0.19331'/>" +
  "<stop stop-color='rgba(72,174,178,0.66198)' offset='0.26619'/>" +
  "<stop stop-color='rgba(144,206,208,0.43397)' offset='0.41195'/>" +
  "<stop stop-color='rgba(207,234,235,0.18805)' offset='0.59069'/>" +
  "<stop stop-color='rgba(255,255,255,0)' offset='1'/>";

const tealWash = (w, h, matrix) =>
  'url("data:image/svg+xml;utf8,' +
  `<svg viewBox='0 0 ${w} ${h}' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'>` +
  "<rect x='0' y='0' width='100%' height='100%' fill='url(%23g)'/><defs>" +
  `<radialGradient id='g' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(${matrix})'>` +
  PB_WASH_STOPS_SVG +
  '</radialGradient></defs></svg>")';

// ─────────────────────────────────────────────────────────────
// Ideas — Figma node 509:20176 (chips 509:20260, grid 509:20287, CTA 509:20369)
// ─────────────────────────────────────────────────────────────
// Header, then a `gap: 24` column: an audience chip row, a 2×2 product grid and a
// full-width "Show all" button.
//
// ⚠️ The four idea cards have **no artwork in the design** — 509:20179 and its three
// siblings are white cards whose image wells are empty, with only the caption filled
// in. They are built that way rather than inventing product shots; drop an `img` into
// the well above the caption once the design has them.
const IDEA_CHIPS = [
  { id: 'friend',   label: 'Best friend', icon: 'hb-chip-group.svg', active: true },
  { id: 'mum',      label: 'For mum',     icon: 'hb-chip-face.svg' },
  { id: 'birthday', label: 'Birthday',    icon: 'hb-chip-gift.svg' },
  // The node gives this one a 1px #CCC rim and no fill, which also makes it 42 tall
  // against its siblings' 40 — kept, since the row centres them anyway.
  { id: 'dad',      label: 'For dad',     icon: 'hb-chip-face.svg', outline: true },
];

const IDEA_CARDS = [
  { id: 'prints',   title: 'Favorite moments print set' },
  // The node breaks this one by hand rather than letting it wrap.
  { id: 'mug',      title: 'Inside-joke\nPhoto Mug' },
  { id: 'cushion',  title: 'Memory Collage Cushion' },
  { id: 'calendar', title: 'Friendship Calendar' },
];

function IdeasSection() {
  const [active, setActive] = React.useState('friend');
  return (
    <div style={{ padding: '0 20px', marginBottom: 24 }}>
      <SectionHeader title="Ideas" />

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Chip row — 485 wide against 350, so it scrolls and bleeds to both edges. */}
        <div style={{
          margin: '0 -20px', padding: '0 20px',
          display: 'flex', gap: 4, alignItems: 'center',
          overflowX: 'auto', overflowY: 'hidden',
          scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        }}>
          {IDEA_CHIPS.map(c => {
            const on = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                {...press(0.97)}
                style={{
                  flex: '0 0 auto', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 4,
                  padding: '8px 16px', borderRadius: 42,
                  background: on ? tealWash(139, 40, '31.787 9.0953 -226.2 617.58 30.171 24.223')
                                 : (c.outline ? 'transparent' : '#FFFFFF'),
                  border: c.outline
                    ? '1px solid var(--colour-borders-border-default, #CCC)'
                    : 'none',
                  cursor: 'pointer', transition: 'transform 140ms ease',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <img src={`../shared/assets/${c.icon}`} alt=""
                     width={24} height={24}
                     style={{
                       display: 'block', flexShrink: 0,
                       // The exported glyphs are dark; the selected chip's ground is
                       // deep teal, so invert to the node's white icon.
                       filter: on ? 'brightness(0) invert(1)' : 'none',
                     }} />
                <p style={{
                  margin: 0, whiteSpace: 'nowrap', fontFamily: BANNER_FONT,
                  ...(on
                    ? { fontSize: 15, fontWeight: 600, lineHeight: '20px',
                        letterSpacing: '-0.24px', color: '#FFFFFF' }
                    : { fontSize: 13, fontWeight: 400, lineHeight: '18px',
                        letterSpacing: '-0.08px',
                        color: 'var(--colour-foreground-fg-black, #333)' }),
                }}>{c.label}</p>
              </button>
            );
          })}
        </div>

        {/* 2×2 grid — 12px gaps, cards 223 tall. */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12,
        }}>
          {IDEA_CARDS.map(c => (
            <button
              key={c.id}
              onClick={() => window.navigation.push('product-photobook.html')}
              {...press(0.97)}
              style={{
                position: 'relative', display: 'block', height: 223,
                borderRadius: 16, overflow: 'hidden', background: '#FFFFFF',
                border: 'none', padding: 0,
                boxShadow: '0px 4px 16px -1px rgba(0,77,74,0.1),' +
                           ' inset 0 0 0 1px #FFFFFF',
                cursor: 'pointer', transition: 'transform 140ms ease',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Caption — node 509:20402: 84 tall, pinned to the card's bottom. */}
              <div style={{
                position: 'absolute', left: 0, bottom: 0, width: '100%', height: 84,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '0 16px 16px', textAlign: 'center',
              }}>
                <p style={{
                  margin: 0, width: '100%', whiteSpace: 'pre-line',
                  fontFamily: BANNER_FONT, fontSize: 15, fontWeight: 600,
                  lineHeight: '20px', letterSpacing: '-0.24px',
                  color: 'var(--colour-foreground-fg-black, #333)',
                }}>{c.title}</p>
                <p style={{
                  margin: 0, width: '100%', flex: '1 0 0',
                  fontFamily: BANNER_FONT, fontSize: 13, lineHeight: '28px',
                  color: 'var(--colour-foreground-fg-secondary, #007377)',
                }}>
                  <span style={{ fontWeight: 510 }}>from </span>
                  <span style={{ fontWeight: 700 }}>{'€ 14,99'}</span>
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* "Show all" — node 509:20369. Teachers Bold, the brand wordmark face. */}
        <button
          onClick={() => window.navigation.push('product-photobook.html')}
          {...press(0.97)}
          style={{
            width: '100%', height: 72, borderRadius: 55,
            background: 'var(--colour-foreground-fg-white, #FFFFFF)',
            border: 'none', padding: '0 24px',
            boxShadow: '0px 4px 16px -1px rgba(0,77,74,0.1)',
            fontFamily: '"Teachers", -apple-system, system-ui, sans-serif',
            fontWeight: 700, fontSize: 20, lineHeight: '32px',
            color: 'var(--colour-foreground-fg-secondary, #007377)',
            cursor: 'pointer', transition: 'transform 140ms ease',
            WebkitTapHighlightColor: 'transparent',
          }}
        >Show all</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Ask AI — Figma node 509:20290 ("Frame 2427")
// ─────────────────────────────────────────────────────────────
// A 393-tall r24 card carrying the teal wash, the brand sparkle, a display headline,
// three suggestion chips and a text field. Everything inside is absolutely placed on
// the node's own coordinates.
//
// The sparkle is the splash lockup's star at 52px — `PhotoboxStar` in brand.jsx
// renders the same five SVG layers, so no new artwork was added.
const ASKAI_SUGGESTIONS = ['Create photo book...', 'Build collage', 'Collect'];

function AskAISection() {
  return (
    <div style={{ padding: '0 20px', marginBottom: 24 }}>
      <div style={{
        position: 'relative', height: 393, borderRadius: 24, overflow: 'hidden',
        backgroundImage: tealWash(349, 393, '28.35 60.7 -239.6 111.9 175 173.93'),
      }}>
        {/* app_icon — node 509:20294: an 82×82 slot holding the 52×50 star. */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          top: 32.93, width: 82, height: 82,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          // The splash glow layers spread their bloom over ~82px, which reads too
          // diffuse here: sampled against the node, the ring at r≈20 came out
          // (98,186,188) against its (118,226,230) while r≥30 already matched. A
          // drop-shadow blooms from the glyph's own alpha, so it lifts exactly that
          // inner ring without touching the outer falloff. Tuned against the node:
          // mean deviation over r=20..60 drops to ~19/255.
          //
          // ⚠️ The residual is the glyph, not the glow — the node's app-icon star is
          // a slightly different drawing from the splash lockup's (measured solid
          // half-extents up/down/left/right: node 15/14/17/15, this 18/15/16/14).
          // Reusing the brand asset was preferred over shipping a ninth star SVG.
          filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.55))',
        }}>
          <PhotoboxStar width={52} glow />
        </div>

        <p style={{
          position: 'absolute', top: 153.93, left: '50%',
          transform: 'translateX(-50%)', width: 272, margin: 0,
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28,
          lineHeight: '34px', letterSpacing: '0.36px',
          color: '#FFFFFF', textAlign: 'center',
        }}>What you want to create today?</p>

        {/* Suggestions — node 509:20349. The node's row is wider than the card and
            its last chip is clipped; made scrollable so all three stay reachable. */}
        <div style={{
          position: 'absolute', top: 278.93, left: 16, right: 0,
          display: 'flex', gap: 4, alignItems: 'center',
          overflowX: 'auto', overflowY: 'hidden',
          scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        }}>
          {ASKAI_SUGGESTIONS.map(s => (
            <button key={s} {...press(0.97)} style={{
              flex: '0 0 auto', padding: '8px 16px', borderRadius: 42,
              background: 'var(--Extended-brand-colours-Secondary-500, #007377)',
              border: 'none', whiteSpace: 'nowrap',
              fontFamily: BANNER_FONT, fontSize: 13, fontWeight: 400,
              lineHeight: '18px', letterSpacing: '-0.08px', color: '#FFFFFF',
              cursor: 'pointer', transition: 'transform 140ms ease',
              WebkitTapHighlightColor: 'transparent',
            }}>{s}</button>
          ))}
        </div>

        {/* Field — node 509:20320. Inert: the prototype has no AI backend. */}
        <div style={{
          position: 'absolute', top: 321.93, left: 16, width: 317,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: 16, borderRadius: 39, background: '#FFFFFF', overflow: 'hidden',
        }}>
          <p style={{
            margin: 0, flex: '1 0 0', minWidth: 0,
            fontFamily: BANNER_FONT, fontSize: 15, fontStyle: 'italic',
            lineHeight: '20px', letterSpacing: '-0.24px',
            color: 'var(--colour-foreground-fg-grey, #CCC)',
          }}>Ask AI what you want</p>
          <img src="../shared/assets/hb-askai-add.svg" alt=""
               width={24} height={24} style={{ display: 'block', flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab bar — Figma node 509:19230 ("Tab Bar - iPhone")
// ─────────────────────────────────────────────────────────────
// The iOS-26 floating glass pill, not the old edge-to-edge bar: 16px above it, 25px
// below, 25px gutters, and a 50-tall pill carrying four tabs. Content scrolls
// *underneath* it, which is both the iOS 26 behaviour and the only way the glass has
// anything to refract — see the spacer at the end of HomeScreen's content.
//
// The node's BG is Apple's `LiquidGlassRegularSmall` (Light). There is no such
// component in this codebase and `backdrop-filter: url(#…)` — which every
// refraction-based glass library relies on — silently no-ops in WebKit, so the pill
// is layered by hand, the same way `GlassIconButton`'s `gloss` variant is. Two
// differences from that recipe, both because this glass sits on a *light* page
// rather than the near-black editor header:
//   • the interior needs a real white tint (0.55) — the header's near-clear 0.03
//     would be invisible here;
//   • the rim composites normally rather than with `plus-lighter`, which on a
//     near-white backdrop clips straight to white.
const TABS = [
  { id: 'home',     label: 'Home',     icon: 'hb-tab-home.svg' },
  // No projects screen exists; the editor holds the in-progress book, which is what
  // the "Continue editing" banner points at too.
  { id: 'projects', label: 'Projects', icon: 'hb-tab-projects.svg', href: 'editor.html' },
  { id: 'memories', label: 'Memories', icon: 'hb-tab-memories.svg', href: 'photo-sources.html' },
  { id: 'account',  label: 'Account',  icon: 'hb-tab-account.svg',  href: 'account.html' },
];

// 16 top + 50 pill + the bottom inset. The node's 25 is the home-indicator gap on a
// frame with no safe area, so it becomes the floor.
const TAB_BAR_PAD_BOTTOM = 'max(25px, calc(env(safe-area-inset-bottom, 0px) + 8px))';
const TAB_BAR_HEIGHT = `calc(66px + ${TAB_BAR_PAD_BOTTOM})`;

function TabBar({ activeTab, onTabChange }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: `16px 25px ${TAB_BAR_PAD_BOTTOM}`,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 50,
    }}>
      <div style={{
        flex: '1 0 0', minWidth: 0, height: 50, borderRadius: 25,
        position: 'relative', overflow: 'hidden', pointerEvents: 'auto',
        // Glass floats: without a drop shadow the pill reads as a hole in the page.
        boxShadow: '0 6px 20px rgba(0,77,74,0.16), 0 1px 3px rgba(0,0,0,0.08)',
      }}>
        {/* Blur + tint. saturate is kept low — the page behind is a pale teal wash
            and white cards, where a big boost tints the glass green. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          backdropFilter: 'blur(20px) saturate(130%)',
          WebkitBackdropFilter: 'blur(20px) saturate(130%)',
          background: 'rgba(255,255,255,0.55)',
        }} />
        {/* Lensed rim — inset shadows so the one layer follows the pill's radius. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.55),' +
                     ' inset 0 0 8px 1px rgba(255,255,255,0.45),' +
                     ' inset 0 0 20px -8px rgba(255,255,255,0.6)',
        }} />
        {/* Specular sweep, strong end on the bottom-left arc — the light direction
            the home header's glass was matched to. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          background: 'linear-gradient(35deg,' +
                      ' rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.16) 18%,' +
                      ' rgba(255,255,255,0) 42%, rgba(255,255,255,0) 60%,' +
                      ' rgba(255,255,255,0.10) 84%, rgba(255,255,255,0.34) 100%)',
        }} />
        {/* Edge: a hairline that reads on white, plus the specular highlight just
            inside it. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          border: '0.5px solid rgba(255,255,255,0.7)',
          boxShadow: 'inset 1.5px -1.5px 1px rgba(255,255,255,0.6),' +
                     ' inset -1.5px 1.5px 1px rgba(255,255,255,0.25),' +
                     ' 0 0 0 0.5px rgba(0,77,74,0.06)',
        }} />

        {/* Tabs — node's own tabs carry `mr:-8` so they overlap by their 8px side
            padding; four equal quarters put the centres within 3px of that and keeps
            the selection pill symmetric. */}
        <div style={{
          position: 'relative', zIndex: 1, height: '100%',
          display: 'flex', alignItems: 'stretch', padding: '0 2px',
        }}>
          {TABS.map(tab => {
            const on = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  if (tab.href) window.navigation.push(tab.href);
                }}
                {...press(0.97)}
                style={{
                  flex: '1 0 0', minWidth: 0, position: 'relative',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 1,
                  padding: '6px 8px 7px', border: 'none', background: 'none',
                  cursor: 'pointer', transition: 'transform 140ms ease',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* Selection — node 509:19230 → "Selection": inset 0 / -2px, r100.
                    The node resolves Apple's vibrant tertiary fill to a flat
                    #EDEDED; kept translucent so the glass still reads through it,
                    which lands on the same colour over this page. */}
                {on && (
                  <div aria-hidden style={{
                    position: 'absolute', top: 0, bottom: 0, left: -2, right: -2,
                    borderRadius: 100, background: 'rgba(120,120,128,0.12)',
                  }} />
                )}
                <img src={`../shared/assets/${tab.icon}`} alt=""
                     width={24} height={24}
                     style={{ display: 'block', position: 'relative' }} />
                <span style={{
                  position: 'relative',
                  fontFamily: BANNER_FONT, fontSize: 10, fontWeight: 590,
                  lineHeight: '12px', textAlign: 'center',
                  letterSpacing: on ? '-0.1px' : 0,
                  color: on
                    ? 'var(--Extended-brand-colours-Secondary-400, #008E93)'
                    : '#1A1A1A',
                }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
