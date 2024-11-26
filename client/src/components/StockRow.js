import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/StockRow.css';

const StockRow = ({ stock }) => {
  const [currentPrice, setCurrentPrice] = useState(stock.price); // Track the live price
  const [currentQuantity, setCurrentQuantity] = useState(stock.quantity);
  const [sellSuccess, setSellSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { symbol, companyName } = stock;

  // Fetch the latest stock price
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks?q=${symbol}`);
        if (response.data && response.data.data.price) {
          setCurrentPrice(response.data.data.price); // Update the price
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

      const response = await axios.post('http://localhost:5000/api/sellStock', {
        user_id: userId,
        symbol: symbol,
        curr_price: currentPrice,
        quantity: 1, // Selling 1 share
      });

      if (response.data.success) {
        setCurrentQuantity((prev) => prev - 1);
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