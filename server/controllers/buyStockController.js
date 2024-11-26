import { pool } from '../db.js'
import axios from 'axios';

const buyStock = async (req, res) => {
  try {
    const { user_id, symbol, curr_price, quantity } = req.body;

    console.log(user_id, symbol, curr_price, quantity);

    // Validate input
    if (!user_id || !symbol || !curr_price || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //If valid portfolio_id
    let result = await pool.query('SELECT * FROM portfolios WHERE user_id=$1', [user_id]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }
    let portfolio_id = result.rows[0].portfolio_id;

    // Calculate total cost of the stock purchase
    const totalCost = curr_price * quantity;

    // Get current balance from the user's portfolio
    const currentBalance = result.rows[0].balance;

    // Check if the user has enough balance
    if (currentBalance < totalCost) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct the total cost from the user's balance
    const changeBalRes = await axios.put(`http://localhost:5000/api/portfolios/${portfolio_id}`, { ammount:-totalCost });
    if (changeBalRes.status==400) {
      return res.status(400).json({error:"Invalid portfolio_id or ammount"});
    }

    //Add buy transaction
    await axios.post(`http://localhost:5000/api/trades`, {
      portfolio_id:portfolio_id,
      symbol:symbol,
      trade_type:"BUY",
      quantity:quantity,
      price_per_share:curr_price
    });

    //Update or Create stock in stocks
    const stockRes = await axios.get(`http://localhost:5000/api/stock?q=${symbol}`);       //add get stock by symbol
    if (!stockRes.data.symbol) {
        await axios.post(`http://localhost:5000/api/stock`, {symbol:symbol, curr_price:curr_price});
    } else {
        await axios.put(`http://localhost:5000/api/stock/${stockRes.data.stock_id}`, {curr_price:curr_price});
    }

    // Send a success response
    res.status(200).json({
      message: `Successfully purchased ${quantity} shares of ${symbol}`,
      balace : currentBalance-totalCost
    });
  } catch (err) {
    console.error("Error purchasing stock:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { buyStock };