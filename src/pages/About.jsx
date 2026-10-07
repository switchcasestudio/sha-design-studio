import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Button from '@/components/ui/Button';
import BrandShape from '@/components/ui/BrandShape';
import CtaBand from '@/components/sections/CtaBand';
import { rise, stagger } from '@/lib/motion';
import { useTheme } from '@/theme/ThemeContext';
import { spring } from '@/theme/vivid/motion';
import Reveal from '@/theme/vivid/Reveal';
import SplitText from '@/theme/vivid/SplitText';
import Magnetic from '@/theme/vivid/Magnetic';
import Tilt from '@/theme/vivid/pages/Tilt';
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

/* ---------- Vivid theme: portrait ----------
   The photo opens through a growing circle while it zooms back to size, the
   frame tilts toward the pointer, the Hello flower spins and can be dragged
   (it springs home), and the heart beats. */
function VividPortrait() {
  return (
    <motion.div
      className="about-bio__photo"
      initial={{ opacity: 0, y: 80, rotate: 4 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ ...spring.soft, delay: 0.2 }}
    >
      <Tilt max={5} className="about-bio__photo-frame about-bio__photo-frame--vivid">
        <motion.div
          className="about-bio__photo-img"
          initial={{ clipPath: 'circle(0% at 50% 40%)' }}
          animate={{ clipPath: 'circle(120% at 50% 40%)' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        >
          <motion.img
            src={shiranBar}
            alt="Shiran Bar"
            initial={{ scale: 1.35 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          />
        </motion.div>

        <motion.div
          className="about-bio__hello about-bio__hello--vivid"
          drag
          dragSnapToOrigin
          dragElastic={0.7}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 12 }}
          whileHover={{ scale: 1.08 }}
          whileDrag={{ scale: 1.2, rotate: -12 }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...spring.bouncy, delay: 1 }}
          title="Drag me"
        >
          <BrandShape shape="flower2" className="about-bio__hello-shape" />
          <span className="about-bio__hello-text">Hello</span>
        </motion.div>

        <motion.div
          className="about-bio__heart about-bio__heart--vivid"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...spring.bouncy, delay: 1.2 }}
        >
          <BrandShape shape="heart" />
        </motion.div>
      </Tilt>
    </motion.div>
  );
}

// Bio paragraph: a plain <p> in regular, its own scroll-in rise in vivid.
function P({ children }) {
  const { isVivid } = useTheme();
  if (!isVivid) return <p>{children}</p>;
  return (
    <Reveal as="p" preset="rise" amount={0.6}>
      {children}
    </Reveal>
  );
}

function About() {
  const reduce = useReducedMotion();
  const { isVivid } = useTheme();
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
    <div className={`about-page ground-pool${isVivid ? ' about-page--vivid' : ''}`}>
      {/* ---------- Bio section ---------- */}
      <section className="about-bio">
        <div className="container about-bio__inner">
          <motion.div
            className="about-bio__copy"
            {...(isVivid ? {} : riseIn(0.1))}
          >
            <h1 className="about-bio__title">
              {isVivid ? (
                <>
                  <SplitText text="About" by="chars" trigger="mount" />{' '}
                  <span className="hl v-hl-sweep">
                    <SplitText text="me" by="chars" trigger="mount" delay={0.2} />
                  </span>
                </>
              ) : (
                <>
                  About <span className="hl">me</span>
                </>
              )}
            </h1>

            <div className="about-bio__text">
              <P>
                Hi there, I&apos;m Shiran Bar, an industrial designer
                specializing in toys and baby products.
              </P>

              <P>
                I graduated from{' '}
                <span className="about-chip">Shenkar College</span>, interned
                at <span className="about-chip">HAPE</span> in China, and
                worked at <span className="about-chip">Tiny Love</span>{' '}
                designing a wide range of baby products, from soft toys to
                electronic developmental items.
              </P>

              <P>
                I&apos;m inspired by the beautiful simplicity of babies: their
                curiosity, instinct to play, and unfiltered reactions. This
                drives me to create designs that are both intuitive and
                emotionally engaging.
              </P>

              <P>
                My process is guided by sensitivity, precision, and a love for
                surprising details, the small things that turn a good product
                into an exceptional one.
              </P>

              <P>
                I create toys that inspire, empower, and spark joy. Skilled in
                concept development and hands-on product design, I&apos;m open
                to freelance projects, creative collaborations, and contracting
                opportunities.
              </P>
            </div>

            <p className="about-bio__signoff">
              {isVivid ? (
                <>
                  <SplitText text="Simple, smart, and full of" />{' '}
                  <span className="hl v-hl-sweep">
                    <SplitText text="wonder" delay={0.3} />
                  </span>
                </>
              ) : (
                <>
                  Simple, smart, and full of <span className="hl">wonder</span>
                </>
              )}
            </p>

            {isVivid ? (
              <Magnetic strength={0.4}>
                <Button
                  as={Link}
                  to="/inquire"
                  variant="yellow"
                  size="md"
                  className="about-bio__cta"
                >
                  Let&apos;s chat
                </Button>
              </Magnetic>
            ) : (
              <Button
                as={Link}
                to="/inquire"
                variant="yellow"
                size="md"
                className="about-bio__cta"
              >
                Let&apos;s chat
              </Button>
            )}
          </motion.div>

          {isVivid ? (
            <VividPortrait />
          ) : (
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
          )}
        </div>
      </section>

      {/* ---------- My approach — one yolk panel inside the pool page ---------- */}
      <section className="about-offer">
        <div className="container">
          <motion.div
            className="about-offer__panel ground-yolk"
            {...(isVivid
              ? {
                  initial: { clipPath: 'inset(12% 8% 12% 8% round 48px)', opacity: 0 },
                  whileInView: { clipPath: 'inset(0% 0% 0% 0% round 24px)', opacity: 1 },
                  viewport: { once: true, amount: 0.2 },
                  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                }
              : riseInView())}
          >
            <div className="about-offer__intro">
              <h2 className="about-offer__title">
                {isVivid ? (
                  <>
                    <SplitText text="My" />{' '}
                    <span className="hl v-hl-sweep">
                      <SplitText text="approach" delay={0.1} />
                    </span>
                  </>
                ) : (
                  <>
                    My <span className="hl">approach</span>
                  </>
                )}
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
                    {...(isVivid
                      ? {
                          initial: { opacity: 0, x: 80 },
                          whileInView: { opacity: 1, x: 0 },
                          viewport: { once: true, margin: '-60px' },
                          transition: { ...spring.soft, delay: 0.2 + idx * 0.1 },
                        }
                      : riseInView(0.1 + idx * stagger))}
                  >
                    <button
                      type="button"
                      className="about-offer__row"
                      onClick={() => setOpenIdx(open ? null : idx)}
                      aria-expanded={open}
                      aria-controls={`about-offer-${idx}`}
                    >
                      <span className="about-offer__row-label">
                        {isVivid ? (
                          <motion.span
                            className="about-offer__bullet"
                            style={{ color: offer.tint }}
                            animate={{ rotate: open ? 180 : 0, scale: open ? 1.3 : 1 }}
                            transition={spring.bouncy}
                          >
                            <BrandShape shape={offer.shape} />
                          </motion.span>
                        ) : (
                          <span
                            className="about-offer__bullet"
                            style={{ color: offer.tint }}
                          >
                            <BrandShape shape={offer.shape} />
                          </span>
                        )}
                        <span>{offer.title}</span>
                      </span>

                      <span className="about-offer__toggle" aria-hidden="true">
                        {isVivid ? (
                          <motion.span
                            style={{ display: 'inline-flex' }}
                            animate={{ rotate: open ? 135 : 0 }}
                            transition={spring.bouncy}
                          >
                            <Plus size={20} strokeWidth={2} />
                          </motion.span>
                        ) : open ? (
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
                          transition={isVivid ? spring.soft : rise}
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
