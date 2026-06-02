import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";

const getCartRepository = (): Repository<Cart> => {
  return AppDataSource.getRepository(Cart);
};

const getCartItemRepository = (): Repository<CartItem> => {
  return AppDataSource.getRepository(CartItem);
};



//  get and Create cart 
export const cartRepository =  async (userId : number) : Promise<Cart> => {
     try {
        const repository = getCartRepository();

        let cart = await repository.findOne ({
            where : {user : { id : userId }},
            relations: ["cartItems" , "cartItems.product"],
        }),

        if(!cart) {
            cart = repository.create({
                user : {id : userId},
                total_price : 0,
                total_items : 0,
            })

            cart = await repository.save(cart);
        }
        return cart;
     } catch (error : any) {
        console.error("cart repository get or Create_Cart error" , error);
        throw error;
     }
};

// get cart by user ID  

export const getCartByUserId = async (userId : number) : Promise<Cart | null> => {
    try {
        const repository = getCartRepository();
        return await repository.findOne({
            where : {user : {id : userId} },
            relations : ["cartItems" , "cartItems.product"],
        });

        
    }catch (error : any) {
        console.error("cart repository getCartByUserId error " , error);
        throw error;
    }
};


// add itme to cart 
export const addCartItem = async (
    cartId : number,
    productId : number,
    quantity : number
    ) : Promise<CartItem> => {
        try {
            const repository = getCartItemRepository();

            
        }
    }



