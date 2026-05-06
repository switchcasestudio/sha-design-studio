import { useState } from 'react';
import Button from '@/components/ui/Button';
import './ContactForm.css';

function ContactForm() {
  const [form, setForm] = useState({
    email: '',
    message: '',
    newsletter: false,
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

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

    // TODO: wire up to a real backend (Formspree, Netlify Forms, custom API, etc.)
    // For now, simulate a success after a short delay.
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus('success');
      setForm({ email: '', message: '', newsletter: false });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__field">
        <label htmlFor="email" className="contact-form__label">
          Email <span className="contact-form__required">(required)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="contact-form__input"
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

      <Button
        type="submit"
        variant="outline"
        size="md"
        className="contact-form__submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send Away'}
      </Button>

      {status === 'success' && (
        <p className="contact-form__msg contact-form__msg--success" role="status">
          Thanks — Shiran will be in touch soon!
        </p>
      )}
      {status === 'error' && (
        <p className="contact-form__msg contact-form__msg--error" role="alert">
          Something went wrong. Please try again or email directly.
        </p>
      )}
    </form>
  );
}

export default ContactForm;
