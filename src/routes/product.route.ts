import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { productValidation } from "../validations/product.validation";
import {
  create,
  findAll,
  findById,
  findByStore,
  update,
  deleteById,
  updateStock,
} from "../controllers/ProductController";

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     description: Retrieve a list of all products with optional filters
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: integer
 *         description: Filter by store ID
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: in_stock
 *         schema:
 *           type: boolean
 *         description: Filter only in-stock products
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Success."
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_id:
 *                             type: number
 *                             example: 1
 *                           product_name:
 *                             type: string
 *                             example: "Laptop"
 *                           product_price:
 *                             type: number
 *                             example: 999.99
 *                           stock:
 *                             type: number
 *                             example: 50
 *                           category:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                               category_name:
 *                                 type: string
 *                           store:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                               store_name:
 *                                 type: string
 *                     total:
 *                       type: number
 *                       example: 100
 *       500:
 *         description: Internal server error
 */
router.get("/", findAll);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     description: Create a new product (Authenticated sellers only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_name
 *               - product_price
 *               - stock
 *               - category_id
 *               - store_id
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: "Laptop"
 *               product_price:
 *                 type: number
 *                 example: 999.99
 *               product_description:
 *                 type: string
 *                 example: "High performance laptop"
 *               stock:
 *                 type: number
 *                 example: 50
 *               category_id:
 *                 type: number
 *                 example: 1
 *               store_id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your store
 *       404:
 *         description: Category or Store not found
 *       409:
 *         description: Product already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authenticate,
  validateRequest(productValidation.createProduct),
  create
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     description: Retrieve a single product by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", findById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     description: Update an existing product (Authenticated sellers only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: "Updated Laptop"
 *               product_price:
 *                 type: number
 *                 example: 899.99
 *               product_description:
 *                 type: string
 *                 example: "Updated description"
 *               stock:
 *                 type: number
 *                 example: 45
 *               category_id:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your product
 *       404:
 *         description: Product or Category not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authenticate,
  validateRequest(productValidation.updateProduct),
  update
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     description: Delete a product by ID (Authenticated sellers only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", 
    authenticate, deleteById);

/**
 * @swagger
 * /products/store/{storeId}:
 *   get:
 *     summary: Get products by store
 *     tags: [Products]
 *     description: Get all products for a specific store (Authenticated users only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Store ID
 *     responses:
 *       200:
 *         description: List of store products
 *       400:
 *         description: Invalid store ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your store
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */
router.get("/store/:storeId",
     authenticate, findByStore);

/**
 * @swagger
 * /products/{id}/stock:
 *   put:
 *     summary: Update product stock
 *     tags: [Products]
 *     description: Update product stock quantity (Authenticated sellers only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 10
 *                 description: Quantity to deduct from stock
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       400:
 *         description: Invalid quantity or insufficient stock
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id/stock", 
    authenticate, updateStock);

export default router;
















