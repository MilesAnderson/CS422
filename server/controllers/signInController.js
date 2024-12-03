/*
Moo-Deng
Authors:
Andrew Chan
Jake Kolster

Date Created: 23 Nov 2024

Description:
This file, `signInController.js`, provides functionality for user sign-in. It validates user credentials (username, email, and password), ensuring the details match an existing user in the database. Password verification is securely handled using bcrypt. This file is apart of the user system. It builds on and works as a backup for the user controller.
*/

import axios from 'axios'; // HTTP client for making external API requests (unused in this file)
import { pool } from '../db.js'; // Database connection pool for querying the users table
import bcrypt from 'bcrypt'; // Library for securely comparing hashed passwords

/**
 * Function: signIn
 * Handles the user sign-in process, validating the provided credentials.
 * Arguments:
 * - req: The HTTP request object. Should contain `username`, `email`, and `password` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the user's `username` and `user_id` if the sign-in is successful.
 */
const signIn = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Invalid credentials given in request" });
        }

        // Retrieve user by email
        const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

        // Check if the email exists
        if (!result.rows[0]?.email) {
            return res.status(400).json({ error: "No user associated with that email" });
        }

        // Check if the username matches
        if (username.localeCompare(result.rows[0].username) !== 0) {
            return res.status(400).json({ error: "Wrong username given with email" });
        }

        // Verify the password
        if (!await bcrypt.compare(password, result.rows[0].password)) {
            return res.status(400).json({ error: "Wrong password given with email" });
        }

        // Respond with success and user details
        res.status(200).json({
            message: "Successfully signed in",
            username: username,
            user_id: result.rows[0].user_id,
        });
    } catch (err) {
        console.error("Something went wrong during sign-in:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { signIn };

