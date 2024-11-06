const request = require('supertest'); // simulates HTTP requests for testing API endpoints
const app = require('../server.js'); // Your Express app
const db = require('../db.js'); // Your database connection

describe('GET /api/watchlist/addWatchlist', () => {
    const user_id = 1;
    const stock_id = "GOOG";

    beforeAll(async () => {
        await db.query(
            'INSERT INTO watchlists (name, user_id, stock_id, created_at) VALUES ($1, $2, $3, NOW())',
            ["faang", user_id, stock_id]
        );
    });

    afterAll(async () => {
        await db.query('DELETE FROM watchlists WHERE user_id = $1 AND stock_id = $2', [user_id, stock_id]);
        await db.end();
    });

    it('should add an item to the watchlist and return the correct response', async () => {
        const response = await request(app).get('/api/watchlist/addWatchlist')
            .query({ name: 'faang', user_id: user_id, stock_id: stock_id });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
    });
});
