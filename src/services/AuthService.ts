import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Otpverification } from "../entities/otpVerification";
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
  LoginRequestBody,
  RegisterResponse,
  LoginResponse,
} from "../Interfaces/auth.interface";
import { ServiceResponse } from "../Interfaces/service-response.interface";

export class AuthService {
  private userRepository: UserRepository;
  private otpRepository: OtpRepository;
  private emailService: EmailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.otpRepository = new OtpRepository();
    this.emailService = new EmailService();
  }


  async register(data: RegisterRequestBody): Promise<ServiceResponse<RegisterResponse>> {
    const normalizedEmail = data.email.toLowerCase().trim();

    const emailExists = await this.userRepository.emailExists(normalizedEmail);
    if (emailExists) {
      throw new Error(ResponseMessage.EMAIL_ALREADY_EXISTS);
    }


    const user = await this.userRepository.create({
      first_name: data.first_name,
      last_name: data.last_name,
      user_email: normalizedEmail,
      user_pass: data.password,
      role: data.role || UserRole.CUSTOMER,
    });


    const otpCode = OtpUtil.generateOtp();
    const otpExpiry = OtpUtil.getOtpExpiry();

    await this.otpRepository.create(user, otpCode, otpExpiry);

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

  
    // VERIFY OTP 
  async verifyOtp(email: string, otp: string): Promise<ServiceResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new Error(ResponseMessage.USER_NOT_FOUND);
    }

    if (user.is_verified) {
      return {
        success: true,
        message: "Email already verified. You can login now.",
        statusCode: HttpStatus.OK,
      };
    }

    const otpRecord = await this.otpRepository.findValidOtp(user.id, otp);

    if (!otpRecord) {
      throw new Error(ResponseMessage.OTP_INVALID);
    }

    if (OtpUtil.isOtpExpired(otpRecord.expires_at)) {
      throw new Error(ResponseMessage.OTP_EXPIRED);
    }

    if (otpRecord.is_used) {
      throw new Error(ResponseMessage.OTP_ALREADY_USED);
    }

    await this.otpRepository.markAsUsed(otpRecord.id);

    await this.userRepository.verifyUser(user.id);

    this.emailService.sendWelcomeEmail(user.user_email, user.first_name).catch((err) =>
      console.error("Welcome email error:", err)
    );

    return {
      success: true,
      message: ResponseMessage.OTP_VERIFIED,
      statusCode: HttpStatus.OK,
    };
  }

// resend otp

  async resendOtp(email: string): Promise<ServiceResponse> {
    const normalizedEmail = email.toLowerCase().trim();


    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new Error(ResponseMessage.USER_NOT_FOUND);
    }


    if (user.is_verified) {
      throw new Error("Email already verified. Please login.");
    }

    await this.otpRepository.invalidatePreviousOtps(user.id);


    const otpCode = OtpUtil.generateOtp();
    const otpExpiry = OtpUtil.getOtpExpiry();

    await this.otpRepository.create(user, otpCode, otpExpiry);


    await this.emailService.sendOtpEmail(user.user_email, user.first_name, otpCode);

    return {
      success: true,
      message: ResponseMessage.OTP_SENT,
      statusCode: HttpStatus.OK,
    };
  }


  













