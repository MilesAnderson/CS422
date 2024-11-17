import { pool } from '../db.js'

const buyStock = async (req, res) => {
  try {
    const { user_id, symbol, price, quantity } = req.body;

    // Validate input
    if (!user_id || !symbol || !price || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate total cost of the stock purchase
    const totalCost = price * quantity;

    // Get current balance from the user's portfolio
    const result = await pool.query('SELECT balance FROM portfolios WHERE user_id=$1', [user_id]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }
    const currentBalance = result.rows[0].balance;

    // Check if the user has enough balance
    if (currentBalance < totalCost) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct the total cost from the user's balance
    const newBalance = currentBalance - totalCost;
    await pool.query('UPDATE portfolios SET balance=$1 WHERE user_id=$2', [newBalance, user_id]);

    // Add the stock purchase to the user's portfolio (simulated by adding stock quantity)
    // For simplicity, we'll just store the stock symbol and quantity in a portfolio_stock table
    await pool.query('INSERT INTO portfolio_stocks (user_id, symbol, quantity) VALUES ($1, $2, $3)', [user_id, symbol, quantity]);

    // Send a success response
    res.status(200).json({
      message: `Successfully purchased ${quantity} shares of ${symbol}`,
      newBalance
    });
  } catch (err) {
    console.error("Error purchasing stock:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { buyStock };