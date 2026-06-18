import { motion } from 'motion/react';
import './Services.css';

// Core service offering — research → design → 3D → documentation/support.
// Each block lists the concrete deliverables it includes.
const services = [
  {
    id: 'research-concept',
    index: '01',
    color: 'orange',
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

const spring = { type: 'spring', stiffness: 200, damping: 22 };

function ServiceBlock({ service, index }) {
  return (
    <motion.article
      className={`service-block service-block--${service.color}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...spring, delay: index * 0.08 }}
    >
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
          <ServiceBlock key={service.id} service={service} index={i} />
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                    transition: { ...spring, delay: 0.1 + i * 0.08 },
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
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
    </div>
  );
}

export default Services;
