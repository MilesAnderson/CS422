import express from 'express';
const router = express.Router();
import { getPortfolioStocks } from '../controllers/viewPortfolioController.js';

router.post('/getPortfolioStocks', getPortfolioStocks);

export default router;
