import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faGraduationCap, faUsers } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss'

function Timeline() {
  return (
    <div id="history">
      <div className="items-container">
        <h1>Career History</h1>
        <VerticalTimeline>

          {/* Work Experience */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            contentArrowStyle={{ borderRight: '7px solid white' }}
            date="Aug 2025 – Nov 2025"
            iconStyle={{ background: '#5000ca', color: 'white' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Research Assistant / Developer</h3>
            <h4 className="vertical-timeline-element-subtitle">Metadata Extractor – IIIT Delhi</h4>
            <p>
              Research experience focused on metadata extraction systems, data pipeline design, and structured information retrieval at IIIT Delhi.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Jun 2024 – Aug 2024"
            iconStyle={{ background: '#5000ca', color: 'white' }}
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
            date="2023 – 2027 (Expected)"
            iconStyle={{ background: '#e91e63', color: 'white' }}
            icon={<FontAwesomeIcon icon={faGraduationCap} />}
          >
            <h3 className="vertical-timeline-element-title">B.Tech in Computer Science and Design</h3>
            <h4 className="vertical-timeline-element-subtitle">IIIT Delhi (Indraprastha Institute of Information Technology)</h4>
            <p>
              Pursuing a B.Tech combining core CS fundamentals — algorithms, systems programming, databases, networking — with design thinking, UI/UX, and human-computer interaction.
            </p>
          </VerticalTimelineElement>

          {/* Campus Leadership */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Jan 2025 – Present"
            iconStyle={{ background: '#00897b', color: 'white' }}
            icon={<FontAwesomeIcon icon={faUsers} />}
          >
            <h3 className="vertical-timeline-element-title">Photography Lead</h3>
            <h4 className="vertical-timeline-element-subtitle">Roamsrover – IIIT Delhi</h4>
            <p>
              Leading photography initiatives, capturing campus events, and managing visual content for the Roamsrover community at IIIT Delhi.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Aug 2025 – Present"
            iconStyle={{ background: '#00897b', color: 'white' }}
            icon={<FontAwesomeIcon icon={faUsers} />}
          >
            <h3 className="vertical-timeline-element-title">Coverage Member</h3>
            <h4 className="vertical-timeline-element-subtitle">E-Cell – IIIT Delhi</h4>
            <p>
              Active coverage member of the Entrepreneurship Cell at IIIT Delhi, contributing to event coverage, documentation, and outreach activities.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Jan 2025 – Present"
            iconStyle={{ background: '#00897b', color: 'white' }}
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
  );
}

export default Timeline;