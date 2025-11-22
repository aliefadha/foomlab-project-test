import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const PurchaseRequestItem = sequelize.define("purchase_request_items", {
    purchase_request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "purchase_requests",
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
    },
    quantity: DataTypes.INTEGER,
}, {
    timestamps: false
});

export default PurchaseRequestItem;
