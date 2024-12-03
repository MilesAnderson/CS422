/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 26 Nov 2024

Description:
This file, `StockRow.js`, represents a single row in the portfolio or watchlist. It displays stock details such as the symbol, company name, quantity owned, current price, and total value. Users can sell stocks directly from this component, with input validation and real-time price fetching.
*/

import React, { useState, useEffect } from 'react'; // React hooks for state and lifecycle management
import axios from 'axios'; // HTTP client for API requests
import styles from '../css/StockRow.module.css'; // Component-specific styles

/**
 * Component: StockRow
 * Renders a row with stock details and provides functionality to sell stocks.
 * 
 * Props:
 * - stock: An object containing details like `symbol`, `quantity`, and initial `price`.
 */
const StockRow = ({ stock }) => {
  const [currentPrice, setCurrentPrice] = useState(parseFloat(stock.price)); // Current stock price
  const [currentQuantity, setCurrentQuantity] = useState(stock.quantity); // Quantity owned
  const [companyName, setCompanyName] = useState(""); // Name of the company
  const [sellQuantity, setSellQuantity] = useState(1); // Quantity to sell
  const [sellSuccess, setSellSuccess] = useState(false); // Success state for selling
  const [errorMessage, setErrorMessage] = useState(''); // Error message for user feedback

  const { symbol } = stock; // Extract stock symbol from props

  /**
   * useEffect: Fetches the latest stock price and company name when the component mounts.
   * Updates every 60 seconds to keep data current.
   */
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks?q=${symbol}`);
        if (response.data && response.data.data.price) {
          setCurrentPrice(parseFloat(response.data.data.price)); // Update current price
          setCompanyName(response.data.data.companyName); // Update company name
        } else {
          console.warn(`No price data returned for ${symbol}`);
        }
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error.message);
      }
    };

    fetchCurrentPrice(); // Fetch price immediately

    // Optional: Set up interval for periodic updates
    const interval = setInterval(fetchCurrentPrice, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [symbol]);

  /**
   * Function: handleSellStock
   * Handles the logic for selling stocks.
   * Sends the sell request to the backend and updates the UI based on the response.
   */
  const handleSellStock = async () => {
    try {
      const storageUser = JSON.parse(localStorage.getItem('user')); // Retrieve user ID from local storage
      const userId = storageUser.user_id;

      if (sellQuantity > currentQuantity) {
        setErrorMessage('Cannot sell more shares than you own.'); // Validate input
        return;
      }

      const response = await axios.post('http://localhost:5000/api/sellStock', {
        user_id: userId,
        symbol: symbol,
        curr_price: currentPrice,
        quantity: sellQuantity,
      });

      if (response.data.success) {
        setCurrentQuantity((prev) => prev - sellQuantity); // Update quantity
        setSellSuccess(true); // Show success message
        setErrorMessage('');
      } else {
        setErrorMessage('Error processing the sale.');
      }

      setTimeout(() => setSellSuccess(false), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error selling stock:', error);
      setErrorMessage('Error connecting to the server. Please try again.');
    }
  };

  /**
   * Function: handleQuantityChange
   * Updates the sell quantity based on user input, ensuring it is a valid number.
   * 
   * Arguments:
   * - e: The event object from the input change.
   */
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSellQuantity(value > 0 ? value : 1); // Ensure quantity is at least 1
  };

  return (
    <>
      <tr>
        <td className={styles.StockRowSymbol}>{symbol}</td>
        <td className={styles.StockRowCompany}>{companyName}</td>
        <td className={styles.StockRowQuantity}>{currentQuantity} shares</td>
        <td className={styles.StockRowPrice}>${parseFloat(currentPrice).toFixed(2)}</td>
        <td className={styles.StockRowTotalValue}>
          ${(currentQuantity * currentPrice).toFixed(2)}
        </td>
        <td className={styles.StockRowActions}>
          <label htmlFor={`sell-quantity-${symbol}`}>Quantity:</label>
          <input
            id={`sell-quantity-${symbol}`}
            type="number"
            value={sellQuantity}
            onChange={handleQuantityChange}
            min="1"
            max={currentQuantity}
          />
        </td>
        <td>
          <button
            className={styles.SellStockButton}
            onClick={handleSellStock}
            disabled={currentQuantity <= 0}>
            Sell Stock
          </button>
        </td>
      </tr>
      <div className={styles.AlertWrapper}>
        {sellSuccess && (
          <div className={styles.Alert} role="alert">
            Stock sold successfully!
          </div>
        )}
        {errorMessage && (
          <div className={`${styles.Alert} ${styles.Error}`} role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default StockRow; // Export the component

