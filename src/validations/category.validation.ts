import Joi, { string, valid } from "joi";
import { validationMessages } from "./messages";

const namePattern = /^[a-zA-Z\s]+$/;

export const categoryValidation = {
  createcategory: Joi.object({
    category_name: Joi.string()
      .required()
      .min(2)
      .max(40)
      .pattern(namePattern)
      .trim()
      .messages({
        "string.empty": validationMessages.CATEGORY.NAME.EMPTY,
        "string.min": validationMessages.CATEGORY.NAME.MIN,
        "string.mix": validationMessages.CATEGORY.NAME.MAX,
        "string.pattern.base": validationMessages.CATEGORY.NAME.PATTERN,
        "any.required": validationMessages.CATEGORY.NAME.REQUIRED,
      }),
  }),

  updateCategory: Joi.object({
    category_name: Joi.string()
      .optional()
      .min(2)
      .max(50)
      .pattern(namePattern)
      .trim()
      .messages({
        "string.empty": validationMessages.CATEGORY.NAME.EMPTY,
        "string.min": validationMessages.CATEGORY.NAME.MIN,
        "string.max": validationMessages.CATEGORY.NAME.MAX,
        "string.pattern.base": validationMessages.CATEGORY.NAME.PATTERN,
      }),
  }),
};




