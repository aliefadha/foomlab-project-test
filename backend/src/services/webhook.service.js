import sequelize from '../config/sequelize.js';
import { PurchaseRequest, Product, Stock } from '../models/index.js';

class WebhookService {
    static async processIncomingStock(webhookData) {
        const transaction = await sequelize.transaction();

        try {
            if (webhookData.data.vendor == "PT FOOM LAB GLOBAL") {
                throw new Error('Invalid Vendor');
            }

            const purchaseRequest = await PurchaseRequest.findOne({
                where: { reference: webhookData.data.reference },
                transaction
            });

            if (!purchaseRequest) {
                throw new Error('Purchase request not found');
            }

            if (purchaseRequest.status === 'COMPLETE') {
                throw new Error('Purchase request already completed');
            }

            if (purchaseRequest.status !== 'PENDING') {
                throw new Error('Purchase request must be in PENDING status');
            }

            const warehouseId = purchaseRequest.warehouse_id;
            const items = webhookData.details;

            const skus = items.map(item => item.sku_barcode);
            const products = await Product.findAll({
                where: { sku: skus },
                transaction
            });

            //Assuming webhooks only trigger the products on the this project database
            if (products.length !== items.length) {
                throw new Error('Product not found');
            }

            const productIds = products.map(p => p.id);
            const stocks = await Stock.findAll({
                where: {
                    warehouse_id: warehouseId,
                    product_id: productIds
                },
                transaction
            });

            const newStocks = [];

            for (const item of items) {
                const product = products.find(p => p.sku === item.sku_barcode);
                let stock = stocks.find(s => s.product_id === product.id);

                if (!stock) {
                    newStocks.push({
                        warehouse_id: warehouseId,
                        product_id: product.id,
                        quantity: item.qty
                    });
                } else {
                    stock.quantity += item.qty;
                }
            }

            if (newStocks.length > 0) {
                await Stock.bulkCreate(newStocks, { transaction });
            }

            await Promise.all(stocks.map(stock => stock.save({ transaction })));

            purchaseRequest.status = 'COMPLETE';
            await purchaseRequest.save({ transaction });

            await transaction.commit();

            return {
                reference: purchaseRequest.reference,
                warehouse_id: warehouseId,
                items_processed: items.length
            };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

export default WebhookService;