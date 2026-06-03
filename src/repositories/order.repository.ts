import { Repository, QueryRunner } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Payment } from "../entities/Payment";
import { Shipping } from "../entities/Shipping";
import { Track } from "../entities/Track";


const getOrderRepository = (): Repository<Order> => {
  return AppDataSource.getRepository(Order);
};



// get orders by user Id 
export const findOrdersByUserId = async (userId : number): Promise<Order[]> => {
    try {
        const repository = getOrderRepository();
        return await repository.find({
            where : { user : {id: userId} },
            relations : ["items" , "items.product" , "payments", "shipping" , "tracks"],
            order : {created_at : "DESC"},


        });
        
    }catch (error : any) {
        console.error("Order repository findOrdersByUserId error :" , error);
        throw error;
    }
};

// gett order by Id 

export const findOrderByID = async (id : number):Promise<Order | null > => {
    try {
        const repository = getOrderRepository();
        return await repository.findOne({
            where : {id},
            relations : ["items", "items.product" , "payments" , "shipping" , "tracks" , "users"],

        });

    } catch (error : any) {
        console.error("order repository findOrderById error: ", error) ;
        throw error
    }
}



// create Order with Transaction 





















