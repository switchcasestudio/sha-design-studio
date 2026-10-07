import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Button from '@/components/ui/Button';
import BrandShape from '@/components/ui/BrandShape';
import CtaBand from '@/components/sections/CtaBand';
import { rise, stagger } from '@/lib/motion';
import shiranBar from '@/assets/images/Shiran-bar.png';
import './About.css';

// Each offer carries a brand-shape bullet and a full-strength tint that reads
// on the yolk panel — pool and tomato only, never yolk on yolk.
const offers = [
  {
    shape: 'daisy',
    tint: 'var(--tomato)',
    title: 'Research & concept development',
    description:
      'Transforming early-stage ideas into clear product directions through research, exploration and concept development.',
  },
  {
    shape: 'clover',
    tint: 'var(--pool)',
    title: 'Product design & development',
    description:
      'Developing concepts into thoughtful, functional and engaging products.',
  },
  {
    shape: 'heart',
    tint: 'var(--tomato)',
    title: '3D development & product visualization',
    description:
      'Bringing concepts to life through 3D modeling and visual communication.',
  },
  {
    shape: 'star',
    tint: 'var(--pool)',
    title: 'Product documentation & development support',
    description:
      'Preparing products for development and supporting the process through implementation.',
  },
];

function About() {
  const reduce = useReducedMotion();
  const [openIdx, setOpenIdx] = useState(null);

  // Quick, then still: every reveal is the one 16px rise. Reduced motion
  // renders in place.
  const riseIn = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { ...rise, delay },
  });
  const riseInView = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { ...rise, delay },
  });

  return (
    <div className="about-page ground-pool">
      {/* ---------- Bio section ---------- */}
      <section className="about-bio">
        <div className="container about-bio__inner">
          <motion.div className="about-bio__copy" {...riseIn(0.1)}>
            <h1 className="about-bio__title">
              About <span className="hl">me</span>
            </h1>

            <div className="about-bio__text">
              <p>
                Hi there, I&apos;m Shiran Bar, an industrial designer
                specializing in toys and baby products.
              </p>

              <p>
                I graduated from{' '}
                <span className="about-chip">Shenkar College</span>, interned
                at <span className="about-chip">HAPE</span> in China, and
                worked at <span className="about-chip">Tiny Love</span>{' '}
                designing a wide range of baby products, from soft toys to
                electronic developmental items.
              </p>

              <p>
                I&apos;m inspired by the beautiful simplicity of babies: their
                curiosity, instinct to play, and unfiltered reactions. This
                drives me to create designs that are both intuitive and
                emotionally engaging.
              </p>

              <p>
                My process is guided by sensitivity, precision, and a love for
                surprising details, the small things that turn a good product
                into an exceptional one.
              </p>

              <p>
                I create toys that inspire, empower, and spark joy. Skilled in
                concept development and hands-on product design, I&apos;m open
                to freelance projects, creative collaborations, and contracting
                opportunities.
              </p>
            </div>

            <p className="about-bio__signoff">
              Simple, smart, and full of <span className="hl">wonder</span>
            </p>

            <Button
              as={Link}
              to="/inquire"
              variant="yellow"
              size="md"
              className="about-bio__cta"
            >
              Let&apos;s chat
            </Button>
          </motion.div>

          <motion.div className="about-bio__photo" {...riseIn(0.2)}>
            <div className="about-bio__photo-frame">
              <div className="about-bio__photo-img">
                <img src={shiranBar} alt="Shiran Bar" />
              </div>

              {/* Two still motifs keep the portrait company — a yolk flower
                  carrying the greeting and a yolk heart. Yolk on pool and on
                  the paper frame, never on its own colour. */}
              <motion.div className="about-bio__hello" {...riseIn(0.45)}>
                <BrandShape shape="flower2" className="about-bio__hello-shape" />
                <span className="about-bio__hello-text">Hello</span>
              </motion.div>

              <motion.div className="about-bio__heart" {...riseIn(0.55)}>
                <BrandShape shape="heart" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- My approach — one yolk panel inside the pool page ---------- */}
      <section className="about-offer">
        <div className="container">
          <motion.div
            className="about-offer__panel ground-yolk"
            {...riseInView()}
          >
            <div className="about-offer__intro">
              <h2 className="about-offer__title">
                My <span className="hl">approach</span>
              </h2>

              <p className="about-offer__text">
                I help brands, startups and entrepreneurs transform ideas into
                meaningful products through research, concept development and
                product design. With extensive experience in toys, baby products
                and consumer goods, I combine strategic thinking, creativity and
                hands-on product development to create products that are
                engaging, functional and ready for the next stage of
                development.
              </p>

              <Button as={Link} to="/services" variant="primary" size="md">
                Explore my services
              </Button>
            </div>

            <ul className="about-offer__list">
              {offers.map((offer, idx) => {
                const open = openIdx === idx;
                return (
                  <motion.li
                    key={offer.title}
                    className="about-offer__item"
                    {...riseInView(0.1 + idx * stagger)}
                  >
                    <button
                      type="button"
                      className="about-offer__row"
                      onClick={() => setOpenIdx(open ? null : idx)}
                      aria-expanded={open}
                      aria-controls={`about-offer-${idx}`}
                    >
                      <span className="about-offer__row-label">
                        <span
                          className="about-offer__bullet"
                          style={{ color: offer.tint }}
                        >
                          <BrandShape shape={offer.shape} />
                        </span>
                        <span>{offer.title}</span>
                      </span>

                      <span className="about-offer__toggle" aria-hidden="true">
                        {open ? (
                          <Minus size={20} strokeWidth={2} />
                        ) : (
                          <Plus size={20} strokeWidth={2} />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={`about-offer-${idx}`}
                          className="about-offer__detail-wrap"
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={
                            reduce
                              ? { opacity: 0, transition: { duration: 0 } }
                              : { height: 0, opacity: 0 }
                          }
                          transition={rise}
                        >
                          <p className="about-offer__detail">
                            {offer.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Give the page a destination — the shared sand closing panel */}
      <CtaBand
        title={
          <>
            Let&apos;s make something <span className="hl">wonder-full</span>
          </>
        }
        text="If it's playful, tactile and made for small hands, I'd love to hear about it."
        buttonLabel="Let's chat"
      />
    </div>
  );
}

export default About;
