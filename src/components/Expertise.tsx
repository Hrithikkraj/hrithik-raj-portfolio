import React from "react";
import '@fortawesome/free-regular-svg-icons'
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

function Expertise() {
    return (
    <div className="container" id="expertise">
        <div className="skills-container">
            <h1>Expertise</h1>
            <div className="skills-grid">
                <div className="skill">
                    <FontAwesomeIcon icon={faPython} size="3x"/>
                    <h3>Software Development & Systems Engineering</h3>
                    <p>Experienced in building low-level system software, game engines, and assembly tools. Strong command of data structures, algorithms, and OS fundamentals with hands-on multi-threaded and IPC-based systems programming.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsFirst.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faGitAlt} size="3x"/>
                    <h3>Data Engineering, ML & Analytics</h3>
                    <p>Built end-to-end data pipelines, graph analytics systems, and computer vision models. Skilled in deep learning architectures, database normalization, and real-time gesture recognition using MediaPipe and ResNet50.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsSecond.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faFigma} size="3x"/>
                    <h3>Networking, UI/UX & Web Development</h3>
                    <p>Implemented socket-based chat servers, routing algorithms (Link State & Distance Vector), and responsive frontend applications. Skilled in UI wireframing, asset design, and rendering optimization using industry-standard design tools.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsThird.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Expertise;