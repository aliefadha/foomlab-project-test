import 'dotenv/config';
import express from 'express';
import sequelize from './config/sequelize.js';
import warehouseRouter from './routes/warehouse.router.js';
import stockRouter from './routes/stock.router.js';
import productRouter from './routes/product.router.js';
import purchaseRequestRouter from './routes/purchase_request.router.js';
import webhookRouter from './routes/webhook.router.js';

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.use('/warehouses', warehouseRouter);
app.use('/stocks', stockRouter);
app.use('/products', productRouter);
app.use('/purchase/request', purchaseRequestRouter);
app.use('/webhook', webhookRouter);

sequelize.authenticate().then(() => {
    console.log("database synced");
    app.listen(port, () => {
        console.log(`Server runs on ${port}`);
    })
}).catch((err) => {
    console.error("Unable to connect to the database:", err);
});

export default app;
