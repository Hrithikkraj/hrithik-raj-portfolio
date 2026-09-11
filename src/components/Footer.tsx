import React from "react";
import { motion } from 'framer-motion';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import '../assets/styles/Footer.scss';

const contactEmail = 'hrithk23245@iiitd.ac.in';

const navigationLinks: [string, string][] = [
  ['About', 'about'],
  ['Expertise', 'expertise'],
  ['History', 'history'],
  ['Projects', 'projects'],
  ['Achievements', 'achievements'],
  ['Activity', 'github-activity'],
  ['Contact', 'contact'],
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Hrithikkraj', icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hrithikkraj/', icon: LinkedInIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/hrithikkraj/', icon: InstagramIcon },
  { label: 'LeetCode', href: 'https://leetcode.com/u/Hrithikk_Raj/', icon: CodeIcon },
  { label: 'Codeforces', href: 'https://codeforces.com/profile/hrithikiiitd', icon: EmojiEventsIcon },
];

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Footer() {
  const motionEnabled = !reducedMotion();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <motion.div
        className="footer-main"
        initial={motionEnabled ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: motionEnabled ? 0.6 : 0 }}
      >
        <div className="footer-intro">
          <h2>
            <span>Let's</span>{' '}
            <strong className="accent-text">Talk</strong>
          </h2>
          <p>
            Feel free to reach out anytime — I'm always open to connecting, collaborating, or just talking about interesting problems.
          </p>
          <motion.a
            className="footer-email-button cursor-hover"
            href={`mailto:${contactEmail}`}
            whileHover={motionEnabled ? { scale: 1.04 } : undefined}
            whileTap={motionEnabled ? { scale: 0.97 } : undefined}
          >
            <MailOutlineIcon fontSize="small" />
            <span>{contactEmail}</span>
          </motion.a>
        </div>

        <div className="footer-links-area">
          <div className="footer-link-group">
            <h3>Navigate</h3>
            <nav aria-label="Footer navigation">
              {navigationLinks.map(([label, id]) => (
                <button
                  key={id}
                  type="button"
                  className="footer-link cursor-hover"
                  onClick={() => scrollToSection(id)}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="footer-link-group">
            <h3>Connect</h3>
            <nav aria-label="Social links">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  className="footer-link footer-social-link cursor-hover"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon fontSize="small" />
                  <span>{label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </motion.div>

      <div className="footer-divider" />
      <div className="footer-bottom">
        <p>© 2026 Hrithik Raj. All Rights Reserved.</p>
        <p>Built with React, Three.js &amp; a lot of curiosity</p>
      </div>
    </footer>
  );
}

export default Footer;