import desheoz from '@/assets/images/social-proof/desheoz.png';
import doona from '@/assets/images/social-proof/doona.png';
import hape from '@/assets/images/social-proof/hape.png';
import tinyLove from '@/assets/images/social-proof/tiny_love.png';
import tomTikkunOlam from '@/assets/images/social-proof/tom_tikkun_olam.png';
import winfun from '@/assets/images/social-proof/winfun.png';
import { useTheme } from '@/theme/ThemeContext';
import './SocialProof.css';

// Brands Shiran has designed for / worked with. The PNGs are single-colour on
// transparent; each is used as a CSS mask so it renders in brand ink.
const logos = [
  { id: 'tiny-love', name: 'Tiny Love', src: tinyLove },
  { id: 'hape', name: 'Hape', src: hape },
  { id: 'doona', name: 'Doona', src: doona },
  { id: 'winfun', name: 'Winfun', src: winfun },
  { id: 'desheoz', name: 'Desheoz', src: desheoz },
  { id: 'tom', name: 'TOM — Tikkun Olam Makers', src: tomTikkunOlam },
];

/**
 * Social-proof logo row for the homepage. A still, centred row of partner /
 * client marks in ink on the cream canvas — the brand's motion rule is
 * "quick, then still", so the old looping marquee is retired.
 */
function LogoRow({ hidden = false, className = 'social-proof__row' }) {
  return (
    <ul className={className} aria-hidden={hidden || undefined}>
      {logos.map((logo) => (
        <li key={logo.id} className="social-proof__item">
          <span
            className="social-proof__logo"
            role={hidden ? undefined : 'img'}
            aria-label={hidden ? undefined : logo.name}
            style={{ '--logo': `url(${logo.src})` }}
          />
          <img
            className="social-proof__sizer"
            src={logo.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </li>
      ))}
    </ul>
  );
}

export function SocialProof({ label = 'Brands I’ve worked with' }) {
  const { isVivid } = useTheme();

  // Vivid: the row becomes an endless marquee (two copies, one hidden from
  // screen readers) that pauses under the pointer.
  if (isVivid) {
    return (
      <section className="social-proof social-proof--vivid" aria-label={label}>
        <p className="social-proof__label">{label}</p>
        <div className="social-proof__marquee">
          <div className="social-proof__track">
            <LogoRow className="social-proof__run" />
            <LogoRow className="social-proof__run" hidden />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="social-proof" aria-label={label}>
      <div className="container">
        <p className="social-proof__label">{label}</p>

        <ul className="social-proof__row">
          {logos.map((logo) => (
            <li key={logo.id} className="social-proof__item">
              <span
                className="social-proof__logo"
                role="img"
                aria-label={logo.name}
                style={{ '--logo': `url(${logo.src})` }}
              />
              {/* Hidden <img> gives the mask its intrinsic aspect ratio */}
              <img
                className="social-proof__sizer"
                src={logo.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default SocialProof;
