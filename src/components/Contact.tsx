import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  type Variants,
} from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';
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
}

const shakeVariants: Variants = {
  idle:    { x: 0 },
  shake: {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.42, ease: 'easeInOut' },
  },
};

function FieldWrap({ children, hasError, focused, valid, id }: FieldWrapProps) {
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
      className={`contact-field-wrap${focused ? ' contact-field-wrap--focused' : ''}${hasError ? ' contact-field-wrap--error' : ''}${valid ? ' contact-field-wrap--valid' : ''}`}
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
  const [sendState,    setSendState]    = useState<'idle' | 'sent'>('idle');

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

  // ── Submit ──────────────────────────────────────────────────────────────────
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName    = name.trim();
    const trimmedEmail   = email.trim();
    const trimmedMessage = message.trim();

    setNameError(!trimmedName);
    setEmailError(!trimmedEmail);
    setMessageError(!trimmedMessage);
    setSubmitted(false);

    if (!trimmedName || !trimmedEmail || !trimmedMessage) return;

    const subject = 'Message for Hrithik';
    const body    = `Name: ${trimmedName}\nContact: ${trimmedEmail}\n\nMessage:\n${trimmedMessage}`;
    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Button "sent" state
    setSendState('sent');
    setTimeout(() => setSendState('idle'), 1600);

    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
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
              <TextField
                required
                fullWidth
                id="contact-name"
                label="Your Name"
                placeholder="What's your name?"
                value={name}
                onChange={e => { setName(e.target.value); if (nameError) setNameError(false); }}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                error={nameError}
                helperText={nameError ? 'Please enter your name' : ''}
                inputProps={{ 'aria-describedby': nameError ? 'name-error' : undefined }}
              />
            </FieldWrap>

            {/* Email */}
            <FieldWrap
              hasError={emailError}
              focused={emailFocused}
              valid={emailValid}
              id="contact-email"
            >
              <TextField
                required
                fullWidth
                id="contact-email"
                label="Email / Phone"
                placeholder="How can I reach you?"
                value={email}
                onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(false); }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                error={emailError}
                helperText={emailError ? 'Please enter your email or phone number' : ''}
                inputProps={{ 'aria-describedby': emailError ? 'email-error' : undefined }}
              />
            </FieldWrap>
          </motion.div>

          {/* Message */}
          <motion.div variants={reduced ? {} : itemVariants} className="contact-message-wrap">
            <FieldWrap
              hasError={messageError}
              focused={messageFocused}
              valid={messageValid}
              id="contact-message"
            >
              <TextField
                required
                fullWidth
                id="contact-message"
                label="Message"
                placeholder="Send me any inquiries or questions"
                multiline
                rows={10}
                value={message}
                onChange={e => { setMessage(e.target.value); if (messageError) setMessageError(false); }}
                onFocus={() => setMessageFocused(true)}
                onBlur={() => setMessageFocused(false)}
                error={messageError}
                helperText={messageError ? 'Please enter the message' : ''}
                inputProps={{ 'aria-describedby': messageError ? 'message-error' : undefined }}
              />
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
                endIcon={
                  <AnimatePresence mode="wait" initial={false}>
                    {sendState === 'sent' ? (
                      <motion.span
                        key="check"
                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.25 }}
                        style={{ display: 'inline-flex' }}
                      >
                        <CheckIcon fontSize="small" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'inline-flex' }}
                      >
                        <SendIcon fontSize="small" className="send-icon" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                }
              >
                {sendState === 'sent' ? 'Sent!' : 'Send'}
              </Button>
            </motion.div>
          </motion.div>

          {/* ── Success toast ─────────────────────────────────────────── */}
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
                  className="contact-toast"
                  variants={reduced ? {} : toastVariants}
                  initial={reduced ? { opacity: 1 } : 'hidden'}
                  animate={reduced ? { opacity: 1 } : 'visible'}
                  exit={reduced ? { opacity: 0 } : 'exit'}
                  role="presentation"
                >
                  <span className="contact-toast__icon" aria-hidden="true">✉️</span>
                  <span className="contact-toast__text">
                    Your email app should now be open with the message ready to send.
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

            <a className="contact-aside__email" href={`mailto:${recipientEmail}`}>
              {recipientEmail}
            </a>

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
