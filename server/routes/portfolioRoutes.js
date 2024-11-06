import express from 'express';
const router = express.Router();
import { createPortfolio, deletePortfolio, getPortfolio, changeBalance } from '../controllers/portfolioController.js';

router.post('/portfolios', createPortfolio);
router.delete('/portfolios/:id', deletePortfolio);
router.get('/portfolios/:id', getPortfolio);
router.put('/portfolios/:id', changeBalance);

export default router;