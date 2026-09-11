import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  PanInfo,
  Variants,
} from "framer-motion";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import '../assets/styles/Navigation.scss';

export interface NavigationProps {
  parentToChild: {
    mode: string;
  };
  modeChange: () => void;
}

const navItems: [string, string][] = [
  ['Expertise', 'expertise'],
  ['History', 'history'],
  ['Projects', 'projects'],
  ['Achievements', 'achievements'],
  ['Contact', 'contact'],
];

// Helper: Haptic feedback simulation (safely guarded)
const triggerHaptic = (duration = 12) => {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  } catch {
    // Graceful no-op on iOS or unsupported devices
  }
};

// ── Magnetic Button for Desktop Nav ────────────────────────────
interface MagneticButtonProps {
  label: string;
  sectionId: string;
  isActive: boolean;
  reducedMotion: boolean;
  onClick: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  label,
  sectionId,
  isActive,
  reducedMotion,
  onClick,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 260, damping: 18, mass: 0.1 });
  const springY = useSpring(rawY, { stiffness: 260, damping: 18, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxShift = 4;
    const deltaX = Math.max(-maxShift, Math.min(maxShift, (e.clientX - centerX) * 0.22));
    const deltaY = Math.max(-maxShift, Math.min(maxShift, (e.clientY - centerY) * 0.22));

    rawX.set(deltaX);
    rawY.set(deltaY);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <button
      ref={btnRef}
      className={`nav-link-btn cursor-hover ${isActive ? 'is-active' : ''}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      type="button"
      aria-current={isActive ? 'page' : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="active-nav-indicator"
          className="active-nav-indicator"
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 380, damping: 30 }
          }
        />
      )}
      <motion.span
        className="nav-btn-text"
        style={reducedMotion ? undefined : { x: springX, y: springY }}
      >
        {label}
      </motion.span>
    </button>
  );
};

// ── Main Navigation Component ──────────────────────────────────
function Navigation({ parentToChild, modeChange }: NavigationProps) {
  const { mode } = parentToChild;

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Detect scroll state for glass pill animation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const manualSelectionUntilRef = useRef<number>(0);

  // Cancel manual lock if user starts scrolling manually with wheel or touch
  useEffect(() => {
    const cancelManual = () => {
      manualSelectionUntilRef.current = 0;
    };
    window.addEventListener('wheel', cancelManual, { passive: true });
    window.addEventListener('touchmove', cancelManual, { passive: true });
    return () => {
      window.removeEventListener('wheel', cancelManual);
      window.removeEventListener('touchmove', cancelManual);
    };
  }, []);

  // Position-based scrollspy calculation with requestAnimationFrame throttling
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ACTIVATION_OFFSET = 140; // px below viewport top (clearance for floating navbar + margins)
    const BOTTOM_BUFFER = 40;     // px threshold to force-activate contact at page bottom

    let rafId: number | null = null;

    const updateActiveSection = () => {
      // If user recently clicked a nav button, honor the instant feedback override
      if (Date.now() < manualSelectionUntilRef.current) {
        return;
      }

      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = window.innerHeight;
      const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

      // 1. Special-case: very bottom of page -> force-activate last section ('contact')
      if (currentScroll + clientHeight >= scrollHeight - BOTTOM_BUFFER) {
        setActiveSection('contact');
        return;
      }

      // 2. Special-case: very top of page (Hero/About section)
      const firstSectionEl = document.getElementById(navItems[0][1]);
      if (currentScroll < 60 || (firstSectionEl && firstSectionEl.getBoundingClientRect().top > ACTIVATION_OFFSET)) {
        setActiveSection('');
        return;
      }

      // 3. Find section whose top has crossed the activation line with the largest top value
      let currentActive = '';
      let maxTop = -Infinity;

      for (const [, id] of navItems) {
        const el = document.getElementById(id);
        if (!el) continue;

        const top = el.getBoundingClientRect().top;
        if (top <= ACTIVATION_OFFSET && top > maxTop) {
          maxTop = top;
          currentActive = id;
        }
      }

      if (currentActive) {
        setActiveSection(currentActive);
      }
    };

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateActiveSection();
          rafId = null;
        });
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Initial check on mount
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Smooth scroll handler with instant active update
  const scrollToSection = useCallback((section: string) => {
    manualSelectionUntilRef.current = Date.now() + 850;
    setActiveSection(section);
    triggerHaptic(14);

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleDrawerToggle = () => {
    triggerHaptic(12);
    setMobileOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    triggerHaptic(10);
    setMobileOpen(false);
  };

  // Mobile drawer drag end handler
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // If swiped left by 60px or flicked left with velocity < -250
    if (info.offset.x < -60 || info.velocity.x < -250) {
      handleDrawerClose();
    }
  };

  // Mobile drawer item animation variants
  const drawerListVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const drawerItemVariants: Variants = {
    hidden: { opacity: 0, x: -24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <>
      <header className={`nav-wrapper ${scrolled ? 'nav-scrolled' : ''}`}>
        <motion.nav
          id="navigation"
          className={`nav-glass-bar ${scrolled ? 'is-scrolled' : ''}`}
          layout={!reducedMotion}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
          }
          aria-label="Main Navigation"
        >
          {/* Left Group: Mobile Hamburger, Brand Badge, Mode Toggle */}
          <div className="nav-left-group">
            <button
              type="button"
              className="mobile-menu-btn cursor-hover"
              onClick={handleDrawerToggle}
              aria-label="Open mobile menu"
            >
              <MenuIcon />
            </button>

            <span
              className="nav-brand-logo cursor-hover"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              aria-label="Scroll to top"
            >
              HR
            </span>

            <div className="mode-toggle-wrapper">
              <button
                type="button"
                className="mode-toggle-btn cursor-hover"
                onClick={() => {
                  triggerHaptic(12);
                  modeChange();
                }}
                aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mode === 'dark' ? (
                    <motion.span
                      key="dark-sun"
                      initial={reducedMotion ? false : { opacity: 0, rotate: -90, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={reducedMotion ? undefined : { opacity: 0, rotate: 90, scale: 0.6 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      style={{ display: 'inline-flex' }}
                    >
                      <LightModeIcon />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="light-moon"
                      initial={reducedMotion ? false : { opacity: 0, rotate: 90, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={reducedMotion ? undefined : { opacity: 0, rotate: -90, scale: 0.6 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      style={{ display: 'inline-flex' }}
                    >
                      <DarkModeIcon />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Desktop Nav Links with Shared Layout Indicator & Magnetic Hover */}
          <div className="nav-desktop-links" role="menubar">
            {navItems.map(([label, id]) => (
              <MagneticButton
                key={id}
                label={label}
                sectionId={id}
                isActive={activeSection === id}
                reducedMotion={reducedMotion}
                onClick={() => scrollToSection(id)}
              />
            ))}
          </div>
        </motion.nav>
      </header>

      {/* ── Custom Swipeable Mobile Drawer ───────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleDrawerClose}
              aria-hidden="true"
            />

            {/* Swipeable Drawer Panel */}
            <motion.aside
              className="mobile-drawer-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={
                reducedMotion
                  ? { duration: 0.15 }
                  : { type: "spring", damping: 28, stiffness: 280 }
              }
              drag="x"
              dragConstraints={{ left: -320, right: 0 }}
              dragElastic={0.08}
              onDragEnd={handleDragEnd}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              {/* Drag Handle on right edge for swipe affordance */}
              <div className="drawer-drag-handle" aria-hidden="true" />

              <div className="drawer-header">
                <h3 className="drawer-title">Navigation</h3>
                <button
                  type="button"
                  className="drawer-close-btn cursor-hover"
                  onClick={handleDrawerClose}
                  aria-label="Close menu"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>

              <motion.ul
                className="mobile-nav-list"
                variants={drawerListVariants}
                initial="hidden"
                animate="visible"
              >
                {navItems.map(([label, id]) => {
                  const isActive = activeSection === id;
                  return (
                    <motion.li
                      key={id}
                      variants={drawerItemVariants}
                      className={`mobile-nav-item cursor-hover ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        scrollToSection(id);
                        handleDrawerClose();
                      }}
                      role="menuitem"
                    >
                      <span className="item-label">{label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="mobile-active-dot"
                          className="active-dot"
                        />
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>

              <div className="drawer-footer">
                <span className="drawer-hint">Swipe left to close</span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
