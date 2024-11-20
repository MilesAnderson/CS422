import { pool } from '../db.js'

//addTrade, deleteTrade, getTrade

const addTrade = async (req,res) => {
    try {
        const { portfolio_id, symbol, trade_type, quantity, curr_price } = req.body;
        if (!portfolio_id) {
            return res.status(400).json({error:"Invalid portfolio id"});
        } else if (!symbol){
            return res.status(400).json({error:"Invalid symbol"});
        } else if (!trade_type) {
            return res.status(400).json({error: "Invalid trade type"});
        } else if (!curr_price || curr_price<0.0){
            return res.status(400).json({error:"Invalid current price"}); 
        } else if (!quantity || quantity <= 0 ){
            return res.status(400).json({error:"Invalid quantity"});
        }
        //Do db queries
        const result = await pool.query('INSERT INTO trades VALUES (DEFAULT, $1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *',
            [ portfolio_id, symbol, trade_type, quantity, curr_price ]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error deleting portfolio", err.message);
        res.status(500).json({ err:"Internal Server Error"});
    }
};

const deletePortfolioTrades = async (req,res) => {
    try {
        const { portfolio_id, symbol } = req.body;
        if (!portfolio_id) {
            return res.status(400).json({error:"Portfolio id does not exist"});
        }
        //Database queries
        if (!symbol) {
            const result = await pool.query("DELETE FROM trades WHERE portfolio_id=$1 RETURNING *", [portfolio_id]);
            res.status(200).send(result.rows);
        } else {
            const result = await pool.query("DELETE FROM trades WHERE portfolio_id=$1 AND symbol=$2 RETURNING *", [portfolio_id, symbol]);
            res.status(200).send(result.rows);
        }
    } catch (err) {
        console.error("Error deleting user's trades", err.message);
        res.status(500).json({ err:"Internal Server Error"});
    }
};

const deleteTrade = async (req,res) => {            //May need to change params
    try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({error:"Trade id does not exist"});
        }
        //Database queries
        const result = await pool.query('DELETE FROM trades WHERE trade_id=$1 RETURNING *',
            [id]
        );
        res.status(200).send(result.rows[0]);
    } catch (err) {
        console.error("Error deleting user trade", err.message);
        res.status(500).json({err:"Internal Server Error"});
    }
};

const getTrade = async (req, res) => {              //May need to change params
    try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({error:"Trade id does not exist"});
        }
        //Database queries
        const result = await pool.query('SELECT * FROM trades WHERE trade_id=$1',
            [id]
        )
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error deleting user's trades", err.message);
        res.status(500).json({err:"Internal Server Error"});
    }
};

const getPortfolioTrades = async (req,res) => {
    try{
        //Get trades by portfolio AND optionally stock symbol
        const { portfolio_id, symbol } = req.body;
        if (!portfolio_id) {
            return res.status(400).json({error:"Portfolio id does not exist"});
        }
        //Database queries
        if (!symbol) {
            const result = await pool.query("SELECT * FROM trades WHERE portfolio_id=$1",
                [portfolio_id]
            );
            res.status(200).json(result.rows);
        } else {
            const result = await pool.query("SELECT * FROM trades WHERE portfolio_id=$1 AND symbol=$2",
                [portfolio_id, symbol]
            );
            res.status(200).json(result.rows);
        }
    } catch (err) {
        console.error("Error getting portfolio trades:", err.message);
        res.status(500).json({err:"Internal Server Error"});
    }
}

export { addTrade, deletePortfolioTrades, deleteTrade, getTrade, getPortfolioTrades };