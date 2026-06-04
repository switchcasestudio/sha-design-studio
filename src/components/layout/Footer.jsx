import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { siteConfig, footerNavigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import ContactForm from '@/components/sections/ContactForm';
import './Footer.css';

const spring = { type: 'spring', stiffness: 200, damping: 22 };

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Orange contact panel — #contact anchor target for "Inquire Now" CTAs */}
      <div className="footer__panel" id="contact">
        <div className="container footer__grid">
          {/* Contact intro + details */}
          <motion.div
            className="footer__intro"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ ...spring }}
          >
            <div>
              <h4 className="footer__heading">Let's stay connected</h4>
              <p className="footer__sub">
                Reach out about a project, collaboration or just to say hello!
              </p>
            </div>
            <ul className="footer__details">
              <li>
                <span className="footer__details-label">Email: </span>
                <a href={`mailto:${siteConfig.email}`} className="footer__details-link">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact form card */}
          <motion.div
            className="footer__form"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: 0.15 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>

      {/* Cream footer: brand, navigation, tagline, legal */}
      <div className="footer__bar">
        <div className="container">
          <motion.div
            className="footer__cols"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="footer__ident">
              <Logo size={72} variant="orange" />
              <p className="footer__wordmark">
                Sha
                <br />
                Design
                <br />
                Studio
              </p>
            </div>

            <nav className="footer__col" aria-label="Footer">
              <h4 className="footer__eyebrow">Navigation</h4>
              <ul className="footer__list">
                {footerNavigation.menu.map((item) => (
                  <li key={item.href}>
                    {/* Hash links stay native so the browser handles the smooth in-page scroll */}
                    {item.href.startsWith('#') ? (
                      <a href={item.href} className="footer__link">
                        {item.label}
                      </a>
                    ) : (
                      <Link to={item.href} className="footer__link">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer__col">
              <h4 className="footer__eyebrow">Who I Am</h4>
              <p className="footer__who">
                Designing playful,
                <br />
                thoughtful products
              </p>
            </div>
          </motion.div>

          <div className="footer__legal">
            <p>
              © {year} • {siteConfig.name} • Developed by{' '}
              <a
                href="https://www.switchcasestudio.com"
                className="footer__legal-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Switch Case Studio
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
