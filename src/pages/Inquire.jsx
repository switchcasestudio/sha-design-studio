import { motion, useReducedMotion } from 'motion/react';
import { Mail } from 'lucide-react';
import { siteConfig } from '@/utils/siteConfig';
import { rise } from '@/lib/motion';
import ContactForm from '@/components/sections/ContactForm';
import BrandShape from '@/components/ui/BrandShape';
import Button from '@/components/ui/Button';
import './Inquire.css';

// Still motifs on the cream canvas — behind the form card, aria-hidden, kept
// clear of the pointer's path to the fields. One flat fill each, full
// strength; yolk, pool and tomato all read on cream. Positioned by CSS class.
const CANVAS_MOTIFS = [
  { shape: 'daisy', className: 'inquire-page__motif--daisy' },
  { shape: 'star', className: 'inquire-page__motif--star' },
  { shape: 'clover', className: 'inquire-page__motif--clover' },
];

// Placeholder copy — confirm Shiran's voice before launch. Reassurance steps
// fill the otherwise-empty left column on desktop.
const NEXT_STEPS = [
  { shape: 'heart', tint: 'inquire-page__step-shape--tomato', text: 'I read every note myself.' },
  { shape: 'clover', tint: 'inquire-page__step-shape--pool', text: 'We hop on a quick call to talk it through.' },
  { shape: 'star', tint: 'inquire-page__step-shape--yolk', text: 'The first sketches begin.' },
];

// Dedicated contact route — cream ground: tomato headline words, one pool
// block. The form sits on a paper card with oat fields.
function Inquire() {
  const reduce = useReducedMotion();
  const riseIn = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { ...rise, delay },
  });

  return (
    <div className="inquire-page ground-cream">
      {/* Canvas motifs — sit behind everything, still, never under the form
          card or the reach to the fields. */}
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
          <motion.div className="inquire-page__intro" {...riseIn(0.1)}>
            <h1 className="inquire-page__title">
              Let&apos;s make <span className="hl">something</span> together
            </h1>

            <p className="inquire-page__lead">
              <span className="inquire-page__lead-key">
                Reach out about a project or a collaboration,
              </span>{' '}
              or just to say hello.
            </p>

            <div className="inquire-page__contact">
              <Button
                as="a"
                href={`mailto:${siteConfig.email}`}
                variant="outline"
                size="md"
                className="inquire-page__email"
              >
                <Mail size={20} strokeWidth={2} aria-hidden="true" />
                <span className="sr-only">Email: </span>
                {siteConfig.email}
              </Button>
              <p className="inquire-page__reply">
                I usually reply within a day or two.
              </p>
            </div>

            {/* What happens next — reassurance, shape-bulleted. */}
            <div className="inquire-page__next">
              <p className="t-label inquire-page__next-label">What happens next</p>
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
            </div>
          </motion.div>

          <motion.div
            className="inquire-page__form ground-paper"
            {...riseIn(0.2)}
          >
            {/* Yolk flower peeking off the card's top-right corner — echoes the
                About "Hello" flower so the two pages rhyme. */}
            <BrandShape shape="flower2" className="inquire-page__form-flower" />
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Inquire;
