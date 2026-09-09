import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import smartSkincare from '../assets/images/smart-skincare.png';
import signLanguage from '../assets/images/real-time-sign-language.png';
import networkAnalysis from '../assets/images/network-analysis.jpg';
import disasterSystem from '../assets/images/nature-disaster-system.jpg';
import angryBird from '../assets/images/angrybird.jpg';
import networkRouting from '../assets/images/network-routing.jpg';
import ProjectModal, { ProjectData } from './ProjectModal';
import '../assets/styles/Project.scss';

// ── Project data ──────────────────────────────────────────────────────────────
const PROJECTS: ProjectData[] = [
  {
    id: 'smart-skincare',
    title: 'Smart Skincare Analysis & Recommendation Platform',
    image: smartSkincare,
    date: 'Jan 2026 – Apr 2026',
    description:
      'Built a full-stack web application using FastAPI for real-time skin analysis, integrating ResNet50 and EfficientNet-B3 models. Engineered a personalized recommendation engine that reduced bad product matches by 95%.',
    githubUrl: 'https://github.com/Hrithikkraj/Derma-AI---Skin-analysis',
    techTags: ['Python', 'FastAPI', 'PyTorch', 'ResNet50', 'EfficientNet-B3', 'React'],
  },
  {
    id: 'sign-language',
    title: 'Real-Time Sign Language Interpreter',
    image: signLanguage,
    date: 'Jan 2026 – Apr 2026',
    description:
      'Engineered a gesture recognition system featuring 3 interpreter modes and deployed 40+ models using MediaPipe and scikit-learn for voice output synthesis.',
    githubUrl: 'https://github.com/Hrithikkraj/Real-time-sign-language-interpreter',
    techTags: ['Python', 'MediaPipe', 'scikit-learn', 'OpenCV', 'TTS'],
  },
  {
    id: 'network-analysis',
    title: 'Network Analysis & Link Prediction',
    image: networkAnalysis,
    date: 'Jan 2026 – Apr 2026',
    description:
      'Benchmarked 5 link prediction algorithms (Adamic Adar, Resource Allocation) across 3 network topologies. Evaluated a 2,900+ edge Wikipedia voting network, achieving 0.79 ROC AUC and 56% Precision@K.',
    githubUrl: 'https://github.com/Hrithikkraj/Network-analysis-link-prediction',
    techTags: ['Python', 'NetworkX', 'scikit-learn', 'Graph ML', 'Jupyter'],
  },
  {
    id: 'disaster-system',
    title: 'Natural Disaster Management System',
    image: disasterSystem,
    date: 'Jan 2025 – Apr 2025',
    description:
      'Designed a normalized PostgreSQL DBMS with 10+ entities and 7 RESTful API endpoints, reducing data redundancy by ~40%. Implemented 3 SQL triggers to enforce real-time business constraints.',
    githubUrl: 'https://github.com/DhimantKaul100/DBMS-PROJECT-2025',
    techTags: ['PostgreSQL', 'Node.js', 'REST API', 'SQL Triggers', 'Express'],
  },
  {
    id: 'angry-birds',
    title: '2D Angry Birds Game Implementation',
    image: angryBird,
    date: 'Sep 2024 – Nov 2024',
    description:
      'Developed a 2D game in Java using LibGDX with OOP-based physics, collision detection, and level management. Designed custom vector assets in Adobe Illustrator, optimizing rendering across 2D resolutions.',
    githubUrl: 'https://github.com/rwt04/AngryBirds',
    techTags: ['Java', 'LibGDX', 'OOP', 'Physics Engine', 'Adobe Illustrator'],
  },
  {
    id: 'network-routing',
    title: 'Network Protocol & Routing Simulator',
    image: networkRouting,
    date: 'Sep 2025 – Nov 2025',
    description:
      'Built Echo services, broadcast messaging, and packet transfer with ACK/timeout mechanisms. Simulated Link State and Distance Vector routing protocols alongside a multi-threaded chat server.',
    githubUrl: 'https://github.com/Hrithikkraj/Network-protocol-routing',
    techTags: ['Java', 'Sockets', 'Multithreading', 'Link State', 'Distance Vector'],
  },
];

// ── Detect touch / fine-pointer device ───────────────────────────────────────
const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

// ── Detect reduced-motion preference ─────────────────────────────────────────
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────────────────────────────────────────
// 3D Card Component
// ─────────────────────────────────────────────────────────────────────────────
interface ProjectCardProps {
  project: ProjectData;
  index: number;
  onClick: (p: ProjectData) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onClick }) => {
  const cardRef   = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const reduced   = prefersReducedMotion();
  const fine      = hasFinePointer();

  // ── Raw mouse position over card (0-1) ────────────────────────────────────
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // ── Derived rotations ─────────────────────────────────────────────────────
  const rotateY = useTransform(mouseX, [0, 1], reduced ? [0, 0] : [-14, 14]);
  const rotateX = useTransform(mouseY, [0, 1], reduced ? [0, 0] : [10, -10]);

  // ── Glare position ────────────────────────────────────────────────────────
  const glareX  = useTransform(mouseX, [0, 1], ['0%', '100%']);
  const glareY  = useTransform(mouseY, [0, 1], ['0%', '100%']);

  // ── Mouse tracking ────────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !fine) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width);
    mouseY.set((e.clientY - top) / height);
  }, [fine, mouseX, mouseY]);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
    if (!reduced) {
      mouseX.set(0.5);
      mouseY.set(0.5);
    }
  }, [reduced, mouseX, mouseY]);

  // ── Card entrance variants ────────────────────────────────────────────────
  const cardVariants = {
    hidden:  { opacity: 0, y: 60, scale: 0.94 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className="proj-card-wrap"
      variants={cardVariants}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(project)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(project); } }}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.title}`}
      style={{ perspective: 900 }}
    >
      {/* ── 3D inner card ──────────────────────────────────────────────── */}
      <motion.div
        className="proj-card"
        style={{
          rotateX: fine ? rotateX : 0,
          rotateY: fine ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      >
        {/* Image layer — translateZ creates depth */}
        <div className="proj-card__image-layer" style={{ transform: 'translateZ(0px)' }}>
          <motion.img
            layoutId={`project-image-${project.id}`}
            src={project.image}
            alt={project.title}
            className="proj-card__img"
            style={{
              scale: hovered ? 1.06 : 1,
              transition: 'scale 0.55s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
          {/* Gradient overlay */}
          <div className="proj-card__gradient" aria-hidden="true" />
        </div>

        {/* ── Glare sweep ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {hovered && fine && !reduced && (
            <motion.div
              className="proj-card__glare"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: `radial-gradient(ellipse 60% 50% at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.18) 0%, transparent 70%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Content layer — floats above image ──────────────────────── */}
        <div className="proj-card__content" style={{ transform: 'translateZ(40px)' }}>
          <motion.h2
            layoutId={`project-title-${project.id}`}
            className="proj-card__title"
          >
            {project.title}
          </motion.h2>
          <p className="proj-card__date">{project.date}</p>

          {/* Tech tags — visible on hover */}
          <motion.div
            className="proj-card__tags"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            aria-label="Tech stack"
          >
            {project.techTags.slice(0, 4).map(tag => (
              <span key={tag} className="proj-card__tag">{tag}</span>
            ))}
          </motion.div>

          {/* Expand hint */}
          <motion.div
            className="proj-card__hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            aria-hidden="true"
          >
            Click to expand ↗
          </motion.div>
        </div>

        {/* GitHub corner link */}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="proj-card__github"
          aria-label={`Open ${project.title} on GitHub`}
          onClick={e => e.stopPropagation()}
          style={{ transform: 'translateZ(50px)' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Project Section
// ─────────────────────────────────────────────────────────────────────────────
function Project() {
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  const containerVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <>
      <section className="projects-section" id="projects">
        {/* Section heading */}
        <motion.div
          className="projects-heading-wrap"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="projects-heading">Personal Projects</h1>
          <p className="projects-sub">
            Hover to explore · click to expand · visit GitHub for source
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="projects-grid-new"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={setActiveProject}
            />
          ))}
        </motion.div>
      </section>

      {/* Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
}

export default Project;
