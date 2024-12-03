/*
Moo-Deng
Authors:
Andrew Chan

Date Created: Oct 21 2024

Description:
This file, `SignIn.js`, provides the user interface and functionality for user login. Users can enter their email and password to authenticate. Upon successful login, they are redirected to their profile page. It includes error handling and a toggle to switch to the sign-up form.
*/

import React, { useState } from 'react'; // Core React functionalities
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import { authenticateUser } from '../services/userService'; // Service for user authentication

// Importing icons for input fields
import EmailIcon from "../img/EmailIcon.png";
import PasswordIcon from "../img/PasswordIcon.png";

// Importing styles
import styles from '../css/Auth.module.css';

/**
 * Component: SignIn
 * Renders the sign-in form and handles user authentication.
 * 
 * Props:
 * - toggleForm: Function to switch to the sign-up form.
 */
const SignIn = ({ toggleForm }) => {
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [error, setError] = useState(''); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate(); // Hook for navigation

  /**
   * Function: handleSubmit
   * Handles the form submission for user login.
   * Sends user credentials to the backend via the `authenticateUser` service.
   * 
   * Arguments:
   * - e: The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const credentials = { email, password }; // Create credentials object
    setLoading(true); // Start the loading indicator
    setError(''); // Clear any existing error messages

    try {
      const response = await authenticateUser(credentials); // Call the user service to authenticate
      localStorage.setItem('user', JSON.stringify(response.user)); // Store user data in local storage
      navigate('/profile'); // Redirect to the profile page on success
    } catch (error) {
      setError(error.message); // Set the error message if authentication fails
      console.error('Error authenticating user:', error); // Log the error
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  return (
    <div className={styles.AuthWrapper}>
      {/* Left panel with a welcome message */}
      <div className={styles.leftPanel}>
        <h1 className={styles.heading}>Moo-Deng Capital</h1>
        <p className={styles.message}>Welcome Back!</p>
      </div>

      {/* User sign-in form */}
      <div className={styles.userForm}>
        <h1 className={styles.AuthTitle}>Sign In</h1>
        <form className={styles.formBox} onSubmit={handleSubmit}>
          {/* Email input field */}
          <div className={styles.AuthFormInput}>
            <img src={EmailIcon} alt="Email Icon" className={styles.AuthIcon} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              placeholder="Email"
              required
            />
          </div>

          {/* Password input field */}
          <div className={styles.AuthFormInput}>
            <img src={PasswordIcon} alt="Password Icon" className={styles.AuthIcon} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              placeholder="Password"
              required
            />
          </div>

          {/* Display error message if any */}
          {error && <p className={styles.ErrorMessage}>{error}</p>}

          {/* Submit button */}
          <div className={styles.ButtonWrapper}>
            <button type="submit" className={styles.SubmitButton} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          {/* Toggle link to switch to the sign-up form */}
          <p onClick={toggleForm} className={styles.AuthInfo}>New to Moo-Deng? Sign up</p>
        </form>
      </div>
    </div>
  );
};

export default SignIn; // Export the component

