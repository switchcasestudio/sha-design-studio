import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { siteConfig } from '@/utils/siteConfig';
import { projects } from '@/data';
import redShape from '@/assets/svg/red-2.svg';
import blueShape from '@/assets/svg/blue-2.svg';
import './Home.css';

// First project fills the large feature slot; the next four fill the grid.
// Playful SVG badges stay as scaffold decoration on the first two cards.
const homeBadges = [blueShape, redShape];

const featuredProjects = projects.slice(0, 5).map((project, i) => ({
  id: project.id,
  title: project.title,
  studio: project.client,
  image: project.heroImage,
  badge:
    i < homeBadges.length
      ? { label: project.category.split('/')[0].trim(), src: homeBadges[i] }
      : null,
}));

const spring = { type: 'spring', stiffness: 200, damping: 20 };
const springBouncy = { type: 'spring', stiffness: 300, damping: 15 };

function ProjectBadge({ badge }) {
  return (
    <>
      <img
        src={badge.src}
        alt=""
        className="project-card__badge-shape"
        aria-hidden="true"
      />
      <span className="project-card__badge-text">{badge.label}</span>
    </>
  );
}

function Section({ children, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ ...spring, duration: 0.6 }}
    >
      {children}
    </motion.section>
  );
}

function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="home-hero">
        <div className="container home-hero__inner">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...springBouncy, delay: 0.1 }}
          >
            <Logo size={180} variant="orange" />
          </motion.div>

          <motion.h1
            className="home-hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            {siteConfig.tagline}
          </motion.h1>
        </div>
      </section>

      {/* ---------- Featured projects grid ---------- */}
      <Section className="home-projects">
        <div className="container">
          <div className="home-projects__grid">
            {/* Featured / large project */}
            <motion.article
              className="project-card project-card--feature"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...spring, delay: 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="project-card__media">
                <img
                  className="project-card__image"
                  src={featuredProjects[0].image.src}
                  alt={featuredProjects[0].image.alt}
                />
              </div>

              {featuredProjects[0].badge && (
                <div className="project-card__badge project-card__badge--top-right">
                  <ProjectBadge badge={featuredProjects[0].badge} />
                </div>
              )}

              <div className="project-card__caption">
                <span className="project-card__studio">
                  {featuredProjects[0].studio}
                </span>

                <h3 className="project-card__title">
                  {featuredProjects[0].title}
                </h3>
              </div>
            </motion.article>

            {/* Secondary projects */}
            {featuredProjects.slice(1).map((project, i) => (
              <motion.article
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ ...spring, delay: 0.1 + i * 0.08 }}
                whileHover={{
                  y: -6,
                  transition: { type: 'spring', stiffness: 400, damping: 20 },
                }}
              >
                <div className="project-card__media">
                  <img
                    className="project-card__image"
                    src={project.image.src}
                    alt={project.image.alt}
                    loading="lazy"
                  />
                </div>

                {project.badge && (
                  <div className="project-card__badge project-card__badge--top-left">
                    <ProjectBadge badge={project.badge} />
                  </div>
                )}

                <div className="project-card__caption">
                  <span className="project-card__studio">{project.studio}</span>
                  <h3 className="project-card__title">{project.title}</h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------- "What I Do" CTA ---------- */}
      <Section className="home-what">
        <div className="container">
          <div className="home-what__panel">
            <motion.div
              className="home-what__copy"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: 0.15 }}
            >
              <h2 className="home-what__title">What I Do</h2>

              <p className="home-what__text">
                I create simple, smart, and playful designs that spark
                curiosity, support early development, and bring joy to little
                ones.
              </p>

              <Button as={Link} to="/services" variant="outline" size="md">
                Explore My Services
              </Button>
            </motion.div>

            <motion.div
              className="home-what__media home-what__media--placeholder"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: 0.25 }}
            >
              <span>Designer at work — image placeholder</span>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ---------- Kind Words / Testimonials ---------- */}
      <Section className="home-words">
        <div className="container">
          <motion.div
            className="home-words__panel"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <h2 className="home-words__title">Kind Words</h2>

            <blockquote className="home-words__quote">
              <p>
                "Channing made an extra effort to add elements that were
                personal to us. She made sure our space reflected us as
                individuals and as a family."
              </p>

              <cite className="home-words__cite">— Jaya Dixon</cite>
            </blockquote>
          </motion.div>
        </div>
      </Section>
    </>
  );
}

export default Home;
