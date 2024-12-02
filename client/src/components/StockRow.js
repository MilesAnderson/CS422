import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/StockRow.css';

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

  return (
    <li className="StockRow">
      <div className="StockRowInfo">
        <span className="StockRowSymbol">{symbol}</span>
        <span className="StockRowCompany">{companyName}</span>
        <span className="StockRowQuantity">{currentQuantity} shares</span>
        <span className="StockRowPrice">${parseFloat(currentPrice).toFixed(2)}</span>
        <span className="StockRowTotalValue">
          Total: ${(currentQuantity * currentPrice).toFixed(2)}
        </span>
      </div>
      <div className="StockRowActions">
        <label htmlFor={`sell-quantity-${symbol}`}>Quantity:</label>
        <input
          id={`sell-quantity-${symbol}`}
          type="number"
          value={sellQuantity}
          onChange={handleQuantityChange}
          min="1"
          max={currentQuantity}
        />
        <button
          className="SellStockButton"
          onClick={handleSellStock}
          disabled={currentQuantity <= 0}
        >
          Sell Stock
        </button>
      </div>
      {sellSuccess && <p className="SuccessMessage">Stock sold successfully!</p>}
      {errorMessage && <p className="ErrorMessage">{errorMessage}</p>}
    </li>
  );
};

export default StockRow;
