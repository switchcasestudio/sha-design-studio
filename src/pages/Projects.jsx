import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ease, duration, stagger, slideUp } from '@/lib/motion';
import blueShape1 from '@/assets/svg/blue-1.svg';
import blueShape2 from '@/assets/svg/blue-2.svg';
import yellowShape1 from '@/assets/svg/yellow-1.svg';
import yellowShape2 from '@/assets/svg/yellow-2.svg';
import yellowShape3 from '@/assets/svg/yellow-3.svg';
import creamShape1 from '@/assets/svg/cream-1.svg';
import creamShape2 from '@/assets/svg/cream-2.svg';
import redShape1 from '@/assets/svg/red-1.svg';
import redShape2 from '@/assets/svg/red-2.svg';
import redShape3 from '@/assets/svg/red-3.svg';
import './Projects.css';

/* ==========================================================================
   Color worlds — reuse existing palette tokens. `bg` paints the scene;
   `text` selects a text-color class (pairings already shipped elsewhere on
   the site, so contrast is a known-good ≥4.5:1).
   ========================================================================== */
const WORLDS = {
  cream: { bg: 'var(--color-cream)', text: 'ink' },
  blue: { bg: 'var(--color-blue)', text: 'cream' },
  yellow: { bg: 'var(--color-yellow)', text: 'ink' },
  orange: { bg: 'var(--color-orange)', text: 'cream' },
};

/* Resting anchors for motifs — all in the side margins / far corners, never
   inside the central product+text safe zone. Entry edge + depth drive the
   scrubbed convergence and parallax. */
const ANCHORS = [
  { left: '5%', top: '15%', from: 'left', fromY: -8, size: '11vw', rot: -12 },
  { left: '86%', top: '11%', from: 'right', fromY: -6, size: '8.5vw', rot: 10 },
  { left: '9%', top: '63%', from: 'left', fromY: 10, size: '10vw', rot: 8 },
  { left: '85%', top: '60%', from: 'right', fromY: 8, size: '12vw', rot: -8 },
  { left: '90%', top: '35%', from: 'right', fromY: -4, size: '7vw', rot: 16 },
];

/* Per-scene config keyed by project id: color world + motif SVG sources
   (chosen to read against the world's background). Max 5 motifs — curated. */
const SCENES = {
  'here-i-grow-activity-center': {
    world: 'cream',
    motifs: [blueShape1, redShape1, yellowShape1, blueShape2, redShape2],
  },
  'treasure-the-ocean-gymini': {
    world: 'blue',
    motifs: [creamShape1, yellowShape1, creamShape2, yellowShape2, redShape1],
  },
  'wooden-toy-design': {
    world: 'cream',
    motifs: [blueShape1, yellowShape2, redShape3, blueShape2, yellowShape1],
  },
  'garden-of-adventures-packaging': {
    world: 'yellow',
    motifs: [blueShape1, redShape1, creamShape1, blueShape2, redShape2],
  },
  'tiny-rockers-shape-sorter': {
    world: 'orange',
    motifs: [creamShape1, yellowShape1, blueShape1, creamShape2, yellowShape2],
  },
  'mobile-character-design': {
    world: 'blue',
    motifs: [creamShape1, yellowShape1, redShape2, creamShape2, yellowShape3],
  },
};

// Pin holds for ~1.1 viewport of scroll past the pinned frame — a normal
// flick carries you through (no scroll-jacking).
const PIN_SCROLL = '115vh';

/* --------------------------------------------------------------------------
   Motif — one decorative blob. Converges to its anchor (0→0.6), holds, then
   scatters back out (0.85→1). x/y are translate offsets from the anchor, so
   "rest" = transform 0 and the element sits exactly at its margin position.
   -------------------------------------------------------------------------- */
function Motif({ progress, anchor, src }) {
  const fromX = anchor.from === 'left' ? -55 : 55; // vw, off the edge
  const x = useTransform(
    progress,
    [0, 0.6, 1],
    [`${fromX}vw`, '0vw', `${fromX * 1.05}vw`]
  );
  const y = useTransform(
    progress,
    [0, 0.6, 1],
    [`${anchor.fromY}vh`, '0vh', `${anchor.fromY}vh`]
  );
  const scale = useTransform(progress, [0, 0.6, 0.85, 1], [0.5, 1, 1, 0.7]);
  const rotate = useTransform(
    progress,
    [0, 0.6, 1],
    [anchor.rot - 30, anchor.rot, anchor.rot - 30]
  );
  const opacity = useTransform(progress, [0, 0.12, 0.82, 1], [0, 1, 1, 0]);

  return (
    <motion.img
      className="scene-motif"
      src={src}
      alt=""
      aria-hidden="true"
      style={{ left: anchor.left, top: anchor.top, width: anchor.size, x, y, scale, rotate, opacity }}
    />
  );
}

// Shared text column (meta + title + description + CTA).
function SceneText({ project, index }) {
  return (
    <div className="scene__text">
      <div className="scene__meta">
        <span className="scene__index">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="scene__category">{project.category}</span>
      </div>
      <h2 className="scene__title">
        <Link to={`/projects/${project.id}`} className="scene__title-link">
          {project.title}
        </Link>
      </h2>
      <p className="scene__description">{project.summary}</p>
      <Link to={`/projects/${project.id}`} className="scene__cta">
        View project
        <ArrowUpRight size={18} strokeWidth={2.25} aria-hidden="true" />
      </Link>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Pinned, scroll-scrubbed scene (desktop, motion allowed).
   -------------------------------------------------------------------------- */
function PinnedScene({ project, scene, world, nextWorld, index, product, lifestyle }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Subtle image parallax + scale inside the pinned frame.
  const productY = useTransform(scrollYProgress, [0, 1], ['4vh', '-4vh']);
  const productScale = useTransform(scrollYProgress, [0, 0.6, 1], [1.04, 1, 1.02]);
  const lifestyleY = useTransform(scrollYProgress, [0, 1], ['-3vh', '5vh']);

  // Text reveals once the assembly reads (0.4→0.7) and clears before the
  // world hand-off so it never sits over a transitioning background.
  const textOpacity = useTransform(scrollYProgress, [0.4, 0.7, 0.9, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.4, 0.7], [28, 0]);

  // Crossfade toward the next world's color in the final stretch.
  const overlayOpacity = useTransform(scrollYProgress, [0.78, 1], [0, 1]);

  return (
    <section
      ref={ref}
      className={`project-scene project-scene--${world.text}`}
      style={{ height: `calc(100vh + ${PIN_SCROLL})`, ['--scene-bg']: world.bg }}
    >
      <div className="project-scene__pin">
        {scene.motifs.map((src, i) =>
          ANCHORS[i] ? (
            <Motif key={src} progress={scrollYProgress} anchor={ANCHORS[i]} src={src} />
          ) : null
        )}

        <div className="scene__stage">
          <motion.figure className="scene__product" style={{ y: productY, scale: productScale }}>
            <img src={product.src} alt={product.alt} width={product.width} height={product.height} loading="lazy" />
          </motion.figure>

          {lifestyle && lifestyle.src !== product.src && (
            <motion.figure className="scene__lifestyle" style={{ y: lifestyleY }}>
              <img src={lifestyle.src} alt={lifestyle.alt} width={lifestyle.width} height={lifestyle.height} loading="lazy" />
            </motion.figure>
          )}

          <motion.div className="scene__text-wrap" style={{ opacity: textOpacity, y: textY }}>
            <SceneText project={project} index={index} />
          </motion.div>
        </div>

        {/* Next-world crossfade — seamless hand-off to the following pin */}
        <div
          className="project-scene__crossfade"
          aria-hidden="true"
          style={{ backgroundColor: nextWorld.bg, opacity: overlayOpacity }}
        />
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Flow scene — mobile + reduced-motion. No pin, no convergence: content flows
   normally with a gentle on-enter reveal (or static under reduced motion).
   -------------------------------------------------------------------------- */
function FlowScene({ project, scene, world, index, product, lifestyle, reduce }) {
  return (
    <section
      className={`project-scene project-scene--flow project-scene--${world.text}`}
      style={{ ['--scene-bg']: world.bg }}
    >
      <motion.div
        className="scene__stage scene__stage--flow"
        variants={reduce ? undefined : slideUp}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className="scene__flow-motifs" aria-hidden="true">
          {scene.motifs.slice(0, 3).map((src) => (
            <img key={src} className="scene-motif scene-motif--flow" src={src} alt="" />
          ))}
        </div>
        <figure className="scene__product">
          <img src={product.src} alt={product.alt} width={product.width} height={product.height} loading="lazy" />
        </figure>
        {lifestyle && lifestyle.src !== product.src && (
          <figure className="scene__lifestyle">
            <img src={lifestyle.src} alt={lifestyle.alt} width={lifestyle.width} height={lifestyle.height} loading="lazy" />
          </figure>
        )}
        <SceneText project={project} index={index} />
      </motion.div>
    </section>
  );
}

function ProjectScene(props) {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const usePin = isDesktop && !reduce;
  return usePin ? <PinnedScene {...props} /> : <FlowScene {...props} reduce={reduce} />;
}

function Projects() {
  return (
    <div className="projects-page">
      <section className="projects-page__hero">
        <div className="container projects-page__hero-inner">
          <motion.h1
            className="projects-page__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.entrance, ease: ease.bloom }}
          >
            Portfolio
          </motion.h1>

          <motion.p
            className="projects-page__intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.entrance, ease: ease.settle, delay: 0.1 }}
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
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: duration.entrance,
                    ease: ease.settle,
                    delay: (idx % 3) * stagger,
                  }}
                >
                  <Link to={`/projects/${project.id}`} className="overview-card__link">
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
                      <span className="overview-card__studio">{project.client}</span>
                      <h2 className="overview-card__title">{project.title}</h2>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Pinned, assembling case-study scenes ---------- */}
      <div className="project-scenes">
        {projects.map((project, idx) => {
          const scene = SCENES[project.id] ?? {
            world: 'cream',
            motifs: [blueShape1, redShape1, yellowShape1],
          };
          const world = WORLDS[scene.world];
          const next = projects[idx + 1];
          const nextScene = next ? SCENES[next.id] : null;
          const nextWorld = nextScene ? WORLDS[nextScene.world] : world;
          const product = project.heroImage ?? project.images[0];
          const lifestyle =
            project.images.find((img) => img && img.src !== product?.src) ?? null;

          return (
            <ProjectScene
              key={project.id}
              project={project}
              scene={scene}
              world={world}
              nextWorld={nextWorld}
              index={idx}
              product={product}
              lifestyle={lifestyle}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Projects;
