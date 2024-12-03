/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 8 Oct 2024

Description:
This file, `App.js`, is the main component of the React application. It handles user interactions, including searching for stocks, and displays the results. The component fetches data from the backend API, manages the application state, and displays stock details dynamically.
*/

import React, { useEffect, useState } from 'react'; // Core React functionalities for state and side effects
import axios from 'axios'; // HTTP client for making API requests

import SearchIcon from "./img/SearchIcon.png"; // Search icon image
import styles from './css/App.module.css'; // Component-specific CSS styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS for additional styling

import NavBar from './components/NavBar'; // Navigation bar component
import StockCard from './components/StockCard'; // Component for displaying stock details

function App() {
  const [stocks, setStocks] = useState(null); // State for storing stock data
  const [searchQuery, setSearchQuery] = useState("GOOG"); // Default search query
  const [inputValue, setInputValue] = useState("GOOG"); // User input value for search
  const [loading, setLoading] = useState(false); // Loading state to manage API call status

  /**
   * Function: handleSearch
   * Updates the search query state with the user's input value.
   */
  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  /**
   * useEffect: Fetch stock data whenever the search query changes.
   * Sends a GET request to the backend API and updates the stock state.
   */
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true); // Start loading indicator
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks?q=${searchQuery}`);
        if (response.data && Object.keys(response.data).length > 0) {
          setStocks(response.data); // Set stocks state with valid data
        } else {
          setStocks(null); // Reset stocks state if no data is found
        }
      } catch (error) {
        console.error("Error fetching the API:", error);
        setStocks(null); // Reset stocks state in case of error
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    if (searchQuery) {
      fetchStocks();
    }
  }, [searchQuery]); // Dependency: Re-run the effect when searchQuery changes

  /**
   * Function: handleSubmit
   * Handles the form submission for searching stocks.
   * Prevents the default browser behavior and triggers a search.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className={styles.App}>
      <NavBar /> {/* Navigation bar */}
      <header className={styles.AppHeader}>
        <h1 className={styles.Title}>Search up a stock!</h1>
      </header>
      <form className={styles.SearchBarContainer} onSubmit={handleSubmit}>
        <input
          className={styles.SearchBar}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update input value on change
          placeholder="Search for a stock..."
        />
        <button type="submit" className={styles.SearchButton}>
          <img className={styles.SearchIcon} src={SearchIcon} alt="Search Icon" />
        </button>
      </form>
      {/* Display loading, stock data, or a no-data message based on state */}
      {loading ? (
        <p>Loading...</p>
      ) : stocks ? (
        <StockCard stocks={stocks} /> // Display stock details
      ) : (
        <p>No data available</p> // Fallback for no data
      )}
    </div>
  );
}

export default App; // Export the main component

