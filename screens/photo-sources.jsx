// screens/photo-sources.jsx
// Figma: "Album" — node 451:14202. The photo-source picker that now sits between the
// editor's upload sheet and the album grid in image-picker/ (which is itself just one
// album, "Trip to Barcelona").
//   header + source pill .. 451:14355 / 451:14361
//   Collections row ....... 451:14203 / row 451:14213
//   Albums grid ........... 451:14372
//
// ⚠️ Figma clips exports to the containing frame, and this row overflows its 375
// frame, so only the first two cards (Canada, Italy) could be rendered for reference.
// The remaining six are reconstructed from the node's code alone and are unverified;
// see CLAUDE.md for the list of substitutions.

// Node 451:14372. Tiles are 166 square at 375; kept as a ratio so they track the
// 343 content width on wider phones.
const ALBUMS = [
  { id: 'all',    title: 'All photos',      sub: '12459', photo: 'pb-src-allphotos.jpg' },
  { id: 'people', title: 'People and pets', sub: '8',     faces: true },
  { id: 'fav',    title: 'Favorite',        sub: '1234',  photo: 'pb-src-favorite.jpg' },
  { id: 'places', title: 'Places',          sub: 'Map',   photo: 'pb-src-places.jpg' },
];

// Node 451:14395 — four 76px circles on a translucent plate, at a 3.5/3.14 inset with
// a 7px gutter. Expressed as percentages of the 166 tile so it scales with the grid.
// Order is top-left, top-right, bottom-RIGHT, bottom-left — the node's Ellipse22..25
// run clockwise, not in reading order.
const FACE_POS = [
  { left: '2.11%', top: '1.89%' }, { left: '52.11%', top: '1.89%' },
  { left: '52.11%', top: '51.89%' }, { left: '2.11%', top: '51.89%' },
];

function AlbumTile({ a, onOpen }) {
  return (
    <button type="button" onClick={onOpen} {...press(0.97)} style={{
      display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start',
      border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
      textAlign: 'left', transition: 'transform 140ms ease',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '1 / 1',
        borderRadius: 16, overflow: 'hidden',
        background: a.faces ? 'rgba(17,17,17,0.5)' : '#111111',
      }}>
        {a.photo && (
          <img src={`${A}/${a.photo}`} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }} />
        )}
        {a.faces && FACE_POS.map((p, i) => (
          <img key={i} src={`${A}/pb-src-face${i + 1}.png`} alt="" style={{
            position: 'absolute', left: p.left, top: p.top,
            width: '45.78%', height: '45.78%', display: 'block',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', color: '#FFFFFF' }}>
        <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 15,
                       lineHeight: '20px', letterSpacing: '-0.24px' }}>{a.title}</span>
        <span style={{ fontFamily: TEXT, fontSize: 13,
                       lineHeight: '18px', letterSpacing: '-0.08px' }}>{a.sub}</span>
      </div>
    </button>
  );
}

function SectionHeading({ children }) {
  return (
    <div style={{ height: 24, display: 'flex', alignItems: 'center' }}>
      <span style={{
        fontFamily: TEXT, fontWeight: 600, fontSize: 13, lineHeight: '18px',
        letterSpacing: '-0.08px', color: 'var(--colour-foreground-fg-white, #FFFFFF)',
      }}>{children}</span>
    </div>
  );
}

// Node 451:14361 — the source switcher. Inert: the node only carries its Camera Roll
// state, and no source list exists in the Figma yet.
function SourcePill() {
  return (
    <button type="button" {...press(0.97)} style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '8px 12px', borderRadius: 22, cursor: 'pointer',
      background: 'var(--colour-foreground-fg-white, #FFFFFF)',
      border: '1px solid var(--colour-foreground-fg-white, #FFFFFF)',
      transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
    }}>
      <span style={{
        position: 'relative', width: 24, height: 24, borderRadius: 8,
        background: '#FFFFFF', border: '0.3px solid rgba(41,41,41,0.16)',
        display: 'block', flex: '0 0 auto',
      }}>
        <img src={`${A}/pb-src-cameraroll.svg`} alt="" style={{
          position: 'absolute', inset: '6.67%', width: '86.66%', height: '86.66%',
          display: 'block',
        }} />
      </span>
      <span style={{
        fontFamily: TEXT, fontWeight: 600, fontSize: 13, lineHeight: '18px',
        letterSpacing: '-0.08px',
        color: 'var(--colour-foreground-fg-secondary, #007377)',
      }}>Camera Roll</span>
    </button>
  );
}

function PhotoSourcesScreen() {
  const openAlbum = () => window.navigation.push('../image-picker/index.html');

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      background: '#000000',
    }}>
      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
      }}>
        {/* ── Header — node 451:14355/14359. The node's own 48px status bar is replaced
            by the safe-area inset; the 44px control row and 12px tail below it are the
            node's, which puts the Collections section at y=104 as it has it. ── */}
        <div style={{
          position: 'relative',
          paddingTop: 'max(48px, calc(env(safe-area-inset-top, 44px) + 4px))',
          paddingBottom: 12,
          background: 'linear-gradient(to bottom, #000000, rgba(0,0,0,0))',
        }}>
          <div style={{
            height: 44, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* The node has a bare 24px chevron here; on request this uses the same
                liquid glass as the editor header. The glass sits at left 16 like the
                editor's, which nudges the glyph 8px right of the node's position. */}
            <div style={{ position: 'absolute', left: 16 }}>
              <GlassIconButton gloss tint="rgba(0,0,0,0.25)" label="Back"
                               onClick={() => window.navigation.pop()}>
                <img src={`${A}/pb-src-back.svg`} alt="" width={24} height={24}
                     style={{ display: 'block' }} />
              </GlassIconButton>
            </div>
            <SourcePill />
          </div>
        </div>

        {/* ── Collections — node 451:14203 ── */}
        <div style={{ position: 'relative', padding: 16, display: 'flex',
                      flexDirection: 'column', gap: 12 }}>
          {/* Node 451:14204 duplicates the first two covers behind the row at
              blur(146.85px) — an ambient colour glow, not content. */}
          <div aria-hidden style={{
            position: 'absolute', left: 16, top: 51.86, display: 'flex', gap: 16,
            filter: 'blur(146.85px)', pointerEvents: 'none', zIndex: 0,
          }}>
            {['pb-src-canada.jpg', 'pb-src-italy.jpg'].map(f => (
              <img key={f} src={`${A}/${f}`} alt="" style={{
                width: CARD_W, height: CARD_H, objectFit: 'cover', display: 'block',
              }} />
            ))}
          </div>

          <div style={{ position: 'relative' }}><SectionHeading>Collections</SectionHeading></div>
          {/* overflow-x forces overflow-y to auto, which clips the cards' rim; the
              bottom padding gives it room and the negative margin keeps the gap. */}
          <div style={{
            position: 'relative', display: 'flex', gap: 12, alignItems: 'flex-start',
            margin: '0 -16px -8px', padding: '0 16px 8px',
            overflowX: 'auto', overflowY: 'hidden',
            scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
          }}>
            {COLLECTIONS.map(c => (
              <CollectionCard key={c.id} c={c} onOpen={openAlbum} />
            ))}
          </div>
        </div>

        {/* ── Albums — node 451:14372 ── */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionHeading>Albums</SectionHeading>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
          }}>
            {ALBUMS.map(a => <AlbumTile key={a.id} a={a} onOpen={openAlbum} />)}
          </div>
        </div>

        <div aria-hidden style={{ height: 'calc(16px + env(safe-area-inset-bottom, 0px))' }} />
      </div>
    </div>
  );
}
