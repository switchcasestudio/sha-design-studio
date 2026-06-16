import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { ease } from '@/lib/motion';
import { siteConfig } from '@/utils/siteConfig';
import blueShape1 from '@/assets/svg/blue-1.svg';
import blueShape2 from '@/assets/svg/blue-2.svg';
import redShape1 from '@/assets/svg/red-1.svg';
import redShape2 from '@/assets/svg/red-2.svg';
import redShape3 from '@/assets/svg/red-3.svg';
import yellowShape2 from '@/assets/svg/yellow-2.svg';
import yellowShape3 from '@/assets/svg/yellow-3.svg';
import './HomeAssemble.css';

/* Curated motif set — shapes used in their DESIGNED colors (no recolor); the
   multi-color variety comes from which shapes are placed where. Balanced so no
   color clusters on one side: blue on opposite corners, reds spread top/left/
   right, yellows top-right + bottom. `x`/`y` are rest positions (% of the
   section); each converges in from off-screen in the direction of its rest
   spot and scatters back out the same way. All rest spots stay in the margins,
   clear of the centred headline. */
const MOTIFS = [
  { src: blueShape1, x: 11, y: 25, size: '8vw', rot: -12 }, // blob/flower, upper-left
  { src: redShape3, x: 50, y: 9, size: '6.5vw', rot: 6 }, // splat, top-centre
  { src: yellowShape3, x: 88, y: 19, size: '6vw', rot: 12 }, // smiley, upper-right
  { src: redShape1, x: 8, y: 63, size: '7vw', rot: 8 }, // heart, lower-left
  { src: blueShape2, x: 90, y: 64, size: '8.5vw', rot: -10 }, // flower, lower-right
  { src: yellowShape2, x: 50, y: 92, size: '6.5vw', rot: -6 }, // flower, bottom-centre
  { src: redShape2, x: 82, y: 43, size: '5.5vw', rot: 14 }, // blob, right-mid (closer in)
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
              end: '+=110%',
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
            { scale: 0.97 },
            { scale: 1, ease: 'none', duration: 0.6 },
            0
          ).to(headlineRef.current, { scale: 1.03, ease: 'none', duration: 0.4 }, 0.6);

          // Motifs converge from off-screen (0→0.6, playful overshoot) toward
          // their resting spots, then scatter back out (0.6→1).
          motifs.forEach((el) => {
            const cx = Number(el.dataset.x);
            const cy = Number(el.dataset.y);
            const rot = Number(el.dataset.rot) || 0;
            // Direction = where the motif rests relative to centre, pushed off-edge.
            const dirX = (cx - 50) / 50;
            const dirY = (cy - 50) / 50;
            const enterX = () => dirX * window.innerWidth * 0.6;
            const enterY = () => dirY * window.innerHeight * 0.6;

            tl.fromTo(
              el,
              { x: enterX, y: enterY, scale: 0.4, autoAlpha: 0, rotation: rot - 30 },
              {
                x: 0,
                y: 0,
                scale: 1,
                autoAlpha: 1,
                rotation: rot,
                ease: ease.bloomGsap,
                duration: 0.6,
              },
              0
            ).to(
              el,
              {
                x: () => enterX() * 1.1,
                y: () => enterY() * 1.1,
                scale: 0.55,
                autoAlpha: 0,
                rotation: rot - 20,
                ease: ease.scatterGsap,
                duration: 0.4,
              },
              0.6
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
            stagger: 0.07,
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
      {MOTIFS.map((m) => (
        <img
          key={m.src}
          className="home-assemble__motif"
          src={m.src}
          alt=""
          aria-hidden="true"
          data-x={m.x}
          data-y={m.y}
          data-rot={m.rot}
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
