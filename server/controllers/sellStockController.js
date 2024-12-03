/*
Moo-Deng
Authors:
Andrew Chan
Jake Kolster

Date Created: 19 Nov 2024

Description:
This file, `sellStockController.js`, provides functionality for selling stocks from a user's portfolio. It validates input, ensures the stock exists in the user's portfolio, updates the portfolio balance, records the transaction, and updates stock prices in the database. This file is apart of the stock system. It houses the function used for selling a stock.
*/

import { pool } from "../db.js"; // Database connection pool for interacting with the portfolios table
import axios from 'axios'; // HTTP client for making external API requests

/**
 * Function: sellStock
 * Handles the sale of a stock from a user's portfolio.
 * Arguments:
 * - req: The HTTP request object. Should contain `user_id`, `symbol`, `curr_price`, and `quantity` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response indicating success, the updated portfolio balance, and a success message.
 */
const sellStock = async (req, res) => {
    try {
        const { user_id, symbol, curr_price, quantity } = req.body;

        // Validate input fields
        if (!user_id || !symbol || !curr_price || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const increase = curr_price * quantity;

        // Retrieve the portfolio ID for the user
        const result = await pool.query('SELECT * FROM portfolios WHERE user_id=$1', [user_id]);
        const portfolio_id = result.rows[0]?.portfolio_id;

        if (!portfolio_id) {
            return res.status(400).json({ error: "Invalid Portfolio ID" });
        }

        // Check if the stock exists in the user's portfolio
        const portRes = await axios.post(`http://localhost:5000/api/getPortfolioStocks`, { user_id });
        const in_portfolio = portRes.data.some(stock => stock.symbol === symbol);

        if (!in_portfolio) {
            return res.status(400).json({ error: "Stock not in portfolio" });
        }

        // Update the portfolio balance by increasing it with the sale amount
        const changeBalRes = await axios.put(`http://localhost:5000/api/portfolios/${portfolio_id}`, { ammount: increase });

        if (changeBalRes.status === 400) {
            return res.status(400).json({ error: "Invalid portfolio ID or amount" });
        }

        // Record the sale transaction
        const tradeRes = await axios.post(`http://localhost:5000/api/trades`, {
            portfolio_id,
            symbol,
            trade_type: "SELL",
            quantity,
            price_per_share: curr_price,
        });

        // Ensure the stock exists in the stocks table and update its current price
        const stockRes = await axios.get(`http://localhost:5000/api/stock?q=${symbol}`);
        if (!stockRes.data.symbol) {
            return res.status(400).json({ error: "Stock not in stocks table" });
        } else {
            await axios.put(`http://localhost:5000/api/stock/${stockRes.data.stock_id}`, { curr_price });
        }

        // Return success response
        res.status(200).json({
            message: `Successfully sold ${quantity} shares of ${symbol}`,
            balance: changeBalRes.data.data,
            success: 'true',
        });
    } catch (err) {
        console.error("Something went wrong when selling stock:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { sellStock };

