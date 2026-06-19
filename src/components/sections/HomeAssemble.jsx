import { useMemo, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { siteConfig } from '@/utils/siteConfig';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import LetterShapeMorph from '@/components/lab/LetterShapeMorph';
import { SHA_MORPHS } from '@/components/lab/brandMorphs';

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

/* The composition is generated per load (see buildMotifs): every shape TYPE
   below appears at least twice, dropped into the margin "slots" with a randomised
   size and tilt. Fewer, more deliberate motifs than the old dense field.
   Slots all sit at y ≥ 17% so the sticky header never clips a motif. */
const DESKTOP_TYPES = [
  'heart', 'star', 'circle', 'squiggle', 'splat',
  'ring', 'pacman', 's', 'blob2', 'rectangle',
];
const MOBILE_TYPES = ['heart', 'star', 'circle', 'squiggle', 'splat', 'blob2'];

// Margin ring around the centred headline. Center band (x 22–78, y 26–84) is
// left clear for the text; the top row clears the navbar.
const DESKTOP_SLOTS = [
  // left band
  { x: 8, y: 20 }, { x: 13, y: 35 }, { x: 7, y: 50 }, { x: 14, y: 65 }, { x: 8, y: 80 }, { x: 13, y: 91 },
  // right band
  { x: 92, y: 20 }, { x: 87, y: 35 }, { x: 93, y: 50 }, { x: 86, y: 65 }, { x: 92, y: 80 }, { x: 88, y: 91 },
  // top band (below the header)
  { x: 28, y: 19 }, { x: 44, y: 18 }, { x: 60, y: 18 }, { x: 74, y: 19 },
  // bottom band
  { x: 30, y: 90 }, { x: 46, y: 93 }, { x: 62, y: 91 }, { x: 74, y: 90 },
];

const MOBILE_SLOTS = [
  { x: 11, y: 19 }, { x: 88, y: 21 }, { x: 9, y: 41 }, { x: 90, y: 43 },
  { x: 12, y: 65 }, { x: 87, y: 63 }, { x: 11, y: 85 }, { x: 88, y: 85 },
  { x: 33, y: 17 }, { x: 66, y: 17 }, { x: 35, y: 90 }, { x: 64, y: 90 },
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

  const types = isTablet ? DESKTOP_TYPES : MOBILE_TYPES;
  const slots = isTablet ? DESKTOP_SLOTS : MOBILE_SLOTS;

  // Two of every type (guarantees ≥2 of each), shuffled across shuffled slots.
  const instances = shuffle(types.flatMap((t) => [t, t]));
  const chosen = shuffle(slots).slice(0, instances.length);

  const kept = [];
  chosen.forEach((slot, i) => {
    const shape = instances[i];
    // Randomised size — "play with the sizes". Wider range on desktop.
    let size = (isTablet ? 5.5 : 7) + Math.random() * (isTablet ? 6.5 : 4);
    let cand = { shape, x: slot.x, y: slot.y, size: `${size.toFixed(1)}vw` };
    // Shrink (never drop) until it clears everything already placed, so the
    // "2 of each" guarantee always holds even if a big size would collide.
    let guard = 0;
    while (kept.some((k) => overlaps(k, cand, vw, vh)) && guard < 8) {
      size *= 0.82;
      cand = { ...cand, size: `${size.toFixed(1)}vw` };
      guard += 1;
    }
    cand.pull = 44 + Math.random() * 18; // off-frame start distance for the sweep-in
    cand.rot = Math.round((Math.random() * 2 - 1) * 18);
    cand.mobile = true;
    kept.push(cand);
  });

  const colors = assignColors(kept.length);
  return kept.map((p, i) => ({
    ...p,
    color: colors[i],
    // Per-shape hover nudge: ±4–9°, random direction.
    hoverRot: ((Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 5)).toFixed(1),
  }));
}

function HomeAssemble() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  // Scroll progress (0..1) of the pin, written by ScrollTrigger and read each
  // frame by the headline morph so the letters bloom into shapes as you scroll.
  const morphProgress = useRef(0);
  const isDesktop = useMediaQuery('(min-width: 768px)');

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
              // Pin runs ~1.3 viewports: the shapes finish assembling in the
              // first half, then the assembled "peak" frame is HELD for the
              // second half — the user keeps scrolling but stays on this frame
              // for a beat before the page continues.
              end: '+=130%',
              scrub: 0.6,
              // Feed pin progress to the headline letter↔shape morph.
              onUpdate: (self) => {
                morphProgress.current = self.progress;
              },
            },
          });

          // Convergence occupies the first timeline unit (0 → 1)…
          els.forEach((el) => {
            tl.fromTo(
              el,
              { x: enterX(el), y: enterY(el), scale: 0.8 },
              { x: 0, y: 0, scale: 1, duration: 1 },
              0
            );
          });
          // …then an empty hold unit (1 → 2) keeps the assembled frame on screen
          // while the user scrolls a little further, before unpinning.
          tl.to({}, { duration: 1 });
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
        <p className="home-assemble__brand">Designing Playful Products</p>
        {/* The wordmark: dots spell "Sha Design Studio"; on desktop the pin's
            scroll progress blooms the letters into brand motifs (a→heart,
            g→flower, o→star) and back. On mobile it auto-loops. */}
        <h1 className="home-assemble__headline">
          <span className="sr-only">{siteConfig.name}</span>
          <LetterShapeMorph
            className="home-assemble__morph"
            text={siteConfig.name}
            morphs={SHA_MORPHS}
            progressRef={isDesktop ? morphProgress : null}
            baseColor={[229, 75, 42]}
            background="transparent"
            dotSize={2.2}
          />
        </h1>
      </div>
    </section>
  );
}

export default HomeAssemble;
