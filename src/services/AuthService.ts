import { UserRepository } from "../repositories/user.repository";
import { OtpService } from "./OtpService";
import { EmailService } from "./EmailService";
import { JwtUtil } from "../utils/jwt.util";
import { UserRole } from "../utils/enums";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import {
  LoginRequestBody,
  LoginResponse,
  RegisterRequestBody,
  RegisterResponse,

} from "../Interfaces/auth.interface";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";
import { email } from "zod";
import { verify } from "node:crypto";


export class AuthService {
  private userRepository: UserRepository = new UserRepository();
  private otpService: OtpService = new OtpService();

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


    await this.otpService.generateAndSendOtp(user);

    return {
      success  : true,
      message : ResponseMessage.REGISTRATION_SUCCESS,
      data : {
        email : user.user_email,
        first_name : user.first_name,
        last_name : user.last_name,
        is_verified : user.is_verified,
      },

      statusCode : HttpStatus.CREATED
    };
  }



  // login 
  
  async login(data : LoginRequestBody) : Promise<ServiceResponse<LoginResponse>> {
    const normalizedEmail = data.email.toLowerCase().trim();

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if(!user) {
      throw createError(ResponseMessage.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED);

    }


// validate pass 


    const isPasswordValid = await user.validatePassword(data.password);
    if (!isPasswordValid) {
      throw createError(ResponseMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }


// check email is already verified


    if(!user.is_verified) {
      throw createError(ResponseMessage.EMAIL_NOT_VERIFIED , HttpStatus.FORBIDDEN)
    }


    // generate JWT token 

    const tokens = JwtUtil.generateTokens({
      userId : user.id,
      email : user.user_email,
      role : user.role,
      is_verified : user.is_verified,
    });

    
return {
      success: true,
      message: ResponseMessage.LOGIN_SUCCESS,
      data: {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.user_email,
          role: user.role,
          is_verified: user.is_verified,
          created_at: user.created_at,
        },
        tokens,
      },
      statusCode: HttpStatus.OK,
    };

  }
}










