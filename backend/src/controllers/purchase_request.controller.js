import PurchaseRequestService from "../services/purchase_request.service.js";

class PurchaseRequestController {
    static async create(req, res) {
        try {
            const purchaseRequest = await PurchaseRequestService.create(req.body);
            res.status(200).json({
                success: true,
                data: purchaseRequest,
                message: "Created successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "An error occurred while retrieving warehouses",
            });
        }
    }

    static async edit(req, res) {
        try {
            const result = await PurchaseRequestService.update(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Stock received and processed successfully',
                data: result
            });
        } catch (error) {
            console.error('Webhook processing error:', error);

            if (error.message === 'Purchase request not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Purchase request not found',
                    error: error.message
                });
            }

            if (error.message.includes('already completed')) {
                return res.status(400).json({
                    success: false,
                    message: 'This purchase request has already been processed',
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to process webhook',
                error: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const result = await PurchaseRequestService.delete(req.params.id);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            if (error.message === 'purchase request not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Purchase request not found',
                });
            }

            if (error.message === 'purchase request status is not draft') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete purchase request. Status must be DRAFT',
                });
            }

            res.status(500).json({
                success: false,
                message: error.message || 'An error occurred while deleting purchase request',
            });
        }
    }
}

export default PurchaseRequestController;