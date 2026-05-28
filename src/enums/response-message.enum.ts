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

  FORGOT_PASSWORD_OTP_SENT = "Password reset OTP has been sent to your email.",
  FORGOT_PASSWORD_OTP_INVALID = "Invalid OTP code.",
  FORGOT_PASSWORD_OTP_EXPIRED = "OTP has expired. Please request a new one.",
  FORGOT_PASSWORD_OTP_VERIFIED = "OTP verified successfully.",
  PASSWORD_RESET_SUCCESS = "Password has been reset successfully. You can now login.",
  OTP_NOT_VERIFIED = "Please verify OTP first.",
  CANNOT_RESET_PASSWORD_WITHOUT_OTP = "Password reset requires OTP verification.",

  PASSWORD_CHANGED_SUCCESS = "Password changed successfully.",
  LOGOUT_SUCCESS = "Logged out successfully.",
  CURRENT_PASSWORD_INVALID = "Current password is incorrect.",
  UNAUTHORIZED = "Unauthorized access.",
  INVALID_TOKEN = "Invalid or expired token.",

  CATEGORY_CREATED_SUCCESS = "Category created successfully.",
  CATEGORY_UPDATED_SUCCESS = "Category updated successfully.",
  CATEGORY_DELETED_SUCCESS = "Category deleted successfully.",
  CATEGORY_NOT_FOUND = "Category not found.",
  CATEGORY_ALREADY_EXISTS = "Category already exists.",
  CANNOT_DELETE_CATEGORY_WITH_PRODUCTS = "Cannot delete category with associated products.",

  PRODUCT_CREATED_SUCCESS = "Product created successfully.",
  PRODUCT_UPDATED_SUCCESS = "Product updated successfully.",
  PRODUCT_DELETED_SUCCESS = "Product deleted successfully.",
  PRODUCT_NOT_FOUND = "Product not found.",
  PRODUCT_OUT_OF_STOCK = "Product is out of stock.",
  INVALID_STOCK_QUANTITY = "Invalid stock quantity.",
  INVALID_PRICE = "Invalid product price.",
  STORE_NOT_FOUND = "Store not found.",
  UNAUTHORIZED_PRODUCT_ACCESS = "You can only manage your own products.",


  VALIDATION_ERROR = "Validation error.",
  PASSWORDS_DO_NOT_MATCH = "Passwords do not match.",
  PASSWORD_REQUIRED = "Password is required.",

  INTERNAL_ERROR = "Internal server error.",
  SUCCESS = "Success.",
}




