import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Warehouse = sequelize.define("warehouse", {
    name: DataTypes.STRING,
}, {
    timestamps: false
});

export default Warehouse;
