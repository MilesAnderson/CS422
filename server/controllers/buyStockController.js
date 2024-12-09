/*
Moo-Deng
Authors:
Andrew Chan
Jake Kolster

Date Created: 16 Nov 2024

Description:
This file, `buyStockController.js`, provides functionality for purchasing stocks. It validates user inputs, checks for sufficient balance in the user's portfolio, updates the portfolio balance, records the transaction, and ensures the stock exists or is updated in the database. This file is part of the stock system. It houses the functionality for buying a stock.
*/

import { pool } from '../db.js'; // Database connection pool for querying and updating portfolios
import axios from 'axios'; // HTTP client for making external API requests

// Define the backend URL using environment variables or a default value
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001/api';

/**
 * Function: buyStock
 * Handles the purchase of stocks for a user's portfolio.
 * Arguments:
 * - req: The HTTP request object. Should contain `user_id`, `symbol`, `curr_price`, and `quantity` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response with the updated balance and a success message if the purchase is successful.
 */
const buyStock = async (req, res) => {
  try {
    const { user_id, symbol, curr_price, quantity } = req.body;

    // Validate input fields
    if (!user_id || !symbol || !curr_price || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Retrieve the portfolio for the user
    const result = await pool.query('SELECT * FROM portfolios WHERE user_id=$1', [user_id]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }
    const portfolio_id = result.rows[0].portfolio_id;

    // Calculate the total cost of the purchase
    const totalCost = curr_price * quantity;

    // Check if the user has sufficient balance
    const currentBalance = result.rows[0].balance;
    if (currentBalance < totalCost) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct the total cost from the user's portfolio balance
    const changeBalRes = await axios.put(`${API_URL}/portfolios/${portfolio_id}`, { ammount: -totalCost });
    if (changeBalRes.status === 400) {
      return res.status(400).json({ error: "Invalid portfolio ID or amount" });
    }

    // Record the buy transaction
    await axios.post(`${API_URL}/trades`, {
      portfolio_id,
      symbol,
      trade_type: "BUY",
      quantity,
      price_per_share: curr_price,
    });

    // Ensure the stock exists in the database or update its current price
    const stockRes = await axios.get(`${API_URL}/stock?q=${symbol}`);
    if (!stockRes.data.symbol) {
      // Add stock if it doesn't exist
      await axios.post(`${API_URL}/stock`, { symbol, curr_price });
    } else {
      // Update the stock's current price
      await axios.put(`${API_URL}/stock/${stockRes.data.stock_id}`, { curr_price });
    }

    // Respond with success
    res.status(200).json({
      message: `Successfully purchased ${quantity} shares of ${symbol}`,
      balance: currentBalance - totalCost,
      success: "true",
    });
  } catch (err) {
    console.error("Error purchasing stock:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { buyStock };
