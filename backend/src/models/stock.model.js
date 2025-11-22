import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Stock = sequelize.define("stock", {
    quantity: DataTypes.INTEGER,
    warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "warehouses",
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "products",
            key: 'id'
        }
    }
}, {
    timestamps: false
});

export default Stock;
