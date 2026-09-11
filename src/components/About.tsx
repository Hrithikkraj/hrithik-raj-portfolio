import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import '../assets/styles/About.scss';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const paragraphs = [
  "I'm a problem solver at heart, the kind of person who'd rather spend a weekend figuring out why something's broken than leave it alone. Currently in my 4th year of B.Tech, I've never been the type to specialize too early, I'd rather stay a generalist who's genuinely curious about everything software has to offer, front-end, back-end, or wherever AI is heading next.",
  "What keeps me going is the moment an idea turns into something that actually works. I like picking up new tools not because I have to, but because I enjoy the process of learning itself, it's less about mastering one thing and more about staying curious.",
  "Outside of code, I'm a bit of a movie person and lately I've gone down a rabbit hole learning about the history of television and how the medium evolved. I also spend a fair amount of time in story driven video games, probably for the same reason: I like a good narrative, whether it's on a screen or in a codebase.",
];

const funFacts = [
  { emoji: '🎓', label: '4th Year B.Tech' },
  { emoji: '🎬', label: 'TV History Enthusiast' },
  { emoji: '🎮', label: 'Story-Mode Gamer' },
  { emoji: '💡', label: 'Perpetual Learner' },
];

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const factsContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const noneVariants: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

function PuzzleCollage() {
  return (
    <svg
      className="about-me__svg"
      viewBox="0 0 360 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="about-grad-a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-primary)" />
          <stop offset="100%" stopColor="var(--accent-secondary)" />
        </linearGradient>
        <linearGradient id="about-grad-b" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-secondary-light)" />
          <stop offset="100%" stopColor="var(--accent-primary-light)" />
        </linearGradient>
        <filter id="about-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* Soft blurred orbs */}
      <circle className="about-me__orb about-me__orb--1" cx="92" cy="118" r="64" fill="var(--accent-primary)" />
      <circle className="about-me__orb about-me__orb--2" cx="268" cy="96" r="52" fill="var(--accent-secondary)" />
      <circle className="about-me__orb about-me__orb--3" cx="210" cy="262" r="70" fill="var(--accent-primary-light)" />

      {/* Interlocking geometric pieces */}
      <g className="about-me__piece about-me__piece--1" filter="url(#about-soft)">
        <path
          d="M86 86h78v28c0 14 12 26 26 26s26-12 26-26V86h28v78h-28c-14 0-26 12-26 26s12 26 26 26h28v28H86V86z"
          fill="url(#about-grad-a)"
          opacity="0.72"
        />
      </g>
      <g className="about-me__piece about-me__piece--2">
        <path
          d="M186 154h78v24c0 12 10 22 22 22s22-10 22-22v-24h24v78h-24c-12 0-22 10-22 22s10 22 22 22h24v24H186V154z"
          fill="url(#about-grad-b)"
          opacity="0.55"
        />
      </g>
      <g className="about-me__piece about-me__piece--3">
        <polygon
          points="78,228 138,198 198,228 198,288 138,318 78,288"
          fill="var(--accent-secondary)"
          opacity="0.38"
        />
      </g>
      <g className="about-me__piece about-me__piece--4">
        <rect
          x="236"
          y="48"
          width="72"
          height="72"
          rx="16"
          transform="rotate(18 272 84)"
          fill="var(--accent-primary-light)"
          opacity="0.42"
        />
      </g>
    </svg>
  );
}

function About() {
  const [reduced, setReduced] = useState(prefersReduced);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const section = reduced ? noneVariants : sectionVariants;
  const item = reduced ? noneVariants : itemVariants;
  const facts = reduced ? noneVariants : factsContainerVariants;
  const pill = reduced ? noneVariants : pillVariants;

  return (
    <section id="about" className="about-me" aria-labelledby="about-title">
      <motion.div
        className="about-me__inner"
        variants={section}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h1 id="about-title" className="about-me__heading" variants={item}>
          About Me
        </motion.h1>

        {paragraphs.map((text) => (
          <motion.p key={text.slice(0, 32)} className="about-me__bio" variants={item}>
            {text}
          </motion.p>
        ))}

        <motion.ul className="about-me__facts" variants={facts} aria-label="Fun facts">
          {funFacts.map((fact) => (
            <motion.li
              key={fact.label}
              className="about-me__pill cursor-hover"
              variants={pill}
              whileHover={reduced ? undefined : { scale: 1.05 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="about-me__pill-emoji" aria-hidden="true">
                {fact.emoji}
              </span>
              <span className="about-me__pill-label">{fact.label}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div className="about-me__visual" variants={item} aria-hidden="true">
          <PuzzleCollage />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default About;
