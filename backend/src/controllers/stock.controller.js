import StockService from "../services/stock.service.js";

class StockController {
    static async getAll(req, res) {
        try {
            const stock = await StockService.findAll();
            res.status(200).json({
                success: true,
                data: stock,
                message: "retrieved successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "An error occurred while retrieving warehouses",
            });
        }
    }
}

export default StockController;