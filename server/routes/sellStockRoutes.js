import express from 'express';
const router = express.Router();
import { sellStock } from "../controllers/sellStockController.js";

router.post('/sellStock', sellStock);

export default router;