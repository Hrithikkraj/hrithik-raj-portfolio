import React from "react";
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';
import profilePic from '../assets/images/profile.jpeg';

function Main() {

  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img src={profilePic} alt="Avatar" />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/Hrithikkraj" target="_blank" rel="noreferrer"><GitHubIcon /></a>
            <a href="https://www.linkedin.com/in/hrithikkraj/" target="_blank" rel="noreferrer"><LinkedInIcon /></a>
            <a href="https://www.instagram.com/hrithikkraj/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><InstagramIcon /></a>
            <a href="https://leetcode.com/u/Hrithikk_Raj/" target="_blank" rel="noreferrer" aria-label="LeetCode" title="LeetCode"><CodeIcon /></a>
            <a href="https://codeforces.com/profile/hrithikiiitd" target="_blank" rel="noreferrer" aria-label="Codeforces" title="Codeforces"><EmojiEventsIcon /></a>

          </div>
          <h1>Hrithik Raj</h1>
          <p>Software Engineer</p>

          <div className="mobile_social_icons">
            <a href="https://github.com/Hrithikkraj" target="_blank" rel="noreferrer"><GitHubIcon /></a>
            <a href="https://www.linkedin.com/in/hrithikkraj/" target="_blank" rel="noreferrer"><LinkedInIcon /></a>
            <a href="https://www.instagram.com/hrithikkraj/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><InstagramIcon /></a>
            <a href="https://leetcode.com/u/Hrithikk_Raj/" target="_blank" rel="noreferrer" aria-label="LeetCode" title="LeetCode"><CodeIcon /></a>
            <a href="https://codeforces.com/profile/hrithikiiitd" target="_blank" rel="noreferrer" aria-label="Codeforces" title="Codeforces"><EmojiEventsIcon /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;