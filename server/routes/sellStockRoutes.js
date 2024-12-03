/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 19 Nov 2024

Description:
This file, `sellStockRoutes.js`, defines the routing endpoint for selling stocks. It includes a route for handling stock sale transactions by delegating the logic to the corresponding controller function. This file is apart of the trading system. It houses the routes for the sell stock controller.
*/

import express from 'express'; // Web framework for creating HTTP routes
const router = express.Router(); // Router instance for defining stock sale routes
import { sellStock } from "../controllers/sellStockController.js"; // Controller function for selling stocks

// Route: Sell a stock
// Method: POST
// Endpoint: /sellStock
// Delegates to the `sellStock` function in the controller
router.post('/sellStock', sellStock);

export default router; // Export the router instance for use in the application

