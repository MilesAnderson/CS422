/*
Moo-Deng
Authors:
Miles Anderson
Liam Bouffard
Andrew Chan
Jake Kolster

Date Created: 8 Oct 2024

Description:
This file, `server.js`, sets up and starts the Express.js server for the application. It configures middleware, integrates API routes, handles errors, and verifies the database connection before starting the server.
*/

import express from 'express'; // Web framework for building the server
import path from 'path'; // Utility for handling file and directory paths
import cookieParser from 'cookie-parser'; // Middleware for parsing cookies
import logger from 'morgan'; // Middleware for logging HTTP requests
import cors from 'cors'; // Middleware for enabling Cross-Origin Resource Sharing (CORS)
import createError from 'http-errors'; // Utility for creating HTTP errors
import { checkDatabaseConnection } from './db.js'; // Function to verify the database connection

// Importing route handlers
import stocksApi from './routes/stocksApi.js';
import userRoutes from './routes/userRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import buyStockRoutes from './routes/buyStockRoutes.js';
import sellStockRoutes from './routes/sellStockRoutes.js';
import viewPortfolioRoutes from './routes/viewPortfolioRoutes.js';
import calcWorthRoutes from './routes/calcWorthRoutes.js';
import signInRoutes from './routes/signInRoutes.js';
import signUpRoutes from './routes/signUpRoutes.js';

const app = express(); // Create an instance of an Express application
const port = process.env.PORT || 5000; // Set the server's port, defaulting to 5000

// Middleware configurations
app.use(cors({ origin: 'http://localhost:3000' })); // Enable CORS for the React frontend
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(logger('dev')); // HTTP request logger for development
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Middleware for parsing cookies
app.use(express.static(path.join(path.resolve(), 'public'))); // Serve static files from the "public" directory

// Set the view engine and views directory
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'jade');

// Register API routes
app.use('/api/stocks', stocksApi); // Route for stock APIs
app.use('/api', userRoutes); // Route for user-related APIs
app.use('/api/watchlist', watchlistRoutes); // Route for watchlist APIs
app.use('/api', portfolioRoutes); // Route for portfolio-related APIs
app.use('/api', stockRoutes); // Route for stock table operations
app.use('/api', tradeRoutes); // Route for trade-related APIs
app.use('/api', buyStockRoutes); // Route for buying stocks
app.use('/api', sellStockRoutes); // Route for selling stocks
app.use('/api', viewPortfolioRoutes); // Route for viewing portfolios
app.use('/api', calcWorthRoutes); // Route for calculating net worth
app.use('/api', signInRoutes); // Route for user sign-in
app.use('/api', signUpRoutes); // Route for user sign-up

// Catch 404 errors and forward to the error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler middleware
app.use((err, req, res, next) => {
    res.locals.message = err.message; // Set the error message
    res.locals.error = req.app.get('env') === 'development' ? err : {}; // Show detailed errors only in development

    // Respond with the error page
    res.status(err.status || 500);
    res.render('error');
});

// Function to start the server
const startServer = async () => {
    await checkDatabaseConnection(); // Verify the database connection before starting
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer(); // Initialize the server

export default app; // Export the app for testing or further usage

