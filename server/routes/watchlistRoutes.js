/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 29 Oct 2024

Description:
This file, `watchlistRoutes.js`, defines the routing endpoints for managing a user's stock watchlist. It includes routes for adding a stock to the watchlist, removing a stock, and retrieving the watchlist for a specific user. These routes delegate the logic to corresponding controller functions. This file is apart of the watchlist system. It provides routes for the watchlist controller.
*/

import express from 'express'; // Web framework for creating HTTP routes
const router = express.Router(); // Router instance for handling route definitions
import { addWatchlist, removeWatchlist, watchlist } from '../controllers/watchlistController.js'; // Controller functions for watchlist management

// Route: Add a stock to the user's watchlist
// Method: POST
// Endpoint: /addWatchlist
// Delegates to the `addWatchlist` function in the controller
router.post('/addWatchlist', addWatchlist);

// Route: Remove a stock from the user's watchlist
// Method: POST
// Endpoint: /removeWatchlist
// Delegates to the `removeWatchlist` function in the controller
router.post('/removeWatchlist', removeWatchlist);

// Route: Get the user's watchlist
// Method: GET
// Endpoint: /:user_id/watchlist
// Delegates to the `watchlist` function in the controller
router.get('/:user_id/watchlist', watchlist);

export default router; // Export the router instance for use in the application

