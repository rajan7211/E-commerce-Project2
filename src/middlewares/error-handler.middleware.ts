import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../enums/http-status.enum";
import { ResponseMessage } from "../enums/response-message.enum";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Token expired",
    });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ResponseMessage.INTERNAL_ERROR,
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};














