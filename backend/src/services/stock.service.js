import { Product, Stock, Warehouse } from "../models/index.js";

class StockService {
    static async findAll() {
        return Stock.findAll({
            attributes: {
                exclude: ['warehouse_id', 'product_id']
            },
            include: [
                {
                    model: Product,
                    as: 'product',
                },
                {
                    model: Warehouse,
                    as: 'warehouse'
                }
            ]
        });
    }
}

export default StockService;