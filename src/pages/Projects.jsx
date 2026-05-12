import { motion } from 'motion/react';
import blueShape from '@/assets/svg/blue-1.svg';
import yellowShape from '@/assets/svg/yellow-1.svg';
import './Projects.css';

const projects = [
  {
    year: '2023',
    title: 'Activity center',
    badge: {
      label: 'Activity center',
      src: blueShape,
      variant: 'blue',
    },
    description:
      'It all begins with an idea. Maybe you want to launch a business. Maybe you want to turn a hobby into something more. Whatever it is, the way you tell your story online can make all the difference.',
    images: 2,
  },
  {
    year: '2022',
    title: 'Gymini',
    badge: {
      label: 'Gymini',
      src: yellowShape,
      variant: 'yellow',
    },
    description:
      'It all begins with an idea. Maybe you want to launch a business. Maybe you want to turn a hobby into something more. Whatever it is, the way you tell your story online can make all the difference.',
    images: 2,
  },
  {
    year: '2022',
    title: 'Wooden toys collection',
    badge: null,
    description:
      'It all begins with an idea. Maybe you want to launch a business. Maybe you want to turn a hobby into something more. Whatever it is, the way you tell your story online can make all the difference.',
    images: 1,
    background: 'light',
  },
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
        {projects.map((project, idx) => (
          <motion.article
            key={project.title}
            className="project-entry"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <motion.div
              className={`project-entry__media project-entry__media--${
                project.background || 'orange'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="project-entry__images">
                {Array.from({ length: project.images }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="project-entry__image-placeholder"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ ...spring, delay: 0.2 + i * 0.1 }}
                  >
                    <span>Image placeholder</span>
                  </motion.div>
                ))}

                {project.badge && (
                  <motion.div
                    className={`project-entry__badge project-entry__badge--${
                      project.images > 1 ? 'right' : 'left'
                    } project-entry__badge--${project.badge.variant}`}
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
                      src={project.badge.src}
                      alt=""
                      className="project-entry__badge-shape"
                      aria-hidden="true"
                    />
                    <span className="project-entry__badge-text">
                      {project.badge.label}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="project-entry__caption"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: 0.3 }}
            >
              <span className="project-entry__year">{project.year}</span>
              <p className="project-entry__description">
                {project.description}
              </p>
            </motion.div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export default Projects;
