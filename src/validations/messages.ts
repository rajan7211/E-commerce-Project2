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
    PATTERN:
      "Password must contain uppercase, lowercase, number, and special character",
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

  // category msgs
  CATEGORY: {
    NAME: {
      EMPTY: "Category name is required.",
      MIN: "Category name must be at least 2 characters.",
      MAX: "Category name must not exceed 40 characters.",
      PATTERN: "Category name can only contain letters and spaces.",
      REQUIRED: "Category name is required.",
    },
  },

  // products msgs

  PRODUCT: {
    NAME: {
      EMPTY: "Product name is required.",
      MIN: "Product name must be at least 2 characters.",
      MAX: "Product name must not exceed 100 characters.",
      PATTERN:
        "Product name can only contain letters, numbers, spaces, hyphens, and underscores.",
      REQUIRED: "Product name is required.",
    },
    PRICE: {
      EMPTY: "Product price is required.",
      INVALID: "Product price must be a valid number.",
      POSITIVE: "Product price must be greater than 0.",
      REQUIRED: "Product price is required.",
    },
    DESCRIPTION: {
      MAX: "Product description must not exceed 1000 characters.",
    },
    STOCK: {
      EMPTY: "Stock quantity is required.",
      INVALID: "Stock must be a valid number.",
      INTEGER: "Stock must be an integer.",
      MIN: "Stock cannot be negative.",
      REQUIRED: "Stock quantity is required.",
    },
    CATEGORY_ID: {
      EMPTY: "Category ID is required.",
      INVALID: "Category ID must be a valid number.",
      INTEGER: "Category ID must be an integer.",
      POSITIVE: "Category ID must be greater than 0.",
      REQUIRED: "Category ID is required.",
    },
    STORE_ID: {
      EMPTY: "Store ID is required.",
      INVALID: "Store ID must be a valid number.",
      INTEGER: "Store ID must be an integer.",
      POSITIVE: "Store ID must be greater than 0.",
      REQUIRED: "Store ID is required.",
    },
  },
  // store msg

  STORE: {
    NAME: {
      EMPTY: "Store name is required.",
      MIN: "Store name must be at least 2 characters.",
      MAX: "Store name must not exceed 100 characters.",
      PATTERN:
        "Store name can only contain letters, numbers, spaces, and underscores.",
      REQUIRED: "Store name is required.",
    },
    DESCRIPTION: {
      MAX: "Store description must not exceed 1000 characters.",
    },
    LOGO: {
      INVALID: "Store logo must be a valid URL.",
    },
  },

};




