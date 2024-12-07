/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 21 Oct 2024

Description:
This file, `NavBar.js`, implements the navigation bar component for the application. It provides links to various pages, a stock search bar, and user authentication actions (Sign In/Logout). The component includes a responsive hamburger menu for smaller screens.
*/

import React, { useState, useEffect } from 'react'; // Import useState to manage state
import { useNavigate, Link } from 'react-router-dom'; // Navigation and linking for React Router
import Hamburger from 'hamburger-react'; // Hamburger menu for responsive navigation

import profile from "../img/profile.png"; // Profile icon image
import styles from "../css/NavBar.module.css"; // Component-specific styles

/**
 * Component: NavBar
 * Renders a responsive navigation bar with links to app pages, a stock search bar, and user authentication actions.
 */
function NavBar() {
  const [inputValue, setInputValue] = useState(''); // State for the search input value
  const [isOpen, setIsOpen] = useState(false); // State for the hamburger menu toggle

  const navigate = useNavigate(); // Hook for programmatic navigation

  /**
   * Function: handleSubmit
   * Handles the stock search form submission and navigates to the stock details page.
   * 
   * Arguments:
   * - e: Event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    navigate(`/stockDetails/${inputValue}`); // Navigate to the stock details page
  };

  /**
   * Function: handleLogout
   * Logs the user out by removing their data from local storage and navigating to the home page.
   */
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data from local storage
    navigate('/'); // Redirect to the home page
  };

  /**
   * Function: closeMenu
   * Closes the hamburger menu when a navigation item is clicked.
   */
  const closeMenu = () => {
    setIsOpen(false); // Close the menu
  };

  return (
    <>
      <nav className={styles.navBar}>
        {/* Main navigation content */}
        <div className={styles.navBarMainContent}>
          <Link className={styles.logo} to="/"></Link> {/* Logo linking to the home page */}
          <div className={`${styles.navBarMenu} ${isOpen ? styles.open : ""}`}>
            <Link className={styles.navbarItem} to="/" onClick={closeMenu}>Home</Link>
            <Link className={styles.navbarItem} to="/watchlist" onClick={closeMenu}>Watchlist</Link>
            <Link className={styles.navbarItem} to="/about" onClick={closeMenu}>About</Link>

            {/* Conditional rendering for Sign In/Logout links */}
            {!JSON.parse(localStorage.getItem('user')) && (
              <Link className={styles.hidden} to="/authentication">Sign In</Link>
            )}
            {JSON.parse(localStorage.getItem('user')) && (
              <Link className={styles.hidden} onClick={handleLogout}>Logout</Link>
            )}
          </div>
        </div>

        {/* Stock search bar */}
        <form className={styles.SearchBarContainer} onSubmit={handleSubmit}>
          <input
            className={styles.SearchBar}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // Update search input state
            placeholder="Search up a stock here!"
          />
        </form>

        {/* Profile and Hamburger menu */}
        <div className={styles.profile}>
          <div className={styles.hamburgerContainer}>
            <Hamburger toggled={isOpen} toggle={setIsOpen} /> {/* Hamburger menu toggle */}
          </div>
          <Link className={styles.navbarItem} to="/profile">
            <img className={styles.profileIcon} src={profile} alt="profile" />
          </Link>

          {/* Conditional rendering for Sign In/Logout links in the profile section */}
          {!JSON.parse(localStorage.getItem('user')) && (
            <Link className={`${styles.navbarItem} ${styles.smHidden}`} to="/authentication">Sign In</Link>
          )}
          {JSON.parse(localStorage.getItem('user')) && (
            <Link className={`${styles.navbarItem} ${styles.smHidden}`} onClick={handleLogout}>Logout</Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavBar; // Export the component

