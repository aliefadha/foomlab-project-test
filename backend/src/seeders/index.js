import sequelize from '../config/sequelize.js';
import { seeProducts } from './product.seeder.js';
import { seedWarehouses } from './warehouse.seeder.js';
import '../models/index.js';

const runSeeders = async () => {
    try {
        console.log('Seeding...\n');

        await sequelize.authenticate();
        console.log('Database connected');

        await sequelize.sync({ force: true });

        await seedWarehouses();
        await seeProducts();
        console.log('Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('\nSeeding failed:', error.message);
        process.exit(1);
    }
};

runSeeders();
