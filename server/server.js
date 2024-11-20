import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import createError from 'http-errors';
import { checkDatabaseConnection } from './db.js'

import stocksApi from "./routes/stocksApi.js";
import userRoutes from './routes/userRoutes.js';
// import test from "./routes/test.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
//Larger Apis
import buyStockRoutes from "./routes/buyStockRoutes.js";
import sellStockRoutes from "./routes/sellStockRoutes.js";
import viewPortfolioRoutes from "./routes/viewPortfolioRoutes.js";

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

/*
when user does
app.use('/api/stocks', stocksApi), server will invoke functions defined
at stocksApi.js which was defined above as import stocksApi from "./routes/stocksApi.js";
*/
// app.use('/test', test);
app.use('/api/stocks', stocksApi);
app.use('/api', userRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api', portfolioRoutes);
app.use('/api', stockRoutes);               //Router for stocks table
app.use('/api', tradeRoutes);
app.use('/api', buyStockRoutes);
app.use('/api', sellStockRoutes);
//app.use('/api', sellStockRoutes);
app.use('/api', viewPortfolioRoutes);

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

// Start the server
const startServer = async () => {
    await checkDatabaseConnection();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer()
//module.exports = app;
export default app;
