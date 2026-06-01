import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { uploadProductImages } from "../middlewares/upload.middleware";
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
 *     description: Retrieve a list of all products with pagination
 *     parameters:
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
 *                           product_description:
 *                             type: string
 *                             example: "High performance laptop"
 *                           stock:
 *                             type: number
 *                             example: 50
 *                           images:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["http://localhost:3000/public/uploads/products/product-123.jpg"]
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
 *                     page:
 *                       type: number
 *                       example: 1
 *                     limit:
 *                       type: number
 *                       example: 10
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
 *     description: Create a new product with optional image uploads (Authenticated sellers only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 10 images (jpeg, jpg, png, gif, webp). Max 5MB each.
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                   example: "Product created successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: number
 *                       example: 1
 *                     product_name:
 *                       type: string
 *                       example: "Laptop"
 *                     product_price:
 *                       type: number
 *                       example: 999.99
 *                     stock:
 *                       type: number
 *                       example: 50
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["http://localhost:3000/public/uploads/products/product-123.jpg"]
 *       400:
 *         description: Validation error or File upload error
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
  uploadProductImages,
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
 *                     product_id:
 *                       type: number
 *                       example: 1
 *                     product_name:
 *                       type: string
 *                       example: "Laptop"
 *                     product_price:
 *                       type: number
 *                       example: 999.99
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
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
 *     description: Update an existing product with optional image uploads (Authenticated sellers only)
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
 *         multipart/form-data:
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
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload new images to replace existing ones (optional). Max 10 images, 5MB each.
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                   example: "Product updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: number
 *                       example: 1
 *                     product_name:
 *                       type: string
 *                       example: "Updated Laptop"
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Validation error or File upload error
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
  uploadProductImages,
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
 *                   example: "Product deleted successfully."
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
router.delete("/:id", authenticate, deleteById);

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
 *                     total:
 *                       type: number
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
router.get("/store/:storeId", authenticate, findByStore);

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
 *                   example: "Product updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: number
 *                     stock:
 *                       type: number
 *                       example: 40
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
router.put("/:id/stock", authenticate, updateStock);

export default router;








