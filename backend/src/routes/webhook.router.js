import express from 'express';
import WebhookController from '../controllers/webhook.controller.js';

const router = express.Router();

router.post('/receive-stock', WebhookController.receiveStock);

export default router;