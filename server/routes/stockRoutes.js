import express from 'express';
const router = express.Router();
import { addWatchlist, removeWatchlist, watchlist } from '../controllers/watchlistController.js';

router.post('/addWatchlist', addWatchlist);
router.post('/removeWatchlist', removeWatchlist);
router.get('/:user_id/watchlist', watchlist);

export default router;
