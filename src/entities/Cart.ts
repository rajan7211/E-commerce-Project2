import {
  Entity, PrimaryGeneratedColumn, OneToOne,
  OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn
} from "typeorm";

import { User } from "./User";
import { CartItem } from "./CartItem";

@Entity("cart")
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => CartItem, (cartItem: CartItem) => cartItem.cart)
  cartItems: CartItem[];
}


  
























