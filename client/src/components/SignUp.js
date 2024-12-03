/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 21 October 2024

Description:
This file, `SignUp.js`, provides the user interface and functionality for new user registration. Users can enter their details to create an account, and upon successful registration, they are redirected to their profile page. It includes error handling and a toggle to switch to the sign-in form.
*/

import React, { useState } from 'react'; // Core React library for state management
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import { createUser } from '../services/userService'; // Service for creating a new user

// Importing icons for input fields
import EmailIcon from "../img/EmailIcon.png";
import UserIcon from "../img/UserIcon.png";
import PasswordIcon from "../img/PasswordIcon.png";

// Importing styles
import styles from '../css/Auth.module.css';

/**
 * Component: SignUp
 * Renders the sign-up form and handles user registration.
 * 
 * Props:
 * - toggleForm: Function to switch to the sign-in form.
 */
const SignUp = ({ toggleForm }) => {
  const [username, setUsername] = useState(''); // State for username input
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [error, setError] = useState(''); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate(); // Hook for navigation

  /**
   * Function: handleSubmit
   * Handles the form submission for user registration.
   * Sends user data to the backend via the `createUser` service.
   * 
   * Arguments:
   * - e: The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const newUser = { username, email, password }; // Create a new user object
    setLoading(true); // Start the loading indicator
    setError(''); // Clear any existing error messages

    try {
      const response = await createUser(newUser); // Call the user service to create a new user
      localStorage.setItem('user', JSON.stringify(response)); // Store the user data in local storage
      navigate('/profile'); // Redirect to the profile page upon success
    } catch (error) {
      setError(error.message); // Set the error message if registration fails
      console.error('Error creating user:', error); // Log the error
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  return (
    <div className={styles.AuthWrapper}>
      {/* Left panel with a welcome message */}
      <div className={styles.leftPanel}>
        <h1 className={styles.heading}>Moo-Deng Capital</h1>
        <p className={styles.message}>Welcome!</p>
      </div>

      {/* User registration form */}
      <div className={styles.userForm}>
        <h1 className={styles.AuthTitle}>Sign Up</h1>
        <form className={styles.formBox} onSubmit={handleSubmit}>
          {/* Username input field */}
          <div className={styles.AuthFormInput}>
            <img src={UserIcon} alt="User Icon" className={styles.AuthIcon} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username state
              placeholder="Username"
              required
            />
          </div>

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
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>

          {/* Toggle link to switch to the sign-in form */}
          <p onClick={toggleForm} className={styles.AuthInfo}>
            Returning to Moo-Deng? Sign in
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp; // Export the component

