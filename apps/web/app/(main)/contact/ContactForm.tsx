'use client';

import { useState, FormEvent } from 'react';

const SUBJECT_OPTIONS = [
  { value: '', label: 'Select a subject...' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
];

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="content-card" style={{ padding: '24px 28px' }}>
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: 8,
          }}>
            Message Received
          </h2>
          <p style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.88rem',
            color: 'var(--faded-ink)',
            lineHeight: 1.5,
            maxWidth: 400,
            margin: '0 auto',
          }}>
            Thank you for reaching out. We will review your message and get back to you as soon as possible.
          </p>
          <button
            onClick={() => setStatus('idle')}
            style={{
              marginTop: 20,
              fontFamily: 'var(--sans)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--crimson)',
              background: 'none',
              border: '1px solid var(--crimson)',
              borderRadius: 4,
              padding: '8px 20px',
              cursor: 'pointer',
            }}
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-card" style={{ padding: '24px 28px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {status === 'error' && (
          <div style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.82rem',
            color: '#b91c1c',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 4,
            padding: '10px 14px',
          }}>
            {errorMessage}
          </div>
        )}

        {/* Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label
            htmlFor="contact-name"
            style={{
              fontFamily: 'var(--serif)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--ink)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.88rem',
              padding: '10px 12px',
              border: '1px solid var(--border)',
              borderRadius: 4,
              backgroundColor: 'var(--parchment)',
              color: 'var(--ink)',
              outline: 'none',
            }}
          />
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label
            htmlFor="contact-email"
            style={{
              fontFamily: 'var(--serif)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--ink)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.88rem',
              padding: '10px 12px',
              border: '1px solid var(--border)',
              borderRadius: 4,
              backgroundColor: 'var(--parchment)',
              color: 'var(--ink)',
              outline: 'none',
            }}
          />
        </div>

        {/* Subject */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label
            htmlFor="contact-subject"
            style={{
              fontFamily: 'var(--serif)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--ink)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Subject
          </label>
          <select
            id="contact-subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.88rem',
              padding: '10px 12px',
              border: '1px solid var(--border)',
              borderRadius: 4,
              backgroundColor: 'var(--parchment)',
              color: subject ? 'var(--ink)' : 'var(--faded-ink)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label
            htmlFor="contact-message"
            style={{
              fontFamily: 'var(--serif)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--ink)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Message
          </label>
          <textarea
            id="contact-message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            rows={6}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.88rem',
              padding: '10px 12px',
              border: '1px solid var(--border)',
              borderRadius: 4,
              backgroundColor: 'var(--parchment)',
              color: 'var(--ink)',
              outline: 'none',
              resize: 'vertical',
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '0.92rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#fff',
            backgroundColor: status === 'submitting' ? 'var(--faded-ink)' : 'var(--crimson)',
            border: 'none',
            borderRadius: 4,
            padding: '12px 24px',
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s ease',
            alignSelf: 'flex-start',
          }}
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
