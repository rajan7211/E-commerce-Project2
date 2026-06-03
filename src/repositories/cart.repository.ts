import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";

const getCartRepository = (): Repository<Cart> => {
  return AppDataSource.getRepository(Cart);
};

const getCartItemRepository = (): Repository<CartItem> => {
  return AppDataSource.getRepository(CartItem);
};

//  get and create cart
export const getOrCreateCart = async (userId: number): Promise<Cart> => {
  try {
    const repository = getCartRepository();

    let cart = await repository.findOne({
      where: { user: { id: userId } },
      relations: ["cartItems", "cartItems.product"],
    });

    if (!cart) {
      cart = repository.create({
        user: { id: userId },
        total_price: 0,
        total_items: 0,
      });
      cart = await repository.save(cart);
    }

    return cart;
  } catch (error: any) {
    console.error("Cart repository getOrCreateCart error:", error);
    throw error;
  }
};

// get cart By user Id
export const getCartByUserId = async (userId: number): Promise<Cart | null> => {
  try {
    const repository = getCartRepository();
    return await repository.findOne({
      where: { user: { id: userId } },
      relations: ["cartItems", "cartItems.product"],
    });
  } catch (error: any) {
    console.error("Cart repository getCartByUserId error:", error);
    throw error;
  }
};

// Add Items to cart 
export const addCartItem = async (
  cartId: number,
  productId: number,
  quantity: number
): Promise<CartItem> => {
  try {
    const repository = getCartItemRepository();

    const cartItem = repository.create({
      cart: { id: cartId },
      product: { product_id: productId },
      quantity,
    });

    return await repository.save(cartItem);
  } catch (error: any) {
    console.error("Cart repository addCartItem error:", error);
    throw error;
  }
};

// Find cart Itme 
export const findCartItem = async (
  cartId: number,
  productId: number
): Promise<CartItem | null> => {
  try {
    const repository = getCartItemRepository();
    return await repository.findOne({
      where: { cart: { id: cartId }, product: { product_id: productId } },
      relations: ["product"],
    });
  } catch (error: any) {
    console.error("Cart repository findCartItem error:", error);
    throw error;
  }
};

// Update cart Item 
export const updateCartItem = async (
  cartItemId: number,
  quantity: number
): Promise<CartItem> => {
  try {
    const repository = getCartItemRepository();
    await repository.update(cartItemId, { quantity });

    const cartItem = await repository.findOne({
      where: { id: cartItemId },
      relations: ["product"],
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    return cartItem;
  } catch (error: any) {
    console.error("Cart repository updateCartItem error:", error);
    throw error;
  }
};

// Remove cart itme 
export const removeCartItem = async (cartItemId: number): Promise<void> => {
  try {
    const repository = getCartItemRepository();
    await repository.delete(cartItemId);
  } catch (error: any) {
    console.error("Cart repository removeCartItem error:", error);
    throw error;
  }
};

// Clear cart 
export const clearCart = async (cartId: number): Promise<void> => {
  try {
    const repository = getCartItemRepository();
    await repository.delete({ cart: { id: cartId } });

    const cartRepository = getCartRepository();
    await cartRepository.update(cartId, {
      total_price: 0,
      total_items: 0,
    });
  } catch (error: any) {
    console.error("Cart repository clearCart error:", error);
    throw error;
  }
};

// Update cart Totals
export const updateCartTotals = async (cartId: number): Promise<Cart> => {
  try {
    const cartRepository = getCartRepository();
    const cartItemRepository = getCartItemRepository();

    const cartItems = await cartItemRepository.find({
      where: { cart: { id: cartId } },
      relations: ["product"],
    });

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.product_price * item.quantity,
      0
    );

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    await cartRepository.update(cartId, {
      total_price: totalPrice,
      total_items: totalItems,
    });

    const cart = await cartRepository.findOne({
      where: { id: cartId },
      relations: ["cartItems", "cartItems.product"],
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart;
  } catch (error: any) {
    console.error("Cart repository updateCartTotals error:", error);
    throw error;
  }
};

// find cart Item by ID 
export const findCartItemById = async (id: number): Promise<CartItem | null> => {
  try {
    const repository = getCartItemRepository();
    return await repository.findOne({
      where: { id },
      relations: ["product", "cart"],
    });
  } catch (error: any) {
    console.error("Cart repository findCartItemById error:", error);
    throw error;
  }
};







