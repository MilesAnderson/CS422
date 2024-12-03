/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 29 Oct 2024

Description:
This file, `stockController.js`, provides functionality to manage stock information. It includes methods to add new stocks, delete stocks by ID, retrieve stock details by ID or symbol, and update stock prices. These operations interact with a relational database using SQL queries. This file is apart of the stock system. It houses basic functinality for manipulating the stocks table. 
*/

import { pool } from '../db.js'; // Database connection pool for querying and updating the stocks table

/**
 * Function: addStock
 * Adds a new stock to the database with its symbol and current price.
 * Arguments:
 * - req: The HTTP request object. Should contain `symbol` and `curr_price` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the newly added stock record.
 */
const addStock = async (req, res) => {
    try {
        const { symbol, curr_price } = req.body;

        // Validate input fields
        if (!symbol) {
            return res.status(400).json({ error: "Invalid symbol" });
        } else if (!curr_price || curr_price < 0.0) {
            return res.status(400).json({ error: "Invalid current price" });
        }

        // Insert stock into database
        const result = await pool.query(
            'INSERT INTO stocks VALUES (DEFAULT, $1, $2, CURRENT_TIMESTAMP) RETURNING *',
            [symbol, curr_price]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Function: deleteStock
 * Deletes a stock from the database using its ID.
 * Arguments:
 * - req: The HTTP request object. Should contain `id` in `req.params`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the deleted stock record.
 */
const deleteStock = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Invalid stock ID" });
        }

        // Delete stock by ID
        const result = await pool.query(
            'DELETE FROM stocks WHERE stock_id=$1 RETURNING *',
            [id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Function: getStockById
 * Retrieves a stock's details using its ID.
 * Arguments:
 * - req: The HTTP request object. Should contain `id` in `req.params`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the stock details.
 */
const getStockById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Invalid stock ID" });
        }

        // Retrieve stock by ID
        const result = await pool.query(
            'SELECT * FROM stocks WHERE stock_id=$1',
            [id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Function: getStockBySymbol
 * Retrieves a stock's details using its symbol.
 * Arguments:
 * - req: The HTTP request object. Should contain the stock symbol as `q` in `req.query`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the stock details.
 */
const getStockBySymbol = async (req, res) => {
    try {
        const symbol = req.query.q;

        if (!symbol) {
            return res.status(400).json({ error: "Invalid stock symbol" });
        }

        // Retrieve stock by symbol
        const result = await pool.query(
            'SELECT * FROM stocks WHERE symbol=$1',
            [symbol]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Function: updatePrice
 * Updates the current price of a stock.
 * Arguments:
 * - req: The HTTP request object. Should contain `id` in `req.params` and `curr_price` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the updated stock record.
 */
const updatePrice = async (req, res) => {
    try {
        const { id } = req.params;
        const { curr_price } = req.body;

        // Validate inputs
        if (!id) {
            return res.status(400).json({ error: "Invalid stock ID" });
        }
        if (!curr_price || curr_price < 0.0) {
            return res.status(400).json({ error: "Invalid price" });
        }

        // Update stock price
        const result = await pool.query(
            'UPDATE stocks SET curr_price=$1 WHERE stock_id=$2 RETURNING *',
            [curr_price, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { addStock, deleteStock, getStockById, getStockBySymbol, updatePrice };

