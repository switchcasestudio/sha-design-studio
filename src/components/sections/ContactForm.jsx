import { useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import BrandShape from '@/components/ui/BrandShape';
import { rise, stagger } from '@/lib/motion';
import { useTheme } from '@/theme/ThemeContext';
import { spring } from '@/theme/vivid/motion';
import Magnetic from '@/theme/vivid/Magnetic';
import SplitText from '@/theme/vivid/SplitText';
import './ContactForm.css';

// Animatable motif for the thank-you.
const MotionShape = motion.create(BrandShape);

// A few still brand motifs around the thank-you on a successful send. Each one
// does the single 16px rise into its resting {x,y} — nothing springs, nothing
// bursts. Full-strength fills that read on the paper card (yolk, pool and
// tomato are all fine on paper). Offsets frame a centred two-line message;
// overflow is clipped by the panel so nothing escapes on narrow screens.
const SUCCESS_MOTIFS = [
  { shape: 'flower2', color: 'var(--yolk)', x: 0, y: -118 },
  { shape: 'star', color: 'var(--pool)', x: 190, y: -72 },
  { shape: 'heart', color: 'var(--tomato)', x: -190, y: 52 },
  { shape: 'clover', color: 'var(--pool)', x: -170, y: -76 },
  { shape: 'tulip', color: 'var(--yolk)', x: 160, y: 100 },
];

// Vivid thank-you confetti: brand shapes fired out of the centre in a ring,
// then drifting down. Deterministic spread so renders stay pure.
const CONFETTI_SHAPES = ['heart', 'star', 'clover', 'daisy', 'flower2', 'tulip'];
const CONFETTI_COLORS = ['var(--yolk)', 'var(--pool)', 'var(--tomato)'];
const CONFETTI = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2 + (i % 3) * 0.35;
  const dist = 140 + ((i * 47) % 120);
  return {
    shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.cos(angle) * dist * 1.4,
    y: Math.sin(angle) * dist,
    rotate: ((i * 83) % 360) - 180,
    size: 14 + ((i * 7) % 16),
  };
});

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
  const { isVivid } = useTheme();
  // Vivid: bumps on each failed submit so the invalid fields shake again
  const [shake, setShake] = useState(0);
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
      if (isVivid) setShake((n) => n + 1);
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

  // Vivid: a little check pops in beside a label once its field is valid
  const renderOk = (name) => {
    if (!isVivid) return null;
    const field = FIELDS.find((f) => f.name === name);
    const ok = form[name].trim() && !field.validate(form[name]);
    return (
      <AnimatePresence>
        {ok && (
          <motion.span
            className="contact-form__ok"
            aria-hidden="true"
            initial={{ scale: 0, rotate: -120 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={spring.bouncy}
          >
            <Check size={12} strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    );
  };

  const renderError = (name) =>
    errors[name] && (
      <span id={`${name}-error`} className="contact-form__field-error" role="alert">
        {errors[name]}
      </span>
    );

  // On success the whole form is replaced (not appended to) so completing it
  // reads as finishing — a headline thank-you (one block) with a few still
  // motifs around it. Reduced motion: everything appears in place.
  if (status === 'success') {
    // Pull the motifs in on narrow cards so none are clipped by the edge.
    const k =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 600px)').matches
        ? 0.74
        : 1;
    if (isVivid) {
      return (
        <div className="contact-form contact-form--done contact-form--vivid">
          <div className="contact-form__success" role="status">
            <div className="contact-form__motifs" aria-hidden="true">
              {CONFETTI.map((c, i) => (
                <MotionShape
                  key={`c-${i}`}
                  shape={c.shape}
                  className="contact-form__confetti"
                  style={{ color: c.color, '--size': `${c.size}px` }}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    x: c.x * k,
                    y: [0, c.y * k, c.y * k + 160],
                    scale: [0, 1.2, 0.8],
                    rotate: c.rotate * 2,
                  }}
                  transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], times: [0, 0.35, 1] }}
                />
              ))}
              {SUCCESS_MOTIFS.map((m, i) => (
                <MotionShape
                  key={m.shape}
                  shape={m.shape}
                  className="contact-form__motif contact-form__motif--vivid"
                  style={{ color: m.color }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, x: m.x * k, y: m.y * k, scale: 1, rotate: 0 }}
                  transition={{ ...spring.bouncy, delay: 0.25 + i * 0.08 }}
                />
              ))}
            </div>

            <motion.p
              className="contact-form__success-title"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring.bouncy, delay: 0.1 }}
            >
              <span className="hl">Thanks</span>,{' '}
              <SplitText text="Shiran will be in touch soon." trigger="mount" delay={0.35} />
            </motion.p>
          </div>
        </div>
      );
    }

    return (
      <div className="contact-form contact-form--done">
        <motion.div
          className="contact-form__success"
          role="status"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={rise}
        >
          <div className="contact-form__motifs" aria-hidden="true">
            {SUCCESS_MOTIFS.map((m, i) => (
              <MotionShape
                key={m.shape}
                shape={m.shape}
                className="contact-form__motif"
                style={{ color: m.color }}
                initial={
                  reduce ? false : { opacity: 0, x: m.x * k, y: m.y * k + 16 }
                }
                animate={{ opacity: 1, x: m.x * k, y: m.y * k }}
                transition={{ ...rise, delay: 0.15 + i * stagger }}
              />
            ))}
          </div>

          <p className="contact-form__success-title">
            <span className="hl">Thanks</span>, Shiran will be in touch soon.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className={`contact-form${isVivid ? ' contact-form--vivid' : ''}`}
      onSubmit={handleSubmit}
      noValidate
      data-shake={isVivid && shake ? (shake % 2 ? 'a' : 'b') : undefined}
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
            {renderOk('name')}
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
            {renderOk('phone')}
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
          {renderOk('email')}
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
          {renderOk('message')}
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

      <div className="contact-form__actions">
        <label className="contact-form__checkbox">
          <input
            type="checkbox"
            name="newsletter"
            className="contact-form__checkbox-input"
            checked={form.newsletter}
            onChange={handleChange}
          />
          <span className="contact-form__checkbox-box" aria-hidden="true">
            <Check size={16} strokeWidth={2} />
          </span>
          <span>Sign up for news and updates</span>
        </label>

        {/* Field + action: oat fields, one ink pill. No spinner — the label
            swap is the progress cue (nothing loops). */}
        {isVivid ? (
          <Magnetic strength={0.35} className="contact-form__submit-wrap">
            <Button
              type="submit"
              variant="dark"
              size="md"
              className="contact-form__submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' && (
                <BrandShape shape="flower2" className="contact-form__spinner" />
              )}
              {status === 'submitting' ? 'Sending…' : 'Send away'}
            </Button>
          </Magnetic>
        ) : (
          <Button
            type="submit"
            variant="dark"
            size="md"
            className="contact-form__submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending…' : 'Send away'}
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {status === 'error' && (
          <motion.p
            key="error"
            className="contact-form__msg contact-form__msg--error"
            role="alert"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={rise}
          >
            Something went wrong. Please try again or email directly.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

export default ContactForm;
