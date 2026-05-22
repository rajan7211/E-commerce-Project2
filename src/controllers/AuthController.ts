import { Request, Response } from "express";
import { register as registerService, login as loginService } from "../services/AuthService";
import { verifyOtp as verifyOtpService, resendOtp as resendOtpService } from "../services/OtpService";
import {
  RegisterRequestBody,
  LoginRequestBody,
  VerifyOtpRequestBody,
  ResendOtpRequestBody,
} from "../Interfaces/auth.interface";


// REGISTER USER

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


// VERIFY OTP

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


// RESEND OTP

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

// LOGIN USER

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







