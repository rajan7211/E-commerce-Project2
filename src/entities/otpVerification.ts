import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("otp_verifications")
export class Otpverification {
    @PrimaryGeneratedColumn()
    id : number;


@ManyToOne(()=> User, (user) => user.otps, {onDelete: "CASCADE"})

@JoinColumn ({name : "user_id"})
    user : User;

    @Column({ length : 6})
    otp_code : string;

    @Column()
    expires_at : Date;

    @Column ({ default : false})
    is_used : boolean;

    @CreateDateColumn()
    created_at : Date ; 

}





















