import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { UserRole } from "../utils/enums";


const getRepository =() : Repository<User> => {
  return AppDataSource.getRepository(User);
};


export const create = async (userData: {
    first_name: string;
  last_name: string;
  user_email: string;
  user_pass: string;
  role?: UserRole;
}) : Promise<User> => {
  const repository = getRepository();


  const user = repository.create({
    first_name : userData.first_name,
    last_name : userData.first_name,
    user_email : userData.user_email,
    user_pass : userData.user_pass,
    role : userData.role || UserRole.CUSTOMER,
    is_verified : false,
  });
  return await repository.save(user);
};

// find user my mail 
export const findByEmail = async (email : string) : Promise<User | null > => {
  const repository = getRepository();
  return await repository.findOne({
    where : {user_email : email},
  })
};

// find by user ID 
export const findById = async ( id : number) : Promise<User | null> => {
  const repository = getRepository();
  return await repository.findOne({
    where : {id},
  });
};


// verify user 


export const verifyUser = async (userId : number) : Promise<User> => {
  const repository = getRepository();

  await repository.update(userId, {is_verified:true});
  const user = await findById(userId);

  if (!user) {
  throw new Error ("user not found")
  }

  return user;
};



// check if email existed 
export const emailExists = async (email : string) : Promise<boolean> => {
  const repository = getRepository();

  const count = await repository.count({
    where : { user_email : email},
  })

  return count >0;
};



// find user with OTPS 

export const findEmailWithOtps = async (email : string) : Promise<User | null > => {
  const repository = getRepository();

  return await repository.findOne ({
    where : {user_email : email},
    relations : ["otps"],
  });

};


// update user 

 export const update = async (userId : number , date : Partial<User>) : 
 Promise<User> => {
  const repository = getRepository();

  await repository.update(userId, date);
  const user = await findById(userId);

  if (!user) {
     throw new Error ("user is not found");
  }
  return user;

 }

// delete user by mail 

export const deleteByEmail = async (email: string): Promise<void> => {
  const repository = getRepository();

  await repository.delete({ user_email: email });
};



 