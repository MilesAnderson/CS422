/*
Moo-Deng
Authors:
Miles Anderson

Date Created: 24 Nov 2024

Description:
This file, `calcWorth.test.js`, contains unit tests for the `calcWorth` function in the `calcWorthController.js` file. It tests scenarios such as missing user IDs, stock not found on Alpha Vantage, successful net worth calculation, and internal server errors. Mocked database queries and API responses are used to simulate various conditions.
*/

import { calcWorth } from '../controllers/calcWorthController.js'; // Function under test
import { pool } from '../db.js'; // Mocked database connection
import axios from 'axios'; // Mocked HTTP client for API calls

// Define the backend URL using environment variables or a default value
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001/api';

// Mock database and axios
jest.mock('../db.js', () => ({
  pool: {
    query: jest.fn(),
  },
}));
jest.mock('axios');

describe('calcWorth Controller', () => {
  let req, res;

  // Setup mock request and response objects
  beforeEach(() => {
    req = {
      body: {
        user_id: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); // Clear all mocks before each test
  });

  // Test case: Missing user_id
  it('should return 400 if user_id is missing', async () => {
    req.body = {}; // Simulate missing user_id
    await calcWorth(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid user_id" });
  });

  // Test case: Stock not found on Alpha Vantage
  it('should return 404 if a stock is not found on Alpha Vantage', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ balance: 1000 }] }); // Mock portfolio balance
    axios.post.mockResolvedValueOnce({ data: [{ symbol: 'AAPL', quantity: 5 }] }); // Mock portfolio stocks
    axios.get.mockResolvedValueOnce({ data: {} }); // Simulate stock not found

    await calcWorth(req, res);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/stocks?q=AAPL`);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Stock not found on Alpha Vantage Platform" });
  });

  // Test case: Successful net worth calculation
  it('should calculate net worth correctly', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ balance: 1000 }] }); // Mock portfolio balance
    axios.post.mockResolvedValueOnce({
      data: [
        { symbol: 'AAPL', quantity: 5 },
        { symbol: 'TSLA', quantity: 2 },
      ],
    }); // Mock portfolio stocks
    axios.get
      .mockResolvedValueOnce({ data: { data: { price: 150 } } }) // Mock price for AAPL
      .mockResolvedValueOnce({ data: { data: { price: 700 } } }); // Mock price for TSLA

    await calcWorth(req, res);

    const expectedNetWorth = 1000 + 5 * 150 + 2 * 700; // Calculate net worth
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully calculated net worth",
      net_worth: expectedNetWorth,
    });
  });

  // Test case: Internal server error
  it('should return 500 on server error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error')); // Mock database error

    await calcWorth(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ err: "Internal Server Error" });
  });
});
