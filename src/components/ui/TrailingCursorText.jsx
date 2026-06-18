import { useEffect, useMemo, useRef } from 'react';
import './TrailingCursorText.css';

/**
 * TrailingCursorText — a string of characters that trails the cursor like a
 * rope. Each glyph keeps a fixed distance from the one ahead of it and rotates
 * to follow the curve; a single smooth SVG stroke behind the glyphs forms one
 * clean blob. Fades out while scrolling / idle and re-emerges from the cursor.
 *
 * Inspired by Francisco Ribeiro's "Trailing Text".
 */
function TrailingCursorText({
  text = 'Designing - Thoughtful - Products ☺',
  fontFamily = 'system-ui, sans-serif',
  fontSize = 21,
  fontWeight = 500,
  letterSpacing = -1,
  textColor = '#FFFFFF',
  showHighlight = true,
  highlightColor = '#0052C9',
  highlightPadding = 8,
  attach = 'end', // 'start' | 'end' — which end of the text rides the cursor
  followSpeed = 0.12, // head lag: lower = longer trail
  stiffness = 4, // how rigidly the body holds its spacing (1–10)
  upright = false, // keep glyphs upright instead of rotating with the curve
  idleMs = 1400, // fade out after this long without mouse movement
}) {
  const chars = useMemo(() => Array.from(text), [text]);

  const rootRef = useRef(null);
  const pathRef = useRef(null);
  const glyphRefs = useRef([]);
  const posRef = useRef([]);
  const mouseRef = useRef(null);

  // Measure each glyph's advance width once per font/size change.
  const widths = useMemo(() => {
    if (typeof document === 'undefined') return chars.map(() => fontSize * 0.6);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    return chars.map((c) => ctx.measureText(c).width || fontSize * 0.4);
  }, [chars, fontFamily, fontSize, fontWeight]);

  useEffect(() => {
    const n = chars.length;
    if (!n) return undefined;

    const halfW = widths.map((w) => w / 2);
    const leadIdx = attach === 'end' ? n - 1 : 0;
    const step = attach === 'end' ? -1 : 1;
    const s = Math.min(1, Math.max(0.1, stiffness / 5));

    posRef.current = chars.map(() => ({ x: -1000, y: -1000 }));

    let lastMove = -Infinity;
    let lastScroll = -Infinity;
    let wasActive = false;

    const seedAt = (x, y) => {
      for (let i = 0; i < n; i += 1) {
        posRef.current[i].x = x;
        posRef.current[i].y = y;
      }
    };

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      lastMove = performance.now();
    };
    const onScroll = () => {
      lastScroll = performance.now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Smooth quadratic path through the glyph centers.
    const buildPath = (pts) => {
      if (pts.length < 2) return '';
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < pts.length - 1; i += 1) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        d += ` Q ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      const last = pts[pts.length - 1];
      d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
      return d;
    };

    let raf = 0;
    const tick = () => {
      const pos = posRef.current;
      const mouse = mouseRef.current;
      const now = performance.now();
      const active = mouse && lastMove > lastScroll && now - lastMove < idleMs;

      if (rootRef.current) rootRef.current.style.opacity = active ? '1' : '0';

      if (mouse) {
        // Re-emerge from the cursor when waking from an idle / scroll fade.
        if (active && !wasActive) seedAt(mouse.x, mouse.y);

        const lead = pos[leadIdx];
        lead.x += (mouse.x - lead.x) * followSpeed;
        lead.y += (mouse.y - lead.y) * followSpeed;

        for (let c = 1; c < n; c += 1) {
          const j = leadIdx + step * c;
          const k = j - step;
          const gap = halfW[k] + halfW[j] + letterSpacing;
          let dx = pos[j].x - pos[k].x;
          let dy = pos[j].y - pos[k].y;
          let dist = Math.hypot(dx, dy);
          if (dist < 0.0001) {
            dx = -1;
            dy = 0;
            dist = 1;
          }
          const tx = pos[k].x + (dx / dist) * gap;
          const ty = pos[k].y + (dy / dist) * gap;
          pos[j].x += (tx - pos[j].x) * s;
          pos[j].y += (ty - pos[j].y) * s;
        }
      }
      wasActive = active;

      if (pathRef.current) pathRef.current.setAttribute('d', buildPath(pos));

      for (let i = 0; i < n; i += 1) {
        const a = i < n - 1 ? pos[i] : pos[i - 1] ?? pos[i];
        const bpt = i < n - 1 ? pos[i + 1] : pos[i];
        const angle = upright ? 0 : (Math.atan2(bpt.y - a.y, bpt.x - a.x) * 180) / Math.PI;
        const g = glyphRefs.current[i];
        if (g) {
          g.style.transform = `translate3d(${pos[i].x}px, ${pos[i].y}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [
    chars,
    widths,
    fontSize,
    letterSpacing,
    highlightPadding,
    attach,
    followSpeed,
    stiffness,
    upright,
    idleMs,
  ]);

  const thickness = fontSize + highlightPadding * 2;

  return (
    <div ref={rootRef} className="trailing-text" aria-label={text}>
      {showHighlight && (
        <svg className="trailing-text__blob" aria-hidden="true">
          <path
            ref={pathRef}
            d=""
            fill="none"
            stroke={highlightColor}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      <div className="trailing-text__layer" aria-hidden="true">
        {chars.map((c, i) => (
          <span
            key={`g-${i}`}
            ref={(el) => (glyphRefs.current[i] = el)}
            className="trailing-text__glyph"
            style={{
              fontFamily,
              fontSize,
              fontWeight,
              letterSpacing,
              color: textColor,
            }}
          >
            {c === ' ' ? ' ' : c}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TrailingCursorText;
