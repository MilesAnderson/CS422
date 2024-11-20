import { pool } from '../db.js';

const getPortfolioStocks = async (req, res) => {
    try {
        console.log("Request received:", req.body);
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const result = await pool.query(
            `SELECT t.symbol, t.trade_type, t.quantity
             FROM trades t
             JOIN portfolios p ON t.portfolio_id = p.portfolio_id
             WHERE p.user_id = $1`,
            [user_id]
        );

        const stocks = {};
        result.rows.forEach(trade => {
            const type = trade.trade_type.toLowerCase();
            if (!stocks[trade.symbol]) {
                stocks[trade.symbol] = 0;
            }
            stocks[trade.symbol] += type === 'buy' ? trade.quantity : -trade.quantity;
        });

        const filteredStocks = Object.keys(stocks)
            .filter(symbol => stocks[symbol] > 0)
            .map(symbol => ({ symbol, quantity: stocks[symbol] }));

        res.status(200).json(filteredStocks);
    } catch (err) {
        console.error("Error in getPortfolioStocks:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { getPortfolioStocks };
