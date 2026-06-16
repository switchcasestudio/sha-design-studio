import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { ease } from '@/lib/motion';
import { siteConfig } from '@/utils/siteConfig';
import blueShape1 from '@/assets/svg/blue-1.svg';
import blueShape2 from '@/assets/svg/blue-2.svg';
import orangeShape1 from '@/assets/svg/orange-1.svg'; // heart
import orangeShape2 from '@/assets/svg/orange-2.svg'; // blob
import orangeShape3 from '@/assets/svg/orange-3.svg'; // splat
import yellowShape1 from '@/assets/svg/yellow-1.svg';
import yellowShape2 from '@/assets/svg/yellow-2.svg';
import yellowShape3 from '@/assets/svg/yellow-3.svg'; // smiley
import './HomeAssemble.css';

/* Dense, balanced motif set — blue / orange / yellow only (cream vanishes on
   cream; no black). Distinct silhouettes (heart, splat, blobs, flowers,
   smiley), some duplicated at different sizes for rhythm.
   x/y = rest position (% of the section). size varies dramatically (big hero
   shapes ↔ small accents). pull = how far out (% of viewport) it starts /
   scatters along its outward direction: small for the edge "hint" shapes that
   peek into the first viewport, large for the flyers that sweep in from beyond
   the frame. All rest spots stay in the margins, clear of the centred headline.
   mobile:false shapes are hidden in the non-pinned mobile flow. */
const MOTIFS = [
  // Edge "hint" shapes — peek into the first viewport before any scroll.
  { src: yellowShape2, x: 6, y: 22, size: '16vw', rot: -8, pull: 8, mobile: true },
  { src: orangeShape2, x: 94, y: 26, size: '15vw', rot: 7, pull: 8, mobile: true },
  { src: blueShape2, x: 90, y: 82, size: '16vw', rot: -6, pull: 8, mobile: true },
  { src: orangeShape3, x: 10, y: 84, size: '14vw', rot: 9, pull: 8, mobile: true },
  // Mids — fly in from further out.
  { src: blueShape1, x: 8, y: 50, size: '9.5vw', rot: -12, pull: 48, mobile: true },
  { src: yellowShape1, x: 92, y: 52, size: '9.5vw', rot: 12, pull: 48, mobile: true },
  { src: orangeShape1, x: 33, y: 91, size: '8vw', rot: 8, pull: 46, mobile: true }, // heart
  { src: yellowShape3, x: 68, y: 10, size: '7.5vw', rot: -10, pull: 50, mobile: false }, // smiley
  // Small accents — sweep in from far off-frame.
  { src: orangeShape3, x: 50, y: 8, size: '6.5vw', rot: 6, pull: 56, mobile: false },
  { src: blueShape1, x: 95, y: 40, size: '5.5vw', rot: -14, pull: 64, mobile: false },
  { src: yellowShape2, x: 40, y: 6, size: '6vw', rot: -7, pull: 58, mobile: false },
  { src: orangeShape2, x: 72, y: 90, size: '6vw', rot: 14, pull: 60, mobile: false },
  { src: blueShape2, x: 18, y: 12, size: '7vw', rot: 11, pull: 54, mobile: false },
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

      // ---- Headline entrance + float (any width, motion allowed) ----
      // The headline IS the hero: it scales up, rises and fades in with a
      // playful overshoot, then breathes with a subtle continuous float so it
      // never feels dead while pinned.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(lines, {
          autoAlpha: 0,
          y: 44,
          scale: 0.84,
          transformOrigin: '50% 100%',
          stagger: 0.12,
          duration: 0.7,
          ease: ease.bloomGsap,
        });
        gsap.to(headlineRef.current, {
          y: 10,
          duration: 3.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });

      // ---- Desktop: full pin + scrubbed assemble of the orbiting shapes ----
      mm.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.set(motifs, { xPercent: -50, yPercent: -50 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
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

          // Shapes orbit the headline: sweep in from off-frame with rotation +
          // scale (overshoot), settle by ~0.55, then sweep back out and fade.
          motifs.forEach((el, i) => {
            const cx = Number(el.dataset.x);
            const cy = Number(el.dataset.y);
            const pull = Number(el.dataset.pull) || 40;
            const restRot = Number(el.dataset.rot) || 0;
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
              { x: enterX, y: enterY, scale: 0.4, rotation: startRot, autoAlpha: 1 },
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
