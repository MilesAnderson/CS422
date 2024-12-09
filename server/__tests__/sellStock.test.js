/*
Moo-Deng
Authors:
Miles Anderson

Date Created: 24 Nov 2024

Description:
This file, `sellStock.test.js`, contains unit tests for the `sellStock` function in the `sellStockController.js` file. It tests various scenarios, including missing fields, invalid portfolio IDs, stock absence, balance update failures, database errors, and successful stock sales.
*/

import { sellStock } from '../controllers/sellStockController.js'; // Function under test
import { pool } from '../db.js'; // Mocked database connection
import axios from 'axios'; // Mocked HTTP client for API calls

// Define the backend URL using environment variables or a default value
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001/api';

// Mock database and axios
jest.mock('../db.js', () => ({
  pool: {
    query: jest.fn(), // Mock the query method
  },
}));
jest.mock('axios');

describe('sellStock Controller', () => {
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
    await sellStock(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
  });

  // Test case: Invalid portfolio ID
  it('should return 400 if portfolio_id is invalid', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    await sellStock(req, res);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM portfolios WHERE user_id=$1', [1]);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid Portfolio_id" });
  });

  // Test case: Stock not in portfolio
  it('should return 400 if stock is not in portfolio', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ portfolio_id: 1 }] });
    axios.post.mockResolvedValueOnce({ data: [] });

    await sellStock(req, res);
    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/getPortfolioStocks`, { user_id: 1 });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Stock not in portfolio" });
  });

  // Test case: Balance update failure
  it('should return 400 if portfolio balance update fails', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ portfolio_id: 1 }] });
    axios.post.mockResolvedValueOnce({ data: [{ symbol: 'AAPL' }] });
    axios.put.mockResolvedValueOnce({ status: 400 });

    await sellStock(req, res);
    expect(axios.put).toHaveBeenCalledWith(`${API_URL}/portfolios/1`, { ammount: 300 });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid portfolio_id or ammount" });
  });

  // Test case: Stock not found in database
  it('should return 400 if stock is not found in database', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ portfolio_id: 1 }] });
    axios.post.mockResolvedValueOnce({ data: [{ symbol: 'AAPL' }] });
    axios.put.mockResolvedValueOnce({ status: 200 });
    axios.get.mockResolvedValueOnce({ data: {} });

    await sellStock(req, res);
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/stock?q=AAPL`);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Stock not in stocks table " });
  });

  // Test case: Successful stock sale
  it('should successfully sell stock', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ portfolio_id: 1 }] });
    axios.post.mockResolvedValueOnce({ data: [{ symbol: 'AAPL' }] });
    axios.put.mockResolvedValueOnce({ status: 200, data: { data: 1300 } }); // New balance
    axios.get.mockResolvedValueOnce({ data: { symbol: 'AAPL', stock_id: 123 } });
    axios.put.mockResolvedValueOnce({}); // Update stock price

    await sellStock(req, res);

    expect(axios.put).toHaveBeenCalledWith(`${API_URL}/portfolios/1`, { ammount: 300 });
    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/trades`, {
      portfolio_id: 1,
      symbol: 'AAPL',
      trade_type: 'SELL',
      quantity: 2,
      curr_price: 150,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `Successfully sold 2 shares of AAPL`,
      balance: 1300,
    });
  });

  // Test case: Internal server error
  it('should return 500 on server error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    await sellStock(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ err: "Internal Server Error" });
  });
});
