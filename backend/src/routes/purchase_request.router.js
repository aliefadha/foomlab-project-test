import express from 'express';
import PurchaseRequestController from '../controllers/purchase_request.controller.js';

const router = express.Router();

router.post('/', PurchaseRequestController.create);
router.put('/:id', PurchaseRequestController.edit);
router.delete('/:id', PurchaseRequestController.delete);

export default router;