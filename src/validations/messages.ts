export const validationMessages = {
  EMAIL: {
    EMPTY: "Email is required",
    INVALID: "Please enter a valid email address",
    REQUIRED: "Email is required",
    REGISTERTED: "Email already registered",
    NOTFOUND: "Email not found",
  },

  OTP: {
    EMPTY: "OTP is required",
    INVALID: "OTP must be 6 digits",
    LENGTH: "OTP must be exactly 6 digits",
    REQUIRED: "OTP is required",
    EXPIRED: "OTP has expired",
    INVALIDOTP: "Invalid OTP",
    ALREADYSENT: "OTP already sent. Please wait or check your email.",
  },

  NAME: {
    firstName: {
      EMPTY: "First name is required",
      MIN: "First name must be at least 2 characters",
      MAX: "First name must not exceed 50 characters",
      PATTERN: "First name can only contain letters and spaces",
      REQUIRED: "First name is required",
    },
    lastName: {
      EMPTY: "Last name is required",
      MIN: "Last name must be at least 2 characters",
      MAX: "Last name must not exceed 50 characters",
      PATTERN: "Last name can only contain letters and spaces",
      REQUIRED: "Last name is required",
    },
  },

  PASSWORD: {
    EMPTY: "Password is required",
    MIN: "Password must be at least 8 characters",
    MAX: "Password must not exceed 100 characters",
    REQUIRED: "Password is required",
    mismatch: "Passwords do not match",
    PATTERN: "Password must contain uppercase, lowercase, number, and special character",
  },

  CONFIRMPASSWORD: {
    EMPTY: "Confirm password is required",
    MISMATCH: "Passwords do not match",
    REQUIRED: "Confirm password is required",
  },

  GENERAL: {
    validationFailed: "Validation failed",
    success: "Success",
    error: "Error",
    EMAIL_NOT_VERIFIED: "Please verify your email first",
    INVALID_CREDENTIALS: "Invalid email or password",
  },
};
























