import { otpVerification } from "./OtpVerification";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,

} from "typeorm";


@Entity ('users') 
export class User {
    @PrimaryGeneratedColumn()
    id : number;

@Column({ unique : true})
user_email : string;


@Column({ unique : true})
user_pass : string;


@Column({ unique : true})
phone_number : string;


@Column({ type: 'enum', enum: 
    ['user', 'seller' , 'admin'],
    default : 'user'})
     role : string;

@Column ({default : false})
is_verified: boolean;

@Column ({default : ()=> 'CURRENT_TIMESTAMP'})
    created_at : Date;

@OneToMany(()=> otpVerification, (otp) => otp.user)
otps: otpVerification[];


}






