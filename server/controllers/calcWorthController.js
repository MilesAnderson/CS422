import axios from 'axios';
import { pool } from "../db.js";

const calcWorth = async (req,res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            res.status(400).json({error:"Invalid user_id"});
        }
        const portQuery = await pool.query("SELECT * FROM portfolios WHERE user_id=$1", [user_id]);
        let net_worth = parseFloat(portQuery.rows[0].balance);

        //Get all stocks within user's portfolio
        const portRes = await axios.post(`http://localhost:5000/api/getPortfolioStocks`, {user_id:user_id});
        //Get the current price for each stock

        for (let i=0;i<portRes.data.length;i++) {
            let result = await axios.get(`http://localhost:5000/api/stocks?q=${portRes.data[i].symbol}`);

            //If stock not on Alpha Vantage raise error
            if (!result.data || Object.keys(result.data).length <= 0) {
                return res.status(404).json({ error:"Stock not found on Alpha Vantage Platform"});
            }
            net_worth += parseFloat(result.data.data.price) * portRes.data[i].quantity;
        }

        //const net_worth = -1;
        res.status(200).json({
            message: "Successfully calculated net worth",
            net_worth:net_worth,
            success: "true"
        });
    } catch (err) {
        console.error("Something when wrong when selling stock:", err.message);
        res.status(500).json({ err:"Internal Server Error" });
    } 
};

export { calcWorth };