import { calcWorth } from '../controllers/calcWorthController.js';
import { pool } from '../db.js';
import axios from 'axios';

jest.mock('../db.js', () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.mock('axios');

describe('calcWorth Controller', () => {
  let req, res;

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

    jest.clearAllMocks();
  });

  it('should return 400 if user_id is missing', async () => {
    req.body = {};
    await calcWorth(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid user_id" });
  });

  it('should return 404 if a stock is not found on Alpha Vantage', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ balance: 1000 }],
    });
    axios.post.mockResolvedValueOnce({
      data: [{ symbol: 'AAPL', quantity: 5 }],
    });
    axios.get.mockResolvedValueOnce({ data: {} }); // Simulate stock not found

    await calcWorth(req, res);

    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/stocks?q=AAPL');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Stock not found on Alpha Vantage Platform" });
  });

  it('should calculate net worth correctly', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ balance: 1000 }],
    });
    axios.post.mockResolvedValueOnce({
      data: [
        { symbol: 'AAPL', quantity: 5 },
        { symbol: 'TSLA', quantity: 2 },
      ],
    });
    axios.get
      .mockResolvedValueOnce({
        data: { data: { price: 150 } }, // Price for AAPL
      })
      .mockResolvedValueOnce({
        data: { data: { price: 700 } }, // Price for TSLA
      });

    await calcWorth(req, res);

    const expectedNetWorth = 1000 + 5 * 150 + 2 * 700; // Calculate net worth
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully calculated net worth",
      net_worth: expectedNetWorth,
    });
  });

  it('should return 500 on server error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    await calcWorth(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ err: "Internal Server Error" });
  });
});

