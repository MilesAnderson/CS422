/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 21 Oct 2024

Description:
This file, `about.js`, provides an informational page about Moo-Deng Capital. It outlines the purpose, mission, and founding story of the platform. The page is styled for clarity and integrates the navigation bar for consistent user experience.
*/

import React from 'react'; // Core React library
import NavBar from '../components/NavBar'; // Navigation bar component
import styles from "../css/About.module.css"; // Component-specific styles

/**
 * Component: About
 * Displays the "About Us" page, introducing Moo-Deng Capital, its purpose, and its team.
 */
const About = () => {
  return (
    <>
      <NavBar /> {/* Render the navigation bar */}
      <div className={styles.AboutWrapper}>
        <div className={styles.AboutContainer}>
          <h1>About Us</h1>
          {/* Introductory content */}
          <p>
            Welcome to Moo-Deng Capital, your go-to platform for learning about investing through a realistic, risk-free stock market simulation.
            We're committed to providing you with a valuable trading experience, focusing on ease of use, education, and practicality.
          </p>
          {/* Founding story */}
          <p>
            Founded in 2024 by a team of investment enthusiasts—Andrew, Liam, Miles, and Jacob—Moo-Deng Capital was created to bridge the gap
            between theoretical investing knowledge and practical application. Our mission is to empower new investors with the tools they need
            to confidently navigate the stock market without the fear of financial loss.
          </p>
          {/* Closing message */}
          <p>
            We hope you enjoy practicing your trading strategies as much as we enjoy offering this platform to you. If you have any questions or feedback,
            please don’t hesitate to reach out.
          </p>
          <p>Sincerely,</p>
          <p>The Moo-Deng Capital Team</p>
        </div>
      </div>
    </>
  );
};

export default About; // Export the component for use in the application

