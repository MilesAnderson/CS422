/*
Moo-Deng
Authors:
Miles Anderson

Date Created: 24 Nov 2024

Description:
This file, `viewPortfolio.test.js`, contains unit tests for the `getPortfolioStocks` function in the `viewPortfolioController.js` file. It tests various scenarios including missing input, successful retrieval of portfolio stocks, and handling server errors.
*/

// Import dependencies
import { getPortfolioStocks } from '../controllers/viewPortfolioController'; // Function under test
import { pool } from '../db.js'; // Mocked database pool

// Mock the database pool
jest.mock('../db.js', () => ({
    pool: {
        query: jest.fn(), // Mock the `query` method
    },
}));

describe('getPortfolioStocks', () => {
    let req, res;

    // Setup mock request and response objects
    beforeEach(() => {
        req = {
            body: {}, // Mock request body
        };
        res = {
            status: jest.fn().mockReturnThis(), // Mock `status` method to allow chaining
            json: jest.fn(), // Mock `json` method
        };
    });

    // Clear all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test case: Missing user_id
    it('should return 400 if user_id is missing', async () => {
        await getPortfolioStocks(req, res);

        expect(res.status).toHaveBeenCalledWith(400); // Expect 400 status code
        expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required' }); // Expect error message
    });

    // Test case: Valid user_id and portfolio data
    it('should return the portfolio stocks for a valid user_id', async () => {
        req.body.user_id = 1; // Set valid user_id in request body

        // Mock database response
        pool.query.mockResolvedValueOnce({
            rows: [
                { symbol: 'AAPL', trade_type: 'buy', quantity: 5 },
                { symbol: 'GOOGL', trade_type: 'sell', quantity: 2 },
                { symbol: 'AAPL', trade_type: 'sell', quantity: 3 },
                { symbol: 'MSFT', trade_type: 'buy', quantity: 10 },
            ],
        });

        await getPortfolioStocks(req, res);

        // Expect database query to be called with correct parameters
        expect(pool.query).toHaveBeenCalledWith(
            `SELECT t.symbol, t.trade_type, t.quantity
             FROM trades t
             JOIN portfolios p ON t.portfolio_id = p.portfolio_id
             WHERE p.user_id = $1`,
            [1]
        );

        // Expect successful response with processed portfolio data
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            { symbol: 'AAPL', quantity: 2 },
            { symbol: 'MSFT', quantity: 10 },
        ]);
    });

    // Test case: Server error
    it('should handle server errors gracefully', async () => {
        req.body.user_id = 1; // Set valid user_id in request body

        // Mock a rejected promise for the database query
        pool.query.mockRejectedValueOnce(new Error('Database error'));

        await getPortfolioStocks(req, res);

        // Expect 500 status code and error message
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
});

