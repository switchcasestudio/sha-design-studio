import { Marquee } from '@/components/ui/Marquee';
import { ProgressiveBlur } from '@/components/ui/ProgressiveBlur';
import desheoz from '@/assets/images/social-proof/desheoz.png';
import doona from '@/assets/images/social-proof/doona.png';
import hape from '@/assets/images/social-proof/hape.png';
import tinyLove from '@/assets/images/social-proof/tiny_love.png';
import tomTikkunOlam from '@/assets/images/social-proof/tom_tikkun_olam.png';
import winfun from '@/assets/images/social-proof/winfun.png';
import './SocialProof.css';

// Brands Shiran has designed for / worked with. Logos are pre-recolored to the
// brand orange on transparent backgrounds, so they sit on the cream canvas.
const logos = [
  { id: 'tiny-love', name: 'Tiny Love', src: tinyLove },
  { id: 'hape', name: 'Hape', src: hape },
  { id: 'doona', name: 'Doona', src: doona },
  { id: 'winfun', name: 'Winfun', src: winfun },
  { id: 'desheoz', name: 'Desheoz', src: desheoz },
  { id: 'tom', name: 'TOM — Tikkun Olam Makers', src: tomTikkunOlam },
];

// Repeat the set so one marquee "group" overflows even wide viewports — that's
// what keeps the right-to-left loop seamless (no empty gap at the edges).
const reel = [...logos, ...logos, ...logos];

/**
 * Social-proof logo marquee for the homepage. A slow, seamless right-to-left
 * strip of partner/client logos on the cream canvas, with soft progressive-blur
 * edges.
 */
export function SocialProof({ label = 'Brands I’ve worked with' }) {
  return (
    <section className="social-proof" aria-label={label}>
      <div className="container">
        <p className="social-proof__label">{label}</p>
      </div>

      <div className="social-proof__viewport">
        {/* Wider gap than the old strip used: the logos are much smaller now,
            so a tight gap fit two-plus full cycles on screen at once and the
            same mark read as repeating. */}
        <Marquee speed={45} gap="clamp(var(--space-16), 9vw, var(--space-32))">
          {reel.map((logo, i) => (
            <img
              key={`${logo.id}-${i}`}
              className="social-proof__logo"
              src={logo.src}
              alt={logo.name}
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          ))}
        </Marquee>

        <ProgressiveBlur
          className="social-proof__fade social-proof__fade--left"
          direction="left"
          blurIntensity={1}
        />
        <ProgressiveBlur
          className="social-proof__fade social-proof__fade--right"
          direction="right"
          blurIntensity={1}
        />
      </div>
    </section>
  );
}

export default SocialProof;
