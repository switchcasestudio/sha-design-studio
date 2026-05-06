import Badge from '@/components/ui/Badge';
import './Projects.css';

const projects = [
  {
    year: '2023',
    title: 'Activity center',
    badge: { label: 'Activity center', shape: 'cloud', color: 'blue' },
    description:
      'It all begins with an idea. Maybe you want to launch a business. Maybe you want to turn a hobby into something more. Whatever it is, the way you tell your story online can make all the difference.',
    images: 2,
  },
  {
    year: '2022',
    title: 'Gymini',
    badge: { label: 'Gymini', shape: 'flower', color: 'yellow' },
    description:
      'It all begins with an idea. Maybe you want to launch a business. Maybe you want to turn a hobby into something more. Whatever it is, the way you tell your story online can make all the difference.',
    images: 2,
  },
  {
    year: '2022',
    title: 'Wooden toys collection',
    badge: null,
    description:
      'It all begins with an idea. Maybe you want to launch a business. Maybe you want to turn a hobby into something more. Whatever it is, the way you tell your story online can make all the difference.',
    images: 1,
    background: 'light',
  },
];

function Projects() {
  return (
    <div className="projects-page">
      <section className="projects-page__hero">
        <div className="container projects-page__hero-inner">
          <h1 className="projects-page__title">Portfolio</h1>
          <p className="projects-page__intro">
            The following are just a few examples of my creative vision and
            craftsmanship, where every space tells a unique story through design.
          </p>
        </div>
      </section>

      <div className="container projects-page__list">
        {projects.map((project, idx) => (
          <article key={idx} className="project-entry">
            <div
              className={`project-entry__media project-entry__media--${
                project.background || 'orange'
              }`}
            >
              <div className="project-entry__images">
                {Array.from({ length: project.images }).map((_, i) => (
                  <div key={i} className="project-entry__image-placeholder">
                    <span>Image placeholder</span>
                  </div>
                ))}
                {project.badge && (
                  <div
                    className={`project-entry__badge project-entry__badge--${
                      project.images > 1 ? 'right' : 'left'
                    }`}
                  >
                    <Badge {...project.badge}>{project.badge.label}</Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="project-entry__caption">
              <span className="project-entry__year">{project.year}</span>
              <p className="project-entry__description">{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Projects;
