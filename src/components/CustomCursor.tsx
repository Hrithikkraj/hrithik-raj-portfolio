import React, { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor
 *
 * A premium dual-layer cursor:
 * - Small dot: tracks mouse exactly (no lag)
 * - Larger ring: follows with spring easing (slight lag)
 *
 * Enlarges + color-shifts when hovering over:
 *   a, button, [role="button"], .cursor-hover
 *
 * Only renders on pointer:fine devices (excludes touch screens).
 * Hidden by default via CSS cursor:none on :root.
 */

const SPRING_CONFIG = { damping: 25, stiffness: 300, mass: 0.5 };
const RING_SPRING   = { damping: 20, stiffness: 200, mass: 0.8 };

const CustomCursor: React.FC = () => {
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isHovering, setIsHovering]       = useState(false);

  // Raw mouse position (dot follows exactly)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring-lagged position for the ring
  const ringX = useSpring(mouseX, RING_SPRING);
  const ringY = useSpring(mouseY, RING_SPRING);

  // Spring-animated scale for the ring
  const ringScale = useSpring(1, SPRING_CONFIG);

  // Check for pointer:fine (non-touch) — runs once on mount
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsPointerFine(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  // Hover detection — delegate via event bubbling
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    const isInteractive = target.closest('a, button, [role="button"], .cursor-hover');
    setIsHovering(!!isInteractive);
    ringScale.set(isInteractive ? 2.2 : 1);
  }, [ringScale]);

  const handleMouseOut = useCallback(() => {
    setIsHovering(false);
    ringScale.set(1);
  }, [ringScale]);

  useEffect(() => {
    if (!isPointerFine) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout',  handleMouseOut);

    // Hide default system cursor
    document.documentElement.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout',  handleMouseOut);
      document.documentElement.style.cursor = '';
    };
  }, [isPointerFine, handleMouseMove, handleMouseOver, handleMouseOut]);

  if (!isPointerFine) return null;

  return (
    <>
      {/* ── Ring (spring-lagged) ─────────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position:   'fixed',
          top:        0,
          left:       0,
          x:          ringX,
          y:          ringY,
          translateX: '-50%',
          translateY: '-50%',
          scale:      ringScale,
          zIndex:     'var(--z-cursor)' as any,
          pointerEvents: 'none',
          width:  28,
          height: 28,
          borderRadius: '50%',
          border: `1.5px solid ${isHovering ? 'var(--accent-secondary)' : 'var(--accent-primary)'}`,
          backgroundColor: isHovering
            ? 'var(--accent-secondary-subtle)'
            : 'transparent',
          backdropFilter: 'blur(2px)',
          transition: 'border-color 200ms var(--ease-smooth), background-color 200ms var(--ease-smooth)',
          mixBlendMode: 'normal',
        }}
      />

      {/* ── Dot (exact position) ─────────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position:   'fixed',
          top:        0,
          left:       0,
          x:          mouseX,
          y:          mouseY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex:     'var(--z-cursor)' as any,
          pointerEvents: 'none',
          width:  6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: isHovering
            ? 'var(--accent-secondary)'
            : 'var(--accent-primary)',
          transition: 'background-color 150ms var(--ease-smooth)',
          boxShadow: isHovering
            ? '0 0 8px var(--accent-secondary)'
            : '0 0 6px var(--accent-primary)',
        }}
      />
    </>
  );
};

export default CustomCursor;
