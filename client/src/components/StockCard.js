import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../css/StockCard.css';

// JSON.parse(localStorage.getItem('user'))

const StockCard = ({ stocks }) => {
  const [buySuccess, setBuySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


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
        const response = await axios.post('http://localhost:5000/api/watchlist/addWatchlist', {
            watchlist_name: user.user_id, 
            user_id: user.user_id, 
            stock_ticker: symbol,
            curr_price: price,
        });
    } catch (error) {
        console.error('Error adding stock to watchlist:', error);
        setErrorMessage('Error connecting to the server. Please try again.');
    }
  }

  const handleBuyStock = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/buy', {
        symbol: symbol,
        price: price,
        quantity: 1,
      });

      // Handle the response
      if (response.data.success) {
        setBuySuccess(true);
        setErrorMessage('');
      } else {
        setErrorMessage('Error processing the purchase');
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setBuySuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error purchasing stock:', error);
      setErrorMessage('Error connecting to the server. Please try again.');
    }
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

        <button className="BuyStockButton" onClick={handleBuyStock}>
          Buy Stock
        </button>

        <button className="addWatchList" onClick={handleAddWatchlist}>
            Add to Watchlist
        </button>

        {buySuccess && <p className="SuccessMessage">You have successfully purchased {companyName} stock!</p>}

        {/* Show error message */}
        {errorMessage && <p className="ErrorMessage">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default StockCard;
