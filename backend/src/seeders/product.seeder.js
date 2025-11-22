import Product from "../models/product.model.js";

const productData = [
    { name: 'ICY MINT', sku: "ICYMINT" },
    { name: 'ICY WATERMELON', sku: "ICYWATERMELON" },
];

export const seeProducts = async () => {
    try {
        await Product.bulkCreate(productData);
        console.log(`Product seeding done`);
    } catch (error) {
        console.error('Error seeding product:', error.message);
        throw error;
    }
};
