import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects } from '@/data';
import './Projects.css';

const spring = { type: 'spring', stiffness: 200, damping: 22 };

// Tiles that span the full row in the overview grid — each carries a long
// landscape cover photo instead of pairing up 2-up. Order is driven by each
// project's `order` field so these land on their own rows (positions 3 & 6).
const WIDE_PROJECT_IDS = new Set([
  'wooden-toy-design',
  'garden-of-adventures-packaging',
]);

function Projects() {
  return (
    <div className="projects-page">
      <section className="projects-page__hero">
        <div className="container projects-page__hero-inner">
          <motion.h1
            className="projects-page__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            Work
          </motion.h1>

          <motion.p
            className="projects-page__intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.25 }}
          >
            The following are just a few examples of my creative vision and
            craftsmanship, where every space tells a unique story through
            design.
          </motion.p>
        </div>

        {/* Overview grid — a clickable glimpse of every project, jumping
            straight to each case study. */}
        <div className="container">
          <ul className="projects-overview">
            {projects.map((project, idx) => {
              const image = project.heroImage ?? project.images[0];
              const isWide = WIDE_PROJECT_IDS.has(project.id);
              return (
                <motion.li
                  key={project.id}
                  className={`overview-card${isWide ? ' overview-card--wide' : ''}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.35 + idx * 0.06 }}
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className="overview-card__link"
                  >
                    <div className="overview-card__media">
                      {image && (
                        <img
                          className="overview-card__image"
                          src={image.src}
                          alt={image.alt}
                          loading={idx < 3 ? 'eager' : 'lazy'}
                        />
                      )}
                      {/* Tag + title overlaid on a scrim at the bottom of the
                          image, so every card is a single fixed-ratio tile and
                          the grid rows stay evenly spaced. */}
                      <div className="overview-card__body">
                        {project.client && (
                          <span className="overview-card__tag overview-card__tag--client">
                            {project.client}
                          </span>
                        )}
                        <h2 className="overview-card__title">{project.title}</h2>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Projects;
