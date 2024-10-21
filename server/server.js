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


// retreiving stock data
// Base URL for Alpha Vantage API
const baseUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=';
app.get('/api/get-stock-data/:ticker', (req, res) => {
    const { ticker } = req.params;

    if (!ticker) {
        return res.status(400).send({ message: "We need a stock ticker" });
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

// Add stock to watchlist
app.post('/watchlist/add', (req, res) => {
    // Extract user_id and stock_symbol from the request body
    const { user_id, stock_symbol } = req.body;

    // Validate input
    if (!user_id || !stock_symbol) {
        return res.status(400).send({ message: "We need a stock ticker and user ID" });
    }

    // TODO: Relay data to the database (e.g., INSERT into the watchlist table)
    // Pseudo code for database operation:
    // db.query('INSERT INTO watchlist (user_id, stock_symbol) VALUES (?, ?)', [user_id, stock_symbol]);

    res.status(200).send({ message: `Stock ${stock_symbol} added to watchlist for user ${user_id}` });
});

// Remove stock from watchlist
app.delete('/watchlist/remove', (req, res) => {
    // Extract user_id and stock_symbol from the request body
    const { user_id, stock_symbol } = req.body;

    // Validate input
    if (!user_id || !stock_symbol) {
        return res.status(400).send({ message: "We need a stock ticker and user ID" });
    }

    // TODO: Relay data to the database (e.g., DELETE from the watchlist table)
    // Pseudo code for database operation:
    // db.query('DELETE FROM watchlist WHERE user_id = ? AND stock_symbol = ?', [user_id, stock_symbol]);

    res.status(200).send({ message: `Stock ${stock_symbol} removed from watchlist for user ${user_id}` });
});

// Get a user's watchlist
app.get('/watchlist/:user_id', (req, res) => {
    const { user_id } = req.params; // Extract user_id from the request parameters

    // Validate input
    if (!user_id) {
        return res.status(400).send({ message: "User ID is required" });
    }

    // TODO: Relay data to the database to fetch the user's watchlist
    // Pseudo code for database operation:
    // db.query('SELECT stock_symbol FROM watchlist WHERE user_id = ?', [user_id], (error, results) => {
    //     if (error) {
    //         return res.status(500).send({ message: "Error fetching the watchlist" });
    //     }
    //     if (results.length === 0) {
    //         return res.status(404).send({ message: "Watchlist not found for this user" });
    //     }
    //     res.status(200).send(results); // Send the watchlist as the response
    // });

    // Temporary response (until database connection is set up)
    const sampleWatchlist = ['AAPL', 'TSLA', 'AMZN']; // Replace with actual DB query result
    res.status(200).send({ user_id, watchlist: sampleWatchlist });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
