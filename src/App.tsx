import React, { lazy, Suspense, useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion } from 'framer-motion';
import Main from './components/Main';
import About from './components/About';
import Timeline from './components/Timeline';
import Expertise from './components/Expertise';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import FadeIn from './components/FadeIn';
import CustomCursor from './components/CustomCursor';
import PageLoader from './components/PageLoader';
import './index.scss';

const Project = lazy(() => import('./components/Project'));
const GitHubActivity = lazy(() => import('./components/Activity'));

const sectionIds = ['about', 'expertise', 'history', 'projects', 'achievements', 'github-activity', 'contact'];

const triggerHaptic = (duration: number) => {
    if ('vibrate' in navigator) navigator.vibrate(duration);
};

function App() {
    const [mode, setMode] = useState<string>('dark');
    const [themeTransitioning, setThemeTransitioning] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenisRef = useRef<Lenis | null>(null);
    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
    const themeTimerRef = useRef<number | null>(null);

    const handleModeChange = () => {
        setThemeTransitioning(!reducedMotion);
        setMode(previous => previous === 'dark' ? 'light' : 'dark');
        if (!reducedMotion) {
            if (themeTimerRef.current !== null) window.clearTimeout(themeTimerRef.current);
            themeTimerRef.current = window.setTimeout(() => setThemeTransitioning(false), 180);
        }
    };

    const scrollToElement = (element: HTMLElement) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        triggerHaptic(12);
    };

    // Mobile section snap is deliberately limited to clear, fast edge swipes.
    useEffect(() => {
        const touchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (!touchDevice) return;

        const handleTouchStart = (event: TouchEvent) => {
            const target = event.target as HTMLElement;
            if (target.closest('input, textarea, select, button, a, [role="dialog"], .pm-overlay')) return;
            const touch = event.changedTouches[0];
            touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: performance.now() };
        };

        const handleTouchEnd = (event: TouchEvent) => {
            const start = touchStartRef.current;
            touchStartRef.current = null;
            if (!start) return;

            const touch = event.changedTouches[0];
            const deltaY = touch.clientY - start.y;
            const deltaX = touch.clientX - start.x;
            const elapsed = performance.now() - start.time;
            if (elapsed > 550 || Math.abs(deltaY) < 100 || Math.abs(deltaY) < Math.abs(deltaX) * 1.25) return;

            if (reducedMotion) return;
            const sections = [document.querySelector<HTMLElement>('.about-section'), ...sectionIds.map(id => document.getElementById(id))]
                .filter((section): section is HTMLElement => section !== null);
            const currentIndex = sections.reduce((closest, section, index) => {
                const distance = Math.abs(section.getBoundingClientRect().top - window.innerHeight * 0.35);
                return distance < closest.distance ? { index, distance } : closest;
            }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
            const current = sections[currentIndex];
            if (!current) return;

            const atTop = window.scrollY <= current.offsetTop + 72;
            const atBottom = window.scrollY + window.innerHeight >= current.offsetTop + current.offsetHeight - 72;
            const targetIndex = deltaY < 0
                ? (atBottom ? currentIndex + 1 : -1)
                : (atTop ? currentIndex - 1 : -1);
            const target = sections[targetIndex];
            if (!target) return;

            scrollToElement(target);
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [reducedMotion]);

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > window.innerHeight * 0.75);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => () => {
        if (themeTimerRef.current !== null) window.clearTimeout(themeTimerRef.current);
    }, []);

    // ── Lenis smooth scroll setup ──────────────────────────
    useEffect(() => {
        // Respect prefers-reduced-motion — skip Lenis if user prefers no motion
        const prefersReduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReduced) {
            // Fall back to native instant scroll to top
            window.scrollTo({ top: 0, left: 0 });
            return;
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // Scroll to top smoothly on mount
        lenis.scrollTo(0, { immediate: true });

        // RAF loop
        let rafId: number;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return (
        <>
            {/* Custom cursor — renders above everything, pointer:fine only */}
            <CustomCursor />

            {/* Page load intro — shown once per session via sessionStorage */}
            <PageLoader />

            {/* ── Existing app shell (unchanged) ────────────── */}
            <div className={`main-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}${themeTransitioning ? ' theme-transitioning' : ''}`}>
                <Navigation parentToChild={{mode}} modeChange={handleModeChange}/>
                <FadeIn transitionDuration={700}>
                    <Main/>
                    <About/>
                    <Expertise/>
                    <Timeline/>
                    <Suspense fallback={<div className="section-loading-placeholder" aria-label="Loading projects" />}>
                        <Project/>
                    </Suspense>
                    <Achievements/>
                    <Suspense fallback={<div className="section-loading-placeholder" aria-label="Loading GitHub activity" />}>
                        <GitHubActivity/>
                    </Suspense>
                    <Contact/>
                </FadeIn>
                <Footer />

                <AnimatePresence>
                    {showBackToTop && (
                        <motion.button
                            type="button"
                            className="back-to-top cursor-hover"
                            aria-label="Back to top"
                            initial={{ opacity: 0, scale: 0.7, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.7, y: 12 }}
                            whileTap={reducedMotion ? undefined : { scale: 0.92 }}
                            transition={reducedMotion ? { duration: 0 } : undefined}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <span aria-hidden="true">↑</span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

export default App;
