import {
  getOrCreateCart,
  getCartByUserId,
  addCartItem,
  findCartItem,
  updateCartItem as repoUpdateCartItem,
  removeCartItem,
  clearCart as repoClearCart,
  updateCartTotals,
  findCartItemById,
} from "../repositories/cart.repository";
import { productFindById as findProductById } from "../repositories/product.repository";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import {
  AddToCartRequestBody,
  UpdateCartItemRequestBody,
  CartResponse,
  CartListResponse,
  CartItemResponse,
} from "../Interfaces/cart.interface";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";

// Helper to format cart item response
const formatCartItem = (item: any): CartItemResponse => {
  return {
    id: item.id,
    quantity: item.quantity,
    product: {
      product_id: item.product.product_id,
      product_name: item.product.product_name,
      product_price: item.product.product_price,
      product_description: item.product.product_description,
      images: item.product.images,
      stock: item.product.stock,
    },
    subtotal: item.product.product_price * item.quantity,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
};

// Helper to format cart response
const formatCart = (cart: any): CartResponse => {
  return {
    id: cart.id,
    total_price: cart.total_price,
    total_items: cart.total_items,
    items: cart.cartItems.map((item: any) => formatCartItem(item)),
    created_at: cart.created_at,
    updated_at: cart.updated_at,
  };
};

// get cart
export const getCart = async (
  userId: number
): Promise<ServiceResponse<CartListResponse>> => {
  try {
    const cart = await getCartByUserId(userId);

    if (!cart) {
      return {
        success: true,
        message: ResponseMessage.CART_NOT_FOUND,
        data: {
          cart: null,
          message: "Cart is empty. Start shopping!",
        },
        statusCode: HttpStatus.OK,
      };
    }

    return {
      success: true,
      message: ResponseMessage.SUCCESS,
      data: {
        cart: formatCart(cart),
        message: "Cart retrieved successfully.",
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Cart service getCart error:", error);
    throw error;
  }
};

// Add to Cart
export const addToCart = async (
  userId: number,
  data: AddToCartRequestBody
): Promise<ServiceResponse<CartResponse>> => {
  try {
    // Verify product exists and has stock
    const product = await findProductById(data.product_id);

    if (!product) {
      throw createError(ResponseMessage.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (product.stock < data.quantity) {
      throw createError(ResponseMessage.QUANTITY_EXCEEDS_STOCK, HttpStatus.BAD_REQUEST);
    }

    // Get or create cart
    const cart = await getOrCreateCart(userId);

    // Check if product already in cart
    const existingItem = await findCartItem(cart.id, data.product_id);

    if (existingItem) {
      throw createError(ResponseMessage.PRODUCT_ALREADY_IN_CART, HttpStatus.CONFLICT);
    }

    // Add item to cart
    await addCartItem(cart.id, data.product_id, data.quantity);

    // Update cart totals
    const updatedCart = await updateCartTotals(cart.id);

    return {
      success: true,
      message: ResponseMessage.CART_ITEM_ADDED_SUCCESS,
      data: formatCart(updatedCart),
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Cart service addToCart error:", error);
    throw error;
  }
};

// Update cart Item 
export const updateCartItem = async (
  userId: number,
  cartItemId: number,
  data: UpdateCartItemRequestBody
): Promise<ServiceResponse<CartResponse>> => {
  try {
    // Verify cart item exists and belongs to user
    const cartItem = await findCartItemById(cartItemId);

    if (!cartItem) {
      throw createError(ResponseMessage.CART_ITEM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const cart = await getCartByUserId(userId);

    if (!cart || cart.id !== cartItem.cart.id) {
      throw createError(ResponseMessage.UNAUTHORIZED, HttpStatus.FORBIDDEN);
    }

    // Verify product stock
    if (cartItem.product.stock < data.quantity) {
      throw createError(ResponseMessage.QUANTITY_EXCEEDS_STOCK, HttpStatus.BAD_REQUEST);
    }

    // Update cart item
    await repoUpdateCartItem(cartItemId, data.quantity);

    // Update cart totals
    const updatedCart = await updateCartTotals(cart.id);

    return {
      success: true,
      message: ResponseMessage.CART_ITEM_UPDATED_SUCCESS,
      data: formatCart(updatedCart),
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Cart service updateCartItem error:", error);
    throw error;
  }
};

// Remove from cart  
export const removeFromCart = async (
  userId: number,
  cartItemId: number
): Promise<ServiceResponse<CartResponse>> => {
  try {
    // Verify cart item exists and belongs to user
    const cartItem = await findCartItemById(cartItemId);

    if (!cartItem) {
      throw createError(ResponseMessage.CART_ITEM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const cart = await getCartByUserId(userId);

    if (!cart || cart.id !== cartItem.cart.id) {
      throw createError(ResponseMessage.UNAUTHORIZED, HttpStatus.FORBIDDEN);
    }

    // Remove item
    await removeCartItem(cartItemId);

    // Update cart totals
    const updatedCart = await updateCartTotals(cart.id);

    return {
      success: true,
      message: ResponseMessage.CART_ITEM_REMOVED_SUCCESS,
      data: formatCart(updatedCart),
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Cart service removeFromCart error:", error);
    throw error;
  }
};

// Clear cart  
export const clearCart = async (
  userId: number
): Promise<ServiceResponse<CartResponse>> => {
  try {
    const cart = await getCartByUserId(userId);

    if (!cart) {
      throw createError(ResponseMessage.CART_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Clear cart items
    await repoClearCart(cart.id);

    // Get updated cart
    const updatedCart = await getCartByUserId(userId);

    return {
      success: true,
      message: ResponseMessage.CART_CLEARED_SUCCESS,
      data: formatCart(updatedCart!),
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    console.error("Cart service clearCart error:", error);
    throw error;
  }
};











