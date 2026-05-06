import { Link } from 'react-router-dom';
import Logo from '@/components/ui/Logo';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { siteConfig } from '@/utils/siteConfig';
import './Home.css';


// Placeholder project data — swap image paths once assets are added
const featuredProjects = [
  {
    id: 'shape-sorter',
    title: 'Shape Sorter — Tiny Rocker collection',
    badge: { label: 'Sorter', shape: 'cloud', color: 'blue' },
    image: null, // TODO: '/src/assets/images/projects/shape-sorter.jpg'
    studio: 'Tiny Love',
    size: 'large',
  },
  {
    id: 'rattle-toy',
    title: 'Take Along Rattle Toy — Garden Of Adventure',
    badge: { label: 'Way cool!', shape: 'flower', color: 'orange' },
    image: null,
    studio: 'Tiny Love',
    size: 'medium',
  },
  {
    id: 'retro-living-room',
    title: 'Retro minimal living room remodel',
    badge: null,
    image: null,
    studio: 'Tiny Love',
    size: 'medium',
  },
  {
    id: 'play-gym',
    title: 'Retro minimal living room remodel',
    badge: null,
    image: null,
    studio: 'Tiny Love',
    size: 'medium',
  },
  {
    id: 'bohemian-studio',
    title: 'Minimal Bohemian Brooklyn studio',
    badge: null,
    image: null,
    studio: 'Tiny Love',
    size: 'medium',
  },
];

function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="home-hero">
        <div className="container home-hero__inner">
          <Logo size={180} />
          <h1 className="home-hero__title">{siteConfig.tagline}</h1>
        </div>
      </section>

      {/* ---------- Featured projects grid ---------- */}
      <section className="home-projects">
        <div className="container">
          <div className="home-projects__grid">
            {/* Featured / large project */}
            <article className="project-card project-card--feature">
              <div className="project-card__media project-card__media--placeholder">
                <span className="project-card__placeholder">
                  Project image placeholder
                </span>
                {featuredProjects[0].badge && (
                  <div className="project-card__badge project-card__badge--top-right">
                    <Badge {...featuredProjects[0].badge}>
                      {featuredProjects[0].badge.label}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="project-card__caption">
                <span className="project-card__studio">{featuredProjects[0].studio}</span>
                <h3 className="project-card__title">{featuredProjects[0].title}</h3>
              </div>
            </article>

            {/* Secondary projects */}
            {featuredProjects.slice(1).map((project) => (
              <article key={project.id} className="project-card">
                <div className="project-card__media project-card__media--placeholder">
                  <span className="project-card__placeholder">Image placeholder</span>
                  {project.badge && (
                    <div className="project-card__badge project-card__badge--top-left">
                      <Badge {...project.badge}>{project.badge.label}</Badge>
                    </div>
                  )}
                </div>
                <div className="project-card__caption">
                  <span className="project-card__studio">{project.studio}</span>
                  <h3 className="project-card__title">{project.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- "What I Do" CTA ---------- */}
      <section className="home-what">
        <div className="container">
          <div className="home-what__panel">
            <div className="home-what__copy">
              <h2 className="home-what__title">What I Do</h2>
              <p className="home-what__text">
                I create simple, smart, and playful designs that spark curiosity,
                support early development, and bring joy to little ones.
              </p>
              <Button as={Link} to="/services" variant="outline" size="md">
                Explore My Services
              </Button>
            </div>
            <div className="home-what__media home-what__media--placeholder">
              <span>Designer at work — image placeholder</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Kind Words / Testimonials ---------- */}
      <section className="home-words">
        <div className="container">
          <div className="home-words__panel">
            <h2 className="home-words__title">Kind Words</h2>
            <blockquote className="home-words__quote">
              <p>
                "Channing made an extra effort to add elements that were
                personal to us. She made sure our space reflected us as
                individuals and as a family."
              </p>
              <cite className="home-words__cite">— Jaya Dixon</cite>
            </blockquote>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
