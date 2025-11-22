import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Product = sequelize.define("product", {
    name: DataTypes.STRING,
    sku: DataTypes.STRING
}, {
    timestamps: false
});

export default Product;
