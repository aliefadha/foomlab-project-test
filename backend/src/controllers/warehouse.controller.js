import WarehouseService from "../services/warehouse.service.js";

class WarehouseController {
    static async getAll(req, res) {
        try {
            const warehouse = await WarehouseService.findAll();
            res.status(200).json({
                success: true,
                data: warehouse,
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

export default WarehouseController;