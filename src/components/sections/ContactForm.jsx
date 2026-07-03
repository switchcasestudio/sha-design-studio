import { useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import BrandShape from '@/components/ui/BrandShape';
import './ContactForm.css';

// Animatable motif — the success burst pops these out from behind the message.
const MotionShape = motion.create(BrandShape);

// The confetti-of-stickers that lands around the thank-you on a successful send.
// Each piece springs from the centre (0,0) out to its resting {x,y,rot} — a
// handful of stickers settling, not a physics firework. Offsets frame a
// centred two-line message; overflow is clipped by the panel so nothing
// escapes the card on narrow screens.
const SUCCESS_BURST = [
  { shape: 'flower2', color: 'var(--color-yellow-deep)', x: 0, y: -104, rot: 8, delay: 0 },
  { shape: 'daisy', color: 'var(--color-yellow)', x: -150, y: -64, rot: -18, delay: 0.05 },
  { shape: 'star', color: 'var(--color-orange)', x: 156, y: -56, rot: 16, delay: 0.09 },
  { shape: 'heart', color: 'var(--color-orange-soft)', x: -168, y: 60, rot: -12, delay: 0.13 },
  { shape: 'clover', color: 'var(--color-blue)', x: 146, y: 74, rot: 20, delay: 0.11 },
  { shape: 'tulip', color: 'var(--color-orange)', x: -104, y: 108, rot: -8, delay: 0.17 },
  { shape: 'ring', color: 'var(--color-blue-soft)', x: 118, y: 116, rot: 12, delay: 0.19 },
];

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
  const reduce = useReducedMotion();
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

  // On success the whole form is replaced (not appended to) so completing it
  // reads as finishing — a display-face thank-you with a burst of brand
  // stickers landing around it. Reduced motion: the stickers appear in their
  // resting spots with no travel.
  if (status === 'success') {
    return (
      <div className="contact-form contact-form--done">
        <motion.div
          className="contact-form__success"
          role="status"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <div className="contact-form__burst" aria-hidden="true">
            {SUCCESS_BURST.map((b) => {
              const rest = { scale: 1, x: b.x, y: b.y, rotate: b.rot, opacity: 1 };
              return (
                <MotionShape
                  key={b.shape}
                  shape={b.shape}
                  className="contact-form__burst-shape"
                  style={{ color: b.color }}
                  initial={reduce ? rest : { scale: 0, x: 0, y: 0, rotate: 0, opacity: 0 }}
                  animate={rest}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 260, damping: 15, delay: 0.1 + b.delay }
                  }
                />
              );
            })}
          </div>

          <p className="contact-form__success-title">
            Thanks — Shiran will be in touch soon!
          </p>
        </motion.div>
      </div>
    );
  }

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
          placeholder="Tell me about your idea — big, tiny, or still a scribble…"
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
          className="contact-form__checkbox-input"
          checked={form.newsletter}
          onChange={handleChange}
        />
        <span className="contact-form__checkbox-box" aria-hidden="true">
          <Check size={16} strokeWidth={3} />
        </span>
        <span>Sign up for news and updates</span>
      </label>

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="contact-form__submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <>
            <MotionShape
              shape="daisy"
              className="contact-form__submit-spinner"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={
                reduce
                  ? undefined
                  : { repeat: Infinity, ease: 'linear', duration: 1.1 }
              }
            />
            Sending…
          </>
        ) : (
          'Send Away'
        )}
      </Button>

      <AnimatePresence mode="wait">
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
