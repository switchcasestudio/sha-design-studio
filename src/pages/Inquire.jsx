import { motion } from 'motion/react';
import { siteConfig } from '@/utils/siteConfig';
import ContactForm from '@/components/sections/ContactForm';
import './Inquire.css';

const spring = { type: 'spring', stiffness: 200, damping: 22 };

// Dedicated contact route. The form (validation, accessible errors, single
// required legend) is the shared <ContactForm> moved here verbatim from the
// footer. Cream page + white form card so all the small form text has clean
// contrast by construction; orange is an accent only (large heading).
function Inquire() {
  return (
    <div className="inquire-page">
      <section className="inquire-page__hero">
        <div className="container inquire-page__inner">
          <motion.div
            className="inquire-page__intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <h1 className="inquire-page__title">Let&apos;s stay connected</h1>
            <p className="inquire-page__lead">
              Reach out about a project, collaboration or just to say hello!
            </p>
            <ul className="inquire-page__details">
              <li>
                <span className="inquire-page__details-label">Email: </span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inquire-page__details-link"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="inquire-page__form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.25 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Inquire;
