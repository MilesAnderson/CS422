import axios from 'axios';
import { pool } from "../db.js";

const calcWorth = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ error: "Invalid user_id" });
    }

    // Get user's liquid money (balance) from the database
    const portQuery = await pool.query("SELECT * FROM portfolios WHERE user_id=$1", [user_id]);
    if (portQuery.rows.length === 0) {
      return res.status(404).json({ error: "Portfolio not found for this user" });
    }
    const liquidMoney = parseFloat(portQuery.rows[0].balance || 0);

    // Fetch user's portfolio stocks
    const portRes = await axios.post("http://localhost:5000/api/getPortfolioStocks", { user_id });
    const portfolio = portRes.data || [];

    // Calculate asset money (total stock value)
    let assetMoney = 0;

    for (let i = 0; i < portfolio.length; i++) {
      const { symbol, quantity } = portfolio[i];

      try {
        const result = await axios.get(`http://localhost:5000/api/stocks?q=${symbol}`);
        if (result.data && result.data.data && result.data.data.price) {
          const currentPrice = parseFloat(result.data.data.price);
          assetMoney += currentPrice * quantity;
        } else {
          console.warn(`Stock data not found for symbol: ${symbol}`);
        }
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}: ${error.message}`);
        continue; // Skip the stock and continue
      }
    }

    // Calculate total net worth
    const netWorth = liquidMoney + assetMoney;

    // Return the financial breakdown
    res.status(200).json({
      message: "Successfully calculated net worth",
      balance: liquidMoney,
      assetWorth: assetMoney,
      net_worth: netWorth,
      success: true,
    });
  } catch (err) {
    console.error("Error calculating net worth:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { calcWorth };
