import {
  Entity,
   PrimaryGeneratedColumn, 
   Column, 
   OneToMany,
   CreateDateColumn,
   UpdateDateColumn,
} from "typeorm";
import { Product } from "./Product";

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  category_name: string;
  

  @CreateDateColumn()
  created_at : Date;

  @UpdateDateColumn()
  updated_at : Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

}
















