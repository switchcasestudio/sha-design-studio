import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Button from '@/components/ui/Button';
import './Services.css';

const services = [
  {
    id: 'full-service',
    title: 'Full-service',
    description:
      'Designed for clients who want a complete interior overhaul or large-scale renovations.',
    cta: 'Inquire for a custom quote.',
    items: ['Service 1', 'Service 2', 'Service 3'],
    theme: 'blue',
  },
  {
    id: 'room-redesign',
    title: 'Room Redesign',
    description:
      'Full room transformation with a selection of furnishings, decor, and color schemes.',
    cta: 'Inquire for a custom quote.',
    items: ['Service 1', 'Service 2', 'Service 3'],
    theme: 'dark',
  },
  {
    id: 'design-session',
    title: 'Design Session',
    description:
      'One-hour sessions tailored to your needs — perfect for quick design advice, a second opinion, or help with specific design decisions. Available virtually or in person.',
    price: '₪200.00',
    purchase: true,
    theme: 'yellow',
  },
];

function ServiceCard({ service }) {
  const [openItem, setOpenItem] = useState(null);

  return (
    <article className={`service-card service-card--${service.theme}`}>
      <h2 className="service-card__title">{service.title}</h2>

      <div className="service-card__content">
        <p className="service-card__description">{service.description}</p>

        {service.cta && (
          <p className="service-card__cta">
            <a href="/contact" className="service-card__inquire">Inquire</a>{' '}
            {service.cta.replace('Inquire ', '')}
          </p>
        )}

        {service.items && (
          <ul className="service-card__list">
            {service.items.map((item, idx) => (
              <li key={idx} className="service-card__item">
                <button
                  className="service-card__row"
                  onClick={() => setOpenItem(openItem === idx ? null : idx)}
                  aria-expanded={openItem === idx}
                >
                  <span>{item}</span>
                  {openItem === idx ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                {openItem === idx && (
                  <p className="service-card__detail">
                    Details about {item.toLowerCase()} go here. Replace with
                    real copy describing what's included.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {service.price && (
          <div className="service-card__price-row">
            <span className="service-card__price">{service.price}</span>
            <Button variant="outline" size="md">Purchase Session</Button>
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
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}

export default Services;
