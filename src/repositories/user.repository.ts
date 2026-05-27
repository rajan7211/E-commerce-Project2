import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { UserRole } from "../utils/enums";
import bcrypt from "bcrypt";

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




// save forgot password otp
export const saveForgotPasswordOtp = async (
  userId: number,
  otpCode: string,
  expiresAt: Date
): Promise<User> => {
  const repository = getRepository();

  await repository.update(userId, {
    forgot_password_otp: otpCode,
    forgot_password_otp_expires_at: expiresAt,
    forgot_password_otp_verified: false,
  });

  const user = await findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// verify forgot password otp
export const verifyForgotPasswordOtp = async (
  userId: number,
  otpCode: string
): Promise<boolean> => {
  const repository = getRepository();

  const user = await findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if OTP matches
  if (user.forgot_password_otp !== otpCode) {
    return false;
  }

  // Check if OTP is expired
  if (
    !user.forgot_password_otp_expires_at ||
    new Date() > user.forgot_password_otp_expires_at
  ) {
    return false;
  }

  // Mark OTP as verified
  await repository.update(userId, {
    forgot_password_otp_verified: true,
  });

  return true;
};

// reset password
export const resetPassword = async (
  userId: number,
  newPassword: string
): Promise<User> => {
  const repository = getRepository();

  // Update password and clear OTP fields
const hashedPassword = await bcrypt.hash(newPassword ,10);

  await repository.update(userId, {
    user_pass: hashedPassword, 
    forgot_password_otp: null,
    forgot_password_otp_expires_at: null,
    forgot_password_otp_verified: false,
  });

  const user = await findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// clear forgot password otp
export const clearForgotPasswordOtp = async (userId: number): Promise<void> => {
  const repository = getRepository();

  await repository.update(userId, {
    forgot_password_otp: null,
    forgot_password_otp_expires_at: null,
    forgot_password_otp_verified: false,
  });
};




 