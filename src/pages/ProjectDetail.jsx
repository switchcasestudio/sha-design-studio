import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects, getProjectById } from '@/data';
import { siteConfig } from '@/utils/siteConfig';
import PhotoGallery from '@/components/ui/PhotoGallery';
import Lightbox from '@/components/ui/Lightbox';
import './ProjectDetail.css';

const spring = { type: 'spring', stiffness: 200, damping: 22 };

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

  // Product titles often repeat the project title ("Boho Chic 5-in-1 Here I
  // Grow…") — show just the distinct part to keep the sidebar scannable.
  const productLabel = (title) => {
    const stripped = title.replace(project.title, '').replace(/\s+/g, ' ').trim();
    return stripped || title;
  };

  // Multi-collection projects (e.g. the activity center's 5 color worlds) show
  // a switcher; selecting one swaps every displayed image set to that
  // collection. Single-collection projects fall back to the flat image list.
  const collections = project.collections ?? [];
  const hasCollections = collections.length > 1;
  const activeCollection = hasCollections
    ? collections[Math.min(collectionIndex, collections.length - 1)]
    : null;
  const activeImages = activeCollection ? activeCollection.images : project.images;

  const FAN_COUNT = 5;
  const gallery = activeImages.slice(FAN_COUNT);

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

              <ul className="project-detail__tags">
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

                {project.products?.length > 0 && (
                  <div className="project-detail__meta-item">
                    <dt>Products</dt>
                    <dd>
                      <ul className="project-detail__products">
                        {project.products.map((product) => (
                          <li key={product.slug}>
                            <a
                              href={product.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={product.title}
                            >
                              {productLabel(product.title)} ↗
                            </a>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </aside>
          </div>
        </motion.header>

        {/* ---------- Collection (color world) switcher ---------- */}
        {hasCollections && (
          <div
            className="project-detail__collections"
            role="group"
            aria-label="Choose a collection"
          >
            <span className="project-detail__collections-label">Collections</span>
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
                      {productLabel(collection.title)}
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
          images={activeImages}
          max={FAN_COUNT}
          onPhotoTap={setLightboxIndex}
        />

        {/* ---------- Gallery ---------- */}
        <div className="project-detail__gallery">
          {gallery.map((image, i) => (
            <motion.figure
              key={image.src}
              className="project-detail__gallery-item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ ...spring, delay: (i % 3) * 0.06 }}
            >
              <button
                type="button"
                className="project-detail__gallery-button"
                aria-label={`View image: ${image.alt}`}
                onClick={() => setLightboxIndex(FAN_COUNT + i)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </motion.figure>
          ))}
        </div>

        <Lightbox
          images={activeImages}
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
