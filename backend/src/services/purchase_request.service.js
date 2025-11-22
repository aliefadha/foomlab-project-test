import PurchaseRequest from "../models/purchase_request.model.js";
import Warehouse from "../models/warehouse.model.js";
import Product from "../models/product.model.js";
import PurchaseRequestItem from "../models/purchase_request_item.model.js";
import sequelize from "../config/sequelize.js";
import axios from "axios";

class PurchaseRequestService {
    static async generateReference() {
        const lastPurchaseRequest = await PurchaseRequest.findOne({
            order: [['id', 'DESC']],
            attributes: ['reference']
        });

        let nextNumber = 1;
        if (lastPurchaseRequest && lastPurchaseRequest.reference) {
            const match = lastPurchaseRequest.reference.match(/PR(\d{5})/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }

        return `PR${String(nextNumber).padStart(5, '0')}`;
    }

    static async create(data) {
        if (!data.warehouse_id) {
            throw new Error('warehouse_id is required');
        }

        if (data.status && data.status !== 'DRAFT') {
            throw new Error('status can only be DRAFT');
        }

        if (!data.products || data.products.length === 0) {
            throw new Error('at least one products required');
        }

        const warehouse = await Warehouse.findByPk(data.warehouse_id);
        if (!warehouse) {
            throw new Error('warehouse not found');
        }

        const productIds = [];
        for (const item of data.products) {
            if (!item.product_id) {
                throw new Error('product_id is missing');
            }

            if (!item.quantity || item.quantity <= 0) {
                throw new Error('quantity must be greater than 0');
            }

            productIds.push(item.product_id);
        }

        const products = await Product.findAll({
            where: {
                id: productIds
            }
        });

        if (products.length !== data.products.length) {
            throw new Error('products not found');
        }

        const reference = await this.generateReference();

        const purchaseRequest = await PurchaseRequest.create({
            reference: reference,
            warehouse_id: data.warehouse_id
        });

        const purchaseRequestItems = data.products.map(item => ({
            purchase_request_id: purchaseRequest.id,
            product_id: item.product_id,
            quantity: item.quantity
        }));

        const createdItems = await PurchaseRequestItem.bulkCreate(purchaseRequestItems);

        return {
            ...purchaseRequest.toJSON(),
            items: createdItems
        };
    }

    static async update(id, data) {
        const transaction = await sequelize.transaction();

        try {
            const purchaseRequest = await PurchaseRequest.findByPk(id, {
                include: [
                    {
                        model: PurchaseRequestItem,
                        as: 'purchase_request_item',
                        include: [
                            {
                                model: Product,
                                as: 'product'
                            }
                        ]
                    }
                ],
                transaction
            });

            if (!purchaseRequest) {
                await transaction.rollback();
                throw new Error('purchase request not found');
            }

            if (purchaseRequest.status !== 'DRAFT') {
                await transaction.rollback();
                throw new Error('purchase requests must be DRAFT status');
            }

            await purchaseRequest.update(data, { transaction });

            if (data.status === 'PENDING') {
                const qtyTotal = purchaseRequest.purchase_request_item.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );

                const payload = {
                    vendor: "PT FOOM LAB GLOBAL",
                    reference: purchaseRequest.reference,
                    qty_total: qtyTotal,
                    details: purchaseRequest.purchase_request_item.map(item => ({
                        product_name: item.product.name,
                        sku_barcode: item.product.sku,
                        qty: item.quantity
                    }))
                };
                try {
                    await axios.post('https://hub.foomid.id/api/request/purchase', payload, {
                        headers: {
                            'Content-Type': 'application/json',
                            'secret-key': process.env.HUB_API_KEY
                        }
                    });
                } catch (apiError) {
                    await transaction.rollback();
                    throw new Error('failed to notify external system');
                }
            }

            await transaction.commit();
            return purchaseRequest;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async delete(id) {
        const purchase_request = await PurchaseRequest.findByPk(id);

        if (!purchase_request) {
            throw new Error("purchase request not found")
        }

        if (purchase_request.status !== "DRAFT") {
            throw new Error("purchase request status is not draft")
        }

        await PurchaseRequestItem.destroy({
            where: {
                purchase_request_id: id
            }
        });

        await purchase_request.destroy();

        return { message: "purchase request deleted successfully" };
    }
}

export default PurchaseRequestService;