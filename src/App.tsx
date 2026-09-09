import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import {
  Main,
  Timeline,
  Expertise,
  Project,
  Achievements,
  Contact,
  Navigation,
  Footer,
} from "./components";
import FadeIn from './components/FadeIn';
import CustomCursor from './components/CustomCursor';
import PageLoader from './components/PageLoader';
import './index.scss';

function App() {
    const [mode, setMode] = useState<string>('dark');
    const lenisRef = useRef<Lenis | null>(null);

    const handleModeChange = () => {
        if (mode === 'dark') {
            setMode('light');
        } else {
            setMode('dark');
        }
    };

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
            <div className={`main-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
                <Navigation parentToChild={{mode}} modeChange={handleModeChange}/>
                <FadeIn transitionDuration={700}>
                    <Main/>
                    <Expertise/>
                    <Timeline/>
                    <Project/>
                    <Achievements/>
                    <Contact/>
                </FadeIn>
                <Footer />
            </div>
        </>
    );
}

export default App;
