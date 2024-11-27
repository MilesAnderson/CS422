import { pool } from "../db.js";
import axios from 'axios';

const sellStock = async (req,res)=>{
    try {
        const { user_id, symbol, curr_price, quantity } = req.body;
        let portfolio_id;
        if (!user_id || !symbol || !curr_price || !quantity) {
            return res.status(400).json({ error:"Missing required fields" });//Get rid of curr_price?
        }
        const increase  = curr_price * quantity;
        //If in portfolio, is existing stock (Done by frontend), and has valid ammount (Unecessary for selling)

        //If is existing stock
        //const stockresult = await axios.get(`http://localhost:5000/api/stocks?q=${symbol}`);
        //if (!stockresult.data || Object.keys(response.data).length <= 0) {
        //    return res.status(404).json({ error:"Stock not found on Alpha Vantage Platform"});
        //}

        //If valid portfolio_id
        let result = await pool.query('SELECT * FROM portfolios WHERE user_id=$1', [user_id]);
        portfolio_id = result.rows[0].portfolio_id;
        if (!portfolio_id) {
            return res.status(400).json({error:"Invalid Portfolio_id"});
        }

        //If in portfolio
        const portRes = await axios.post(`http://localhost:5000/api/getPortfolioStocks`, {user_id:user_id});        // TODO!
        let in_portfolio = false;
        for (let i=0;i<portRes.data.length;i++) {
            if (portRes.data[i].symbol==symbol) {
                in_portfolio = true;
            }
        } 
        if (in_portfolio==false) {
            return res.status(400).json({ error:"Stock not in portfolio" });
        }

        //Decrease Portfolio Balance
        const changeBalRes = await axios.put(`http://localhost:5000/api/portfolios/${portfolio_id}`, {ammount:increase});
        if (changeBalRes.status==400) {
            return res.status(400).json({error:"Invalid portfolio_id or ammount"});
        }

        //Add sell transaction
        let tradeRes = await axios.post(`http://localhost:5000/api/trades`, {
            portfolio_id:portfolio_id,
            symbol:symbol,
            trade_type:"SELL",
            quantity:quantity,
            price_per_share:curr_price,
        });

        //Update or Create stock in stocks
        let stockRes = await axios.get(`http://localhost:5000/api/stock?q=${symbol}`);       //add get stock by symbol
        if (!stockRes.data.symbol) {
            return res.status(400).json({error:"Stock not in stocks table "});               //Should not get this
        } else {
            await axios.put(`http://localhost:5000/api/stock/${stockRes.data.stock_id}`, {curr_price:curr_price});
        }
        
        //Return success!
        res.status(200).json({
            message: `Successfully sold ${quantity} shares of ${symbol}`,
            balance: changeBalRes.data.data                                     //The new balance
        });
    } catch (err) {
        console.error("Something when wrong when selling stock:", err.message);
        res.status(500).json({ err:"Internal Server Error" });
    }
};

export { sellStock };