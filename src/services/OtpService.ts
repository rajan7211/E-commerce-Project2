import { UserRepository } from "../repositories/user.repository";
import { OtpRepository } from "../repositories/otp.repository";
import { EmailService } from "./EmailService";
import { OtpUtil } from "../utils/otp.util";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";
import { User } from "../entities/User";



export class OtpService {
    private userRepository : UserRepository = new UserRepository();
    private otpRepository : OtpRepository = new OtpRepository();
    private emailService: EmailService = new EmailService();


  async generateAndSendOtp(user: User): Promise<void> {
    const otpCode = OtpUtil.generateOtp();
    const otpExpiry = OtpUtil.getOtpExpiry();

    await this.otpRepository.create(user, otpCode, otpExpiry); 
    await this.emailService.sendOtpEmail(user.user_email, user.first_name , otpCode);
  }


//   verify otp  
 async verifyOtp(email:string , opt: string): Promise<ServiceResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    const user =  await this.userRepository.findByEmail(normalizedEmail);
    if(!user) {
        throw createError (ResponseMessage.EMAIL_NOT_FOUND , HttpStatus.NOT_FOUND);

    }

    if (user.is_verified) {
        return {
            success : true ,
            message : "Email already verified. you can login",
            statusCode : HttpStatus.OK
        };
    }

    // find valid otp 

    const otpRecord = await this.otpRepository.findValidOtp(user.id , opt);
    if (!otpRecord) {
        throw createError (ResponseMessage.OTP_INVALID , HttpStatus.BAD_REQUEST)
    }

    // find if otp expired 
    if(OtpUtil.isOtpExpired(otpRecord.expires_at)) {
        throw createError (ResponseMessage.OTP_EXPIRED , HttpStatus.BAD_REQUEST)
    }

    // if otp already used 
    if(otpRecord.is_used) {
        throw createError (ResponseMessage.OTP_ALREADY_USED , HttpStatus.BAD_REQUEST)
    }

    // mark otp is used 

    await this.otpRepository.markAsUsed(otpRecord.id)

    // verify userr 
    await this.userRepository.verifyUser(user.id);


    // send welcome msg 
    this.emailService.sendWelcomeEmail(user.user_email, user.first_name).catch((err)=>
    console.log("welcome email error:", err));

    return {
        success : true, 
        message : ResponseMessage.OTP_VERIFIED,
        statusCode : HttpStatus.OK
    };

}
async resendOtp(email: string): Promise<ServiceResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw createError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Check if already verified
    if (user.is_verified) {
      throw createError("Email already verified. Please login.", HttpStatus.BAD_REQUEST);
    }

    // Invalidate previous OTPs
    await this.otpRepository.invalidatePreviousOtps(user.id);

    // Generate and send new OTP
    await this.generateAndSendOtp(user);

    return {
      success: true,
      message: ResponseMessage.OTP_SENT,
      statusCode: HttpStatus.OK,
    };
  }
}


