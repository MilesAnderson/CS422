import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import stocksApi from "./routes/stocksApi.js";
import test from "./routes/test.js";

const app = express(); // Express application created
const port = process.env.PORT || 5000; 

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the React frontend
app.use(express.json()); // Parse JSON bodies

app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

app.use('/test', test);
app.use('/api/stocks', stocksApi);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

'use strict';

// Add stock to watchlist
app.post('/watchlist/add', (req, res) => {
    // Extract user_id and stock_symbol from the request body
    const { user_id, stock_symbol } = req.body;

    // Validate input
    if (!user_id || !stock_symbol) {
        return res.status(400).send({ message: "We need a stock ticker and user ID" });
    }

    // TODO: Relay data to the database (e.g., INSERT into the watchlist table)
    // Pseudo code for database operation:
    // db.query('INSERT INTO watchlist (user_id, stock_symbol) VALUES (?, ?)', [user_id, stock_symbol]);

    res.status(200).send({ message: `Stock ${stock_symbol} added to watchlist for user ${user_id}` });
});

// Remove stock from watchlist
app.delete('/watchlist/remove', (req, res) => {
    // Extract user_id and stock_symbol from the request body
    const { user_id, stock_symbol } = req.body;

    // Validate input
    if (!user_id || !stock_symbol) {
        return res.status(400).send({ message: "We need a stock ticker and user ID" });
    }

    // TODO: Relay data to the database (e.g., DELETE from the watchlist table)
    // Pseudo code for database operation:
    // db.query('DELETE FROM watchlist WHERE user_id = ? AND stock_symbol = ?', [user_id, stock_symbol]);

    res.status(200).send({ message: `Stock ${stock_symbol} removed from watchlist for user ${user_id}` });
});

// Get a user's watchlist
app.get('/watchlist/:user_id', (req, res) => {
    const { user_id } = req.params; // Extract user_id from the request parameters

    // Validate input
    if (!user_id) {
        return res.status(400).send({ message: "User ID is required" });
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
});

// Start the server
const startServer = async () => {
    // await checkDatabaseConnection();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer()

export default app;