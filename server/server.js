const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db'); // You'll set up your database connection later

app.use(cors());
app.use(express.json()); // to parse incoming JSON

// Routes
app.get('/', (req, res) => {
  res.send('Stock Project Backend');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
