import WebhookService from '../services/webhook.service.js';

class WebhookController {
    static async receiveStock(req, res) {
        try {
            if (req.body.data?.event_type === 'ping' || req.body.data?.event === 'test') {
                return res.status(200).json({
                    success: true,
                    message: 'Ping received'
                });
            }

            const result = await WebhookService.processIncomingStock(req.body);

            res.status(200).json({
                success: true,
                message: 'Stock received successfully',
                data: result
            });
        } catch (error) {
            if (error.message === 'Purchase request not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === 'Invalid Vendor') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === 'Purchase request already completed') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === 'Purchase request must be in PENDING status') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export default WebhookController;