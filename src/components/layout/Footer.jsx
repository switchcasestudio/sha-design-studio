import { useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { siteConfig, footerNavigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import BrandShape from '@/components/ui/BrandShape';
import { useTheme } from '@/theme/ThemeContext';
import { spring } from '@/theme/vivid/motion';
import './Footer.css';

// Reach-out channels, rendered as round icon pills in the footer's fourth
// column. Instagram + LinkedIn URLs are placeholders (see siteConfig).
const SOCIAL_LINKS = [
  { id: 'instagram', label: 'Instagram', href: siteConfig.social.instagram, Icon: Instagram },
  { id: 'linkedin', label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: Linkedin },
  { id: 'email', label: `Email ${siteConfig.designer}`, href: `mailto:${siteConfig.email}`, Icon: Mail },
];

// Vivid: a giant looping marquee above the columns. It drifts on its own,
// speeds up and flips direction with scroll velocity, and the whole band is a
// link to the Inquire page.
const MARQUEE = [
  { text: "Let's make something", shape: 'star', tint: 'var(--yolk)' },
  { text: 'thoughtful', shape: 'heart', tint: 'var(--tomato)' },
  { text: 'and playful', shape: 'clover', tint: 'var(--pool)' },
];

function wrap(min, max, v) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

function FooterMarquee() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-2000, 0, 2000], [-5, 0, 5], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    let move = direction.current * -2.2 * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * -Math.abs(f) * (delta / 1000);
    baseX.set(baseX.get() + move);
  });

  const row = (copy) => (
    <span className="footer-marquee__row" aria-hidden={copy ? 'true' : undefined}>
      {MARQUEE.map(({ text, shape, tint }) => (
        <span key={text} className="footer-marquee__item">
          <span className="footer-marquee__text">{text}</span>
          <motion.span
            className="footer-marquee__shape"
            style={{ color: tint }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <BrandShape shape={shape} />
          </motion.span>
        </span>
      ))}
    </span>
  );

  return (
    <Link
      to="/inquire"
      className="footer-marquee"
      data-cursor="Say hi"
      aria-label="Let's make something thoughtful and playful — start an inquiry"
    >
      <motion.span className="footer-marquee__track" style={{ x }}>
        {row(false)}
        {row(true)}
      </motion.span>
    </Link>
  );
}

const colsStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const colItem = {
  hidden: { opacity: 0, y: 50, rotate: 2 },
  show: { opacity: 1, y: 0, rotate: 0, transition: spring.soft },
};

function Footer() {
  const year = new Date().getFullYear();
  const { isVivid } = useTheme();
  // Vivid staggers each column in; regular keeps the single block rise.
  const col = isVivid ? { variants: colItem } : {};
  const Col = isVivid ? motion.div : 'div';
  const ColNav = isVivid ? motion.nav : 'nav';
  const ColUl = isVivid ? motion.ul : 'ul';

  return (
    <footer className="footer">
      {/* Contact moved to its own /inquire route — footer is brand + nav + bio + social */}
      <div className="footer__bar panel ground-night">
        {isVivid && <FooterMarquee />}
        <div className="container">
          <motion.div
            className="footer__cols"
            {...(isVivid
              ? {
                  initial: 'hidden',
                  whileInView: 'show',
                  viewport: { once: true, amount: 0.3 },
                  variants: colsStagger,
                }
              : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                })}
          >
            <Col className="footer__brand" {...col}>
              <Logo
                kind="horizontal"
                ground="night"
                size={200}
                className="footer__logo"
              />

              <div className="footer__legal">
                <p>
                  © {year} · {siteConfig.name.toLowerCase()}
                  <br />
                  developed by{' '}
                  <a
                    href="https://www.switchcasestudio.com"
                    className="footer__legal-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    switch case studio
                  </a>
                </p>
              </div>
            </Col>

            <ColNav className="footer__col" aria-label="Footer" {...col}>
              <h4 className="footer__eyebrow">Navigation</h4>
              <ul className="footer__list">
                {footerNavigation.menu.map((item) => (
                  <li key={item.href}>
                    {/* Hash links stay native so the browser handles the smooth in-page scroll */}
                    {item.href.startsWith('#') ? (
                      <a href={item.href} className="footer__link">
                        {item.label.toLowerCase()}
                      </a>
                    ) : (
                      // NavLink adds `active` on the current route for the
                      // highlighted footer state
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `footer__link${isActive ? ' footer__link--active' : ''}`
                        }
                      >
                        {item.label.toLowerCase()}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </ColNav>

            <Col className="footer__col" {...col}>
              <h4 className="footer__eyebrow">Who I am</h4>
              <p className="footer__who-name">Shiran Bar Hayon</p>
              <p className="footer__who">
                industrial and product designer.
                <br />
                creating playful, thoughtful products.
                <br />
                available for new projects.
              </p>
            </Col>

            <ColUl className="footer__social" {...col}>
              {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
                <li key={id}>
                  <motion.a
                    className="footer__social-link"
                    whileHover={isVivid ? { scale: 1.18, rotate: -12 } : undefined}
                    whileTap={isVivid ? { scale: 0.9 } : undefined}
                    transition={spring.bouncy}
                    href={href}
                    aria-label={label}
                    {...(href.startsWith('mailto:')
                      ? {}
                      : { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                  </motion.a>
                </li>
              ))}
            </ColUl>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
