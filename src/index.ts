import { AppDataSource } from "./config/data-source";
import dotenv from "dotenv";
import authRoutes from './routes/auth';
import categoryRoutes from "./routes/category.route"
import { errorHandler } from "./middlewares/error-handler.middleware";
import productRoutes from './routes/product.route'
import storeRoutes from './routes/store.route'

dotenv.config();

import express = require ("express");
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api-docs" , swaggerUi.serve, swaggerUi.setup(specs));


app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});


// Auth routes
app.use('/auth', authRoutes);
app.use("/categories" , categoryRoutes);
app.use("/products" , productRoutes);
app.use("/stores" , storeRoutes);



app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use(errorHandler);


const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");


    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });







  

















