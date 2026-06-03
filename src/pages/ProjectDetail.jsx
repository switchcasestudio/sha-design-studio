import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects, getProjectById } from '@/data';
import { siteConfig } from '@/utils/siteConfig';
import './ProjectDetail.css';

const spring = { type: 'spring', stiffness: 200, damping: 22 };

function ProjectDetail() {
  const { projectId } = useParams();
  const project = getProjectById(projectId);

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
  const [hero, ...gallery] = project.images;

  return (
    <div className="project-detail">
      <div className="container">
        {/* ---------- Header ---------- */}
        <motion.header
          className="project-detail__header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.05 }}
        >
          <Link to="/projects" className="project-detail__back">
            ← All Projects
          </Link>

          <span className="project-detail__category">{project.category}</span>
          <h1 className="project-detail__title">{project.title}</h1>
          <p className="project-detail__summary">{project.summary}</p>

          <dl className="project-detail__meta">
            <div className="project-detail__meta-item">
              <dt>Client</dt>
              <dd>{project.client}</dd>
            </div>

            <div className="project-detail__meta-item">
              <dt>Role</dt>
              <dd>{project.role.join(' · ')}</dd>
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
                        >
                          {product.title} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>

          <ul className="project-detail__tags">
            {project.tags.map((tag) => (
              <li key={tag} className="project-detail__tag">
                {tag}
              </li>
            ))}
          </ul>
        </motion.header>

        {/* ---------- Hero image ---------- */}
        <motion.figure
          className="project-detail__hero"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.15 }}
        >
          <img
            src={hero.src}
            alt={hero.alt}
            width={hero.width ?? undefined}
            height={hero.height ?? undefined}
          />
        </motion.figure>

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
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
              />
            </motion.figure>
          ))}
        </div>

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
