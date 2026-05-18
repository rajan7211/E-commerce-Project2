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

  /**
   * REGISTER FLOW
   * 1. Check if email exists
   * 2. Create user with is_verified = false
   * 3. Generate OTP
   * 4. Save OTP
   * 5. Send OTP email
   */
  async register(data: RegisterRequestBody): Promise<ServiceResponse<RegisterResponse>> {
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check if email already exists
    const emailExists = await this.userRepository.emailExists(normalizedEmail);
    if (emailExists) {
      throw new Error(ResponseMessage.EMAIL_ALREADY_EXISTS);
    }

    // Create user (password hashed by entity hook)
    const user = await this.userRepository.create({
      first_name: data.first_name,
      last_name: data.last_name,
      user_email: normalizedEmail,
      user_pass: data.password,
      role: data.role || UserRole.CUSTOMER,
    });

    // Generate OTP
    const otpCode = OtpUtil.generateOtp();
    const otpExpiry = OtpUtil.getOtpExpiry();

    // Save OTP
    await this.otpRepository.create(user, otpCode, otpExpiry);

    // Send OTP email
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

  /**
   * VERIFY OTP FLOW
   * 1. Find user by email
   * 2. Check if user exists
   * 3. Find valid OTP
   * 4. Validate OTP
   * 5. Mark OTP as used
   * 6. Set is_verified = true
   * 7. Send welcome email
   */
  async verifyOtp(email: string, otp: string): Promise<ServiceResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new Error(ResponseMessage.USER_NOT_FOUND);
    }

    // Check if already verified
    if (user.is_verified) {
      return {
        success: true,
        message: "Email already verified. You can login now.",
        statusCode: HttpStatus.OK,
      };
    }

    // Find valid OTP
    const otpRecord = await this.otpRepository.findValidOtp(user.id, otp);

    if (!otpRecord) {
      throw new Error(ResponseMessage.OTP_INVALID);
    }

    // Check if OTP is expired
    if (OtpUtil.isOtpExpired(otpRecord.expires_at)) {
      throw new Error(ResponseMessage.OTP_EXPIRED);
    }

    // Check if OTP is already used
    if (otpRecord.is_used) {
      throw new Error(ResponseMessage.OTP_ALREADY_USED);
    }

    // Mark OTP as used
    await this.otpRepository.markAsUsed(otpRecord.id);

    // Verify user
    await this.userRepository.verifyUser(user.id);

    // Send welcome email (non-blocking)
    this.emailService.sendWelcomeEmail(user.user_email, user.first_name).catch((err) =>
      console.error("Welcome email error:", err)
    );

    return {
      success: true,
      message: ResponseMessage.OTP_VERIFIED,
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * RESEND OTP FLOW
   * 1. Find user by email
   * 2. Check if already verified
   * 3. Invalidate old OTPs
   * 4. Generate new OTP
   * 5. Send new OTP email
   */
  async resendOtp(email: string): Promise<ServiceResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new Error(ResponseMessage.USER_NOT_FOUND);
    }

    // Check if already verified
    if (user.is_verified) {
      throw new Error("Email already verified. Please login.");
    }

    // Invalidate previous OTPs
    await this.otpRepository.invalidatePreviousOtps(user.id);

    // Generate new OTP
    const otpCode = OtpUtil.generateOtp();
    const otpExpiry = OtpUtil.getOtpExpiry();

    // Save new OTP
    await this.otpRepository.create(user, otpCode, otpExpiry);

    // Send OTP email
    await this.emailService.sendOtpEmail(user.user_email, user.first_name, otpCode);

    return {
      success: true,
      message: ResponseMessage.OTP_SENT,
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * LOGIN FLOW
   * 1. Find user by email
   * 2. Validate password
   * 3. Check if email is verified ⚠️
   * 4. Generate JWT token
   */
  async login(data: LoginRequestBody): Promise<ServiceResponse<LoginResponse>> {
    const normalizedEmail = data.email.toLowerCase().trim();

    // Find user
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new Error(ResponseMessage.INVALID_CREDENTIALS);
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(data.password);
    if (!isPasswordValid) {
      throw new Error(ResponseMessage.INVALID_CREDENTIALS);
    }

    // CRITICAL: Check if email is verified
    if (!user.is_verified) {
      throw new Error(ResponseMessage.EMAIL_NOT_VERIFIED);
    }

    // Generate JWT token
    const tokens = JwtUtil.generateTokens({
      userId: user.id,
      email: user.user_email,
      role: user.role,
      is_verified: user.is_verified,
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


