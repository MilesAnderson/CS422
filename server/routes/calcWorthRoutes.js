/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 20 Nov 2024

Description:
This file, `calcWorthRoutes.js`, defines the routing endpoint for calculating a user's net worth. It includes a route for calculating the net worth by delegating the logic to the corresponding controller function. This file is apart of the portfolio system. It provides routes for the calcWorth controller.
*/

import express from 'express'; // Web framework for creating HTTP routes
const router = express.Router(); // Router instance for defining net worth calculation routes
import { calcWorth } from '../controllers/calcWorthController.js'; // Controller function for calculating net worth

// Route: Calculate user net worth
// Method: POST
// Endpoint: /calcWorth
// Delegates to the `calcWorth` function in the controller
router.post('/calcWorth', calcWorth);

export default router; // Export the router instance for use in the application

