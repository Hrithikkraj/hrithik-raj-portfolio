import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faGraduationCap, faUsers } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss';

gsap.registerPlugin(ScrollTrigger);

function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // If reduced motion is preferred, immediately show final state without scroll animations
    if (prefersReduced) {
      if (progressLineRef.current) {
        progressLineRef.current.style.height = '100%';
      }
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Central progress line drawing animation linked to timeline scroll
      if (progressLineRef.current && containerRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              end: "bottom 85%",
              scrub: 0.6,
            },
          }
        );
      }

      // 2. Per-element reveal animation (fade + slide-in from respective side + icon pop)
      const elements = containerRef.current?.querySelectorAll<HTMLElement>('.vertical-timeline-element');
      if (!elements || elements.length === 0) return;

      const isDesktop = window.innerWidth >= 1170;

      elements.forEach((el, index) => {
        const content = el.querySelector<HTMLElement>('.vertical-timeline-element-content');
        const icon = el.querySelector<HTMLElement>('.vertical-timeline-element-icon');

        // On desktop (> 1170px), elements alternate left (0, 2, 4) and right (1, 3, 5).
        // On mobile (< 1170px), all elements sit on the right of the vertical line.
        const isLeft = isDesktop && index % 2 === 0;
        const startX = isLeft ? -70 : 70;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => {
              if (icon) {
                icon.classList.add('is-active-pulse');
              }
            },
          },
        });

        if (content) {
          tl.fromTo(
            content,
            { opacity: 0, x: startX, scale: 0.92 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.75,
              ease: "power2.out",
            }
          );
        }

        if (icon) {
          tl.fromTo(
            icon,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.55,
              ease: "back.out(2.2)",
            },
            "-=0.4"
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="history">
      <div className="items-container">
        <h1>Career History</h1>
        <div className="timeline-outer-wrapper" ref={containerRef}>
          {/* Animated Glowing Progress Line */}
          <div className="timeline-progress-line" ref={progressLineRef} aria-hidden="true" />

          <VerticalTimeline animate={false}>
            {/* Work Experience 1 */}
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              iconClassName="cursor-hover"
              date="Aug 2025 – Nov 2025"
              iconStyle={{ background: '#7c3aed', color: 'white' }}
              icon={<FontAwesomeIcon icon={faBriefcase} />}
            >
              <h3 className="vertical-timeline-element-title">Research Assistant / Developer</h3>
              <h4 className="vertical-timeline-element-subtitle">Metadata Extractor – IIIT Delhi</h4>
              <p>
                Research experience focused on metadata extraction systems, data pipeline design, and structured information retrieval at IIIT Delhi.
              </p>
            </VerticalTimelineElement>

            {/* Work Experience 2 */}
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              iconClassName="cursor-hover"
              date="Jun 2024 – Aug 2024"
              iconStyle={{ background: '#7c3aed', color: 'white' }}
              icon={<FontAwesomeIcon icon={faBriefcase} />}
            >
              <h3 className="vertical-timeline-element-title">Frontend Development Intern</h3>
              <h4 className="vertical-timeline-element-subtitle">Wayspire Ed Tech Training</h4>
              <p>
                Industrial training internship focused on frontend development — built responsive UI components and improved user experience for the ed-tech platform.
              </p>
            </VerticalTimelineElement>

            {/* Education */}
            <VerticalTimelineElement
              className="vertical-timeline-element--education"
              iconClassName="cursor-hover"
              date="2023 – 2027 (Expected)"
              iconStyle={{ background: '#06b6d4', color: 'white' }}
              icon={<FontAwesomeIcon icon={faGraduationCap} />}
            >
              <h3 className="vertical-timeline-element-title">B.Tech in Computer Science and Design</h3>
              <h4 className="vertical-timeline-element-subtitle">IIIT Delhi (Indraprastha Institute of Information Technology)</h4>
              <p>
                Pursuing a B.Tech combining core CS fundamentals — algorithms, systems programming, databases, networking — with design thinking, UI/UX, and human-computer interaction.
              </p>
            </VerticalTimelineElement>

            {/* Campus Leadership 1 */}
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              iconClassName="cursor-hover"
              date="Jan 2025 – Present"
              iconStyle={{ background: '#0891b2', color: 'white' }}
              icon={<FontAwesomeIcon icon={faUsers} />}
            >
              <h3 className="vertical-timeline-element-title">Photography Lead</h3>
              <h4 className="vertical-timeline-element-subtitle">Roamsrover – IIIT Delhi</h4>
              <p>
                Leading photography initiatives, capturing campus events, and managing visual content for the Roamsrover community at IIIT Delhi.
              </p>
            </VerticalTimelineElement>

            {/* Campus Leadership 2 */}
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              iconClassName="cursor-hover"
              date="Aug 2025 – Present"
              iconStyle={{ background: '#0891b2', color: 'white' }}
              icon={<FontAwesomeIcon icon={faUsers} />}
            >
              <h3 className="vertical-timeline-element-title">Coverage Member</h3>
              <h4 className="vertical-timeline-element-subtitle">E-Cell – IIIT Delhi</h4>
              <p>
                Active coverage member of the Entrepreneurship Cell at IIIT Delhi, contributing to event coverage, documentation, and outreach activities.
              </p>
            </VerticalTimelineElement>

            {/* Campus Leadership 3 */}
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              iconClassName="cursor-hover"
              date="Jan 2025 – Present"
              iconStyle={{ background: '#0891b2', color: 'white' }}
              icon={<FontAwesomeIcon icon={faUsers} />}
            >
              <h3 className="vertical-timeline-element-title">Core Community Member</h3>
              <h4 className="vertical-timeline-element-subtitle">Geek Room Delta (GFGs) – IIIT Delhi</h4>
              <p>
                Core member of the GeeksForGeeks community chapter at IIIT Delhi — contributing to coding events, peer learning sessions, and technical community building.
              </p>
            </VerticalTimelineElement>
          </VerticalTimeline>
        </div>
      </div>
    </div>
  );
}

export default Timeline;