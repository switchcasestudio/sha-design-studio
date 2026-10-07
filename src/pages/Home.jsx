import { Link } from 'react-router-dom';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useRef } from 'react';
import Button from '@/components/ui/Button';
import HomeAssemble from '@/components/sections/HomeAssemble';
import HomeWorkGrid from '@/components/sections/HomeWorkGrid';
import JourneyPath from '@/components/sections/JourneyPath';
import SocialProof from '@/components/sections/SocialProof';
import CtaBand from '@/components/sections/CtaBand';
import { reducedReveal, rise, slideUp } from '@/lib/motion';
import { siteConfig } from '@/utils/siteConfig';
import { testimonials } from '@/data/testimonials';
import shiranAtWork from '@/assets/images/shiran-in-photoshooting.png';
import { useTheme } from '@/theme/ThemeContext';
import Magnetic from '@/theme/vivid/Magnetic';
import SplitText from '@/theme/vivid/SplitText';
import WipeHeading from '@/theme/vivid/home/WipeHeading';
import { usePointerParallax } from '@/theme/vivid/home/usePointerParallax';
import { spring } from '@/theme/vivid/motion';
import './Home.css';

// Vivid: colour worlds arrive from further down, a little small, and spring
// into place instead of the kit's single 16px rise.
const vividWorld = {
  hidden: { opacity: 0, y: 110, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring.soft },
};

// Color-world block: slides up and settles on enter (position/opacity only —
// the block's own background color is never touched).
function ColorWorld({ children, className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { isVivid } = useTheme();
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      className={className}
      variants={reduce ? reducedReveal : isVivid ? vividWorld : slideUp}
      initial={reduce ? 'show' : 'hidden'}
      animate={inView ? 'show' : undefined}
    >
      {children}
    </motion.section>
  );
}

// "What I do" photo. Vivid: the photo drifts inside its frame as the panel
// scrolls past, zooms on hover, and a spinning sticker rides its corner.
function WhatMedia() {
  const { isVivid } = useTheme();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  const image = (
    <img
      className="home-what__image"
      src={shiranAtWork}
      alt={`${siteConfig.designer} at work in a product photoshoot`}
      loading="lazy"
    />
  );

  if (!isVivid) return <div className="home-what__media">{image}</div>;

  return (
    <div ref={ref} className="home-what__media home-what__media--vivid">
      <motion.div className="home-what__parallax" style={{ y }}>
        {image}
      </motion.div>
      <span className="home-what__sticker" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <defs>
            <path id="home-what-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
          </defs>
          <text>
            <textPath href="#home-what-ring">
              sketch · prototype · shelf · sketch · prototype · shelf ·
            </textPath>
          </text>
        </svg>
        <span className="home-what__sticker-core">✦</span>
      </span>
    </div>
  );
}

// Kind-words pool card. Vivid: a soft light trails the pointer behind
// the quotes, and each quote's words rise in as it scrolls into view.
function WordsCard({ children }) {
  const { isVivid } = useTheme();
  const ref = useRef(null);
  const pointer = usePointerParallax(ref, isVivid);
  const left = useTransform(pointer.x, (v) => `${(v + 0.5) * 100}%`);
  const top = useTransform(pointer.y, (v) => `${(v + 0.5) * 100}%`);

  return (
    <div ref={ref} className="home-words__card ground-pool">
      {isVivid && (
        <motion.span
          className="home-words__spot"
          aria-hidden="true"
          style={{ left, top }}
        />
      )}
      {children}
    </div>
  );
}

function Home() {
  const reduce = useReducedMotion();
  const { isVivid } = useTheme();
  const servicesButton = (
    <Button as={Link} to="/services" variant="dark" size="md">
      Explore my services
    </Button>
  );

  return (
    <>
      {/* ---------- Hero: calm centred headline framed by brand motifs ---------- */}
      <HomeAssemble />

      {/* ---------- Social proof: partner / client logo marquee ---------- */}
      <SocialProof />

      {/* ---------- Featured work: the homepage finally shows the work ---------- */}
      <ColorWorld className="home-work">
        <HomeWorkGrid />
      </ColorWorld>

      {/* ---------- The designer's journey — a dotted play-path drawn straight
          on the cream canvas (no box), stops popping in along it. */}
      <section className="journey">
        <JourneyPath />
      </section>

      {/* ---------- "What I do" — the yolk panel ---------- */}
      <ColorWorld className="home-what">
        <div className="container">
          <div className="home-what__panel ground-yolk">
            <div className="home-what__copy">
              <WipeHeading as="h2" className="home-what__title">
                What I <span className="hl">do</span>
              </WipeHeading>

              {/* Teaser copy — deliberately distinct from the Services-page
                  intro (which lays out the full process). Home hints; Services
                  delivers the detail. */}
              <p className="home-what__text">
                I bring ideas to life through playful, thoughtful product design
                — from first sketch to production.
              </p>

              {isVivid ? (
                <Magnetic className="home-what__magnet">{servicesButton}</Magnetic>
              ) : (
                servicesButton
              )}
            </div>

            <WhatMedia />
          </div>
        </div>
      </ColorWorld>

      {/* ---------- Kind words — one pool panel holding every quote ---------- */}
      <ColorWorld className="home-words">
        <div className="container">
          <WordsCard>
            <WipeHeading as="h2" className="home-words__title">
              Kind <span className="hl">words</span>
            </WipeHeading>

            {/* TODO: verify testimonial attribution — the only quote is credited
                to "Jaya Dixon" but its text refers to "Channing" and to interior
                "space", which doesn't match Sha / Shiran Bar's product work.
                Likely placeholder/wrong-domain copy. Don't ship as-is; confirm a
                real testimonial + attribution before launch. */}
            {testimonials.map((testimonial, index) => (
              <motion.figure
                key={testimonial.id}
                className="home-words__item"
                initial={reduce ? false : { opacity: 0, y: isVivid ? 40 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={
                  isVivid
                    ? { ...spring.soft, delay: index * 0.15 }
                    : { ...rise, delay: index * 0.08 }
                }
              >
                {isVivid && (
                  <motion.span
                    className="home-words__mark"
                    aria-hidden="true"
                    initial={{ scale: 0, rotate: -40 }}
                    whileInView={{ scale: 1, rotate: index % 2 ? 8 : -8 }}
                    viewport={{ once: true }}
                    transition={{ ...spring.wobbly, delay: 0.1 + index * 0.15 }}
                  >
                    &ldquo;
                  </motion.span>
                )}
                <blockquote className="home-words__quote">
                  <p>
                    {isVivid ? (
                      <SplitText text={`“${testimonial.comment}”`} />
                    ) : (
                      <>&ldquo;{testimonial.comment}&rdquo;</>
                    )}
                  </p>
                </blockquote>

                <figcaption className="home-words__attribution">
                  {testimonial.image && (
                    <img
                      className="home-words__avatar"
                      src={testimonial.image}
                      alt=""
                      loading="lazy"
                    />
                  )}
                  <cite className="home-words__cite">
                    <span className="home-words__name">
                      &mdash; {testimonial.name}
                    </span>
                    {testimonial.title && (
                      <span className="home-words__role">
                        {testimonial.title}
                      </span>
                    )}
                  </cite>
                </figcaption>
              </motion.figure>
            ))}
          </WordsCard>
        </div>
      </ColorWorld>

      {/* ---------- Closing panel: the page's last word before the footer ---------- */}
      <CtaBand
        title={
          <>
            Got an idea? Let&apos;s make it <span className="hl">real</span>
          </>
        }
        text="From first sketch to final product, let's create it together."
        buttonLabel="Let's chat"
      />
    </>
  );
}

export default Home;
