import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { siteConfig, footerNavigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import './Footer.css';

// Reach-out channels, rendered as round icon pills in the footer's fourth
// column. Instagram + LinkedIn URLs are placeholders (see siteConfig).
const SOCIAL_LINKS = [
  { id: 'instagram', label: 'Instagram', href: siteConfig.social.instagram, Icon: Instagram },
  { id: 'linkedin', label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: Linkedin },
  { id: 'email', label: `Email ${siteConfig.designer}`, href: `mailto:${siteConfig.email}`, Icon: Mail },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Contact moved to its own /inquire route — footer is brand + nav + bio + social */}
      <div className="footer__bar panel ground-night">
        <div className="container">
          <motion.div
            className="footer__cols"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="footer__brand">
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
            </div>

            <nav className="footer__col" aria-label="Footer">
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
            </nav>

            <div className="footer__col">
              <h4 className="footer__eyebrow">Who I am</h4>
              <p className="footer__who-name">Shiran Bar Hayon</p>
              <p className="footer__who">
                industrial and product designer.
                <br />
                creating playful, thoughtful products.
                <br />
                available for new projects.
              </p>
            </div>

            <ul className="footer__social">
              {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
                <li key={id}>
                  <a
                    className="footer__social-link"
                    href={href}
                    aria-label={label}
                    {...(href.startsWith('mailto:')
                      ? {}
                      : { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
