export interface ForgotPasswordRequestBody {
  email: string;
}

export interface VerifyForgotPasswordOtpRequestBody {
  email: string;
  otp: string;
}

export interface ResetPasswordRequestBody {
  email: string;
  new_password: string;
  confirm_password: string;
}

export interface ForgotPasswordResponse {
  message: string;
  email: string;
}

export interface VerifyForgotPasswordOtpResponse {
  message: string;
  email: string;
  verified: boolean;
}

export interface ResetPasswordResponse {
  message: string;
  email: string;
}







