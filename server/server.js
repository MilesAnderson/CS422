const express = require('express'); // Express is used to create a backend server
const cors = require('cors'); // Middleware to allow server to accept requests from other domains (localhost:3000)
require('dotenv').config(); // Loads env vars allowing access to process.env.PORT

const app = express(); // Express application created
const port = process.env.PORT || 5000; 

const apiKey = process.env.API_KEY;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the React frontend
app.use(express.json()); // Parse JSON bodies

'use strict';
const axios = require('axios');

// Base URL for Alpha Vantage API
const baseUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=';

app.get('/api/get-stock-data/:ticker', (req, res) => {
    const { ticker } = req.params;

    if (!ticker) {
        return res.status(418).send({ message: "We need a stock ticker" });
    }

    // Build the complete URL for each request
    const fullUrl = `${baseUrl}${ticker}&interval=60min&apikey=${apiKey}`;

    axios.get(fullUrl, { headers: { 'User-Agent': 'axios' } })
        .then(response => {
            // Check if the response contains the expected time series data
            if (response.data['Time Series (60min)']) {
                const timeSeries = response.data['Time Series (60min)'];
                const timestamps = Object.keys(timeSeries);
                const lastTimestamp = timestamps[timestamps.length - 1];
                const price = timeSeries[lastTimestamp]['4. close']; // Extract the closing price

                console.log(`Price at ${lastTimestamp}: ${price}`); // Log the price

                res.send({
                    data: {
                        timestamp: lastTimestamp,
                        price: price
                    }
                });
            } else {
                // Handle error if time series data is not available
                res.status(500).send({ error: "Failed to retrieve stock data." });
            }
        })
        .catch(error => {
            if (error.response) {
                console.log('Status:', error.response.status);  // Server responded with a status code outside of the 2xx range
            } else if (error.request) {
                console.log('Error:', error.request);  // Request was made but no response received
            } else {
                console.log('Error:', error.message);  // Other errors, like setting up the request
            }
            res.status(500).send({ error: 'Failed to fetch stock data' });
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
