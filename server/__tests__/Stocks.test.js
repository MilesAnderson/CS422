const request = require('supertest'); // simulates HTTP requests for testing API endpoints
const app = require('../server.js'); // Your Express app
//import { app } from '../server.js';
import { pool } from '../db.js';

describe("add stock", () => {
    let stock_id;

    afterAll( async ()=>{
        //delete stock
        await pool.query("DELETE FROM stocks WHERE stock_id=$1",
            [stock_id]
        );
        //pool.end();
    });

    it("should add stock", async ()=> {
        const result = await request(app).post('/api/stock').send({symbol: "NEW", curr_price: 1100.0});
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("symbol", "NEW");
        expect(result.body).toHaveProperty("curr_price");
        expect(parseFloat(result.body.curr_price)).toBe(1100.0);
        stock_id = result.body.stock_id;
    });

    it("should get error on duplicate symbol", async ()=> {
        const result = await request(app).post('/api/stock').send({symbol: "NEW", curr_price: 1100.0});
        expect(result.status).toBe(500);
        expect(result.body).toHaveProperty("error", "Internal Server Error");
    });

    it("should get error when missing symbol", async ()=> {
        const result = await request(app).post('/api/stock').send({curr_price: 1100.0});
        expect(result.status).toBe(400);
        expect(result.body).toHaveProperty("error", "Invalid symbol");
    });

    it("should get error when missing curr_price", async () => {
        const result = await request(app).post('/api/stock').send({symbol: "NEW2"});
        expect(result.status).toBe(400);
        expect(result.body).toHaveProperty("error", "Invalid current price");
    });
});

describe("delete stock", () => {
    let stock_id;

    beforeAll(async ()=> {
        let stockRes = await pool.query("INSERT INTO stocks VALUES (DEFAULT, 'NEW', 1300.0, CURRENT_TIMESTAMP) RETURNING stock_id");
        stock_id = stockRes.rows[0].stock_id;
    });

    afterAll(async ()=>{
        //pool.end();
    });

    it("should delete stock with valid inputs", async ()=> {
        const result = await request(app).delete(`/api/stock/${stock_id}`).send();
        expect(result.status).toBe(200);
        console.log(result.body);
        expect(result.body).toHaveProperty("symbol", "NEW");
        expect(result.body).toHaveProperty("curr_price");
    })

});

describe("get stock", () => {
    let stock_id;

    beforeAll(async ()=>{
        const stockRes = await pool.query("INSERT INTO stocks VALUES (DEFAULT, 'NEW', 1300.0, CURRENT_TIMESTAMP) RETURNING stock_id");
        stock_id = stockRes.rows[0].stock_id;
    });

    afterAll(async ()=> {
        await pool.query("DELETE FROM stocks WHERE stock_id=$1",
            [stock_id]
        );
        //pool.end();
    });

    it("should get stock with valid inputs", async ()=> {
        const result = await request(app).get(`/api/stock/${stock_id}`).send();
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("symbol", "NEW");
        expect(result.body).toHaveProperty("curr_price");
    });

    it("should get empty result with invalid stock_id", async ()=> {
        const result = await request(app).get(`/api/stock/${stock_id+1}`).send();
        expect(result.status).toBe(200);
        expect(result.body).toBeFalsy();
    })
});

describe("update price", () => {
    let stock_id;

    beforeAll(async ()=> {
        const stockRes = await pool.query("INSERT INTO stocks VALUES (DEFAULT, 'NEW', 1300.0, CURRENT_TIMESTAMP) RETURNING stock_id");
        stock_id = stockRes.rows[0].stock_id;
    });

    afterAll(async()=> {
        await pool.query("DELETE FROM stocks WHERE stock_id=$1",
            [stock_id]
        );
        pool.end();
    })

    it("should update price with valid inputs", async ()=> {
        const result = await request(app).put(`/api/stock/${stock_id}`).send({ price:800.0 });
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("symbol", "NEW");
        expect(result.body).toHaveProperty("curr_price", "800.00");
    });

    it("should get error with invalid price", async ()=>{
        const result = await request(app).put(`/api/stock/${stock_id}`).send({ price:-800.0 });
        expect(result.status).toBe(400);
        expect(result.body).toHaveProperty("error", "Invalid price");
        const result2 = await request(app).put(`/api/stock/${stock_id}`).send();
        expect(result2.status).toBe(400);
        expect(result2.body).toHaveProperty("error", "Invalid price");
    });

    it("should get error with invalid stock_id", async ()=> {
        const result = await request(app).put(`/api/stock/${stock_id+1}`).send({ price:800 });
        expect(result.status).toBe(200);
        expect(result.body).toBeFalsy();
    })
});