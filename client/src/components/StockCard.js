import React from 'react';
import '../css/StockCard.css';

const StockCard = ({ stocks }) => {
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
      </div>
    </div>
  );
};

export default StockCard;
