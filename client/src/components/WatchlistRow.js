import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WatchlistRow = ({ stock, onRemove }) => {
  const [currentPrice, setCurrentPrice] = useState("Loading..."); // Initial state for price
  const { symbol, companyName } = stock;

  // Fetch the latest stock price
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks?q=${symbol}`);
        if (response.data && response.data.data.price) {
          setCurrentPrice(parseFloat(response.data.data.price).toFixed(2)); // Update price
        } else {
          console.warn(`No price data returned for ${symbol}`);
          setCurrentPrice("N/A");
        }
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error.message);
        setCurrentPrice("N/A"); // Handle error gracefully
      }
    };

    fetchCurrentPrice(); // Fetch on mount

    // Optional: Fetch periodically
    const interval = setInterval(fetchCurrentPrice, 60000); // Update every 60 seconds

    return () => clearInterval(interval); // Cleanup
  }, [symbol]);

  const handleRemoveFromWatchlist = async () => {
    try {
      const storageUser = JSON.parse(localStorage.getItem('user'));
      const userId = storageUser.user_id;

      const response = await axios.post('http://localhost:5000/api/watchlist/removeWatchlist', {
        user_id: userId,
        stock_symbol: symbol,
      });
      if (response.data.success) {
        onRemove(symbol); // Call the parent-provided callback to update UI
      } else {
        console.error("Failed to remove stock from watchlist");
      }
    } catch (error) {
      console.error("Error removing stock from watchlist:", error.message);
    }
  };

  return (
    <li className="WatchlistRow">
      <div className="WatchlistRowInfo">
        <span className="WatchlistRowSymbol">{symbol}</span>
        <span className="WatchlistRowCompany">{companyName}: </span>
        <span className="WatchlistRowPrice">Current Price: ${currentPrice}</span>
        <button className="RemoveFromWatchlistButton" onClick={handleRemoveFromWatchlist}>
          Remove
        </button>
      </div>
    </li>
  );
};

export default WatchlistRow;
