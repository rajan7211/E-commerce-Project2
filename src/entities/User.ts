import { UserRole } from "../utils/enums";
import bcrypt from "bcrypt";

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";


import { Address } from "./Address";
import { Cart } from "./Cart";
import { Order } from "./Order";
import { Store } from "./Store";
import { Otpverification } from "./otpVerification";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  user_email: string;

  @Column()
  user_pass: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;



  @Column({ type: "varchar", length: 6, nullable: true })
  forgot_password_otp: string | null;


  @Column({ type: "timestamp", nullable: true })
  forgot_password_otp_expires_at: Date | null;


  @Column({ type: "boolean", default: false })
  forgot_password_otp_verified: boolean;

  @OneToMany(() => Otpverification, (otp) => otp.user, {
    onDelete: "CASCADE",
  })
  otps: Otpverification[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Store, (store) => store.user)
  stores: Store[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.user_pass && !this.user_pass.startsWith("$2b$2b")) {
      this.user_pass = await bcrypt.hash(this.user_pass, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.user_pass);
  }
}






























