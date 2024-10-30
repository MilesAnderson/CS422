import express from 'express';
const router = express.router();
import { addStock, deleteStock, getStock, updatePrice } from '../controllers/stockController.js';

router.post('/stocks', addStock);
router.delete('/stocks/:id', deleteStock);
router.get('/stocks/:id', getStock);
router.put('/stocks/:id', updatePrice);

export default router;