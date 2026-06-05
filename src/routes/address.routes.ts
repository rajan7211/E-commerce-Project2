import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { addressValidation } from "../validations/address.validation";
import {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../controllers/AddressController";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Add a new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - country
 *             properties:
 *               street:
 *                 type: string
 *                 example: "123 Main St"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               state:
 *                 type: string
 *                 example: "NY"
 *               postal_code:
 *                 type: string
 *                 example: "10001"
 *               country:
 *                 type: string
 *                 example: "United States"
 *     responses:
 *       201:
 *         description: Address created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.post("/", validateRequest(addressValidation.createAddress), addAddress);

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Get all addresses for the current user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/", getAddresses);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: Get a single address by ID
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Address retrieved successfully.
 *       400:
 *         description: Invalid address ID.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Address not found.
 */
router.get("/:id", getAddressById);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Update an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Address not found.
 */
router.put("/:id", validateRequest(addressValidation.updateAddress), updateAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Address deleted successfully.
 *       400:
 *         description: Invalid address ID.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Address not found.
 */
router.delete("/:id", deleteAddress);

export default router;
