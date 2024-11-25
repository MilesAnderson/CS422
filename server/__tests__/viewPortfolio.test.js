// Import dependencies
import { getPortfolioStocks } from '../controllers/viewPortfolioController';
import { pool } from '../db.js';

jest.mock('../db.js', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('getPortfolioStocks', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if user_id is missing', async () => {
        await getPortfolioStocks(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('should return the portfolio stocks for a valid user_id', async () => {
        req.body.user_id = 1;

        pool.query.mockResolvedValueOnce({
            rows: [
                { symbol: 'AAPL', trade_type: 'buy', quantity: 5 },
                { symbol: 'GOOGL', trade_type: 'sell', quantity: 2 },
                { symbol: 'AAPL', trade_type: 'sell', quantity: 3 },
                { symbol: 'MSFT', trade_type: 'buy', quantity: 10 },
            ],
        });

        await getPortfolioStocks(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            `SELECT t.symbol, t.trade_type, t.quantity
             FROM trades t
             JOIN portfolios p ON t.portfolio_id = p.portfolio_id
             WHERE p.user_id = $1`,
            [1]
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            { symbol: 'AAPL', quantity: 2 },
            { symbol: 'MSFT', quantity: 10 },
        ]);
    });

    it('should handle server errors gracefully', async () => {
        req.body.user_id = 1;

        pool.query.mockRejectedValueOnce(new Error('Database error'));

        await getPortfolioStocks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});

