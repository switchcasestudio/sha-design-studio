import { Fragment, useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import CtaBand from '@/components/sections/CtaBand';
import BrandShape from '@/components/ui/BrandShape';
import './Services.css';

// Core service offering — research → design → 3D → documentation/support.
// Each block lists the concrete deliverables it includes. `motif` is the brand
// shape tucked into the card's top-right corner (tinted per card in the CSS).
const services = [
  {
    id: 'research-concept',
    index: '01',
    color: 'orange',
    motif: 'daisy',
    title: 'Research & Concept Development',
    description:
      'Transforming early-stage ideas into clear product directions through research, exploration and concept development.',
    includes: [
      'Product Research',
      'Market & Competitor Analysis',
      'User Insights',
      'Product Definition',
      'Moodboards',
      'Sketching',
      'Concept Development',
      'Product Direction',
      'Design Presentations',
    ],
  },
  {
    id: 'product-design',
    index: '02',
    color: 'ink',
    motif: 'star',
    title: 'Product Design & Development',
    description:
      'Developing concepts into thoughtful, functional and engaging products.',
    includes: [
      'Product Design',
      'Form Development',
      'User Experience',
      'Play Experience Design',
      'Materials & Finishes',
      'Functional Product Solutions',
      'Design Refinement',
      'Design Presentations',
    ],
  },
  {
    id: '3d-visualization',
    index: '03',
    color: 'blue',
    motif: 'heart',
    title: '3D Development & Product Visualization',
    description:
      'Bringing concepts to life through 3D modeling and visual communication.',
    includes: [
      'CAD Modeling (SolidWorks)',
      '3D Product Development',
      'Product Visualization',
      'Renderings',
      'Product Presentations',
    ],
  },
  {
    id: 'documentation-support',
    index: '04',
    color: 'cream',
    motif: 'clover',
    title: 'Product Documentation & Development Support',
    description:
      'Preparing products for development and supporting the process through implementation.',
    includes: [
      'Product Specifications',
      'Materials & Color Definitions',
      'Product Documentation',
      'Prototype Feedback',
      'Supplier Communication',
      'Development Support',
    ],
  },
];

const expertise = [
  'Toys & Play Experiences',
  'Baby Products',
  'Consumer Products',
];

// Resting tilts for the expertise pills — Framer owns transform, so the tilt
// lives in the motion target (not CSS) and hover straightens it.
const EXPERTISE_TILT = [-2, 1.5, -1];

const spring = { type: 'spring', stiffness: 200, damping: 22 };

// A short dotted play-road drawn in the gap between two service cards — the
// same self-drawing technique as the home JourneyPath (a solid stroke animating
// pathLength inside a mask reveals the dotted stroke tip-to-tail). Ink dots read
// best on the yellow canvas. Turns the four numbered steps into one journey.
const CONNECTOR_PATH = 'M 12 2 C 2 18, 22 34, 12 50 C 5 62, 12 66, 12 78';

function ServiceConnector() {
  const reduce = useReducedMotion();
  // useId can contain ':' which is invalid inside url(#…); strip it.
  const maskId = `sc-${useId().replace(/:/g, '')}`;

  // whileInView is driven from the OUTER div (which has a real layout box), not
  // the <motion.path> — a path inside <defs><mask> has no box, so its own
  // IntersectionObserver fires unreliably and could leave the mask black (dots
  // fully hidden, i.e. a "missing" connector). The div propagates the `show`
  // variant down to the path.
  return (
    <motion.div
      className="service-connector"
      aria-hidden="true"
      initial={reduce ? undefined : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, margin: '-40px' }}
    >
      <svg className="service-connector__svg" viewBox="0 0 24 80" fill="none">
        {!reduce && (
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse">
              <motion.path
                d={CONNECTOR_PATH}
                stroke="#fff"
                strokeWidth="8"
                strokeLinecap="round"
                variants={{
                  hidden: { pathLength: 0 },
                  show: {
                    pathLength: 1,
                    transition: { duration: 0.7, ease: 'easeOut' },
                  },
                }}
              />
            </mask>
          </defs>
        )}
        <path
          className="service-connector__dots"
          d={CONNECTOR_PATH}
          mask={reduce ? undefined : `url(#${maskId})`}
        />
      </svg>
    </motion.div>
  );
}

function ServiceBlock({ service, index }) {
  const reduce = useReducedMotion();
  // Alternate resting tilt so the stacked cards read as pinned stickers.
  const tilt = index % 2 === 0 ? -0.6 : 0.6;

  return (
    <motion.article
      className={`service-block service-block--${service.color}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0, rotate: reduce ? 0 : tilt }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={
        reduce
          ? undefined
          : {
              rotate: 0,
              y: -4,
              transition: { type: 'spring', stiffness: 400, damping: 17 },
            }
      }
      transition={{ ...spring, delay: index * 0.08 }}
    >
      {/* Corner sticker — decorative, tinted per card in the CSS */}
      <BrandShape shape={service.motif} className="service-block__motif" />

      <div className="service-block__left">
        <span className="service-block__index">{service.index}</span>
        <h2 className="service-block__title">{service.title}</h2>
      </div>

      <div className="service-block__right">
        <p className="service-block__description">{service.description}</p>

        <div className="service-block__includes">
          <span className="service-block__includes-label">Includes</span>
          {/* Deliverables pop in like toys spilling out of the box */}
          <motion.ul
            className="service-block__chips"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              show: { transition: { staggerChildren: 0.03, delayChildren: 0.12 } },
            }}
          >
            {service.includes.map((item) => (
              <motion.li
                key={item}
                className="service-block__chip"
                variants={
                  reduce
                    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                    : {
                        hidden: { opacity: 0, scale: 0.6 },
                        show: {
                          opacity: 1,
                          scale: 1,
                          transition: { type: 'spring', stiffness: 500, damping: 24 },
                        },
                      }
                }
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </motion.article>
  );
}

function Services() {
  return (
    <div className="services-page">
      <section className="services-page__hero">
        <div className="container services-page__hero-inner">
          <motion.h1
            className="services-page__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            Services
          </motion.h1>

          <motion.p
            className="services-page__intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.25 }}
          >
            I help brands, startups and entrepreneurs turn ideas into meaningful
            products — guiding each project from research and concept
            development through product design, 3D visualization and
            development support.
          </motion.p>
        </div>
      </section>

      <div className="container services-page__list">
        {services.map((service, i) => (
          <Fragment key={service.id}>
            <ServiceBlock service={service} index={i} />
            {/* Draw a dotted road in each gap so 01→04 reads as one journey */}
            {i < services.length - 1 && <ServiceConnector />}
          </Fragment>
        ))}
      </div>

      <section className="services-page__expertise">
        <div className="container">
          <motion.div
            className="services-page__expertise-inner"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...spring }}
          >
            <h2 className="services-page__expertise-title">
              Areas of Expertise
            </h2>

            <ul className="services-page__expertise-list">
              {expertise.map((area, i) => (
                <motion.li
                  key={area}
                  className="services-page__expertise-item"
                  initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                    rotate: EXPERTISE_TILT[i] ?? 0,
                    transition: { ...spring, delay: 0.1 + i * 0.08 },
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2, rotate: 0 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {area}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Closing beat — don't dead-end the highest-intent page before Inquire */}
      <CtaBand
        title="Got a product itching to exist?"
        text="Bring me the idea — a sketch, a spec, or just a spark — and let's shape it into something real."
        buttonLabel="Start a Project"
      />
    </div>
  );
}

export default Services;
