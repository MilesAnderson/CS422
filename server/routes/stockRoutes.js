import express from 'express';
const router = express.Router();
import { addStock, deleteStock, getStockById, getStockBySymbol, updatePrice } from '../controllers/stockController.js';

router.post('/stock', addStock);
router.delete('/stock/:id', deleteStock);
router.get('/stock/:id', getStockById);
router.get('/stock', getStockBySymbol);
router.put('/stock/:id', updatePrice);

export default router;