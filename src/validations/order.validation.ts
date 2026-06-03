import Joi from "joi";
import { validationMessages } from "./messages";

export const orderValidation = {
  createOrder: Joi.object({
    shipping_address: Joi.string()
      .required()
      .min(5)
      .messages({
        "string.empty": validationMessages.STORE.DESCRIPTION.MAX, 
        "string.min": "Shipping address is too short",
        "any.required": "Shipping address is required",
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









