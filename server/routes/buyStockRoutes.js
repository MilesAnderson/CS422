/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 16 Nov 2024

Description:
This file, `buyStockRoutes.js`, defines the routing endpoint for purchasing stocks. It includes a route for handling stock purchase transactions by delegating the logic to the corresponding controller function. This file is apart of the trades system. It houses the routes for the buyStock controller.
*/

import express from 'express'; // Web framework for creating HTTP routes
const router = express.Router(); // Router instance for defining stock purchase routes
import { buyStock } from '../controllers/buyStockController.js'; // Controller function for buying stocks

// Route: Buy a stock
// Method: POST
// Endpoint: /buyStock
// Delegates to the `buyStock` function in the controller
router.post('/buyStock', buyStock);

export default router; // Export the router instance for use in the application

