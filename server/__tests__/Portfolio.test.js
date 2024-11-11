const request = require('supertest'); // simulates HTTP requests for testing API endpoints
const app = require('../server.js'); // Your Express app
//import { app } from '../server.js';
import { pool } from '../db.js';

describe("add Portfolio", () => {
    let user_id;

    beforeAll(async() => {
        const userRes = await pool.query('INSERT INTO users VALUES (DEFAULT, $1, $2, $3, CURRENT_TIMESTAMP) RETURNING user_id',
            ['test10', 'test10@example.com', 'thisisatest10']
        );
        user_id = userRes.rows[0].user_id;
    });

    afterAll(async () => {
        await pool.query('DELETE FROM portfolios WHERE user_id=$1',
            [user_id]
        );

        await pool.query('DELETE FROM users WHERE user_id=$1',
            [user_id]
        );

        //await pool.end();
    });

    it("should add portfolio with right response", async () => {
        const result = await request(app).post('/api/portfolios').send({ user_id: user_id });
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('message', "Portfolio Created");
        expect(result.body).toHaveProperty('data');
    });

    it("should get error when user_id is invalid", async () => {
        const result = await request(app).post('/api/portfolios').send({user_id: user_id+1});
        expect(result.status).toBe(500);
        expect(result.body).toHaveProperty('err', 'Internal Server Error');
    });

});

describe('delete Portfolio', () => {
    let user_id;
    let portfolio_id;

    beforeAll( async () => {
        //add user
        const userRes = await pool.query(
            "INSERT INTO users VALUES (DEFAULT, $1, $2, $3, CURRENT_TIMESTAMP) RETURNING user_id",
            ['test10', 'test10@example.com', 'thisisatest10']
        );
        user_id = userRes.rows[0].user_id;

        //add portfolio
        const portRes = await pool.query("INSERT INTO portfolios VALUES (DEFAULT, $1, 10000.0, CURRENT_TIMESTAMP) RETURNING portfolio_id",
            [user_id]
        );
        portfolio_id = portRes.rows[0].portfolio_id;
    });

    afterAll( async ()=> {
        //remove user
        await pool.query("DELETE FROM users WHERE user_id=$1",
            [user_id]
        );
        //await pool.end();
    });

    it("should delete portfolio when input is valid", async ()=> {
        const result = await request(app).delete(`/api/portfolios/${portfolio_id}`).send();
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('message', 'Portfolio deleted');
        expect(result.body).toHaveProperty('data');
    });

    //Still a successful call when nothing deleted
    it("should change nothing when portfolio_id is invalid", async () => {
        const result = await request(app).delete(`/api/portfolios/${portfolio_id+1}`).send();
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('message', 'Portfolio deleted');
        expect(result.body.data).toBeUndefined();
    });
});

describe("change portfolio balance", ()=> {
    let ammount;
    let portfolio_id;
    let user_id
    let increase = 5000;
    let decrease = -15000.0;

    beforeAll(async ()=> {
        const userRes = await pool.query("INSERT INTO users VALUES (DEFAULT, $1, $2, $3, CURRENT_TIMESTAMP) RETURNING user_id",
        ['test10', 'test10@example.com', 'thisisatest10']
        );
        user_id = userRes.rows[0].user_id;

        //add portfolio
        const portRes = await pool.query("INSERT INTO portfolios VALUES (DEFAULT, $1, 10000.0, CURRENT_TIMESTAMP) RETURNING portfolio_id",
            [user_id]
        );
        portfolio_id = portRes.rows[0].portfolio_id;
    });

    afterAll(async ()=> {
        //remove portfolio
        await pool.query("DELETE FROM portfolios WHERE portfolio_id=$1",
            [portfolio_id]
        );

        //remove user
        await pool.query("DELETE FROM users WHERE user_id=$1",
            [user_id]
        );
        await pool.end();
    });

    it("should increase balance with valid inputs", async () => {
        const result = await request(app).put(`/api/portfolios/${portfolio_id}`).send({ammount : increase});
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('message', "Portfolio Balance Changed");
        expect(result.body).toHaveProperty('data', 15000.0);
    });

    it("should decrease balance with valid inputs", async () => {
        const result = await request(app).put(`/api/portfolios/${portfolio_id}`).send({ammount: decrease});
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('message', "Portfolio Balance Changed");
        expect(result.body).toHaveProperty('data', 0.0);
    });

    it("should get error with invalid decrease", async () => {
        const result = await request(app).put(`/api/portfolios/${portfolio_id}`).send({ammount: decrease});
        expect(result.status).toBe(400);
        expect(result.body).toHaveProperty("error", "Invalid ammount exceeds portfolio balance");
    });

});