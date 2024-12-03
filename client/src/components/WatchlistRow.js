/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 28 Nov 2024

Description:
This file, `WatchlistRow.js`, represents a single row in the user's watchlist. It fetches the current price of a stock, displays its details, and provides functionality to remove the stock from the watchlist. The component integrates with the backend API to update the watchlist.
*/

import React, { useState, useEffect } from 'react'; // React core functionalities
import axios from 'axios'; // HTTP client for making API requests

import styles from "../css/WatchList.module.css"; // Component-specific styles

/**
 * Component: WatchlistRow
 * Displays a single stock's information in the watchlist and allows the user to remove it.
 * 
 * Props:
 * - stock: Object containing stock details (`symbol` and `companyName`).
 * - onRemove: Function to handle removal of the stock from the watchlist UI.
 */
const WatchlistRow = ({ stock, onRemove }) => {
  const [currentPrice, setCurrentPrice] = useState("Loading..."); // Initial state for price
  const { symbol, companyName } = stock; // Destructure stock details

  /**
   * useEffect: Fetches the current stock price when the component mounts or `symbol` changes.
   * Periodically updates the price every 60 seconds.
   */
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks?q=${symbol}`);
        if (response.data && response.data.data.price) {
          setCurrentPrice(parseFloat(response.data.data.price).toFixed(2)); // Update price with formatted value
        } else {
          console.warn(`No price data returned for ${symbol}`); // Log warning for missing data
          setCurrentPrice("N/A");
        }
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error.message); // Log error
        setCurrentPrice("N/A"); // Set fallback value
      }
    };

    fetchCurrentPrice(); // Fetch price on component mount

    // Set interval to update price every 60 seconds
    const interval = setInterval(fetchCurrentPrice, 60000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, [symbol]); // Dependency array ensures effect runs when `symbol` changes

  /**
   * Function: handleRemoveFromWatchlist
   * Sends a POST request to the backend to remove the stock from the user's watchlist.
   * Updates the parent component's state using the `onRemove` callback.
   */
  const handleRemoveFromWatchlist = async () => {
    try {
      // Retrieve the current user's ID from local storage
      const storageUser = JSON.parse(localStorage.getItem('user'));
      const userId = storageUser.user_id;

      // Send request to remove stock from watchlist
      const response = await axios.post('http://localhost:5000/api/watchlist/removeWatchlist', {
        user_id: userId,
        stock_symbol: symbol,
      });

      if (response.data.success) {
        onRemove(symbol); // Call the parent-provided callback to update the UI
      } else {
        console.error("Failed to remove stock from watchlist"); // Log failure
      }
    } catch (error) {
      console.error("Error removing stock from watchlist:", error.message); // Log error
    }
  };

  return (
    <tr className={styles.WatchlistRow}>
        {/* Display stock symbol */}
        <td className="WatchlistRowSymbol">{symbol}</td>

        {/* Display company name */}
        <td className="WatchlistRowCompany">{companyName}</td>

        {/* Display current stock price */}
        <td className="WatchlistRowPrice">${currentPrice}</td>

        {/* Remove button */}
        <button className={styles.RemoveFromWatchlistButton} onClick={handleRemoveFromWatchlist}>
          Remove
        </button>
    </tr>
  );
};

export default WatchlistRow; // Export the component for use in the application

