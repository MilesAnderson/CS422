/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 28 Oct 2024

Description:
This file, `transactionController.js`, provides functionality to manage trade transactions within portfolios. It includes methods to add trades, delete trades by ID or portfolio, retrieve a specific trade, and retrieve all trades for a portfolio. These operations interact with a relational database through SQL queries.
*/

import { pool } from '../db.js'; // Database connection pool for interacting with the trades table

/**
 * Function: addTrade
 * Adds a new trade to the database.
 * Arguments:
 * - req: The HTTP request object. Should contain `portfolio_id`, `symbol`, `trade_type`, `quantity`, and `price_per_share` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the newly added trade record.
 */
const addTrade = async (req, res) => {
    try {
        const { portfolio_id, symbol, trade_type, quantity, price_per_share } = req.body;

        // Validate input fields
        if (!portfolio_id) {
            return res.status(400).json({ error: "Invalid portfolio ID" });
        } else if (!symbol) {
            return res.status(400).json({ error: "Invalid symbol" });
        } else if (!trade_type) {
            return res.status(400).json({ error: "Invalid trade type" });
        } else if (!price_per_share || price_per_share < 0.0) {
            return res.status(400).json({ error: "Invalid current price" });
        } else if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: "Invalid quantity" });
        }

        // Insert trade into database
        const result = await pool.query(
            'INSERT INTO trades VALUES (DEFAULT, $1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *',
            [portfolio_id, symbol, trade_type, quantity, price_per_share]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error adding trade:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Function: deletePortfolioTrades
 * Deletes all trades associated with a portfolio or specific trades by symbol.
 * Arguments:
 * - req: The HTTP request object. Should contain `portfolio_id` and optionally `symbol` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the deleted trade records.
 */
const deletePortfolioTrades = async (req, res) => {
    try {
        const { portfolio_id, symbol } = req.body;

        if (!portfolio_id) {
            return res.status(400).json({ error: "Portfolio ID does not exist" });
        }

        // Delete trades based on provided criteria
        const query = symbol
            ? "DELETE FROM trades WHERE portfolio_id=$1 AND symbol=$2 RETURNING *"
            : "DELETE FROM trades WHERE portfolio_id=$1 RETURNING *";

        const result = await pool.query(query, symbol ? [portfolio_id, symbol] : [portfolio_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error deleting portfolio trades:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Function: deleteTrade
 * Deletes a specific trade by trade ID.
 * Arguments:
 * - req: The HTTP request object. Should contain `id` in `req.params`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the deleted trade record.
 */
const deleteTrade = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Trade ID does not exist" });
        }

        const result = await pool.query(
            'DELETE FROM trades WHERE trade_id=$1 RETURNING *',
            [id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error deleting trade:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Function: getTrade
 * Retrieves a specific trade by trade ID.
 * Arguments:
 * - req: The HTTP request object. Should contain `id` in `req.params`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the trade record.
 */
const getTrade = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Trade ID does not exist" });
        }

        const result = await pool.query(
            'SELECT * FROM trades WHERE trade_id=$1',
            [id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error retrieving trade:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Function: getPortfolioTrades
 * Retrieves all trades for a portfolio and optionally filters by stock symbol.
 * Arguments:
 * - req: The HTTP request object. Should contain `portfolio_id` and optionally `symbol` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the trade records.
 */
const getPortfolioTrades = async (req, res) => {
    try {
        const { portfolio_id, symbol } = req.body;

        if (!portfolio_id) {
            return res.status(400).json({ error: "Portfolio ID does not exist" });
        }

        // Retrieve trades based on provided criteria
        const query = symbol
            ? "SELECT * FROM trades WHERE portfolio_id=$1 AND symbol=$2"
            : "SELECT * FROM trades WHERE portfolio_id=$1";

        const result = await pool.query(query, symbol ? [portfolio_id, symbol] : [portfolio_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error retrieving portfolio trades:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { addTrade, deletePortfolioTrades, deleteTrade, getTrade, getPortfolioTrades };

