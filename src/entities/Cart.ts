import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./User";
import { CartItem } from "./CartItem";

@Entity("cart")
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  total_price: number;

  @Column({ type: "int", default: 0 })
  total_items: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
    onDelete: "CASCADE",
  })
  cartItems: CartItem[];
}



