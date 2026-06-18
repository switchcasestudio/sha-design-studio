import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Button from '@/components/ui/Button';
import './ContactForm.css';

// Required fields and how to validate them. Keeping this declarative lets the
// markup, error rendering and submit-time checks share one source of truth.
const FIELDS = [
  { name: 'name', validate: (v) => (v.trim() ? null : 'Enter your name.') },
  { name: 'phone', validate: (v) => (v.trim() ? null : 'Enter a phone number.') },
  {
    name: 'email',
    validate: (v) =>
      !v.trim()
        ? 'Enter your email.'
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          ? null
          : 'Enter a valid email, e.g. name@example.com.',
  },
  { name: 'message', validate: (v) => (v.trim() ? null : 'Add a short message.') },
];

function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    newsletter: false,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear a field's error as soon as the user starts correcting it
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const validateAll = () => {
    const next = {};
    for (const field of FIELDS) {
      const msg = field.validate(form[field.name]);
      if (msg) next[field.name] = msg;
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validateAll();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Move focus to the first invalid field so keyboard/SR users land on it
      const firstInvalid = FIELDS.find((f) => found[f.name]);
      formRef.current
        ?.querySelector(`[name="${firstInvalid.name}"]`)
        ?.focus();
      return;
    }

    setErrors({});
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

  // Per-field error message + the aria wiring that ties it to its input
  const fieldProps = (name) => ({
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  const renderError = (name) =>
    errors[name] && (
      <span id={`${name}-error`} className="contact-form__field-error" role="alert">
        {errors[name]}
      </span>
    );

  return (
    <form
      ref={formRef}
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* One legend instead of repeating "(required)" on every field */}
      <p className="contact-form__legend">
        <span className="contact-form__req-mark" aria-hidden="true">
          *
        </span>{' '}
        Required fields
      </p>

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
            Name{' '}
            <span className="contact-form__req-mark" aria-hidden="true">
              *
            </span>
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
            {...fieldProps('name')}
          />
          {renderError('name')}
        </div>

        <div className="contact-form__field">
          <label htmlFor="phone" className="contact-form__label">
            Phone{' '}
            <span className="contact-form__req-mark" aria-hidden="true">
              *
            </span>
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
            {...fieldProps('phone')}
          />
          {renderError('phone')}
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="email" className="contact-form__label">
          Email{' '}
          <span className="contact-form__req-mark" aria-hidden="true">
            *
          </span>
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
          {...fieldProps('email')}
        />
        {renderError('email')}
      </div>

      <div className="contact-form__field">
        <label htmlFor="message" className="contact-form__label">
          Message{' '}
          <span className="contact-form__req-mark" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="contact-form__textarea"
          {...fieldProps('message')}
        />
        {renderError('message')}
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
