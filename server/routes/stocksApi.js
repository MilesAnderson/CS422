import express from 'express';
import axios from 'axios';
import 'dotenv/config';

const router = express.Router();
const apiKey = process.env.API_KEY;

const timeSeriesUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=';
const searchUrl = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=';

router.get('/', async (req, res) => {
  const ticker = req.query.q;
  if (!ticker) {
    return res.status(400).send({ message: "We need a stock ticker" });
  }

  // Build URLs for both TIME_SERIES and SYMBOL_SEARCH requests
  const fullTimeSeriesUrl = `${timeSeriesUrl}${ticker}&interval=60min&apikey=${apiKey}`;
  const fullSearchUrl = `${searchUrl}${ticker}&apikey=${apiKey}`;

  try {
    // Perform both requests concurrently
    const [timeSeriesResponse, searchResponse] = await Promise.all([
      axios.get(fullTimeSeriesUrl, { headers: { 'User-Agent': 'axios' } }),
      axios.get(fullSearchUrl, { headers: { 'User-Agent': 'axios' } })
    ]);

    // Process the TIME_SERIES response
    const timeSeriesData = timeSeriesResponse.data['Time Series (60min)'];
    if (!timeSeriesData) {
      return res.status(500).send({ error: "Failed to retrieve stock price data." });
    }
    const timestamps = Object.keys(timeSeriesData);
    const lastTimestamp = timestamps[timestamps.length - 1];
    const price = timeSeriesData[lastTimestamp]['4. close'];

    // Process the SYMBOL_SEARCH response to get the company name
    const bestMatch = searchResponse.data.bestMatches?.[0];
    const companyName = bestMatch ? bestMatch["2. name"] : "Unknown";

    // Send the combined data as the response
    res.send({
      data: {
        companyName: companyName,
        symbol: ticker.toUpperCase(),
        timestamp: lastTimestamp,
        price: parseFloat(price).toFixed(2) // Format price to 2 decimal places
      }
    });

  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).send({ error: 'Failed to fetch stock data' });
  }
});

export default router;
