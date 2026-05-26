import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/error-handler.middleware";
import {
  forgotPassword as forgotPasswordService,
  verifyForgotPasswordOtp as verifyForgotPasswordOtpService,
  resetPassword as resetPasswordService,
} from "../services/ForgotPasswordService";

/**
 * Forgot Password Controller
 * Step 1: Send OTP to email
 * 
 * Handles: POST /auth/forgot-password
 * Body: { email: string }
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await forgotPasswordService(req.body);

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }
);

/**
 * Verify Forgot Password OTP Controller
 * Step 2: Verify OTP sent to user email
 * 
 * Handles: POST /auth/verify-forgot-password-otp
 * Body: { email: string, otp: string }
 */
export const verifyForgotPasswordOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await verifyForgotPasswordOtpService(req.body);

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }
);

/**
 * Reset Password Controller
 * Step 3: Reset password after OTP verification
 * 
 * Handles: POST /auth/reset-password
 * Body: { email: string, new_password: string, confirm_password: string }
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await resetPasswordService(req.body);

    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }
);


