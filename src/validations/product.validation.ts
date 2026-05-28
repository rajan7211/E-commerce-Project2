import Joi from "joi";
import { validationMessages } from "./messages";

const namePattern = /^[a-zA-Z0-9\s\-_]+$/;

export const productValidation = {
  createProduct: Joi.object({
    product_name: Joi.string()
      .required()
      .min(2)
      .max(100)
      .pattern(namePattern)
      .trim()
      .messages({
        "string.empty": validationMessages.PRODUCT.NAME.EMPTY,
        "string.min": validationMessages.PRODUCT.NAME.MIN,
        "string.max": validationMessages.PRODUCT.NAME.MAX,
        "string.pattern.base": validationMessages.PRODUCT.NAME.PATTERN,
        "any.required": validationMessages.PRODUCT.NAME.REQUIRED,
      }),

    product_price: Joi.number()
      .required()
      .positive()
      .precision(2)
      .messages({
        "number.base": validationMessages.PRODUCT.PRICE.INVALID,
        "number.positive": validationMessages.PRODUCT.PRICE.POSITIVE,
        "any.required": validationMessages.PRODUCT.PRICE.REQUIRED,
      }),

    product_description: Joi.string()
      .optional()
      .max(1000)
      .trim()
      .allow(null, "")
      .messages({
        "string.max": validationMessages.PRODUCT.DESCRIPTION.MAX,
      }),

    stock: Joi.number()
      .required()
      .integer()
      .min(0)
      .messages({
        "number.base": validationMessages.PRODUCT.STOCK.INVALID,
        "number.integer": validationMessages.PRODUCT.STOCK.INTEGER,
        "number.min": validationMessages.PRODUCT.STOCK.MIN,
        "any.required": validationMessages.PRODUCT.STOCK.REQUIRED,
      }),

    category_id: Joi.number()
      .required()
      .integer()
      .positive()
      .messages({
        "number.base": validationMessages.PRODUCT.CATEGORY_ID.INVALID,
        "number.integer": validationMessages.PRODUCT.CATEGORY_ID.INTEGER,
        "number.positive": validationMessages.PRODUCT.CATEGORY_ID.POSITIVE,
        "any.required": validationMessages.PRODUCT.CATEGORY_ID.REQUIRED,
      }),

    store_id: Joi.number()
      .required()
      .integer()
      .positive()
      .messages({
        "number.base": validationMessages.PRODUCT.STORE_ID.INVALID,
        "number.integer": validationMessages.PRODUCT.STORE_ID.INTEGER,
        "number.positive": validationMessages.PRODUCT.STORE_ID.POSITIVE,
        "any.required": validationMessages.PRODUCT.STORE_ID.REQUIRED,
      }),
  }),

  updateProduct: Joi.object({
    product_name: Joi.string()
      .optional()
      .min(2)
      .max(100)
      .pattern(namePattern)
      .trim()
      .messages({
        "string.empty": validationMessages.PRODUCT.NAME.EMPTY,
        "string.min": validationMessages.PRODUCT.NAME.MIN,
        "string.max": validationMessages.PRODUCT.NAME.MAX,
        "string.pattern.base": validationMessages.PRODUCT.NAME.PATTERN,
      }),

    product_price: Joi.number()
      .optional()
      .positive()
      .precision(2)
      .messages({
        "number.base": validationMessages.PRODUCT.PRICE.INVALID,
        "number.positive": validationMessages.PRODUCT.PRICE.POSITIVE,
      }),

    product_description: Joi.string()
      .optional()
      .max(1000)
      .trim()
      .allow(null, "")
      .messages({
        "string.max": validationMessages.PRODUCT.DESCRIPTION.MAX,
      }),

    stock: Joi.number()
      .optional()
      .integer()
      .min(0)
      .messages({
        "number.base": validationMessages.PRODUCT.STOCK.INVALID,
        "number.integer": validationMessages.PRODUCT.STOCK.INTEGER,
        "number.min": validationMessages.PRODUCT.STOCK.MIN,
      }),

    category_id: Joi.number()
      .optional()
      .integer()
      .positive()
      .messages({
        "number.base": validationMessages.PRODUCT.CATEGORY_ID.INVALID,
        "number.integer": validationMessages.PRODUCT.CATEGORY_ID.INTEGER,
        "number.positive": validationMessages.PRODUCT.CATEGORY_ID.POSITIVE,
      }),
  }),
};





