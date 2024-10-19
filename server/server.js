// server.js
const express = require('express'); // express is used to create a backend server
const cors = require('cors'); // middleware to allow server to accept req from other domains (localhost:3000)
require('dotenv').config(); // loads env vars allowing access to process.env.PORT

const app = express(); // express application created
const port = process.env.PORT || 5000; 

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the React frontend
app.use(express.json()); // Parse JSON bodies


'use strict';
const axios = require('axios');

// Replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=5OTOQPZ8DWTIWAYC';

axios.get(url, {
  headers: { 'User-Agent': 'axios' }
})
  .then(response => {
    console.log(response.data);  // Successfully parsed as JSON
  })
  .catch(error => {
    if (error.response) {
      console.log('Status:', error.response.status);  // Server responded with a status code outside of the 2xx range
    } else if (error.request) {
      console.log('Error:', error.request);  // Request was made but no response received
    } else {
      console.log('Error:', error.message);  // Other errors, like setting up the request
    }
  });


// // Example route to fetch a message from the backend
// app.get('/api/message', (req, res) => {
//   res.json({ message: 'Hello from the backend!' });
// });

// // Example route to handle POST requests
// app.post('/api/echo', (req, res) => {
//   const { text } = req.body;
//   res.json({ echoedText: text });
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
