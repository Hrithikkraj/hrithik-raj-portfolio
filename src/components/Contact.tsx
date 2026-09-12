import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import {
  motion,
  AnimatePresence,
  type Variants,
} from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import '../assets/styles/Contact.scss';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isValidEmail = (val: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ||
  /^\+?[\d\s\-()]{7,}$/.test(val.trim()); // also accept phone

// ─── Field-level inline validation tick ──────────────────────────────────────
function ValidTick({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          className="contact-field__tick"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.5, x: -4 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: -4 }}
          transition={{ type: 'spring' as const, stiffness: 500, damping: 22 }}
        >
          ✓
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ─── Shake + glow wrapper ────────────────────────────────────────────────────
interface FieldWrapProps {
  children: React.ReactNode;
  hasError: boolean;
  focused: boolean;
  valid: boolean;
  id: string;
  isTextarea?: boolean;
}

const shakeVariants: Variants = {
  idle:    { x: 0 },
  shake: {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.42, ease: 'easeInOut' },
  },
};

function FieldWrap({ children, hasError, focused, valid, id, isTextarea }: FieldWrapProps) {
  const reduced = prefersReduced();
  const [shakeKey, setShakeKey] = useState(0);
  const prevError = useRef(hasError);

  // Trigger shake when error newly becomes true
  useEffect(() => {
    if (hasError && !prevError.current && !reduced) {
      setShakeKey(k => k + 1);
    }
    prevError.current = hasError;
  }, [hasError, reduced]);

  return (
    <motion.div
      className={`contact-field-wrap${focused ? ' contact-field-wrap--focused' : ''}${hasError ? ' contact-field-wrap--error' : ''}${valid ? ' contact-field-wrap--valid' : ''}${isTextarea ? ' contact-field-wrap--textarea' : ''}`}
      key={`shake-${shakeKey}`}
      variants={reduced ? {} : shakeVariants}
      animate={shakeKey > 0 && !reduced ? 'shake' : 'idle'}
      whileHover={reduced ? {} : { scale: 1.008, transition: { duration: 0.2 } }}
      id={`wrap-${id}`}
    >
      {children}
      <ValidTick show={valid && !hasError} />
    </motion.div>
  );
}

// ─── Success toast ───────────────────────────────────────────────────────────
const toastVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 320, damping: 24 },
  },
  exit: {
    opacity: 0, y: 10, scale: 0.97,
    transition: { duration: 0.3 },
  },
};

// ─── Animation variants ───────────────────────────────────────────────────────
const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

// ─── Contact Component ────────────────────────────────────────────────────────
function Contact() {
  const recipientEmail = 'hrithk23245@iiitd.ac.in';
  const reduced = prefersReduced();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');

  const [nameError,    setNameError]    = useState(false);
  const [emailError,   setEmailError]   = useState(false);
  const [messageError, setMessageError] = useState(false);

  const [submitted,    setSubmitted]    = useState(false);
  const [sendFailed,   setSendFailed]   = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sendState,    setSendState]    = useState<'idle' | 'sending' | 'sent'>('idle');

  // ── Focus tracking ──────────────────────────────────────────────────────────
  const [nameFocused,    setNameFocused]    = useState(false);
  const [emailFocused,   setEmailFocused]   = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);

  // ── Inline valid flags ──────────────────────────────────────────────────────
  const nameValid    = name.trim().length > 0;
  const emailValid   = isValidEmail(email);
  const messageValid = message.trim().length > 0;

  // ── Auto-dismiss toast ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => setSubmitted(false), 4500);
    return () => clearTimeout(t);
  }, [submitted]);

  useEffect(() => {
    if (!sendFailed) return;
    const t = setTimeout(() => setSendFailed(false), 6500);
    return () => clearTimeout(t);
  }, [sendFailed]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName    = name.trim();
    const trimmedEmail   = email.trim();
    const trimmedMessage = message.trim();

    setNameError(!trimmedName);
    setEmailError(!trimmedEmail);
    setMessageError(!trimmedMessage);
    setSubmitted(false);
    setSendFailed(false);
    setErrorMessage(null);

    if (!trimmedName || !trimmedEmail || !trimmedMessage) return;

    const serviceId  = process.env.REACT_APP_EMAILJS_SERVICE_ID  || 'service_4vd4rs8';
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_0tzlv2g';
    const publicKey  = process.env.REACT_APP_EMAILJS_PUBLIC_KEY  || 'bj3kHY36dA3h8SCqD';

    setSendState('sending');

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: trimmedName,
          name: trimmedName,
          from_email: trimmedEmail,
          email: trimmedEmail,
          reply_to: trimmedEmail,
          title: `Portfolio inquiry from ${trimmedName}`,
          message: trimmedMessage,
        },
        publicKey
      );

      // Button "sent" state
      setSendState('sent');
      setTimeout(() => setSendState('idle'), 1600);

      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      console.error('EmailJS send error:', error);
      const msg = typeof error === 'string'
        ? error
        : error?.text || error?.message || null;
      setErrorMessage(msg);
      setSendState('idle');
      setSendFailed(true);
    }
  };

  return (
    <section id="contact" className="contact-section">
      {/* ── Ambient blobs ──────────────────────────────────────────────── */}
      <div className="contact-bg-blobs" aria-hidden="true">
        <div className="blob-1" />
        <div className="blob-2" />
      </div>

      <motion.div
        className="contact-inner"
        variants={reduced ? {} : sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* ── Heading ──────────────────────────────────────────────────── */}
        <motion.div className="contact-heading" variants={reduced ? {} : itemVariants}>
          <h1>Contact Me</h1>
          <p>Got a project waiting to be realized? Let's collaborate and make it happen!</p>
        </motion.div>

        <div className="contact-layout">
          {/* ── Form ─────────────────────────────────────────────────────── */}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            className="contact-form"
            onSubmit={sendEmail}
          >
          {/* Name + Email row */}
          <motion.div className="form-flex" variants={reduced ? {} : itemVariants}>
            {/* Name */}
            <FieldWrap
              hasError={nameError}
              focused={nameFocused}
              valid={nameValid}
              id="contact-name"
            >
              <div className="cf-field">
                <label htmlFor="contact-name" className="cf-label">
                  Your Name
                  <span className="cf-required" aria-hidden="true"> *</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className={`cf-input${nameError ? ' cf-input--error' : ''}`}
                  placeholder="What's your name?"
                  value={name}
                  onChange={e => { setName(e.target.value); if (nameError) setNameError(false); }}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  aria-required="true"
                  aria-invalid={nameError}
                  aria-describedby={nameError ? 'name-error' : undefined}
                />
                {nameError && (
                  <span id="name-error" className="cf-helper cf-helper--error" role="alert">
                    Please enter your name
                  </span>
                )}
              </div>
            </FieldWrap>

            {/* Email */}
            <FieldWrap
              hasError={emailError}
              focused={emailFocused}
              valid={emailValid}
              id="contact-email"
            >
              <div className="cf-field">
                <label htmlFor="contact-email" className="cf-label">
                  Email / Phone
                  <span className="cf-required" aria-hidden="true"> *</span>
                </label>
                <input
                  id="contact-email"
                  type="text"
                  required
                  className={`cf-input${emailError ? ' cf-input--error' : ''}`}
                  placeholder="How can I reach you?"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(false); }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  aria-required="true"
                  aria-invalid={emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
                {emailError && (
                  <span id="email-error" className="cf-helper cf-helper--error" role="alert">
                    Please enter your email or phone number
                  </span>
                )}
              </div>
            </FieldWrap>
          </motion.div>

          {/* Message */}
          <motion.div variants={reduced ? {} : itemVariants} className="contact-message-wrap">
            <FieldWrap
              hasError={messageError}
              focused={messageFocused}
              valid={messageValid}
              id="contact-message"
              isTextarea
            >
              <div className="cf-field">
                <label htmlFor="contact-message" className="cf-label">
                  Message
                  <span className="cf-required" aria-hidden="true"> *</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={10}
                  className={`cf-input cf-input--textarea${messageError ? ' cf-input--error' : ''}`}
                  placeholder="Send me any inquiries or questions"
                  value={message}
                  onChange={e => { setMessage(e.target.value); if (messageError) setMessageError(false); }}
                  onFocus={() => setMessageFocused(true)}
                  onBlur={() => setMessageFocused(false)}
                  aria-required="true"
                  aria-invalid={messageError}
                  aria-describedby={messageError ? 'message-error' : undefined}
                />
                {messageError && (
                  <span id="message-error" className="cf-helper cf-helper--error" role="alert">
                    Please enter the message
                  </span>
                )}
              </div>
            </FieldWrap>
          </motion.div>

          {/* Submit button */}
          <motion.div
            className="contact-submit-row"
            variants={reduced ? {} : itemVariants}
          >
            <motion.div
              className="contact-btn-wrap"
              whileHover={reduced ? {} : {
                scale: 1.03,
                transition: { duration: 0.2, ease: 'easeOut' },
              }}
              whileTap={reduced ? {} : { scale: 0.97 }}
            >
              <Button
                variant="contained"
                type="submit"
                className="contact-btn cursor-hover"
                aria-label="Send message"
                disabled={sendState === 'sending'}
                endIcon={
                  <AnimatePresence mode="wait" initial={false}>
                    {sendState === 'sent' ? (
                      <motion.span
                        key="check"
                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.25 }}
                        style={{ display: 'inline-flex', color: '#ffffff' }}
                      >
                        <CheckIcon fontSize="small" sx={{ color: '#ffffff' }} />
                      </motion.span>
                    ) : sendState === 'sending' ? (
                      <motion.span
                        key="sending"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'inline-flex', color: '#ffffff' }}
                      >
                        <motion.span
                          animate={reduced ? {} : { rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          style={{
                            display: 'inline-block',
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255, 255, 255, 0.35)',
                            borderTopColor: '#ffffff',
                            borderRadius: '50%',
                          }}
                        />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'inline-flex', color: '#ffffff' }}
                      >
                        <SendIcon fontSize="small" className="send-icon" sx={{ color: '#ffffff' }} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                }
              >
                {sendState === 'sent' ? 'Sent!' : sendState === 'sending' ? 'Sending...' : 'Send'}
              </Button>
            </motion.div>
          </motion.div>

          {/* ── Toast region (success & error) ────────────────────── */}
          {/* aria-live region always in DOM so screen readers pick it up */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="contact-toast-region"
          >
            <AnimatePresence>
              {submitted && (
                <motion.div
                  key="success-toast"
                  className="contact-toast"
                  variants={reduced ? {} : toastVariants}
                  initial={reduced ? { opacity: 1 } : 'hidden'}
                  animate={reduced ? { opacity: 1 } : 'visible'}
                  exit={reduced ? { opacity: 0 } : 'exit'}
                  role="presentation"
                >
                  <span className="contact-toast__icon" aria-hidden="true">✉️</span>
                  <span className="contact-toast__text">
                    Your message has been sent successfully!
                  </span>
                  <button
                    className="contact-toast__dismiss"
                    onClick={() => setSubmitted(false)}
                    aria-label="Dismiss notification"
                  >
                    ×
                  </button>
                </motion.div>
              )}

              {sendFailed && (
                <motion.div
                  key="error-toast"
                  className="contact-toast contact-toast--error"
                  variants={reduced ? {} : toastVariants}
                  initial={reduced ? { opacity: 1 } : 'hidden'}
                  animate={reduced ? { opacity: 1 } : 'visible'}
                  exit={reduced ? { opacity: 0 } : 'exit'}
                  role="alert"
                >
                  <span className="contact-toast__icon" aria-hidden="true">⚠</span>
                  <span className="contact-toast__text">
                    {errorMessage
                      ? `${errorMessage} — please `
                      : 'Something went wrong sending your message — please '}
                    <a
                      href={`mailto:${recipientEmail}`}
                      className="contact-toast__link"
                    >
                      email me directly
                    </a>{' '}
                    at {recipientEmail}.
                  </span>
                  <button
                    className="contact-toast__dismiss"
                    onClick={() => setSendFailed(false)}
                    aria-label="Dismiss notification"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </Box>

          <motion.aside className="contact-aside" variants={reduced ? {} : itemVariants}>
            <span className="contact-aside__eyebrow">Open to opportunities</span>
            <h2>Have an idea? Let's turn it into something real.</h2>
            <p className="contact-aside__copy">
              I enjoy working on thoughtful products, polished interfaces, and practical ideas that make a difference.
            </p>

            <div className="contact-aside__status">
              <span className="contact-aside__status-dot" aria-hidden="true" />
              <span>Currently available for select projects</span>
            </div>

            <div className="contact-aside__meta">
              <span>Based in India</span>
              <span>Usually replies within 24 hours</span>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}

export default Contact;
