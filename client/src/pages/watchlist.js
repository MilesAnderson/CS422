/*
Moo-Deng
Authors:
Liam Bouffard
Andrew Chan

Date Created: 21 Oct 2024

Description:
This file, `watchlist.js`, is a React component that displays a user's stock watchlist. It fetches watchlist data and stock prices from the backend, handles loading and error states, and allows users to remove stocks from their watchlist dynamically. This file is apart of the watchlist system. It handles the frontend for the watchlist.
*/

import React, { useEffect, useState, useRef } from 'react'; // Core React functionalities
import WatchlistRow from '../components/WatchlistRow'; // Component to display a single row of the watchlist
import NavBar from '../components/NavBar'; // Navigation bar component
import axios from 'axios'; // HTTP client for API requests

import styles from "../css/WatchList.module.css"; // Component-specific styles

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]); // State for storing the watchlist with stock prices
  const [loading, setLoading] = useState(true); // State for managing the loading indicator
  const [error, setError] = useState(null); // State for storing error messages

  const userRef = useRef(JSON.parse(localStorage.getItem('user'))); // Retrieve the logged-in user's data from local storage
  const user = userRef.current || {}; // Fallback to an empty object if user data is not available

  /**
   * Function: fetchWatchlist
   * Fetches the user's watchlist and corresponding stock prices from the backend.
   * Updates the `watchlist` state with the fetched data.
   * Handles errors gracefully and updates the `error` state when necessary.
   */
  const fetchWatchlist = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/watchlist/${user.user_id}/watchlist`);
      if (response.ok) {
        const data = await response.json();

        // Extract stock symbols from the watchlist data
        const symbols = data.watchlist || [];

        // Fetch current prices for each stock symbol
        const pricePromises = symbols.map(async (symbol) => {
          try {
            const priceResponse = await axios.get(`http://localhost:5000/api/stocks?q=${symbol}`);
            return {
              symbol,
              companyName: priceResponse.data?.data?.companyName,
              price: priceResponse.data?.data?.price || "N/A", // Handle missing price gracefully
            };
          } catch {
            return { symbol, price: "N/A" }; // Handle individual fetch failures gracefully
          }
        });

        const watchlistWithPrices = await Promise.all(pricePromises); // Resolve all promises for stock prices
        setWatchlist(watchlistWithPrices); // Update the watchlist state
      } else {
        throw new Error('Failed to fetch watchlist'); // Throw error for non-200 responses
      }
    } catch (err) {
      console.error("Error fetching watchlist:", err.message);
      setError("Failed to load watchlist. Please try again later."); // Update the error state
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  useEffect(() => {
    fetchWatchlist(); // Fetch the watchlist on component mount
  }, [fetchWatchlist]); // Dependency array ensures this runs only once

  /**
   * Function: handleRemoveStock
   * Removes a stock from the watchlist state when the user selects "Remove".
   * 
   * Arguments:
   * - symbol: The stock symbol to remove from the watchlist.
   */
  const handleRemoveStock = (symbol) => {
    setWatchlist((prev) => prev.filter((stock) => stock.symbol !== symbol)); // Filter out the removed stock
  };

  if (loading) {
    // Display loading message while fetching data
    return (
      <>
        <NavBar />
        <div className="watchlist-container">
          <h1>Loading Watchlist...</h1>
        </div>
      </>
    );
  }

  if (error) {
    // Display error message if fetching data fails
    return (
      <>
        <NavBar />
        <div className={styles.watchlistContainer}>
          <h1>Error: {error}</h1>
        </div>
      </>
    );
  }

  return (
    <div className={styles.wrapper}>
      <NavBar />
      <div className={styles.watchlistWrapper}>
        <div className={styles.watchlistContainer}>
          <h1 className={styles.watchlistHeading}>Your Watchlist</h1>
          {watchlist.length === 0 ? (
            <p>No stocks in your watchlist.</p> // Message if the watchlist is empty
          ) : (
            <div className={styles.watchlistTable}>
              <table>
                <thead>
                  <tr>
                    <th className={styles.headerRow}>Symbol</th>
                    <th className={styles.headerRow}>Company Name</th>
                    <th className={styles.headerRow}>Current Price</th>
                    <th className={styles.headerRow}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((stock, index) => (
                    <WatchlistRow
                      key={index}
                      stock={stock}
                      onRemove={handleRemoveStock} // Pass the remove handler to the row
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Watchlist; // Export the component for use in the application

