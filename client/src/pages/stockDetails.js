import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import StockCard from "../components/StockCard";
import NavBar from '../components/NavBar';

import styles from "../css/StockCard.module.css";
function StockDetails(){
  const { symbol } = useParams();
  console.log("stock is", symbol);
  const [stocks, setStocks] = useState(null); // Initialize as null to distinguish from empty data
  const [loading, setLoading] = useState(false); // Loading state to manage API call status


  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks?q=${symbol}`);
        if (response.data && Object.keys(response.data).length > 0) {
          setStocks(response.data); // Set stocks to the response data if valid
        } else {
          setStocks(null); // Set stocks to null if no data
        }
      } catch (error) {
        console.error("Error fetching the API:", error);
        setStocks(null); // Set stocks to null if there's an error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (symbol) {
      fetchStocks();
    }
  }, [symbol]);

  return (
    <div className={styles.stockDisplayWrapper}>
      <NavBar />
      {/* Display loading, stock data, or a no-data message based on state */}
      {loading ? (
        <p>Loading...</p>
      ) : stocks ? (
        <StockCard stocks={stocks} />
      ) : (
        <p className={styles.NoData}>No data available</p>
      )}
    </div>
  )
}

export default StockDetails;