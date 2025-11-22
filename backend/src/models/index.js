import Warehouse from "./warehouse.model.js";
import Product from "./product.model.js";
import Stock from "./stock.model.js";
import PurchaseRequest from "./purchase_request.model.js";
import PurchaseRequestItem from "./purchase_request_item.model.js";

Product.hasMany(Stock, {
  foreignKey: 'product_id',
  as: 'stocks'
});

Stock.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

Warehouse.hasMany(Stock, {
  foreignKey: 'warehouse_id',
  as: 'stocks'
});

Stock.belongsTo(Warehouse, {
  foreignKey: 'warehouse_id',
  as: 'warehouse'
});

Warehouse.hasMany(PurchaseRequest, {
  foreignKey: 'warehouse_id',
  as: 'purchase_requests'
})

PurchaseRequest.belongsTo(Warehouse, {
  foreignKey: 'warehouse_id',
  as: 'warehouse'
})

PurchaseRequest.hasMany(PurchaseRequestItem, {
  foreignKey: 'purchase_request_id',
  as: 'purchase_request_item'
})

PurchaseRequestItem.belongsTo(PurchaseRequest, {
  foreignKey: 'purchase_request_id',
  as: 'purchase_item'
})

Product.hasMany(PurchaseRequestItem, {
  foreignKey: 'product_id',
  as: 'purchase_request_item'
})

PurchaseRequestItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
})

export {
  Warehouse,
  Product,
  Stock,
  PurchaseRequest,
  PurchaseRequestItem
};
