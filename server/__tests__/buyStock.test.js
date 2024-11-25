import { buyStock } from '../controllers/buyStockController.js';
import { pool } from '../db.js';
import axios from 'axios';

jest.mock('../db.js', () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.mock('axios');

describe('buyStock Controller', () => {
  let req, res;

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

    jest.clearAllMocks();
  });

  it('should return 400 if required fields are missing', async () => {
    req.body = {};
    await buyStock(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
  });

  it('should return 400 if user is not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    await buyStock(req, res);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM portfolios WHERE user_id=$1', [1]);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it('should return 400 if user balance is insufficient', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ portfolio_id: 1, balance: 100 }],
    });

    await buyStock(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Insufficient balance" });
  });

  it('should return 400 if portfolio update fails', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ portfolio_id: 1, balance: 1000 }],
    });
    axios.put.mockResolvedValueOnce({ status: 400 });

    await buyStock(req, res);
    expect(axios.put).toHaveBeenCalledWith('http://localhost:5000/api/portfolios/1', { ammount: -300 });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid portfolio_id or ammount" });
  });

  it('should successfully purchase stock', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ portfolio_id: 1, balance: 1000 }],
    });
    axios.put.mockResolvedValueOnce({ status: 200 });
    axios.post.mockResolvedValueOnce({}); // For the trade
    axios.get.mockResolvedValueOnce({ data: { symbol: null } });
    axios.post.mockResolvedValueOnce({}); // For creating stock

    await buyStock(req, res);

    expect(axios.put).toHaveBeenCalledWith('http://localhost:5000/api/portfolios/1', { ammount: -300 });
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/trades', {
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

  it('should return 500 on server error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    await buyStock(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});

