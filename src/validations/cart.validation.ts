import Joi from "joi";
import { validationMessages } from "./messages";

export const cartValidation = {
  addToCart: Joi.object({
    product_id: Joi.number()
      .required()
      .integer()
      .positive()
      .messages({
        "number.base": validationMessages.PRODUCT.CATEGORY_ID.INVALID,
        "number.integer": validationMessages.PRODUCT.CATEGORY_ID.INTEGER,
        "number.positive": validationMessages.PRODUCT.CATEGORY_ID.POSITIVE,
        "any.required": validationMessages.PRODUCT.CATEGORY_ID.REQUIRED,
      }),

    quantity: Joi.number()
      .required()
      .integer()
      .min(1)
      .messages({
        "number.base": validationMessages.PRODUCT.STOCK.INVALID,
        "number.integer": validationMessages.PRODUCT.STOCK.INTEGER,
        "number.min": validationMessages.CART.QUANTITY.MIN,
        "any.required": validationMessages.CART.QUANTITY.REQUIRED,
      }),
  }),

  updateCartItem: Joi.object({
    quantity: Joi.number()
      .required()
      .integer()
      .min(1)
      .messages({
        "number.base": validationMessages.PRODUCT.STOCK.INVALID,
        "number.integer": validationMessages.PRODUCT.STOCK.INTEGER,
        "number.min": validationMessages.CART.QUANTITY.MIN,
        "any.required": validationMessages.CART.QUANTITY.REQUIRED,
      }),
  }),
};












