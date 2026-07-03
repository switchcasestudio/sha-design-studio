import { motion, useReducedMotion } from 'motion/react';
import { siteConfig } from '@/utils/siteConfig';
import ContactForm from '@/components/sections/ContactForm';
import BrandShape from '@/components/ui/BrandShape';
import './Inquire.css';

const spring = { type: 'spring', stiffness: 200, damping: 22 };

// Motifs drifting on the cream canvas — behind the form card, aria-hidden, kept
// clear of the pointer's path to the fields. Positioned by CSS class.
const CANVAS_MOTIFS = [
  { shape: 'daisy', className: 'inquire-page__motif--daisy' },
  { shape: 'star', className: 'inquire-page__motif--star' },
  { shape: 'clover', className: 'inquire-page__motif--clover' },
];

// Placeholder copy — confirm Shiran's voice before launch. Reassurance steps
// fill the otherwise-empty left column on desktop.
const NEXT_STEPS = [
  { shape: 'heart', tint: 'inquire-page__step-shape--orange', text: 'I read every note myself.' },
  { shape: 'clover', tint: 'inquire-page__step-shape--blue', text: 'We hop on a quick call to talk it through.' },
  { shape: 'star', tint: 'inquire-page__step-shape--yellow', text: 'The first sketches begin.' },
];

// Dedicated contact route. The form (validation, accessible errors, single
// required legend) is the shared <ContactForm> moved here verbatim from the
// footer. Cream page + white form card so all the small form text has clean
// contrast by construction; orange is an accent only (large heading).
function Inquire() {
  const reduce = useReducedMotion();

  return (
    <div className="inquire-page">
      {/* Canvas motifs — sit behind everything, float gently (CSS), never
          under the form card or the reach to the fields. */}
      <div className="inquire-page__canvas" aria-hidden="true">
        {CANVAS_MOTIFS.map((m) => (
          <BrandShape
            key={m.shape}
            shape={m.shape}
            className={`inquire-page__motif ${m.className}`}
          />
        ))}
      </div>

      <section className="inquire-page__hero">
        <div className="container inquire-page__inner">
          <motion.div
            className="inquire-page__intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <h1 className="inquire-page__title">
              Let&apos;s make something together
              {/* Punctuation-flower, popping in after the title settles —
                  same recipe as the About "Hello!" badge. */}
              <motion.span
                className="inquire-page__title-flower"
                aria-hidden="true"
                initial={reduce ? false : { scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.5 }}
              >
                <BrandShape shape="tulip" />
              </motion.span>
            </h1>
            <p className="inquire-page__lead">
              Reach out about a project, a collaboration — or just to say hello!
            </p>
            <p className="inquire-page__reply">
              I usually reply within a day or two.
            </p>
            <ul className="inquire-page__details">
              <li>
                <span className="inquire-page__details-label">Email: </span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inquire-page__details-link"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>

            {/* What happens next — reassurance, shape-bulleted. */}
            <ul className="inquire-page__steps">
              {NEXT_STEPS.map((step) => (
                <li key={step.text} className="inquire-page__step">
                  <BrandShape
                    shape={step.shape}
                    className={`inquire-page__step-shape ${step.tint}`}
                  />
                  <span>{step.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="inquire-page__form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.25 }}
          >
            {/* Flower peeking behind the card's top-right corner — echoes the
                About "Hello!" flower so the two pages rhyme. */}
            <BrandShape
              shape="flower2"
              className="inquire-page__form-flower"
            />
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Inquire;
