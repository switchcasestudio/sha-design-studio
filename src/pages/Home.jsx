import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import Button from '@/components/ui/Button';
import FactsTicker from '@/components/sections/FactsTicker';
import HomeAssemble from '@/components/sections/HomeAssemble';
import HomeWorkGrid from '@/components/sections/HomeWorkGrid';
import JourneyPath from '@/components/sections/JourneyPath';
import SocialProof from '@/components/sections/SocialProof';
import CtaBand from '@/components/sections/CtaBand';
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
  const reduce = useReducedMotion();

  return (
    <>
      {/* ---------- Signature hero: 100vh brand frame ----------
          This IS the home headline. The wordmark's letters morph between glyphs
          and brand motifs (HeadlineMorph) and a cursor follower trails inside
          the section — no scroll-driven entrance. */}
      <HomeAssemble />

      {/* ---------- Social proof: partner / client logo marquee ---------- */}
      <SocialProof />

      {/* ---------- Featured work: the homepage finally shows the work ---------- */}
      <ColorWorld className="home-work">
        <HomeWorkGrid />
      </ColorWorld>

      {/* ---------- Studio facts on a loud orange band ----------
          Absorbs the old "By the numbers" panel — same facts, one beat. */}
      <ColorWorld className="home-ticker">
        <FactsTicker />
      </ColorWorld>

      {/* ---------- The designer's journey — a dotted play-path drawn straight
          on the cream canvas (no box), stops popping in along it. */}
      <section className="journey">
        <JourneyPath />
      </section>

      {/* ---------- "What I Do" — the one classic yellow panel ---------- */}
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

      {/* ---------- Kind Words — a blue speech bubble on the canvas ---------- */}
      <ColorWorld className="home-words">
        <div className="container">
          <h2 className="home-words__title">Kind Words</h2>

          {/* TODO: verify testimonial attribution — the only quote is credited
              to "Jaya Dixon" but its text refers to "Channing" and to interior
              "space", which doesn't match Sha / Shiran Bar's product work.
              Likely placeholder/wrong-domain copy. Don't ship as-is; confirm a
              real testimonial + attribution before launch. */}
          {/* Bubbles alternate sides: even from the left, odd mirrored from
              the right — a back-and-forth conversation down the page. */}
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.id}
              className={`home-words__item${index % 2 ? ' home-words__item--flip' : ''}`}
              initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 200, damping: 24, delay: index * 0.1 }}
            >
              <blockquote className="home-words__bubble">
                <p>{testimonial.comment}</p>
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
                  <span className="home-words__name">{testimonial.name}</span>
                  {testimonial.title && (
                    <span className="home-words__role">
                      {testimonial.title}
                    </span>
                  )}
                </cite>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </ColorWorld>

      {/* ---------- Orange finale: full-bleed CTA band, the page's loudest
          beat and its last word before the footer. ---------- */}
      <CtaBand
        title="Got a toy in your head?"
        text="From first sketch to factory floor: let's turn it into the thing a baby won't let go of."
        buttonLabel="Let's chat"
      />
    </>
  );
}

export default Home;
