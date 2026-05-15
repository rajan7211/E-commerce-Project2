import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Order } from "./Order";

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ["pending", "packed", "shipped", "delivered"],
  })
  status: string;

  @CreateDateColumn()
  date_time:Date;

  @ManyToOne(() => Order, (order) => order.tracks)
  order: Order;

}






