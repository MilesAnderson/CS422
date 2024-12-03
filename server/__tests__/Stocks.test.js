/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 10 Nov 2024

Description:
This file, `Stocks.test.js`, contains unit tests for the stock-related API endpoints. It includes tests for adding, retrieving, updating, and deleting stocks, as well as handling error scenarios. Mocked database queries and HTTP requests are used to simulate API interactions.
*/

const request = require('supertest'); // Simulates HTTP requests for testing API endpoints
const app = require('../server.js'); // Your Express app
import { pool } from '../db.js'; // Mocked database connection

// Test cases for adding a stock
describe("add stock", () => {
    let stock_id;

    // Cleanup after tests
    afterAll(async () => {
        // Delete the added stock
        await pool.query("DELETE FROM stocks WHERE stock_id=$1", [stock_id]);
    });

    it("should add stock", async () => {
        const result = await request(app).post('/api/stock').send({ symbol: "NEW", curr_price: 1100.0 });
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("symbol", "NEW");
        expect(result.body).toHaveProperty("curr_price");
        expect(parseFloat(result.body.curr_price)).toBe(1100.0);
        stock_id = result.body.stock_id;
    });

    it("should return error for duplicate symbol", async () => {
        const result = await request(app).post('/api/stock').send({ symbol: "NEW", curr_price: 1100.0 });
        expect(result.status).toBe(500);
        expect(result.body).toHaveProperty("error", "Internal Server Error");
    });

    it("should return error when symbol is missing", async () => {
        const result = await request(app).post('/api/stock').send({ curr_price: 1100.0 });
        expect(result.status).toBe(400);
        expect(result.body).toHaveProperty("error", "Invalid symbol");
    });

    it("should return error when curr_price is missing", async () => {
        const result = await request(app).post('/api/stock').send({ symbol: "NEW2" });
        expect(result.status).toBe(400);
        expect(result.body).toHaveProperty("error", "Invalid current price");
    });
});

// Test cases for deleting a stock
describe("delete stock", () => {
    let stock_id;

    beforeAll(async () => {
        const stockRes = await pool.query("INSERT INTO stocks VALUES (DEFAULT, 'NEW', 1300.0, CURRENT_TIMESTAMP) RETURNING stock_id");
        stock_id = stockRes.rows[0].stock_id;
    });

    it("should delete stock with valid inputs", async () => {
        const result = await request(app).delete(`/api/stock/${stock_id}`).send();
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("symbol", "NEW");
        expect(result.body).toHaveProperty("curr_price");
    });
});

// Test cases for retrieving a stock
describe("get stock", () => {
    let stock_id;

    beforeAll(async () => {
        const stockRes = await pool.query("INSERT INTO stocks VALUES (DEFAULT, 'NEW', 1300.0, CURRENT_TIMESTAMP) RETURNING stock_id");
        stock_id = stockRes.rows[0].stock_id;
    });

    afterAll(async () => {
        await pool.query("DELETE FROM stocks WHERE stock_id=$1", [stock_id]);
    });

    it("should get stock with valid inputs", async () => {
        const result = await request(app).get(`/api/stock/${stock_id}`).send();
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("symbol", "NEW");
        expect(result.body).toHaveProperty("curr_price");
    });

    it("should return empty result with invalid stock_id", async () => {
        const result = await request(app).get(`/api/stock/${stock_id + 1}`).send();
        expect(result.status).toBe(200);
        expect(result.body).toBeFalsy();
    });
});

// Test cases for updating stock price
describe("update price", () => {
    let stock_id;

    beforeAll(async () => {
        const stockRes = await pool.query("INSERT INTO stocks VALUES (DEFAULT, 'NEW', 1300.0, CURRENT_TIMESTAMP) RETURNING stock_id");
        stock_id = stockRes.rows[0].stock_id;
    });

    afterAll(async () => {
        await pool.query("DELETE FROM stocks WHERE stock_id=$1", [stock_id]);
        pool.end();
    });

    it("should update price with valid inputs", async () => {
        const result = await request(app).put(`/api/stock/${stock_id}`).send({ price: 800.0 });
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("symbol", "NEW");
        expect(result.body).toHaveProperty("curr_price", "800.00");
    });

    it("should return error for invalid price", async () => {
        const result = await request(app).put(`/api/stock/${stock_id}`).send({ price: -800.0 });
        expect(result.status).toBe(400);
        expect(result.body).toHaveProperty("error", "Invalid price");
    });

    it("should return error for missing price", async () => {
        const result = await request(app).put(`/api/stock/${stock_id}`).send();
        expect(result.status).toBe(400);
        expect(result.body).toHaveProperty("error", "Invalid price");
    });

    it("should return empty result for invalid stock_id", async () => {
        const result = await request(app).put(`/api/stock/${stock_id + 1}`).send({ price: 800.0 });
        expect(result.status).toBe(200);
        expect(result.body).toBeFalsy();
    });
});

