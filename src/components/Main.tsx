import React, { useState, useEffect, Suspense, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Tilt from "react-parallax-tilt";
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';
import profilePic from '../assets/images/profile.jpeg';

// Lazy-load the 3D HeroScene for fast initial paint
const HeroScene = React.lazy(() => import('./HeroScene'));

export interface MainProps {
  mode?: 'dark' | 'light';
}

// ── Motion Variants ───────────────────────────────────────────
const nameContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const titleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.65,
    },
  },
};

const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(6px)',
  },
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

const socialContainerVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function Main({ mode }: MainProps) {
  const [currentMode, setCurrentMode] = useState<'dark' | 'light'>('dark');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Detect active mode (via prop or DOM observer)
  useEffect(() => {
    if (mode === 'dark' || mode === 'light') {
      setCurrentMode(mode);
      return;
    }
    const checkMode = () => {
      const isLight = !!document.querySelector('.light-mode');
      setCurrentMode(isLight ? 'light' : 'dark');
    };
    checkMode();
    const observer = new MutationObserver(checkMode);
    const container = document.querySelector('.main-container') || document.body;
    observer.observe(container, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [mode]);

  // Hide scroll indicator when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollClick = () => {
    const nextSection = document.getElementById('expertise') || document.querySelector('.skills-container');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  // Helper to split string into motion letter spans
  const renderAnimatedWord = useMemo(() => {
    return (word: string, isAccent = false) => (
      <span className={isAccent ? "accent-text" : undefined} style={{ display: 'inline-flex' }}>
        {word.split('').map((char, i) => (
          <motion.span
            key={i}
            variants={letterVariants}
            style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    );
  }, []);

  const socialLinks = (
    <>
      <a
        href="https://github.com/Hrithikkraj"
        target="_blank"
        rel="noreferrer"
        className="cursor-hover"
        aria-label="GitHub"
      >
        <GitHubIcon />
      </a>
      <a
        href="https://www.linkedin.com/in/hrithikkraj/"
        target="_blank"
        rel="noreferrer"
        className="cursor-hover"
        aria-label="LinkedIn"
      >
        <LinkedInIcon />
      </a>
      <a
        href="https://www.instagram.com/hrithikkraj/"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        title="Instagram"
        className="cursor-hover"
      >
        <InstagramIcon />
      </a>
      <a
        href="https://leetcode.com/u/Hrithikk_Raj/"
        target="_blank"
        rel="noreferrer"
        aria-label="LeetCode"
        title="LeetCode"
        className="cursor-hover"
      >
        <CodeIcon />
      </a>
      <a
        href="https://codeforces.com/profile/hrithikiiitd"
        target="_blank"
        rel="noreferrer"
        aria-label="Codeforces"
        title="Codeforces"
        className="cursor-hover"
      >
        <EmojiEventsIcon />
      </a>
    </>
  );

  return (
    <div className="container">
      <div className="about-section">
        {/* ── 3D Canvas Background Layer ────────────────────── */}
        <Suspense fallback={<div className="hero-3d-placeholder" aria-hidden="true" />}>
          <HeroScene mode={currentMode} />
        </Suspense>

        {/* ── Subtle Radial Gradient Overlay for Contrast ───── */}
        <div className="hero-radial-overlay" aria-hidden="true" />

        {/* ── Profile Image with Tilt & Entrance/Idle Animation ─ */}
        <motion.div
          className="image-wrapper"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [-3, 3, -3],
          }}
          transition={{
            opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <Tilt
            tiltMaxAngleX={9}
            tiltMaxAngleY={9}
            perspective={1000}
            scale={1.03}
            transitionSpeed={1200}
            glareEnable={true}
            glareMaxOpacity={0.18}
            glareColor="#ffffff"
            glarePosition="all"
            glareBorderRadius="50%"
            className="parallax-avatar-tilt cursor-hover"
          >
            <img src={profilePic} alt="Hrithik Raj" />
          </Tilt>
        </motion.div>

        {/* ── Hero Content ──────────────────────────────────── */}
        <div className="content">
          <motion.div
            className="social_icons"
            variants={socialContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {socialLinks}
          </motion.div>

          <motion.h1
            className="hero-name"
            variants={nameContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {renderAnimatedWord("Hrithik")}
            <span style={{ display: 'inline-block', width: '0.3em' }} />
            {renderAnimatedWord("Raj", true)}
          </motion.h1>

          <motion.p
            className="hero-title"
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {renderAnimatedWord("Software")}
            <span style={{ display: 'inline-block', width: '0.3em' }} />
            {renderAnimatedWord("Engineer")}
          </motion.p>

          <motion.div
            className="mobile_social_icons"
            variants={socialContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {socialLinks}
          </motion.div>
        </div>

        {/* ── Animated Scroll-Down Indicator ────────────────── */}
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.div
              className="scroll-indicator cursor-hover"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 0.85, y: 0 }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
              onClick={handleScrollClick}
              role="button"
              tabIndex={0}
              aria-label="Scroll to next section"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleScrollClick();
                }
              }}
            >
              <div className="mouse-frame">
                <motion.div
                  className="mouse-wheel"
                  animate={{ y: [0, 7, 0], opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <span className="scroll-hint">Scroll</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Main;