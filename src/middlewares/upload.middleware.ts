import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadMultiple } from "../config/multer.config";
import { HttpStatus } from "../enums/http-status.enum";
import { createError } from "./error-handler.middleware";

export const uploadProductImages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadMultiple(req, res, (error: any) => {
    if (error) {
      console.error("Multer upload error:", error);

      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return next(
            createError("File size too large. Max 5MB allowed.", HttpStatus.BAD_REQUEST)
          );
        }
        if (error.code === "LIMIT_FILE_COUNT") {
          return next(
            createError("Too many files. Max 10 images allowed.", HttpStatus.BAD_REQUEST)
          );
        }
      }

      return next(createError(error.message || "File upload failed", HttpStatus.BAD_REQUEST));
    }

    next();
  });
};





