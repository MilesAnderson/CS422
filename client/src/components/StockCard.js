/*
Moo-Deng
Authors:
Liam Bouffard
Andrew Chan

Date Created: 11 Nov 2024

Description:
This file, `StockCard.js`, displays detailed information about a specific stock. It allows users to buy a stock, specify the quantity, and add the stock to their watchlist. The component also handles error scenarios and displays success or error messages based on user interactions.
*/

import React, { useState, useRef } from 'react'; // Core React functionalities
import axios from 'axios'; // HTTP client for making API requests
import styles from '../css/StockCard.module.css'; // Component-specific styles

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001/api'; // Use environment variable or fallback

/**
 * Component: StockCard
 * Displays stock details and provides options to buy stock or add it to the watchlist.
 * 
 * Props:
 * - stocks: Object containing stock data including `symbol`, `companyName`, `timestamp`, and `price`.
 */
const StockCard = ({ stocks }) => {
  const [buySuccess, setBuySuccess] = useState(false); // State for tracking successful purchase
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [quantity, setQuantity] = useState(1); // State for the quantity of stocks to buy

  const userRef = useRef(JSON.parse(localStorage.getItem('user'))); // Retrieve the current user's data
  const user = userRef.current || {}; // Fallback to an empty object if no user data

  // Display fallback message if no stock data is available
  if (!stocks || !stocks.data) {
    return <p>No stock data found</p>;
  }

  // Destructure stock data
  const { symbol, companyName, timestamp, price } = stocks.data;

  // Format the timestamp to a readable date and time
  const dateObject = new Date(timestamp);
  const formattedDate = dateObject.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true
  });

  /**
   * Function: handleAddWatchlist
   * Adds the current stock to the user's watchlist by sending a POST request to the backend.
   */
  const handleAddWatchlist = async () => {
    try {
      await axios.post(`${API_URL}/watchlist/addWatchlist`, {
        watchlist_name: user.user_id,
        user_id: user.user_id,
        stock_ticker: symbol,
        curr_price: price,
      });
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
      setErrorMessage('Error connecting to the server. Please try again.');
    }
  };

  /**
   * Function: handleBuyStock
   * Handles the purchase of a stock by sending the purchase details to the backend.
   * On success, it adds the stock to the user's watchlist and displays a success message.
   */
  const handleBuyStock = async () => {
    try {
      const storageUser = JSON.parse(localStorage.getItem('user')); // Retrieve the current user from local storage
      const storageId = storageUser["user_id"];

      const response = await axios.post(`${API_URL}/buyStock`, {
        user_id: storageId,
        symbol: symbol,
        curr_price: price,
        quantity: quantity, // Include the quantity in the request
      });

      if (response.data.success) {
        setBuySuccess(true);
        setErrorMessage('');

        // Automatically add the stock to the watchlist after a successful purchase
        await handleAddWatchlist();
      } else {
        setErrorMessage('Error processing the purchase');
      }

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setBuySuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error purchasing stock:', error);
      setErrorMessage('Error connecting to the server. Please try again.');
    }
  };

  /**
   * Function: handleQuantityChange
   * Updates the quantity state based on user input, ensuring a minimum value of 1.
   * 
   * Arguments:
   * - e: Event object triggered by the input change.
   */
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) setQuantity(value); // Ensure the quantity is at least 1
  };

  return (
    <div className={styles.StockCardWrapper}>
      <div className={styles.StockCard}>
        <h1 className={styles.StockCardTitle}>
          {companyName} <span className={styles.StockCardSymbol}>({symbol})</span>
        </h1>

        {/* Display stock timestamp */}
        <div className={styles.StockFormInput}>
          <strong>Timestamp:</strong> <span>{formattedDate}</span>
        </div>

        {/* Display current stock price */}
        <div className={styles.StockFormInput}>
          <strong>Price:</strong> <span>${parseFloat(price).toFixed(2)}</span>
        </div>

        {/* Input for specifying the quantity of stocks to buy */}
        <div className={styles.StockFormInput}>
          <label htmlFor="quantity"><strong>Quantity:</strong></label>
          <input 
            type="number" 
            id="quantity" 
            value={quantity} 
            onChange={handleQuantityChange} 
            min="1"
          />
        </div>

        {/* Buttons for buying stock and adding to watchlist */}
        <div className={styles.stockButtons}>
          <button className={styles.BuyStockButton} onClick={handleBuyStock}>
            Buy Stock
          </button>
          <button className={styles.addWatchList} onClick={handleAddWatchlist}>
            Add to Watchlist
          </button>
        </div>

        {/* Display success message for stock purchase */}
        {buySuccess && (
          <p className={styles.SuccessMessage}>
            You have successfully purchased {quantity} shares of {companyName} stock!
          </p>
        )}

        {/* Display error messages */}
        {errorMessage && (
          <p className={styles.ErrorMessage}>{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default StockCard; // Export the component for use in the application
