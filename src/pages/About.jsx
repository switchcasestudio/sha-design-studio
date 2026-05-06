import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import './About.css';

const offers = [
  {
    title: 'Virtual Design Guidance Sessions',
    description:
      'One-on-one sessions to talk through your project, get feedback on concepts, and plan next steps — all from anywhere in the world.',
  },
  {
    title: 'Room Revival and Refinement',
    description:
      'A targeted refresh for a single room — color, layout, and key product recommendations to bring the space to life.',
  },
  {
    title: 'Complete Home Transformation',
    description:
      'A full-scope design partnership covering every room, every detail, end to end.',
  },
];

function About() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="about-page">
      {/* ---------- Bio section ---------- */}
      <section className="about-bio">
        <div className="container about-bio__inner">
          <div className="about-bio__copy">
            <h1 className="about-bio__title">About Me</h1>
            <div className="about-bio__text">
              <p>
                Hi there — I'm Shiran Bar, an industrial designer specializing
                in toys and baby products.
              </p>
              <p>
                I graduated from Shenkar College of Design, interned at HAPE in
                China, and worked at Tiny Love designing a wide range of baby
                products — from soft toys to electronic developmental items.
              </p>
              <p>
                I'm inspired by the beautiful simplicity of babies: their
                curiosity, instinct to play, and unfiltered reactions. This
                drives me to create designs that are both intuitive and
                emotionally engaging.
              </p>
              <p>
                My process is guided by sensitivity, precision, and a love for
                surprising details — the small things that turn a good product
                into an exceptional one.
              </p>
              <p>
                I create toys that inspire, empower, and spark joy. Skilled in
                concept development and hands-on product design, I'm open to
                freelance projects, creative collaborations, and contracting
                opportunities.
              </p>
              <p className="about-bio__signoff">
                Simple, smart, and full of wonder.
              </p>
            </div>

            <Button variant="yellow" size="md" className="about-bio__cta">
              Let's Chat
            </Button>
          </div>

          <div className="about-bio__photo">
            <div className="about-bio__photo-frame">
              <div className="about-bio__photo-placeholder">
                <span>Designer portrait placeholder</span>
              </div>
              <div className="about-bio__hello">
                <Badge shape="flower" color="yellow">Hello!</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Photo gallery ---------- */}
      <section className="about-gallery">
        <div className="container">
          <div className="about-gallery__grid">
            <div className="about-gallery__item about-gallery__item--small">
              <div className="about-gallery__placeholder">
                <span>Image 1</span>
              </div>
            </div>
            <div className="about-gallery__item about-gallery__item--large">
              <div className="about-gallery__placeholder">
                <span>Image 2</span>
              </div>
            </div>
            <div className="about-gallery__item about-gallery__item--medium">
              <div className="about-gallery__placeholder">
                <span>Image 3</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- What I Offer ---------- */}
      <section className="about-offer">
        <div className="container">
          <div className="about-offer__panel">
            <div className="about-offer__intro">
              <h2 className="about-offer__title">What I Offer</h2>
              <p className="about-offer__text">
                Whether a single room or a full home makeover, I can offer
                tailored solutions to elevate your living spaces to new levels
                of elegance and comfort. Here are some of the services I offer:
              </p>
              <Button variant="primary" size="md">Explore My Services</Button>
            </div>

            <ul className="about-offer__list">
              {offers.map((offer, idx) => (
                <li key={idx} className="about-offer__item">
                  <button
                    className="about-offer__row"
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    aria-expanded={openIdx === idx}
                  >
                    <span>{offer.title}</span>
                    {openIdx === idx ? <Minus size={20} /> : <Plus size={20} />}
                  </button>
                  {openIdx === idx && (
                    <p className="about-offer__detail">{offer.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
