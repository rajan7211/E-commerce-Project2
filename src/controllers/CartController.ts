import { Request, Response } from "express";
import logger from "../config/logger.config";
import {
  getCart as getCartService,
  addToCart as addToCartService,
  updateCartItem as updateCartItemService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
} from "../services/CartService";
import {
  AddToCartRequestBody,
  UpdateCartItemRequestBody,
} from "../Interfaces/cart.interface";


// get cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await getCartService(userId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    logger.error("Cart controller getCart error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// add to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data: AddToCartRequestBody = req.body;
    const result = await addToCartService(userId, data);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    logger.error("Cart controller addToCart error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// update cart itms 
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const cartItemId = parseInt(req.params.itemId as string);

    if (isNaN(cartItemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const data: UpdateCartItemRequestBody = req.body;
    const result = await updateCartItemService(userId, cartItemId, data);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    logger.error("Cart controller updateCartItem error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// remove from cart  
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const cartItemId = parseInt(req.params.itemId as string);

    if (isNaN(cartItemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const result = await removeFromCartService(userId, cartItemId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    logger.error("Cart controller removeFromCart error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// clear cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await clearCartService(userId);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    logger.error("Cart controller clearCart error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
















