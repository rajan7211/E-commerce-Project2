import {
  Entity, 
  PrimaryGeneratedColumn, 
  Column,
  ManyToOne, 
  JoinColumn
} from "typeorm";

import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity("cart_item")
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: "product_id" })
  product: Product;


}




















