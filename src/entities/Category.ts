import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany
} from "typeorm";
import { Product } from "./Product";

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  category_name: string;
  

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

}










