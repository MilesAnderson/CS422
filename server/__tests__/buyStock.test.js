/*
Moo-Deng
Authors:
Miles Anderson

Date Created: 24 Nov 2024

Description:
This file, `buyStock.test.js`, contains unit tests for the `buyStock` function in the `buyStockController.js` file. It validates scenarios such as missing required fields, user not found, insufficient balance, portfolio update failures, successful stock purchase, and internal server errors.
*/

import { buyStock } from '../controllers/buyStockController.js'; // Function under test
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

describe('buyStock Controller', () => {
  let req, res;

  // Setup mock request and response objects
  beforeEach(() => {
    req = {
      body: {
        user_id: 1,
        symbol: 'AAPL',
        curr_price: 150,
        quantity: 2,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); // Clear all mocks before each test
  });

  // Test case: Missing required fields
  it('should return 400 if required fields are missing', async () => {
    req.body = {};
    await buyStock(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
  });

  // Test case: User not found
  it('should return 400 if user is not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    await buyStock(req, res);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM portfolios WHERE user_id=$1', [1]);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  // Test case: Insufficient balance
  it('should return 400 if user balance is insufficient', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ portfolio_id: 1, balance: 100 }],
    });

    await buyStock(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Insufficient balance" });
  });

  // Test case: Portfolio update failure
  it('should return 400 if portfolio update fails', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ portfolio_id: 1, balance: 1000 }],
    });
    axios.put.mockResolvedValueOnce({ status: 400 });

    await buyStock(req, res);
    expect(axios.put).toHaveBeenCalledWith(`${API_URL}/portfolios/1`, { ammount: -300 });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid portfolio_id or ammount" });
  });

  // Test case: Successful stock purchase
  it('should successfully purchase stock', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ portfolio_id: 1, balance: 1000 }],
    });
    axios.put.mockResolvedValueOnce({ status: 200 });
    axios.post.mockResolvedValueOnce({}); // For the trade
    axios.get.mockResolvedValueOnce({ data: { symbol: null } });
    axios.post.mockResolvedValueOnce({}); // For creating stock

    await buyStock(req, res);

    expect(axios.put).toHaveBeenCalledWith(`${API_URL}/portfolios/1`, { ammount: -300 });
    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/trades`, {
      portfolio_id: 1,
      symbol: 'AAPL',
      trade_type: 'BUY',
      quantity: 2,
      curr_price: 150,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `Successfully purchased 2 shares of AAPL`,
      balace: 700,
    });
  });

  // Test case: Internal server error
  it('should return 500 on server error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    await buyStock(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
