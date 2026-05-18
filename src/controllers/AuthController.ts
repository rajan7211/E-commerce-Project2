import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import {
  RegisterRequestBody,
  LoginRequestBody,
  VerifyOtpRequestBody,
  ResendOtpRequestBody,
} from "../Interfaces/auth.interface";

const authService = new AuthService();

export class AuthController {
  /**
   * Register new user
   * POST /auth/register
   */
  static async register(req: Request, res: Response) {
    try {
      const data: RegisterRequestBody = req.body;

      const result = await authService.register(data);

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.message === ResponseMessage.EMAIL_ALREADY_EXISTS 
        ? HttpStatus.CONFLICT 
        : HttpStatus.BAD_REQUEST;

      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Verify OTP
   * POST /auth/verify-otp
   */
  static async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp }: VerifyOtpRequestBody = req.body;

      const result = await authService.verifyOtp(email, otp);

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Resend OTP
   * POST /auth/resend-otp
   */
  static async resendOtp(req: Request, res: Response) {
    try {
      const { email }: ResendOtpRequestBody = req.body;

      const result = await authService.resendOtp(email);

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Login user
   * POST /auth/login
   */
  static async login(req: Request, res: Response) {
    try {
      const data: LoginRequestBody = req.body;

      const result = await authService.login(data);

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.message === ResponseMessage.EMAIL_NOT_VERIFIED
        ? HttpStatus.FORBIDDEN
        : error.message === ResponseMessage.INVALID_CREDENTIALS
        ? HttpStatus.UNAUTHORIZED
        : HttpStatus.BAD_REQUEST;

      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }
}








