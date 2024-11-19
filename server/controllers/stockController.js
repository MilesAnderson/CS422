import { pool } from '../db.js'

const addStock = async (req,res) => {
    try {
        const { symbol, curr_price } = req.body;
        if (!symbol) {
            return res.status(400).json({ error:"Invalid symbol" });
        } else if (!curr_price || curr_price < 0.0) {
            return res.status(400).json( {error:"Invalid current price"});
        }
        //Database queries
        const result = await pool.query('INSERT INTO stocks VALUES (DEFAULT, $1, $2, CURRENT_TIMESTAMP) RETURNING *',
            [symbol, curr_price]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

const deleteStock = async (req,res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error:"Invalid stock_id" });
        }
        //Database queries
        const result = await pool.query('DELETE FROM stocks WHERE stock_id=$1 RETURNING *',
            [id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

const getStockById = async (req,res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({error:"Invalid stock_id"});
        }
        //Database Queries
        const result = await pool.query('SELECT * FROM stocks WHERE stock_id=$1',
            [id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

const getStockBySymbol = async (req,res) => {
    try {
        const { symbol } = req.body;
        if (!symbol) {
            return res.status(400).json({error:"Invalid stock symbol"});
        }
        const result = await pool.query('SELECT * FROM stocks WHERE symbol=$1', [symbol]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

const updatePrice = async (req,res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;
        if (!id) {
            return res.status(400).json({ error:"Invalid stock id" });
        }
        if (!price || price < 0.0) {
            return res.status(400).json({ error:"Invalid price"});
        }
        //Database Queries
        const result = await pool.query('UPDATE stocks SET curr_price=$1 WHERE stock_id=$2 RETURNING *',
            [price, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export { addStock, deleteStock, getStockById, getStockBySymbol, updatePrice };