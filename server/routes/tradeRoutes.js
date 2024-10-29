import express from 'express';
const router = express.router()
import { addTrade, deletePortfolioTrades, deleteTrade, getPortfolioTrades, getTrade} from '../controllers/transactionController.js'

router.post('/trades', addTrade);
router.delete('/trades', deletePortfolioTrades);    //delete all trades
router.delete('/trades:id', deleteTrade)            //delete trade w/trade_id==id
router.get('/trades', getPortfolioTrades);          //get all trades
router.get('/trades:id', getTrade)                  //get trade w/trade_id==id

export default router;