import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './Services.css';

const services = [
  {
    id: 'full-service',
    title: 'Full-\nservice',
    description:
      'Designed for clients who want a complete interior overhaul or large-scale renovations.',
    cta: true,
    items: ['Service 1', 'Service 2', 'Service 3'],
  },
  {
    id: 'room-redesign',
    title: 'Room\nRedesign',
    description:
      'Full room transformation with a selection of furnishings, decor, and color schemes.',
    cta: true,
    items: ['Service 1', 'Service 2', 'Service 3'],
  },
  {
    id: 'design-session',
    title: 'Design\nSession',
    description:
      'One-hour sessions tailored to your needs, perfect for quick design advice, a second opinion, or help with specific design decisions. Available virtually or in person.',
    price: '₪200.00',
    purchase: true,
  },
];

const spring = { type: 'spring', stiffness: 200, damping: 22 };

function QuantityStepper() {
  const [qty, setQty] = useState(1);

  return (
    <div className="qty-stepper">
      <motion.button
        className="qty-stepper__btn"
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        aria-label="Decrease quantity"
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <Minus size={18} />
      </motion.button>

      <motion.span
        className="qty-stepper__value"
        key={qty}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        {qty}
      </motion.span>

      <motion.button
        className="qty-stepper__btn"
        onClick={() => setQty((q) => q + 1)}
        aria-label="Increase quantity"
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <Plus size={18} />
      </motion.button>
    </div>
  );
}

function ServiceBlock({ service, index }) {
  const [openItem, setOpenItem] = useState(null);

  return (
    <motion.article
      className="service-block"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...spring, delay: index * 0.1 }}
    >
      <div className="service-block__left">
        <motion.h2
          className="service-block__title"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.15 + index * 0.1 }}
        >
          {service.title}
        </motion.h2>

        {service.price && (
          <motion.span
            className="service-block__price"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {service.price}
          </motion.span>
        )}
      </div>

      <div className="service-block__right">
        <p className="service-block__description">{service.description}</p>

        {service.cta && (
          <p className="service-block__cta">
            <a href="/contact" className="service-block__inquire">
              Inquire
            </a>{' '}
            for a custom quote.
          </p>
        )}

        {service.items && (
          <ul className="service-block__list">
            {service.items.map((item, idx) => (
              <li key={idx} className="service-block__item">
                <motion.button
                  className="service-block__row"
                  onClick={() => setOpenItem(openItem === idx ? null : idx)}
                  aria-expanded={openItem === idx}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{item}</span>

                  <motion.span
                    animate={{ rotate: openItem === idx ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {openItem === idx ? (
                      <Minus size={20} />
                    ) : (
                      <Plus size={20} />
                    )}
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {openItem === idx && (
                    <motion.p
                      className="service-block__detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 28,
                      }}
                    >
                      Details about {item.toLowerCase()} go here. Replace with
                      real copy describing what's included.
                    </motion.p>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        )}

        {service.purchase && (
          <div className="service-block__purchase">
            <QuantityStepper />

            <motion.button
              className="service-block__buy-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              Purchase Session
            </motion.button>
          </div>
        )}
      </div>
    </motion.article>
  );
}

function Services() {
  return (
    <div className="services-page">
      <section className="services-page__hero">
        <div className="container services-page__hero-inner">
          <motion.h1
            className="services-page__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            Services
          </motion.h1>

          <motion.p
            className="services-page__intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.25 }}
          >
            I've got your interior design needs covered. Whether it's a single
            room or a full-scale makeover, let's make your space shine.
          </motion.p>
        </div>
      </section>

      <section className="services-page__hero-image">
        <div className="container">
          <motion.div
            className="services-page__image-placeholder"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: 0.15 }}
          >
            <span>Hero image placeholder</span>
          </motion.div>
        </div>
      </section>

      <div className="container services-page__list">
        {services.map((service, i) => (
          <ServiceBlock key={service.id} service={service} index={i} />
        ))}
      </div>
    </div>
  );
}

export default Services;
