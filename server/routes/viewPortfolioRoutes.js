import express from 'express';
const router = express.Router();
import { getPortfolioStocks } from '../controllers/viewPortfolioController.js';

router.get('/getPortfolioStocks', getPortfolioStocks);

export default router;
