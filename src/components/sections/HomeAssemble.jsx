import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { siteConfig } from '@/utils/siteConfig';
// Rounded / soft brand motifs — already authored in the palette, so they're
// shown in their native colors (no masking/recolor needed). The angular shape-
// sorter pieces (squares, triangles, L, dome…) were retired to keep the hero
// round and soft.
import circle from '@/assets/svg/02_circle.svg';
import squiggle from '@/assets/svg/04_squiggle.svg';
import pacman from '@/assets/svg/05_pacman.svg';
import rectangle from '@/assets/svg/09_rectangle.svg';
import star from '@/assets/svg/12_star.svg';
import ring from '@/assets/svg/13_ring.svg';
import sShape from '@/assets/svg/15_S.svg';
// Organic blobs + heart.
import blueBlob from '@/assets/svg/blue-1.svg';
import blueBlob2 from '@/assets/svg/blue-2.svg';
import orangeHeart from '@/assets/svg/orange-1.svg';
import orangeSplat from '@/assets/svg/orange-3.svg';
import yellowBlob from '@/assets/svg/yellow-2.svg';
import './HomeAssemble.css';

/* The round/soft motif set (12 brand shapes — 5 yellow / 5 blue / 2 orange),
   hand-placed so the same color never clusters and the central headline stays
   clear. Each is shown in its native brand color as an <img>. x/y = rest
   position (%); size varies; rot = static resting tilt; pull = how far out (% of
   viewport) it starts — small for the edge "hint" shapes that peek into the
   first screen, large for the accents that travel in from far off-frame. Both
   oranges (heart + splat) are hint shapes so the warm accent reads on the first
   frame. Every shape moves A→B exactly ONCE and stays. mobile:false = hidden on
   the thinner mobile flow. */
const MOTIFS = [
  // Edge "hint" shapes — peek into the first screen, travel a short distance.
  { src: blueBlob, x: 6, y: 22, size: '14vw', rot: -8, pull: 8, mobile: true },
  { src: circle, x: 94, y: 26, size: '11vw', rot: 7, pull: 8, mobile: true },
  { src: orangeSplat, x: 90, y: 82, size: '14vw', rot: -6, pull: 8, mobile: true },
  { src: orangeHeart, x: 10, y: 84, size: '12vw', rot: 9, pull: 8, mobile: true }, // heart
  // Mids — travel in from further out.
  { src: star, x: 8, y: 50, size: '8vw', rot: -12, pull: 46, mobile: true },
  { src: blueBlob2, x: 95, y: 44, size: '9vw', rot: 10, pull: 46, mobile: true },
  { src: yellowBlob, x: 92, y: 62, size: '8vw', rot: -8, pull: 46, mobile: true },
  { src: pacman, x: 66, y: 11, size: '7vw', rot: -9, pull: 48, mobile: true },
  // Accents — sweep in from far off-frame.
  { src: squiggle, x: 40, y: 7, size: '7vw', rot: 6, pull: 56, mobile: false },
  { src: rectangle, x: 40, y: 92, size: '7vw', rot: -5, pull: 58, mobile: false },
  { src: sShape, x: 62, y: 90, size: '6vw', rot: 10, pull: 60, mobile: false },
  { src: ring, x: 8, y: 68, size: '6vw', rot: -14, pull: 62, mobile: false },
];

function HomeAssemble() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);

  useGSAP(
    () => {
      const motifs = gsap.utils.toArray('.home-assemble__motif', sectionRef.current);
      const lines = sectionRef.current.querySelectorAll(
        '.home-assemble__brand, .home-assemble__headline'
      );
      const mm = gsap.matchMedia();

      // Center each shape on its left/top anchor + bake the static resting tilt.
      // GSAP only animates translate/scale (and the headline's opacity) on top.
      const placeMotifs = () =>
        gsap.set(motifs, {
          xPercent: -50,
          yPercent: -50,
          rotation: (i, el) => Number(el.dataset.rot) || 0,
        });

      // Off-frame start offset for a motif: it begins `pull`% of the viewport
      // outward along its radial direction from the headline and converges to
      // rest (x:0, y:0). Returned as zero-arg closures (capturing the per-shape
      // direction) so GSAP re-resolves them against the live viewport size.
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

      // ---- Desktop: pin + scrub. Scroll position drives the assemble in BOTH
      // directions — scroll down converges the shapes around the headline,
      // scroll up reverses it. Motion is smooth (power2.inOut underneath), the
      // user's scroll speed sets the pace; no bounce/overshoot. ----
      mm.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        () => {
          placeMotifs();

          // Headline is present from the FIRST frame — it reveals once on load
          // (not tied to scroll), so the hero is never an empty frame. The
          // shapes then assemble around the already-visible headline on scroll.
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

          // Every shape converges over the full progress (0→1), tracking scroll.
          // Visible the whole time (the 4 hint shapes peek at the corners on the
          // first frame; far accents are clipped off-frame), so there's no fade
          // flicker — just a translate + gentle scale toward rest.
          motifs.forEach((el) => {
            tl.fromTo(
              el,
              { x: enterX(el), y: enterY(el), scale: 0.8 },
              { x: 0, y: 0, scale: 1, duration: 1 },
              0
            );
          });
        }
      );

      // ---- Mobile: no pin (a pinned/scrubbed section fights touch scroll).
      // A simple non-scrubbed reveal as the section enters. ----
      mm.add(
        '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        () => {
          placeMotifs();
          const trigger = { trigger: sectionRef.current, start: 'top 80%' };

          gsap.from(motifs, {
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

      // Font load shifts the headline's size; recompute pin/trigger geometry
      // after it resolves. (ScrollTrigger already refreshes on resize.)
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="home-assemble">
      {MOTIFS.map((m, i) => (
        <img
          key={i}
          className="home-assemble__motif"
          src={m.src}
          alt=""
          aria-hidden="true"
          data-x={m.x}
          data-y={m.y}
          data-pull={m.pull}
          data-rot={m.rot}
          data-mobile={m.mobile ? 'show' : 'hide'}
          style={{ left: `${m.x}%`, top: `${m.y}%`, '--motif-size': m.size }}
        />
      ))}

      <div className="home-assemble__inner" ref={headlineRef}>
        <p className="home-assemble__brand">{siteConfig.name}</p>
        <h1 className="home-assemble__headline">Designing Thoughtful Products</h1>
      </div>
    </section>
  );
}

export default HomeAssemble;
