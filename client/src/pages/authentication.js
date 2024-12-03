/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 21 Oct 2024

Description:
This file, `authentication.js`, manages user authentication by toggling between the SignIn and SignUp forms. It utilizes React state to handle the view and integrates the NavBar for consistent navigation.
*/

import React, { useState } from 'react'; // React library for state management
import NavBar from '../components/NavBar'; // Navigation bar component
import SignIn from '../components/SignIn'; // SignIn form component
import SignUp from '../components/SignUp'; // SignUp form component

/**
 * Component: Authentication
 * Provides a toggleable interface for user authentication, allowing users to switch between signing in and signing up.
 */
function Authentication() {
  const [isSignIn, setIsSignIn] = useState(true); // State to track whether the SignIn form is active

  /**
   * Function: toggleForm
   * Toggles the view between SignIn and SignUp forms by updating the `isSignIn` state.
   */
  const toggleForm = () => {
    setIsSignIn(!isSignIn); // Switch between SignIn and SignUp
  };

  return (
    <div>
      <NavBar /> {/* Render the navigation bar */}
      {/* Conditionally render SignIn or SignUp component based on state */}
      {isSignIn ? (
        <SignIn toggleForm={toggleForm} /> // Render the SignIn form
      ) : (
        <SignUp toggleForm={toggleForm} /> // Render the SignUp form
      )}
    </div>
  );
}

export default Authentication; // Export the component for use in the application

