const request = require('supertest'); // simulates HTTP requests for testing API endpoints
const app = require('../server.js'); // Your Express app
// const db = require('../db.js'); // Your database connection
import { pool } from '../db.js'; 

// describe is a set of realated tests
// POST... is just a label
describe('POST /api/watchlist/addWatchlist', () => {
    let user_id; // Define user_id and stock_id at the top level for scoping
    let stock_id;
    
    // runs before any tset is exexuted, init database for tests
    beforeAll(async () => {
        // Insert a user and capture user_id
        const userRes = await pool.query(
            'INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING user_id',
            ['testuser', 'testuser@example.com', 'password123']
        );
        user_id = userRes.rows[0].user_id; // Set user_id
    
        // Insert a stock and capture stock_id
        const stockRes = await pool.query(
            'INSERT INTO stocks (symbol, curr_price, created_at) VALUES ($1, $2, NOW()) RETURNING stock_id',
            ['AAPL', 150.00]
        );
        stock_id = stockRes.rows[0].stock_id; // Set stock_id
        console.log(stock_id)
    
        // Insert a watchlist using the newly created user_id and stock_id
        await pool.query(
            'INSERT INTO watchlists (name, user_id, stock_id, created_at) VALUES ($1, $2, $3, NOW())',
            ["faang", user_id, stock_id] // Use actual stock_id here
        );
    });
    
    afterAll(async () => {
        // Delete the watchlist entry (using the user_id and stock_id used in the test)
        await pool.query(
            'DELETE FROM watchlists WHERE user_id = $1 AND stock_id = $2',
            [user_id, stock_id]  // Make sure to match the user_id and stock_id used in the test
        );
    
        // Delete the stock entry (if you want to clean up test data)
        await pool.query(
            'DELETE FROM stocks WHERE symbol = $1',
            ['AAPL']  // Make sure to match the stock symbol used in the test
        );
    
        // Delete the user entry (clean up the test user)
        await pool.query(
            'DELETE FROM users WHERE username = $1',
            ['testuser']  // Make sure to match the username used in the test
        );
    
        // Close the database connection
        // await pool.end();
    });

    // tests being run
    it('should add an item to the watchlist and return the correct response', async () => {
        const response = await request(app).post('/api/watchlist/addWatchlist')
            .send({ name: 'faang', user_id: user_id, stock_id: stock_id });
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
    });
    
});

describe('POST /api/watchlist/removeWatchlist', () => {
    let user_id; // Define user_id and stock_id at the top level for scoping
    let stock_id;
    
    beforeAll(async () => {
        // Insert a user and capture user_id
        const userRes = await pool.query(
            'INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING user_id',
            ['testuser', 'testuser@example.com', 'password123']
        );
        user_id = userRes.rows[0].user_id; // Set user_id
    
        // Insert a stock and capture stock_id
        const stockRes = await pool.query(
            'INSERT INTO stocks (symbol, curr_price, created_at) VALUES ($1, $2, NOW()) RETURNING stock_id',
            ['AAPL', 150.00]
        );
        stock_id = stockRes.rows[0].stock_id; // Set stock_id
    
        // Insert a watchlist using the newly created user_id and stock_id
        await pool.query(
            'INSERT INTO watchlists (name, user_id, stock_id, created_at) VALUES ($1, $2, $3, NOW())',
            ["faang", user_id, stock_id] // Use actual stock_id here
        );
    });
    
    afterAll(async () => {
        // Clean up test data: Delete the user, stock, and watchlist entries
        await pool.query(
            'DELETE FROM watchlists WHERE user_id = $1 AND stock_id = $2',
            [user_id, stock_id]  // Match the user_id and stock_id used in the test
        );
        await pool.query(
            'DELETE FROM stocks WHERE symbol = $1',
            ['AAPL']
        );
        await pool.query(
            'DELETE FROM users WHERE username = $1',
            ['testuser']
        );
        await pool.end();
        
    });

    it('should remove an item from the watchlist and return the correct response', async () => {
        // Send request to remove stock from the watchlist
        const response = await request(app).post('/api/watchlist/removeWatchlist')
            .send({ user_id: user_id, stock_symbol: 'AAPL' }); // Use stock symbol to match the test data

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', `Stock AAPL removed from watchlist for user ${user_id}`);
    });

    it('should return an error if stock is not found in the watchlist', async () => {
        // Send request to remove stock from the watchlist that isn't there
        const response = await request(app).post('/api/watchlist/removeWatchlist')
            .send({ user_id: user_id, stock_symbol: 'GOOG' }); // A stock not in the watchlist

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Stock symbol GOOG not found');
    });

    it('should return an error if the stock symbol is invalid', async () => {
        // Send request with an invalid stock symbol
        const response = await request(app).post('/api/watchlist/removeWatchlist')
            .send({ user_id: user_id, stock_symbol: '' }); // Invalid symbol

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid stock symbol');
    });
});
