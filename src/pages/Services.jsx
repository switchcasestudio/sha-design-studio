import { Fragment, useId, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { rise } from '@/lib/motion';
import { useTheme } from '@/theme/ThemeContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { spring } from '@/theme/vivid/motion';
import Reveal from '@/theme/vivid/Reveal';
import SplitText from '@/theme/vivid/SplitText';
import Tilt from '@/theme/vivid/pages/Tilt';
import Marquee from '@/theme/vivid/pages/Marquee';
import CtaBand from '@/components/sections/CtaBand';
import BrandShape from '@/components/ui/BrandShape';
import './Services.css';

// Core service offering — research → design → 3D → documentation/support.
// Each block lists the concrete deliverables it includes. `ground` is the card's
// panel colour (a brand .ground-* recipe); `motif` is the brand shape cropped
// into its corner, tinted in the CSS so it is never on its own colour.
const services = [
  {
    id: 'research-concept',
    index: '01',
    ground: 'tomato',
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
    ground: 'night',
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
    ground: 'pool',
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
    ground: 'paper',
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

// The one reveal: a 16px rise over 600ms. Reduced motion drops it entirely.
const riseIn = (reduce, delay = 0) =>
  reduce
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 16 },
        transition: { ...rise, delay },
      };

// A short dotted play-road drawn in the gap between two service cards — the
// same self-drawing technique as the home JourneyPath (a solid stroke animating
// pathLength inside a mask reveals the dotted stroke tip-to-tail). It draws
// once, then stays still. Turns the four numbered steps into one journey.
const CONNECTOR_PATH = 'M 12 2 C 2 18, 22 34, 12 50 C 5 62, 12 66, 12 78';

function ServiceConnector() {
  const reduce = useReducedMotion();
  // useId can contain ':' which is invalid inside url(#…); strip it.
  const maskId = `sc-${useId().replace(/:/g, '')}`;

  // whileInView is driven from the OUTER div (which has a real layout box), not
  // the <motion.path> — a path inside <defs><mask> has no box, so its own
  // IntersectionObserver fires unreliably and could leave the mask empty (dots
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
              {/* Mask stroke is the light paper tone (CSS sets `color`) so the
                  dots show at full strength where it has drawn. */}
              <motion.path
                className="service-connector__mask"
                d={CONNECTOR_PATH}
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                variants={{
                  hidden: { pathLength: 0 },
                  show: { pathLength: 1, transition: rise },
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

function ServiceBlock({ service }) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className={`service-block service-block--${service.ground} ground-${service.ground}`}
      {...riseIn(reduce)}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
    >
      {/* Corner motif — decorative, one flat fill set per card in the CSS */}
      <BrandShape shape={service.motif} className="service-block__motif" />

      <div className="service-block__left">
        <span className="service-block__index">{service.index}</span>
        <h2 className="service-block__title">{service.title}</h2>
      </div>

      <div className="service-block__right">
        <p className="service-block__description">{service.description}</p>

        <div className="service-block__includes">
          <span className="service-block__includes-label">Includes</span>
          <ul className="service-block__chips">
            {service.includes.map((item) => (
              <li key={item} className="service-block__chip">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- Vivid theme: stacking cards ----------
   Each card sticks under the nav as you scroll and the next one slides over
   it; the cards beneath shrink back into a deck. The motif spins with scroll,
   the chips pop in one by one and wiggle on hover, and the card tilts toward
   the pointer. Desktop only for the stack — on phones the cards are taller
   than the screen, so they just pop in. */
function VividServiceBlock({ service, i, total, progress, stacked }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const motifRotate = useTransform(scrollYProgress, [0, 1], [-60, 120]);
  const motifY = useTransform(scrollYProgress, [0, 1], ['18%', '-12%']);
  const scale = useTransform(
    progress,
    [i / total, 1],
    [1, stacked ? 1 - (total - 1 - i) * 0.05 : 1]
  );

  return (
    <div
      ref={ref}
      className="services-stack__item"
      style={{ '--stack-i': i }}
    >
      <motion.div style={{ scale, transformOrigin: 'top center' }}>
        <Reveal preset="rise" amount={0.15}>
          <Tilt max={3}>
            <article
              className={`service-block service-block--vivid service-block--${service.ground} ground-${service.ground}`}
            >
              <motion.span
                className="service-block__motif-wrap"
                style={{ rotate: motifRotate, y: motifY }}
              >
                <BrandShape shape={service.motif} className="service-block__motif" />
              </motion.span>

              <div className="service-block__left">
                <span className="service-block__index">
                  {service.index}
                  <span className="service-block__index-total"> / 0{total}</span>
                </span>
                <h2 className="service-block__title">
                  <SplitText text={service.title} />
                </h2>
              </div>

              <div className="service-block__right">
                <p className="service-block__description">{service.description}</p>

                <div className="service-block__includes">
                  <span className="service-block__includes-label">Includes</span>
                  <motion.ul
                    className="service-block__chips"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ staggerChildren: 0.05, delayChildren: 0.2 }}
                  >
                    {service.includes.map((item, ci) => (
                      <motion.li
                        key={item}
                        className="service-block__chip"
                        variants={{
                          hidden: { opacity: 0, scale: 0.4, y: 20 },
                          show: { opacity: 1, scale: 1, y: 0, transition: spring.bouncy },
                        }}
                        whileHover={{
                          rotate: ci % 2 ? 4 : -4,
                          y: -4,
                          scale: 1.08,
                          transition: spring.wobbly,
                        }}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>
            </article>
          </Tilt>
        </Reveal>
      </motion.div>
    </div>
  );
}

function VividServiceStack() {
  const ref = useRef(null);
  const stacked = useMediaQuery('(min-width: 900px) and (min-height: 700px)');
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <div
      ref={ref}
      className={`container services-page__list services-stack${stacked ? ' services-stack--on' : ''}`}
    >
      {services.map((service, i) => (
        <VividServiceBlock
          key={service.id}
          service={service}
          i={i}
          total={services.length}
          progress={scrollYProgress}
          stacked={stacked}
        />
      ))}
    </div>
  );
}

function VividExpertise() {
  return (
    <section className="services-page__expertise services-page__expertise--vivid">
      <Marquee items={expertise} shapes={['daisy', 'star', 'clover']} />
      <div className="container">
        <div className="services-page__expertise-inner">
          <h2 className="services-page__expertise-title">
            <SplitText text="Areas of" />{' '}
            <span className="hl v-hl-sweep">
              <SplitText text="expertise" delay={0.15} />
            </span>
          </h2>

          <motion.ul
            className="services-page__expertise-list"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ staggerChildren: 0.12 }}
          >
            {expertise.map((area, i) => (
              <motion.li
                key={area}
                className="services-page__expertise-item"
                variants={{
                  hidden: { opacity: 0, y: 60, rotate: i % 2 ? 10 : -10 },
                  show: { opacity: 1, y: 0, rotate: 0, transition: spring.bouncy },
                }}
                whileHover={{ y: -10, rotate: i % 2 ? -3 : 3, transition: spring.wobbly }}
              >
                {area}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const reduce = useReducedMotion();
  const { isVivid } = useTheme();

  return (
    <div className={`services-page ground-yolk${isVivid ? ' services-page--vivid' : ''}`}>
      <section className="services-page__hero">
        <div className="container services-page__hero-inner">
          {isVivid ? (
            <>
              <h1 className="services-page__title">
                <SplitText text="Design" trigger="mount" />{' '}
                <span className="hl v-hl-sweep">
                  <SplitText text="services" trigger="mount" delay={0.15} />
                </span>
              </h1>
              <Reveal as="p" className="services-page__intro" preset="slideLeft" delay={0.35}>
                I help brands, startups and entrepreneurs turn ideas into meaningful
                products — guiding each project from research and concept
                development through product design, 3D visualization and
                development support.
              </Reveal>
            </>
          ) : (
          <>
          <motion.h1
            className="services-page__title"
            {...riseIn(reduce, 0.05)}
            animate={{ opacity: 1, y: 0 }}
          >
            Design <span className="hl">services</span>
          </motion.h1>

          <motion.p
            className="services-page__intro"
            {...riseIn(reduce, 0.15)}
            animate={{ opacity: 1, y: 0 }}
          >
            I help brands, startups and entrepreneurs turn ideas into meaningful
            products — guiding each project from research and concept
            development through product design, 3D visualization and
            development support.
          </motion.p>
          </>
          )}
        </div>
      </section>

      {isVivid ? (
        <VividServiceStack />
      ) : (
      <div className="container services-page__list">
        {services.map((service, i) => (
          <Fragment key={service.id}>
            <ServiceBlock service={service} />
            {/* Draw a dotted road in each gap so 01→04 reads as one journey */}
            {i < services.length - 1 && <ServiceConnector />}
          </Fragment>
        ))}
      </div>
      )}

      {isVivid ? (
        <VividExpertise />
      ) : (
      <section className="services-page__expertise">
        <div className="container">
          <motion.div
            className="services-page__expertise-inner"
            {...riseIn(reduce)}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <h2 className="services-page__expertise-title">
              Areas of <span className="hl">expertise</span>
            </h2>

            <ul className="services-page__expertise-list">
              {expertise.map((area) => (
                <li key={area} className="services-page__expertise-item">
                  {area}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
      )}

      {/* Closing beat — don't dead-end the highest-intent page before Inquire */}
      <CtaBand
        title={
          <>
            Got a product <span className="hl">itching</span> to exist?
          </>
        }
        text="Bring me the idea — a sketch, a spec, or just a spark — and let's shape it into something real."
        buttonLabel="Start a project"
      />
    </div>
  );
}

export default Services;
