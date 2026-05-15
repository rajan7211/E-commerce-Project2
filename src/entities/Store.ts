import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, OneToMany, CreateDateColumn   
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity("store")
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  store_name: string;

  @Column({ type: "text", nullable: true })
  store_description: string;

  @Column({ type: "varchar", nullable: true })
  store_logo: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.stores)  
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];
}







