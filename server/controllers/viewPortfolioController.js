/*
Moo-Deng
Authors:
Miles Anderson
Liam Bouffard

Date Created: 18 Nov 2024

Description:
This file, `viewPortfolioController.js`, provides functionality to retrieve the current portfolio of stocks for a specific user. It calculates the net quantity of stocks based on trade data and filters out stocks with zero or negative quantities. The data is fetched from a relational database using SQL queries. This file is apart of the portfolio syste. It houses a function that returns all of the stocks in a users portfolio at a given time.
*/

import { pool } from '../db.js'; // Database connection pool for querying the trades and portfolios tables

/**
 * Function: getPortfolioStocks
 * Fetches the current portfolio of stocks for a specific user by calculating the net quantity of stocks based on trades.
 * Arguments:
 * - req: The HTTP request object. Should contain `user_id` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing an array of stock objects with their symbols and net quantities.
 */
const getPortfolioStocks = async (req, res) => {
    try {
        console.log("Request received:", req.body);
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Query the database to get trade data for the user's portfolio
        const result = await pool.query(
            `SELECT t.symbol, t.trade_type, t.quantity
             FROM trades t
             JOIN portfolios p ON t.portfolio_id = p.portfolio_id
             WHERE p.user_id = $1`,
            [user_id]
        );

        const stocks = {};
        result.rows.forEach(trade => {
            const type = trade.trade_type.toLowerCase();
            if (!stocks[trade.symbol]) {
                stocks[trade.symbol] = 0; // Initialize stock quantity
            }
            // Add or subtract quantity based on trade type
            stocks[trade.symbol] += type === 'buy' ? trade.quantity : -trade.quantity;
        });

        // Filter out stocks with zero or negative net quantities
        const filteredStocks = Object.keys(stocks)
            .filter(symbol => stocks[symbol] > 0)
            .map(symbol => ({ symbol, quantity: stocks[symbol] }));

        res.status(200).json(filteredStocks); // Send the filtered portfolio as response
    } catch (err) {
        console.error("Error in getPortfolioStocks:", err.message);
        res.status(500).json({ error: "Internal Server Error" }); // Handle server errors
    }
};

export { getPortfolioStocks };

