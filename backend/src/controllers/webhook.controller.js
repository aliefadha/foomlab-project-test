import WebhookService from '../services/webhook.service.js';

class WebhookController {
    static async receiveStock(req, res) {
        try {
            if (req.body.event_type === 'ping' || req.body.event === 'test') {
                return res.status(200).json({
                    success: true,
                    message: 'Ping received'
                });
            }

            if (req.body.status_request === 'REQUEST_CONFIRM') {
                return res.status(200).json({
                    success: true,
                    message: 'Purchase request confirmed by vendor',
                    reference: req.body.reference
                });
            }

            if (req.body.status_request === 'REQUEST_REJECTED') {
                return res.status(200).json({
                    success: true,
                    message: 'Purchase request rejected by vendor',
                    reference: req.body.reference
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