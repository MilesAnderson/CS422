/*
Moo-Deng
Authors:
Miles Anderson
Liam Bouffard
Andrew Chan
Jake Kolster

Date Created: 8 Oct 2024

Description:
This file, `server.js`, sets up and starts the Express.js server for the application. It configures middleware, integrates API routes, handles errors, and verifies the database connection before starting the server.
*/

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import createError from 'http-errors';
import { checkDatabaseConnection } from './db.js';

import stocksApi from './routes/stocksApi.js';
import userRoutes from './routes/userRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import buyStockRoutes from './routes/buyStockRoutes.js';
import sellStockRoutes from './routes/sellStockRoutes.js';
import viewPortfolioRoutes from './routes/viewPortfolioRoutes.js';
import calcWorthRoutes from './routes/calcWorthRoutes.js';
import signInRoutes from './routes/signInRoutes.js';
import signUpRoutes from './routes/signUpRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

// Dynamically determine allowed origins
const allowedOrigins = [
  'http://localhost:3000', // Local frontend
  'https://moodengcapital.netlify.app/', // Netlify-hosted frontend
];

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow requests from allowed origins
      } else {
        callback(new Error('Not allowed by CORS')); // Reject requests from unrecognized origins
      }
    },
    credentials: true, // Allow credentials like cookies
  })
);

// Middleware
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

// Set the view engine and views directory
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'jade');

// Register API routes
app.use('/api/stocks', stocksApi);
app.use('/api', userRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api', portfolioRoutes);
app.use('/api', stockRoutes);
app.use('/api', tradeRoutes);
app.use('/api', buyStockRoutes);
app.use('/api', sellStockRoutes);
app.use('/api', viewPortfolioRoutes);
app.use('/api', calcWorthRoutes);
app.use('/api', signInRoutes);
app.use('/api', signUpRoutes);

// Catch 404 errors and forward to the error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Start the server
const startServer = async () => {
  await checkDatabaseConnection();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();

export default app;

