import { sellStock } from '../controllers/sellStockController.js';
import { pool } from '../db.js';
import axios from 'axios';

jest.mock('../db.js', () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.mock('axios');

describe('sellStock Controller', () => {
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
    await sellStock(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
  });

  it('should return 400 if portfolio_id is invalid', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    await sellStock(req, res);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM portfolios WHERE user_id=$1', [1]);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid Portfolio_id" });
  });

  it('should return 400 if stock is not in portfolio', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ portfolio_id: 1 }],
    });
    axios.post.mockResolvedValueOnce({ data: [] });

    await sellStock(req, res);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/getPortfolioStocks', { user_id: 1 });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Stock not in portfolio" });
  });

  it('should return 400 if portfolio balance update fails', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ portfolio_id: 1 }],
    });
    axios.post.mockResolvedValueOnce({
      data: [{ symbol: 'AAPL' }],
    });
    axios.put.mockResolvedValueOnce({ status: 400 });

    await sellStock(req, res);
    expect(axios.put).toHaveBeenCalledWith('http://localhost:5000/api/portfolios/1', { ammount: 300 });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid portfolio_id or ammount" });
  });

  it('should return 400 if stock is not found in database', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ portfolio_id: 1 }],
    });
    axios.post.mockResolvedValueOnce({
      data: [{ symbol: 'AAPL' }],
    });
    axios.put.mockResolvedValueOnce({ status: 200 });
    axios.get.mockResolvedValueOnce({ data: {} });

    await sellStock(req, res);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/stock?q=AAPL');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Stock not in stocks table " });
  });

  it('should successfully sell stock', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ portfolio_id: 1 }],
    });
    axios.post.mockResolvedValueOnce({
      data: [{ symbol: 'AAPL' }],
    });
    axios.put.mockResolvedValueOnce({
      status: 200,
      data: { data: 1300 }, // New balance
    });
    axios.get.mockResolvedValueOnce({
      data: { symbol: 'AAPL', stock_id: 123 },
    });
    axios.put.mockResolvedValueOnce({}); // Update stock price

    await sellStock(req, res);

    expect(axios.put).toHaveBeenCalledWith('http://localhost:5000/api/portfolios/1', { ammount: 300 });
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/trades', {
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

  it('should return 500 on server error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    await sellStock(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ err: "Internal Server Error" });
  });
});

