import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data';
import blueBlob from '@/assets/svg/blue-1.svg';
import blueBlob2 from '@/assets/svg/blue-2.svg';
import yellowBlob from '@/assets/svg/yellow-2.svg';
import pacman from '@/assets/svg/05_pacman.svg';
import circle from '@/assets/svg/02_circle.svg';
import star from '@/assets/svg/12_star.svg';
import './Projects.css';

/* Badges sit on the orange media panel, so they alternate blue and yellow —
   both read clearly there. Orange/red shapes are skipped (they'd disappear
   into the background). A mix of organic blobs + solid geometric shapes keeps
   the cycling set varied across many projects. */
const badgeVariants = [
  { src: blueBlob, variant: 'blue' },
  { src: yellowBlob, variant: 'yellow' },
  { src: pacman, variant: 'blue' },
  { src: circle, variant: 'yellow' },
  { src: blueBlob2, variant: 'blue' },
  { src: star, variant: 'yellow' },
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

        {/* Overview grid — a clickable glimpse of every project, jumping
            straight to each one. The full case studies live below. */}
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
                      <Link
                        to={`/projects/${project.id}`}
                        className="project-entry__image-link"
                        aria-label={`View project: ${project.title}`}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          width={image.width ?? undefined}
                          height={image.height ?? undefined}
                          loading={idx === 0 ? 'eager' : 'lazy'}
                        />
                      </Link>
                    </motion.figure>
                  ))}
                </div>
              </div>

              <motion.div
                className="project-entry__caption"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: 0.3 }}
              >
                <div className="project-entry__meta">
                  <motion.div
                    className={`project-entry__badge project-entry__badge--${badge.variant}`}
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
                  <span className="project-entry__index">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="project-entry__category">
                    {project.category}
                  </span>
                </div>
                <div className="project-entry__text">
                  <h2 className="project-entry__title">
                    <Link
                      to={`/projects/${project.id}`}
                      className="project-entry__title-link"
                    >
                      {project.title}
                    </Link>
                  </h2>
                  <p className="project-entry__description">
                    {project.summary}
                  </p>
                  <Link
                    to={`/projects/${project.id}`}
                    className="project-entry__cta"
                  >
                    View project
                    <ArrowUpRight
                      size={18}
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                  </Link>
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
