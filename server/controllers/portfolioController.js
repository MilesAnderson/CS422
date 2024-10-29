import { pool } from '../db.js'

//Portfolio,Create/delete portfolio, add/drop balance

const createPortfolio = async (req, res) => {
    try {
        const { user_id } =  req.body;
        if (!user_id) {
            return res.status(400).json({ error:"Invalid user id"});
        }
        //Doing querying to database
        const result = await pool.query('INSERT INTO portfolios VALUES (DEFAULT, $1, 10000.0, CURRENT_TIMESTAMP()) RETURNING *',
            [user_id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Something went wrong creating portfolio:", err.message);
        res.status(500).json({ err:"Internal Server Error" });
    }
};

const deletePortfolio = async (req,res) => {
    try {
        const { portfolio_id } = req.body;
        if (!portfolio_id) {
            return res.status(400).json({error:"Invalid portfolio id"});
        }
        //Doing querying to database
        const result = await pool.query('DELETE FROM portfolios WHERE portfolio_id=$1 RETURNING *',
            [portfolio_id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Something went wrong deleting portfolio:", err.message);
        res.status(500).json({ err:"Internal Server Error" });
    }
};

const getPortfolio = async (req,res) => {
    try {
        const { portfolio_id } = res.body;
        if (!portfolio_id) {
            return res.status(400).json({ error:"Invalid portfolio id" });
        }
        //Doing querying to database
        const result = await pool.query('SELECT * FROM portfolios WHERE portfolio_id=$1 RETURNING *',
            [portfolio_id]
        );
        res.stauts(200).json(result.rows[0]);
    } catch (err) {
        console.error("Something when wrong when getting portfolio", err.message);
        res.status(500).json({ err:"Internal Server Error" });
    }
};

const increaseBalance = async (req,res) => {
    try {
        const { portfolio_id, ammount } = req.body;
        if (!portfolio_id) {
            return res.status(400).json({error:"Invalid portfolio id"});
        } else if (!ammount) {
            return res.status(400).json({error:"Invalid ammount"});
        }
        //Database querying
        const result1 = await pool.query('SELECT balance FROM portfolios WHERE portfolio_id=$1',
            [portfolio_id]
        );
        if (result1.rows.length === 0) {                                //Wrong portfolio_id
            return res.status(400).json({error:"Invalid portfolio id"});
        }
        const total = result1.rows[0] + ammount;
        const result2 = await pool.query('UPDATE portfolios SET balance=$1 WHERE portfolio_id=$1 RETURNING *', 
            [total]
        );
        res.status(200).json(result2.rows[0]);
    } catch (err) {
        console.error("Something when wrong increasing portfolio balance", err.message);
        res.status(500).json({ err:"Internal Server Error" });
    }
};

const decreaseBalance = async (res,req) => {
    try {
        const { portfolio_id, ammount } = req.body;
        if (!portfolio_id) {
            return res.status(400).json({error:"Invalid portfolio id"});
        } else if (!ammount) {
            return res.status(400).json({error:"Invalid ammount"});
        }
        //Database querying
        const result1 = await pool.query('SELECT balance FROM portfolios WHERE portfolio_id=$1 RETURNING *',
            [portfolio_id]
        );
        if (result1.rows.length === 0) {                            //Wrong portfolio id
            return res.status(400).json({error:"Invalid portfolio id"});
        }
        const total = result1.rows[0] - ammount;
        if (total < 0.0) {                                          //Ammount less than balance
            return res.status(400).json({error:"Invalid ammount, must be less than balance"});
        }
        const result2 = await pool.query('UPDATE portfolios SET balance=$1 RETURNING *',
            [total]
        );
        res.status(200).json(result2.rows[0]);
    } catch (err) {
        console.log("Something went wrong decreasing portfolio balance", err.message);
    }
};

export { createPortfolio, deletePortfolio, getPortfolio, increaseBalance, decreaseBalance };