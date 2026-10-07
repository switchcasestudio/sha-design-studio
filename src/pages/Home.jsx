import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
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
              <h2 className="home-what__title">
                What I <span className="hl">do</span>
              </h2>

              {/* Teaser copy — deliberately distinct from the Services-page
                  intro (which lays out the full process). Home hints; Services
                  delivers the detail. */}
              <p className="home-what__text">
                I bring ideas to life through playful, thoughtful product design
                — from first sketch to production.
              </p>

              <Button as={Link} to="/services" variant="dark" size="md">
                Explore my services
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

      {/* ---------- Kind words — one pool panel holding every quote ---------- */}
      <ColorWorld className="home-words">
        <div className="container">
          <div className="home-words__card ground-pool">
            <h2 className="home-words__title">
              Kind <span className="hl">words</span>
            </h2>

            {/* TODO: verify testimonial attribution — the only quote is credited
                to "Jaya Dixon" but its text refers to "Channing" and to interior
                "space", which doesn't match Sha / Shiran Bar's product work.
                Likely placeholder/wrong-domain copy. Don't ship as-is; confirm a
                real testimonial + attribution before launch. */}
            {testimonials.map((testimonial, index) => (
              <motion.figure
                key={testimonial.id}
                className="home-words__item"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ ...rise, delay: index * 0.08 }}
              >
                <blockquote className="home-words__quote">
                  <p>&ldquo;{testimonial.comment}&rdquo;</p>
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
          </div>
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
