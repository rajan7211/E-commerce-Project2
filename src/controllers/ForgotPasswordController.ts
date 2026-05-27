import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/error-handler.middleware";
import {
  forgotPassword as forgotPasswordService,
  verifyForgotPasswordOtp as verifyForgotPasswordOtpService,
  resetPassword as resetPasswordService,
} from "../services/ForgotPasswordService";





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















