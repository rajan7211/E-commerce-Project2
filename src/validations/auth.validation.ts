import Joi from "joi";
import { validationMessages } from "./messages";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpPattern = /^\d{6}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const namePattern = /^[a-zA-Z\s]+$/;

export const authValidation = {
  register: Joi.object({
    first_name: Joi.string()
      .required()
      .min(2)
      .max(50)
      .pattern(namePattern)
      .trim()
      .messages({
        "string.empty": validationMessages.NAME.firstName.EMPTY,
        "string.min": validationMessages.NAME.firstName.MIN,
        "string.max": validationMessages.NAME.firstName.MAX,
        "string.pattern.base": validationMessages.NAME.firstName.PATTERN,
        "any.required": validationMessages.NAME.firstName.REQUIRED,
      }),

    last_name: Joi.string()
      .required()
      .min(2)
      .max(50)
      .pattern(namePattern)
      .trim()
      .messages({
        "string.empty": validationMessages.NAME.lastName.EMPTY,
        "string.min": validationMessages.NAME.lastName.MIN,
        "string.max": validationMessages.NAME.lastName.MAX,
        "string.pattern.base": validationMessages.NAME.lastName.PATTERN,
        "any.required": validationMessages.NAME.lastName.REQUIRED,
      }),

    email: Joi.string()
      .required()
      .email()
      .pattern(emailPattern)
      .lowercase()
      .trim()
      .messages({
        "string.empty": validationMessages.EMAIL.EMPTY,
        "string.email": validationMessages.EMAIL.INVALID,
        "string.pattern.base": validationMessages.EMAIL.INVALID,
        "any.required": validationMessages.EMAIL.REQUIRED,
      }),

    password: Joi.string()
      .required()
      .min(8)
      .max(100)
      .pattern(passwordPattern)
      .messages({
        "string.empty": validationMessages.PASSWORD.EMPTY,
        "string.min": validationMessages.PASSWORD.MIN,
        "string.max": validationMessages.PASSWORD.MAX,
        "string.pattern.base": validationMessages.PASSWORD.PATTERN,
        "any.required": validationMessages.PASSWORD.REQUIRED,
      }),

    confirm_password: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({
        "string.empty": validationMessages.CONFIRMPASSWORD.EMPTY,
        "any.only": validationMessages.CONFIRMPASSWORD.MISMATCH,
        "any.required": validationMessages.CONFIRMPASSWORD.REQUIRED,
      }),

    role: Joi.string()
      .valid("customer", "seller", "admin")
      .optional()
      .default("customer"),
  }),

  login: Joi.object({
    email: Joi.string()
      .required()
      .email()
      .pattern(emailPattern)
      .lowercase()
      .trim()
      .messages({
        "string.empty": validationMessages.EMAIL.EMPTY,
        "string.email": validationMessages.EMAIL.INVALID,
        "string.pattern.base": validationMessages.EMAIL.INVALID,
        "any.required": validationMessages.EMAIL.REQUIRED,
      }),

    password: Joi.string()
      .required()
      .messages({
        "string.empty": validationMessages.PASSWORD.EMPTY,
        "any.required": validationMessages.PASSWORD.REQUIRED,
      }),
  }),

  verifyOtp: Joi.object({
    email: Joi.string()
      .required()
      .email()
      .pattern(emailPattern)
      .lowercase()
      .trim()
      .messages({
        "string.empty": validationMessages.EMAIL.EMPTY,
        "string.email": validationMessages.EMAIL.INVALID,
        "string.pattern.base": validationMessages.EMAIL.INVALID,
        "any.required": validationMessages.EMAIL.REQUIRED,
      }),

    otp: Joi.string()
      .required()
      .length(6)
      .pattern(otpPattern)
      .messages({
        "string.empty": validationMessages.OTP.EMPTY,
        "string.length": validationMessages.OTP.LENGTH,
        "string.pattern.base": validationMessages.OTP.INVALID,
        "any.required": validationMessages.OTP.REQUIRED,
      }),
  }),

  resendOtp: Joi.object({
    email: Joi.string()
      .required()
      .email()
      .pattern(emailPattern)
      .lowercase()
      .trim()
      .messages({
        "string.empty": validationMessages.EMAIL.EMPTY,
        "string.email": validationMessages.EMAIL.INVALID,
        "string.pattern.base": validationMessages.EMAIL.INVALID,
        "any.required": validationMessages.EMAIL.REQUIRED,
      }),
  }),
};














