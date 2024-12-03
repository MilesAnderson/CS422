/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 28 Oct 2024

Description:
This file, `portfolioController.js`, provides functionality for managing user portfolios. It includes methods to create and delete portfolios, retrieve portfolio details, and adjust portfolio balances. These operations involve interactions with a relational database using SQL queries. This file is apart of the portfolio syste. It houses basic functionality for manipulating the portfolio table.
*/

import { pool } from '../db.js'; // Database connection pool for querying and updating the portfolios table

/**
 * Function: createPortfolio
 * Creates a new portfolio for a user with an initial balance of $10,000.
 * Arguments:
 * - req: The HTTP request object. Should contain `user_id` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the created portfolio details.
 */
const createPortfolio = async (req, res) => {
    try {
        const { user_id } = req.body;

        // Validate input
        if (!user_id) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Insert a new portfolio into the database
        const result = await pool.query(
            'INSERT INTO portfolios (portfolio_id, user_id, balance, created_at) VALUES (DEFAULT, $1, 10000.0, CURRENT_TIMESTAMP) RETURNING *',
            [user_id]
        );

        res.status(200).json({
            message: "Portfolio Created",
            data: result.rows[0],
        });
    } catch (err) {
        console.error("Something went wrong creating portfolio:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Function: deletePortfolio
 * Deletes a portfolio from the database using its ID.
 * Arguments:
 * - req: The HTTP request object. Should contain `id` in `req.params`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the details of the deleted portfolio.
 */
const deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate input
        if (!id) {
            return res.status(400).json({ error: "Invalid portfolio ID" });
        }

        // Delete the portfolio
        const result = await pool.query('DELETE FROM portfolios WHERE portfolio_id=$1 RETURNING *', [id]);

        res.status(200).json({
            message: "Portfolio deleted",
            data: result.rows[0],
        });
    } catch (err) {
        console.error("Something went wrong deleting portfolio:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Function: getPortfolio
 * Retrieves details of a portfolio by its ID.
 * Arguments:
 * - req: The HTTP request object. Should contain `id` in `req.params`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the portfolio details.
 */
const getPortfolio = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate input
        if (!id) {
            return res.status(400).json({ error: "Invalid portfolio ID" });
        }

        // Retrieve the portfolio
        const result = await pool.query('SELECT * FROM portfolios WHERE portfolio_id=$1', [id]);

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Something went wrong getting portfolio:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Function: changeBalance
 * Adjusts the balance of a portfolio by a specified amount. Supports positive or negative changes.
 * Arguments:
 * - req: The HTTP request object. Should contain `id` in `req.params` and `ammount` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the updated portfolio balance.
 */
const changeBalance = async (req, res) => {
    try {
        const { id } = req.params;
        const { ammount } = req.body;

        // Validate inputs
        if (!id) {
            return res.status(400).json({ error: "Invalid portfolio ID" });
        } else if (ammount == null) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        // Retrieve the current balance
        const result1 = await pool.query('SELECT balance FROM portfolios WHERE portfolio_id=$1', [id]);
        if (result1.rows.length === 0) {
            return res.status(400).json({ error: "Invalid portfolio ID" });
        }

        // Calculate the new balance
        const total = parseFloat(result1.rows[0].balance) + ammount;
        if (total < 0.0) {
            return res.status(400).json({ error: "Amount exceeds portfolio balance" });
        }

        // Update the balance in the database
        const result2 = await pool.query('UPDATE portfolios SET balance=$1 WHERE portfolio_id=$2 RETURNING balance', [total, id]);

        res.status(200).json({
            message: "Portfolio Balance Changed",
            data: parseFloat(result2.rows[0].balance),
        });
    } catch (err) {
        console.error("Something went wrong changing portfolio balance:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { createPortfolio, deletePortfolio, getPortfolio, changeBalance };

