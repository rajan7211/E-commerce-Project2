import { UserRole } from "../utils/enums";

export interface RegisterRequestBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role?: UserRole;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface VerifyOtpRequestBody {
  email: string;
  otp: string;
}

export interface ResendOtpRequestBody {
  email: string;
}

export interface UserPayload {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  created_at: Date;
}

export interface RegisterResponse {
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
}


export interface OtpResponse {
  message: string;
  email: string;
}

export interface VerifyOtpResponse {
  message: string;
  email: string;
  verified: boolean;
}


export interface LoginResponse {
  user: UserPayload;
  tokens: {
    accessToken: string;
  };
}













