/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 28 Oct 2024

Description:
This file, `portfolioRoutes.js`, defines the routing endpoints for managing user portfolios. It includes routes for creating, deleting, retrieving, and updating portfolio balances. These routes delegate their logic to the corresponding controller functions. This file is apart of the portfolio system. It provides routes for the portfolio controller.
*/

import express from 'express'; // Web framework for creating HTTP routes
const router = express.Router(); // Router instance for defining portfolio-related routes
import { createPortfolio, deletePortfolio, getPortfolio, changeBalance } from '../controllers/portfolioController.js'; // Controller functions for portfolio management

// Route: Create a new portfolio
// Method: POST
// Endpoint: /portfolios
// Delegates to the `createPortfolio` function in the controller
router.post('/portfolios', createPortfolio);

// Route: Delete a portfolio by ID
// Method: DELETE
// Endpoint: /portfolios/:id
// Delegates to the `deletePortfolio` function in the controller
router.delete('/portfolios/:id', deletePortfolio);

// Route: Retrieve a portfolio by ID
// Method: GET
// Endpoint: /portfolios/:id
// Delegates to the `getPortfolio` function in the controller
router.get('/portfolios/:id', getPortfolio);

// Route: Update a portfolio balance
// Method: PUT
// Endpoint: /portfolios/:id
// Delegates to the `changeBalance` function in the controller
router.put('/portfolios/:id', changeBalance);

export default router; // Export the router instance for use in the application

