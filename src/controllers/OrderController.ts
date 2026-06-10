import { Request, Response } from "express";
import logger from "../config/logger.config";
import {
  placeOrder as placeOrderService,
  getUserOrders as getUserOrdersService,
  getOrderDetails as getOrderDetailsService,
  cancelOrder as cancelOrderService,
} from "../services/OrderService";
import { CreateOrderRequestBody } from "../Interfaces/order.interface";


// place order 
export const placeOrder = async (req : Request , res : Response) => {
    try {
        const userId =  req.user?.userId;
        if(!userId) {
            return res.status(401).json({
                success : false,
                message : "Unauthorized",
            });
        }

        const data : CreateOrderRequestBody = req.body;
        const result  = await placeOrderService(userId, data);

        res.status(result.statusCode).json({
            success : result.success,
            message : result.message,
            data : result.data,
        });

    } catch (error : any) {
        logger.error("OrderController placeOrder error : " , error);

        const statusCode = error.statusCode || 400;

        res.status(statusCode).json({
            success : false,
            message : error.message,
        });
    }


};



// get user Orders 

export const getUserOrders = async (req : Request , res : Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success : false,
                message : "Unauthorized",
            });
        }
        const result = await getUserOrdersService(userId);
        res.status(result.statusCode).json({
            success : result.success,
            message : result.message,
            data : result.data,
        });
    }  catch (error : any) {
        logger.error("OrderController getUserOrders error:" , error);

        const statusCode = error.statusCode || 400;

        res. status(statusCode).json({
            success : false,
            message : error.message,
        });
    }
};


// get order details 
export const getOrderDetails = async (req : Request , res: Response) => {
    try {
        const userId = req.user?.userId;
        if(!userId) {
            return res.status(401).json({
                success : false,
                message : "Unauthorized",
            });
        }

        const orderId = parseInt(req.params.orderId as string);
         if (isNaN(orderId)) {
            return res.status(400).json({
                success : false,
                message : "Invalid Order ID",
            });
         }

         const result = await getOrderDetailsService(userId ,
            orderId);
            res.status(result.statusCode).json({
                success : result.success,
                message : result.message,
                data : result.data,
            });
    } catch (error : any) {
        logger.error("OrderController getOrderDetails error:" , error);
        
         const statusCode = error.statusCode || 400;


         res.status(statusCode).json({
            success : false,
            message : error.message,
         });
    }
};


// cancel order
export const cancelOrder = async (req : Request , res : Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success : false,
                message : "Unauthorized",
            });
        }

        const orderId = parseInt(req.params.orderId as string);
        if (isNaN(orderId)) {
            return res.status(400).json({
                success : false,
                message : "Invalid Order ID",
            });
        }

        const result = await cancelOrderService(userId, orderId);

        res.status(result.statusCode).json({
            success : result.success,
            message : result.message,
            data : result.data,
        });
    } catch (error : any) {
        logger.error("OrderController cancelOrder error:" , error);

        const statusCode = error.statusCode || 400;

        res.status(statusCode).json({
            success : false,
            message : error.message,
        });
    }
};











