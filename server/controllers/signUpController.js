/*
Moo-Deng
Authors:
Andrew Chan
Jake Kolster

Date Created: 23 Nov 2024

Description:
This file, `signUpController.js`, provides functionality for user sign-up. It validates user credentials, ensures no duplicate email exists, creates a user record, and initializes a portfolio for the user. This process involves interactions with a relational database and external API endpoints. This file is part of the user system. It helps to initialize a portfolio for each new user.
*/

import axios from 'axios'; // HTTP client for making requests to external APIs
import { pool } from '../db.js'; // Database connection pool for querying and updating the users table
import bcrypt from 'bcrypt'; // Library for password hashing and security

// Define the backend URL using environment variables or a default value
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001/api';

/**
 * Function: signUp
 * Handles the user sign-up process, including validation, user creation, and portfolio initialization.
 * Arguments:
 * - req: The HTTP request object. Should contain `username`, `email`, and `password` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the user's `username` and `user_id` if the sign-up is successful.
 */
const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Invalid credentials in request" });
        }

        // Check if a user with the same email already exists
        const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (result.rows.length > 0) {
            return res.status(400).json({ error: "A user with that email already exists!" });
        }

        // Create a new user by sending data to the user creation API
        await axios.post(`${API_URL}/users`, {
            username: username,
            email: email,
            password: password,
        });

        // Retrieve the newly created user's ID
        const userRes = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        const user_id = userRes.rows[0].user_id;

        // Initialize a portfolio for the user by sending data to the portfolio creation API
        await axios.post(`${API_URL}/portfolios`, { user_id: user_id });

        // Send success response with user details
        res.status(200).json({
            message: "Successfully signed up",
            username: username,
            user_id: user_id,
        });
    } catch (err) {
        console.error("Something went wrong during sign-up:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { signUp };
