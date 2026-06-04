import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Button from '@/components/ui/Button';
import './ContactForm.css';

function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    newsletter: false,
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Web3Forms delivers submissions to the inbox tied to the access key
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          botcheck: e.target.botcheck.checked,
          subject: `New inquiry from ${form.name} — Sha Design Studio`,
          from_name: 'Sha Design Studio Website',
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
          newsletter: form.newsletter ? 'Yes' : 'No',
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setStatus('success');
      setForm({ name: '', phone: '', email: '', message: '', newsletter: false });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot: hidden from humans; Web3Forms drops submissions where it's checked */}
      <input
        type="checkbox"
        name="botcheck"
        className="contact-form__botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="name" className="contact-form__label">
            Name <span className="contact-form__required">(required)</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={handleChange}
            className="contact-form__input"
          />
        </div>

        <div className="contact-form__field">
          <label htmlFor="phone" className="contact-form__label">
            Phone <span className="contact-form__required">(required)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={form.phone}
            onChange={handleChange}
            className="contact-form__input"
          />
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="email" className="contact-form__label">
          Email <span className="contact-form__required">(required)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
          className="contact-form__input"
        />
      </div>

      <div className="contact-form__field">
        <label htmlFor="message" className="contact-form__label">
          Message <span className="contact-form__required">(required)</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="contact-form__textarea"
        />
      </div>

      <label className="contact-form__checkbox">
        <input
          type="checkbox"
          name="newsletter"
          checked={form.newsletter}
          onChange={handleChange}
        />
        <span>Sign up for news and updates</span>
      </label>

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="contact-form__submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send Away'}
      </Button>

      <AnimatePresence mode="wait">
        {status === 'success' && (
          <motion.p
            key="success"
            className="contact-form__msg contact-form__msg--success"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            Thanks — Shiran will be in touch soon!
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            key="error"
            className="contact-form__msg contact-form__msg--error"
            role="alert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            Something went wrong. Please try again or email directly.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

export default ContactForm;
