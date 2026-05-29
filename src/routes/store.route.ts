import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { storeValidation } from "../validations/store.validation";
import {
  create,
  findAll,
  findById,
  findByUser,
  update,
  deleteById,
} from "../controllers/StoreController";

const router = Router();

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Get all stores
 *     tags: [Stores]
 *     description: Retrieve a list of all stores
 *     responses:
 *       200:
 *         description: List of all stores
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
 *                     stores:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           store_name:
 *                             type: string
 *                             example: "Tech Store"
 *                           store_description:
 *                             type: string
 *                             example: "Best electronics store"
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                               first_name:
 *                                 type: string
 *                               last_name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                     total:
 *                       type: number
 *                       example: 10
 *       500:
 *         description: Internal server error
 */
router.get("/", findAll);

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Create a new store
 *     tags: [Stores]
 *     description: Create a new store (Authenticated users only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - store_name
 *             properties:
 *               store_name:
 *                 type: string
 *                 example: "Tech Store"
 *               store_description:
 *                 type: string
 *                 example: "Best electronics store"
 *               store_logo:
 *                 type: string
 *                 example: "https://example.com/logo.png"
 *     responses:
 *       201:
 *         description: Store created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Store already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authenticate,
  validateRequest(storeValidation.createStore),
  create
);

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Get store by ID
 *     tags: [Stores]
 *     description: Retrieve a single store by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store details
 *       400:
 *         description: Invalid store ID
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", findById);

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Update store
 *     tags: [Stores]
 *     description: Update an existing store (Authenticated users only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_name:
 *                 type: string
 *                 example: "Updated Tech Store"
 *               store_description:
 *                 type: string
 *                 example: "Updated description"
 *               store_logo:
 *                 type: string
 *                 example: "https://example.com/new-logo.png"
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your store
 *       404:
 *         description: Store not found
 *       409:
 *         description: Store already exists
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authenticate,
  validateRequest(storeValidation.updateStore),
  update
);

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Delete store
 *     tags: [Stores]
 *     description: Delete a store by ID (Authenticated users only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store deleted successfully
 *       400:
 *         description: Invalid store ID or Store has products
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your store
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticate, deleteById);

/**
 * @swagger
 * /stores/my-stores:
 *   get:
 *     summary: Get my stores
 *     tags: [Stores]
 *     description: Get all stores owned by authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's stores
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/my-stores", 
    authenticate, findByUser);

export default router;














