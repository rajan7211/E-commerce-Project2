import {
  findByEmail as findUserByEmail,
  findById as findUserById,
  saveForgotPasswordOtp as saveForgotPasswordOtpRepo,
  verifyForgotPasswordOtp as verifyForgotPasswordOtpRepo,
  resetPassword as resetPasswordRepo,
  clearForgotPasswordOtp as clearForgotPasswordOtpRepo,
} from "../repositories/user.repository";
import {
  sendForgotPasswordOtpEmail,
  sendPasswordResetSuccessEmail,
} from "./EmailService";
import { getnerateOtp, isOtpExpired } from "../utils/otp.util";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";
import { ServiceResponse } from "../Interfaces/service-response.interface";
import { createError } from "../middlewares/error-handler.middleware";
import { ForgotPasswordInterface } from "../Interfaces/forgot-password.interface";


export const forgotPassword = async (
  data: ForgotPasswordRequestBody
): Promise<ServiceResponse<ForgotPasswordResponse>> => {
  const normalizedEmail = data.email.toLowerCase().trim();

  // Find user
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw createError(ResponseMessage.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  try {
    // Generate OTP
    const otpCode = getnerateOtp();

    // Set 15 minutes expiry for forgot password
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 15);

    // Save OTP to database
    await saveForgotPasswordOtpRepo(user.id, otpCode, expiryTime);

    // Send OTP email
    await sendForgotPasswordOtpEmail(user.user_email, user.first_name, otpCode);

    return {
      success: true,
      message: ResponseMessage.FORGOT_PASSWORD_OTP_SENT,
      data: {
        message: ResponseMessage.FORGOT_PASSWORD_OTP_SENT,
        email: user.user_email,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    throw createError(
      ResponseMessage.INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Verify Forgot Password OTP Service
 * Step 2 of the forgot password flow
 * Validates OTP and marks it as verified
 */
export const verifyForgotPasswordOtp = async (
  data: VerifyForgotPasswordOtpRequestBody
): Promise<ServiceResponse<VerifyForgotPasswordOtpResponse>> => {
  const normalizedEmail = data.email.toLowerCase().trim();
  const { otp } = data;

  // Find user
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw createError(ResponseMessage.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  // Check if OTP exists
  if (!user.forgot_password_otp) {
    throw createError(
      ResponseMessage.FORGOT_PASSWORD_OTP_INVALID,
      HttpStatus.BAD_REQUEST
    );
  }

  // Check if OTP expired
  if (isOtpExpired(user.forgot_password_otp_expires_at!)) {
    // Clear expired OTP
    await clearForgotPasswordOtpRepo(user.id);
    throw createError(
      ResponseMessage.FORGOT_PASSWORD_OTP_EXPIRED,
      HttpStatus.BAD_REQUEST
    );
  }

  // Verify OTP
  const isOtpValid = await verifyForgotPasswordOtpRepo(user.id, otp);
  if (!isOtpValid) {
    throw createError(
      ResponseMessage.FORGOT_PASSWORD_OTP_INVALID,
      HttpStatus.BAD_REQUEST
    );
  }

  return {
    success: true,
    message: ResponseMessage.FORGOT_PASSWORD_OTP_VERIFIED,
    data: {
      message: ResponseMessage.FORGOT_PASSWORD_OTP_VERIFIED,
      email: user.user_email,
      verified: true,
    },
    statusCode: HttpStatus.OK,
  };
};

/**
 * Reset Password Service
 * Step 3 of the forgot password flow
 * Updates password after OTP verification
 */
export const resetPassword = async (
  data: ResetPasswordRequestBody
): Promise<ServiceResponse<ResetPasswordResponse>> => {
  const normalizedEmail = data.email.toLowerCase().trim();

  // Find user
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw createError(ResponseMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  // Check if OTP is verified
  if (!user.forgot_password_otp_verified) {
    throw createError(
      ResponseMessage.OTP_NOT_VERIFIED,
      HttpStatus.BAD_REQUEST
    );
  }

  try {
    await resetPasswordRepo(user.id, data.new_password);

    // Send success email
    await sendPasswordResetSuccessEmail(
      user.user_email,
      user.first_name
    ).catch((err) => console.log("Password reset success email error:", err));

    return {
      success: true,
      message: ResponseMessage.PASSWORD_RESET_SUCCESS,
      data: {
        message: ResponseMessage.PASSWORD_RESET_SUCCESS,
        email: user.user_email,
      },
      statusCode: HttpStatus.OK,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    throw createError(
      ResponseMessage.INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};


