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
  // Index into project.images currently open in the lightbox (null = closed)
  const [lightboxIndex, setLightboxIndex] = useState(null);

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
  const FAN_COUNT = 5;
  const gallery = project.images.slice(FAN_COUNT);

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

        {/* ---------- Fanned photo stack ---------- */}
        <PhotoGallery
          images={project.images}
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
          images={project.images}
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
