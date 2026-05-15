import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Order } from "./Order";


@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal")
  amount: number;

  @Column()
  payment_method: string;

  @Column({
    type: "enum",
    enum: ["pending", "success", "failed"],
  })
  transaction_status: string;

  @Column()
  transaction_id: string;

  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;
  
  @CreateDateColumn()
  created_at: Date;
}













