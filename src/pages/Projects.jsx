import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import CloudBadge from '@/components/ui/CloudBadge';
import { projects } from '@/data';
import { rise } from '@/lib/motion';
import { inlineSvg } from '@/utils/svg';
import daisyRaw from '@/assets/svg/daisy-yellow.svg?raw';
import woodenCover from '@/assets/images/projects/products/wooden-collection-cover.webp';
import gardenCover from '@/assets/images/projects/products/garden-collection-cover.webp';
import woodenCoverMobile from '@/assets/images/projects/products/wooden-collection-cover-mobile.webp';
import gardenCoverMobile from '@/assets/images/projects/products/garden-collection-cover-mobile.webp';
import shapeSorterCover from '@/assets/images/projects/products/shape-sorter/11-Tiny-Rockers-Shape-Sorter-15.webp';
import { useTheme } from '@/theme/ThemeContext';
import SplitText from '@/theme/vivid/SplitText';
import { spring } from '@/theme/vivid/motion';
import { useTilt } from '@/theme/vivid/work/useTilt';
import ParallaxImg from '@/theme/vivid/work/ParallaxImg';
import ScrollMarquee from '@/theme/vivid/work/ScrollMarquee';
import './Projects.css';

// Tiles that span the full row in the overview grid — each carries a long
// landscape cover photo instead of pairing up 2-up. Order is driven by each
// project's `order` field so these land on their own rows (positions 3 & 6).
const WIDE_PROJECT_IDS = new Set([
  'wooden-toy-design',
  'garden-of-adventures-packaging',
]);

// Short cloud-badge labels per project (titles are too long for a badge) —
// same wording as the homepage grid so a project keeps its name across pages.
const BADGE_LABELS = {
  'here-i-grow-activity-center': 'Activity center',
  'treasure-the-ocean-gymini': 'Play gym',
  'wooden-toy-design': 'Wooden toys',
  'garden-of-adventures-packaging': 'Gift set & packaging',
  'tiny-rockers-shape-sorter': 'Shape sorter',
  'mobile-character-design': 'Mobiles',
};

// Explicit cover image for a card, overriding the default (heroImage / first
// image). Two uses:
//  - the wide 3:1 tiles get purpose-built covers with the whole collection
//    lined up on one white canvas (composed from the individual packshots),
//    plus a 4:3 two-row version for phones (`mobileSrc`), where cropping the
//    3:1 lineup would cut products in half;
//  - Shape Sorter's default first frame is a lifestyle "vibe" shot (baby on a
//    rug), unlike every other card's clean packshot, so it's pinned to the
//    white product photo to match the set.
const COVER_OVERRIDES = {
  'wooden-toy-design': {
    src: woodenCover,
    mobileSrc: woodenCoverMobile,
    alt: 'The wooden toy collection lined up together: stacking train, car race ramp, ride-on trike and activity walk-behind',
  },
  'garden-of-adventures-packaging': {
    src: gardenCover,
    mobileSrc: gardenCoverMobile,
    alt: 'Garden of Adventures collection: bunny comforter with beet rattle, My First Garden gift box and carded rattle packaging',
  },
  'tiny-rockers-shape-sorter': {
    src: shapeSorterCover,
    alt: 'Tiny Rockers Shape Sorter — the cream disc with six tactile geometric shapes, shown top-down on white',
  },
};

// One paper motif in the header — paper is the only shape colour that sits
// on a tomato ground (brand rule: never a shape on its own colour).
const DAISY = inlineSvg(daisyRaw);

// "2-in-1" must not wrap at its hyphens — swap in U+2011 non-breaking hyphens
const noBreakHyphens = (text) => text.replace(/-/g, '\u2011');

// Vivid theme: cards drop in on scroll with a springy overshoot, tipping in
// from alternating sides (left column one way, right column the other).
const cardPop = (idx) => ({
  hidden: { opacity: 0, y: 140, scale: 0.86, rotate: idx % 2 ? 6 : -6 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { ...spring.bouncy, delay: (idx % 2) * 0.1 },
  },
});

// Each card is a paper frame around the photo with the title beneath. Hover
// is a single 220ms colour swap (paper → yolk frame); nothing lifts or zooms.
// In the vivid theme the card tilts toward the pointer, the photo drifts
// with scroll and zooms on hover, and a "View case study" tab slides up.
function OverviewCard({ project, idx, reduce, isVivid }) {
  const image =
    COVER_OVERRIDES[project.id] ?? project.heroImage ?? project.images[0];
  const isWide = WIDE_PROJECT_IDS.has(project.id);
  const tilt = useTilt(isWide ? 3 : 7);

  const enterProps = isVivid
    ? {
        initial: 'hidden',
        whileInView: 'show',
        viewport: { once: true, amount: 0.15 },
        variants: cardPop(idx),
        style: tilt.style,
        ...tilt.handlers,
        'data-cursor': 'View',
      }
    : {
        initial: reduce ? false : { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { ...rise, delay: 0.2 + idx * 0.06 },
      };

  const ImgTag = isVivid ? ParallaxImg : 'img';

  return (
    <motion.li
      className={`overview-card${isWide ? ' overview-card--wide' : ''}`}
      {...enterProps}
    >
      <Link to={`/projects/${project.id}`} className="overview-card__link">
        <div className="overview-card__media">
          {image && (
            <picture>
              {image.mobileSrc && (
                <source media="(max-width: 560px)" srcSet={image.mobileSrc} />
              )}
              <ImgTag
                className="overview-card__image"
                src={image.src}
                alt={image.alt}
                loading={idx < 3 ? 'eager' : 'lazy'}
                {...(isVivid
                  ? // Wide covers are full lineups — barely over-scale them
                    // so no product gets cropped off the ends.
                    isWide
                    ? { distance: 2.5, scale: 1.06 }
                    : { distance: 9 }
                  : {})}
              />
            </picture>
          )}
          {isVivid && (
            <>
              <span className="overview-card__glare" aria-hidden="true" />
              <span className="overview-card__num" aria-hidden="true">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="overview-card__peek" aria-hidden="true">
                View case study
                <ArrowUpRight size={18} strokeWidth={2} />
              </span>
            </>
          )}
          <CloudBadge className="overview-card__badge">
            {BADGE_LABELS[project.id] ?? project.category}
          </CloudBadge>
        </div>

        <div className="overview-card__body">
          <div className="overview-card__text">
            {project.client && (
              <span className="overview-card__client">{project.client}</span>
            )}
            <h3 className="overview-card__title">
              {noBreakHyphens(project.title)}
            </h3>
          </div>
          <span className="overview-card__go" aria-hidden="true">
            <ArrowUpRight size={20} strokeWidth={2} />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

function Projects() {
  const reduce = useReducedMotion();
  const { isVivid } = useTheme();
  const enter = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { ...rise, delay },
  });

  return (
    <div className="projects-page ground-tomato">
      <section className="projects-page__hero">
        <div className="container projects-page__hero-inner">
          <div className="projects-page__title-row">
            <motion.h1
              className="projects-page__title"
              {...(isVivid ? {} : enter(0.05))}
            >
              <SplitText text="Selected" by="chars" trigger="mount" />{' '}
              <span className="hl">
                <SplitText text="work" by="chars" trigger="mount" delay={0.35} />
              </span>
            </motion.h1>
            <span
              className="projects-page__motif"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: DAISY }}
            />
          </div>

          <motion.p
            className="projects-page__intro"
            {...(isVivid
              ? {
                  initial: { opacity: 0, x: 60 },
                  animate: { opacity: 1, x: 0 },
                  transition: { ...spring.soft, delay: 0.45 },
                }
              : enter(0.12))}
          >
            <span className="projects-page__intro-key">
              Toys, baby gear and the boxes they arrive in
            </span>{' '}
            &mdash; a few favourites from the shelf, each designed from first
            sketch to little hands.
          </motion.p>

        </div>

        {isVivid && (
          <ScrollMarquee
            className="projects-page__marquee"
            text="Designed for little hands"
          />
        )}

        {/* Overview grid — a clickable glimpse of every project, jumping
            straight to each case study. */}
        <div className="container">
          <ul className="projects-overview">
            {projects.map((project, idx) => (
              <OverviewCard
                key={project.id}
                project={project}
                idx={idx}
                reduce={reduce}
                isVivid={isVivid}
              />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Projects;
