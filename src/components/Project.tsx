import React from "react";
import smartSkincare from '../assets/images/smart-skincare.png';
import signLanguage from '../assets/images/real-time-sign-language.png';
import networkAnalysis from '../assets/images/network-analysis.jpg';
import disasterSystem from '../assets/images/nature-disaster-system.jpg';
import angryBird from '../assets/images/angrybird.jpg';
import networkRouting from '../assets/images/network-routing.jpg';
import '../assets/styles/Project.scss';

function Project() {
    return (
        <div className="projects-container" id="projects">
            <h1>Personal Projects</h1>
            <div className="projects-grid">

                <div className="project">
                    <div className="project-image-wrapper">
                        <a href="https://github.com/Hrithikkraj/Derma-AI---Skin-analysis" target="_blank" rel="noreferrer"><img src={smartSkincare} alt="Smart Skincare Analysis" /></a>
                    </div>
                    <a href="https://github.com/Hrithikkraj/Derma-AI---Skin-analysis" target="_blank" rel="noreferrer"><h2>Smart Skincare Analysis & Recommendation Platform</h2></a>
                    <p><em>Jan 2026 – Apr 2026</em> · Built a full-stack web application using FastAPI for real-time skin analysis, integrating ResNet50 and EfficientNet-B3 models. Engineered a personalized recommendation engine that reduced bad product matches by 95%.</p>
                </div>

                <div className="project">
                    <div className="project-image-wrapper">
                        <a href="https://github.com/Hrithikkraj/Real-time-sign-language-interpreter" target="_blank" rel="noreferrer"><img src={signLanguage} alt="Sign Language Interpreter" /></a>
                    </div>
                    <a href="https://github.com/Hrithikkraj/Real-time-sign-language-interpreter" target="_blank" rel="noreferrer"><h2>Real-Time Sign Language Interpreter</h2></a>
                    <p><em>Jan 2026 – Apr 2026</em> · Engineered a gesture recognition system featuring 3 interpreter modes and deployed 40+ models using MediaPipe and scikit-learn for voice output synthesis.</p>
                </div>

                <div className="project">
                    <div className="project-image-wrapper">
                        <a href="https://github.com/Hrithikkraj/Network-analysis-link-prediction" target="_blank" rel="noreferrer"><img src={networkAnalysis} alt="Network Analysis" /></a>
                    </div>
                    <a href="https://github.com/Hrithikkraj/Network-analysis-link-prediction" target="_blank" rel="noreferrer"><h2>Network Analysis & Link Prediction</h2></a>
                    <p><em>Jan 2026 – Apr 2026</em> · Benchmarked 5 link prediction algorithms (Adamic Adar, Resource Allocation) across 3 network topologies. Evaluated a 2,900+ edge Wikipedia voting network, achieving 0.79 ROC AUC and 56% Precision@K.</p>
                </div>

                <div className="project">
                    <div className="project-image-wrapper">
                        <a href="https://github.com/DhimantKaul100/DBMS-PROJECT-2025" target="_blank" rel="noreferrer"><img src={disasterSystem} alt="Disaster Management System" /></a>
                    </div>
                    <a href="https://github.com/DhimantKaul100/DBMS-PROJECT-2025" target="_blank" rel="noreferrer"><h2>Natural Disaster Management System</h2></a>
                    <p><em>Jan 2025 – Apr 2025</em> · Designed a normalized PostgreSQL DBMS with 10+ entities and 7 RESTful API endpoints, reducing data redundancy by ~40%. Implemented 3 SQL triggers to enforce real-time business constraints.</p>
                </div>



                <div className="project">
                    <div className="project-image-wrapper">
                        <a href="https://github.com/rwt04/AngryBirds" target="_blank" rel="noreferrer"><img src={angryBird} alt="Angry Birds Game" /></a>
                    </div>
                    <a href="https://github.com/rwt04/AngryBirds" target="_blank" rel="noreferrer"><h2>2D Angry Birds Game Implementation</h2></a>
                    <p><em>Sep 2024 – Nov 2024</em> · Developed a 2D game in Java using LibGDX with OOP-based physics, collision detection, and level management. Designed custom vector assets in Adobe Illustrator, optimizing rendering across 2D resolutions.</p>
                </div>


                <div className="project">
                    <div className="project-image-wrapper">
                        <a href="https://github.com/Hrithikkraj/Network-protocol-routing" target="_blank" rel="noreferrer"><img src={networkRouting} alt="Network Protocol Simulator" /></a>
                    </div>
                    <a href="https://github.com/Hrithikkraj/Network-protocol-routing" target="_blank" rel="noreferrer"><h2>Network Protocol & Routing Simulator</h2></a>
                    <p><em>Sep 2025 – Nov 2025</em> · Built Echo services, broadcast messaging, and packet transfer with ACK/timeout mechanisms. Simulated Link State and Distance Vector routing protocols alongside a multi-threaded chat server.</p>
                </div>

            </div>
        </div>
    );
}

export default Project;
