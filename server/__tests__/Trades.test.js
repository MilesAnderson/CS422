request = require('supertest');
app = require('../server.js');
//import { app } from '../server.js';
import {pool} from '../db.js';

describe("Test trades", ()=>{
    let user_id;
    let portfolio_id;
    let trade_id;

    beforeAll(async()=>{
        //create user
        const userRes = await pool.query(
            "INSERT INTO users VALUES (DEFAULT, 'test130', 'test130@example.com', 'thisisatest130', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *"
        );
        user_id = userRes.rows[0].user_id;

        //create portfolio
        const portRes = await pool.query(
            "INSERT INTO portfolios VALUES (DEFAULT, $1, 10000.0, CURRENT_TIMESTAMP) RETURNING *",
            [user_id]
        );
        portfolio_id = portRes.rows[0].portfolio_id;
    });

    afterAll(async()=>{
        //delete trade
        await pool.query("DELETE FROM trades WHERE symbol=$1", ['TEST']);

        //delete portfolio
        await pool.query("DELETE FROM portfolios WHERE portfolio_id=$1", [portfolio_id]);

        //delete user
        await pool.query("DELETE FROM users WHERE user_id=$1", [user_id]);

        pool.end();
    });

    describe ("add trade", ()=>{
        
        it("should add trade with valid inputs", async()=>{
            const result = await request(app).post(`/api/trades`).send(
                {portfolio_id:portfolio_id, symbol:"TEST", type:"BUY", curr_price:600.0, quantity:2}
            );
            trade_id = result.body.trade_id;
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("symbol", "TEST");
            expect(result.body).toHaveProperty("type", "BUY");
            expect(result.body).toHaveProperty("curr_price");
            expect(result.body).toHaveProperty("quantity");
        });

        it("should get error with invalid inputs", async()=>{
            let result = await request(app).post(`/api/trades`).send(
                { symbol:"TEST", type:"BUY", curr_price:600.0, quantity:2}
            );
            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("error", "Invalid portfolio id");
            result = await request(app).post(`/api/trades`).send(
                { portfolio_id:portfolio_id, type:"BUY", curr_price:600.0, quantity:2}
            );
            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("error", "Invalid symbol");
            result = await request(app).post(`/api/trades`).send(
                { portfolio_id:portfolio_id, symbol:"TEST", curr_price:600.0, quantity:2}
            );
            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("error", "Invalid trade type");
            result = await request(app).post(`/api/trades`).send(
                { portfolio_id:portfolio_id, symbol:"TEST", type:"BUY", quantity:2}
            );
            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("error", "Invalid current price");
            result = await request(app).post(`/api/trades`).send(
                { portfolio_id:portfolio_id, symbol:"TEST", type:"BUY", curr_price:600.0}
            );
            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("error", "Invalid quantity");
            result = await request(app).post(`/api/trades`).send(
                { portfolio_id:portfolio_id, symbol:"TEST", type:"BUY", curr_price:-600.0, quantity:2}
            );
            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("error", "Invalid current price");
            result = await request(app).post(`/api/trades`).send(
                { portfolio_id:portfolio_id, symbol:"TEST", type:"BUY", curr_price:600.0, quantity:0}
            );
            expect(result.status).toBe(400);
            expect(result.body).toHaveProperty("error", "Invalid quantity");
        });

        describe("get trade", ()=>{
            it("should get trade with valid inputs", async ()=>{
                const result = await request(app).get(`/api/trades/${trade_id}`);
                expect(result.status).toBe(200);
                expect(result.body).toHaveProperty("symbol", "TEST");
                expect(result.body).toHaveProperty("type", "BUY");
            });

            it ("should get empty result with invalid inputs", async () => {
                const result = await request(app).get(`/api/trades/${trade_id}`);
                expect(result.status).toBe(200);
                expect(result.body).toHaveProperty("symbol", "TEST");
                expect(result.body).toHaveProperty("type", "BUY");
            });
        });

        describe("get portfolio trades", ()=>{
            it("should get portfolio trades with valid inputs", async ()=> {
                const result = await request(app).get(`/api/trades`).send({portfolio_id:portfolio_id});
                expect(result.status).toBe(200);
                expect(result.body[0]).toHaveProperty("symbol", "TEST");
                expect(result.body[0]).toHaveProperty("type", "BUY");
                const result2 = await request(app).get('/api/trades').send({portfolio_id:portfolio_id, symbol:"TEST"});
                expect(result.status).toBe(200);
                expect(result.body[0]).toHaveProperty("symbol", "TEST");
                expect(result.body[0]).toHaveProperty("type", "BUY");
            });

            it("should get error with invalid portfolio id", async()=> {
                const result = await request(app).get(`/api/trades`).send({});
                expect(result.status).toBe(400);
                expect(result.body).toHaveProperty("error", "Portfolio id does not exist");
            });
        });

        describe("delete trade", ()=> {
            it("should delete trade with valid inputs", async()=>{
                const result = await request(app).delete(`/api/trades/${trade_id}`).send();
                expect(result.status).toBe(200);
                expect(result.body).toHaveProperty("symbol", "TEST");
                expect(result.body).toHaveProperty("type", "BUY");
            });

            it("should get empty result with invalid trade_id",async()=>{
                const result = await request(app).delete(`/api/trades/${trade_id}`).send();
                expect(result.status).toBe(200); 
                expect(result.body).toEqual({});
            });
        });
        
        describe("delete portfolio trades", ()=>{
            it("should delete portfolio trades with valid inputs", async()=>{
                await pool.query("INSERT INTO trades VALUES (DEFAULT, $1, 'TEST', 'BUY', 2, 600.0, CURRENT_TIMESTAMP)", [portfolio_id]);
                await pool.query("INSERT INTO trades VALUES (DEFAULT, $1, 'TEST2', 'BUY', 2, 600.0, CURRENT_TIMESTAMP)", [portfolio_id]);
                const result = await request(app).delete(`/api/trades`).send({portfolio_id:portfolio_id});
                expect(result.status).toBe(200);
                expect(result.body.length).toBe(2);
                await pool.query("INSERT INTO trades VALUES (DEFAULT, $1, 'TEST', 'BUY', 2, 600.0, CURRENT_TIMESTAMP)", [portfolio_id]);
                await pool.query("INSERT INTO trades VALUES (DEFAULT, $1, 'TEST2', 'BUY', 2, 600.0, CURRENT_TIMESTAMP)", [portfolio_id]);
                const result2 = await request(app).delete(`/api/trades`).send({portfolio_id:portfolio_id, symbol:"TEST"});
                expect(result2.status).toBe(200);
                expect(result2.body.length).toBe(1);
                expect(result2.body[0]).toHaveProperty("symbol", "TEST");
                const result3 = await request(app).delete(`/api/trades`).send({portfolio_id:portfolio_id, symbol:"TEST2"});
                expect(result3.status).toBe(200);
                expect(result3.body.length).toBe(1);
                expect(result3.body[0]).toHaveProperty("symbol", "TEST2");
            });
        });
    });

});