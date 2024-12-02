import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/StockRow.module.css';

const StockRow = ({ stock }) => {
  const [currentPrice, setCurrentPrice] = useState(parseFloat(stock.price)); // Ensure initial price is a float
  const [currentQuantity, setCurrentQuantity] = useState(stock.quantity);
  const [companyName, setCompanyName] = useState("");
  const [sellQuantity, setSellQuantity] = useState(1); // State for input quantity
  const [sellSuccess, setSellSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { symbol } = stock;

  // Fetch the latest stock price
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks?q=${symbol}`);
        if (response.data && response.data.data.price) {
          setCurrentPrice(parseFloat(response.data.data.price)); // Ensure updated price is a float
          setCompanyName(response.data.data.companyName);
        } else {
          console.warn(`No price data returned for ${symbol}`);
        }
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error.message);
      }
    };

    fetchCurrentPrice(); // Fetch on mount

    // Optional: Fetch periodically
    const interval = setInterval(fetchCurrentPrice, 60000); // Update every 60 seconds

    return () => clearInterval(interval); // Cleanup
  }, [symbol]);

  const handleSellStock = async () => {
    try {
      const storageUser = JSON.parse(localStorage.getItem('user'));
      const userId = storageUser.user_id;

      if (sellQuantity > currentQuantity) {
        setErrorMessage('Cannot sell more shares than you own.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/sellStock', {
        user_id: userId,
        symbol: symbol,
        curr_price: currentPrice,
        quantity: sellQuantity, // Sell the specified quantity
      });

      if (response.data.success) {
        setCurrentQuantity((prev) => prev - sellQuantity);
        setSellSuccess(true);
        setErrorMessage('');
      } else {
        setErrorMessage('Error processing the sale.');
      }

      setTimeout(() => setSellSuccess(false), 3000); // Clear success message
    } catch (error) {
      console.error('Error selling stock:', error);
      setErrorMessage('Error connecting to the server. Please try again.');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSellQuantity(value > 0 ? value : 1); // Ensure quantity is at least 1
  };

  console.log(companyName);
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
            max={currentQuantity}/>
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
        {/* Alert Component */}
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

export default StockRow;