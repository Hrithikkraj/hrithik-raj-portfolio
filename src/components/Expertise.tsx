import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import Tilt from "react-parallax-tilt";
import '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faFigma, faGitAlt } from '@fortawesome/free-brands-svg-icons';
import Chip from '@mui/material/Chip';
import '../assets/styles/Expertise.scss';

const labelsFirst = [
    "Python",
    "Java",
    "C++",
    "FastAPI",
    "LibGDX",
    "pthreads",
    "RISC-V",
    "OOP",
    "DSA",
    "Operating Systems",
];

const labelsSecond = [
    "PostgreSQL",
    "MySQL",
    "REST APIs",
    "MediaPipe",
    "scikit-learn",
    "ResNet50",
    "EfficientNet-B3",
    "Graph Analytics",
    "Data Pipelines",
    "JSON",
];

const labelsThird = [
    "Figma",
    "Adobe Illustrator",
    "Linux",
    "Git",
    "Miro",
    "VS Code",
    "Frontend Dev",
    "Socket Programming",
    "Link State Routing",
    "Distance Vector",
];

// ── Motion Animation Variants ──────────────────────────────────
const headingVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const chipsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.25,
    },
  },
};

const chipVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -12,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ── Reduced Motion Variants ────────────────────────────────────
const reducedContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

const reducedCardVariants: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const reducedChipVariants: Variants = {
  hidden: { opacity: 1, x: 0 },
  visible: { opacity: 1, x: 0 },
};

function Expertise() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect fine pointer (desktop mouse vs touch)
    const pointerQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(pointerQuery.matches);
    const pointerHandler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    pointerQuery.addEventListener('change', pointerHandler);

    // Detect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    return () => {
      pointerQuery.removeEventListener('change', pointerHandler);
      motionQuery.removeEventListener('change', motionHandler);
    };
  }, []);

  const activeHeadingVariants = reducedMotion ? reducedCardVariants : headingVariants;
  const activeGridVariants = reducedMotion ? reducedContainerVariants : cardsContainerVariants;
  const activeCardVariants = reducedMotion ? reducedCardVariants : cardVariants;
  const activeChipsVariants = reducedMotion ? reducedContainerVariants : chipsContainerVariants;
  const activeChipItemVariants = reducedMotion ? reducedChipVariants : chipVariants;

  return (
    <div className="container" id="expertise">
      {/* ── Soft Animated Gradient Blobs ──────────────────────── */}
      <div className="expertise-bg-blobs" aria-hidden="true">
        <div className="blob-1" />
        <div className="blob-2" />
      </div>

      <div className="skills-container">
        {/* ── Heading Entrance Animation ──────────────────────── */}
        <motion.h1
          className="expertise-heading"
          variants={activeHeadingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Expertise
        </motion.h1>

        {/* ── Staggered Cards Grid ────────────────────────────── */}
        <motion.div
          className="skills-grid"
          variants={activeGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {/* Card 1 */}
          <motion.div variants={activeCardVariants}>
            <Tilt
              tiltMaxAngleX={12}
              tiltMaxAngleY={12}
              perspective={1000}
              scale={1.02}
              transitionSpeed={1000}
              glareEnable={true}
              glareMaxOpacity={0.14}
              glareColor="#ffffff"
              glarePosition="all"
              glareBorderRadius="18px"
              tiltEnable={isFinePointer && !reducedMotion}
              className="skill-tilt-card"
            >
              <div className="skill">
                <motion.div
                  className="skill-icon-wrapper"
                  whileHover={reducedMotion ? undefined : { scale: 1.15, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 16 }}
                >
                  <FontAwesomeIcon icon={faPython} size="3x" />
                </motion.div>
                <h3>Software Development & Systems Engineering</h3>
                <p>Experienced in building low-level system software, game engines, and assembly tools. Strong command of data structures, algorithms, and OS fundamentals with hands-on multi-threaded and IPC-based systems programming.</p>
                <div className="flex-chips">
                  <span className="chip-title">Tech stack:</span>
                  <motion.div
                    className="flex-chips-inner"
                    variants={activeChipsVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                  >
                    {labelsFirst.map((label, index) => (
                      <motion.div
                        key={index}
                        variants={activeChipItemVariants}
                        whileHover={reducedMotion ? undefined : { scale: 1.08, y: -2 }}
                        transition={{ type: "spring", stiffness: 420, damping: 18 }}
                        style={{ display: 'inline-block' }}
                      >
                        <Chip className="chip cursor-hover" label={label} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </Tilt>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={activeCardVariants}>
            <Tilt
              tiltMaxAngleX={12}
              tiltMaxAngleY={12}
              perspective={1000}
              scale={1.02}
              transitionSpeed={1000}
              glareEnable={true}
              glareMaxOpacity={0.14}
              glareColor="#ffffff"
              glarePosition="all"
              glareBorderRadius="18px"
              tiltEnable={isFinePointer && !reducedMotion}
              className="skill-tilt-card"
            >
              <div className="skill">
                <motion.div
                  className="skill-icon-wrapper"
                  whileHover={reducedMotion ? undefined : { scale: 1.15, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 16 }}
                >
                  <FontAwesomeIcon icon={faGitAlt} size="3x" />
                </motion.div>
                <h3>Data Engineering, ML & Analytics</h3>
                <p>Built end-to-end data pipelines, graph analytics systems, and computer vision models. Skilled in deep learning architectures, database normalization, and real-time gesture recognition using MediaPipe and ResNet50.</p>
                <div className="flex-chips">
                  <span className="chip-title">Tech stack:</span>
                  <motion.div
                    className="flex-chips-inner"
                    variants={activeChipsVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                  >
                    {labelsSecond.map((label, index) => (
                      <motion.div
                        key={index}
                        variants={activeChipItemVariants}
                        whileHover={reducedMotion ? undefined : { scale: 1.08, y: -2 }}
                        transition={{ type: "spring", stiffness: 420, damping: 18 }}
                        style={{ display: 'inline-block' }}
                      >
                        <Chip className="chip cursor-hover" label={label} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </Tilt>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={activeCardVariants}>
            <Tilt
              tiltMaxAngleX={12}
              tiltMaxAngleY={12}
              perspective={1000}
              scale={1.02}
              transitionSpeed={1000}
              glareEnable={true}
              glareMaxOpacity={0.14}
              glareColor="#ffffff"
              glarePosition="all"
              glareBorderRadius="18px"
              tiltEnable={isFinePointer && !reducedMotion}
              className="skill-tilt-card"
            >
              <div className="skill">
                <motion.div
                  className="skill-icon-wrapper"
                  whileHover={reducedMotion ? undefined : { scale: 1.15, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 16 }}
                >
                  <FontAwesomeIcon icon={faFigma} size="3x" />
                </motion.div>
                <h3>Networking, UI/UX & Web Development</h3>
                <p>Implemented socket-based chat servers, routing algorithms (Link State & Distance Vector), and responsive frontend applications. Skilled in UI wireframing, asset design, and rendering optimization using industry-standard design tools.</p>
                <div className="flex-chips">
                  <span className="chip-title">Tech stack:</span>
                  <motion.div
                    className="flex-chips-inner"
                    variants={activeChipsVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                  >
                    {labelsThird.map((label, index) => (
                      <motion.div
                        key={index}
                        variants={activeChipItemVariants}
                        whileHover={reducedMotion ? undefined : { scale: 1.08, y: -2 }}
                        transition={{ type: "spring", stiffness: 420, damping: 18 }}
                        style={{ display: 'inline-block' }}
                      >
                        <Chip className="chip cursor-hover" label={label} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </Tilt>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Expertise;