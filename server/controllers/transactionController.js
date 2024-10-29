import { pool } from '../db.js'

//addTrade, deleteTrade, getTrade

const addTrade = async (req,res) => {
    try {
        const { portfolio_id, symbol, curr_price, quantity } = req.body;
        if (!portfolio_id) {
            return res.status(400).json({error:"Invalid portfolio id"});
        } else if (!symbol){
            return res.status(400).json({error:"Invalid symbol"});
        } else if (!curr_price){
            return res.status(400).json({error:"Invalid current price"}); 
        } else if (!quantity){
            return res.status(400).json({error:"Invalid quantity"});
        }
        //Do db queries
        const result = await pool.query('INSERT INTO trades VALUES (DEFAULT, $1, $2, $3, $4, CURRENT_TIMESTAMP()) RETURNING *',
            [ portfolio_id, symbol, quantity, curr_price ]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error deleting portfolio", err.message);
        res.status(500).json({ err:"Internal Server Error"});
    }
};

const deletePortfolioTrades = async (req,res) => {
    try {
        const { portfolio_id } = req.body;
        if (!portfolio_id) {
            return res.status(400).json({error:"Portfolio id does not exist"});
        }
        //Database queries
        await pool.query('DELETE FROM trades WHERE portfolio_id=$1 RETURNING *', 
            [portfolio_id]
        );
        res.status(200).json({ message:"Portfolio trades deleted" });
    } catch (err) {
        console.error("Error deleting user's trades", err.message);
        res.status(500).json({ err:"Internal Server Error"});
    }
};

const deleteTrade = async (req,res) => {            //May need to change params
    try{
        const { portfolio_id} = req.body;
        const { trade_id } = req.params;
        if (!portfolio_id) {
            return res.status(400).json({error:"Portfolio id does not exist"});
        } else if (!trade_id) {
            return res.status(400).json({error:"Trade id does not exist"});
        }
        //Database queries
        await pool.query('DELETE FROM trades WHERE portfolio_id=$1 AND trade_id=$2',
            [portfolio_id, trade_id]
        );
        res.status(200).send({ message:"Trade deleted from portfolio" });
    } catch (err) {
        console.error("Error deleting user's trades", err.message);
        res.status(500).json({err:"Internal Server Error"});
    }
};

const getTrade = async (req, res) => {              //May need to change params
    try{
        const { portfolio_id, } = req.body;
        const { trade_id } = req.params;
        if (!portfolio_id) {
            return res.status(400).json({error:"Portfolio id does not exist"});
        } else if (!trade_id) {
            return res.status(400).json({error:"Trade id does not exist"});
        }
        //Database queries
        const result = await pool.query('SELECT * FROM trades WHERE portfolio_id=$1 AND trade_id=$2',
            [portfolio_id, trade_id]
        )
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error deleting user's trades", err.message);
        res.status(500).json({err:"Internal Server Error"});
    }
};

const getPortfolioTrades = async (req,res) => {
    try{
        const { portfolio_id } = req.body;
        if (!portfolio_id) {
            return res.status(400).json({error:"Portfolio id does not exist"});
        }
        //Database queries
        const result = await pool.query('SELECT * FROM trades WHERE portfolio_id=$1',
            [portfolio_id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error deleting user's trades", err.message);
        res.status(500).json({err:"Internal Server Error"});
    }
}

export { addTrade, deletePortfolioTrades, deleteTrade, getTrade, getPortfolioTrades };