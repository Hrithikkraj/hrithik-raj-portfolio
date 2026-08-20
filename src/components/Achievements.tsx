import React, { useEffect, useRef, useState } from 'react';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SchoolIcon from '@mui/icons-material/School';
import '../assets/styles/Achievements.scss';

interface Achievement {
  title: string;
  category: string;
  description: string;
  year?: string;
  icon: React.ElementType;
  featured?: boolean;
}

const achievements: Achievement[] = [
  {
    title: 'Top 75 Finalist — Code with Cisco Hackathon 2026',
    category: 'Hackathon',
    description: 'Ranked among the Top 75 participants (Top 0.75%) in the Code with Cisco Hackathon 2026.',
    year: '2026',
    icon: EmojiEventsIcon,
    featured: true,
  },
  {
    title: 'GridLock Hackathon — Flipkart ML Challenge',
    category: 'AI / ML Hackathon',
    description: 'Qualified through Round 3 of the ML Challenge to compete in the GridLock Hackathon, a national hackathon organized by Flipkart for AI-powered traffic management solutions in Bengaluru.',
    icon: PsychologyIcon,
    featured: true,
  },
  {
    title: 'Gold & Bronze — Zonal Skating',
    category: 'Sports',
    description: 'Won Gold and Bronze medals at zonal-level skating competitions in New Delhi.',
    icon: MilitaryTechIcon,
  },
  {
    title: 'Qualified — V.V.M & ICT Olympiads',
    category: 'Olympiad',
    description: 'Qualified for both the V.V.M. Olympiad and ICT Olympiad.',
    icon: SchoolIcon,
  },
];

function AchievementCard({ achievement, index, isVisible }: { achievement: Achievement; index: number; isVisible: boolean }) {
  const Icon = achievement.icon;

  return (
    <article
      className={`achievement-card${achievement.featured ? ' achievement-card--featured' : ''}${isVisible ? ' is-visible' : ''}`}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
    >
      <div className="achievement-card__topline">
        <div className="achievement-card__icon" aria-hidden="true">
          <Icon />
        </div>
        {achievement.year && <span className="achievement-card__year">{achievement.year}</span>}
      </div>
      <p className="achievement-card__category">{achievement.category}</p>
      <h2>{achievement.title}</h2>
      <p className="achievement-card__description">{achievement.description}</p>
    </article>
  );
}

function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="achievements-container" id="achievements" ref={sectionRef} aria-labelledby="achievements-title">
      <div className="achievements-heading">
        <h1 id="achievements-title">Achievements</h1>
        <p>Recognition, competitions, and milestones</p>
      </div>
      <div className="achievements-grid">
        {achievements.map((achievement, index) => (
          <AchievementCard key={achievement.title} achievement={achievement} index={index} isVisible={isVisible} />
        ))}
      </div>
    </section>
  );
}

export default Achievements;
