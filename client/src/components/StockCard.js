import React from 'react';
import '../css/StockCard.css';

const StockCard = ({ stocks }) => {
  // Check if stocks and stocks.data exist
  if (!stocks || !stocks.data) {
    return <p>No stock data found</p>;
  }

  const { timestamp, price } = stocks.data; // Destructure the timestamp and price

  return (
    <div className="StockCardWrapper">
      <div className="StockCard">
        <h1 className="StockCardTitle">Stock Information</h1>
        <div className="StockFormInput">
          <strong>Timestamp:</strong> <span>{timestamp}</span>
        </div>
        <div className="StockFormInput">
          <strong>Price:</strong> <span>${parseFloat(price).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
