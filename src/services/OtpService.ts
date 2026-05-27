
import {
  findByEmail as findUserByEmail,
  verifyUser as verifyUserService,
} from "../repositories/user.repository";
import {
  create as createOtp,
  findValidOtp as findValidOtpRecord,
  markAsUsed as markOtpAsUsed,
  invalidatePreviousOtps as invalidateOldOtps,
} from "../repositories/otp.repository";
import { sendOtpEmail, sendWelcomeEmail } from "./EmailService";
import { getnerateOtp, getOtpExpiry, isOtpExpired } from "../utils/otp.util";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";
import { User } from "../entities/User";



// generate otp and send otp 
export const generateAndSendOtp = async (user : User) : Promise<void> => {
  const otpCode = getnerateOtp();
   const otpExpiry = getOtpExpiry();

   await createOtp(user , otpCode , otpExpiry);
   await sendOtpEmail(user.user_email, user.first_name , otpCode);

};



// verify otp 
 export const verifyOtp = async (
  email : string , 
  otp : string

 ) : Promise<ServiceResponse> => {
  const normalizedEmail = email.toLowerCase().trim();


  //  find user 
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw createError (ResponseMessage.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND)
  };

  //  check if already verified 

  if(user.is_verified) {
    return {
      success : true,
      message : "Email already verfied",
      statusCode : HttpStatus.OK
    };
  };

  // find valid otp 
  const otpRecord = await findValidOtpRecord(user.id, otp);
  if (!otpRecord) {
    throw createError (ResponseMessage.OTP_INVALID, HttpStatus.BAD_REQUEST);
  }

  // check if OTp expired  
  if (isOtpExpired(otpRecord.expires_at)) {
    throw createError (ResponseMessage.OTP_EXPIRED , HttpStatus.BAD_REQUEST);
  };

  // otp is already used  

  if (otpRecord.is_used) {
    throw createError(ResponseMessage.OTP_ALREADY_USED , HttpStatus.BAD_REQUEST)
  }

  // mark OTp as used 

  await markOtpAsUsed(otpRecord.id);

  // verify user 

   await verifyUserService(user.id);


  // send welcome msg
  
  sendWelcomeEmail(user.user_email , user.first_name).catch ((err: any)=>
  console.log("Welcome email error:" , err)
  );
 return {
  success : true, 
  message : ResponseMessage.OTP_VERIFIED,
  statusCode : HttpStatus.OK
 };


 };

//  resend otp  

export  const resendOtp = async (email : string) : Promise<ServiceResponse> => {
  const normalizedEmail = email.toLowerCase().trim();

  // find user 
   const user = await findUserByEmail(normalizedEmail);
   if (!user ) {
    throw createError (ResponseMessage.USER_NOT_FOUND , HttpStatus.NOT_FOUND);
   }


  // check if already verified 
   if (user.is_verified) {
    throw createError (ResponseMessage.EMAIL_ALREADY_EXISTS , HttpStatus.BAD_REQUEST)
   }
   
    
    // Invalidate previous otp 
    await invalidateOldOtps(user.id);


    // generate  and send otp 

    await generateAndSendOtp(user);

    return {
      success : true , 
      message : ResponseMessage.OTP_SENT,
      statusCode : HttpStatus.OK,
    };

}




















