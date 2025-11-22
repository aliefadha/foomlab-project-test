import express from 'express';
import WarehouseController from "../controllers/warehouse.controller.js";

const router = express.Router();

router.get('/', WarehouseController.getAll);

export default router;