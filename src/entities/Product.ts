import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

import { Store } from "./Store";
import { Category } from "./Category";
import { OrderItem } from "./OrderItem";
import { CartItem } from "./CartItem";


@Entity("product")
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ type: "varchar" })
  product_name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  product_price: number;

  @Column({ type: "text", nullable: true })
  product_description: string;

  @Column({ type: "int" })
  stock: number;

  @ManyToOne(() => Store, (store) => store.products)
  @JoinColumn({ name: "store_id" })
  store: Store;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];


}












