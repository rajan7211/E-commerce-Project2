import Joi from "joi";

export const addressValidation = {
  createAddress: Joi.object({
    street: Joi.string()
      .required()
      .min(5)
      .messages({
        "string.empty": "Street address is required.",
        "string.min": "Street address must be at least 5 characters.",
        "any.required": "Street address is required.",
      }),
    city: Joi.string()
      .required()
      .messages({
        "string.empty": "City is required.",
        "any.required": "City is required.",
      }),
    state: Joi.string().allow(null, ""),
    postal_code: Joi.string().allow(null, ""),
    country: Joi.string()
      .required()
      .messages({
        "string.empty": "Country is required.",
        "any.required": "Country is required.",
      }),
  }),

  updateAddress: Joi.object({
    street: Joi.string().min(5).messages({
      "string.min": "Street address must be at least 5 characters.",
    }),
    city: Joi.string().messages({
      "string.empty": "City cannot be empty.",
    }),
    state: Joi.string().allow(null, ""),
    postal_code: Joi.string().allow(null, ""),
    country: Joi.string().messages({
      "string.empty": "Country cannot be empty.",
    }),
  }).min(1),
};
