import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { cartValidation } from "../validations/cart.validation";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/CartController";

const router = Router();

// All cart routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     description: Retrieve the current user's shopping cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
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
 *                   example: "Cart retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         total_price:
 *                           type: number
 *                         total_items:
 *                           type: number
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", getCart);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     description: Add a product to the user's cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: number
 *                 example: 1
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Validation error or Quantity exceeds stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       409:
 *         description: Product already in cart
 *       500:
 *         description: Internal server error
 */
router.post("/add", validateRequest(cartValidation.addToCart), addToCart);

/**
 * @swagger
 * /cart/item/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     description: Update the quantity of an item in the cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
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
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid quantity or Quantity exceeds stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/item/:itemId",
  validateRequest(cartValidation.updateCartItem),
  updateCartItem
);

/**
 * @swagger
 * /cart/item/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     description: Remove a specific item from the cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
router.delete("/item/:itemId", removeFromCart);

/**
 * @swagger
 * /cart/clear:
 *   post:
 *     summary: Clear cart
 *     tags: [Cart]
 *     description: Remove all items from the user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.post("/clear", clearCart);

export default router;






