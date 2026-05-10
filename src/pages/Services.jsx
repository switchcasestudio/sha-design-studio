import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
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
      'One-hour sessions tailored to your needs — perfect for quick design advice, a second opinion, or help with specific design decisions. Available virtually or in person.',
    price: '₪200.00',
    purchase: true,
  },
];

function QuantityStepper() {
  const [qty, setQty] = useState(1);

  return (
    <div className="qty-stepper">
      <button
        className="qty-stepper__btn"
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        aria-label="Decrease quantity"
      >
        <Minus size={18} />
      </button>
      <span className="qty-stepper__value">{qty}</span>
      <button
        className="qty-stepper__btn"
        onClick={() => setQty((q) => q + 1)}
        aria-label="Increase quantity"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}

function ServiceBlock({ service }) {
  const [openItem, setOpenItem] = useState(null);

  return (
    <article className="service-block">
      <div className="service-block__left">
        <h2 className="service-block__title">{service.title}</h2>
        {service.price && (
          <span className="service-block__price">{service.price}</span>
        )}
      </div>

      <div className="service-block__right">
        <p className="service-block__description">{service.description}</p>

        {service.cta && (
          <p className="service-block__cta">
            <a href="/contact" className="service-block__inquire">Inquire</a>{' '}
            for a custom quote.
          </p>
        )}

        {service.items && (
          <ul className="service-block__list">
            {service.items.map((item, idx) => (
              <li key={idx} className="service-block__item">
                <button
                  className="service-block__row"
                  onClick={() => setOpenItem(openItem === idx ? null : idx)}
                  aria-expanded={openItem === idx}
                >
                  <span>{item}</span>
                  {openItem === idx ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                {openItem === idx && (
                  <p className="service-block__detail">
                    Details about {item.toLowerCase()} go here. Replace with
                    real copy describing what's included.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {service.purchase && (
          <div className="service-block__purchase">
            <QuantityStepper />
            <button className="service-block__buy-btn">
              Purchase Session
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function Services() {
  return (
    <div className="services-page">
      <section className="services-page__hero">
        <div className="container services-page__hero-inner">
          <h1 className="services-page__title">Services</h1>
          <p className="services-page__intro">
            I've got your interior design needs covered. Whether it's a single
            room or a full-scale makeover, let's make your space shine.
          </p>
        </div>
      </section>

      <section className="services-page__hero-image">
        <div className="container">
          <div className="services-page__image-placeholder">
            <span>Hero image placeholder</span>
          </div>
        </div>
      </section>

      <div className="container services-page__list">
        {services.map((service) => (
          <ServiceBlock key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}

export default Services;