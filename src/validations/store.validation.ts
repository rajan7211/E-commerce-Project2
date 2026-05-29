import Joi from "joi";
import { validationMessages } from "./messages";

const namePattern = /^[a-zA-Z0-9\s\-_]+$/;

export const storeValidation = {
  createStore: Joi.object({
    store_name: Joi.string()
      .required()
      .min(2)
      .max(100)
      .pattern(namePattern)
      .trim()
      .messages({
        "string.empty": validationMessages.STORE.NAME.EMPTY,
        "string.min": validationMessages.STORE.NAME.MIN,
        "string.max": validationMessages.STORE.NAME.MAX,
        "string.pattern.base": validationMessages.STORE.NAME.PATTERN,
        "any.required": validationMessages.STORE.NAME.REQUIRED,
      }),


    store_description: Joi.string()
      .optional()
      .max(1000)
      .trim()
      .allow(null, "")
      .messages({
        "string.max": validationMessages.STORE.DESCRIPTION.MAX,
      }),

    store_logo: Joi.string()
      .optional()
      .uri()
      .allow(null, "")
      .messages({
        "string.uri": validationMessages.STORE.LOGO.INVALID,
      }),
  }),

  updateStore: Joi.object({
    store_name: Joi.string()
      .optional()
      .min(2)
      .max(100)
      .pattern(namePattern)
      .trim()
      .messages({
        "string.empty": validationMessages.STORE.NAME.EMPTY,
        "string.min": validationMessages.STORE.NAME.MIN,
        "string.max": validationMessages.STORE.NAME.MAX,
        "string.pattern.base": validationMessages.STORE.NAME.PATTERN,
      }),

    store_description: Joi.string()
      .optional()
      .max(1000)
      .trim()
      .allow(null, "")
      .messages({
        "string.max": validationMessages.STORE.DESCRIPTION.MAX,
      }),

    store_logo: Joi.string()
      .optional()
      .uri()
      .allow(null, "")
      .messages({
        "string.uri": validationMessages.STORE.LOGO.INVALID,
      }),
  }),
};










