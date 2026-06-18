import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects, getProjectById } from '@/data';
import { siteConfig } from '@/utils/siteConfig';
import PhotoGallery from '@/components/ui/PhotoGallery';
import Lightbox from '@/components/ui/Lightbox';
import './ProjectDetail.css';

const spring = { type: 'spring', stiffness: 200, damping: 22 };

// Tags reveal in a staggered cascade, then each pops on hover.
const tagsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
};
const tagItem = {
  hidden: { opacity: 0, y: 8, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring },
};

// How a project's multiple collections relate to each other. Kept app-side
// because the source data is generated ("do not edit by hand").
//   default  — a colorway set (same product, different looks)
//   family   — distinct products that share a style
//   mixed    — a deliverable + the products it covers (e.g. packaging + toys)
const COLLECTION_KIND = {
  'wooden-toy-design': 'family',
  'garden-of-adventures-packaging': 'mixed',
};

// Reduce a set of collection titles to the distinctive part of each by
// stripping the words they all share at the start and/or end — so
// "Boho Chic Wooden Ride on Trike" / "…Stacking Train" become "Ride on Trike"
// / "Stacking Train", and the activity-center titles become their color names.
function distinctiveLabels(titles) {
  const rows = titles.map((t) => t.trim().split(/\s+/));
  if (rows.length === 0) return [];
  const minLen = Math.min(...rows.map((r) => r.length));
  const eq = (a, b) => (a ?? '').toLowerCase() === (b ?? '').toLowerCase();

  let lead = 0;
  while (lead < minLen - 1 && rows.every((r) => eq(r[lead], rows[0][lead]))) {
    lead += 1;
  }
  let trail = 0;
  while (
    trail < minLen - lead - 1 &&
    rows.every((r) =>
      eq(r[r.length - 1 - trail], rows[0][rows[0].length - 1 - trail])
    )
  ) {
    trail += 1;
  }

  return rows.map((words, i) => {
    const mid = words.slice(lead, words.length - trail).join(' ').trim();
    return mid || titles[i];
  });
}

function ProjectDetail() {
  const { projectId } = useParams();
  const project = getProjectById(projectId);
  // Index into the active image set currently open in the lightbox (null = closed)
  const [lightboxIndex, setLightboxIndex] = useState(null);
  // Which product collection (color world) is shown, for multi-collection projects
  const [collectionIndex, setCollectionIndex] = useState(0);

  // Per-project SEO title from the data, restored on unmount
  useEffect(() => {
    if (project) {
      document.title =
        project.seo?.title ?? `${project.title} | ${siteConfig.name}`;
    }
    return () => {
      document.title = `${siteConfig.name} — ${siteConfig.tagline}`;
    };
  }, [project]);

  // Reset the collection + lightbox when navigating to a different project
  useEffect(() => {
    setCollectionIndex(0);
    setLightboxIndex(null);
  }, [projectId]);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const index = projects.findIndex((p) => p.id === project.id);
  const nextProject = projects[(index + 1) % projects.length];

  // Multi-collection projects show a switcher; selecting one swaps every
  // displayed image set to that collection. Single-collection projects fall
  // back to the flat image list. A "family" is distinct products that share a
  // style (shown as larger product cards); the default is a colorway set.
  const collections = project.collections ?? [];
  const hasCollections = collections.length > 1;
  const collectionKind = COLLECTION_KIND[project.id];
  const isFamily = collectionKind === 'family';
  const isMixed = collectionKind === 'mixed';
  // Both families and mixed sets read better as larger, name-forward cards.
  const useCards = isFamily || isMixed;
  const collectionsHeading = isMixed
    ? 'In this project'
    : isFamily
      ? 'Products in this family'
      : 'Collections';
  const collectionLabels = distinctiveLabels(collections.map((c) => c.title));
  const activeCollection = hasCollections
    ? collections[Math.min(collectionIndex, collections.length - 1)]
    : null;
  const activeImages = activeCollection ? activeCollection.images : project.images;

  // Only the fanned marketing shots are shown for now; the grid of remaining
  // photos was removed and will be replaced by creation/process imagery later.
  const FAN_COUNT = 5;
  const fanImages = activeImages.slice(0, FAN_COUNT);

  const selectCollection = (i) => {
    setCollectionIndex(i);
    setLightboxIndex(null);
  };

  return (
    <div className="project-detail">
      <div className="container">
        {/* ---------- Header: identity left, reference meta right ---------- */}
        <motion.header
          className="project-detail__header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.05 }}
        >
          <Link to="/projects" className="project-detail__back">
            ← All Projects
          </Link>

          <div className="project-detail__header-grid">
            <div className="project-detail__intro">
              <span className="project-detail__category">
                {project.category}
              </span>
              <h1 className="project-detail__title">{project.title}</h1>
              <p className="project-detail__summary">{project.summary}</p>

              <motion.ul
                className="project-detail__tags"
                variants={tagsContainer}
                initial="hidden"
                animate="show"
              >
                {project.tags.map((tag) => (
                  <motion.li
                    key={tag}
                    className="project-detail__tag"
                    variants={tagItem}
                    whileHover={{ scale: 1.07, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {tag}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <aside className="project-detail__aside">
              <dl className="project-detail__meta">
                <div className="project-detail__meta-item">
                  <dt>Client</dt>
                  <dd>{project.client}</dd>
                </div>

                <div className="project-detail__meta-item">
                  <dt>Role</dt>
                  <dd>
                    <ul className="project-detail__roles">
                      {project.role.map((role) => (
                        <li key={role}>{role}</li>
                      ))}
                    </ul>
                  </dd>
                </div>

              </dl>
            </aside>
          </div>
        </motion.header>

        {/* ---------- Collection switcher (colorways or product family) ---------- */}
        {hasCollections && (
          <div
            className={`project-detail__collections${
              useCards ? ' project-detail__collections--cards' : ''
            }`}
            role="group"
            aria-label={collectionsHeading}
          >
            <span className="project-detail__collections-label">
              {collectionsHeading}
              {isFamily && (
                <span className="project-detail__collections-count">
                  {' · '}
                  {collections.length}
                </span>
              )}
            </span>
            <ul className="project-detail__swatches">
              {collections.map((collection, i) => (
                <li key={collection.slug}>
                  <button
                    type="button"
                    className="project-detail__swatch"
                    aria-pressed={i === collectionIndex}
                    onClick={() => selectCollection(i)}
                  >
                    <span className="project-detail__swatch-thumb">
                      <img
                        src={collection.images[0].src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className="project-detail__swatch-name">
                      {collectionLabels[i]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---------- Fanned photo stack ---------- */}
        <PhotoGallery
          key={activeCollection ? activeCollection.slug : 'all'}
          images={fanImages}
          max={FAN_COUNT}
          onPhotoTap={setLightboxIndex}
        />

        <Lightbox
          images={fanImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />

        {/* ---------- Footer nav ---------- */}
        <nav className="project-detail__nav" aria-label="Project navigation">
          <Link to="/projects" className="project-detail__back">
            ← All Projects
          </Link>

          <Link
            to={`/projects/${nextProject.id}`}
            className="project-detail__next"
          >
            <span className="project-detail__next-label">Next Project</span>
            <span className="project-detail__next-title">
              {nextProject.title} →
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default ProjectDetail;
