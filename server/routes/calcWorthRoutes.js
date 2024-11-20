import express from 'express';
const router = express.Router();
import { calcWorth } from '../controllers/calcWorthController.js';

router.post('/calcWorth', calcWorth);

export default router;