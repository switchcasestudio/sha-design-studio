import Marquee from '@/components/ui/Marquee';
import './FactsTicker.css';

// Studio facts pulled from Shiran's portfolio — the numbers that make a brand
// trust the playfulness. Rendered as one looping display-face band.
const FACTS = [
  '10+ products on shelves',
  '6+ years designing for babies',
  'sketch → prototype → production',
];

// Flower separators cycle through the accent tints against the ink band.
const SEPARATOR_TINTS = ['ticker-sep--yellow', 'ticker-sep--blue', 'ticker-sep--soft'];

/**
 * Ink marquee band of studio facts between the work grid and the journey —
 * the loud "why trust us" beat of the homepage. Reuses the seamless Marquee
 * (its duplicate group is aria-hidden, so the set reads once).
 */
function FactsTicker() {
  return (
    <div className="facts-ticker" aria-label="Studio facts">
      <Marquee speed={26} gap="var(--space-10)">
        {FACTS.map((fact, i) => (
          <span className="facts-ticker__item" key={fact}>
            <span className="facts-ticker__fact">{fact}</span>
            <span
              className={`facts-ticker__sep ${SEPARATOR_TINTS[i % SEPARATOR_TINTS.length]}`}
              aria-hidden="true"
            >
              ✿
            </span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export default FactsTicker;
