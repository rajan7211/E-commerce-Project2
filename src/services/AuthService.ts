import { UserRepository } from "../repositories/user.repository";
import { OtpRepository } from "../repositories/otp.repository";
import { EmailService } from "./EmailService";
import { JwtUtil } from "../utils/jwt.util";
import { OtpUtil } from "../utils/otp.util";
import { UserRole } from "../utils/enums";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import {
  RegisterRequestBody,
  RegisterResponse,
} from "../Interfaces/auth.interface";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";




export class AuthService {
  private userRepository: UserRepository = new UserRepository();
  private otpRepository : OtpRepository = new OtpRepository();
  private emailService : EmailService = new EmailService();


   async register(data : RegisterRequestBody): Promise<ServiceResponse<RegisterResponse>> {
    const normalizedEmail = data.email.toLowerCase().trim();

    const emailExists = await this.userRepository.emailExists(normalizedEmail);
    if(emailExists) {
      throw createError (ResponseMessage.EMAIL_ALREADY_EXISTS,
        HttpStatus.CONFLICT);
    }

          
    const user = await this.userRepository.create ({
      first_name :data.first_name,
      last_name : data.last_name,
      user_email : normalizedEmail,
      user_pass : data.password,
      role :data.role || UserRole.CUSTOMER,
    });

    const otpCode = OtpUtil.generateOtp();
    const otpExpiry = OtpUtil.getOtpExpiry();

//save otp
    await this.otpRepository.create(user, otpCode , otpExpiry);

//send otp

await this.emailService.sendOtpEmail(user.user_email, user.first_name, otpCode);

    return {
      success: true,
      message: ResponseMessage.REGISTRATION_SUCCESS,
      data: {
        email: user.user_email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_verified: user.is_verified,
      },
      statusCode: HttpStatus.CREATED,
    };
  }


// verify otp

 async verifyOtp(email : string,  otp : string): Promise<ServiceResponse> {
  const normalizedEmail = email.toLowerCase().trim();


  const user  = await this.userRepository.findByEmail(normalizedEmail);
  if(!user) {
    throw createError(ResponseMessage.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND);
  }


  if (user.is_verified) {
    return {
      success : true,
      message : "email already verified. you can login now",
      statusCode : HttpStatus.OK,
    };
  }


// find valid otp

const otpRecord= await this.otpRepository.findValidOtp(user.id, otp);
if (!otpRecord) {
  throw createError (ResponseMessage.OTP_INVALID, HttpStatus.BAD_REQUEST);
}

if (OtpUtil.isOtpExpired(otpRecord.expires_at)) {
  throw createError(
    ResponseMessage.OTP_ALREADY_USED , 
    HttpStatus.BAD_REQUEST);
}
  if (otpRecord.is_used) {
    throw createError (ResponseMessage.OTP_ALREADY_USED, HttpStatus.BAD_REQUEST);
  }

  await this.otpRepository.markAsUsed(otpRecord.id);

  await this.userRepository.verifyUser(user.id);

  this.emailService.sendWelcomeEmail(user.user_email, user.first_name).catch((err)=> 
    console.log("email error:", err));
  
   return {
    success : true,
    message : ResponseMessage.OTP_VERIFIED,
    statusCode : HttpStatus.OK
   };

 }

// resend otp

 async resendOtp(email : string): Promise<ServiceResponse> {
   const normalizedEmail = email.toLowerCase().trim();

  //  find user 
  const user = await this.userRepository.findByEmail(normalizedEmail);
  if(!user) {
    throw createError (ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  if (user.is_verified) {
    throw createError("email already verified. please login account" , HttpStatus.BAD_REQUEST);
  }

 await this.otpRepository.invalidatePreviousOtps(user.id);

 const otpCode = OtpUtil.generateOtp();
 const otpExpiry = OtpUtil.getOtpExpiry();


 await this.otpRepository.create(user , otpCode, otpExpiry);

 await this.emailService.sendOtpEmail(user.user_email , user.first_name , otpCode);

 return {
  success : true,
  message : ResponseMessage.OTP_SENT,
  statusCode : HttpStatus.OK,
 };
 } 






}


















