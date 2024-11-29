import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../css/StockCard.css';

const StockCard = ({ stocks }) => {
  const [buySuccess, setBuySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [quantity, setQuantity] = useState(1); // New state for quantity

  const userRef = useRef(JSON.parse(localStorage.getItem('user')));
  const user = userRef.current || {};

  if (!stocks || !stocks.data) {
    return <p>No stock data found</p>;
  }

  const { symbol, companyName, timestamp, price } = stocks.data;

  const dateObject = new Date(timestamp);
  const formattedDate = dateObject.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true
  });

  const handleAddWatchlist = async () => {
    try {
      await axios.post('http://localhost:5000/api/watchlist/addWatchlist', {
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

  const handleBuyStock = async () => {
    try {
      const storageUser = JSON.parse(localStorage.getItem('user'));
      const storageId = storageUser["user_id"];

      const response = await axios.post('http://localhost:5000/api/buyStock', {
        user_id: storageId,
        symbol: symbol,
        curr_price: price,
        quantity: quantity // Send the quantity
      });

      if (response.data.success) {
        setBuySuccess(true);
        setErrorMessage('');
      } else {
        setErrorMessage('Error processing the purchase');
      }

      setTimeout(() => {
        setBuySuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error purchasing stock:', error);
      setErrorMessage('Error connecting to the server. Please try again.');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) setQuantity(value); // Ensure the quantity is at least 1
  };

  return (
    <div className="StockCardWrapper">
      <div className="StockCard">
        <h1 className="StockCardTitle">
          {companyName} <span className="StockCardSymbol">({symbol})</span>
        </h1>
        
        <div className="StockFormInput">
          <strong>Timestamp:</strong> <span>{formattedDate}</span>
        </div>
        <div className="StockFormInput">
          <strong>Price:</strong> <span>${parseFloat(price).toFixed(2)}</span>
        </div>

        <div className="StockFormInput">
          <label htmlFor="quantity"><strong>Quantity:</strong></label>
          <input 
            type="number" 
            id="quantity" 
            value={quantity} 
            onChange={handleQuantityChange} 
            min="1"
          />
        </div>

        <button className="BuyStockButton" onClick={handleBuyStock}>
          Buy Stock
        </button>

        <button className="addWatchList" onClick={handleAddWatchlist}>
          Add to Watchlist
        </button>

        {buySuccess && <p className="SuccessMessage">You have successfully purchased {quantity} shares of {companyName} stock!</p>}

        {errorMessage && <p className="ErrorMessage">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default StockCard;
