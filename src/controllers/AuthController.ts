import { Request, Response } from "express";
import { register as registerService, login as loginService } from "../services/AuthService";
import { verifyOtp as verifyOtpService, resendOtp as resendOtpService } from "../services/OtpService";
import {
  RegisterRequestBody,
  LoginRequestBody,
  VerifyOtpRequestBody,
  ResendOtpRequestBody,
} from "../Interfaces/auth.interface";
import { changePassword as changePasswordService, logout as logoutService } from "../services/AuthService";
import { ChangePasswordRequestBody } from "../Interfaces/auth.interface";

import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import { createError } from "../middlewares/error-handler.middleware";

// register user

export const register = async (req: Request, res: Response) => {
  try {
    const data: RegisterRequestBody = req.body;

    const result = await registerService(data);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};


// verify otp 

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp }: VerifyOtpRequestBody = req.body;

    const result = await verifyOtpService(email, otp);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};


// resend otp

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email }: ResendOtpRequestBody = req.body;

    const result = await resendOtpService(email);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// login user

export const login = async (req: Request, res: Response) => {
  try {
    const data: LoginRequestBody = req.body;

    const result = await loginService(data);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};


// change password 

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw createError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const data: ChangePasswordRequestBody = req.body;
    const result = await changePasswordService(userId, data);

    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// logout

export const logout = async (req: Request, res: Response) => {
  try {
    const result = await logoutService();
    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};








