import { Entity, 
  PrimaryGeneratedColumn, 
  Column, ManyToOne, OneToMany, 
  UpdateDateColumn, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";
import { Payment } from "./Payment";
import { Track } from "./Track";
import { Shipping } from "./Shipping";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal")
  total_price: number;

  @Column({
    type: "enum",
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  })
  status: string;



  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @OneToMany(() => Track, (track) => track.order)
  tracks: Track[];

  @OneToMany(() => Shipping, (shipping) => shipping.order)
  shipping: Shipping[];

   @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
}















