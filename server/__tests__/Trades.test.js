/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 10 Nov 2024

Description:
This file, `Trades.test.js`, contains unit tests for the trade-related API endpoints. It includes tests for adding trades, retrieving trades, deleting individual or portfolio trades, and handling error scenarios. Mocked database queries are used to simulate interactions with the database.
*/

const request = require('supertest'); // Simulates HTTP requests for testing API endpoints
const app = require('../server.js'); // Express application being tested
import { pool } from '../db.js'; // Mocked database connection

describe("Test trades", () => {
    let user_id, portfolio_id, trade_id;

    // Setup before all tests
    beforeAll(async () => {
        // Create a user
        const userRes = await pool.query(
            "INSERT INTO users VALUES (DEFAULT, 'test130', 'test130@example.com', 'thisisatest130', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *"
        );
        user_id = userRes.rows[0].user_id;

        // Create a portfolio for the user
        const portRes = await pool.query(
            "INSERT INTO portfolios VALUES (DEFAULT, $1, 10000.0, CURRENT_TIMESTAMP) RETURNING *",
            [user_id]
        );
        portfolio_id = portRes.rows[0].portfolio_id;
    });

    // Cleanup after all tests
    afterAll(async () => {
        await pool.query("DELETE FROM trades WHERE symbol=$1", ['TEST']);
        await pool.query("DELETE FROM portfolios WHERE portfolio_id=$1", [portfolio_id]);
        await pool.query("DELETE FROM users WHERE user_id=$1", [user_id]);
        pool.end();
    });

    describe("add trade", () => {
        it("should add trade with valid inputs", async () => {
            const result = await request(app).post(`/api/trades`).send({
                portfolio_id: portfolio_id,
                symbol: "TEST",
                type: "BUY",
                curr_price: 600.0,
                quantity: 2
            });
            trade_id = result.body.trade_id;
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("symbol", "TEST");
            expect(result.body).toHaveProperty("type", "BUY");
        });

        it("should return error with invalid inputs", async () => {
            const invalidInputs = [
                { symbol: "TEST", type: "BUY", curr_price: 600.0, quantity: 2, error: "Invalid portfolio id" },
                { portfolio_id, type: "BUY", curr_price: 600.0, quantity: 2, error: "Invalid symbol" },
                { portfolio_id, symbol: "TEST", curr_price: 600.0, quantity: 2, error: "Invalid trade type" },
                { portfolio_id, symbol: "TEST", type: "BUY", quantity: 2, error: "Invalid current price" },
                { portfolio_id, symbol: "TEST", type: "BUY", curr_price: 600.0, error: "Invalid quantity" },
                { portfolio_id, symbol: "TEST", type: "BUY", curr_price: -600.0, quantity: 2, error: "Invalid current price" },
                { portfolio_id, symbol: "TEST", type: "BUY", curr_price: 600.0, quantity: 0, error: "Invalid quantity" }
            ];

            for (const input of invalidInputs) {
                const result = await request(app).post(`/api/trades`).send(input);
                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("error", input.error);
            }
        });
    });

    describe("get trade", () => {
        it("should get trade with valid inputs", async () => {
            const result = await request(app).get(`/api/trades/${trade_id}`);
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("symbol", "TEST");
            expect(result.body).toHaveProperty("type", "BUY");
        });

        it("should return empty result with invalid trade_id", async () => {
            const result = await request(app).get(`/api/trades/99999`);
            expect(result.status).toBe(200);
            expect(result.body).toEqual({});
        });
    });

    describe("get portfolio trades", () => {
        it("should get portfolio trades with valid inputs", async () => {
            const result = await request(app).get(`/api/trades`).send({ portfolio_id: portfolio_id });
            expect(result.status).toBe(200);
            expect(result.body[0]).toHaveProperty("symbol", "TEST");
            expect(result.body[0]).toHaveProperty("type", "BUY");
        });

        it("should return error with invalid portfolio id", async () => {
            const result = await request(app).get(`/api/trades`).send({});
            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("error", "Portfolio id does not exist");
        });
    });

    describe("delete trade", () => {
        it("should delete trade with valid inputs", async () => {
            const result = await request(app).delete(`/api/trades/${trade_id}`).send();
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("symbol", "TEST");
        });

        it("should return empty result with invalid trade_id", async () => {
            const result = await request(app).delete(`/api/trades/99999`).send();
            expect(result.status).toBe(200);
            expect(result.body).toEqual({});
        });
    });

    describe("delete portfolio trades", () => {
        it("should delete all portfolio trades with valid inputs", async () => {
            await pool.query("INSERT INTO trades VALUES (DEFAULT, $1, 'TEST', 'BUY', 2, 600.0, CURRENT_TIMESTAMP)", [portfolio_id]);
            await pool.query("INSERT INTO trades VALUES (DEFAULT, $1, 'TEST2', 'BUY', 2, 600.0, CURRENT_TIMESTAMP)", [portfolio_id]);
            const result = await request(app).delete(`/api/trades`).send({ portfolio_id: portfolio_id });
            expect(result.status).toBe(200);
            expect(result.body.length).toBe(2);
        });

        it("should delete specific portfolio trades by symbol", async () => {
            await pool.query("INSERT INTO trades VALUES (DEFAULT, $1, 'TEST', 'BUY', 2, 600.0, CURRENT_TIMESTAMP)", [portfolio_id]);
            const result = await request(app).delete(`/api/trades`).send({ portfolio_id: portfolio_id, symbol: "TEST" });
            expect(result.status).toBe(200);
            expect(result.body.length).toBe(1);
            expect(result.body[0]).toHaveProperty("symbol", "TEST");
        });
    });
});

