import Warehouse from "../models/warehouse.model.js";

class WarehouseService {
    static async findAll() {
        return Warehouse.findAll();
    }
}

export default WarehouseService;