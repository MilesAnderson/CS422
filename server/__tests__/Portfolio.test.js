/*
Moo-Deng
Authors:
Jake Kolster

Date Created: 10 Nov 2024

Description:
This file, `Portfolio.test.js`, contains unit tests for the portfolio-related API endpoints. It validates behaviors such as creating portfolios, deleting portfolios, changing portfolio balances, and handling invalid inputs. Mocked database interactions and HTTP requests simulate realistic API interactions.
*/

const request = require('supertest'); // Simulates HTTP requests for testing API endpoints
const app = require('../server.js'); // Your Express app
import { pool } from '../db.js'; // Mocked database connection

describe("add Portfolio", () => {
    let user_id;

    // Setup before tests
    beforeAll(async () => {
        const userRes = await pool.query(
            'INSERT INTO users VALUES (DEFAULT, $1, $2, $3, CURRENT_TIMESTAMP) RETURNING user_id',
            ['test10', 'test10@example.com', 'thisisatest10']
        );
        user_id = userRes.rows[0].user_id;
    });

    // Cleanup after tests
    afterAll(async () => {
        await pool.query('DELETE FROM portfolios WHERE user_id=$1', [user_id]);
        await pool.query('DELETE FROM users WHERE user_id=$1', [user_id]);
    });

    it("should add portfolio with a valid user_id", async () => {
        const result = await request(app).post('/api/portfolios').send({ user_id: user_id });
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('message', "Portfolio Created");
        expect(result.body).toHaveProperty('data');
    });

    it("should return error for invalid user_id", async () => {
        const result = await request(app).post('/api/portfolios').send({ user_id: user_id + 1 });
        expect(result.status).toBe(500);
        expect(result.body).toHaveProperty('err', 'Internal Server Error');
    });
});

describe('delete Portfolio', () => {
    let user_id;
    let portfolio_id;

    // Setup before tests
    beforeAll(async () => {
        const userRes = await pool.query(
            "INSERT INTO users VALUES (DEFAULT, $1, $2, $3, CURRENT_TIMESTAMP) RETURNING user_id",
            ['test10', 'test10@example.com', 'thisisatest10']
        );
        user_id = userRes.rows[0].user_id;

        const portRes = await pool.query(
            "INSERT INTO portfolios VALUES (DEFAULT, $1, 10000.0, CURRENT_TIMESTAMP) RETURNING portfolio_id",
            [user_id]
        );
        portfolio_id = portRes.rows[0].portfolio_id;
    });

    // Cleanup after tests
    afterAll(async () => {
        await pool.query("DELETE FROM users WHERE user_id=$1", [user_id]);
    });

    it("should delete portfolio with a valid portfolio_id", async () => {
        const result = await request(app).delete(`/api/portfolios/${portfolio_id}`).send();
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('message', 'Portfolio deleted');
        expect(result.body).toHaveProperty('data');
    });

    it("should not affect non-existent portfolio_id", async () => {
        const result = await request(app).delete(`/api/portfolios/${portfolio_id + 1}`).send();
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('message', 'Portfolio deleted');
        expect(result.body.data).toBeUndefined();
    });
});

describe("change portfolio balance", () => {
    let portfolio_id;
    let user_id;
    const increase = 5000.0;
    const decrease = -15000.0;

    // Setup before tests
    beforeAll(async () => {
        const userRes = await pool.query(
            "INSERT INTO users VALUES (DEFAULT, $1, $2, $3, CURRENT_TIMESTAMP) RETURNING user_id",
            ['test10', 'test10@example.com', 'thisisatest10']
        );
        user_id = userRes.rows[0].user_id;

        const portRes = await pool.query(
            "INSERT INTO portfolios VALUES (DEFAULT, $1, 10000.0, CURRENT_TIMESTAMP) RETURNING portfolio_id",
            [user_id]
        );
        portfolio_id = portRes.rows[0].portfolio_id;
    });

    // Cleanup after tests
    afterAll(async () => {
        await pool.query("DELETE FROM portfolios WHERE portfolio_id=$1", [portfolio_id]);
        await pool.query("DELETE FROM users WHERE user_id=$1", [user_id]);
        await pool.end();
    });

    it("should increase balance with valid inputs", async () => {
        const result = await request(app).put(`/api/portfolios/${portfolio_id}`).send({ ammount: increase });
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('message', "Portfolio Balance Changed");
        expect(result.body).toHaveProperty('data', 15000.0);
    });

    it("should decrease balance with valid inputs", async () => {
        const result = await request(app).put(`/api/portfolios/${portfolio_id}`).send({ ammount: decrease });
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('message', "Portfolio Balance Changed");
        expect(result.body).toHaveProperty('data', 0.0);
    });

    it("should return error for invalid decrease exceeding balance", async () => {
        const result = await request(app).put(`/api/portfolios/${portfolio_id}`).send({ ammount: decrease });
        expect(result.status).toBe(400);
        expect(result.body).toHaveProperty("error", "Invalid ammount exceeds portfolio balance");
    });
});

