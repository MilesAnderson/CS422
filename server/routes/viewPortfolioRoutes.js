/*
Moo-Deng
Authors:
Miles Anderson
Liam Bouffard

Date Created: 18 Nov 2024

Description:
This file, `viewPortfolioRoutes.js`, defines the routing endpoint for viewing a user's portfolio stocks. It includes a route to retrieve the stocks associated with a user's portfolio by delegating the logic to the corresponding controller function. This file is apart of the portfolio system. It provides the routes for the viewPortfolio Controller.
*/

import express from 'express'; // Web framework for creating HTTP routes
const router = express.Router(); // Router instance for defining routes
import { getPortfolioStocks } from '../controllers/viewPortfolioController.js'; // Controller function for retrieving portfolio stocks

// Route: Get stocks in a user's portfolio
// Method: POST
// Endpoint: /getPortfolioStocks
// Delegates to the `getPortfolioStocks` function in the controller
router.post('/getPortfolioStocks', getPortfolioStocks);

export default router; // Export the router instance for use in the application

