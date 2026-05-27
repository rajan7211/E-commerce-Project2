import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../enums/http-status.enum";
import { ResponseMessage } from "../enums/response-message.enum";


export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err.message || err);


  if (err.statusCode) {
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


  if (err.name === "QueryFailedError") {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "Database error",
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


export const createError = (message: string, statusCode: number) => {
  const error = new Error(message);
  (error as any).statusCode = statusCode;
  return error;
};







