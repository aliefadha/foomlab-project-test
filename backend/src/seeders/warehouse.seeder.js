import Warehouse from '../models/warehouse.model.js';

const warehouseData = [
    { name: 'Warehouse 1' },
    { name: 'Warehouse 2' },
    { name: 'Warehouse 3' },
];

export const seedWarehouses = async () => {
    try {
        await Warehouse.bulkCreate(warehouseData);
        console.log(`Warehouse seeding done`);
    } catch (error) {
        console.error('Error seeding warehouse:', error.message);
        throw error;
    }
};
