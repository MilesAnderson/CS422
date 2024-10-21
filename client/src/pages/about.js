import React from 'react';
import NavBar from '../components/NavBar';

const About = () => {
  return (
    <>
      <NavBar />
      <div className="about-container">
        <h1>About Us</h1>
        <p>Welcome to Moo-Deng Capital, your go-to platform for learning about investing through a realistic, risk-free stock market simulation. We're committed to providing you with a valuable trading experience, focusing on ease of use, education, and practicality.</p>
        <p>Founded in 2024 by a team of investment enthusiasts—Andrew, Liam, Miles, and Jacob—Moo-Deng Capital was created to bridge the gap between theoretical investing knowledge and practical application. Our mission is to empower new investors with the tools they need to confidently navigate the stock market without the fear of financial loss.</p>
        <p>We hope you enjoy practicing your trading strategies as much as we enjoy offering this platform to you. If you have any questions or feedback, please don’t hesitate to reach out.</p>
        <p>Sincerely,</p>
        <p>The Moo-Deng Capital Team</p>
      </div>
    </>
  );
};

export default About;
