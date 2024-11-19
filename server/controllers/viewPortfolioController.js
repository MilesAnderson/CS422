import { pool } from '../db.js'

const getPortfolioStocks = async (req, res) => {
	try{
		const { portfolio_id } = req.body; //extract portfolio_id from request body

		if (!portfolio_id) {
			return res.status(400).json({ error: "Portfolio ID is required" });
		} //check that portfolio_id was inputed correctly

		const result = await pool.query("SELECT * FROM trades WHERE portfolio_id=$1", [portfolio_id]);

		const stocks = {};
		result.rows.forEach(trade => {
			if (!stocks[trade.symbol]) {
				stocks[trade.symbol] = 0;
			}
			stocks[trade.symbol] += trade.type === 'buy' ? trade.quantity : -trade.quantity;
		});

		const filteredStocks = Object.keys(stocks)
			.filter(symbol => stocks[symbol] > 0)
			.map(symbol => ({ symbol, quantity: stocks[symbol] }));

		res.status(200).json(filteredStocks);
	} catch (err) {
		console.error("Error in getPortfolioStocks:", err.message);
		res.status(500).json({error: "Internal Server Error" });
	}
};

export { getPortfolioStocks };
