/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 21 Oct 2024

Description:
This file, `userService.js`, contains service functions for user-related operations. It provides utility functions to interact with the backend API for creating and authenticating users.
*/

import axios from 'axios'; // HTTP client for making API requests

// const API_URL = 'http://localhost:5000/api'; // Base URL for the backend API
// Dynamically determine the base URL for the backend API
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Function: createUser
 * Sends a POST request to the backend API to create a new user.
 * 
 * Arguments:
 * - newUser: An object containing the user's registration details (e.g., username, email, password).
 * 
 * Returns:
 * - The response data from the API if the user is created successfully.
 * 
 * Throws:
 * - An error message from the API or a generic error message if the request fails.
 */
export const createUser = async (newUser) => {
  try {
    const response = await axios.post(`${API_URL}/signUp`, newUser); // POST request to the sign-up endpoint
    return response.data; // Return API response data
  } catch (error) {
    // Throw a specific error message or a generic one if none is provided
    throw new Error(error.response.data.error || 'Error creating user');
  }
};

/**
 * Function: authenticateUser
 * Sends a POST request to the backend API to authenticate a user.
 * 
 * Arguments:
 * - credentials: An object containing the user's login details (e.g., email and password).
 * 
 * Returns:
 * - The response data from the API if authentication is successful.
 * 
 * Throws:
 * - An error message from the API or a generic error message if the request fails.
 */
export const authenticateUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/authenticate`, credentials); // POST request to the authenticate endpoint
    return response.data; // Return API response data
  } catch (error) {
    // Throw a specific error message or a generic one if none is provided
    throw new Error(error.response.data.error || 'Error authenticating user');
  }
};

