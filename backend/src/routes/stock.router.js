import express from 'express';
import StockController from '../controllers/stock.controller.js';

const router = express.Router();

router.get('/', StockController.getAll);

export default router;