import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import Button from '@/components/ui/Button';
import HomeAssemble from '@/components/sections/HomeAssemble';
import TextPath from '@/components/ui/TextPath';
import { reducedReveal, slideUp } from '@/lib/motion';
import { siteConfig } from '@/utils/siteConfig';
import { testimonials } from '@/data/testimonials';
import shiranAtWork from '@/assets/images/shiran-in-photoshooting.png';
import './Home.css';

// Color-world block: slides up and settles on enter (position/opacity only —
// the block's own background color is never touched).
function ColorWorld({ children, className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      className={className}
      variants={reduce ? reducedReveal : slideUp}
      initial={reduce ? 'show' : 'hidden'}
      animate={inView ? 'show' : undefined}
    >
      {children}
    </motion.section>
  );
}

function Home() {
  return (
    <>
      {/* ---------- Signature hero: scroll-pinned brand assemble (GSAP) ----------
          This IS the home headline — it replaces the old static hero so the
          wording ("Sha Design Studio" / "Designing Thoughtful Products") only
          appears once, now assembling on scroll. */}
      <HomeAssemble />

      {/* ---------- "What I Do" CTA ---------- */}
      <ColorWorld className="home-what">
        <div className="container">
          <div className="home-what__panel">
            <div className="home-what__copy">
              <h2 className="home-what__title">What I Do</h2>

              {/* Teaser copy — deliberately distinct from the Services-page
                  intro (which lays out the full process). Home hints; Services
                  delivers the detail. */}
              <p className="home-what__text">
                I turn early ideas into playful, thoughtful products — for toys,
                baby gear and the brands behind them. Curious how it works?
              </p>

              <Button as={Link} to="/services" variant="outline" size="md">
                Explore My Services
              </Button>
            </div>

            <div className="home-what__media">
              <img
                className="home-what__image"
                src={shiranAtWork}
                alt={`${siteConfig.designer} at work in a product photoshoot`}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </ColorWorld>

      {/* ---------- Kind Words / Testimonials ---------- */}
      <ColorWorld className="home-words">
        <div className="container">
          <div className="home-words__panel">
            <h2 className="home-words__title">Kind Words</h2>

            {/* TODO: verify testimonial attribution — the only quote is credited
                to "Jaya Dixon" but its text refers to "Channing" and to interior
                "space", which doesn't match Sha / Shiran Bar's product work.
                Likely placeholder/wrong-domain copy. Don't ship as-is; confirm a
                real testimonial + attribution before launch. */}
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.id} className="home-words__quote">
                <p>"{testimonial.comment}"</p>

                <footer className="home-words__attribution">
                  {testimonial.image && (
                    <img
                      className="home-words__avatar"
                      src={testimonial.image}
                      alt={testimonial.name}
                      loading="lazy"
                    />
                  )}
                  <cite className="home-words__cite">
                    <span className="home-words__name">
                      — {testimonial.name}
                    </span>
                    {testimonial.title && (
                      <span className="home-words__role">
                        {testimonial.title}
                      </span>
                    )}
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </ColorWorld>

      {/* ---------- Marquee ribbon: brand line scrolling along a wave ---------- */}
      <ColorWorld className="home-marquee">
        <TextPath
          text="Designing Playful, Thoughtful Products  ·  Simple, Smart & Full of Wonder  ·  "
          path="M0 140 C 130 100 270 100 400 140 S 670 180 800 140 S 1070 100 1200 140 S 1470 180 1600 140"
          viewBox="0 0 1600 280"
          fontSize="80px"
          duration={20}
          reversed
        />
      </ColorWorld>
    </>
  );
}

export default Home;
