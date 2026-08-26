// ImagePicker.jsx — interactive iOS image picker
const { useState, useRef, useEffect, useMemo } = React;

// ─── Icons ───
const IconCheck = ({ size = 18, color = '#000', stroke = 2.4 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5L10 17.5L19 7.5" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconSparkleCheck = ({ size = 18, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <path d="M8 12.5L11 15.2L15.5 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.5 4.5L20 6L21.5 6.5L20 7L19.5 8.5L19 7L17.5 6.5L19 6L19.5 4.5Z" fill={color} />
  </svg>
);
const IconArrow = ({ size = 22, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconBack = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 5L8 12L15 19" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
// Aspect: square inside a square (full)
const IconAspectSquare = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="2.5" stroke={color} strokeWidth="2" />
    <rect x="8" y="8" width="8" height="8" rx="1" fill={color} />
  </svg>
);
// Aspect: original (different aspect within frame, e.g. portrait inside)
const IconAspectOriginal = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="2.5" stroke={color} strokeWidth="2" strokeDasharray="2 2" opacity="0.5" />
    <rect x="7" y="6" width="10" height="12" rx="1" fill={color} />
  </svg>
);
const IconSort = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 7H19M7 12H17M9 17H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconClose = ({ size = 18, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 6L18 18M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconArrowDown = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconArrowUp = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 19V5M12 5L6 11M12 5L18 11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconUpload = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 4V16M12 4L7.5 8.5M12 4L16.5 8.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 15V18.5C5 19.6 5.9 20.5 7 20.5H17C18.1 20.5 19 19.6 19 18.5V15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconSliders = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <line x1="4" y1="7" x2="9" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="13" y1="7" x2="20" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="11" cy="7" r="2" fill={color} />
    <line x1="4" y1="17" x2="13" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="17" x2="20" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="15" cy="17" r="2" fill={color} />
  </svg>
);

// ─── Capsule pill button (Select all / Smart Select) ───
function CapsuleButton({ icon, label, onClick, active, activeBg = '#000', activeColor = '#fff', trailingIcon, onTrailingClick }) {
  const showTrailing = !!trailingIcon && active;
  return (
    <div
      role="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        height: 36,
        paddingLeft: 14,
        paddingRight: showTrailing ? 4 : 14,
        borderRadius: 999, border: 'none', cursor: 'pointer',
        background: active ? activeBg : '#fff',
        color: active ? activeColor : '#000',
        fontSize: 16, fontWeight: 600,
        fontFamily: '-apple-system, "SF Pro Text", system-ui',
        letterSpacing: '-0.2px',
        transition: 'all 180ms cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}
    >
      {icon}
      <span>{label}</span>
      {showTrailing && (
        <span
          role="button"
          aria-label="Smart Select settings"
          onClick={(e) => { e.stopPropagation(); onTrailingClick && onTrailingClick(); }}
          style={{
            marginLeft: 2,
            width: 28, height: 28,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 160ms ease',
          }}
        >
          {trailingIcon}
        </span>
      )}
    </div>
  );
}

// ─── Header round icon button ───
function HeaderIconButton({ children, onClick, ariaLabel, active }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 36, height: 36, borderRadius: '50%',
        background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 160ms ease',
        flexShrink: 0,
      }}
    >{children}</button>
  );
}

// ─── Date header with circular checkbox ───
function DateHeader({ date, allSelected, partial, onToggle, isFirst }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: isFirst ? '6px 16px 12px' : '20px 16px 14px',
    }}>
      <button
        onClick={onToggle}
        aria-label={`Select all on ${date}`}
        style={{
          width: 26, height: 26, borderRadius: '50%',
          border: 'none', padding: 0, cursor: 'pointer',
          background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          boxSizing: 'border-box',
          border: allSelected ? 'none' : '2px solid rgba(255,255,255,0.7)',
          background: allSelected ? '#fff' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 180ms cubic-bezier(0.4,0,0.2,1)',
          flexShrink: 0,
        }}>
          {allSelected && <IconCheck size={16} color="#000" stroke={3} />}
          {partial && !allSelected && (
            <div style={{ width: 12, height: 2.5, borderRadius: 2, background: 'rgba(255,255,255,0.85)' }} />
          )}
        </div>
      </button>
      <span style={{
        color: '#fff', fontSize: 18, fontWeight: 600,
        fontFamily: '-apple-system, "SF Pro Display", system-ui',
        letterSpacing: '-0.3px',
      }}>{date}</span>
    </div>
  );
}

// ─── Photo tile with selection animation ───
function PhotoTile({ photo, selected, onToggle, onLongPress, onSwipeStart, onSwipeMove, onSwipeEnd, aspectMode }) {
  const [pressed, setPressed] = useState(false);
  const [justToggled, setJustToggled] = useState(false);
  const timerRef = useRef(null);
  const longPressTimer = useRef(null);
  const longPressFired = useRef(false);
  const swipeActive = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleClick = () => {
    if (longPressFired.current) { longPressFired.current = false; return; }
    if (swipeActive.current) { return; } // suppress click if we just swipe-selected
    setJustToggled(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setJustToggled(false), 240);
    onToggle();
  };

  const handlePointerDown = (e) => {
    setPressed(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    longPressFired.current = false;
    swipeActive.current = false;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      if (navigator.vibrate) navigator.vibrate(8);
      onLongPress && onLongPress();
    }, 380);
  };
  const handlePointerMove = (e) => {
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (longPressTimer.current && (ax > 8 || ay > 8)) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    // Horizontally-dominant drag → swipe-select. Vertical drag falls through to native scroll.
    if (!swipeActive.current && ax > 14 && ax > ay * 1.4) {
      swipeActive.current = true;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
      onSwipeStart && onSwipeStart(photo.id, e.clientX, e.clientY);
    }
    if (swipeActive.current) {
      e.preventDefault();
      onSwipeMove && onSwipeMove(e.clientX, e.clientY);
    }
  };
  const handlePointerEnd = (e) => {
    setPressed(false);
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
    if (swipeActive.current) {
      onSwipeEnd && onSwipeEnd();
      // Keep flag true momentarily so the synthesized click is suppressed,
      // then reset on next frame.
      requestAnimationFrame(() => { swipeActive.current = false; });
    }
  };

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, []);

  // Grid stays as 1:1 square cells. In 'square' mode the photo cover-fills the cell;
  // in 'original' mode the photo is contained inside the cell so its true aspect ratio shows.
  const tileAspect = '1 / 1';
  const objectFit = aspectMode === 'square' ? 'cover' : 'contain';

  return (
    <div
      data-photo-id={photo.id}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onContextMenu={(e) => e.preventDefault()}
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: tileAspect,
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        background: '#000',
        touchAction: 'pan-y',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        transform: selected ? 'scale(0.86)' : pressed ? 'scale(0.96)' : 'scale(1)',
        transition: 'transform 180ms cubic-bezier(0.34, 1.3, 0.64, 1), border-radius 180ms ease',
        borderRadius: selected ? 14 : 0,
        overflow: 'hidden',
        background: '#1a1a1a',
        willChange: 'transform, border-radius',
      }}>
        <img
          src={photo.src}
          alt=""
          loading="lazy"
          draggable={false}
          style={{
            width: '100%', height: '100%',
            objectFit,
            display: 'block',
            pointerEvents: 'none',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.18)',
          opacity: selected ? 1 : 0,
          transition: 'opacity 140ms ease',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Checkmark badge — only when selected */}
      <div style={{
        position: 'absolute',
        top: 10, right: 10,
        width: 24, height: 24,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: selected
          ? (justToggled ? 'scale(1.15)' : 'scale(1)')
          : 'scale(0.4)',
        opacity: selected ? 1 : 0,
        transition: 'transform 180ms cubic-bezier(0.34, 1.5, 0.64, 1), opacity 140ms ease',
        pointerEvents: 'none',
      }}>
        <IconCheck size={15} color="#000" stroke={3} />
      </div>

      {justToggled && (
        <div
          key={`ripple-${Date.now()}`}
          style={{
            position: 'absolute', inset: 0,
            borderRadius: 14,
            border: '2px solid rgba(255,255,255,0.6)',
            animation: 'tileFlash 240ms ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

// ─── Stack of recently-selected photo previews (for the floating pill) ───
function SelectedStack({ photos }) {
  // photos: most-recent first, take up to 3
  const stack = photos.slice(0, 3);
  const TILE = 36;
  return (
    <div style={{
      position: 'relative',
      width: TILE + 12, height: TILE,
      flexShrink: 0,
    }}>
      {[2, 1, 0].map((depth) => {
        const idx = depth; // 0 = top, 2 = back
        const photo = stack[idx];
        const offsetX = idx * 5;
        const rot = idx === 0 ? 0 : (idx === 1 ? -5 : -10);
        const scale = 1 - idx * 0.06;
        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: '50%', left: 0,
              marginTop: -TILE / 2,
              width: TILE, height: TILE,
              borderRadius: 8,
              background: '#2A2A2D',
              border: '1.5px solid rgba(255,255,255,0.85)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              transform: `translateX(${offsetX}px) rotate(${rot}deg) scale(${scale})`,
              transformOrigin: 'center',
              opacity: photo ? 1 : 0,
              transition: 'opacity 220ms ease, transform 280ms cubic-bezier(0.34,1.3,0.64,1)',
              zIndex: 10 - idx,
            }}
          >
            {photo && (
              <img
                src={photo.src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Review Sheet — morphs from pill bounds to fullscreen ───
function ReviewSheet({ open, photos, pillRect, onClose, onContinue, onRemove, onPreview, onClear }) {
  const [phase, setPhase] = useState('closed'); // 'closed' | 'morphing-in' | 'open' | 'morphing-out'
  const sheetRef = useRef(null);

  useEffect(() => {
    if (open && phase === 'closed') {
      setPhase('morphing-in');
      // next frame, transition to open
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase('open'));
      });
    } else if (!open && (phase === 'open' || phase === 'morphing-in')) {
      setPhase('morphing-out');
      const t = setTimeout(() => setPhase('closed'), 380);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (phase === 'closed') return null;

  // Compute morph transform from pill rect → fullscreen
  // pillRect is relative to the screen container.
  const containerW = pillRect ? pillRect.parentW : 402;
  const containerH = pillRect ? pillRect.parentH : 874;
  const r = pillRect || { left: 16, top: containerH - 92, width: containerW - 32, height: 64, parentW: containerW, parentH: containerH };
  // origin transform = scale + translate so the sheet (full screen) starts at pill bounds
  const sx = r.width / containerW;
  const sy = r.height / containerH;
  const tx = r.left;
  const ty = r.top;

  const isOpen = phase === 'open';
  const morphTransform = `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 280ms ease',
          zIndex: 60,
        }}
      />
      {/* Morphing sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'absolute',
          left: 0, top: 0,
          width: '100%', height: '100%',
          transformOrigin: 'top left',
          transform: isOpen ? 'translate(0,0) scale(1,1)' : morphTransform,
          borderRadius: isOpen ? 0 : 999,
          overflow: 'hidden',
          zIndex: 61,
          background: 'rgba(20,20,22,0.95)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          boxShadow: '0 -8px 28px rgba(0,0,0,0.55)',
          transition: 'transform 380ms cubic-bezier(0.32, 0.72, 0.24, 1), border-radius 320ms cubic-bezier(0.32, 0.72, 0.24, 1)',
          willChange: 'transform, border-radius',
        }}
      >
        {/* content fades in once expanded */}
        <div style={{
          width: '100%', height: '100%',
          opacity: isOpen ? 1 : 0,
          transition: isOpen ? 'opacity 200ms ease 140ms' : 'opacity 120ms ease',
          display: 'flex', flexDirection: 'column',
          color: '#fff',
        }}>
          {/* header */}
          <div style={{
            paddingTop: 70,
            paddingLeft: 20, paddingRight: 12,
            paddingBottom: 10,
            display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: '0.5px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px' }}>Review selection</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                {photos.length} photo{photos.length === 1 ? '' : 's'} • tap to preview
              </div>
            </div>
            {photos.length > 0 && (
              <button
                onClick={onClear}
                aria-label="Clear selection"
                style={{
                  height: 32, padding: '0 12px', borderRadius: 16,
                  background: 'rgba(255,69,58,0.18)',
                  color: '#ff6961',
                  border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: 13,
                  fontFamily: '-apple-system, "SF Pro Text", system-ui',
                  flexShrink: 0,
                }}
              >Clear</button>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 34, height: 34, borderRadius: 17,
                background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            ><IconClose size={16} color="#fff" /></button>
          </div>

          {/* grid */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '12px 12px calc(140px + env(safe-area-inset-bottom, 0px))',
            scrollbarWidth: 'none',
          }}>
            {photos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.5)' }}>
                No photos selected
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 6,
              }}>
                {photos.map(photo => (
                  <ReviewTile
                    key={photo.id}
                    photo={photo}
                    onRemove={() => onRemove(photo.id)}
                    onPreview={(id) => onPreview && onPreview(id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* big continue button */}
          <div style={{
            position: 'absolute',
            left: 0, right: 0, bottom: 0,
            padding: '18px 20px calc(36px + env(safe-area-inset-bottom, 0px))',
            background: 'linear-gradient(to top, rgba(20,20,22,1) 40%, rgba(20,20,22,0) 100%)',
            pointerEvents: 'none',
          }}>
            <button
              onClick={onContinue}
              disabled={photos.length === 0}
              style={{
                width: '100%', height: 56, borderRadius: 999,
                background: photos.length === 0 ? 'rgba(255,255,255,0.25)' : '#fff',
                color: photos.length === 0 ? 'rgba(0,0,0,0.4)' : '#000',
                border: 'none',
                cursor: photos.length === 0 ? 'default' : 'pointer',
                fontSize: 17, fontWeight: 700, letterSpacing: '-0.2px',
                fontFamily: '-apple-system, "SF Pro Text", system-ui',
                pointerEvents: 'auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
                transition: 'transform 140ms ease',
              }}
              onPointerDown={(e) => photos.length > 0 && (e.currentTarget.style.transform = 'scale(0.98)')}
              onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Continue with {photos.length} photo{photos.length === 1 ? '' : 's'}
              <IconArrow size={20} color="#000" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ReviewTile({ photo, onRemove, onPreview }) {
  const [removing, setRemoving] = useState(false);
  const handleRemove = (e) => {
    e.stopPropagation();
    setRemoving(true);
    setTimeout(() => onRemove(), 200);
  };
  return (
    <div
      onClick={() => onPreview && onPreview(photo.id)}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        borderRadius: 10,
        overflow: 'hidden',
        background: '#1a1a1a',
        cursor: 'pointer',
        transform: removing ? 'scale(0.6)' : 'scale(1)',
        opacity: removing ? 0 : 1,
        transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease',
      }}
    >
      <img src={photo.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
      <button
        onClick={handleRemove}
        aria-label="Remove from selection"
        style={{
          position: 'absolute', top: 6, right: 6,
          width: 26, height: 26, borderRadius: '50%',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <IconClose size={14} color="#fff" />
      </button>
    </div>
  );
}

// ─── Floating "N selected" pill ───
function SelectionPill({ count, recentPhotos, onOpenReview, onContinue, pillRef }) {
  const visible = count > 0;
  const [displayCount, setDisplayCount] = useState(0);
  const [bump, setBump] = useState(false);
  const bumpTimer = useRef(null);

  useEffect(() => {
    if (count !== displayCount) {
      setDisplayCount(count);
      if (count > 0) {
        setBump(true);
        if (bumpTimer.current) clearTimeout(bumpTimer.current);
        bumpTimer.current = setTimeout(() => setBump(false), 180);
      }
    }
  }, [count]);

  return (
    <div style={{
      position: 'absolute',
      left: 16, right: 16,
      bottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
      display: 'flex', justifyContent: 'center',
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'transform 240ms cubic-bezier(0.34, 1.25, 0.64, 1), opacity 160ms ease',
      transform: visible ? 'translateY(0)' : 'translateY(120%)',
      opacity: visible ? 1 : 0,
      zIndex: 20,
    }}>
      <div
        ref={pillRef}
        onClick={(e) => {
          // ignore clicks on continue button (handled separately)
          if (e.target.closest('[data-pill-continue]')) return;
          onOpenReview();
        }}
        style={{
          position: 'relative',
          height: 64,
          width: '100%',
          maxWidth: 420,
          borderRadius: 999,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 8px 28px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35)',
          transform: bump ? 'scale(1.025)' : 'scale(1)',
          transition: 'transform 160ms cubic-bezier(0.34, 1.4, 0.64, 1)',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          background: 'rgba(40,40,45,0.55)',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: 999,
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center',
          height: '100%', padding: '0 8px 0 18px',
          gap: 12,
        }}>
          <div style={{
            transform: bump ? 'rotate(-3deg) scale(1.06)' : 'rotate(0) scale(1)',
            transition: 'transform 220ms cubic-bezier(0.34, 1.4, 0.64, 1)',
            display: 'flex', alignItems: 'center',
          }}>
            <SelectedStack photos={recentPhotos} />
          </div>

          <div style={{
            flex: 1, color: '#fff', fontWeight: 600, fontSize: 16,
            letterSpacing: '-0.2px',
            fontFamily: '-apple-system, "SF Pro Text", system-ui',
            display: 'flex', alignItems: 'center', gap: 5,
            lineHeight: 1,
          }}>
            <AnimatedNumber value={displayCount} />
            <span>photo{displayCount === 1 ? '' : 's'} selected</span>
          </div>

          <button
            data-pill-continue
            onClick={(e) => { e.stopPropagation(); onContinue(); }}
            aria-label="Continue"
            style={{
              width: 68, height: 48, borderRadius: 9999,
              background: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              transition: 'transform 160ms ease',
              flexShrink: 0,
            }}
            onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
            onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <IconArrow size={22} color="#000" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Animated number that slides on change ───
function AnimatedNumber({ value }) {
  const [prev, setPrev] = useState(value);
  const [current, setCurrent] = useState(value);
  const [animating, setAnimating] = useState(false);
  const direction = useRef(1);
  const timer = useRef(null);

  useEffect(() => {
    if (value === current) return;
    direction.current = value > current ? 1 : -1;
    setPrev(current);
    setCurrent(value);
    setAnimating(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setAnimating(false);
      setPrev(value);
    }, 180);
  }, [value]);

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center', justifyContent: 'flex-start',
      position: 'relative',
      minWidth: '1.2ch', height: '1em',
      lineHeight: 1,
      overflow: 'hidden',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', lineHeight: 1,
        transform: animating ? `translateY(${-direction.current * 100}%)` : 'translateY(0)',
        opacity: animating ? 0 : 1,
        transition: animating ? 'transform 180ms cubic-bezier(0.4,0,0.2,1), opacity 160ms ease' : 'none',
      }}>{prev}</span>
      <span style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        display: 'inline-flex', alignItems: 'center', lineHeight: 1,
        transform: animating ? 'translateY(0)' : `translateY(${direction.current * 100}%)`,
        opacity: animating ? 1 : 0,
        transition: animating ? 'transform 180ms cubic-bezier(0.4,0,0.2,1), opacity 160ms ease' : 'none',
      }}>{current}</span>
    </span>
  );
}

// ─── Sort & filter sheet ───
function SortFilterSheet({ open, sortOrder, filters, kindCounts, onSortChange, onFilterChange, onClose }) {
  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: open ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
          backdropFilter: open ? 'blur(2px)' : 'none',
          WebkitBackdropFilter: open ? 'blur(2px)' : 'none',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 220ms ease',
          zIndex: 50,
        }}
      />
      {/* sheet — position:fixed; bottom:0 reaches physical screen bottom with
          viewport-fit=cover. The padding-bottom (set on the inner element) includes
          env(safe-area-inset-bottom), so the bg fills through the home-indicator
          area while visible content stays above it. Same pattern as whatoshop. */}
      <div style={{
        position: 'fixed',
        left: 0, right: 0, bottom: 0,
        zIndex: 51,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(0.34, 1.05, 0.64, 1)',
        pointerEvents: open ? 'auto' : 'none',
      }}>
        <div style={{
          background: 'rgba(28,28,30,0.92)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          borderTopLeftRadius: 22, borderTopRightRadius: 22,
          paddingBottom: 'calc(36px + env(safe-area-inset-bottom, 0px))',
          color: '#fff',
          border: '0.5px solid rgba(255,255,255,0.1)',
        }}>
          {/* grabber */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
            <div style={{ width: 36, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.25)' }} />
          </div>

          {/* header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px 4px',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>Sort & filter</div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 30, height: 30, borderRadius: 15,
                background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <IconClose size={16} color="#fff" />
            </button>
          </div>

          {/* SORT */}
          <div style={{
            margin: '14px 16px 0',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 14, overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px 6px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>Sort</div>
            {[
              { id: 'newest', label: 'Newest first', icon: <IconArrowDown size={18} color="#fff" /> },
              { id: 'oldest', label: 'Oldest first', icon: <IconArrowUp size={18} color="#fff" /> },
            ].map((opt, i, arr) => (
              <button
                key={opt.id}
                onClick={() => onSortChange(opt.id)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: '#fff', fontSize: 16, fontWeight: 500, textAlign: 'left',
                  borderTop: i === 0 ? 'none' : '0.5px solid rgba(255,255,255,0.08)',
                }}
              >
                <span style={{ width: 22, display: 'flex', justifyContent: 'center' }}>{opt.icon}</span>
                <span style={{ flex: 1 }}>{opt.label}</span>
                <span style={{ display: 'flex', width: 20, height: 20 }}>
                  {sortOrder === opt.id && <IconCheck size={20} color="#fff" stroke={2.5} />}
                </span>
              </button>
            ))}
          </div>

          {/* FILTERS */}
          <div style={{
            margin: '14px 16px 0',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 14, overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px 6px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>Hide</div>
            {[
              { id: 'hideScreenshots', label: 'Screenshots',        kind: 'screenshot' },
              { id: 'hideDuplicates',  label: 'Duplicates',          kind: 'duplicate' },
              { id: 'hideLowQuality',  label: 'Low-quality photos',  kind: 'lowquality' },
            ].map((f, i) => {
              const count = (kindCounts && kindCounts[f.kind]) || 0;
              return (
                <div
                  key={f.id}
                  onClick={() => onFilterChange(f.id, !filters[f.id])}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    borderTop: i === 0 ? 'none' : '0.5px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ flex: 1, fontSize: 16, fontWeight: 500 }}>{f.label}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 500,
                    color: 'rgba(255,255,255,0.45)',
                    minWidth: 28, textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}>{count}</span>
                  <Toggle on={!!filters[f.id]} onChange={(v) => onFilterChange(f.id, v)} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Native-style toggle switch ───
function Toggle({ on, onChange }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!on); }}
      aria-checked={on}
      role="switch"
      style={{
        width: 51, height: 31, borderRadius: 31,
        background: on ? '#34C759' : 'rgba(120,120,128,0.45)',
        border: 'none', padding: 0, cursor: 'pointer',
        position: 'relative',
        transition: 'background 200ms ease',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: on ? 22 : 2,
        width: 27, height: 27, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
        transition: 'left 200ms cubic-bezier(0.4,0,0.2,1)',
      }} />
    </button>
  );
}

// ─── Fullscreen photo preview (long-press) ───
function FullscreenPreview({ photos, startId, selected, onToggle, onClose }) {
  const startIdx = Math.max(0, photos.findIndex(p => p.id === startId));
  const [idx, setIdx] = useState(startIdx);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const startRef = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(i => Math.min(photos.length - 1, i + 1));
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photos.length, onClose]);

  const photo = photos[idx];
  if (!photo) return null;
  const isSelected = selected.has(photo.id);

  const onPointerDown = (e) => {
    startRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    setDrag({ x: 0, y: 0, active: true });
  };
  const onPointerMove = (e) => {
    if (!drag.active) return;
    setDrag({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y, active: true });
  };
  const onPointerUp = (e) => {
    if (!drag.active) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    const dt = Date.now() - startRef.current.t;
    const absX = Math.abs(dx), absY = Math.abs(dy);
    // Vertical swipe → close
    if (absY > 90 && absY > absX) {
      onClose();
      return;
    }
    // Horizontal swipe → next/prev
    if (absX > 60 && absX > absY) {
      if (dx < 0) setIdx(i => Math.min(photos.length - 1, i + 1));
      else        setIdx(i => Math.max(0, i - 1));
    }
    setDrag({ x: 0, y: 0, active: false });
  };

  // Live transform during drag
  const tx = drag.active ? drag.x * 0.6 : 0;
  const ty = drag.active ? drag.y * 0.9 : 0;
  const scale = drag.active ? Math.max(0.8, 1 - Math.abs(drag.y) / 1000) : 1;
  const backdropOpacity = drag.active ? Math.max(0.4, 1 - Math.abs(drag.y) / 600) : 1;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: `rgba(0,0,0,${backdropOpacity})`,
        display: 'flex', flexDirection: 'column',
        userSelect: 'none', WebkitUserSelect: 'none',
        touchAction: 'none',
        animation: 'previewPop 200ms cubic-bezier(0.34,1.3,0.64,1)',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingLeft: 16, paddingRight: 16, paddingBottom: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))',
        pointerEvents: drag.active ? 'none' : 'auto',
      }}>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{
          width: 36, height: 36, borderRadius: 18,
          background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><IconClose size={16} color="#fff" /></button>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
          {idx + 1} / {photos.length}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(photo.id); }}
          style={{
            height: 36, padding: '0 14px', borderRadius: 18,
            background: isSelected ? '#fff' : 'rgba(255,255,255,0.16)',
            color: isSelected ? '#000' : '#fff',
            border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          {isSelected ? <IconCheck size={16} color="#000" stroke={3} /> : null}
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>

      {/* Image area — translates with drag */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        transition: drag.active ? 'none' : 'transform 240ms cubic-bezier(0.4,0,0.2,1)',
      }}>
        <img
          src={photo.src}
          draggable={false}
          alt=""
          style={{
            maxWidth: '100%', maxHeight: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Hint at bottom */}
      <div style={{
        position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 14px)',
        left: 0, right: 0, textAlign: 'center',
        fontSize: 12, color: 'rgba(255,255,255,0.55)',
        opacity: drag.active ? 0 : 1,
        transition: 'opacity 160ms ease',
      }}>
        Swipe ← → to browse · Swipe ↓ to close
      </div>
    </div>
  );
}

// ─── Smart Select settings sheet ───
function SmartSelectSheet({ open, onClose, onApply }) {
  const [level, setLevel] = useState('medium');
  const [count, setCount] = useState(25);

  const PURPLE = '#A855F7';

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: open ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
          backdropFilter: open ? 'blur(2px)' : 'none',
          WebkitBackdropFilter: open ? 'blur(2px)' : 'none',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 220ms ease',
          zIndex: 50,
        }}
      />
      {/* sheet */}
      <div style={{
        position: 'fixed',
        left: 0, right: 0, bottom: 0,
        zIndex: 51,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(0.34, 1.05, 0.64, 1)',
        pointerEvents: open ? 'auto' : 'none',
      }}>
        <div style={{
          background: 'rgba(28,28,30,0.95)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          borderTopLeftRadius: 22, borderTopRightRadius: 22,
          paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
          color: '#fff',
          border: '0.5px solid rgba(255,255,255,0.1)',
        }}>
          {/* grabber */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
            <div style={{ width: 36, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.25)' }} />
          </div>

          {/* header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px 4px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconSparkleCheck size={20} color={PURPLE} />
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>Smart Select</div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 30, height: 30, borderRadius: 15,
                background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            ><IconClose size={16} color="#fff" /></button>
          </div>

          {/* Selectivity */}
          <div style={{
            padding: '14px 16px 6px',
            fontSize: 12, fontWeight: 600,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.6px', textTransform: 'uppercase',
          }}>How selective should it be</div>
          <div style={{ display: 'flex', gap: 8, padding: '4px 16px 6px' }}>
            {[
              { id: 'easy',   label: 'Easy' },
              { id: 'medium', label: 'Medium' },
              { id: 'max',    label: 'Max' },
            ].map(opt => {
              const sel = level === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setLevel(opt.id)}
                  style={{
                    flex: 1, height: 46, borderRadius: 12,
                    background: sel ? PURPLE : 'rgba(255,255,255,0.07)',
                    color: '#fff',
                    border: sel ? 'none' : '0.5px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    fontWeight: 600, fontSize: 15,
                    fontFamily: '-apple-system, "SF Pro Text", system-ui',
                    transition: 'background 180ms ease, transform 140ms ease',
                    boxShadow: sel ? '0 4px 14px rgba(168,85,247,0.45)' : 'none',
                  }}
                >{opt.label}</button>
              );
            })}
          </div>

          {/* Count slider */}
          <div style={{ padding: '18px 20px 4px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.6px', textTransform: 'uppercase',
              }}>Photos to select</span>
              <span style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
            </div>
            <input
              type="range"
              min="5" max="100" step="1"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                accentColor: PURPLE,
                height: 32,
              }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 11, color: 'rgba(255,255,255,0.4)',
              marginTop: -2, fontWeight: 500,
            }}>
              <span>5</span>
              <span>100</span>
            </div>
          </div>

          {/* Apply */}
          <div style={{ padding: '8px 16px 4px' }}>
            <button
              onClick={() => { onApply && onApply({ level, count }); onClose(); }}
              style={{
                width: '100%', height: 52, borderRadius: 14,
                background: PURPLE, color: '#fff',
                border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 16,
                letterSpacing: '-0.2px',
                fontFamily: '-apple-system, "SF Pro Text", system-ui',
                boxShadow: '0 6px 18px rgba(168,85,247,0.45)',
              }}
              onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >Apply</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Super scroll — date scrubber on the right edge ───
function SuperScroll({ scrollRef }) {
  const [show, setShow]           = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [thumbY, setThumbY]       = useState(0);     // 0..1
  const [dateLabel, setDateLabel] = useState('');
  const idleTimer    = useRef(null);
  const scrubbingRef = useRef(false);
  const trackRef     = useRef(null);

  // Read whichever date section is currently at the top of the viewport.
  const currentDate = (el) => {
    const sections = el.querySelectorAll('[data-date-section]');
    let lastSeen = null;
    const probeY = el.scrollTop + 240;   // a bit below the header
    for (const s of sections) {
      if (s.offsetTop <= probeY) lastSeen = s.getAttribute('data-date-section');
      else break;
    }
    return lastSeen || (sections[0] && sections[0].getAttribute('data-date-section')) || '';
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const initial = currentDate(el);
    if (initial) setDateLabel(initial);

    const onScroll = () => {
      const max  = el.scrollHeight - el.clientHeight;
      const frac = max > 0 ? Math.max(0, Math.min(1, el.scrollTop / max)) : 0;
      setThumbY(frac);
      const d = currentDate(el);
      if (d) setDateLabel(d);

      if (!scrubbingRef.current) {
        setShow(true);
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => {
          if (!scrubbingRef.current) setShow(false);
        }, 1100);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [scrollRef]);

  const move = (clientY) => {
    const track = trackRef.current;
    const el    = scrollRef.current;
    if (!track || !el) return;
    const r    = track.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (clientY - r.top) / r.height));
    setThumbY(frac);
    const max = el.scrollHeight - el.clientHeight;
    el.scrollTop = frac * max;
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    scrubbingRef.current = true;
    setScrubbing(true);
    setShow(true);
    move(e.clientY);
    if (navigator.vibrate) navigator.vibrate(6);
  };
  const onPointerMove = (e) => {
    if (!scrubbingRef.current) return;
    move(e.clientY);
  };
  const onPointerUp = (e) => {
    if (!scrubbingRef.current) return;
    scrubbingRef.current = false;
    setScrubbing(false);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setShow(false), 900);
  };

  // Bubble vertical position — clamped so it stays within the track visually.
  const bubbleTop = `${4 + thumbY * 92}%`;

  // Parse "DD Month YYYY" into pieces for the bubble label.
  const parts = dateLabel.split(' ');
  const day   = parts[0] || '';
  const month = (parts[1] || '').slice(0, 3).toUpperCase();
  const year  = parts[2] || '';

  const visible = show || scrubbing;

  return (
    <div style={{
      position: 'absolute',
      right: 0,
      top:    220,
      bottom: 'calc(140px + env(safe-area-inset-bottom, 0px))',
      width:  scrubbing ? 90 : 28,
      pointerEvents: visible ? 'auto' : 'none',
      zIndex: 15,
      transition: 'width 220ms cubic-bezier(0.22, 1, 0.36, 1)',
    }}>
      {/* Drag track — full area */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: 'absolute', inset: 0,
          touchAction: 'none',
        }}
      />

      {/* Bubble — itself a drag target so the user can grab it directly */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
        position: 'absolute',
        right: scrubbing ? 64 : 8,
        top: bubbleTop,
        transform: `translateY(-50%) scale(${scrubbing ? 1.06 : 1})`,
        transition: 'right 220ms cubic-bezier(0.22,1,0.36,1), transform 200ms cubic-bezier(0.34,1.4,0.64,1), opacity 220ms ease',
        opacity: visible ? 1 : 0,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
        borderRadius: 14,
        background: 'rgba(40,40,45,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid rgba(255,255,255,0.14)',
        boxShadow: scrubbing
          ? '0 8px 24px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.3)'
          : '0 4px 14px rgba(0,0,0,0.4)',
        color: '#fff',
        fontFamily: '-apple-system, "SF Pro Text", system-ui',
        whiteSpace: 'nowrap',
        userSelect: 'none', WebkitUserSelect: 'none',
        touchAction: 'none',
        cursor: 'grab',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.7, marginBottom: 2 }}>{month}</div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>
            <span>{day}</span>
            <span style={{ opacity: 0.55, fontSize: 12, marginLeft: 4, fontWeight: 600 }}>{year}</span>
          </div>
        </div>
        {/* Grip dots — signals draggability */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2.5, opacity: 0.5 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: '#fff' }} />
          ))}
        </div>
      </div>

      {/* Thumb puck — visible while scrubbing, sits where the finger is */}
      <div style={{
        position: 'absolute',
        right: 6,
        top: bubbleTop,
        transform: `translate(0, -50%) scale(${scrubbing ? 1 : 0.4})`,
        opacity: scrubbing ? 1 : 0,
        width: 32, height: 32, borderRadius: 16,
        background: 'rgba(255,255,255,0.95)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.45)',
        transition: 'transform 200ms cubic-bezier(0.34,1.4,0.64,1), opacity 180ms ease',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ─── Main screen ───
function ImagePickerScreen() {
  const [selected, setSelected] = useState(new Set());
  const [order, setOrder] = useState([]); // selection order, latest at end
  const [scrollY, setScrollY] = useState(0);
  const [aspectMode, setAspectMode] = useState('square');
  const [sortOrder, setSortOrder] = useState('newest');
  const [filters, setFilters] = useState({ hideScreenshots: false, hideDuplicates: false, hideLowQuality: false });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [pillRect, setPillRect] = useState(null);
  const [previewId, setPreviewId] = useState(null); // long-press fullscreen preview
  const [smartScanning, setSmartScanning] = useState(false);
  const [smartSheetOpen, setSmartSheetOpen] = useState(false);
  const [smartTriggered, setSmartTriggered] = useState(false); // explicit, independent of selection contents
  const [hintIdx, setHintIdx] = useState(0);
  const [hintShow, setHintShow] = useState(true); // false during cross-fade swap
  const [uploadedPhotos, setUploadedPhotos] = useState([]); // user's real photos (replaces demo when present)
  const fileInputRef = useRef(null);

  // Use the user's library when any photos are uploaded; otherwise fall back to mocked demo data.
  const sourcePhotos = uploadedPhotos.length > 0 ? uploadedPhotos : window.PHOTOS;

  const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const handleUploadFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    // Sort chronologically (oldest → newest), matching the mock data convention.
    files.sort((a, b) => a.lastModified - b.lastModified);
    const stamp = Date.now();
    const newPhotos = files.map((file, i) => {
      const url = URL.createObjectURL(file);
      const d = new Date(file.lastModified || stamp);
      const dateStr = `${String(d.getDate()).padStart(2,'0')} ${MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`;
      return {
        id: `u_${stamp}_${i}`,
        src: url,
        ar: 1,
        date: dateStr,
        kind: 'photo',
      };
    });
    // Revoke old blob URLs to avoid leaking memory when replacing.
    uploadedPhotos.forEach(p => {
      if (typeof p.src === 'string' && p.src.startsWith('blob:')) URL.revokeObjectURL(p.src);
    });
    setUploadedPhotos(newPhotos);
    setSelected(new Set());
    setOrder([]);
    setSmartTriggered(false);
    e.target.value = ''; // allow re-uploading same files
  };

  const resetToDemoPhotos = () => {
    uploadedPhotos.forEach(p => {
      if (typeof p.src === 'string' && p.src.startsWith('blob:')) URL.revokeObjectURL(p.src);
    });
    setUploadedPhotos([]);
    setSelected(new Set());
    setOrder([]);
    setSmartTriggered(false);
  };

  // Rotate hint every 5s with a 300ms cross-fade.
  useEffect(() => {
    const HINT_COUNT = 4;
    const t = setInterval(() => {
      setHintShow(false);
      setTimeout(() => {
        setHintIdx(i => (i + 1) % HINT_COUNT);
        setHintShow(true);
      }, 320);
    }, 5000);
    return () => clearInterval(t);
  }, []);
  const scrollRef = useRef(null);
  const pillRef = useRef(null);

  // Counts of each "kind" for the filter sheet
  const kindCounts = useMemo(() => {
    const c = { screenshot: 0, duplicate: 0, lowquality: 0 };
    for (const p of sourcePhotos) if (c[p.kind] !== undefined) c[p.kind]++;
    return c;
  }, [sourcePhotos]);

  // Filter + sort. Selected photos are NEVER hidden by filters.
  const visiblePhotos = useMemo(() => {
    let arr = sourcePhotos.filter(p => {
      if (selected.has(p.id)) return true;
      if (filters.hideScreenshots && p.kind === 'screenshot') return false;
      if (filters.hideDuplicates && p.kind === 'duplicate') return false;
      if (filters.hideLowQuality && p.kind === 'lowquality') return false;
      return true;
    });
    // Source is chronological (oldest → newest); reverse for newest-first.
    if (sortOrder === 'newest') arr = [...arr].reverse();
    return arr;
  }, [filters, sortOrder, selected, sourcePhotos]);

  const hiddenCount = sourcePhotos.length - visiblePhotos.length;

  // Group photos by date in display order
  const groups = useMemo(() => {
    const order = [];
    const map = new Map();
    for (const p of visiblePhotos) {
      if (!map.has(p.date)) {
        map.set(p.date, []);
        order.push(p.date);
      }
      map.get(p.date).push(p);
    }
    return order.map(d => ({ date: d, photos: map.get(d) }));
  }, [visiblePhotos]);

  const allIds = useMemo(() => visiblePhotos.map(p => p.id), [visiblePhotos]);

  const togglePhoto = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setOrder(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      return [...prev, id];
    });
    setSmartTriggered(false);
  };

  // Swipe-to-select: drag horizontally across photos to add/remove in bulk.
  // Mode is locked to the first photo's inverse state (so swiping over an
  // unselected photo selects, swiping over a selected photo deselects).
  const swipeRef = useRef({ active: false, mode: 'select', visited: new Set() });

  const swipeApply = (id) => {
    const mode = swipeRef.current.mode;
    setSelected(prev => {
      const next = new Set(prev);
      if (mode === 'select') next.add(id); else next.delete(id);
      return next;
    });
    setOrder(prev => {
      if (mode === 'select') return prev.includes(id) ? prev : [...prev, id];
      return prev.filter(x => x !== id);
    });
    setSmartTriggered(false);
  };

  const onSwipeStart = (id) => {
    const mode = selected.has(id) ? 'deselect' : 'select';
    swipeRef.current = { active: true, mode, visited: new Set([id]) };
    swipeApply(id);
    if (navigator.vibrate) navigator.vibrate(4);
  };
  const onSwipeMove = (x, y) => {
    if (!swipeRef.current.active) return;
    const el = document.elementFromPoint(x, y);
    const tile = el && el.closest && el.closest('[data-photo-id]');
    if (!tile) return;
    const id = tile.getAttribute('data-photo-id');
    if (swipeRef.current.visited.has(id)) return;
    swipeRef.current.visited.add(id);
    swipeApply(id);
    if (navigator.vibrate) navigator.vibrate(3);
  };
  const onSwipeEnd = () => {
    swipeRef.current.active = false;
  };

  // Native touch fallback for iOS — pointer events on iOS get clobbered by the
  // scroll-vs-gesture decision before our threshold fires. We attach our own
  // touch listeners with { passive: false } so preventDefault actually blocks
  // the page scroll once we've decided this is a swipe.
  // Refs ensure handlers always read the latest selected/order without re-binding.
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let startX = 0, startY = 0;
    let startId = null;
    let active = false;
    let visited = new Set();
    let mode = 'select';

    const findTileId = (x, y) => {
      const node = document.elementFromPoint(x, y);
      const tile = node && node.closest && node.closest('[data-photo-id]');
      return tile ? tile.getAttribute('data-photo-id') : null;
    };

    const apply = (id) => {
      setSelected(prev => {
        const next = new Set(prev);
        if (mode === 'select') next.add(id); else next.delete(id);
        return next;
      });
      setOrder(prev => {
        if (mode === 'select') return prev.includes(id) ? prev : [...prev, id];
        return prev.filter(x => x !== id);
      });
      setSmartTriggered(false);
    };

    const onStart = (e) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY;
      startId = findTileId(t.clientX, t.clientY);
      active = false;
      visited = new Set();
    };

    const onMove = (e) => {
      if (!startId || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const ax = Math.abs(dx), ay = Math.abs(dy);

      if (!active) {
        // Only commit to swipe once we're clearly horizontal — vertical
        // movement keeps the native scroll behaviour intact.
        if (ax > 12 && ax > ay * 1.4) {
          active = true;
          mode = selectedRef.current.has(startId) ? 'deselect' : 'select';
          visited.add(startId);
          apply(startId);
          if (navigator.vibrate) navigator.vibrate(4);
        } else if (ay > 12) {
          // Vertical commit — abandon swipe detection for the rest of this gesture
          startId = null;
          return;
        }
      }

      if (active) {
        e.preventDefault();    // blocks iOS scroll for the rest of the gesture
        const id = findTileId(t.clientX, t.clientY);
        if (id && !visited.has(id)) {
          visited.add(id);
          apply(id);
          if (navigator.vibrate) navigator.vibrate(3);
        }
      }
    };

    const onEnd = () => {
      if (active) {
        // Suppress the synthetic click that follows on the start tile so
        // the swipe doesn't toggle one extra time.
        const blocker = (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          window.removeEventListener('click', blocker, true);
        };
        window.addEventListener('click', blocker, true);
        setTimeout(() => window.removeEventListener('click', blocker, true), 350);
      }
      active = false;
      startId = null;
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove',  onMove,  { passive: false }); // CRITICAL: passive:false
    el.addEventListener('touchend',   onEnd,   { passive: true });
    el.addEventListener('touchcancel', onEnd,  { passive: true });

    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove',  onMove);
      el.removeEventListener('touchend',   onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, []);

  const toggleGroup = (date) => {
    const ids = groups.find(g => g.date === date).photos.map(p => p.id);
    const allIn = ids.every(id => selected.has(id));
    setSelected(prev => {
      const next = new Set(prev);
      if (allIn) ids.forEach(id => next.delete(id));
      else ids.forEach(id => next.add(id));
      return next;
    });
    setOrder(prev => {
      if (allIn) return prev.filter(x => !ids.includes(x));
      const without = prev.filter(x => !ids.includes(x));
      return [...without, ...ids.filter(id => !prev.includes(id))];
    });
    setSmartTriggered(false);
  };

  const allSelectedAll = allIds.length > 0 && allIds.every(id => selected.has(id));

  // Smart Select: first 3 photos of each visible group, in display order.
  const smartIds = useMemo(() => {
    const ids = [];
    groups.forEach(g => g.photos.slice(0, Math.min(3, g.photos.length)).forEach(p => ids.push(p.id)));
    return ids;
  }, [groups]);
  // Active visual is driven by an explicit flag — independent from "Select all".
  const smartActive = smartTriggered;

  const runSmartSelect = () => {
    if (smartTriggered) {
      // Deselect: remove smart photos from selection
      setSelected(prev => {
        const next = new Set(prev);
        smartIds.forEach(id => next.delete(id));
        return next;
      });
      setOrder(prev => prev.filter(x => !smartIds.includes(x)));
      setSmartTriggered(false);
      return;
    }
    // Trigger scanning animation, then commit selection
    setSmartScanning(true);
    setTimeout(() => {
      setSelected(prev => {
        const next = new Set(prev);
        smartIds.forEach(id => next.add(id));
        return next;
      });
      setOrder(prev => [...prev, ...smartIds.filter(id => !prev.includes(id))]);
      setSmartTriggered(true);
    }, 480);
    setTimeout(() => setSmartScanning(false), 900);
  };
  const toggleAll = () => {
    if (allSelectedAll) {
      setSelected(prev => {
        const next = new Set(prev);
        allIds.forEach(id => next.delete(id));
        return next;
      });
      setOrder(prev => prev.filter(x => !allIds.includes(x)));
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        allIds.forEach(id => next.add(id));
        return next;
      });
      setOrder(prev => {
        const without = prev.filter(x => !allIds.includes(x));
        return [...without, ...allIds.filter(id => !prev.includes(id))];
      });
    }
    setSmartTriggered(false);
  };

  const selectionCount = selected.size;
  const headerCondensed = scrollY > 30;

  // Most-recent-first selected photos for the pill stack
  const recentPhotos = useMemo(() => {
    const byId = new Map(sourcePhotos.map(p => [p.id, p]));
    return [...order].reverse().map(id => byId.get(id)).filter(Boolean);
  }, [order, sourcePhotos]);

  return (
    <div
      data-screen-root
      style={{
      width: '100%', height: '100%',
      background: '#000', color: '#fff',
      position: 'relative', overflow: 'hidden',
      fontFamily: '-apple-system, "SF Pro Text", "SF Pro Display", system-ui',
    }}>
      {/* ── Scrollable content ── */}
      <div
        ref={scrollRef}
        onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
        style={{
          position: 'absolute', inset: 0,
          overflowY: 'auto',
          paddingTop: 220,
          paddingBottom: 'calc(140px + env(safe-area-inset-bottom, 0px))',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {groups.map((g, gi) => {
          const ids = g.photos.map(p => p.id);
          const selCount = ids.filter(id => selected.has(id)).length;
          const allSel = selCount === ids.length && ids.length > 0;
          const partial = selCount > 0 && !allSel;
          return (
            <div key={g.date} data-date-section={g.date}>
              <DateHeader
                date={g.date}
                allSelected={allSel}
                partial={partial}
                onToggle={() => toggleGroup(g.date)}
                isFirst={gi === 0}
              />
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 3,
                gridAutoFlow: 'row',
                alignItems: 'start',
              }}>
                {g.photos.map((p) => (
                  <PhotoTile
                    key={p.id}
                    photo={p}
                    selected={selected.has(p.id)}
                    onToggle={() => togglePhoto(p.id)}
                    onLongPress={() => setPreviewId(p.id)}
                    onSwipeStart={onSwipeStart}
                    onSwipeMove={onSwipeMove}
                    onSwipeEnd={onSwipeEnd}
                    aspectMode={aspectMode}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {visiblePhotos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 30px', color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
            No photos match the current filters.
          </div>
        )}
      </div>

      {/* ── Super scroll scrubber (right edge) ── */}
      <SuperScroll scrollRef={scrollRef} />

      {/* ── Glass header (progressive blur) ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 10,
        paddingTop: 62,
        paddingBottom: 18,
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backdropFilter: 'blur(16px) saturate(160%)',
            WebkitBackdropFilter: 'blur(16px) saturate(160%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 60%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 60%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backdropFilter: 'blur(8px) saturate(150%)',
            WebkitBackdropFilter: 'blur(8px) saturate(150%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 85%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: headerCondensed
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 100%)'
              : 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0) 100%)',
            transition: 'background 180ms ease',
          }} />
        </div>

        {/* Title row */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px 0',
          gap: 4,
        }}>
          <HeaderIconButton ariaLabel="Back">
            <IconBack size={26} color="#fff" />
          </HeaderIconButton>

          <div style={{
            position: 'absolute', left: 0, right: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.2px' }}>
              {uploadedPhotos.length > 0 ? 'Your photos' : 'Trip to Barcelona'}
            </div>
            <div style={{
              fontSize: 13, color: 'rgba(255,255,255,0.55)',
              marginTop: 2,
              maxHeight: headerCondensed ? 0 : 18,
              opacity: headerCondensed ? 0 : 1,
              overflow: 'hidden',
              transition: 'all 220ms ease',
            }}>
              {visiblePhotos.length} photo{visiblePhotos.length === 1 ? '' : 's'}{hiddenCount > 0 && (<span style={{ color: 'rgba(255,255,255,0.4)' }}>, {hiddenCount} hidden</span>)}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <HeaderIconButton
              ariaLabel={uploadedPhotos.length ? 'Reset to demo photos' : 'Upload your photos'}
              onClick={() => {
                if (uploadedPhotos.length) {
                  if (window.confirm('Reset to demo photos?')) resetToDemoPhotos();
                } else {
                  fileInputRef.current && fileInputRef.current.click();
                }
              }}
              active={uploadedPhotos.length > 0}
            >
              <IconUpload size={20} color="#fff" />
            </HeaderIconButton>
            <HeaderIconButton
              ariaLabel="Toggle aspect ratio"
              onClick={() => setAspectMode(m => m === 'square' ? 'original' : 'square')}
              active={aspectMode === 'original'}
            >
              {aspectMode === 'square'
                ? <IconAspectSquare size={22} color="#fff" />
                : <IconAspectOriginal size={22} color="#fff" />}
            </HeaderIconButton>
            <HeaderIconButton
              ariaLabel="Sort and filter"
              onClick={() => setSheetOpen(true)}
              active={sheetOpen || filters.hideScreenshots || filters.hideDuplicates || filters.hideLowQuality}
            >
              <IconSort size={22} color="#fff" />
            </HeaderIconButton>
          </div>
        </div>

        {/* Action capsules */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', justifyContent: 'center', gap: 12,
          marginTop: 18,
        }}>
          <CapsuleButton
            icon={<IconCheck size={18} color={allSelectedAll ? '#fff' : '#000'} stroke={2.6} />}
            label={allSelectedAll ? 'Unselect' : 'Select all'}
            onClick={toggleAll}
            active={allSelectedAll}
          />
          <CapsuleButton
            icon={<IconSparkleCheck size={20} color={smartActive ? '#fff' : '#000'} />}
            label="Smart Select"
            onClick={runSmartSelect}
            active={smartActive}
            activeBg="#A855F7"
            activeColor="#fff"
            trailingIcon={<IconSliders size={14} color="#fff" />}
            onTrailingClick={() => setSmartSheetOpen(true)}
          />
        </div>
      </div>

      {/* ── Rotating hint (sits in the gap between header and grid; fades on scroll) ── */}
      <div style={{
        position: 'absolute',
        top: 196, left: 0, right: 0,
        height: 22,
        zIndex: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
        opacity: scrollY < 20 ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}>
        <span style={{
          fontSize: 12.5,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.42)',
          letterSpacing: '-0.05px',
          fontFamily: '-apple-system, "SF Pro Text", system-ui',
          opacity: hintShow ? 1 : 0,
          transform: hintShow ? 'translateY(0)' : 'translateY(2px)',
          transition: 'opacity 280ms ease, transform 280ms ease',
        }}>
          {[
            'Tap and hold a photo to preview',
            'Swipe across photos to select multiple',
            'Try Smart Select to pick the best photos',
            'Drag the right edge to fly through dates',
          ][hintIdx]}
        </span>
      </div>

      {/* ── Floating selection pill ── */}
      <SelectionPill
        pillRef={pillRef}
        count={selectionCount}
        recentPhotos={recentPhotos}
        onOpenReview={() => {
          // capture pill rect relative to screen container
          const pillEl = pillRef.current;
          const screenEl = pillEl ? pillEl.closest('[data-screen-root]') : null;
          if (pillEl && screenEl) {
            const a = pillEl.getBoundingClientRect();
            const b = screenEl.getBoundingClientRect();
            setPillRect({
              left: a.left - b.left,
              top: a.top - b.top,
              width: a.width,
              height: a.height,
              parentW: b.width,
              parentH: b.height,
            });
          }
          setReviewOpen(true);
        }}
        onContinue={() => {
          const el = document.getElementById('toast');
          if (el) {
            el.style.opacity = '1';
            el.style.transform = 'translate(-50%, 0)';
            setTimeout(() => {
              el.style.opacity = '0';
              el.style.transform = 'translate(-50%, 8px)';
            }, 1200);
          }
        }}
      />

      <ReviewSheet
        open={reviewOpen}
        photos={recentPhotos}
        pillRect={pillRect}
        onClose={() => setReviewOpen(false)}
        onContinue={() => {
          setReviewOpen(false);
          setTimeout(() => {
            const el = document.getElementById('toast');
            if (el) {
              el.style.opacity = '1';
              el.style.transform = 'translate(-50%, 0)';
              setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translate(-50%, 8px)';
              }, 1200);
            }
          }, 200);
        }}
        onRemove={(id) => togglePhoto(id)}
        onPreview={(id) => setPreviewId(id)}
        onClear={() => {
          setSelected(new Set());
          setOrder([]);
          setSmartTriggered(false);
        }}
      />

      {/* ── Smart Select scanning sweep ── */}
      {smartScanning && (
        <div style={{
          position: 'absolute', top: 200, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          zIndex: 9,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 0,
            height: 120,
            background: 'linear-gradient(to bottom, rgba(120,180,255,0) 0%, rgba(120,180,255,0.45) 50%, rgba(255,255,255,0) 100%)',
            mixBlendMode: 'screen',
            animation: 'smartSweep 700ms cubic-bezier(0.4,0,0.2,1) forwards',
          }} />
        </div>
      )}

      {/* ── Fullscreen photo preview (long-press) ── */}
      {previewId && (
        <FullscreenPreview
          photos={visiblePhotos}
          startId={previewId}
          selected={selected}
          onToggle={togglePhoto}
          onClose={() => setPreviewId(null)}
        />
      )}

      {/* Hidden native file input — triggered by the Upload icon in the header */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUploadFiles}
        style={{ display: 'none' }}
      />

      {/* ── tiny toast ── */}
      <div
        id="toast"
        style={{
          position: 'absolute',
          left: '50%', bottom: 'calc(110px + env(safe-area-inset-bottom, 0px))',
          transform: 'translate(-50%, 8px)',
          opacity: 0,
          background: 'rgba(255,255,255,0.95)',
          color: '#000',
          padding: '8px 14px',
          borderRadius: 999,
          fontSize: 13, fontWeight: 600,
          pointerEvents: 'none',
          transition: 'opacity 220ms ease, transform 260ms cubic-bezier(0.34,1.3,0.64,1)',
          zIndex: 30,
        }}
      >Continuing →</div>

      {/* ── Smart Select settings sheet (UI only) ── */}
      <SmartSelectSheet
        open={smartSheetOpen}
        onClose={() => setSmartSheetOpen(false)}
        onApply={() => setSmartSheetOpen(false)}
      />

      {/* ── sort / filter sheet ── */}
      <SortFilterSheet
        open={sheetOpen}
        sortOrder={sortOrder}
        filters={filters}
        kindCounts={kindCounts}
        onSortChange={(v) => setSortOrder(v)}
        onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        onClose={() => setSheetOpen(false)}
      />

      <style>{`
        @keyframes tileFlash {
          0%   { opacity: 0.9; transform: scale(0.92); }
          60%  { opacity: 0.5; transform: scale(1.0); }
          100% { opacity: 0;   transform: scale(1.02); }
        }
        @keyframes smartSweep {
          0%   { transform: translateY(-100%); opacity: 0.0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(900px); opacity: 0; }
        }
        @keyframes previewPop {
          0%   { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1);    opacity: 1; }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

window.ImagePickerScreen = ImagePickerScreen;
