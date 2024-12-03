/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 23 Oct 2024

Description:
This file, `userController.js`, provides functionality to manage users in the application. It includes methods to create, read, update, and delete user information, as well as authenticate users. Passwords are securely hashed using bcrypt, and interactions with the database are performed using SQL queries. This file is apart of the users system. It houses basic functinality for handling users.
*/

import { pool } from '../db.js'; // Database connection pool for querying and updating the users table
import bcrypt from 'bcrypt'; // Library for hashing and verifying passwords securely

/**
 * Function: hashPassword
 * Hashes a plaintext password for secure storage.
 * Arguments:
 * - password: The plaintext password to be hashed.
 * Returns:
 * - A promise resolving to the hashed password.
 */
const hashPassword = async (password) => {
  const saltRounds = 10; // Number of salt rounds for bcrypt
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Function: getAllUsers
 * Fetches all users from the database.
 * Arguments:
 * - req: The HTTP request object.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing an array of user records.
 */
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Function: createUser
 * Creates a new user in the database with a hashed password.
 * Arguments:
 * - req: The HTTP request object. Should contain `username`, `email`, and `password` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the newly created user record.
 */
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password); // Hash the password
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Function: updateUser
 * Updates user information in the database.
 * Arguments:
 * - req: The HTTP request object. Should contain `id` in `req.params` and `username`, `email` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing the updated user record.
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name: username, email } = req.body;
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
      [username, email, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Function: deleteUser
 * Deletes a user from the database.
 * Arguments:
 * - req: The HTTP request object. Should contain `id` in `req.params`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response indicating the user has been deleted.
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Function: authenticateUser
 * Authenticates a user by verifying the email and password.
 * Arguments:
 * - req: The HTTP request object. Should contain `email` and `password` in `req.body`.
 * - res: The HTTP response object used to send the response back to the client.
 * Returns:
 * - A JSON response containing a success message and the authenticated user record, or an error message if authentication fails.
 */
const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.json({ message: 'Authentication successful', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { getAllUsers, createUser, updateUser, deleteUser, authenticateUser };

