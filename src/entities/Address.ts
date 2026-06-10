import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column,
    ManyToOne,
    CreateDateColumn, UpdateDateColumn
    

} 
    from "typeorm";

import { User } from "./User";

@Entity() 
export class Address{
    @PrimaryGeneratedColumn()
    id : number;

@Column ({type : "text", nullable : true})
address : string;
@Column ({ type : "text", nullable : true})
city : string;

@Column ({ type : "text",nullable : true})
state :string;

@ManyToOne(()=> User, (user)=> user.addresses)
user : User;
@CreateDateColumn()
created_at: Date;

@UpdateDateColumn()
updated_at: Date;

}






















