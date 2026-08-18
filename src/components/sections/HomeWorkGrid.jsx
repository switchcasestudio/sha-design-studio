import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import Button from '@/components/ui/Button';
import CloudBadge from '@/components/ui/CloudBadge';
import { projects } from '@/data';
import { gridContainer, gridCard, reducedReveal } from '@/lib/motion';
import './HomeWorkGrid.css';

// Short cloud-badge labels per project (titles are too long for a badge).
const BADGE_LABELS = {
  'here-i-grow-activity-center': 'Activity center',
  'treasure-the-ocean-gymini': 'Play gym',
  'wooden-toy-design': 'Wooden toys',
  'garden-of-adventures-packaging': 'Gift set & packaging',
  'tiny-rockers-shape-sorter': 'Shape sorter',
  'mobile-character-design': 'Mobiles',
};

// Prefer a lifestyle frame over the default packshot hero where one lands
// better in the grid — matched by filename fragment, falling back safely.
const IMAGE_OVERRIDES = {
  'here-i-grow-activity-center': '18-TPSAC19',
  'treasure-the-ocean-gymini': '11-GYMINIOCEAN4',
  'wooden-toy-design': 'woodenstackingtrain8',
  'garden-of-adventures-packaging': 'giftset-6',
  'mobile-character-design': 'Take-Along-Mobile-2',
};

// Per-slot frame shape. Varying the aspect is what stops the collage reading as
// a uniform bento — each column gets a tall/wide/tall rhythm instead of a grid.
// Index is the slot within its own column, not the project order.
const COLUMN_RATIOS = {
  left: ['4 / 3', '5 / 4', '16 / 11'],
  right: ['16 / 11', '4 / 3', '5 / 4'],
};

// Badges alternate corners down the page so the collage doesn't develop a
// single hard alignment edge.
const BADGE_SIDES = ['right', 'left', 'left', 'right', 'right', 'left'];

function cardImage(project) {
  const needle = IMAGE_OVERRIDES[project.id];
  const override = needle
    ? project.images.find((image) => image.src.includes(needle))
    : null;
  return override ?? project.heroImage ?? project.images[0];
}

function WorkCard({ project, ratio, badgeSide, reduce }) {
  const image = cardImage(project);
  if (!image) return null;

  return (
    <motion.figure
      className="home-work__card"
      variants={reduce ? reducedReveal : gridCard}
    >
      {/* Badge is a sibling of the link, not a child: the link clips its own
          corners, and the badge needs to overhang the frame's edge. */}
      <CloudBadge
        className={`home-work__badge home-work__badge--${badgeSide}`}
      >
        {BADGE_LABELS[project.id] ?? project.client}
      </CloudBadge>

      <Link to={`/projects/${project.id}`} className="home-work__link">
        <img
          className="home-work__image"
          src={image.src}
          alt={image.alt}
          style={{ aspectRatio: ratio }}
          loading="lazy"
        />
      </Link>

      {/* Caption sits under the frame and is always readable — it used to live
          on a hover scrim, which hid the project name on touch entirely. */}
      <figcaption className="home-work__caption">
        <Link to={`/projects/${project.id}`} className="home-work__caption-link">
          <span className="home-work__client">{project.client}</span>
          <span className="home-work__dash"> — </span>
          <span className="home-work__name">{project.title}</span>
        </Link>
      </figcaption>
    </motion.figure>
  );
}

/**
 * "Fresh from the studio" — the homepage's centrepiece: real work, on the
 * homepage, one click from its case study. Two staggered columns of
 * varying-height frames with captions beneath, per the brand's "never a
 * perfectly even grid" rule.
 */
function HomeWorkGrid() {
  const reduce = useReducedMotion();
  const featured = projects.slice(0, 6);

  // Deal the projects into two columns, keeping source order down the page.
  const columns = {
    left: featured.filter((_, i) => i % 2 === 0),
    right: featured.filter((_, i) => i % 2 === 1),
  };

  return (
    <div className="container">
      <div className="home-work__head">
        <h2 className="home-work__title">Fresh from the studio</h2>
        <Button as={Link} to="/projects" variant="outline" size="md">
          All projects
        </Button>
      </div>

      <motion.div
        className="home-work__collage"
        variants={reduce ? reducedReveal : gridContainer}
        initial={reduce ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        {['left', 'right'].map((side) => (
          <div key={side} className={`home-work__col home-work__col--${side}`}>
            {columns[side].map((project, slot) => (
              <WorkCard
                key={project.id}
                project={project}
                ratio={COLUMN_RATIOS[side][slot % COLUMN_RATIOS[side].length]}
                badgeSide={
                  BADGE_SIDES[featured.indexOf(project) % BADGE_SIDES.length]
                }
                reduce={reduce}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default HomeWorkGrid;
