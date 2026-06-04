import { Link } from 'react-router-dom';
// import { Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'motion/react';
import { siteConfig, footerNavigation } from '@/utils/siteConfig';
import Logo from '@/components/ui/Logo';
import ContactForm from '@/components/sections/ContactForm';
import './Footer.css';

const spring = { type: 'spring', stiffness: 200, damping: 22 };

function Footer() {
  return (
    <footer className="footer">
      {/* Orange contact panel */}
      <div className="footer__panel">
        <div className="container footer__grid">
          {/* Brand + menu */}
          <motion.div
            className="footer__brand"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ ...spring }}
          >
            <Logo size={110} variant="cream" />
            <p className="footer__tagline">{siteConfig.tagline}</p>

            <nav aria-label="Footer">
              <ul className="footer__list">
                {footerNavigation.menu.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="footer__link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social links — re-enable when the profiles are live
            <ul className="footer__list footer__list--social">
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
            */}

            {/* Contact intro + details */}
            <div className="footer__contact">
              <h4 className="footer__heading">Let's stay connected</h4>
              <p className="footer__sub">
                Reach out about a project, collaboration or just to say hello!
              </p>
              <ul className="footer__details">
                <li>
                  <span className="footer__details-label">Email: </span>
                  <a href={`mailto:${siteConfig.email}`} className="footer__details-link">
                    {siteConfig.email}
                  </a>
                </li>
              </ul>
            </div>
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

      {/* Cream bottom bar */}
      <div className="footer__bar">
        <div className="container footer__bar-inner">
          <span className="footer__site">{siteConfig.name}</span>

          {/* Social icons — re-enable when the profiles are live
          <div className="footer__icons">
            {[
              { href: siteConfig.social.instagram, label: 'Instagram', Icon: Instagram },
              { href: siteConfig.social.facebook, label: 'Facebook', Icon: Facebook },
              { href: siteConfig.social.twitter, label: 'Twitter', Icon: Twitter },
            ].map(({ href, label, Icon }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
          */}

          <a href={`mailto:${siteConfig.email}`} className="footer__email">
            {siteConfig.email}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
