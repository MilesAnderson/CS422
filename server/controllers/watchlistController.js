/*
Moo-Deng
Authors:
Liam Bouffard
Andrew Chan

Date Created: 22 Oct 2024

Description:
This file, `watchlistController.js`, contains functionality to manage user watchlists in a stock-tracking application. It includes methods for adding stocks to a watchlist, removing stocks from a watchlist, and fetching the watchlist for a specific user. The file interacts with a database and an external stock API to ensure accurate stock information is maintained. This file is apart of the watchlist system. It provides the functionality for the watchlist.
*/

import { pool } from '../db.js'; // Database connection pool for querying and updating database tables
import axios from 'axios'; // HTTP client for making requests to the stock API

/**
 * Function: addWatchlist
 * Adds a stock to a user's watchlist. It ensures the stock exists in the database and adds it if necessary.
 * Arguments:
 * - req: The HTTP request object. Should contain `watchlist_name`, `user_id`, `stock_ticker`, and `curr_price` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response with success or error information, and details of the watchlist entry if successful.
 */
const addWatchlist = async (req, res) => {
    try {
        const { watchlist_name, user_id, stock_ticker, curr_price } = req.body;

        // Validate required fields
        if (!user_id) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Check or update stock information in the database
        let stockRes = await axios.get(`http://localhost:5000/api/stock?q=${stock_ticker}`); // Fetch stock by symbol
        if (!stockRes.data.symbol) {
            // Add stock if it doesn't exist
            await axios.post(`http://localhost:5000/api/stock`, { symbol: stock_ticker, curr_price });
        } else {
            // Update stock if it already exists
            await axios.put(`http://localhost:5000/api/stock/${stockRes.data.stock_id}`, { curr_price });
        }

        // Retrieve stock ID for further processing
        stockRes = await axios.get(`http://localhost:5000/api/stock?q=${stock_ticker}`);
        const stock_id = stockRes.data.stock_id;

        console.log(`addWatchlist/stock_id: ${stock_id}`);

        if (!stock_id) {
            return res.status(400).json({ error: 'Invalid stock ID' });
        }

        // Check if the stock is already in the watchlist
        const existingWatchlist = await pool.query(
            'SELECT * FROM watchlists WHERE user_id = $1 AND stock_id = $2',
            [user_id, stock_id]
        );

        if (existingWatchlist.rows.length > 0) {
            return res.status(200).json({
                error: 'Stock is already in the user\'s watchlist',
                data: existingWatchlist.rows[0],
            });
        }

        // Add the stock to the watchlist
        const stockResult = await pool.query(
            'INSERT INTO watchlists (name, user_id, stock_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [watchlist_name, user_id, stock_id]
        );

        res.status(200).json({
            success: true,
            message: `Stock ${stock_ticker} added to watchlist for user ${user_id}`,
            data: stockResult.rows[0],
        });
    } catch (err) {
        console.error('Error adding stock to watchlist:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Function: removeWatchlist
 * Removes a stock from a user's watchlist based on the stock symbol.
 * Arguments:
 * - req: The HTTP request object. Should contain `user_id` and `stock_symbol` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response indicating success or error.
 */
const removeWatchlist = async (req, res) => {
    try {
        const { user_id, stock_symbol } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'Invalid user ID' });
        } else if (!stock_symbol) {
            return res.status(400).json({ error: 'Invalid stock symbol' });
        }

        // Retrieve stock ID from the stocks table
        const stockResult = await pool.query('SELECT stock_id FROM stocks WHERE symbol = $1', [stock_symbol]);
        if (stockResult.rows.length === 0) {
            return res.status(404).json({ error: `Stock symbol ${stock_symbol} not found` });
        }

        const stock_id = stockResult.rows[0].stock_id;

        // Remove the stock from the watchlist
        const deleteResult = await pool.query('DELETE FROM watchlists WHERE user_id = $1 AND stock_id = $2', [user_id, stock_id]);

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: 'Watchlist entry not found for this user and stock' });
        }

        res.status(200).send({
            message: `Stock ${stock_symbol} removed from watchlist for user ${user_id}`,
            success: 'true',
        });
    } catch (err) {
        console.error('Error removing stock from watchlist:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Function: watchlist
 * Retrieves a user's watchlist, listing all stock symbols.
 * Arguments:
 * - req: The HTTP request object. Should contain `user_id` in `req.params`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the user's watchlist or an error if not found.
 */
const watchlist = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Query database for the user's watchlist
        const watchlistResult = await pool.query(
            'SELECT s.symbol FROM watchlists w JOIN stocks s ON w.stock_id = s.stock_id WHERE w.user_id = $1',
            [user_id]
        );

        if (watchlistResult.rows.length === 0) {
            return res.status(404).send({ message: 'Watchlist not found for this user' });
        }

        const watchlist = watchlistResult.rows.map(row => row.symbol);

        res.status(200).send({ user_id, watchlist });
    } catch (err) {
        console.error('Error fetching watchlist:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { addWatchlist, removeWatchlist, watchlist };

