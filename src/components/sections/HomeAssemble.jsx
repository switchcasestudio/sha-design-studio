import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { siteConfig } from '@/utils/siteConfig';
import BrandShape from '@/components/ui/BrandShape';
import { useTheme } from '@/theme/ThemeContext';
import SplitText from '@/theme/vivid/SplitText';
import WipeHeading from '@/theme/vivid/home/WipeHeading';
import { usePointerParallax } from '@/theme/vivid/home/usePointerParallax';
import { spring } from '@/theme/vivid/motion';
import './HomeAssemble.css';

const MotionShape = motion.create(BrandShape);

// The hero the client chose (a quieter take on the June "assemble" hero): a
// centred headline framed by a light ring of brand motifs resting in the side
// margins. On desktop the section pins and scrolling pops the motifs in from
// off-frame; scrolling back up sends them out again. No tilt anywhere, no
// overshoot: the motifs snap into place on power3.out.
//
// x / y = centre in % of the hero, size = width in vw, pull = how far out (% of
// the viewport) a motif starts. Corners start close so they peek on the first
// frame. The centre column is kept clear for the headline. mobile:true = one of
// the four corner shapes kept on phones.
// Motif colour names → brand tokens. All three primaries sit on cream.
const TINT = { blue: 'var(--pool)', yellow: 'var(--yolk)', orange: 'var(--tomato)' };

const MOTIFS = [
  // Corners — peek on the first frame.
  { shape: 'blob1', color: 'blue', x: 7, y: 20, size: 10, pull: 10, mobile: true },
  { shape: 'flower2', color: 'yellow', x: 92, y: 22, size: 8, pull: 10, mobile: true },
  { shape: 'splat2', color: 'orange', x: 90, y: 84, size: 9, pull: 10, mobile: true },
  { shape: 'heart', color: 'yellow', x: 9, y: 82, size: 9, pull: 10, mobile: true },
  // Mids — smaller accents that sweep in from further out.
  { shape: 'daisy', color: 'orange', x: 8, y: 51, size: 6, pull: 46 },
  { shape: 'clover', color: 'blue', x: 93, y: 52, size: 6, pull: 46 },
  { shape: 'flower1', color: 'orange', x: 19, y: 33, size: 5, pull: 52 },
  { shape: 'star', color: 'blue', x: 81, y: 35, size: 4.5, pull: 52 },
  { shape: 'splat1', color: 'blue', x: 18, y: 66, size: 5, pull: 54 },
  { shape: 'blob3', color: 'yellow', x: 82, y: 67, size: 5, pull: 54 },
  { shape: 'ring', color: 'blue', x: 27, y: 86, size: 4, pull: 56 },
  { shape: 'tulip', color: 'orange', x: 72, y: 86, size: 4.5, pull: 56 },
];

// Off-frame start offset along the motif's direction from the centre. Returned
// as a closure so GSAP re-resolves it against the live viewport on refresh.
function pullOffset(m, axis) {
  const ux = m.x - 50;
  const uy = m.y - 50;
  const len = Math.hypot(ux, uy) || 1;
  const unit = axis === 'x' ? ux / len : uy / len;
  return () =>
    unit * (m.pull / 100) * (axis === 'x' ? window.innerWidth : window.innerHeight);
}

// Vivid only: the motif's outer span keeps the GSAP scroll assemble; inside it
// a parallax layer drifts against the pointer (deeper = bigger shapes), and
// the shape itself can be grabbed, flung and springs home.
function VividMotif({ m, i, pointer }) {
  const depth = (m.size / 10) * (i % 2 ? -1 : 1) * 70;
  const px = useTransform(pointer.x, (v) => v * depth);
  const py = useTransform(pointer.y, (v) => v * depth);

  return (
    <span
      className="home-assemble__motif"
      data-mobile={m.mobile ? 'show' : 'hide'}
      style={{
        left: `${m.x}%`,
        top: `${m.y}%`,
        color: TINT[m.color],
        '--motif-size': `${m.size}vw`,
        '--float-delay': `${-i * 0.7}s`,
      }}
    >
      <motion.span className="home-assemble__parallax" style={{ x: px, y: py }}>
        <MotionShape
          shape={m.shape}
          className="home-assemble__drag"
          data-cursor="Drag"
          drag
          dragSnapToOrigin
          dragElastic={0.9}
          dragTransition={{ bounceStiffness: 260, bounceDamping: 9 }}
          whileHover={{ scale: 1.18, rotate: i % 2 ? -14 : 14 }}
          whileTap={{ scale: 0.88 }}
          whileDrag={{ scale: 1.3, rotate: 0, zIndex: 5 }}
          transition={spring.bouncy}
        />
      </motion.span>
    </span>
  );
}

function HomeAssemble() {
  const sectionRef = useRef(null);
  const { isVivid } = useTheme();
  const pointer = usePointerParallax(sectionRef, isVivid);

  useGSAP(
    () => {
      const els = gsap.utils.toArray('.home-assemble__motif', sectionRef.current);
      const mm = gsap.matchMedia();

      // ---- Desktop: pin + scrub. Scroll pops the motifs in, both ways. ----
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            start: 'top top',
            end: '+=100%',
            scrub: 0.6,
          },
        });

        els.forEach((el, i) => {
          const m = MOTIFS[i];
          tl.fromTo(
            el,
            { x: pullOffset(m, 'x'), y: pullOffset(m, 'y'), scale: 0.5 },
            {
              x: 0,
              y: 0,
              scale: 1,
              duration: 1,
              // Vivid lets the shapes overshoot and settle, the regular kit never does.
              ease: isVivid ? 'back.out(2.2)' : 'power3.out',
            },
            i * 0.04
          );
        });
      });

      // ---- Mobile: no pin — the corner shapes pop in as the hero shows. ----
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from(els, {
          autoAlpha: 0,
          scale: 0.5,
          stagger: 0.08,
          duration: isVivid ? 1.1 : 0.6,
          delay: isVivid ? 0.5 : 0.2,
          ease: isVivid ? 'elastic.out(1, 0.45)' : 'power3.out',
        });
      });

      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    },
    { scope: sectionRef, dependencies: [isVivid] }
  );

  return (
    <section
      ref={sectionRef}
      className={`home-assemble${isVivid ? ' home-assemble--vivid' : ''}`}
    >
      {isVivid
        ? MOTIFS.map((m, i) => <VividMotif key={i} m={m} i={i} pointer={pointer} />)
        : MOTIFS.map((m, i) => (
        <BrandShape
          key={i}
          shape={m.shape}
          className="home-assemble__motif"
          data-mobile={m.mobile ? 'show' : 'hide'}
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            color: TINT[m.color],
            '--motif-size': `${m.size}vw`,
          }}
        />
          ))}

      <div className="home-assemble__inner">
        <p className="home-assemble__brand">
          {isVivid ? (
            <SplitText text={siteConfig.name} by="chars" trigger="mount" delay={0.1} />
          ) : (
            siteConfig.name
          )}
        </p>
        <WipeHeading as="h1" className="home-assemble__headline" trigger="mount">
          Designing <span className="hl">thoughtful</span> products
        </WipeHeading>
      </div>

      {isVivid && (
        <motion.span
          className="home-assemble__hint"
          aria-hidden="true"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, ...spring.bouncy }}
        >
          Scroll · or grab a shape
        </motion.span>
      )}
    </section>
  );
}

export default HomeAssemble;
