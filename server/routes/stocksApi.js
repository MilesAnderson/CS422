/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 2 Oct 2024

Description:
This file, `stocksApi.js`, defines a route for fetching real-time stock data from the Alpha Vantage API. It combines stock price and company information into a single response by making concurrent requests to the Alpha Vantage API's TIME_SERIES_INTRADAY and SYMBOL_SEARCH endpoints. This file is apart of the stocks system. It connects our application to our api.
*/

import express from 'express'; // Web framework for creating HTTP routes
import axios from 'axios'; // HTTP client for making external API requests
import 'dotenv/config'; // Enables the use of environment variables from a .env file

const router = express.Router(); // Router instance for defining stock-related routes
const apiKey = process.env.API_KEY; // API key for authenticating requests to Alpha Vantage

// Base URLs for Alpha Vantage API
const timeSeriesUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=';
const searchUrl = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=';

/**
 * Route: Fetch stock data
 * Method: GET
 * Endpoint: /
 * Query Parameters:
 * - q: The stock ticker symbol.
 * 
 * Functionality:
 * - Fetches real-time stock price data and company information for the provided stock ticker.
 * - Combines data from the TIME_SERIES_INTRADAY and SYMBOL_SEARCH endpoints of Alpha Vantage API.
 * 
 * Returns:
 * - A JSON response containing the stock's company name, symbol, timestamp of the most recent data, and closing price.
 */
router.get('/', async (req, res) => {
  const ticker = req.query.q;

  // Validate the query parameter
  if (!ticker) {
    return res.status(400).send({ message: "We need a stock ticker" });
  }

  // Build full URLs for the API requests
  const fullTimeSeriesUrl = `${timeSeriesUrl}${ticker}&interval=60min&apikey=${apiKey}`;
  const fullSearchUrl = `${searchUrl}${ticker}&apikey=${apiKey}`;

  try {
    // Perform concurrent API requests
    const [timeSeriesResponse, searchResponse] = await Promise.all([
      axios.get(fullTimeSeriesUrl, { headers: { 'User-Agent': 'axios' } }),
      axios.get(fullSearchUrl, { headers: { 'User-Agent': 'axios' } })
    ]);

    // Process the TIME_SERIES_INTRADAY response
    const timeSeriesData = timeSeriesResponse.data['Time Series (60min)'];
    if (!timeSeriesData) {
      return res.status(500).send({ error: "Failed to retrieve stock price data." });
    }

    // Extract the most recent timestamp and closing price
    const mostRecentTimestamp = Object.keys(timeSeriesData)[0];
    const price = timeSeriesData[mostRecentTimestamp]['4. close'];

    // Process the SYMBOL_SEARCH response to extract the company name
    const bestMatch = searchResponse.data.bestMatches?.[0];
    const companyName = bestMatch ? bestMatch["2. name"] : "Unknown";

    // Respond with the combined stock data
    res.send({
      data: {
        companyName: companyName,
        symbol: ticker.toUpperCase(),
        timestamp: mostRecentTimestamp,
        price: parseFloat(price).toFixed(2), // Format price to 2 decimal places
      }
    });

  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).send({ error: 'Failed to fetch stock data' });
  }
});

export default router; // Export the router instance for use in the application

