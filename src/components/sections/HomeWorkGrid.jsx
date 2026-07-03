import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import Button from '@/components/ui/Button';
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

function cardImage(project) {
  const needle = IMAGE_OVERRIDES[project.id];
  const override = needle
    ? project.images.find((image) => image.src.includes(needle))
    : null;
  return override ?? project.heroImage ?? project.images[0];
}

/**
 * "Fresh from the studio" — the homepage's missing centrepiece: real work,
 * on the homepage, one click from its case study. Asymmetric per the brand
 * grid rule: the first project takes a tall feature slot, four tiles wrap it.
 */
function HomeWorkGrid() {
  const reduce = useReducedMotion();
  const featured = projects.slice(0, 5);

  return (
    <div className="container">
      <div className="home-work__head">
        <h2 className="home-work__title">Fresh from the studio</h2>
        <Button as={Link} to="/projects" variant="outline" size="md">
          All projects
        </Button>
      </div>

      <motion.ul
        className="home-work__grid"
        variants={reduce ? reducedReveal : gridContainer}
        initial={reduce ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        {featured.map((project, idx) => {
          const image = cardImage(project);
          if (!image) return null;
          return (
            <motion.li
              key={project.id}
              className={`home-work__card${idx === 0 ? ' home-work__card--feature' : ''}`}
              variants={reduce ? reducedReveal : gridCard}
            >
              <Link to={`/projects/${project.id}`} className="home-work__link">
                <img
                  className="home-work__image"
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                />
                <span className="home-work__badge">
                  {BADGE_LABELS[project.id] ?? project.client}
                </span>
                <span className="home-work__scrim">
                  <span className="home-work__name">{project.title}</span>
                </span>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}

export default HomeWorkGrid;
