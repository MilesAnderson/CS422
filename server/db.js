/*
Moo-Deng
Authors:
Miles Anderson
Liam Bouffard
Andrew Chan

Date Created: 8 Oct 2024

Description:
This file, `db.js`, configures the connection to the PostgreSQL database using the `pg` package and environment variables. It provides a connection pool for executing queries efficiently and includes a function to verify the database connection.
*/

import pkg from 'pg'; // PostgreSQL client for Node.js
import dotenv from 'dotenv'; // Library to load environment variables from a `.env` file

dotenv.config(); // Load environment variables from `.env` file

const { Pool } = pkg; // Destructure Pool class from the `pg` package

// Determine the connection string
const connectionString = process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Initialize a connection pool with database configuration
const pool = new Pool({
    connectionString, // Use the constructed connection string
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // Enable SSL only for hosted environments
});

/*
// Initialize a connection pool with database configuration
const pool = new Pool({
    user: process.env.DB_USER, // Database username from environment variables
    host: process.env.DB_HOST, // Database host address
    database: process.env.DB_NAME, // Name of the database
    password: process.env.DB_PASSWORD, // Database password
    port: process.env.DB_PORT, // Port number for database connection
});

/**
 * Function: checkDatabaseConnection
 * Verifies the connection to the database by executing a simple query.
 * Logs a success message if connected, or terminates the process on failure.
 * This function does not run in a `test` environment.
 */
const checkDatabaseConnection = async () => {
    if (process.env.NODE_ENV !== 'test') { // Skip connection check in test environment
        try {
            await pool.query('SELECT NOW()'); // Execute a simple query to verify connection
            console.log('Database connected successfully'); // Log success message
        } catch (err) {
            console.error('Database connection failed', err); // Log error message
            process.exit(1); // Exit the process with a failure code
        }
    }
};

export { pool, checkDatabaseConnection }; // Export the connection pool and the connection check function

