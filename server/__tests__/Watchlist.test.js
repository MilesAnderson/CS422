/*
Moo-Deng
Authors:
Liam Bouffard

Date Created: 7 Nov 2024

Description:
This file, `Watchlist.test.js`, contains unit tests for the watchlist-related routes in the API. It validates the behavior of adding items to the watchlist, removing items from the watchlist, and handling various error scenarios. Mocked database queries and HTTP requests are used to simulate the interactions.
*/

const request = require('supertest'); // Simulates HTTP requests for testing API endpoints
const app = require('../server.js'); // Express application being tested
import { pool } from '../db.js'; // Mocked database connection

// Test cases for adding an item to the watchlist
describe('POST /api/watchlist/addWatchlist', () => {
    let user_id, stock_id;

    // Setup before running tests
    beforeAll(async () => {
        // Insert a test user and retrieve the user_id
        const userRes = await pool.query(
            'INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING user_id',
            ['testuser', 'testuser@example.com', 'password123']
        );
        user_id = userRes.rows[0].user_id;

        // Insert a test stock and retrieve the stock_id
        const stockRes = await pool.query(
            'INSERT INTO stocks (symbol, curr_price, created_at) VALUES ($1, $2, NOW()) RETURNING stock_id',
            ['AAPL', 150.00]
        );
        stock_id = stockRes.rows[0].stock_id;

        // Insert an initial watchlist entry for setup
        await pool.query(
            'INSERT INTO watchlists (name, user_id, stock_id, created_at) VALUES ($1, $2, $3, NOW())',
            ['faang', user_id, stock_id]
        );
    });

    // Cleanup after tests
    afterAll(async () => {
        await pool.query('DELETE FROM watchlists WHERE user_id = $1 AND stock_id = $2', [user_id, stock_id]);
        await pool.query('DELETE FROM stocks WHERE symbol = $1', ['AAPL']);
        await pool.query('DELETE FROM users WHERE username = $1', ['testuser']);
    });

    it('should add an item to the watchlist and return the correct response', async () => {
        const response = await request(app).post('/api/watchlist/addWatchlist')
            .send({ name: 'faang', user_id: user_id, stock_id: stock_id });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
    });
});

// Test cases for removing an item from the watchlist
describe('POST /api/watchlist/removeWatchlist', () => {
    let user_id, stock_id;

    beforeAll(async () => {
        const userRes = await pool.query(
            'INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING user_id',
            ['testuser', 'testuser@example.com', 'password123']
        );
        user_id = userRes.rows[0].user_id;

        const stockRes = await pool.query(
            'INSERT INTO stocks (symbol, curr_price, created_at) VALUES ($1, $2, NOW()) RETURNING stock_id',
            ['AAPL', 150.00]
        );
        stock_id = stockRes.rows[0].stock_id;

        await pool.query(
            'INSERT INTO watchlists (name, user_id, stock_id, created_at) VALUES ($1, $2, $3, NOW())',
            ['faang', user_id, stock_id]
        );
    });

    afterAll(async () => {
        await pool.query('DELETE FROM watchlists WHERE user_id = $1 AND stock_id = $2', [user_id, stock_id]);
        await pool.query('DELETE FROM stocks WHERE symbol = $1', ['AAPL']);
        await pool.query('DELETE FROM users WHERE username = $1', ['testuser']);
        await pool.end();
    });

    it('should remove an item from the watchlist and return the correct response', async () => {
        const response = await request(app).post('/api/watchlist/removeWatchlist')
            .send({ user_id: user_id, stock_symbol: 'AAPL' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', `Stock AAPL removed from watchlist for user ${user_id}`);
    });

    it('should return an error if stock is not found in the watchlist', async () => {
        const response = await request(app).post('/api/watchlist/removeWatchlist')
            .send({ user_id: user_id, stock_symbol: 'GOOG' });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Stock symbol GOOG not found');
    });

    it('should return an error if the stock symbol is invalid', async () => {
        const response = await request(app).post('/api/watchlist/removeWatchlist')
            .send({ user_id: user_id, stock_symbol: '' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid stock symbol');
    });
});

