import Joi from "joi";
import { validationMessages } from "./messages";

export const orderValidation = {
  createOrder: Joi.object({
    address_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        "number.base": "Address ID must be a number",
        "number.integer": "Address ID must be an integer",
        "number.positive": "Address ID must be a positive number",
        "any.required": "Address ID is required",
      }),

    payment_method: Joi.string()
      .required()
      .valid("cod", "card", "paypal")
      .messages({
        "string.empty": "Payment method is required",
        "any.only": "Invalid payment method",
        "any.required": "Payment method is required",
      }),
  }),
};









