import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import CloudBadge from '@/components/ui/CloudBadge';
import { projects } from '@/data';
import { inlineSvg } from '@/utils/svg';
import daisyRaw from '@/assets/svg/daisy-yellow.svg?raw';
import cloverRaw from '@/assets/svg/clover-blue.svg?raw';
import flowerRaw from '@/assets/svg/flower-yellow.svg?raw';
import starRaw from '@/assets/svg/star-blue.svg?raw';
import woodenCover from '@/assets/images/projects/products/wooden-collection-cover.webp';
import gardenCover from '@/assets/images/projects/products/garden-collection-cover.webp';
import shapeSorterCover from '@/assets/images/projects/products/shape-sorter/11-Tiny-Rockers-Shape-Sorter-15.webp';
import './Projects.css';

const spring = { type: 'spring', stiffness: 200, damping: 22 };

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
//    lined up on one white canvas (composed from the individual packshots);
//  - Shape Sorter's default first frame is a lifestyle "vibe" shot (baby on a
//    rug), unlike every other card's clean packshot, so it's pinned to the
//    white product photo to match the set.
const COVER_OVERRIDES = {
  'wooden-toy-design': {
    src: woodenCover,
    alt: 'The wooden toy collection lined up together: stacking train, car race ramp, ride-on trike and activity walk-behind',
  },
  'garden-of-adventures-packaging': {
    src: gardenCover,
    alt: 'Garden of Adventures collection: bunny comforter with beet rattle, My First Garden gift box and carded rattle packaging',
  },
  'tiny-rockers-shape-sorter': {
    src: shapeSorterCover,
    alt: 'Tiny Rockers Shape Sorter — the cream disc with six tactile geometric shapes, shown top-down on white',
  },
};

// Second frame that peeks in on hover — a lifestyle shot to contrast the
// packshot cover, matched by filename fragment with a safe fallback to any
// other frame in the project.
const PEEK_OVERRIDES = {
  'here-i-grow-activity-center': '18-TPSAC19',
  'treasure-the-ocean-gymini': '11-GYMINIOCEAN4',
  'wooden-toy-design': 'woodenstackingtrain8',
  'garden-of-adventures-packaging': 'giftset-6',
  'mobile-character-design': 'Take-Along-Mobile-2',
};

function peekFrame(project, primary) {
  if (!primary) return null;
  const needle = PEEK_OVERRIDES[project.id];
  const override = needle
    ? project.images.find(
        (image) => image.src.includes(needle) && image.src !== primary.src
      )
    : null;
  return (
    override ??
    project.images.find((image) => image.src !== primary.src) ??
    null
  );
}

// Brand motifs tucked behind the card corners — geometry from the shared SVG
// set, tinted via `color` on the wrapper (see utils/svg.js).
const MOTIFS = {
  daisy: inlineSvg(daisyRaw),
  clover: inlineSvg(cloverRaw),
  flower: inlineSvg(flowerRaw),
  star: inlineSvg(starRaw),
};

function OverviewCard({ project, idx }) {
  // The hover frame only mounts (and therefore only loads) on first
  // hover/focus — nobody pays for images they never peek at.
  const [peek, setPeek] = useState(false);
  const image =
    COVER_OVERRIDES[project.id] ?? project.heroImage ?? project.images[0];
  const peekImage = peek ? peekFrame(project, image) : null;
  const isWide = WIDE_PROJECT_IDS.has(project.id);
  const wake = () => setPeek(true);

  return (
    <motion.li
      className={`overview-card${isWide ? ' overview-card--wide' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.35 + idx * 0.06 }}
    >
      <Link
        to={`/projects/${project.id}`}
        className="overview-card__link"
        onPointerEnter={wake}
        onFocus={wake}
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
          {peekImage && (
            <img
              className="overview-card__image overview-card__image--peek"
              src={peekImage.src}
              alt=""
              aria-hidden="true"
            />
          )}
          <CloudBadge className="overview-card__badge">
            {BADGE_LABELS[project.id] ?? project.category}
          </CloudBadge>
          {/* Client kicker + title overlaid on a scrim at the bottom of the
              image, so every card is a single fixed-ratio tile and the grid
              rows stay evenly spaced. */}
          <div className="overview-card__body">
            {project.client && (
              <span className="overview-card__client">{project.client}</span>
            )}
            <h2 className="overview-card__title">{project.title}</h2>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}

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
            Toys, baby gear and the boxes they arrive in &mdash; a few
            favourites from the shelf, each designed from first sketch to
            little hands.
          </motion.p>
        </div>

        {/* Overview grid — a clickable glimpse of every project, jumping
            straight to each case study. Cards sit slightly tilted like
            snapshots on a table and straighten when you reach for them. */}
        <div className="container">
          <ul className="projects-overview">
            {/* Motifs float over the card corners like stickers. Absolutely
                positioned li's don't take grid cells, so the 2-up flow of the
                real cards is untouched. */}
            <li
              className="projects-overview__motif projects-overview__motif--daisy"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: MOTIFS.daisy }}
            />
            <li
              className="projects-overview__motif projects-overview__motif--clover"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: MOTIFS.clover }}
            />
            <li
              className="projects-overview__motif projects-overview__motif--flower"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: MOTIFS.flower }}
            />
            <li
              className="projects-overview__motif projects-overview__motif--star"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: MOTIFS.star }}
            />

            {projects.map((project, idx) => (
              <OverviewCard key={project.id} project={project} idx={idx} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Projects;
