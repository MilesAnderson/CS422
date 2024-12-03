/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 23 Nov 2024

Description:
This file, `signUpRoutes.js`, defines the routing endpoint for user sign-up functionality. It includes a route for creating a new user account by delegating the logic to the corresponding controller function. This file is apart of the users system. It provides routes for the signUp controller.
*/

import express from 'express'; // Web framework for creating HTTP routes
const router = express.Router(); // Router instance for defining user sign-up routes
import { signUp } from '../controllers/signUpController.js'; // Controller function for user sign-up

// Route: User sign-up
// Method: POST
// Endpoint: /signUp
// Delegates to the `signUp` function in the controller
router.post('/signUp', signUp);

export default router; // Export the router instance for use in the application

