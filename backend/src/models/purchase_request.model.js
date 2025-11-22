import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const PurchaseRequest = sequelize.define("purchase_requests", {
    reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "warehouses",
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM(["DRAFT", "PENDING", "COMPLETE"]),
        defaultValue: "DRAFT"
    }
}
);

export default PurchaseRequest;
