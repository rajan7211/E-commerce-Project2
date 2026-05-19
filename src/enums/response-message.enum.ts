export enum ResponseMessage {
  REGISTRATION_SUCCESS = "Registration successful. Please check your email for OTP verification.",
  EMAIL_ALREADY_EXISTS = "Email already registered.",
  EMAIL_NOT_FOUND = "Email not found.",
  

  OTP_SENT = "OTP sent successfully to your email.",
  OTP_VERIFIED = "Email verified successfully. You can now login.",
  OTP_INVALID = "Invalid OTP code.",
  OTP_EXPIRED = "OTP has expired. Please request a new one.",
  OTP_ALREADY_USED = "OTP has already been used.",
  OTP_REQUIRED = "OTP is required.",

  LOGIN_SUCCESS = "Login successful.",
  EMAIL_NOT_VERIFIED = "Please verify your email first.",
  INVALID_CREDENTIALS = "Invalid email or password.",
  USER_NOT_FOUND = "User not found.",
  
  
  VALIDATION_ERROR = "Validation error.",
  PASSWORDS_DO_NOT_MATCH = "Passwords do not match.",
  PASSWORD_REQUIRED = "Password is required.",
  

  INTERNAL_ERROR = "Internal server error.",
  SUCCESS = "Success.",
}

















