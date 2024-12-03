/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 23 Nov 2024

Description:
This file, `signInRoutes.js`, defines the routing endpoint for user sign-in functionality. It includes a route for authenticating a user by delegating the logic to the corresponding controller function. This file is apart of the user system. It provides routes for the signIn controller.
*/

import express from 'express'; // Web framework for creating HTTP routes
const router = express.Router(); // Router instance for defining user sign-in routes
import { signIn } from '../controllers/signInController.js'; // Controller function for user sign-in

// Route: User sign-in
// Method: POST
// Endpoint: /signIn
// Delegates to the `signIn` function in the controller
router.post('/signIn', signIn);

export default router; // Export the router instance for use in the application

