import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity("cart_item")
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: Product;
}





