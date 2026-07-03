import Marquee from '@/components/ui/Marquee';
import './FactsTicker.css';

// Studio facts pulled from Shiran's portfolio — the numbers that make a brand
// trust the playfulness, all on one looping display-face band. (This band IS
// the numbers beat; the old "By the numbers" panel folded into it.)
const FACTS = [
  '10+ products on shelves',
  '6+ years designing for babies',
  '5 brands worldwide',
  '∞ giggles tested',
  'sketch → prototype → production',
];

// Flower separators cycle through warm tints against the blue band — no
// blue flowers here, so nothing disappears blue-on-blue.
const SEPARATOR_TINTS = ['ticker-sep--yellow', 'ticker-sep--coral', 'ticker-sep--soft'];

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
