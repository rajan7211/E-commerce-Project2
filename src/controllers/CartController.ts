import { Request, Response } from "express";
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

// ==================== GET CART ====================
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
    console.error("Cart controller getCart error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== ADD TO CART ====================
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
    console.error("Cart controller addToCart error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== UPDATE CART ITEM ====================
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
    console.error("Cart controller updateCartItem error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== REMOVE FROM CART ====================
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
    console.error("Cart controller removeFromCart error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== CLEAR CART ====================
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
    console.error("Cart controller clearCart error:", error);
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};



