import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import Button from '@/components/ui/Button';
import HomeAssemble from '@/components/sections/HomeAssemble';
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

              <p className="home-what__text">
                I help brands, startups and entrepreneurs turn ideas into
                meaningful products — from research and concept development to
                product design, 3D visualization and development support.
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
    </>
  );
}

export default Home;
