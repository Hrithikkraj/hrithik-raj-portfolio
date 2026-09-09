import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

export interface ProjectData {
  id: string;
  title: string;
  image: string;
  date: string;
  description: string;
  githubUrl: string;
  techTags: string[];
}

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

const overlayVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
};

const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.9, y: 40 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 28, mass: 0.8 },
  },
  exit: {
    opacity: 0, scale: 0.9, y: 30,
    transition: { duration: 0.22 },
  },
};

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const modalRef  = useRef<HTMLDivElement>(null);
  const closeRef  = useRef<HTMLButtonElement>(null);

  // ── Lock body scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  // ── Keyboard: Esc to close + focus trap ──────────────────────────────────
  useEffect(() => {
    if (!project) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="pm-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Project details: ${project.title}`}
        >
          <motion.div
            ref={modalRef}
            className="pm-panel"
            layoutId={`project-card-${project.id}`}
            variants={modalVariants}
            onClick={e => e.stopPropagation()}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
          >
            <div className="pm-drag-handle" aria-hidden="true" />

            <button
              ref={closeRef}
              className="pm-close"
              onClick={onClose}
              aria-label="Close project details"
            >
              <span aria-hidden="true">&#x2715;</span>
            </button>

            <div className="pm-image-wrap">
              <motion.img
                layoutId={`project-image-${project.id}`}
                src={project.image}
                alt={project.title}
                className="pm-image"
              />
              <div className="pm-image-gradient" aria-hidden="true" />
            </div>

            <div className="pm-content">
              <motion.h2
                layoutId={`project-title-${project.id}`}
                className="pm-title"
              >
                {project.title}
              </motion.h2>

              <p className="pm-date">{project.date}</p>
              <p className="pm-description">{project.description}</p>

              <div className="pm-tags" aria-label="Technologies used">
                {project.techTags.map(tag => (
                  <span key={tag} className="pm-tag">{tag}</span>
                ))}
              </div>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="pm-cta"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" width="18" height="18">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
