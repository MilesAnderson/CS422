/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 2 Dec 2024

Description:
This file, `stockDetails.js`, displays detailed information about a specific stock. It fetches stock data based on the symbol provided in the URL, manages loading and error states, and renders a detailed stock card.
*/

import React, { useEffect, useState } from 'react'; // Core React functionalities for state and side effects
import { useParams } from 'react-router-dom'; // React Router hook for accessing URL parameters
import axios from 'axios'; // HTTP client for making API requests

import StockCard from "../components/StockCard"; // Component for displaying stock details
import NavBar from '../components/NavBar'; // Navigation bar component

import styles from "../css/StockCard.module.css"; // Component-specific CSS styles

/**
 * Component: StockDetails
 * Fetches and displays details about a specific stock based on the URL parameter.
 */
function StockDetails() {
  const { symbol } = useParams(); // Extract the stock symbol from the URL parameters
  const [stocks, setStocks] = useState(null); // State for storing the stock data
  const [loading, setLoading] = useState(false); // Loading state to manage API call status

  /**
   * useEffect: Fetch stock data when the symbol changes.
   * Sends a GET request to the backend API and updates the `stocks` state.
   */
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true); // Start the loading indicator
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks?q=${symbol}`);
        if (response.data && Object.keys(response.data).length > 0) {
          setStocks(response.data); // Set stocks state with valid data
        } else {
          setStocks(null); // Set stocks state to null if no data is found
        }
      } catch (error) {
        console.error("Error fetching the API:", error); // Log errors to the console
        setStocks(null); // Reset stocks state in case of an error
      } finally {
        setLoading(false); // Stop the loading indicator
      }
    };

    if (symbol) {
      fetchStocks(); // Fetch stock data if a symbol is provided
    }
  }, [symbol]); // Dependency array ensures this runs only when the symbol changes

  return (
    <div className={styles.stockDisplayWrapper}>
      <NavBar /> {/* Render the navigation bar */}
      {/* Conditional rendering based on loading and data states */}
      {loading ? (
        <p>Loading...</p> // Display loading message
      ) : stocks ? (
        <StockCard stocks={stocks} /> // Display the stock details using StockCard component
      ) : (
        <p className={styles.NoData}>No data available</p> // Display a message if no data is available
      )}
    </div>
  );
}

export default StockDetails; // Export the component for use in the application

