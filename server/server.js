// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the React frontend
app.use(express.json()); // Parse JSON bodies

// Example route to fetch a message from the backend
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Example route to handle POST requests
app.post('/api/echo', (req, res) => {
  const { text } = req.body;
  res.json({ echoedText: text });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
