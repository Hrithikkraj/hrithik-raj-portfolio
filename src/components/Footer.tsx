import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import '../assets/styles/Footer.scss'

function Footer() {
  return (
    <footer>
      <div>
        <a href="https://github.com/Hrithikkraj" target="_blank" rel="noreferrer"><GitHubIcon /></a>
        <a href="https://www.linkedin.com/in/hrithikkraj/" target="_blank" rel="noreferrer"><LinkedInIcon /></a>
        <a href="https://www.instagram.com/hrithikkraj/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><InstagramIcon /></a>
        <a href="https://leetcode.com/u/Hrithikk_Raj/" target="_blank" rel="noreferrer" aria-label="LeetCode" title="LeetCode"><CodeIcon /></a>
        <a href="https://codeforces.com/profile/hrithikiiitd" target="_blank" rel="noreferrer" aria-label="Codeforces" title="Codeforces"><EmojiEventsIcon /></a>
      </div>
      <p>© 2026 Hrithik Raj. All Rights Reserved.</p>

    </footer>
  );
}

export default Footer;