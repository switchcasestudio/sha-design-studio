import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, ZoomIn } from 'lucide-react';
import { projects, getProjectById } from '@/data';
import { getCaseStudy } from '@/data/caseStudies';
import { getContentForProject } from '@/data/projectContent';
import { siteConfig } from '@/utils/siteConfig';
import PhotoGallery from '@/components/ui/PhotoGallery';
import Lightbox from '@/components/ui/Lightbox';
import { rise } from '@/lib/motion';
import './ProjectDetail.css';

// The one phrase per project title that sits in the highlight block. Kept to
// 1–3 words (the block never wraps). Falls back to the title's last word.
const TITLE_HIGHLIGHT = {
  'here-i-grow-activity-center': 'Here I Grow',
  'treasure-the-ocean-gymini': 'Treasure the Ocean',
  'wooden-toy-design': 'Wooden Toy',
  'garden-of-adventures-packaging': 'Adventures',
  'tiny-rockers-shape-sorter': 'Sorter',
  'mobile-character-design': 'Mobiles',
};

// Split a title around its highlight phrase → [before, phrase, after]
function splitTitle(id, title) {
  const words = title.trim().split(/\s+/);
  const phrase = TITLE_HIGHLIGHT[id] ?? words[words.length - 1];
  const at = title.indexOf(phrase);
  if (at === -1) {
    return [words.slice(0, -1).join(' '), words[words.length - 1], ''];
  }
  return [title.slice(0, at), phrase, title.slice(at + phrase.length)];
}

// "2-in-1" must not wrap at its hyphens — swap in U+2011 non-breaking hyphens
const noBreakHyphens = (text) => text.replace(/-/g, '\u2011');

// Process steps cascade in one after another as the section scrolls into view.
const processTrack = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const processStep = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: rise },
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

// Hook: scroll-reveal props for a section, gated on the reduced-motion pref.
function useReveal() {
  const reduce = useReducedMotion();
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { ...rise, delay: 0.05 },
  };
}

// ---------- Overview: Shiran's authored project narrative ----------
// `entries` comes from getContentForProject — usually one, but a site project
// can combine several deck entries (Garden of Adventures = rattle + packaging),
// in which case each entry's title leads its own block.
function ProjectOverview({ entries }) {
  const reveal = useReveal();
  const multi = entries.length > 1;
  return (
    <motion.section className="pd-overview" aria-label="Overview" {...reveal}>
      <div className="pd-overview__body">
        {entries.map((entry, e) => (
          <div key={entry.id} className="pd-overview__entry">
            {multi && (
              <h3 className="pd-overview__entry-title">{entry.title}</h3>
            )}
            {entry.overview.map((paragraph, i) => (
              <p
                key={i}
                className={`pd-overview__para${
                  e === 0 && i === 0 ? ' pd-overview__para--lead' : ''
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </motion.section>
  );
}

// ---------- Process: numbered steps laid out horizontally ----------
function ProjectTimeline({ steps }) {
  const reduce = useReducedMotion();
  return (
    <section className="pd-process" aria-labelledby="pd-process-title">
      <h2 id="pd-process-title" className="pd-heading">
        How it <span className="hl">took shape</span>
      </h2>
      <motion.ol
        className="pd-process__track"
        variants={reduce ? undefined : processTrack}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, margin: '-80px' }}
      >
        {steps.map((step) => (
          <motion.li
            key={step.n}
            className="pd-process__step"
            variants={reduce ? undefined : processStep}
          >
            <span className="pd-process__num">{step.n}</span>
            <h3 className="pd-process__step-title">{step.title}</h3>
            <p className="pd-process__step-text">{step.text}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

// ---------- Sketches: full-width image(s), click to open in the lightbox ----------
function ProjectSketches({ sketches, onOpen }) {
  const reveal = useReveal();
  // Track each real image's position in the (placeholder-free) lightbox set.
  let lightboxIndex = -1;

  return (
    <motion.section
      className="pd-sketches"
      aria-labelledby="pd-sketches-title"
      {...reveal}
    >
      <h2 id="pd-sketches-title" className="pd-heading">
        From the <span className="hl">sketchbook</span>
      </h2>
      <div className="pd-sketches__grid">
        {sketches.map((sketch, i) => {
          const interactive = Boolean(sketch.src && onOpen);
          if (sketch.src) lightboxIndex += 1;
          const at = lightboxIndex;

          const media = sketch.src ? (
            <img
              className="pd-sketches__image"
              src={sketch.src}
              alt={sketch.alt}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="pd-sketches__placeholder" aria-hidden="true">
              <span>Sketch</span>
            </div>
          );

          return (
            <figure key={sketch.assetPath ?? i} className="pd-sketches__item">
              {interactive ? (
                <button
                  type="button"
                  className="pd-sketches__frame pd-sketches__frame--button"
                  onClick={() => onOpen(at)}
                  aria-label={`Open sketch: ${sketch.alt}`}
                >
                  <span className="pd-sketches__media">
                    {media}
                    <span className="pd-sketches__zoom" aria-hidden="true">
                      <ZoomIn size={20} strokeWidth={2} />
                    </span>
                  </span>
                </button>
              ) : (
                <div className="pd-sketches__frame">
                  <div className="pd-sketches__media">{media}</div>
                </div>
              )}

              {sketch.caption && (
                <figcaption className="pd-sketches__caption">
                  {sketch.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </motion.section>
  );
}

function ProjectDetail() {
  const { projectId } = useParams();
  const reduceMotion = useReducedMotion();
  const project = getProjectById(projectId);
  const caseStudy = getCaseStudy(projectId);
  // Index into the active image set currently open in the lightbox (null = closed)
  const [lightboxIndex, setLightboxIndex] = useState(null);
  // Separate lightbox for the sketch image(s)
  const [sketchIndex, setSketchIndex] = useState(null);
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

  // Reset the collection + lightboxes when navigating to a different project
  useEffect(() => {
    setCollectionIndex(0);
    setLightboxIndex(null);
    setSketchIndex(null);
  }, [projectId]);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const index = projects.findIndex((p) => p.id === project.id);
  const nextProject = projects[(index + 1) % projects.length];

  // Overview replaces the old header summary. Prefer Shiran's authored copy
  // from the portfolio deck; fall back to the project's own summary for any
  // project that has no deck entry yet, so every project still shows an Overview.
  const authoredOverview = getContentForProject(projectId);
  const overviewEntries =
    authoredOverview.length > 0
      ? authoredOverview
      : project.summary
        ? [{ id: project.id, title: project.title, overview: [project.summary] }]
        : [];

  // Multi-collection projects show a switcher; selecting one swaps every
  // displayed image set to that collection. Single-collection projects fall
  // back to the flat image list. A "family" is distinct products that share a
  // style; the default is a colorway set.
  const collections = project.collections ?? [];
  const hasCollections = collections.length > 1;
  const collectionKind = COLLECTION_KIND[project.id];
  const isFamily = collectionKind === 'family';
  const isMixed = collectionKind === 'mixed';
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

  // Real (non-placeholder) sketches, for the sketch lightbox
  const sketchImages = (caseStudy?.sketches ?? []).filter((s) => s.src);

  const [titleBefore, titleHl, titleAfter] = splitTitle(
    project.id,
    project.title
  ).map(noBreakHyphens);

  const selectCollection = (i) => {
    setCollectionIndex(i);
    setLightboxIndex(null);
  };

  const hero = project.heroImage ?? project.images[0];

  return (
    <div className="project-detail ground-tomato">
      {/* ---------- Hero: identity + the product, straight on the tomato page ---------- */}
      <motion.header
        className="pd-hero"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...rise, delay: 0.05 }}
      >
        <div className="container pd-hero__grid">
          <div className="pd-hero__copy">
            <Link to="/projects" className="pd-pill pd-pill--back">
              <ArrowLeft size={20} strokeWidth={2} aria-hidden="true" />
              All projects
            </Link>

            <div className="pd-hero__identity">
              <span className="project-detail__category">
                {project.category}
              </span>
              <h1 className="project-detail__title">
                {titleBefore}
                <span className="hl">{titleHl}</span>
                {titleAfter}
              </h1>
            </div>
          </div>

          {hero && (
            <figure className="pd-hero__media">
              <img
                src={hero.src}
                alt={hero.alt}
                fetchpriority="high"
                decoding="async"
              />
            </figure>
          )}
        </div>
      </motion.header>

      {/* ---------- Story left, reference card right — one cream panel, so
          the long read sits ink on cream rather than on tomato ---------- */}
      <section className="pd-story panel ground-cream" aria-label="About the project">
        <div className="container project-detail__header-grid">
          <div className="project-detail__intro">
            {overviewEntries.length > 0 && (
              <ProjectOverview entries={overviewEntries} />
            )}

            <ul className="project-detail__tags" aria-label="Disciplines">
              {project.tags.map((tag) => (
                <li key={tag} className="project-detail__tag">
                  {tag}
                </li>
              ))}
            </ul>
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

              {caseStudy?.brief?.goals?.length > 0 && (
                <div className="project-detail__meta-item">
                  <dt>Goals</dt>
                  <dd>
                    <ul className="project-detail__roles">
                      {caseStudy.brief.goals.map((goal) => (
                        <li key={goal}>{goal}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
          </aside>
        </div>
      </section>

      <div className="container">
        {/* ---------- Gallery, with the collection switcher right above the
            photos it swaps ---------- */}
        <section className="pd-gallery" aria-label="Product photos">
          {hasCollections && (
            <div
              className="project-detail__collections"
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

          <PhotoGallery
            key={activeCollection ? activeCollection.slug : 'all'}
            images={fanImages}
            max={FAN_COUNT}
            onPhotoTap={setLightboxIndex}
          />
        </section>

        <Lightbox
          images={fanImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />

        {/* ---------- Case study: process · sketches ---------- */}
        {caseStudy?.hasOwnProcess && (
          <ProjectTimeline steps={caseStudy.process} />
        )}
        {caseStudy?.sketches?.length > 0 && (
          <ProjectSketches
            sketches={caseStudy.sketches}
            onOpen={sketchImages.length > 0 ? setSketchIndex : undefined}
          />
        )}

        <Lightbox
          images={sketchImages}
          index={sketchIndex}
          onClose={() => setSketchIndex(null)}
          onNavigate={setSketchIndex}
        />

        {/* ---------- Footer nav ---------- */}
        <nav className="project-detail__nav" aria-label="Project navigation">
          <Link to="/projects" className="pd-pill pd-pill--back">
            <ArrowLeft size={20} strokeWidth={2} aria-hidden="true" />
            All projects
          </Link>

          <div className="project-detail__next">
            <span className="project-detail__next-label" id="pd-next-label">
              Next project
            </span>
            <Link
              to={`/projects/${nextProject.id}`}
              className="pd-pill pd-pill--next"
              aria-describedby="pd-next-label"
            >
              <span className="project-detail__next-title">
                {noBreakHyphens(nextProject.title)}
              </span>
              <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default ProjectDetail;
