import ProductService from "../services/product.service.js";

class ProductController {
    static async getAll(req, res) {
        try {
            const product = await ProductService.findAll();
            res.status(200).json({
                success: true,
                data: product,
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

export default ProductController;