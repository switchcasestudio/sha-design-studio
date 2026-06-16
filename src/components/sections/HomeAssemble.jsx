import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { projects } from '@/data';
import { ease } from '@/lib/motion';
import blueShape1 from '@/assets/svg/blue-1.svg';
import blueShape2 from '@/assets/svg/blue-2.svg';
import redShape1 from '@/assets/svg/red-1.svg';
import redShape3 from '@/assets/svg/red-3.svg';
import yellowShape1 from '@/assets/svg/yellow-1.svg';
import './HomeAssemble.css';

// Centerpiece: the strongest product shot (5-in-1 activity center hero).
const centerpiece =
  projects.find((p) => p.id === 'here-i-grow-activity-center')?.heroImage ??
  projects[0].heroImage;

// ~5 curated motifs resting in the side margins / corners — never over the
// centred product. `from` is the edge each converges from; `fy` a small
// vertical offset for variety; `rot` the resting tilt.
const MOTIFS = [
  { src: blueShape1, left: '9%', top: '20%', size: '10vw', from: 'left', fy: -6, rot: -14 },
  { src: redShape1, left: '85%', top: '15%', size: '8vw', from: 'right', fy: -8, rot: 12 },
  { src: blueShape2, left: '12%', top: '70%', size: '9vw', from: 'left', fy: 10, rot: 9 },
  { src: redShape3, left: '83%', top: '66%', size: '11vw', from: 'right', fy: 8, rot: -10 },
  { src: yellowShape1, left: '92%', top: '42%', size: '7vw', from: 'right', fy: -4, rot: 16 },
];

function HomeAssemble() {
  const sectionRef = useRef(null);
  const productRef = useRef(null);

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

          // Centerpiece: subtle scale through the pinned frame.
          tl.fromTo(
            productRef.current,
            { scale: 0.95 },
            { scale: 1, ease: 'none', duration: 0.6 },
            0
          ).to(productRef.current, { scale: 1.05, ease: 'none', duration: 0.4 }, 0.6);

          // Motifs: converge (0→0.6, playful overshoot) then scatter (0.6→1).
          motifs.forEach((el) => {
            const dir = el.dataset.from === 'right' ? 1 : -1;
            const fy = Number(el.dataset.fy) || 0;
            const rot = Number(el.dataset.rot) || 0;
            const enterX = () => dir * window.innerWidth * 0.55;
            const exitX = () => dir * window.innerWidth * 0.6;

            tl.fromTo(
              el,
              { x: enterX, y: () => fy, scale: 0.4, autoAlpha: 0, rotation: rot - 30 },
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
                x: exitX,
                y: () => fy,
                scale: 0.6,
                autoAlpha: 0,
                rotation: rot - 20,
                ease: 'power2.in',
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
            stagger: 0.08,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          });
        }
      );

      // ---- Reduced motion: no JS — base CSS already shows the final layout ----

      // Fonts change layout once loaded; recompute pin math afterwards.
      // (ScrollTrigger already refreshes on resize.)
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="home-assemble" aria-label="Playful by design">
      {MOTIFS.map((m) => (
        <img
          key={m.src}
          className="home-assemble__motif"
          src={m.src}
          alt=""
          aria-hidden="true"
          data-from={m.from}
          data-fy={m.fy}
          data-rot={m.rot}
          style={{ left: m.left, top: m.top, '--motif-size': m.size }}
        />
      ))}

      <div className="home-assemble__inner">
        <figure className="home-assemble__product" ref={productRef}>
          <img
            src={centerpiece.src}
            alt={centerpiece.alt}
            width={centerpiece.width}
            height={centerpiece.height}
            loading="lazy"
          />
        </figure>
        <p className="home-assemble__caption">Designed for the way little ones play</p>
      </div>
    </section>
  );
}

export default HomeAssemble;
