import Joi from "joi";
import { validationMessages } from "./messages";

const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const otpPattern = /^\d{6}$/;

export const authValidation = {
  sendOtp: Joi.object({
    email: Joi.string().required().email().pattern(emailpattern).messages({
      "String.empty": validationMessages.EMAIL.EMPTY,
      "string.email": validationMessages.EMAIL.INVALID,
      "string.pattern.base": validationMessages.EMAIL.INVALID,
      "any.required": validationMessages.EMAIL.REQUIRED,
    }),
  }),

  verifyOtp: Joi.object({
    email: Joi.string().required().email().pattern(emailpattern).messages({
      "string.empty": validationMessages.EMAIL.EMPTY,
      "string.email": validationMessages.EMAIL.INVALID,
      "string.pattern.base": validationMessages.EMAIL.INVALID,
      "any.required": validationMessages.EMAIL.REQUIRED,
    }),

    otp: Joi
    .string()
    .required()
    .length(6)
    .pattern(otpPattern)
    .messages({
      "string.empty": validationMessages.OTP.EMPTY,
      "string.pattern.base": validationMessages.OTP.INVALID,
      "string.length": validationMessages.OTP.LENGTH,
      "any.required": validationMessages.OTP.REQUIRED,
    }),
  }),
};



























