import { useMemo, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { siteConfig } from '@/utils/siteConfig';
// Shapes are imported as raw SVG source (?raw) so they can be recolored at
// runtime: every shape is normalized to `currentColor`, and each placed
// instance sets its wrapper's CSS `color` to a brand token. That lets ANY shape
// wear ANY brand color (orange / blue / yellow) — and it's production-safe
// (inline SVG, no CSS mask, which previously rendered as plain squares on prod).
import circleRaw from '@/assets/svg/02_circle.svg?raw';
import squiggleRaw from '@/assets/svg/04_squiggle.svg?raw';
import pacmanRaw from '@/assets/svg/05_pacman.svg?raw';
import rectangleRaw from '@/assets/svg/09_rectangle.svg?raw';
import starRaw from '@/assets/svg/12_star.svg?raw';
import ringRaw from '@/assets/svg/13_ring.svg?raw';
import sRaw from '@/assets/svg/15_S.svg?raw';
import blob1Raw from '@/assets/svg/blue-1.svg?raw';
import blob2Raw from '@/assets/svg/blue-2.svg?raw';
import heartRaw from '@/assets/svg/orange-1.svg?raw';
import splatRaw from '@/assets/svg/orange-3.svg?raw';
import blob3Raw from '@/assets/svg/yellow-2.svg?raw';
import './HomeAssemble.css';

// Normalize a raw SVG to a colorable inline string: drop the XML prolog,
// comments, embedded <style> defs and ids, then route every fill/stroke through
// `currentColor` so the wrapper's `color` drives it.
function prep(raw) {
  return raw
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<defs>[\s\S]*?<\/defs>/gi, '')
    .replace(/\sid="[^"]*"/g, '')
    .replace(/class="st0"/g, 'fill="currentColor"')
    .replace(/#(?:[0-9a-fA-F]{3}){1,2}\b/g, 'currentColor')
    .trim();
}

const SHAPES = {
  circle: prep(circleRaw),
  squiggle: prep(squiggleRaw),
  pacman: prep(pacmanRaw),
  rectangle: prep(rectangleRaw),
  star: prep(starRaw),
  ring: prep(ringRaw),
  s: prep(sRaw),
  blob1: prep(blob1Raw),
  blob2: prep(blob2Raw),
  blob3: prep(blob3Raw),
  heart: prep(heartRaw),
  splat: prep(splatRaw),
};

const COLORS = ['var(--color-orange)', 'var(--color-blue)', 'var(--color-yellow)'];

/* Base placements ring the headline (center kept clear). Color is assigned at
   random per load — since the shapes are now color-neutral, the same path shows
   up in different colors, which fills the composition out. `pull` = how far out
   (% of viewport) a motif starts before converging; the 4 corner "hint" shapes
   peek on the first frame. mobile:false = hidden on the thinner mobile flow. */
const BASE = [
  // Corner hint shapes — peek on the first frame.
  { shape: 'blob1', x: 7, y: 18, size: '13vw', rot: -8, pull: 10, mobile: true },
  { shape: 'circle', x: 92, y: 20, size: '9vw', rot: 7, pull: 10, mobile: true },
  { shape: 'splat', x: 88, y: 86, size: '12vw', rot: -6, pull: 10, mobile: true },
  { shape: 'heart', x: 10, y: 84, size: '12vw', rot: 9, pull: 10, mobile: true },
  // Mids.
  { shape: 'blob3', x: 8, y: 50, size: '8vw', rot: -12, pull: 46, mobile: true },
  { shape: 'blob2', x: 93, y: 45, size: '8.5vw', rot: 10, pull: 46, mobile: true },
  { shape: 'star', x: 90, y: 64, size: '7vw', rot: -8, pull: 48, mobile: true },
  { shape: 'pacman', x: 60, y: 9, size: '7vw', rot: -9, pull: 50, mobile: true },
  // Splats — the "sparkle" the brand loves; prioritized so more survive.
  { shape: 'splat', x: 22, y: 30, size: '8vw', rot: 14, pull: 52, mobile: false },
  { shape: 'splat', x: 80, y: 30, size: '7vw', rot: -16, pull: 52, mobile: true },
  { shape: 'splat', x: 74, y: 88, size: '7.5vw', rot: 10, pull: 54, mobile: false },
  // Accents — sweep in from far off-frame.
  { shape: 'squiggle', x: 40, y: 7, size: '9vw', rot: 6, pull: 56, mobile: false },
  { shape: 'star', x: 73, y: 15, size: '6vw', rot: 18, pull: 54, mobile: false },
  { shape: 'ring', x: 95, y: 74, size: '6vw', rot: -12, pull: 58, mobile: false },
  { shape: 's', x: 66, y: 90, size: '6vw', rot: 10, pull: 58, mobile: false },
  { shape: 'rectangle', x: 45, y: 93, size: '8vw', rot: -5, pull: 56, mobile: false },
  { shape: 'circle', x: 28, y: 91, size: '6.5vw', rot: 20, pull: 54, mobile: false },
  { shape: 'ring', x: 8, y: 67, size: '6vw', rot: -16, pull: 60, mobile: false },
  { shape: 'circle', x: 10, y: 34, size: '6.5vw', rot: 6, pull: 50, mobile: false },
  { shape: 'heart', x: 32, y: 12, size: '6vw', rot: -15, pull: 52, mobile: false },
  { shape: 's', x: 52, y: 5, size: '5.5vw', rot: 22, pull: 56, mobile: false },
  { shape: 'pacman', x: 20, y: 74, size: '6vw', rot: -21, pull: 54, mobile: false },
  { shape: 'blob2', x: 84, y: 58, size: '7vw', rot: 12, pull: 48, mobile: false },
  { shape: 'star', x: 16, y: 62, size: '5.5vw', rot: -18, pull: 56, mobile: false },
];

// Footprint radius as a fraction of a shape's rendered width — used to keep
// motifs from overlapping. Thin shapes (squiggle/S/rectangle/ring) fill less of
// their box, so they pack closer; round/spiky ones get a near-full radius.
const FOOTPRINT = {
  circle: 0.5,
  blob1: 0.48,
  blob2: 0.48,
  blob3: 0.48,
  heart: 0.46,
  pacman: 0.48,
  splat: 0.5,
  star: 0.5,
  ring: 0.46,
  s: 0.4,
  rectangle: 0.4,
  squiggle: 0.4,
};

/* Extra squiggles scattered into the margins — count scales with screen size
   (more room → more squiggles). Slots are pre-placed (margin-safe); a random
   subset is activated each load. */
const SQUIGGLE_SLOTS = [
  { x: 20, y: 28, size: '8vw', rot: -12, pull: 52 },
  { x: 80, y: 30, size: '8vw', rot: 10, pull: 54 },
  { x: 84, y: 52, size: '7.5vw', rot: -8, pull: 50 },
  { x: 26, y: 62, size: '7.5vw', rot: 14, pull: 52 },
  { x: 54, y: 6, size: '8vw', rot: -6, pull: 56 },
  { x: 16, y: 44, size: '7vw', rot: 8, pull: 54 },
];

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Balanced-but-shuffled color per motif so the palette stays even (no all-one
// color) while still reading as random/mixed.
function assignColors(count) {
  const pool = [];
  for (let i = 0; i < count; i += 1) pool.push(COLORS[i % COLORS.length]);
  return shuffle(pool);
}

// Center (px) + footprint radius (px) for a placement, given the viewport. x is
// %-of-width, y is %-of-height, size is `NNvw` (width). A small PAD keeps a
// visible gap rather than letting shapes merely touch.
const PAD = 1.06;
function geom(m, vw, vh) {
  const widthPx = (parseFloat(m.size) / 100) * vw;
  return {
    cx: (m.x / 100) * vw,
    cy: (m.y / 100) * vh,
    r: widthPx * (FOOTPRINT[m.shape] ?? 0.5),
  };
}
function overlaps(a, b, vw, vh) {
  const ga = geom(a, vw, vh);
  const gb = geom(b, vw, vh);
  return Math.hypot(ga.cx - gb.cx, ga.cy - gb.cy) < (ga.r + gb.r) * PAD;
}

function buildMotifs() {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const isTablet = vw >= 768;
  // 3–4 extra squiggles on larger screens, 1 on phones.
  const extraCount = vw >= 1024 ? 4 : isTablet ? 3 : 1;

  const extras = shuffle(SQUIGGLE_SLOTS)
    .slice(0, extraCount)
    .map((slot) => ({ shape: 'squiggle', ...slot, mobile: !isTablet }));

  // Candidates in priority order; on phones only the mobile-visible ones matter.
  let candidates = [...BASE, ...extras];
  if (!isTablet) candidates = candidates.filter((c) => c.mobile);

  // Greedy de-overlap: keep a candidate only if it clears everything kept so
  // far (earlier = higher priority), so nothing in the final set overlaps.
  const kept = [];
  candidates.forEach((c) => {
    if (!kept.some((k) => overlaps(k, c, vw, vh))) kept.push(c);
  });

  const colors = assignColors(kept.length);
  return kept.map((p, i) => ({
    ...p,
    color: colors[i],
    // Per-shape hover nudge: ±4–9°, random direction, so each shape tilts a
    // slightly different way when hovered.
    hoverRot: ((Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 5)).toFixed(1),
  }));
}

function HomeAssemble() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);

  // Build once per mount: positions are fixed, colors + extra squiggles are
  // randomized (stable for the session so nothing reshuffles on re-render).
  const motifs = useMemo(() => buildMotifs(), []);

  useGSAP(
    () => {
      const els = gsap.utils.toArray('.home-assemble__motif', sectionRef.current);
      const lines = sectionRef.current.querySelectorAll(
        '.home-assemble__brand, .home-assemble__headline'
      );
      const mm = gsap.matchMedia();

      // Center each shape on its left/top anchor + bake the static resting tilt.
      const placeMotifs = () =>
        gsap.set(els, {
          xPercent: -50,
          yPercent: -50,
          rotation: (i, el) => Number(el.dataset.rot) || 0,
        });

      // Off-frame start offset: a motif begins `pull`% of the viewport outward
      // along its radial direction and converges to rest. Zero-arg closures so
      // GSAP re-resolves them against the live viewport size.
      const enterX = (el) => {
        const ux = Number(el.dataset.x) - 50;
        const uy = Number(el.dataset.y) - 50;
        const len = Math.hypot(ux, uy) || 1;
        const pull = Number(el.dataset.pull) || 40;
        return () => (ux / len) * (pull / 100) * window.innerWidth;
      };
      const enterY = (el) => {
        const ux = Number(el.dataset.x) - 50;
        const uy = Number(el.dataset.y) - 50;
        const len = Math.hypot(ux, uy) || 1;
        const pull = Number(el.dataset.pull) || 40;
        return () => (uy / len) * (pull / 100) * window.innerHeight;
      };

      // ---- Desktop: pin + scrub. Scroll drives the assemble both ways. ----
      mm.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        () => {
          placeMotifs();

          // Headline is present from the first frame (reveals once on load).
          gsap.from(lines, {
            autoAlpha: 0,
            y: 24,
            scale: 0.96,
            transformOrigin: '50% 100%',
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out',
          });

          const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              start: 'top top',
              end: '+=110%',
              scrub: 0.6,
            },
          });

          els.forEach((el) => {
            tl.fromTo(
              el,
              { x: enterX(el), y: enterY(el), scale: 0.8 },
              { x: 0, y: 0, scale: 1, duration: 1 },
              0
            );
          });
        }
      );

      // ---- Mobile: no pin, simple reveal as the section enters. ----
      mm.add(
        '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        () => {
          placeMotifs();
          const trigger = { trigger: sectionRef.current, start: 'top 80%' };
          gsap.from(els, {
            autoAlpha: 0,
            y: 20,
            scale: 0.85,
            stagger: 0.05,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: trigger,
          });
          gsap.from(lines, {
            autoAlpha: 0,
            y: 24,
            scale: 0.96,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: trigger,
          });
        }
      );

      // ---- Reduced motion: render the static settled layout, no transforms. ----
      mm.add('(prefers-reduced-motion: reduce)', () => {
        placeMotifs();
      });

      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="home-assemble">
      {motifs.map((m, i) => (
        <span
          key={i}
          className="home-assemble__motif"
          aria-hidden="true"
          data-x={m.x}
          data-y={m.y}
          data-pull={m.pull}
          data-rot={m.rot}
          data-mobile={m.mobile ? 'show' : 'hide'}
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            color: m.color,
            '--motif-size': m.size,
            '--motif-hover-rot': `${m.hoverRot}deg`,
          }}
        >
          {/* Inner element carries the hover "pop" so it never fights GSAP's
              transform on the wrapper. */}
          <span
            className="home-assemble__motif-shape"
            dangerouslySetInnerHTML={{ __html: SHAPES[m.shape] }}
          />
        </span>
      ))}

      <div className="home-assemble__inner" ref={headlineRef}>
        <p className="home-assemble__brand">{siteConfig.name}</p>
        <h1 className="home-assemble__headline">Designing Thoughtful Products</h1>
      </div>
    </section>
  );
}

export default HomeAssemble;
