import { pool } from '../db.js';

const addWatchlist = async (req, res) => {
  try {
    const { user_id, stock_symbol } = req.body;
    if (!user_id){
      return res.status(400).json({ error: 'Invalid user ID'})
    } else if (!stock_symbol){
      return res.status(400).json({ error: 'Invalid stock symbol'})
    }
    // TODO: Relay data to the database (e.g., INSERT into the watchlist table)
    // Pseudo code for database operation:
    // db.query('INSERT INTO watchlist (user_id, stock_symbol) VALUES (?, ?)', [user_id, stock_symbol]);
    
    res.status(200).send({ message: `Stock ${stock_symbol} added to watchlist for user ${user_id}` });
  } catch (err) {
    console.error('Error adding stock to watchlist:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const removeWatchlist = async (req, res) => {
  try {
    const { user_id, stock_symbol } = req.body;
    if (!user_id){
      return res.status(400).json({ error: 'Invalid user ID'})
    } else if (!stock_symbol){
      return res.status(400).json({ error: 'Invalid stock symbol'})
    }
    // TODO: Relay data to the database (e.g., DELETE from the watchlist table)
    // Pseudo code for database operation:
    // db.query('DELETE FROM watchlist WHERE user_id = ? AND stock_symbol = ?', [user_id, stock_symbol]);

    res.status(200).send({ message: `Stock ${stock_symbol} removed from watchlist for user ${user_id}` });
  } catch (err) {
    console.error('Error adding stock to watchlist:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const watchlist = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id){
      return res.status(400).json({ error: 'Invalid user ID'})
    }
    // TODO: Relay data to the database to fetch the user's watchlist
    // Pseudo code for database operation:
    // db.query('SELECT stock_symbol FROM watchlist WHERE user_id = ?', [user_id], (error, results) => {
    //     if (error) {
    //         return res.status(500).send({ message: "Error fetching the watchlist" });
    //     }
    //     if (results.length === 0) {
    //         return res.status(404).send({ message: "Watchlist not found for this user" });
    //     }
    //     res.status(200).send(results); // Send the watchlist as the response
    // });

    // Temporary response (until database connection is set up)
    const sampleWatchlist = ['AAPL', 'TSLA', 'AMZN']; // Replace with actual DB query result
    res.status(200).send({ user_id, watchlist: sampleWatchlist });
  } catch (err) {
    console.error('Error adding stock to watchlist:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export { addWatchlist, removeWatchlist, watchlist };