import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { ease } from '@/lib/motion';
import { siteConfig } from '@/utils/siteConfig';
import blueShape1 from '@/assets/svg/blue-1.svg';
import blueShape2 from '@/assets/svg/blue-2.svg';
import creamShape1 from '@/assets/svg/cream-1.svg';
import creamShape2 from '@/assets/svg/cream-2.svg';
import redShape1 from '@/assets/svg/red-1.svg';
import redShape2 from '@/assets/svg/red-2.svg';
import redShape3 from '@/assets/svg/red-3.svg';
import yellowShape1 from '@/assets/svg/yellow-1.svg';
import yellowShape2 from '@/assets/svg/yellow-2.svg';
import yellowShape3 from '@/assets/svg/yellow-3.svg';
import './HomeAssemble.css';

/* Dense, balanced motif set — shapes used in their DESIGNED colors (some
   duplicated at different sizes for rhythm). `x`/`y` = rest position (% of the
   section); `size` varies dramatically (big hero shapes ↔ small accents);
   `pull` = how far out (% of viewport) it starts/scatters along its outward
   direction — small for the "anchor" shapes that are on-screen from the start,
   large for the flyers that sweep in from beyond the frame. All rest spots stay
   in the margins, clear of the centred headline. `mobile:false` shapes are
   hidden in the non-pinned mobile flow to avoid clutter. */
const MOTIFS = [
  // Big anchors — already on-screen at the start of the pin (no empty scene).
  { src: yellowShape2, x: 18, y: 17, size: '16vw', rot: -8, pull: 16, mobile: true },
  { src: redShape2, x: 86, y: 21, size: '14vw', rot: 7, pull: 18, mobile: true },
  { src: blueShape2, x: 84, y: 79, size: '15vw', rot: -6, pull: 16, mobile: true },
  { src: creamShape1, x: 15, y: 80, size: '13vw', rot: 9, pull: 18, mobile: true },
  // Mids — fly in from further out.
  { src: blueShape1, x: 9, y: 48, size: '10vw', rot: -12, pull: 50, mobile: true },
  { src: yellowShape1, x: 91, y: 49, size: '10vw', rot: 12, pull: 50, mobile: true },
  { src: redShape3, x: 50, y: 9, size: '9vw', rot: 6, pull: 52, mobile: false },
  { src: redShape1, x: 31, y: 90, size: '8.5vw', rot: 8, pull: 48, mobile: true },
  // Small accents — sweep in from far off-frame.
  { src: yellowShape3, x: 69, y: 89, size: '6.5vw', rot: 14, pull: 60, mobile: false },
  { src: creamShape2, x: 7, y: 31, size: '7vw', rot: -10, pull: 58, mobile: false },
  { src: redShape2, x: 67, y: 8, size: '6vw', rot: 16, pull: 62, mobile: false },
  { src: blueShape1, x: 95, y: 35, size: '5.5vw', rot: -14, pull: 64, mobile: false },
  { src: yellowShape2, x: 40, y: 7, size: '7vw', rot: -7, pull: 56, mobile: false },
];

function HomeAssemble() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);

  useGSAP(
    () => {
      const motifs = gsap.utils.toArray('.home-assemble__motif', sectionRef.current);
      const mm = gsap.matchMedia();

      // ---- Desktop: full pin + scrubbed assemble ----
      mm.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.set(motifs, { xPercent: -50, yPercent: -50 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              // Wider hold gives the bigger travel room to read (still capped).
              end: '+=140%',
              scrub: 0.6,
              pin: true,
              // Layout wraps each route in a transformed motion.div; pinning
              // via transform (not position:fixed) stays correct inside it.
              pinType: 'transform',
              anticipatePin: 1,
              invalidateOnRefresh: true,
              // Dev-only scrub readout (verification aid; stripped from prod builds).
              onUpdate: import.meta.env.DEV
                ? (self) => console.log('[home-assemble] progress', self.progress.toFixed(2))
                : undefined,
            },
          });

          // Headline centerpiece: subtle scale through the pinned frame.
          tl.fromTo(
            headlineRef.current,
            { scale: 0.95 },
            { scale: 1, ease: 'none', duration: 0.55 },
            0
          ).to(headlineRef.current, { scale: 1.04, ease: 'none', duration: 0.45 }, 0.55);

          // Motifs: sweep in from off-frame with rotation + scale (overshoot),
          // settle densely around the headline by ~0.55, then sweep back out
          // and off-frame, fading, by 1.
          motifs.forEach((el, i) => {
            const cx = Number(el.dataset.x);
            const cy = Number(el.dataset.y);
            const pull = Number(el.dataset.pull) || 40;
            const restRot = Number(el.dataset.rot) || 0;
            // Outward unit direction from the section centre.
            const ux = cx - 50;
            const uy = cy - 50;
            const len = Math.hypot(ux, uy) || 1;
            const nx = ux / len;
            const ny = uy / len;
            // Stable per-element start tilt (-50°..+50°), never re-randomized.
            const startRot = (i % 2 ? 1 : -1) * (32 + ((i * 9) % 18));

            const enterX = () => nx * (pull / 100) * window.innerWidth;
            const enterY = () => ny * (pull / 100) * window.innerHeight;
            const exitX = () => nx * 0.85 * window.innerWidth;
            const exitY = () => ny * 0.85 * window.innerHeight;

            tl.fromTo(
              el,
              {
                x: enterX,
                y: enterY,
                scale: 0.4,
                rotation: startRot,
                // Biased visible from the start — never fade up from 0.
                autoAlpha: 1,
              },
              {
                x: 0,
                y: 0,
                scale: 1,
                rotation: restRot,
                autoAlpha: 1,
                ease: ease.bloomGsap,
                duration: 0.55,
              },
              0
            ).to(
              el,
              {
                x: exitX,
                y: exitY,
                scale: 0.5,
                rotation: startRot * -0.6,
                autoAlpha: 0,
                ease: ease.scatterGsap,
                duration: 0.45,
              },
              0.55
            );
          });
        }
      );

      // ---- Mobile: no pin, simple fade/slide-in as the section enters ----
      mm.add(
        '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.set(motifs, { xPercent: -50, yPercent: -50 });
          gsap.from(motifs, {
            autoAlpha: 0,
            y: 20,
            scale: 0.8,
            stagger: 0.06,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          });
        }
      );

      // ---- Reduced motion: no JS — base CSS shows the final layout ----

      // Text centerpiece + font load both shift layout; recompute pin math
      // afterwards. (ScrollTrigger already refreshes on resize.)
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
