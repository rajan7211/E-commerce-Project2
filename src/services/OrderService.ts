import logger from "../config/logger.config";
import { AppDataSource } from "../config/data-source";
import {
  findOrdersByUserId,
  findOrderByID,
  createOrderWithTransaction,
  createOrderItemWithTransaction,
  createPaymentWithTransaction,
  createShippingWithTransaction,
  createTrackWithTransaction,
} from "../repositories/order.repository";
import { getCartByUserId } from "../repositories/cart.repository";
import { productFindById } from "../repositories/product.repository";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import {
  CreateOrderRequestBody,
  OrderResponse,
  OrderListResponse,
} from "../Interfaces/order.interface";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";

// helper to format Order response

const formatOrder = (order: any): OrderResponse => {
  return {
    id: order.id,
    total_price: parseFloat(order.total_price),
    status: order.status,
    items: order.items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      price: parseFloat(item.price),
      product: {
        product_id: item.product.product_id,
        product_name: item.product.product_name,
        images: item.product.images,
      },
    })),
    payment: order.payments?.[0]
      ? {
          id: order.payments[0].id,
          amount: parseFloat(order.payments[0].amount),
          payment_method: order.payments[0].payment_method,
          transaction_status: order.payments[0].transaction_status,
          transaction_id: order.payments[0].transaction_id,
        }
      : null,
    shipping: order.shipping?.[0]
      ? {
          id: order.shipping[0].id,
          address: order.shipping[0].address,
        }
      : null,
    tracking: order.tracks?.[0]
      ? {
          id: order.tracks[0].id,
          status: order.tracks[0].status,
          date_time: order.tracks[0].date_time,
        }
      : null,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
};

// placed order
export const placeOrder = async (
  userId: number,
  data: CreateOrderRequestBody,
): Promise<ServiceResponse<OrderResponse>> => {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    logger.info(`OrderService placeOrder started for user ${userId}`);

    await queryRunner.connect();
    await queryRunner.startTransaction();

    // get user Cart
    const cart = await getCartByUserId(userId);

    if (!cart || cart.cartItems.length === 0) {
      throw createError(
        ResponseMessage.CART_EMPTY_CANNOT_ORDER,
        HttpStatus.BAD_REQUEST,
      );
    }

    //  validate stockk and calculate total

    let totalPrice = 0;
    const cartItem = cart.cartItems;

    for (const item of cartItem) {
      const product = await productFindById(item.product.product_id);
      if (!product) {
        throw createError(
          ResponseMessage.PRODUCT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (product.stock < item.quantity) {
        throw createError(
          ResponseMessage.QUANTITY_EXCEEDS_STOCK,
          HttpStatus.BAD_REQUEST,
        );
      }
      totalPrice += product.product_price * item.quantity;
    }
    //    create order
    const order = await createOrderWithTransaction(
      queryRunner,
      userId,
      totalPrice,
      "pending",
    );

    //  create order Items & update Stock
    for (const item of cartItem) {
      const product = await productFindById(item.product.product_id);
      if (!product) {
        throw createError(
          ResponseMessage.PRODUCT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      // create order item
      await createOrderItemWithTransaction(
        queryRunner,
        order.id,
        product.product_id,
        item.quantity,
        product.product_price,
      );

      //  update stock
      const newStock = product.stock - item.quantity;
      await queryRunner.manager.update(Product, product.product_id, {
        stock: newStock,
      });
    }

    // create payment record
    const transactionId = `TXN-${Date.now()} - ${Math.floor(Math.random() * 1000)}`;
    await createPaymentWithTransaction(
      queryRunner,
      order.id,
      totalPrice,
      data.payment_method,
      transactionId,
    );

    // create shipping Record
    await createShippingWithTransaction(
      queryRunner,
      order.id,
      data.shipping_address,
    );

    // craete tracking record
    await createTrackWithTransaction(queryRunner, order.id);

    // clear cart
    await queryRunner.manager.delete(CartItem, {
      cart: {
        id: cart.id,
      },
    });

    await queryRunner.manager.update(cart.constructor, cart.id, {
      total_price: 0,
      total_items: 0,
    });

    await queryRunner.commitTransaction();

    // fetch full order details for response
    const fullOrder = await findOrderByID(order.id);

    if (!fullOrder) {
      throw createError(ResponseMessage.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: ResponseMessage.ORDER_CREATED_SUCCESS,
      data: formatOrder(fullOrder),
      statusCode: HttpStatus.CREATED,
    };
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    logger.error(`OrderService placeOrder error :`, error);

    throw error;
  } finally {
    await queryRunner.release();
  }
};

// get user orders

export const getUserOrders = async (
  userId: number,
): Promise<ServiceResponse<OrderListResponse>> => {
  try {
    logger.info(`OrderService getUserOrders started for user ${userId}`);

    const orders = await findOrdersByUserId(userId);

    logger.info(
      `OrderService getUserOrders succeeded for user ${userId}, found ${orders.length} orders`,
    );

    return {
      success: true,
      message: ResponseMessage.ORDERS_RETRIEVED_SUCCESS,
      data: {
        orders: orders.map((order) => formatOrder(order)),
        total: orders.length,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    logger.error("OrderService getUserOrders error:", error);
    throw error;
  }
};

// Get Order Details
export const getOrderDetails = async (
  userId: number,
  orderId: number,
): Promise<ServiceResponse<OrderResponse>> => {
  try {
    logger.info(
      `OrderService getOrderDetails started for order ${orderId} by user ${userId}`,
    );

    const order = await findOrderByID(orderId);

    if (!order) {
      throw createError(ResponseMessage.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Check ownership
    if (order.user.id !== userId) {
      throw createError(
        ResponseMessage.UNAUTHORIZED_ORDER_ACCESS,
        HttpStatus.FORBIDDEN,
      );
    }

    logger.info(
      `OrderService getOrderDetails succeeded for order ${orderId} by user ${userId}`,
    );

    return {
      success: true,
      message: ResponseMessage.SUCCESS,
      data: formatOrder(order),
      statusCode: HttpStatus.OK,
    };
  } catch (error: any) {
    logger.error("OrderService getOrderDetails error:", error);
    throw error;
  }
};















