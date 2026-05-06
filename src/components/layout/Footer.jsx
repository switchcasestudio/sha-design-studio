import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { siteConfig, footerNavigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import ContactForm from '@/components/sections/ContactForm';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      {/* Orange contact panel */}
      <div className="footer__panel">
        <div className="container">
          <div className="footer__brand">
            <Logo size={120} variant="cream" />
            <p className="footer__tagline">{siteConfig.tagline}</p>
          </div>

          <div className="footer__grid">
            <div className="footer__col">
              <h4 className="footer__heading">Menu</h4>
              <ul className="footer__list">
                {footerNavigation.menu.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="footer__link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Social</h4>
              <ul className="footer__list">
                {footerNavigation.social.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="footer__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__col footer__col--form">
              <h4 className="footer__heading">Let's stay connected</h4>
              <p className="footer__sub">
                Reach out about a project, collaboration or just to say hello!
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      {/* Cream bottom bar */}
      <div className="footer__bar">
        <div className="container footer__bar-inner">
          <span className="footer__site">{siteConfig.name}</span>
          <div className="footer__icons">
            <a
              href={siteConfig.social.instagram}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={20} />
            </a>
            <a
              href={siteConfig.social.facebook}
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={20} />
            </a>
            <a
              href={siteConfig.social.twitter}
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={20} />
            </a>
          </div>
          <a href={`mailto:${siteConfig.email}`} className="footer__email">
            {siteConfig.email}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
