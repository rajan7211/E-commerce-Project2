import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createError } from "./error-handler.middleware";
import { ResponseMessage } from "../enums/response-message.enum";
import { HttpStatus } from "../enums/http-status.enum";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    // Ensure you have JWT_SECRET in your .env file
    const secret = process.env.JWT_SECRET || "your_secret_key"; 

    const decoded = jwt.verify(token, secret) as any;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      next(createError(ResponseMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED));
    } else {
      next(error);
    }
  }
};



