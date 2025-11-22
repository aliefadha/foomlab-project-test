import { Product } from "../models/index.js";


class ProductService {
    static async findAll() {
        return Product.findAll();
    }
}

export default ProductService;