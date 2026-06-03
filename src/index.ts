import { AppDataSource } from "./config/data-source";
import dotenv from "dotenv";
import authRoutes from './routes/auth';
import categoryRoutes from "./routes/category.route"
import { errorHandler } from "./middlewares/error-handler.middleware";
import productRoutes from './routes/product.route'
import storeRoutes from './routes/store.route'
import cartRoutes from './routes/cart.routes';
import { loggerMiddleware, errorLogger } from "./middlewares/logger.middleware";
import logger from "./config/logger.config";



dotenv.config();

import express = require ("express");
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import path = require("node:path");



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// server uploaded images publicly 
app.use("/public" , express.static(path.join(__dirname,"../public")));


// swagger documentation 
app.use("/api-docs" , swaggerUi.serve, swaggerUi.setup(specs));
// Custom Logger Middleware
app.use(loggerMiddleware);


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
app.use("/cart", cartRoutes);



app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// error logger middleware 
app.use(errorLogger);
// erroir handler 
app.use(errorHandler);


const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected successfully!");


    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Database connection failed:", err);
    process.exit(1);
  });





  




  

















