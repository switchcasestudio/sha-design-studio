import { motion } from 'motion/react';
import { projects } from '@/data';
import blueShape from '@/assets/svg/blue-1.svg';
import yellowShape from '@/assets/svg/yellow-1.svg';
import redShape from '@/assets/svg/red-1.svg';
import './Projects.css';

const badgeVariants = [
  { src: blueShape, variant: 'blue' },
  { src: yellowShape, variant: 'yellow' },
  { src: redShape, variant: 'red' },
];

const spring = { type: 'spring', stiffness: 200, damping: 22 };

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
            Portfolio
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
      </section>

      <div className="container projects-page__list">
        {projects.map((project, idx) => {
          const badge = badgeVariants[idx % badgeVariants.length];
          const entryImages = [project.heroImage, project.images[1]].filter(
            Boolean
          );

          return (
            <motion.article
              key={project.id}
              className="project-entry"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ ...spring, delay: 0.1 }}
            >
              <div className="project-entry__media project-entry__media--orange">
                <div className="project-entry__images">
                  {entryImages.map((image, i) => (
                    <motion.figure
                      key={image.src}
                      className="project-entry__image"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ ...spring, delay: 0.2 + i * 0.1 }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        width={image.width ?? undefined}
                        height={image.height ?? undefined}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                    </motion.figure>
                  ))}

                  <motion.div
                    className={`project-entry__badge project-entry__badge--${
                      entryImages.length > 1 ? 'right' : 'left'
                    } project-entry__badge--${badge.variant}`}
                    initial={{ scale: 0, rotate: -20 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 12,
                      delay: 0.4,
                    }}
                  >
                    <img
                      src={badge.src}
                      alt=""
                      className="project-entry__badge-shape"
                      aria-hidden="true"
                    />
                    <span className="project-entry__badge-text">
                      {project.category.split('/')[0].trim()}
                    </span>
                  </motion.div>
                </div>
              </div>

              <motion.div
                className="project-entry__caption"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: 0.3 }}
              >
                <span className="project-entry__category">
                  {project.category}
                </span>
                <div className="project-entry__text">
                  <h2 className="project-entry__title">{project.title}</h2>
                  <p className="project-entry__description">
                    {project.summary}
                  </p>
                </div>
              </motion.div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

export default Projects;
