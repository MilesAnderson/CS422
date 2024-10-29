import { pool } from '../db.js'; // imports connection

const addWatchlist = async (req, res) => {
    try {
      const { name, user_id, stock_id } = req.body;
      
      if (!user_id) {
        return res.status(400).json({ error: 'Invalid user ID' });
      } else if (!stock_symbol) {
        return res.status(400).json({ error: 'Invalid stock symbol' });
      }
  
      const stockResult = await pool.query('INSERT INTO watchlists (name, user_id, stock_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [name, user_id, stock_id]);
      
      if (stockResult.rows.length === 0) {
        return res.status(404).json({ error: `Stock symbol ${stock_id} not found` });
      }
  
      res.status(200).send({ message: `Stock ${stock_id} added to watchlist for user ${user_id}` });

    } catch (err) {
      console.error('Error adding stock to watchlist:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const removeWatchlist = async (req, res) => {
    try {
      const { user_id, stock_symbol } = req.body;
      
      if (!user_id) {
        return res.status(400).json({ error: 'Invalid user ID' });
      } else if (!stock_symbol) {
        return res.status(400).json({ error: 'Invalid stock symbol' });
      }
  
      // Get the stock_id from the stocks table
      const stockResult = await pool.query('SELECT stock_id FROM stocks WHERE symbol = $1', [stock_symbol]);
      
      if (stockResult.rows.length === 0) {
        return res.status(404).json({ error: `Stock symbol ${stock_symbol} not found` });
      }
  
      const stock_id = stockResult.rows[0].stock_id;
  
      // Delete from the watchlists table
      const deleteResult = await pool.query('DELETE FROM watchlists WHERE user_id = $1 AND stock_id = $2', [user_id, stock_id]);
      
      if (deleteResult.rowCount === 0) {
        return res.status(404).json({ error: 'Watchlist entry not found for this user and stock' });
      }
  
      res.status(200).send({ message: `Stock ${stock_symbol} removed from watchlist for user ${user_id}` });
    } catch (err) {
      console.error('Error removing stock from watchlist:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
// adds a watchlist with no
const watchlist = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        // Query the database to fetch the user's watchlist
        const watchlistResult = await pool.query(
            'SELECT s.symbol FROM watchlists w JOIN stocks s ON w.stock_id = s.stock_id WHERE w.user_id = $1',
            [user_id]
        );
        // Check if the watchlist is empty
        if (watchlistResult.rows.length === 0) {
            return res.status(404).send({ message: 'Watchlist not found for this user' });
        }
        // Extract stock symbols from the result
        const watchlist = watchlistResult.rows.map(row => row.symbol);
        // Send the watchlist as the response
        res.status(200).send({ user_id, watchlist });
    } catch (err) {
        console.error('Error fetching watchlist:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export { addWatchlist, removeWatchlist, watchlist };