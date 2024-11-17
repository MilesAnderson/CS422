import express from 'express';
const router = express.Router();
import { buyStock } from '../controllers/buyStockController.js';

router.post('/buyStock', buyStock);

export default router;