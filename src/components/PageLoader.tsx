import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

/**
 * PageLoader
 *
 * Full-screen intro overlay shown ONCE per browser session.
 * - "Hrithik Raj" animates in letter-by-letter (staggered)
 * - Entire overlay then wipes upward and unmounts
 * - Respects prefers-reduced-motion (instant skip if set)
 * - Uses sessionStorage to gate one-time display
 */

const SESSION_KEY = 'hrithik_portfolio_loaded';

// ── Letter-stagger variants ──────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3,
    },
  },
  exit: {},
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Reduced-motion variants (no animation)
const reducedContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
  exit:   { opacity: 0, transition: { duration: 0.15 } },
};

const reducedLetterVariants: Variants = {
  hidden:  { opacity: 1 },
  visible: { opacity: 1 },
};

// Overlay wipe exit
const overlayExitVariants: Variants = {
  initial: { clipPath: 'inset(0% 0% 0% 0%)' },
  exit: {
    clipPath: 'inset(0% 0% 100% 0%)',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
  },
};

const overlayExitReduced: Variants = {
  initial: { opacity: 1 },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

// ── Split helper ─────────────────────────────────────────────
const splitText = (text: string) =>
  text.split('').map((char, i) => (
    <motion.span
      key={i}
      variants={letterVariants}
      style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
    >
      {char}
    </motion.span>
  ));

const splitTextReduced = (text: string) =>
  text.split('').map((char, i) => (
    <motion.span
      key={i}
      variants={reducedLetterVariants}
      style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
    >
      {char}
    </motion.span>
  ));

// ── Component ────────────────────────────────────────────────
const PageLoader: React.FC = () => {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const alreadyLoaded =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem(SESSION_KEY) === 'true';

  const [show, setShow] = useState(!alreadyLoaded);

  useEffect(() => {
    if (!show) return;

    // Mark session so loader doesn't replay on navigation
    sessionStorage.setItem(SESSION_KEY, 'true');

    // After letter animation finishes, trigger exit
    const holdDuration = prefersReduced ? 200 : 1800;
    const timer = setTimeout(() => setShow(false), holdDuration);
    return () => clearTimeout(timer);
  }, [show, prefersReduced]);

  const usedOverlayVariants  = prefersReduced ? overlayExitReduced  : overlayExitVariants;
  const usedContainerVariants = prefersReduced ? reducedContainerVariants : containerVariants;
  const usedSplitFn           = prefersReduced ? splitTextReduced : splitText;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-loader"
          aria-live="polite"
          aria-label="Loading portfolio"
          variants={usedOverlayVariants}
          initial="initial"
          animate="initial"
          exit="exit"
          style={{
            position:        'fixed',
            inset:           0,
            zIndex:          10000,
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            justifyContent:  'center',
            background:      'var(--bg-base, #0e0e14)',
            overflow:        'hidden',
          }}
        >
          {/* Ambient glow blob */}
          <div
            aria-hidden="true"
            style={{
              position:     'absolute',
              top:          '40%',
              left:         '50%',
              transform:    'translate(-50%, -50%)',
              width:        '600px',
              height:       '600px',
              borderRadius: '50%',
              background:   'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
              filter:       'blur(40px)',
              pointerEvents:'none',
            }}
          />

          {/* Name text */}
          <motion.div
            variants={usedContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="page-loader-name"
            style={{
              display:        'flex',
              flexWrap:       'wrap',
              justifyContent: 'center',
              gap:            '0 2px',
              userSelect:     'none',
              lineHeight:     1,
            }}
          >
            {/* "Hrithik" */}
            <span style={{ display: 'inline-flex' }}>
              {usedSplitFn('Hrithik')}
            </span>

            {/* Space */}
            <span style={{ display: 'inline-block', width: '0.4em' }} />

            {/* "Raj" — slightly accented */}
            <span
              style={{
                display: 'inline-flex',
                background: 'linear-gradient(135deg, var(--accent-primary, #7c3aed), var(--accent-secondary, #06b6d4))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {usedSplitFn('Raj')}
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: prefersReduced ? 0 : 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop:      '1.5rem',
              fontSize:       'clamp(0.8rem, 1.5vw, 1rem)',
              letterSpacing:  '0.25em',
              textTransform:  'uppercase',
              color:          'var(--text-secondary, #a0a0c0)',
              fontFamily:     "'Lora', 'Georgia', 'Times New Roman', serif",
              fontWeight:     400,
            }}
          >
            Portfolio
          </motion.p>

          {/* Bottom progress bar */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: prefersReduced ? 0 : 0.4, duration: prefersReduced ? 0.1 : 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position:   'absolute',
              bottom:     0,
              left:       0,
              width:      '100%',
              height:     '2px',
              background: 'linear-gradient(90deg, var(--accent-primary, #7c3aed), var(--accent-secondary, #06b6d4))',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Inline style for the large name text (needs to be in the component)
// Added as a style tag injection via useEffect to avoid SCSS dependency
const NameStyle: React.FC = () => {
  useEffect(() => {
    const styleId = 'page-loader-name-style';
    if (document.getElementById(styleId)) return;
    const el = document.createElement('style');
    el.id = styleId;
    el.textContent = `
      .page-loader-name {
        font-family: 'Lora', 'Georgia', 'Times New Roman', serif;
        font-weight: 700;
        font-size: clamp(2.5rem, 8vw, 6rem);
        letter-spacing: -0.03em;
        color: var(--text-primary, #f0f0ff);
        line-height: 1;
      }
    `;
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, []);
  return null;
};

// Wrap both together for a clean export
const PageLoaderWithStyle: React.FC = () => (
  <>
    <NameStyle />
    <PageLoader />
  </>
);

export default PageLoaderWithStyle;
