import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, animate, type Variants } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SchoolIcon from '@mui/icons-material/School';
import '../assets/styles/Achievements.scss';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Achievement {
  title: string;
  category: string;
  description: string;
  year?: string;
  icon: React.ElementType;
  featured?: boolean;
  /** 'competitive' enables the particle burst on icon hover */
  competitive?: boolean;
}

// ─── Data (unchanged) ────────────────────────────────────────────────────────
const achievements: Achievement[] = [
  {
    title: 'Top 75 Finalist — Code with Cisco Hackathon 2026',
    category: 'Hackathon',
    description: 'Ranked among the Top 75 participants (Top 0.75%) in the Code with Cisco Hackathon 2026.',
    year: '2026',
    icon: EmojiEventsIcon,
    featured: true,
    competitive: true,
  },
  {
    title: 'GridLock Hackathon — Flipkart ML Challenge',
    category: 'AI / ML Hackathon',
    description:
      'Qualified through Round 3 of the ML Challenge to compete in the GridLock Hackathon, a national hackathon organized by Flipkart for AI-powered traffic management solutions in Bengaluru.',
    icon: PsychologyIcon,
    featured: true,
    competitive: true,
  },
  {
    title: 'Gold & Bronze — Zonal Skating',
    category: 'Sports',
    description: 'Won Gold and Bronze medals at zonal-level skating competitions in New Delhi.',
    icon: MilitaryTechIcon,
    competitive: true,
  },
  {
    title: 'Qualified — V.V.M & ICT Olympiads',
    category: 'Olympiad',
    description: 'Qualified for both the V.V.M. Olympiad and ICT Olympiad.',
    icon: SchoolIcon,
  },
];

// ─── Reduced-motion helper ───────────────────────────────────────────────────
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Animated count-up number ────────────────────────────────────────────────
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(prefersReduced() ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (prefersReduced()) { setDisplay(to); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          animate(motionVal, to, {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            onUpdate: v => setDisplay(Math.round(v)),
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, motionVal]);

  return (
    <span ref={ref} className="stat-num">
      {display}{suffix}
    </span>
  );
}

// ─── Particle burst (competitive icon hover) ─────────────────────────────────
const PARTICLE_ANGLES = [0, 72, 144, 216, 288]; // evenly spread

function ParticleBurst({ active }: { active: boolean }) {
  if (prefersReduced() || !active) return null;
  return (
    <div className="particle-host" aria-hidden="true">
      {PARTICLE_ANGLES.map((angle, i) => (
        <motion.span
          key={i}
          className="particle"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={
            active
              ? {
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.6],
                  x: Math.cos((angle * Math.PI) / 180) * 26,
                  y: Math.sin((angle * Math.PI) / 180) * 26,
                }
              : { opacity: 0, scale: 0, x: 0, y: 0 }
          }
          transition={{ duration: 0.55, delay: i * 0.04, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// ─── Card variants ───────────────────────────────────────────────────────────
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.93 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4, y: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 420, damping: 18, delay: 0.45 },
  },
};

// ─── Achievement Card ─────────────────────────────────────────────────────────
function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const Icon = achievement.icon;
  const [iconHovered, setIconHovered] = useState(false);
  const reduced = prefersReduced();

  return (
    <motion.article
      className={`achievement-card${achievement.featured ? ' achievement-card--featured' : ''}`}
      variants={cardVariants}
      custom={index}
      whileHover={reduced ? {} : { y: -5, transition: { duration: 0.3, ease: 'easeOut' } }}
      aria-label={achievement.title}
    >
      {/* ── Featured badge ─────────────────────────────────────────────── */}
      {achievement.featured && (
        <motion.div
          className="achievement-card__featured-badge"
          variants={badgeVariants}
          aria-label="Featured achievement"
        >
          ★ Featured
        </motion.div>
      )}

      {/* ── Top line ───────────────────────────────────────────────────── */}
      <div className="achievement-card__topline">
        {/* Icon with particle burst */}
        <div
          className="achievement-card__icon-wrap"
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
        >
          <motion.div
            className="achievement-card__icon"
            animate={
              iconHovered && !reduced
                ? { scale: [1, 1.18, 1], transition: { type: 'spring' as const, stiffness: 400, damping: 12 } }
                : { scale: 1 }
            }
            aria-hidden="true"
          >
            <Icon />
          </motion.div>

          {/* Particle burst for competitive achievements */}
          {achievement.competitive && <ParticleBurst active={iconHovered} />}
        </div>

        {achievement.year && (
          <span className="achievement-card__year">{achievement.year}</span>
        )}
      </div>

      <p className="achievement-card__category">{achievement.category}</p>
      <h2>{achievement.title}</h2>
      <p className="achievement-card__description">{achievement.description}</p>
    </motion.article>
  );
}

// ─── Stat strip ──────────────────────────────────────────────────────────────
// Computed from achievements array — no hardcoded numbers
function StatStrip() {
  const hackathons   = achievements.filter(a => a.category.toLowerCase().includes('hackathon')).length;
  const competitive  = achievements.filter(a => a.competitive).length;
  const recognitions = achievements.filter(a => a.featured).length;

  const stats = [
    { label: 'Hackathons',    value: hackathons,   suffix: '' },
    { label: 'Competitions',  value: competitive,  suffix: '+' },
    { label: 'Recognitions',  value: recognitions, suffix: '' },
  ];

  return (
    <motion.div
      className="achievements-stats"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {stats.map(({ label, value, suffix }) => (
        <div key={label} className="achievements-stats__item">
          <CountUp to={value} suffix={suffix} />
          <span className="stat-label">{label}</span>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
function Achievements() {
  return (
    <section
      className="achievements-container"
      id="achievements"
      aria-labelledby="achievements-title"
    >
      {/* Heading */}
      <motion.div
        className="achievements-heading"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        <h1 id="achievements-title">Achievements</h1>
        <p>Recognition, competitions, and milestones</p>
      </motion.div>

      {/* Stat strip */}
      <StatStrip />

      {/* Grid */}
      <motion.div
        className="achievements-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {achievements.map((achievement, index) => (
          <AchievementCard key={achievement.title} achievement={achievement} index={index} />
        ))}
      </motion.div>
    </section>
  );
}

export default Achievements;
