import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects } from '@/data';
import './Projects.css';

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

        {/* Overview grid — a clickable glimpse of every project, jumping
            straight to each case study. */}
        <div className="container">
          <ul className="projects-overview">
            {projects.map((project, idx) => {
              const image = project.heroImage ?? project.images[0];
              return (
                <motion.li
                  key={project.id}
                  className="overview-card"
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
                    </div>
                    <div className="overview-card__body">
                      <span className="overview-card__studio">
                        {project.client}
                      </span>
                      <h2 className="overview-card__title">{project.title}</h2>
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
