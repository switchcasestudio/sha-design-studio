import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import Button from '@/components/ui/Button';
import BrandShape from '@/components/ui/BrandShape';
import { reducedReveal, slideUp } from '@/lib/motion';
import './CtaBand.css';

// The site's closing beat — a full-bleed orange band with rounded shoulders,
// wobbling brand motifs and one big display line + button. Extracted from the
// homepage finale so Home, Services and About all close on the same note.
// Copy is passed in so each page can speak for itself; the look is shared.
function CtaBand({ title, text, buttonLabel, to = '/inquire' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      className="cta-band"
      variants={reduce ? reducedReveal : slideUp}
      initial={reduce ? 'show' : 'hidden'}
      animate={inView ? 'show' : undefined}
    >
      <div className="cta-band__panel">
        <BrandShape shape="daisy" className="cta-band__motif cta-band__motif--daisy" />
        <BrandShape shape="clover" className="cta-band__motif cta-band__motif--clover" />
        <BrandShape shape="flower2" className="cta-band__motif cta-band__motif--flower" />

        <div className="container cta-band__inner">
          <h2 className="cta-band__title">{title}</h2>
          <p className="cta-band__text">{text}</p>
          <Button as={Link} to={to} variant="primary" size="lg">
            {buttonLabel}
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

export default CtaBand;
