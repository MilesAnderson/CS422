import express from 'express';
const router = express.router();
import { createPortfolio, deletePortfolio, getPortfolio, changeBalance } from '../controllers/portfolioController.js';

router.post('/portfolios', createPortfolio);
router.delete('/portfolios', deletePortfolio);
router.get('/portfolios', getPortfolio);
router.put('/portfolios', changeBalance);

export default router;