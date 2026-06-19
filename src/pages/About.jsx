import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Button from '@/components/ui/Button';
import yellowFlower from '@/assets/svg/yellow-2.svg';
import shiranBar from '@/assets/images/Shiran-bar.png';
import './About.css';

const offers = [
  {
    title: 'Research & Concept Development',
    description:
      'Transforming early-stage ideas into clear product directions through research, exploration and concept development.',
  },
  {
    title: 'Product Design & Development',
    description:
      'Developing concepts into thoughtful, functional and engaging products.',
  },
  {
    title: '3D Development & Product Visualization',
    description:
      'Bringing concepts to life through 3D modeling and visual communication.',
  },
  {
    title: 'Product Documentation & Development Support',
    description:
      'Preparing products for development and supporting the process through implementation.',
  },
];

const spring = { type: 'spring', stiffness: 200, damping: 22 };

function About() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="about-page">
      {/* ---------- Bio section ---------- */}
      <section className="about-bio">
        <div className="container about-bio__inner">
          <motion.div
            className="about-bio__copy"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.15 }}
          >
            <h1 className="about-bio__title">About Me</h1>

            <div className="about-bio__text">
              <p>
                Hi there, I'm Shiran Bar, an industrial designer specializing in
                toys and baby products.
              </p>

              <p>
                I graduated from Shenkar College of Design, interned at HAPE in
                China, and worked at Tiny Love designing a wide range of baby
                products, from soft toys to electronic developmental items.
              </p>

              <p>
                I'm inspired by the beautiful simplicity of babies: their
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
                concept development and hands-on product design, I'm open to
                freelance projects, creative collaborations, and contracting
                opportunities.
              </p>

              <p className="about-bio__signoff">
                Simple, smart, and full of wonder.
              </p>
            </div>

            <Button
              as={Link}
              to="/inquire"
              variant="yellow"
              size="md"
              className="about-bio__cta"
            >
              Let's Chat
            </Button>
          </motion.div>

          <motion.div
            className="about-bio__photo"
            initial={{ opacity: 0, x: 40, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            <div className="about-bio__photo-frame">
              <div className="about-bio__photo-placeholder">
                <img src={shiranBar} alt="Shiran Bar" />
              </div>

              <motion.div
                className="about-bio__hello"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 12,
                  delay: 0.6,
                }}
                /* Playful pop on hover, like the hero motifs */
                whileHover={{
                  scale: 1.12,
                  rotate: 8,
                  transition: { type: 'spring', stiffness: 300, damping: 14 },
                }}
                whileTap={{ scale: 1.04 }}
              >
                <img
                  src={yellowFlower}
                  alt=""
                  className="about-bio__hello-shape"
                  aria-hidden="true"
                />
                <span className="about-bio__hello-text">Hello!</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- What I Offer ---------- */}
      <motion.section
        className="about-offer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ ...spring }}
      >
        <div className="container">
          <div className="about-offer__panel">
            <motion.div
              className="about-offer__intro"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: 0.15 }}
            >
              <h2 className="about-offer__title">My Approach</h2>

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
                Explore My Services
              </Button>
            </motion.div>

            <ul className="about-offer__list">
              {offers.map((offer, idx) => (
                <motion.li
                  key={idx}
                  className="about-offer__item"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: 0.1 + idx * 0.08 }}
                >
                  <motion.button
                    className="about-offer__row"
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    aria-expanded={openIdx === idx}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{offer.title}</span>

                    <motion.span
                      animate={{ rotate: openIdx === idx ? 180 : 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {openIdx === idx ? (
                        <Minus size={20} />
                      ) : (
                        <Plus size={20} />
                      )}
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {openIdx === idx && (
                      <motion.p
                        className="about-offer__detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 28,
                        }}
                      >
                        {offer.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default About;
