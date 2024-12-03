/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 23 Oct 2024

Description:
This file, `userRoutes.js`, defines the routing endpoints for managing user-related operations. It includes routes for creating, reading, updating, deleting, and authenticating users. These routes delegate their logic to the corresponding controller functions. This file is apart of the user system. It provides the routes for the user controller.
*/

import express from 'express'; // Web framework for creating HTTP routes
const router = express.Router(); // Router instance for defining user-related routes
import { getAllUsers, createUser, updateUser, deleteUser, authenticateUser } from '../controllers/userController.js'; // Controller functions for user management

// Route: Retrieve all users
// Method: GET
// Endpoint: /users
// Delegates to the `getAllUsers` function in the controller
router.get('/users', getAllUsers);

// Route: Create a new user
// Method: POST
// Endpoint: /users
// Delegates to the `createUser` function in the controller
router.post('/users', createUser);

// Route: Update an existing user
// Method: PUT
// Endpoint: /users/:id
// Delegates to the `updateUser` function in the controller
router.put('/users/:id', updateUser);

// Route: Delete a user by ID
// Method: DELETE
// Endpoint: /users/:id
// Delegates to the `deleteUser` function in the controller
router.delete('/users/:id', deleteUser);

// Route: Authenticate a user
// Method: POST
// Endpoint: /users/authenticate
// Delegates to the `authenticateUser` function in the controller
router.post('/users/authenticate', authenticateUser);

export default router; // Export the router instance for use in the application

