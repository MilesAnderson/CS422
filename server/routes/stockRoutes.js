import express from 'express';
const router = express.Router();
import { addStock, deleteStock, getStock, updatePrice } from '../controllers/stockController.js';

router.post('/stock', addStock);
router.delete('/stock/:id', deleteStock);
router.get('/stock/:id', getStock);
router.put('/stock/:id', updatePrice);

export default router;