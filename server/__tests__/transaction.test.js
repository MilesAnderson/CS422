/*
Moo-Deng
Authors:
Miles Anderson

Date Created: 14 Nov 2024

Description:
This file, `transaction.test.js`, contains unit tests for the transaction-related functions in the `transactionController.js` file. It covers adding, deleting, and retrieving trades, both for specific trades and portfolios, while handling various edge cases and error conditions.
*/

// Import dependencies
import request from 'supertest'; // For testing HTTP endpoints
import { addTrade, deletePortfolioTrades, deleteTrade, getTrade, getPortfolioTrades } from '../controllers/transactionController'; // Functions under test
import { pool } from '../db.js'; // Mocked database connection

// Mock the database connection
jest.mock('../db.js');

describe('Transaction Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    describe('addTrade', () => {
        it('should add a trade and return it', async () => {
            const req = { body: { portfolio_id: 1, symbol: 'AAPL', curr_price: 150, quantity: 10 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            pool.query.mockResolvedValue({
                rows: [{ trade_id: 1, portfolio_id: 1, symbol: 'AAPL', quantity: 10, curr_price: 150 }]
            });

            await addTrade(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                trade_id: 1, portfolio_id: 1, symbol: 'AAPL', quantity: 10, curr_price: 150
            });
        });

        it('should return 400 if portfolio_id is missing', async () => {
            const req = { body: { symbol: 'AAPL', curr_price: 150, quantity: 10 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await addTrade(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid portfolio id' });
        });
    });

    describe('deletePortfolioTrades', () => {
        it('should delete trades by portfolio id', async () => {
            const req = { body: { portfolio_id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            pool.query.mockResolvedValue({ rowCount: 1 });

            await deletePortfolioTrades(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Portfolio trades deleted" });
        });

        it('should return 400 if portfolio_id is missing', async () => {
            const req = { body: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await deletePortfolioTrades(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Portfolio id does not exist' });
        });
    });

    describe('deleteTrade', () => {
        it('should delete a specific trade by id', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

            pool.query.mockResolvedValue({ rowCount: 1 });

            await deleteTrade(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: "Trade deleted from portfolio" });
        });

        it('should return 400 if trade id is missing', async () => {
            const req = { params: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await deleteTrade(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Trade id does not exist' });
        });
    });

    describe('getTrade', () => {
        it('should return a specific trade', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            pool.query.mockResolvedValue({
                rows: [{ trade_id: 1, portfolio_id: 1, symbol: 'AAPL', quantity: 10, curr_price: 150 }]
            });

            await getTrade(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                trade_id: 1, portfolio_id: 1, symbol: 'AAPL', quantity: 10, curr_price: 150
            });
        });

        it('should return 400 if portfolio_id is missing', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await getTrade(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Portfolio id does not exist' });
        });
    });

    describe('getPortfolioTrades', () => {
        it('should return all trades for a portfolio', async () => {
            const req = { body: { portfolio_id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            pool.query.mockResolvedValue({
                rows: [{ trade_id: 1, portfolio_id: 1, symbol: 'AAPL', quantity: 10, curr_price: 150 }]
            });

            await getPortfolioTrades(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{
                trade_id: 1, portfolio_id: 1, symbol: 'AAPL', quantity: 10, curr_price: 150
            }]);
        });

        it('should return 400 if portfolio_id is missing', async () => {
            const req = { body: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await getPortfolioTrades(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Portfolio id does not exist' });
        });
    });
});

