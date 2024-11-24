import express from 'express';
const router = express.Router();
import { signIn } from '../controllers/signInController.js';

router.post('/signIn', signIn);

export default router;