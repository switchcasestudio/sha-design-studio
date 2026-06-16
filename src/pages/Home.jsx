import { Link } from 'react-router-dom';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useRef } from 'react';
import Button from '@/components/ui/Button';
import GooeyText from '@/components/ui/GooeyText';
import HomeAssemble from '@/components/sections/HomeAssemble';
import {
  badgeBloom,
  gridCard,
  gridContainer,
  heroContainer,
  heroLine,
  reducedReveal,
  slideUp,
} from '@/lib/motion';
import { siteConfig } from '@/utils/siteConfig';
import { projects } from '@/data';
import { testimonials } from '@/data/testimonials';
import redShape from '@/assets/svg/red-2.svg';
import blueShape from '@/assets/svg/blue-2.svg';
import shiranAtWork from '@/assets/images/shiran-in-photoshooting.png';
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

// Hero headline phrases — gooey-morphed in place.
const heroPhrases = [
  'Designing Playful Products',
  'Designing Thoughtful Products',
  'Simple, Smart, Full of Wonder',
];

// Decorative motif: continuous parallax drift (style.y) wraps a one-shot
// bloom (scale/rotate via variants) — different MotionValues, no conflict.
// The bloom only plays when the grid's intro runs; otherwise the parent
// starts at "show" and the badge is rendered already settled.
function ProjectBadge({ badge, driftY, reduce }) {
  return (
    <motion.div
      className="project-card__badge-motif"
      style={reduce ? undefined : { y: driftY }}
      variants={badgeBloom}
    >
      <img
        src={badge.src}
        alt=""
        className="project-card__badge-shape"
        aria-hidden="true"
      />
      <span className="project-card__badge-text">{badge.label}</span>
    </motion.div>
  );
}

// Color-world block: slides up and settles on enter (position/opacity only —
// the block's own background color is never touched).
function ColorWorld({ children, className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      className={className}
      variants={reduce ? reducedReveal : slideUp}
      initial={reduce ? 'show' : 'hidden'}
      animate={inView ? 'show' : undefined}
    >
      {children}
    </motion.section>
  );
}

function Home() {
  const reduce = useReducedMotion();

  // Under reduced motion, elements start in their final "show" state — no
  // entrance. Otherwise the orchestrated entrance plays on every load.
  const introStart = reduce ? 'show' : 'hidden';

  // Ambient parallax for the badge motifs, driven by the grid's scroll
  // position. Two different speeds + directions give a sense of depth.
  const gridRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start'],
  });
  const driftSlow = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const driftFast = useTransform(scrollYProgress, [0, 1], [-26, 26]);
  const drifts = [driftSlow, driftFast];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="home-hero">
        <motion.div
          className="container home-hero__inner"
          variants={heroContainer}
          initial={introStart}
          animate="show"
        >
          <motion.p className="home-hero__brand" variants={heroLine}>
            {siteConfig.name}
          </motion.p>

          <motion.h1 className="home-hero__title" variants={heroLine}>
            <GooeyText
              texts={heroPhrases}
              morphTime={1.2}
              cooldownTime={2.5}
              label={siteConfig.tagline}
            />
          </motion.h1>
        </motion.div>
      </section>

      {/* ---------- Signature scroll-pinned assemble (GSAP) ---------- */}
      <HomeAssemble />

      {/* ---------- Featured projects grid ---------- */}
      <section className="home-projects">
        <div className="container">
          <motion.div
            ref={gridRef}
            className="home-projects__grid"
            variants={gridContainer}
            initial={introStart}
            animate="show"
          >
            {/* Featured / large project */}
            <motion.article
              className="project-card project-card--feature"
              variants={gridCard}
              whileHover={reduce ? undefined : { y: -6 }}
            >
              <Link
                to={`/projects/${featuredProjects[0].id}`}
                className="project-card__link"
              >
                <div className="project-card__media">
                  <img
                    className="project-card__image"
                    src={featuredProjects[0].image.src}
                    alt={featuredProjects[0].image.alt}
                    width={featuredProjects[0].image.width}
                    height={featuredProjects[0].image.height}
                  />
                </div>

                <div className="project-card__caption">
                  <span className="project-card__studio">
                    {featuredProjects[0].studio}
                  </span>

                  <h3 className="project-card__title">
                    {featuredProjects[0].title}
                  </h3>
                </div>
              </Link>

              {featuredProjects[0].badge && (
                <div className="project-card__badge project-card__badge--top-right">
                  <ProjectBadge
                    badge={featuredProjects[0].badge}
                    driftY={drifts[0]}
                    reduce={reduce}
                  />
                </div>
              )}
            </motion.article>

            {/* Secondary projects */}
            {featuredProjects.slice(1).map((project, i) => (
              <motion.article
                key={project.id}
                className="project-card"
                variants={gridCard}
                whileHover={reduce ? undefined : { y: -6 }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  className="project-card__link"
                >
                  <div className="project-card__media">
                    <img
                      className="project-card__image"
                      src={project.image.src}
                      alt={project.image.alt}
                      width={project.image.width}
                      height={project.image.height}
                      loading="lazy"
                    />
                  </div>

                  <div className="project-card__caption">
                    <span className="project-card__studio">
                      {project.studio}
                    </span>
                    <h3 className="project-card__title">{project.title}</h3>
                  </div>
                </Link>

                {project.badge && (
                  <div className="project-card__badge project-card__badge--top-left">
                    <ProjectBadge
                      badge={project.badge}
                      driftY={drifts[i + 1] ?? drifts[1]}
                      reduce={reduce}
                    />
                  </div>
                )}
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- "What I Do" CTA ---------- */}
      <ColorWorld className="home-what">
        <div className="container">
          <div className="home-what__panel">
            <div className="home-what__copy">
              <h2 className="home-what__title">What I Do</h2>

              <p className="home-what__text">
                I help brands, startups and entrepreneurs turn ideas into
                meaningful products — from research and concept development to
                product design, 3D visualization and development support.
              </p>

              <Button as={Link} to="/services" variant="outline" size="md">
                Explore My Services
              </Button>
            </div>

            <div className="home-what__media">
              <img
                className="home-what__image"
                src={shiranAtWork}
                alt={`${siteConfig.designer} at work in a product photoshoot`}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </ColorWorld>

      {/* ---------- Kind Words / Testimonials ---------- */}
      <ColorWorld className="home-words">
        <div className="container">
          <div className="home-words__panel">
            <h2 className="home-words__title">Kind Words</h2>

            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.id} className="home-words__quote">
                <p>"{testimonial.comment}"</p>

                <footer className="home-words__attribution">
                  {testimonial.image && (
                    <img
                      className="home-words__avatar"
                      src={testimonial.image}
                      alt={testimonial.name}
                      loading="lazy"
                    />
                  )}
                  <cite className="home-words__cite">
                    <span className="home-words__name">
                      — {testimonial.name}
                    </span>
                    {testimonial.title && (
                      <span className="home-words__role">
                        {testimonial.title}
                      </span>
                    )}
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </ColorWorld>
    </>
  );
}

export default Home;
