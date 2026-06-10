import { Repository, QueryRunner } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Payment } from "../entities/Payment";
import { Shipping } from "../entities/Shipping";
import { Track } from "../entities/Track";
import logger from "../config/logger.config";



const getOrderRepository = (): Repository<Order> => {
  return AppDataSource.getRepository(Order);
};

// get orders by user Id
export const findOrdersByUserId = async (userId: number): Promise<Order[]> => {
  try {
    const repository = getOrderRepository();
    const orders = await repository.find({
      where: { user: { id: userId } },
      relations: ["items", "items.product", "payments", "shipping", "tracks"],
      order: { created_at: "DESC" },
    });
    logger.info(`orderRepository findOrderByUserId succeeded for user ${userId}, found
            ${orders.length} orders`);
    return orders;
  } catch (error: any) {
    console.error("Order repository findOrdersByUserId error :", error);
    throw error;
  }
};

// get order by Id

export const findOrderByID = async (id: number): Promise<Order | null> => {
  try {
    const repository = getOrderRepository();
    const order = await repository.findOne({
      where: { id },
      relations: [
        "items",
        "items.product",
        "payments",
        "shipping",
        "tracks",
        "user",
      ],
    });
    if (order) {
      logger.info(`OrderRepositoy findOrderByID succeeded for order ${id}`);
    } else {
      logger.warn(`orderRepository findOrderByID - order ${id} is not found`);
    }
    return order;
  } catch (error: any) {
    logger.error("order repository findOrderById error: ", error);
    throw error;
  }
};

// create Order with Transaction

export const createOrderWithTransaction = async (
  queryRunner: QueryRunner,
  userId: number,
  totalPrice: number,
  status: string,
): Promise<Order> => {
  try {
    const repository = queryRunner.manager.getRepository(Order);
    const order = repository.create({
      user: { id: userId },
      total_price: totalPrice,
      status,
    });
    const savedOrder = await repository.save(order);

    logger.info(`OrderRepository createOrderWithTransaction 
            succeeded for order ${savedOrder.id}`);

    return savedOrder;
  } catch (error: any) {
    logger.error("Order repository CreateOrderWithTransaction error :", error);
    throw error;
  }
};

// Order Item with Transaction
export const createOrderItemWithTransaction = async (
  queryRunner: QueryRunner,
  orderId: number,
  productId: number,
  quantity: number,
  price: number,
): Promise<OrderItem> => {
  try {
    const repository = queryRunner.manager.getRepository(OrderItem);
    const item = repository.create({
      order: { id: orderId },
      product: { product_id: productId },
      quantity,
      price,
    });

    const savedItem = await repository.save(item);

    logger.info(`orderRepository createOrderItemWithTransaction 
            succeeded for item ${savedItem.id}`);

    return savedItem;
  } catch (error: any) {
    logger.error("Order repository createItemWithGTransaction error :", error);
    throw error;
  }
};

// create Payment With Transaction
export const createPaymentWithTransaction = async (
  queryRunner: QueryRunner,
  orderId: number,
  amount: number,
  method: string,
  transactionId: string,
): Promise<Payment> => {
  try {
    const repository = queryRunner.manager.getRepository(Payment);
    const payment = repository.create({
      order: { id: orderId },
      amount,
      payment_method: method,
      transaction_status: "success",
      transaction_id: transactionId,
    });
    const savedpayment = await repository.save(payment);
    logger.info(`OrderRepository createPaymentWithTransaction succeeded for 
            payment ${savedpayment.id}`);

    return savedpayment;
  } catch (error: any) {
    logger.error("Order repository createPaymentWithTransaction error:", error);
    throw error;
  }
};

// create shipping with Transaction

export const createShippingWithTransaction = async (
  queryRunner: QueryRunner,
  orderId: number,
  address: string,
): Promise<Shipping> => {
  try {
    const repository = queryRunner.manager.getRepository(Shipping);
    const shipping = repository.create({
      order: { id: orderId },
      address,
    });
    const savedShipping = await repository.save(shipping);

    logger.info(`OrderRepository succeeded for shipping 
        ${savedShipping.id}`);

    return savedShipping;
  } catch (error: any) {
    logger.error(
      "Order repository createShippingWithTransaction error:",
      error,
    );
    throw error;
  }
};

//  create Track with Transaction
export const createTrackWithTransaction = async (
  queryRunner: QueryRunner,
  orderId: number,
  status: string = "pending",
): Promise<Track> => {
  try {
    const repository = queryRunner.manager.getRepository(Track);
    const track = repository.create({
      order: { id: orderId },
      status,
    });
    const savedTrack = await repository.save(track);

    logger.info(
      `OrderRepository createTrackWithTransaction succeeded for track ${savedTrack.id}`,
    );
    return savedTrack;
  } catch (error: any) {
    logger.error("OrderRepository createTrackWithRepository error:", error);
    throw error;
  }
};


// update order status 
export const updateOrderStatus = async (
    id : number,
    status : string

) : Promise<void> => {
    try {
        const repository = getOrderRepository();
        await repository.update(id, {status});

        logger.info(`OrderRepository updateorderStatus succeeded for 
            order ${id} , new status : ${status}`);
    } catch (error : any) {
        logger.error("OrderReposiotru updateOrderStatus error:" , error);
        throw error;
    }
}

// update order status with Transaction
export const updateOrderStatusWithTransaction = async (
  queryRunner: QueryRunner,
  id: number,
  status: string,
): Promise<void> => {
  try {
    await queryRunner.manager.update(Order, id, { status });

    logger.info(`OrderRepository updateOrderStatusWithTransaction succeeded for 
            order ${id} , new status : ${status}`);
  } catch (error: any) {
    logger.error(
      "OrderRepository updateOrderStatusWithTransaction error:",
      error,
    );
    throw error;
  }
};

// update payment status with Transaction
export const updatePaymentStatusWithTransaction = async (
  queryRunner: QueryRunner,
  orderId: number,
  transactionStatus: string,
): Promise<void> => {
  try {
    await queryRunner.manager.update(
      Payment,
      { order: { id: orderId } },
      { transaction_status: transactionStatus },
    );

    logger.info(`OrderRepository updatePaymentStatusWithTransaction succeeded for 
            order ${orderId} , new status : ${transactionStatus}`);
  } catch (error: any) {
    logger.error(
      "OrderRepository updatePaymentStatusWithTransaction error:",
      error,
    );
    throw error;
  }
};










