/*
Moo-Deng
Authors:
Andrew Chan
Liam Bouffard
Jake Kolster

Date Created: 22 Oct 2024

Description:
This file, `stockRoutes.js`, defines the routing endpoints for managing stock-related operations. It includes routes for creating, updating, retrieving, and deleting stock records. These routes delegate their logic to the corresponding controller functions. This file is apart of the stocks system. It has the routes for the stock controller.
*/

import express from 'express'; // Web framework for creating HTTP routes
const router = express.Router(); // Router instance for defining stock-related routes
import { addStock, deleteStock, getStockById, getStockBySymbol, updatePrice } from '../controllers/stockController.js'; // Controller functions for stock management

// Route: Add a new stock
// Method: POST
// Endpoint: /stock
// Delegates to the `addStock` function in the controller
router.post('/stock', addStock);

// Route: Delete a stock by ID
// Method: DELETE
// Endpoint: /stock/:id
// Delegates to the `deleteStock` function in the controller
router.delete('/stock/:id', deleteStock);

// Route: Retrieve a stock by ID
// Method: GET
// Endpoint: /stock/:id
// Delegates to the `getStockById` function in the controller
router.get('/stock/:id', getStockById);

// Route: Retrieve a stock by symbol
// Method: GET
// Endpoint: /stock
// Delegates to the `getStockBySymbol` function in the controller
router.get('/stock', getStockBySymbol);

// Route: Update the price of a stock by ID
// Method: PUT
// Endpoint: /stock/:id
// Delegates to the `updatePrice` function in the controller
router.put('/stock/:id', updatePrice);

export default router; // Export the router instance for use in the application

