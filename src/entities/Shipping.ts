import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @ManyToOne(() => Order, (order) => order.shipping)
  order: Order;
}





