/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 28 Oct 2024

Description:
This file, `tradeRoutes.js`, defines the routing endpoints for managing trade transactions. It includes routes to create, delete, and retrieve trades, either for an entire portfolio or specific trades. These routes delegate the logic to corresponding controller functions. This file is apart of the trades system. It provides the routes for the transaction controller.
*/

import express from 'express'; // Web framework for creating HTTP routes
const router = express.Router(); // Router instance for defining trade-related routes
import { addTrade, deletePortfolioTrades, deleteTrade, getPortfolioTrades, getTrade } from '../controllers/transactionController.js'; // Controller functions for trade management

// Route: Add a new trade
// Method: POST
// Endpoint: /trades
// Delegates to the `addTrade` function in the controller
router.post('/trades', addTrade);

// Route: Delete all trades associated with a portfolio
// Method: DELETE
// Endpoint: /trades
// Delegates to the `deletePortfolioTrades` function in the controller
router.delete('/trades', deletePortfolioTrades);

// Route: Delete a specific trade by trade ID
// Method: DELETE
// Endpoint: /trades/:id
// Delegates to the `deleteTrade` function in the controller
router.delete('/trades/:id', deleteTrade);

// Route: Get all trades associated with a portfolio
// Method: GET
// Endpoint: /trades
// Delegates to the `getPortfolioTrades` function in the controller
router.get('/trades', getPortfolioTrades);

// Route: Get a specific trade by trade ID
// Method: GET
// Endpoint: /trades/:id
// Delegates to the `getTrade` function in the controller
router.get('/trades/:id', getTrade);

export default router; // Export the router instance for use in the application

